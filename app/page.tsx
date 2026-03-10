import { fetchProducts } from "@/lib/api/products";
import { fetchAllCategories } from "@/lib/api/categories";
import { mapBackendCategory } from "@/types/category";
import HeroSlider from "@/components/home/HeroSlider";
import CategoryGrid from "@/components/home/CategoryGrid";
import ProductShowcase from "@/components/home/ProductShowcase";

const CPU_KEYWORDS = /\bcpu\b/i;
const GPU_KEYWORDS = /\bgpu\b/i;

export default async function HomePage() {
	// 1. Lấy categories để tìm categoryId cho từng section
	const backendCategories = await fetchAllCategories();

	const categories = backendCategories
		.map(mapBackendCategory)
		.filter((c) => c.parentId != null);

	// 2. Tìm category CPU và GPU theo tên
	const cpuCategory = backendCategories.find((c) =>
		CPU_KEYWORDS.test(c.categoryName)
	);
	const gpuCategory = backendCategories.find((c) =>
		GPU_KEYWORDS.test(c.categoryName)
	);

	// 3. Fetch song song 3 section
	const [newProducts, cpuProducts, gpuProducts] = await Promise.all([
		// Sản phẩm mới: lấy các sản phẩm mới nhất (không lọc category)
		fetchProducts({ page: 1, size: 4 }),
		// CPU nổi bật
		fetchProducts({ categoryId: cpuCategory?.id, page: 1, size: 4 }),
		// GPU nổi bật
		fetchProducts({ categoryId: gpuCategory?.id, page: 1, size: 4 }),
	]);

	const cpuHref = cpuCategory
		? `/san-pham?categoryId=${cpuCategory.id}`
		: "/san-pham";
	const gpuHref = gpuCategory
		? `/san-pham?categoryId=${gpuCategory.id}`
		: "/san-pham";

	return (
		<main>
			<HeroSlider products={newProducts.slice(0, 4)} />

			<CategoryGrid categories={categories} />

			<ProductShowcase
				title="Sản Phẩm Mới"
				subtitle="Linh kiện và thiết bị mới nhất vừa cập bến"
				products={newProducts}
				viewAllHref="/san-pham"
			/>

			<ProductShowcase
				title="CPU Nổi Bật"
				subtitle="Bộ vi xử lý Intel & AMD hiệu năng cao"
				products={cpuProducts}
				viewAllHref={cpuHref}
			/>

			<ProductShowcase
				title="GPU Nổi Bật"
				subtitle="Card đồ họa NVIDIA & AMD mạnh mẽ cho gaming và đồ họa"
				products={gpuProducts}
				viewAllHref={gpuHref}
			/>
		</main>
	);
}
