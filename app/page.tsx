import { fetchProducts } from "@/lib/api/products";
import HeroSlider from "@/components/home/HeroSlider";
import CategoryGrid from "@/components/home/CategoryGrid";
import ProductShowcase from "@/components/home/ProductShowcase";
import PromoBanner from "@/components/home/PromoBanner";
import BlogPreview from "@/components/home/BlogPreview";

export default async function HomePage() {
	const allProducts = await fetchProducts({ size: 20 });

	// Split products into sections
	// First 4 products → "Sản Phẩm Mới"
	// Next 4 products → "PC Gaming Nổi Bật"
	// Next 4 products → "Phụ Kiện Hot"
	const newProducts = allProducts.slice(0, 4);
	const gamingPCs = allProducts.slice(4, 8);
	const hotAccessories = allProducts.slice(8, 12);

	return (
		<main>
			<HeroSlider />

			<CategoryGrid />

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

			<BlogPreview />
		</main>
	);
}
