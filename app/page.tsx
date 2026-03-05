import { fetchProducts } from "@/lib/api/products";
import { fetchAllCategories } from "@/lib/api/categories";
import { mapBackendCategory } from "@/types/category";
import HeroSlider from "@/components/home/HeroSlider";
import CategoryGrid from "@/components/home/CategoryGrid";
import ProductShowcase from "@/components/home/ProductShowcase";
import PromoBanner from "@/components/home/PromoBanner";

export default async function HomePage() {
	const [allProducts, backendCategories] = await Promise.all([
		fetchProducts({ size: 20 }),
		fetchAllCategories(),
	]);

	const categories = backendCategories
		.map(mapBackendCategory)
		.filter((c) => c.parentId != null);

	// Split products into sections
	const newProducts = allProducts.slice(0, 4);
	const gamingPCs = allProducts.slice(4, 8);
	const hotAccessories = allProducts.slice(8, 12);

	return (
		<main>
			<HeroSlider products={newProducts} />

			<CategoryGrid categories={categories} />

			<ProductShowcase
				title="Sản Phẩm Mới"
				subtitle="Linh kiện và thiết bị mới nhất vừa cập bến"
				products={newProducts}
				viewAllHref="/san-pham?sort=newest"
			/>

			<ProductShowcase
				title="PC Gaming Nổi Bật"
				subtitle="PC build sẵn hiệu năng cao, sẵn sàng chiến game"
				products={gamingPCs}
				viewAllHref="/pc-laptop/pc-gaming"
			/>

			<PromoBanner />

			<ProductShowcase
				title="Phụ Kiện Hot"
				subtitle="Bàn phím, chuột, tai nghe và màn hình được yêu thích"
				products={hotAccessories}
				viewAllHref="/phu-kien"
			/>

		</main>
	);
}
