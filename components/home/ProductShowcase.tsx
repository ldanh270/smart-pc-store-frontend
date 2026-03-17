import { type Product } from "@/types/product";
import SectionHeader from "@/components/shared/SectionHeader";
import ProductCard from "@/components/shared/ProductCard";

interface ProductShowcaseProps {
	title: string;
	subtitle?: string;
	products: Product[];
	viewAllHref: string;
}

export default function ProductShowcase({
	title,
	subtitle,
	products,
	viewAllHref,
}: ProductShowcaseProps) {
	if (products.length === 0) return null;

	return (
		<section className="relative py-16 md:py-20">
			{/* Subtle bg mesh for depth */}
			<div className="pointer-events-none absolute inset-0 bg-mesh-subtle" />

			<div className="relative mx-auto max-w-7xl px-4 lg:px-8">
				<SectionHeader
					title={title}
					subtitle={subtitle}
					viewAllHref={viewAllHref}
				/>

				<div className="grid grid-cols-2 gap-4 sm:gap-5 md:grid-cols-3 lg:grid-cols-4">
					{products.map((product, i) => (
						<div
							key={product.id}
							className="animate-in fade-in slide-in-from-bottom-3"
							style={{ animationDelay: `${i * 60}ms`, animationFillMode: "both" }}
						>
							<ProductCard product={product} />
						</div>
					))}
				</div>
			</div>
		</section>
	);
}
