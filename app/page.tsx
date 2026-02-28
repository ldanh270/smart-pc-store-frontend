import {
	NEW_PRODUCTS,
	GAMING_PCS,
	HOT_ACCESSORIES,
} from "@/configs/mock-data";
import HeroBanner from "@/components/home/HeroBanner";
import CategoryGrid from "@/components/home/CategoryGrid";
import ProductShowcase from "@/components/home/ProductShowcase";
import PromoBanner from "@/components/home/PromoBanner";
import BlogPreview from "@/components/home/BlogPreview";

export default function HomePage() {
	return (
		<main>
			<HeroBanner />

			<CategoryGrid />

			<ProductShowcase
				title="Sản Phẩm Mới"
				subtitle="Linh kiện và thiết bị mới nhất vừa cập bến"
				products={NEW_PRODUCTS}
				viewAllHref="/san-pham?sort=newest"
			/>

			<ProductShowcase
				title="PC Gaming Nổi Bật"
				subtitle="PC build sẵn hiệu năng cao, sẵn sàng chiến game"
				products={GAMING_PCS}
				viewAllHref="/pc-laptop/pc-gaming"
			/>

			<PromoBanner />

			<ProductShowcase
				title="Phụ Kiện Hot"
				subtitle="Bàn phím, chuột, tai nghe và màn hình được yêu thích"
				products={HOT_ACCESSORIES}
				viewAllHref="/phu-kien"
			/>

			<BlogPreview />
		</main>
	);
}
