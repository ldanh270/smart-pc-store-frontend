import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CartButton() {
	// TODO: Replace with real cart count from cart context/store
	const cartCount = 0;

	return (
		<Button
			variant="ghost"
			size="icon"
			asChild
			className="relative"
		>
			<Link
				href="/gio-hang"
				aria-label="Giỏ hàng"
			>
				<ShoppingCart className="size-5" />
				{cartCount > 0 && (
					<span className="absolute -right-0.5 -top-0.5 flex size-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
						{cartCount > 99 ? "99+" : cartCount}
					</span>
				)}
			</Link>
		</Button>
	);
}
