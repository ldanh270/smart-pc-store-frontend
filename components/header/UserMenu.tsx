"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
	CircleUserRound, Package, Settings,
	LogOut, LayoutDashboard, ChevronDown,
} from "lucide-react";
import { useAuthStore } from "@/stores/useAuthStore";
import { cn } from "@/lib/utils";

export default function UserMenu() {
	const router = useRouter();
	const { user, logout } = useAuthStore();
	const isAdmin = user?.role?.toUpperCase() === "ADMIN";

	const menuItems = [
		{ href: "/tai-khoan", icon: Settings,       label: "Tài khoản" },
		{ href: "/don-hang",  icon: Package,         label: "Đơn hàng của tôi" },
		...(isAdmin ? [{ href: "/admin", icon: LayoutDashboard, label: "Quản lý" }] : []),
	];

	// Avatar initials
	const initials = user?.name
		? user.name.split(" ").map((w: string) => w[0]).slice(-2).join("").toUpperCase()
		: "U";

	return (
		<div className="group relative">
			{/* Trigger button */}
			<button
				type="button"
				className={cn(
					"flex h-9 items-center gap-2 rounded-lg px-2.5",
					"border border-border/60 bg-muted/40 text-sm font-medium text-foreground",
					"transition-all duration-200 hover:border-primary/40 hover:bg-primary/8 hover:text-primary",
				)}
			>
				{/* Avatar */}
				<div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/20 text-[10px] font-bold text-primary">
					{initials}
				</div>
				<span className="hidden max-w-[80px] truncate text-xs font-semibold sm:block">
					{user?.name?.split(" ").pop() || "Account"}
				</span>
				<ChevronDown className="size-3 opacity-50 transition-transform duration-200 group-hover:rotate-180" />
			</button>

			{/* Dropdown */}
			<div className="invisible absolute right-0 top-full z-50 mt-2 min-w-56 rounded-xl border border-border/60 bg-popover/95 p-1.5 opacity-0 shadow-xl shadow-black/10 backdrop-blur-xl transition-all duration-200 group-hover:visible group-hover:opacity-100">
				{/* Profile header */}
				<div className="mb-1 flex items-center gap-3 rounded-lg bg-muted/50 px-3 py-2.5">
					<div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/20 text-xs font-bold text-primary shrink-0">
						{initials}
					</div>
					<div className="overflow-hidden">
						<p className="truncate text-xs font-semibold text-foreground">
							{user?.name || "Người dùng"}
						</p>
						<p className="truncate text-[10px] text-muted-foreground">
							{user?.role === "ADMIN" ? "Quản trị viên" : "Khách hàng"}
						</p>
					</div>
				</div>

				<div className="my-1 h-px bg-border/50" />

				{/* Menu items */}
				{menuItems.map((item) => {
					const Icon = item.icon;
					return (
						<Link
							key={item.href}
							href={item.href}
							className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-popover-foreground/80 transition-colors hover:bg-accent hover:text-accent-foreground"
						>
							<Icon className="size-3.5 text-muted-foreground shrink-0" />
							{item.label}
						</Link>
					);
				})}

				<div className="my-1 h-px bg-border/50" />

				{/* Logout */}
				<button
					onClick={async () => {
						await logout();
						router.push("/");
					}}
					className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm text-destructive transition-colors hover:bg-destructive/10"
				>
					<LogOut className="size-3.5 shrink-0" />
					Đăng xuất
				</button>
			</div>
		</div>
	);
}
