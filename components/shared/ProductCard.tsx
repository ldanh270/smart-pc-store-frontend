"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { type Product } from "@/types/product";
import { formatPrice } from "@/lib/utils";
import { useCartStore } from "@/stores/useCartStore";
import { useAuthStore } from "@/stores/useAuthStore";
import { ShoppingCart, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface ProductCardProps {
	product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
	const hasDiscount =
		product.originalPrice && product.originalPrice > product.price;

	const [isAdding, setIsAdding] = useState(false);
	const addItem = useCartStore((state) => state.addItem);
	const accessToken = useAuthStore((state) => state.accessToken);
	const isLoggedIn = !!accessToken;

	const handleAddToCart = async (e: React.MouseEvent) => {
		e.preventDefault();
		e.stopPropagation();

		if (!isLoggedIn) {
			toast.info("Vui lòng đăng nhập để thêm vào giỏ hàng");
			return;
		}

		setIsAdding(true);
		await addItem(Number(product.id), 1);
		setIsAdding(false);
	};

	return (
		<Link
			href={`/san-pham/${product.slug}`}
			className="group relative flex flex-col overflow-hidden rounded-lg border border-border bg-card transition-all hover:shadow-lg hover:-translate-y-0.5"
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

				{/* Badge (Discount) */}
				{/* {product.originalPrice && product.originalPrice > product.price && (
					<span className="absolute left-2 top-2 rounded-sm bg-primary px-2 py-0.5 text-xs font-semibold text-primary-foreground shadow-sm">
						-{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
					</span>
				)} */}

				{/* Custom Badge if provided */}
				{!product.originalPrice && product.badge && (
					<span className="absolute left-2 top-2 rounded-sm bg-primary px-2 py-0.5 text-xs font-semibold text-primary-foreground shadow-sm">
						{product.badge}
					</span>
				)}

				{/* Out of stock overlay */}
				{(product.stockStatus === "Out of stock" || product.quantity === 0) && (
					<div className="absolute inset-0 flex items-center justify-center bg-background/50 backdrop-blur-[2px]">
						<span className="px-3 py-1.5 border-2 border-destructive text-destructive font-bold text-sm -rotate-15">
							HẾT HÀNG
						</span>
					</div>
				)}

				{/* Hover: Add to Cart overlay (only if in stock) */}
				{(product.stockStatus !== "Out of stock" && product.quantity !== 0) && (
					<button
						onClick={handleAddToCart}
						disabled={isAdding}
						className="absolute bottom-0 left-0 right-0 flex items-center justify-center gap-2 bg-primary/90 px-3 py-2.5 text-sm font-semibold text-primary-foreground opacity-0 backdrop-blur-sm transition-all duration-300 group-hover:opacity-100 hover:bg-primary disabled:opacity-70"
						aria-label="Thêm vào giỏ hàng"
					>
						{isAdding ? (
							<Loader2 className="h-4 w-4 animate-spin" />
						) : (
							<>
								<ShoppingCart className="h-4 w-4" />
								Thêm vào giỏ
							</>
						)}
					</button>
				)}
			</div>

			{/* Info */}
			<div className="flex flex-1 flex-col items-center justify-center gap-2 p-4 text-center">
				<span className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">
					{product.category}
				</span>

				<h3 className="line-clamp-2 text-sm font-semibold text-foreground transition-colors group-hover:text-primary min-h-10 flex items-center">
					{product.name}
				</h3>

				{/* Price */}
				<div className="mt-auto flex items-baseline gap-2">
					<span className="font-mono text-sm font-bold text-foreground">
						{formatPrice(product.price)}
					</span>
					{hasDiscount && (
						<span className="font-mono text-xs text-muted-foreground line-through decoration-muted-foreground/50">
							{formatPrice(product.originalPrice!)}
						</span>
					)}
				</div>
			</div>
		</Link>
	);
}
