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
import { cn } from "@/lib/utils"
import { dashboardService } from "@/services/dashboardService"
import type { CategoryStat } from "@/types/dashboard"

import { useEffect, useState } from "react"

import { Cell, Label, Pie, PieChart } from "recharts"

// ─── Constants ─────────────────────────────────────────────────────────────

const COLORS = [
  "var(--color-chart-1)",
  "var(--color-chart-2)",
  "var(--color-chart-3)",
  "var(--color-chart-4)",
  "var(--color-chart-5)",
]

// ─── Component ──────────────────────────────────────────────────────────────

export default function CategoryDonutChart({ className }: { className?: string }) {
  const [data, setData] = useState<(CategoryStat & { fill: string })[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const stats = await dashboardService.getCategoryStats()
        const formattedData = stats.map((item, index) => ({
          ...item,
          fill: COLORS[index % COLORS.length],
        }))
        setData(formattedData)
      } catch (error) {
        console.error("Failed to fetch category stats:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const totalProducts = data.reduce((s, d) => s + d.value, 0)

  // Generate dynamic chart config
  const chartConfig = data.reduce((acc, curr) => {
    acc[curr.name.toLowerCase()] = {
      label: curr.name,
      color: curr.fill,
    }
    return acc
  }, {} as ChartConfig)

  if (loading) {
    return (
      <Card className="border-border/50 flex h-full flex-col">
        <CardHeader>
          <CardTitle className="text-base font-semibold">Phân Bổ Sản Phẩm</CardTitle>
          <CardDescription>Sản phẩm theo danh mục</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-1 items-center justify-center">
          <div className="border-primary size-8 animate-spin rounded-full border-2 border-t-transparent" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={cn("border-border/50 flex h-full flex-col", className)}>
      <CardHeader>
        <CardTitle className="text-base font-semibold">Phân Bổ Sản Phẩm</CardTitle>
        <CardDescription>Sản phẩm theo danh mục</CardDescription>
      </CardHeader>
      <CardContent className="pb-0">
        <ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-45">
          <PieChart>
            <ChartTooltip content={<ChartTooltipContent hideLabel />} />
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={80}
              paddingAngle={3}
              dataKey="value"
              strokeWidth={0}
            >
              {data.map((entry) => (
                <Cell key={entry.name} fill={entry.fill} />
              ))}
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy ?? 0) - 8}
                          className="fill-foreground text-2xl font-bold"
                        >
                          {totalProducts}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy ?? 0) + 12}
                          className="fill-muted-foreground text-xs"
                        >
                          Sản phẩm
                        </tspan>
                      </text>
                    )
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="border-border/50 grid grid-cols-2 gap-x-4 gap-y-1 border-t pt-3">
        {data.map((cat) => (
          <div key={cat.name} className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5">
              <div className="size-2 rounded-full" style={{ backgroundColor: cat.fill }} />
              <span className="text-muted-foreground max-w-12.5 truncate">{cat.name}</span>
            </div>
            <span className="font-mono font-medium">{cat.value}</span>
          </div>
        ))}
      </CardFooter>
    </Card>
  )
}
