import { Card, CardContent } from "@/components/ui/card"

import { type LucideIcon, TrendingDown, TrendingUp } from "lucide-react"

// ─── Types ──────────────────────────────────────────────────────────────────

interface StatCardProps {
  label: string
  value: string
  icon: LucideIcon
  trend: number
  trendLabel: string
  description: string
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
  const isPositive = trend >= 0

  return (
    <Card className="border-border/50">
      <CardContent className="p-5">
        {/* Header Row */}
        <div className="flex items-center justify-between">
          <p className="text-muted-foreground text-sm font-medium">{label}</p>
          <Icon className="text-muted-foreground size-4" />
        </div>

        {/* Value */}
        <p className="mt-2 font-mono text-2xl font-bold tracking-tight">{value}</p>

        {/* Trend + Description */}
        <div className="mt-3 flex flex-wrap items-center justify-between gap-1.5">
          <span
            className={`inline-flex items-center gap-0.5 text-xs font-medium ${
              isPositive ? "text-emerald-500" : "text-red-500"
            }`}
          >
            {isPositive ? <TrendingUp className="size-3" /> : <TrendingDown className="size-3" />}
            {isPositive ? "+" : ""}
            {trend}%
          </span>
          <span className="text-muted-foreground text-xs">{trendLabel}</span>
        </div>

        {/* Description */}
        <p className="text-muted-foreground mt-1 text-xs">{description}</p>
      </CardContent>
    </Card>
  )
}
