"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useCartStore } from "@/stores/useCartStore";

export default function CartSummary() {
	const { totalPrice, totalItems } = useCartStore();

	return (
		<div className="rounded-lg border border-border bg-card p-5">
			{/* Subtotal */}
			<div className="flex items-center justify-between">
				<span className="text-sm text-muted-foreground">
					Tạm tính:
				</span>
				<span className="font-mono text-base font-semibold text-foreground">
					{totalPrice.toLocaleString("vi-VN")}đ
				</span>
			</div>

			<Separator className="my-4" />

			{/* Grand Total */}
			<div className="flex items-center justify-between">
				<span className="font-sans text-base font-semibold text-foreground">
					Thành tiền:
				</span>
				<span className="font-mono text-xl font-bold text-primary">
					{totalPrice.toLocaleString("vi-VN")}đ
				</span>
			</div>

			<Separator className="my-4" />

			{/* CTA Buttons */}
			<div className="flex flex-col gap-3">
				<Button
					size="lg"
					className="w-full font-sans text-sm font-bold uppercase tracking-wider"
					disabled={totalItems === 0}
					asChild={totalItems > 0}
				>
					{totalItems > 0 ? (
						<Link href="/thanh-toan">Thanh Toán Ngay</Link>
					) : (
						<span>Thanh Toán Ngay</span>
					)}
				</Button>
				<Button
					variant="outline"
					size="lg"
					className="w-full font-sans text-sm font-medium uppercase tracking-wider"
					asChild
				>
					<Link href="/">Tiếp Tục Mua Hàng</Link>
				</Button>
			</div>
		</div>
	);
}
