import { Package, Tag } from "lucide-react";
import type { CategoryDetail } from "@/types/category";

interface CategoryInfoProps {
	category: CategoryDetail;
}

export default function CategoryInfo({ category }: CategoryInfoProps) {
	return (
		<div className="mb-8 rounded-xl border border-border bg-card p-6 shadow-sm">
			<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
				{/* Left: Name & Description */}
				<div className="flex-1">
					<div className="flex items-center gap-3">
						<div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
							<Tag className="size-5 text-primary" />
						</div>
						<h1 className="text-2xl font-bold text-foreground">
							{category.name}
						</h1>
					</div>
					{category.description && (
						<p className="mt-2 text-sm text-muted-foreground leading-relaxed pl-13">
							{category.description}
						</p>
					)}
				</div>

				{/* Right: Product Count Badge */}
				<div className="flex items-center gap-2 rounded-lg bg-muted/50 px-4 py-2.5 self-start">
					<Package className="size-4 text-muted-foreground" />
					<span className="font-mono text-sm font-semibold text-foreground">
						{category.products.length}
					</span>
					<span className="text-sm text-muted-foreground">
						sản phẩm
					</span>
				</div>
			</div>
		</div>
	);
}
