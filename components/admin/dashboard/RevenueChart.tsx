"use client";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
	type ChartConfig,
} from "@/components/ui/chart";
import { MOCK_REVENUE_CHART } from "@/configs/mock-admin-data";

// ─── Chart Config ───────────────────────────────────────────────────────────

const chartConfig = {
	revenue: {
		label: "Doanh Thu",
		color: "var(--color-foreground)",
	},
} satisfies ChartConfig;

// ─── Helpers ────────────────────────────────────────────────────────────────

function formatVND(value: number): string {
	if (value >= 1_000_000) {
		return `${(value / 1_000_000).toFixed(0)}M`;
	}
	return value.toLocaleString("vi-VN");
}

// ─── Stats Summary ──────────────────────────────────────────────────────────

const totalRevenue = MOCK_REVENUE_CHART.reduce((s, d) => s + d.revenue, 0);
const totalOrders = MOCK_REVENUE_CHART.reduce((s, d) => s + d.orders, 0);

// ─── Component ──────────────────────────────────────────────────────────────

export default function RevenueBarChart() {
	return (
		<Card className="border-border/50">
			<CardHeader>
				<div className="flex items-center justify-between">
					<div>
						<CardTitle className="text-base font-semibold">
							Biểu Đồ Doanh Thu
						</CardTitle>
						<CardDescription>7 ngày gần nhất</CardDescription>
					</div>
					<div className="flex gap-6 text-right">
						<div>
							<p className="font-mono text-2xl font-bold">
								{formatVND(totalRevenue)}
							</p>
							<p className="text-xs text-muted-foreground">
								Doanh thu
							</p>
						</div>
						<div>
							<p className="font-mono text-2xl font-bold">
								{totalOrders.toLocaleString()}
							</p>
							<p className="text-xs text-muted-foreground">
								Đơn hàng
							</p>
						</div>
					</div>
				</div>
			</CardHeader>
			<CardContent>
				<ChartContainer config={chartConfig}>
					<BarChart
						data={MOCK_REVENUE_CHART}
						margin={{
							top: 5,
							right: 5,
							left: 0,
							bottom: 0,
						}}
					>
						<CartesianGrid
							strokeDasharray="3 3"
							vertical={false}
							className="stroke-border/30"
						/>
						<XAxis
							dataKey="date"
							tickLine={false}
							axisLine={false}
							tickMargin={8}
							className="text-xs"
						/>
						<YAxis
							tickLine={false}
							axisLine={false}
							tickFormatter={formatVND}
							width={45}
							className="text-xs"
						/>
						<ChartTooltip
							content={
								<ChartTooltipContent
									labelFormatter={(label) =>
										`Ngày ${label}`
									}
									formatter={(value) => [
										`${Number(value).toLocaleString("vi-VN")} ₫`,
									]}
								/>
							}
						/>
						<Bar
							dataKey="revenue"
							fill="currentColor"
							className="fill-foreground"
							radius={[3, 3, 0, 0]}
							maxBarSize={50}
						/>
					</BarChart>
				</ChartContainer>
			</CardContent>
		</Card>
	);
}
