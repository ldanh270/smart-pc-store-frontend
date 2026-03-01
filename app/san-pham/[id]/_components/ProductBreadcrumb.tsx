import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";

interface ProductBreadcrumbProps {
	productName: string;
}

export default function ProductBreadcrumb({
	productName,
}: ProductBreadcrumbProps) {
	return (
		<nav
			aria-label="Breadcrumb"
			className="mb-6 flex items-center gap-1.5 text-sm text-muted-foreground"
		>
			<Link
				href="/"
				className="flex items-center gap-1 transition-colors hover:text-primary"
			>
				<Home className="h-3.5 w-3.5" />
				Trang Chủ
			</Link>

			<ChevronRight className="h-3.5 w-3.5" />

			<Link
				href="/san-pham"
				className="transition-colors hover:text-primary"
			>
				Sản Phẩm
			</Link>

			<ChevronRight className="h-3.5 w-3.5" />

			<span className="truncate font-medium text-foreground">
				{productName}
			</span>
		</nav>
	);
}
