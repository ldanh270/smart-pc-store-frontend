"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useRef } from "react";
import { type Product } from "@/types/product";
import { formatPrice } from "@/lib/utils";
import { useCartStore } from "@/stores/useCartStore";
import { useAuthStore } from "@/stores/useAuthStore";
import { ShoppingCart, Loader2, Zap } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface ProductCardProps {
	product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
	const [isAdding, setIsAdding] = useState(false);
	const isAddingRef = useRef(false);
	const addItem = useCartStore((state) => state.addItem);
	const accessToken = useAuthStore((state) => state.accessToken);
	const isLoggedIn = !!accessToken;

	const isOutOfStock = product.stockStatus === "Out of stock" || product.quantity === 0;

	const handleAddToCart = async (e: React.MouseEvent) => {
		e.preventDefault();
		e.stopPropagation();
		if (!isLoggedIn) {
			toast.info("Vui lòng đăng nhập để thêm vào giỏ hàng");
			return;
		}
		if (isAddingRef.current) return;
		isAddingRef.current = true;
		setIsAdding(true);
		await addItem(product.id, 1);
		setIsAdding(false);
		isAddingRef.current = false;
	};

	return (
		<Link
			href={`/san-pham/${product.slug}`}
			className="group relative flex flex-col overflow-hidden rounded-2xl border border-border/60 bg-card transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-primary/10 hover:border-primary/30"
		>
			{/* ── Image container ──────────────────────────────────────── */}
			<div className="relative aspect-square overflow-hidden bg-muted/40">
				<Image
					src={product.image}
					alt={product.name}
					fill
					sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
					className={cn(
						"object-cover transition-transform duration-500 group-hover:scale-110",
						isOutOfStock && "opacity-50 grayscale"
					)}
				/>

				{/* Gradient overlay on hover */}
				<div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

				{/* Badge — top left */}
				{product.badge && !isOutOfStock && (
					<span className="absolute left-3 top-3 rounded-full bg-primary px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-primary-foreground shadow-lg shadow-primary/30">
						{product.badge}
					</span>
				)}

				{/* Out of stock overlay */}
				{isOutOfStock && (
					<div className="absolute inset-0 flex items-center justify-center">
						<span className="rounded-full border-2 border-destructive/70 bg-background/80 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-destructive backdrop-blur-sm">
							Hết hàng
						</span>
					</div>
				)}

				{/* Add to cart — slides up on hover */}
				{!isOutOfStock && (
					<button
						onClick={handleAddToCart}
						disabled={isAdding}
						className={cn(
							"absolute bottom-0 left-0 right-0 flex items-center justify-center gap-2",
							"bg-primary/95 py-3 text-sm font-semibold text-primary-foreground backdrop-blur-sm",
							"translate-y-full transition-transform duration-300 group-hover:translate-y-0",
							"disabled:opacity-70"
						)}
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

			{/* ── Info ─────────────────────────────────────────────────── */}
			<div className="flex flex-1 flex-col gap-2 p-4">
				{/* Category */}
				<span className="text-[10px] font-semibold uppercase tracking-widest text-primary/80">
					{product.category || "Linh kiện"}
				</span>

				{/* Name */}
				<h3 className="line-clamp-2 text-sm font-semibold leading-snug text-foreground transition-colors group-hover:text-primary min-h-[2.5rem]">
					{product.name}
				</h3>

				{/* Price row */}
				<div className="mt-auto flex items-center justify-between pt-1">
					<div className="flex flex-col">
						<span className="font-mono text-base font-bold text-foreground">
							{formatPrice(product.price)}
						</span>
						{product.originalPrice && product.originalPrice > product.price && (
							<span className="font-mono text-xs text-muted-foreground line-through">
								{formatPrice(product.originalPrice)}
							</span>
						)}
					</div>

					{/* Discount badge */}
					{product.originalPrice && product.originalPrice > product.price && (
						<span className="flex items-center gap-0.5 rounded-full bg-green-500/10 px-2 py-0.5 text-[10px] font-bold text-green-600">
							<Zap className="h-2.5 w-2.5" />
							-{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
						</span>
					)}
				</div>
			</div>

			{/* ── Hover glow border ─────────────────────────────────────── */}
			<div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-primary/0 transition-all duration-300 group-hover:ring-primary/20" />
		</Link>
	);
}
