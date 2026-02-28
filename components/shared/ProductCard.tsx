import Image from "next/image";
import Link from "next/link";
import { type Product, formatPrice } from "@/configs/mock-data";

interface ProductCardProps {
	product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
	const hasDiscount =
		product.originalPrice && product.originalPrice > product.price;

	return (
		<Link
			href={`/san-pham/${product.slug}`}
			className="group flex flex-col overflow-hidden rounded-lg border border-border bg-card transition-all hover:shadow-lg hover:-translate-y-0.5"
		>
			{/* Image */}
			<div className="relative aspect-square overflow-hidden bg-secondary">
				<Image
					src={product.image}
					alt={product.name}
					fill
					sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
					className="object-cover transition-transform duration-300 group-hover:scale-105"
				/>

				{/* Badge */}
				{product.badge && (
					<span className="absolute left-2 top-2 rounded-md bg-primary px-2 py-0.5 text-xs font-semibold text-primary-foreground">
						{product.badge}
					</span>
				)}
			</div>

			{/* Info */}
			<div className="flex flex-1 flex-col gap-2 p-4">
				<span className="text-xs text-muted-foreground">
					{product.category}
				</span>

				<h3 className="line-clamp-2 text-sm font-semibold text-foreground transition-colors group-hover:text-primary">
					{product.name}
				</h3>

				{/* Price */}
				<div className="mt-auto flex items-baseline gap-2">
					<span className="font-mono text-base font-bold text-primary">
						{formatPrice(product.price)}
					</span>
					{hasDiscount && (
						<span className="font-mono text-xs text-muted-foreground line-through">
							{formatPrice(product.originalPrice!)}
						</span>
					)}
				</div>
			</div>
		</Link>
	);
}
