"use client";

import { useEffect } from "react";
import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { useCartStore } from "@/stores/useCartStore";
import { useAuthStore } from "@/stores/useAuthStore";

export default function CartButton() {
	const totalItems = useCartStore((state) => state.totalItems);
	const fetchCart = useCartStore((state) => state.fetchCart);
	const accessToken = useAuthStore((state) => state.accessToken);

	useEffect(() => {
		if (accessToken) {
			fetchCart();
		}
	}, [accessToken, fetchCart]);

	return (
		<Link
			href="/gio-hang"
			className="group relative flex items-center gap-1 py-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground transition-colors hover:text-foreground"
			aria-label="Giỏ hàng"
		>
			GIỎ HÀNG
			<div className="relative ml-1">
				<ShoppingBag className="size-5" />
				<span className="absolute -right-2 -top-1.5 flex size-4.5 items-center justify-center rounded-full bg-foreground text-[10px] font-bold text-background transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
					{totalItems > 99 ? "99+" : totalItems}
				</span>
			</div>
		</Link>
	);
}
