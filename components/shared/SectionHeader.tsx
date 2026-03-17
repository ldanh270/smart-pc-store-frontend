import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface SectionHeaderProps {
	title: string;
	subtitle?: string;
	viewAllHref?: string;
	viewAllLabel?: string;
}

export default function SectionHeader({
	title,
	subtitle,
	viewAllHref,
	viewAllLabel = "Xem tất cả",
}: SectionHeaderProps) {
	return (
		<div className="mb-10 flex items-end justify-between">
			<div>
				{/* Title */}
				<h2 className="text-2xl font-black tracking-tight text-foreground md:text-3xl">
					{title}
				</h2>

				{subtitle && (
					<p className="mt-2 text-sm text-muted-foreground max-w-md">
						{subtitle}
					</p>
				)}

				{/* Gradient accent underline */}
				<div className="mt-3 h-1 w-14 rounded-full bg-gradient-to-r from-primary to-transparent" />
			</div>

			{viewAllHref && (
				<Link
					href={viewAllHref}
					className="group flex shrink-0 items-center gap-1.5 rounded-full border border-border/60 bg-muted/50 px-4 py-1.5 text-sm font-medium text-muted-foreground transition-all hover:border-primary/40 hover:bg-primary/5 hover:text-primary"
				>
					{viewAllLabel}
					<ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
				</Link>
			)}
		</div>
	);
}
