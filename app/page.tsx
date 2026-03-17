import { fetchProducts } from "@/lib/api/products";
import { fetchAllCategories } from "@/lib/api/categories";
import { mapBackendCategory } from "@/types/category";

// Figma-based components
import FigmaHero from "@/components/home/FigmaHero";
import FeatureBar from "@/components/home/FeatureBar";
import ProductTabsShowcase from "@/components/home/ProductTabsShowcase";
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
	const [bestDeals, forYou, editorsPick, top10Products] = await Promise.all([
		fetchProducts({ page: 0, size: 8 }),
		fetchProducts({ page: 1, size: 8 }), // Demo data for different tabs
		fetchProducts({ page: 2, size: 8 }), // Demo data for different tabs
		fetchProducts({ page: 0, size: 10 }), // For Top 10
	]);

	return (
		<main className="space-y-24 pb-24">
			{/* 1. Intro / Hero Area */}
			<section className="mx-auto max-w-7xl px-4 lg:px-8 mt-1">
				<FigmaHero />
			</section>

			{/* 2. Danh mục sản phẩm (Shop by Category) - Move up after Hero */}
			<CategoryGrid categories={categories} />

			{/* 3. Product Showcase (Best Deals / For You / Editors Pick) */}
			<section className="mx-auto max-w-7xl px-4 lg:px-8">
				<ProductTabsShowcase 
					bestDeals={bestDeals}
					forYou={forYou}
					editorsPick={editorsPick}
				/>
			</section>

			{/* 4. Features */}
			<section className="mx-auto max-w-7xl px-4 lg:px-8">
				<FeatureBar />
			</section>

			{/* 5. Top 10 Selected Products */}
			<section className="mx-auto max-w-7xl px-4 lg:px-8">
				<Top10Products products={top10Products} />
			</section>

			{/* 6. Brands / Các nhà cung cấp - Make it big */}
			<section className="border-y border-border/40 bg-muted/20 py-20">
				<div className="mx-auto max-w-7xl px-4 lg:px-8">
					<BrandsList />
				</div>
			</section>
		</main>
	);
}
