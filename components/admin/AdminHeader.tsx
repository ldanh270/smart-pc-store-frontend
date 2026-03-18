"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { LogOut, Bell, Search, Store } from "lucide-react";

import { useAuthStore } from "@/stores/useAuthStore";

import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// ─── Route Label Map ────────────────────────────────────────────────────────

const ROUTE_LABELS: Record<string, string> = {
	admin: "Dashboard",
	users: "Người Dùng",
	products: "Sản Phẩm",
	categories: "Danh Mục",
	orders: "Đơn Hàng",
};

// ─── Component ──────────────────────────────────────────────────────────────

export default function AdminHeader() {
	const pathname = usePathname();
	const segments = pathname.split("/").filter(Boolean);
	const { user, logout } = useAuthStore();

	const breadcrumbs = segments.map((segment, index) => ({
		label: ROUTE_LABELS[segment] ?? segment,
		href: "/" + segments.slice(0, index + 1).join("/"),
		isLast: index === segments.length - 1,
	}));

	return (
		<header className="flex h-14 shrink-0 items-center gap-3 border-b border-border px-4">
			{/* Sidebar Toggle */}
			<SidebarTrigger className="-ml-1 size-8" />
			<Separator orientation="vertical" className="mr-1 h-4" />

			{/* Breadcrumb */}
			<Breadcrumb>
				<BreadcrumbList>
					{breadcrumbs.map((crumb) => (
						<span key={crumb.href} className="contents">
							{crumb.isLast ? (
								<BreadcrumbItem>
									<BreadcrumbPage className="font-medium">
										{crumb.label}
									</BreadcrumbPage>
								</BreadcrumbItem>
							) : (
								<>
									<BreadcrumbItem>
										<BreadcrumbLink href={crumb.href}>
											{crumb.label}
										</BreadcrumbLink>
									</BreadcrumbItem>
									<BreadcrumbSeparator />
								</>
							)}
						</span>
					))}
				</BreadcrumbList>
			</Breadcrumb>

			{/* Spacer */}
			<div className="flex-1" />


			{/* Search */}
			<div className="relative hidden md:block">
				<Search className="absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
				<Input
					placeholder="Tìm kiếm..."
					className="h-8 w-50 bg-muted/50 pl-8 text-sm lg:w-65"
				/>
			</div>

			{/* Notifications */}
			<Button variant="ghost" size="icon" className="size-8">
				<Bell className="size-4" />
			</Button>

			<Separator orientation="vertical" className="h-4" />

			{/* User Dropdown */}
			<div className="group relative">
				<button className="flex items-center gap-2 rounded-lg px-1.5 py-1 transition-colors hover:bg-accent">
					<Avatar className="size-7 border border-border/50">
						<AvatarFallback className="bg-primary/20 text-xs font-semibold text-primary">
							{user?.name?.charAt(0).toUpperCase() ?? "A"}
						</AvatarFallback>
					</Avatar>
					<span className="hidden text-sm font-medium md:block">
						{user?.name ?? "Admin"}
					</span>
				</button>
				
				<div className="invisible absolute right-0 top-full z-50 mt-2 w-48 rounded-xl border border-border/60 bg-popover/95 p-1.5 opacity-0 shadow-xl shadow-black/10 backdrop-blur-xl transition-all duration-200 group-hover:visible group-hover:opacity-100">
					{/* Profile header */}
					<div className="mb-1 px-3 py-2">
						<span className="block text-sm font-medium truncate">{user?.name ?? "Admin"}</span>
						<span className="block text-[11px] text-muted-foreground truncate">
							{user?.email ?? ""}
						</span>
					</div>

					<div className="my-1 h-px bg-border/50" />

					{/* Menu items */}
					<Link
						href="/"
						className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-popover-foreground/90 transition-colors hover:bg-accent hover:text-accent-foreground"
					>
						<Store className="size-4 shrink-0 text-muted-foreground" />
						Về Trang Khách
					</Link>

					<div className="my-1 h-px bg-border/50" />

					{/* Logout */}
					<button
						onClick={async () => {
							await logout();
							window.location.href = "/dang-nhap";
						}}
						className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm font-medium text-destructive transition-colors hover:bg-destructive/10"
					>
						<LogOut className="size-4 shrink-0" />
						Đăng Xuất
					</button>
				</div>
			</div>
		</header>
	);
}
