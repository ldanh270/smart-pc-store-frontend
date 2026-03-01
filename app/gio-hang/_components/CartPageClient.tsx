"use client";

import { useEffect } from "react";
import { useCartStore } from "@/stores/useCartStore";
import { useAuthStore } from "@/stores/useAuthStore";
import CartBreadcrumb from "./CartBreadcrumb";
import CartItemRow from "./CartItemRow";
import CartSummary from "./CartSummary";
import EmptyCart from "./EmptyCart";

export default function CartPageClient() {
	const { items, isLoading, totalItems, fetchCart } = useCartStore();
	const accessToken = useAuthStore((state) => state.accessToken);
	const isLoggedIn = !!accessToken;

	useEffect(() => {
		if (isLoggedIn) {
			fetchCart();
		}
	}, [isLoggedIn, fetchCart]);

	// Not logged in
	if (!isLoggedIn) {
		return (
			<main className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
				<CartBreadcrumb />
				<div className="flex flex-col items-center justify-center py-20">
					<p className="mb-4 text-center text-muted-foreground">
						Vui lòng đăng nhập để xem giỏ hàng của bạn.
					</p>
				</div>
			</main>
		);
	}

	// Loading skeleton
	if (isLoading) {
		return (
			<main className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
				<CartBreadcrumb />
				<div className="space-y-4">
					{[1, 2, 3].map((i) => (
						<div
							key={i}
							className="h-24 animate-pulse rounded-md bg-muted"
						/>
					))}
				</div>
			</main>
		);
	}

	// Empty cart
	if (items.length === 0) {
		return (
			<main className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
				<CartBreadcrumb />
				<EmptyCart />
			</main>
		);
	}

	// Cart with items
	return (
		<main className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
			<CartBreadcrumb />

			{/* Title */}
			<h1 className="mb-6 font-sans text-2xl font-bold uppercase tracking-wide text-foreground">
				Giỏ Hàng{" "}
				<span className="text-base font-normal normal-case text-muted-foreground">
					({totalItems} sản phẩm)
				</span>
			</h1>

			{/* Layout: items list + summary sidebar */}
			<div className="flex flex-col gap-8 lg:flex-row">
				{/* Product List */}
				<div className="flex-1">
					{items.map((item) => (
						<CartItemRow key={item.cartItemId} item={item} />
					))}
				</div>

				{/* Summary Sidebar */}
				<aside className="w-full shrink-0 lg:w-80">
					<div className="sticky top-36">
						<CartSummary />
					</div>
				</aside>
			</div>
		</main>
	);
}
