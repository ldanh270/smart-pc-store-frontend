import Link from "next/link";
import { ChevronRight } from "lucide-react";

export default function CartBreadcrumb() {
	return (
		<nav aria-label="Breadcrumb" className="mb-6">
			<ol className="flex items-center gap-1 text-sm text-muted-foreground">
				<li>
					<Link
						href="/"
						className="transition-colors hover:text-foreground"
					>
						Trang chủ
					</Link>
				</li>
				<li>
					<ChevronRight className="size-3.5" />
				</li>
				<li className="font-medium text-foreground">Giỏ hàng</li>
			</ol>
		</nav>
	);
}
