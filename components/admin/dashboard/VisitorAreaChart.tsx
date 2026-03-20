"use client"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

import { TrendingUp } from "lucide-react"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"

// ─── Data (6-month visitors) ────────────────────────────────────────────────

const VISITOR_DATA = [
  { month: "T1", desktop: 186, mobile: 80 },
  { month: "T2", desktop: 305, mobile: 200 },
  { month: "T3", desktop: 237, mobile: 120 },
  { month: "T4", desktop: 73, mobile: 190 },
  { month: "T5", desktop: 209, mobile: 130 },
  { month: "T6", desktop: 214, mobile: 140 },
]

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "var(--color-chart-1)",
  },
  mobile: {
    label: "Mobile",
    color: "var(--color-chart-2)",
  },
} satisfies ChartConfig

// ─── Component ──────────────────────────────────────────────────────────────

export default function VisitorAreaChart() {
  return (
    <Card className="border-border/50">
      <CardHeader>
        <CardTitle className="text-base font-semibold">Lượng Truy Cập</CardTitle>
        <CardDescription>Tổng lượt truy cập 6 tháng gần nhất</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <AreaChart
            data={VISITOR_DATA}
            margin={{
              top: 5,
              right: 5,
              left: 0,
              bottom: 0,
            }}
          >
            <defs>
              <linearGradient id="fillDesktop" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--color-chart-1)" stopOpacity={0.4} />
                <stop offset="95%" stopColor="var(--color-chart-1)" stopOpacity={0.05} />
              </linearGradient>
              <linearGradient id="fillMobile" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--color-chart-2)" stopOpacity={0.4} />
                <stop offset="95%" stopColor="var(--color-chart-2)" stopOpacity={0.05} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-border/30" />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              className="text-xs"
            />
            <YAxis tickLine={false} axisLine={false} width={30} className="text-xs" />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Area
              type="monotone"
              dataKey="mobile"
              stackId="a"
              stroke="var(--color-chart-2)"
              strokeWidth={1.5}
              fill="url(#fillMobile)"
            />
            <Area
              type="monotone"
              dataKey="desktop"
              stackId="a"
              stroke="var(--color-chart-1)"
              strokeWidth={1.5}
              fill="url(#fillDesktop)"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="border-border/50 border-t pt-4">
        <div className="flex items-center gap-2 text-sm">
          <TrendingUp className="size-4 text-emerald-500" />
          <span>Tăng 5.2% so với tháng trước</span>
        </div>
      </CardFooter>
    </Card>
  )
}
