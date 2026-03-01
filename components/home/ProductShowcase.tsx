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
	return (
		<section className="py-16">
			<div className="mx-auto max-w-7xl px-4 lg:px-8">
				<SectionHeader
					title={title}
					subtitle={subtitle}
					viewAllHref={viewAllHref}
				/>

				<div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
					{products.map((product) => (
						<ProductCard
							key={product.id}
							product={product}
						/>
					))}
				</div>
			</div>
		</section>
	);
}
