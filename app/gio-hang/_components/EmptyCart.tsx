import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function EmptyCart() {
	return (
		<div className="flex flex-col items-center justify-center py-20">
			<div className="mb-6 flex size-24 items-center justify-center rounded-full bg-muted">
				<ShoppingCart className="size-10 text-muted-foreground" />
			</div>
			<h2 className="mb-2 font-sans text-xl font-semibold text-foreground">
				Giỏ hàng trống
			</h2>
			<p className="mb-6 max-w-sm text-center text-sm text-muted-foreground">
				Bạn chưa có sản phẩm nào trong giỏ hàng. Hãy khám phá các sản
				phẩm của chúng tôi!
			</p>
			<Button size="lg" asChild>
				<Link href="/" className="font-sans font-semibold uppercase tracking-wider">
					Tiếp Tục Mua Hàng
				</Link>
			</Button>
		</div>
	);
}
