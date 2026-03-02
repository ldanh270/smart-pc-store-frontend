"use client";

import { Pie, PieChart, Cell, Label } from "recharts";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
	type ChartConfig,
} from "@/components/ui/chart";

// ─── Data ───────────────────────────────────────────────────────────────────

const CATEGORY_DATA = [
	{ name: "CPU", value: 24, fill: "var(--color-chart-1)" },
	{ name: "GPU", value: 18, fill: "var(--color-chart-2)" },
	{ name: "RAM", value: 32, fill: "var(--color-chart-3)" },
	{ name: "SSD", value: 28, fill: "var(--color-chart-4)" },
	{ name: "Khác", value: 84, fill: "var(--color-chart-5)" },
];

const totalProducts = CATEGORY_DATA.reduce((s, d) => s + d.value, 0);

const chartConfig = {
	cpu: { label: "CPU", color: "var(--color-chart-1)" },
	gpu: { label: "GPU", color: "var(--color-chart-2)" },
	ram: { label: "RAM", color: "var(--color-chart-3)" },
	ssd: { label: "SSD", color: "var(--color-chart-4)" },
	other: { label: "Khác", color: "var(--color-chart-5)" },
} satisfies ChartConfig;

// ─── Component ──────────────────────────────────────────────────────────────

export default function CategoryDonutChart() {
	return (
		<Card className="border-border/50">
			<CardHeader>
				<CardTitle className="text-base font-semibold">
					Phân Bổ Sản Phẩm
				</CardTitle>
				<CardDescription>Sản phẩm theo danh mục</CardDescription>
			</CardHeader>
			<CardContent>
				<ChartContainer
					config={chartConfig}
					className="mx-auto aspect-square"
				>
					<PieChart>
						<ChartTooltip
							content={<ChartTooltipContent hideLabel />}
						/>
						<Pie
							data={CATEGORY_DATA}
							cx="50%"
							cy="50%"
							innerRadius={55}
							outerRadius={80}
							paddingAngle={3}
							dataKey="value"
							strokeWidth={0}
						>
							{CATEGORY_DATA.map((entry) => (
								<Cell key={entry.name} fill={entry.fill} />
							))}
							<Label
								content={({ viewBox }) => {
									if (
										viewBox &&
										"cx" in viewBox &&
										"cy" in viewBox
									) {
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
										);
									}
								}}
							/>
						</Pie>
					</PieChart>
				</ChartContainer>
			</CardContent>
			<CardFooter className="flex-col gap-2 border-t border-border/50 pt-4">
				{CATEGORY_DATA.map((cat) => (
					<div
						key={cat.name}
						className="flex w-full items-center justify-between text-sm"
					>
						<div className="flex items-center gap-2">
							<div
								className="size-2.5 rounded-full"
								style={{ backgroundColor: cat.fill }}
							/>
							<span className="text-muted-foreground">
								{cat.name}
							</span>
						</div>
						<span className="font-mono font-medium">
							{cat.value}
						</span>
					</div>
				))}
			</CardFooter>
		</Card>
	);
}
