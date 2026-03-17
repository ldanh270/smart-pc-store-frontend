import { fetchProducts } from "@/lib/api/products";
import { fetchAllCategories } from "@/lib/api/categories";
import { mapBackendCategory } from "@/types/category";

// Figma-based components
import FigmaHero from "@/components/home/FigmaHero";
import FeatureBar from "@/components/home/FeatureBar";
import ProductShowcase from "@/components/home/ProductShowcase";
import Top10Products from "@/components/home/Top10Products";
import BrandsList from "@/components/home/BrandsList";
import CategoryGrid from "@/components/home/CategoryGrid";

export default async function HomePage() {
	// Lấy categories
	const backendCategories = await fetchAllCategories();
	const categories = backendCategories
		.map(mapBackendCategory)
		.filter((c) => c.parentId != null);

	// Fetch song song các list sản phẩm để điền vào UI
	const [forYou, cheapest, top10Products] = await Promise.all([
		fetchProducts({ page: 1, size: 8 }), // Gợi ý cho bạn
		fetchProducts({ page: 1, size: 8, sort: "price,asc" }), // Cheapest
		fetchProducts({ page: 1, size: 10 }), // For Top 10
	]);

	return (
		<main className="pb-15">
			{/* 1. Intro / Hero Area */}
			<section className="mx-auto max-w-7xl px-6 lg:px-16 pb-16 pt-5">
				<FigmaHero />
			</section>

			{/* 2. Danh mục sản phẩm (Shop by Category) - Move up after Hero */}
			<CategoryGrid categories={categories} />

			{/* 3. Product Showcase (For You / Cheapest) */}
			<section className="mx-auto max-w-6xl px-6 lg:px-16 py-16">
				<ProductShowcase 
					forYou={forYou}
				/>
			</section>

			{/* 4. Features */}
			<section className="mx-auto max-w-6xl px-6 lg:px-16 py-16">
				<FeatureBar />
			</section>

			{/* 5. Top 10 Selected Products */}
			<section className="mx-auto max-w-6xl px-6 lg:px-16 py-16">
				<Top10Products products={top10Products} />
			</section>

			{/* 6. Brands / Các nhà cung cấp - Make it big */}
			<section className="py-16">
				<div className="mx-auto max-w-6xl px-6 lg:px-16">
					<BrandsList />
				</div>
			</section>
		</main>
	);
}
