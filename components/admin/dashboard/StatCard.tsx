import { type LucideIcon, TrendingUp, TrendingDown } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

// ─── Types ──────────────────────────────────────────────────────────────────

interface StatCardProps {
	label: string;
	value: string;
	icon: LucideIcon;
	trend: number;
	trendLabel: string;
	description: string;
}

// ─── Component ──────────────────────────────────────────────────────────────

export default function StatCard({
	label,
	value,
	icon: Icon,
	trend,
	trendLabel,
	description,
}: StatCardProps) {
	const isPositive = trend >= 0;

	return (
		<Card className="border-border/50">
			<CardContent className="p-5">
				{/* Header Row */}
				<div className="flex items-center justify-between">
					<p className="text-sm font-medium text-muted-foreground">
						{label}
					</p>
					<Icon className="size-4 text-muted-foreground" />
				</div>

				{/* Value */}
				<p className="mt-2 font-mono text-2xl font-bold tracking-tight">
					{value}
				</p>

				{/* Trend + Description */}
				<div className="mt-3 flex items-center justify-between gap-1.5 flex-wrap">
					<span
						className={`inline-flex items-center gap-0.5 text-xs font-medium ${
							isPositive
								? "text-emerald-500"
								: "text-red-500"
						}`}
					>
						{isPositive ? (
							<TrendingUp className="size-3" />
						) : (
							<TrendingDown className="size-3" />
						)}
						{isPositive ? "+" : ""}
						{trend}%
					</span>
					<span className="text-xs text-muted-foreground">
						{trendLabel}
					</span>
				</div>

				{/* Description */}
				<p className="mt-1 text-xs text-muted-foreground">
					{description}
				</p>
			</CardContent>
		</Card>
	);
}
