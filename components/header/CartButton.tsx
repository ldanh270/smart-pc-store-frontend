"use client";

import { useEffect } from "react";
import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { useCartStore } from "@/stores/useCartStore";
import { useAuthStore } from "@/stores/useAuthStore";
import { cn } from "@/lib/utils";

export default function CartButton() {
	const totalItems = useCartStore((state) => state.totalItems);
	const fetchCart = useCartStore((state) => state.fetchCart);
	const accessToken = useAuthStore((state) => state.accessToken);

	useEffect(() => {
		if (accessToken) fetchCart();
	}, [accessToken, fetchCart]);

	return (
		<Link
			href="/gio-hang"
			className={cn(
				"group relative flex h-9 w-9 items-center justify-center rounded-lg",
				"border border-border/60 bg-muted/40 text-muted-foreground",
				"transition-all duration-200 hover:border-primary/40 hover:bg-primary/8 hover:text-primary",
			)}
			aria-label="Giỏ hàng"
		>
			<ShoppingBag className="size-4 transition-transform group-hover:scale-110" />

			{/* Badge */}
			<span
				className={cn(
					"absolute -right-1.5 -top-1.5 flex min-h-[18px] min-w-[18px] items-center justify-center rounded-full",
					"bg-primary px-1 text-[10px] font-bold leading-none text-primary-foreground",
					"shadow-lg shadow-primary/30 ring-2 ring-background",
					"transition-transform",
					totalItems > 0 ? "scale-100" : "scale-75 opacity-70"
				)}
			>
				{totalItems > 99 ? "99+" : totalItems}
			</span>
		</Link>
	);
}
