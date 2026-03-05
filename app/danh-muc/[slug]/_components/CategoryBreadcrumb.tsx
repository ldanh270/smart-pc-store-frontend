import Link from "next/link";
import { ChevronRight } from "lucide-react";

interface CategoryBreadcrumbProps {
	categoryName: string;
}

export default function CategoryBreadcrumb({
	categoryName,
}: CategoryBreadcrumbProps) {
	return (
		<nav aria-label="Breadcrumb" className="mb-6">
			<ol className="flex items-center gap-1.5 text-sm text-muted-foreground">
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
				<li>
					<Link
						href="/"
						className="transition-colors hover:text-foreground"
					>
						Danh Mục
					</Link>
				</li>
				<li>
					<ChevronRight className="size-3.5" />
				</li>
				<li>
					<span className="font-medium text-foreground">
						{categoryName}
					</span>
				</li>
			</ol>
		</nav>
	);
}
