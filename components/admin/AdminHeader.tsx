"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { LogOut, Settings, User, Bell, Search } from "lucide-react";

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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<button className="flex items-center gap-2 rounded-lg px-1.5 py-1 transition-colors hover:bg-accent">
						<Avatar className="size-7">
							<AvatarImage src="" />
							<AvatarFallback className="bg-primary/20 text-xs font-semibold text-primary">
								AD
							</AvatarFallback>
						</Avatar>
						<span className="hidden text-sm font-medium md:block">
							Admin
						</span>
					</button>
				</DropdownMenuTrigger>
				<DropdownMenuContent align="end" className="w-48">
					<DropdownMenuLabel>
						<span className="block text-sm font-medium">Admin</span>
						<span className="block text-xs text-muted-foreground">
							admin@smartpc.vn
						</span>
					</DropdownMenuLabel>
					<DropdownMenuSeparator />
					<DropdownMenuItem>
						<User className="mr-2 size-4" />
						Hồ Sơ
					</DropdownMenuItem>
					<DropdownMenuItem>
						<Settings className="mr-2 size-4" />
						Cài Đặt
					</DropdownMenuItem>
					<DropdownMenuSeparator />
					<DropdownMenuItem asChild>
						<Link
							href="/"
							className="text-destructive focus:text-destructive"
						>
							<LogOut className="mr-2 size-4" />
							Đăng Xuất
						</Link>
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		</header>
	);
}
