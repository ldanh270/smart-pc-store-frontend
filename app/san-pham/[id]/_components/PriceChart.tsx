"use client";

import { useEffect, useState } from "react";
import {
	CartesianGrid,
	Line,
	LineChart,
	XAxis,
	YAxis,
} from "recharts";
import { Info } from "lucide-react";
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
import { aiChatService } from "@/services/aiChatService";

// ─── Config ─────────────────────────────────────────────────────────────────

const FORECAST_DAYS = 7;

const chartConfig = {
	past: {
		label: "Giá thực tế",
		color: "hsl(221, 83%, 53%)",
	},
	future: {
		label: "Dự đoán",
		color: "hsl(24, 95%, 53%)",
	},
} satisfies ChartConfig;

// ─── Types ───────────────────────────────────────────────────────────────────

interface ChartPoint {
	date: string;
	past: number | null;
	future: number | null;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatVND(value: number): string {
	if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
	return value.toLocaleString("vi-VN");
}

function formatDateTick(iso: string): string {
	const d = new Date(iso);
	return d.toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit" });
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function PriceChart({ productId }: { productId: string }) {
	const [points, setPoints] = useState<ChartPoint[]>([]);
	const [note, setNote] = useState<string | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(false);

	useEffect(() => {
		aiChatService
			.forecastPrice(productId, FORECAST_DAYS)
			.then(({ past, future, note }) => {
				const pastPoints: ChartPoint[] = past.map((p) => ({
					date: p.date,
					past: p.price,
					future: null,
				}));

				const futurePoints: ChartPoint[] = future.map((p) => ({
					date: p.date,
					past: null,
					future: p.price,
				}));

				// Bridge: connect the two lines at the transition point
				if (pastPoints.length > 0 && futurePoints.length > 0) {
					pastPoints[pastPoints.length - 1].future =
						pastPoints[pastPoints.length - 1].past;
				}

				setPoints([...pastPoints, ...futurePoints]);
				setNote(note ?? null);
			})
			.catch(() => setError(true))
			.finally(() => setLoading(false));
	}, [productId]);

	if (loading) {
		return (
			<Card className="mt-8 border-border/50">
				<CardHeader className="pb-2">
					<CardTitle className="text-sm font-semibold">
						Biểu Đồ Giá
					</CardTitle>
					<CardDescription className="text-xs">
						Đang tải dữ liệu dự đoán từ AI...
					</CardDescription>
				</CardHeader>
				<CardContent className="flex h-48 items-center justify-center">
					<div className="h-5 w-5 animate-spin rounded-full border-2 border-foreground border-t-transparent" />
				</CardContent>
			</Card>
		);
	}

	if (error || points.length === 0) return null;

	return (
		<Card className="mt-8 border-border/50">
			<CardHeader className="pb-2">
				<div className="flex flex-wrap items-center justify-between gap-3">
					<div>
						<CardTitle className="text-sm font-semibold">
							Biểu Đồ Giá
						</CardTitle>
						<CardDescription className="text-xs">
							Lịch sử & dự đoán xu hướng giá từ AI
						</CardDescription>
					</div>

					{/* Inline legend */}
					<div className="flex items-center gap-4 text-xs text-muted-foreground">
						<span className="flex items-center gap-1.5">
							<span className="inline-block h-0.5 w-5 rounded bg-blue-500" />
							Thực tế
						</span>
						<span className="flex items-center gap-1.5">
							<span
								className="inline-block h-0.5 w-5 rounded"
								style={{
									background:
										"repeating-linear-gradient(90deg,hsl(24,95%,53%) 0,hsl(24,95%,53%) 4px,transparent 4px,transparent 7px)",
								}}
							/>
							Dự đoán
						</span>
					</div>
				</div>
			</CardHeader>

			<CardContent className="space-y-2 pb-4">
				<ChartContainer config={chartConfig} className="h-68 w-full">
					<LineChart
						data={points}
						margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
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
							tickFormatter={formatDateTick}
							className="text-xs"
						/>
						<YAxis
							tickLine={false}
							axisLine={false}
							tickFormatter={formatVND}
							width={48}
							className="text-xs"
							domain={[
								(min: number) => min * 0.9,
								(max: number) => max * 1.1,
							]}
						/>
						<ChartTooltip
							content={
								<ChartTooltipContent
									labelFormatter={formatDateTick}
									formatter={(value, name) => [
										`${Number(value).toLocaleString("vi-VN")} ₫`,
										name === "past"
											? "Giá thực tế"
											: "Dự đoán AI",
									]}
								/>
							}
						/>

						{/* Historical price — solid, filled dots */}
						<Line
							type="monotone"
							dataKey="past"
							stroke="var(--color-past)"
							strokeWidth={2}
							dot={{ r: 3, fill: "var(--color-past)", strokeWidth: 0 }}
							activeDot={{ r: 5 }}
							connectNulls={false}
						/>

						{/* Forecast — dashed, hollow dots, slightly faded */}
						<Line
							type="monotone"
							dataKey="future"
							stroke="var(--color-future)"
							strokeWidth={1.5}
							strokeDasharray="5 5"
							strokeOpacity={0.75}
							dot={{
								r: 3,
								fill: "hsl(var(--background))",
								stroke: "var(--color-future)",
								strokeWidth: 1.5,
							}}
							activeDot={{ r: 5 }}
							connectNulls={false}
						/>
					</LineChart>
				</ChartContainer>

				{note && (
					<p className="flex items-start gap-1.5 text-xs text-muted-foreground">
						<Info className="mt-0.5 h-3 w-3 shrink-0" />
						{note}
					</p>
				)}
			</CardContent>
		</Card>
	);
}
