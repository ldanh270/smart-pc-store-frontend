import Link from "next/link";
import { ShoppingBag } from "lucide-react";

export default function CartButton() {
	// TODO: Replace with real cart count from cart context/store
	const cartCount = 0;

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
					{cartCount > 99 ? "99+" : cartCount}
				</span>
			</div>
		</Link>
	);
}
