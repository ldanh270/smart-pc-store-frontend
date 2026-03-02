import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { MOCK_ORDERS } from "@/configs/mock-admin-data";

// ─── Component ──────────────────────────────────────────────────────────────

export default function RecentSales() {
	const recentOrders = MOCK_ORDERS.slice(0, 5);

	return (
		<Card className="border-border/50">
			<CardHeader>
				<CardTitle className="text-base font-semibold">
					Đơn Hàng Gần Đây
				</CardTitle>
				<CardDescription>
					Bạn có {recentOrders.length} đơn hàng gần đây
				</CardDescription>
			</CardHeader>
			<CardContent className="space-y-5">
				{recentOrders.map((order) => {
					const initials = order.customerName
						.split(" ")
						.map((n) => n[0])
						.slice(0, 2)
						.join("")
						.toUpperCase();

					return (
						<div
							key={order.id}
							className="flex items-center gap-3"
						>
							<Avatar className="size-9">
								<AvatarFallback className="bg-muted text-xs font-medium">
									{initials}
								</AvatarFallback>
							</Avatar>
							<div className="min-w-0 flex-1">
								<p className="truncate text-sm font-medium leading-tight">
									{order.customerName}
								</p>
								<p className="truncate text-xs text-muted-foreground">
									{order.email}
								</p>
							</div>
							<p className="shrink-0 font-mono text-sm font-semibold">
								+{order.total.toLocaleString("vi-VN")} ₫
							</p>
						</div>
					);
				})}
			</CardContent>
		</Card>
	);
}
