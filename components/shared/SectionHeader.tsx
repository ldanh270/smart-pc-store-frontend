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
		<div className="mb-8 flex items-end justify-between">
			<div>
				<h2 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
					{title}
				</h2>
				{subtitle && (
					<p className="mt-1 text-sm text-muted-foreground">
						{subtitle}
					</p>
				)}
				{/* Accent underline */}
				<div className="mt-2 h-1 w-12 rounded-full bg-primary" />
			</div>

			{viewAllHref && (
				<Link
					href={viewAllHref}
					className="group flex items-center gap-1 text-sm font-medium text-primary transition-colors hover:text-primary/80"
				>
					{viewAllLabel}
					<ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
				</Link>
			)}
		</div>
	);
}
