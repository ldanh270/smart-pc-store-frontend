"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
	LayoutDashboard,
	Users,
	Package,
	Tags,
	ShoppingCart,
	Monitor,
  Truck,
} from "lucide-react";

import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarRail,
	SidebarSeparator,
} from "@/components/ui/sidebar";

// ─── Sidebar Menu Config ────────────────────────────────────────────────────

interface AdminMenuItem {
	label: string;
	href: string;
	icon: React.ComponentType<{ className?: string }>;
}

const MAIN_MENU: AdminMenuItem[] = [
	{ label: "Tổng Quan", href: "/admin", icon: LayoutDashboard },
	{ label: "Đơn Hàng", href: "/admin/orders", icon: ShoppingCart },
];

const CATALOG_MENU: AdminMenuItem[] = [
	{ label: "Sản Phẩm", href: "/admin/products", icon: Package },
	{ label: "Danh Mục", href: "/admin/categories", icon: Tags },
  { label: "Nhà Cung Cấp", href: "/admin/suppliers", icon: Truck },
];

const SYSTEM_MENU: AdminMenuItem[] = [
	{ label: "Người Dùng", href: "/admin/users", icon: Users },
];

// ─── Menu Renderer ──────────────────────────────────────────────────────────

function MenuGroup({
	items,
	pathname,
}: {
	items: AdminMenuItem[];
	pathname: string;
}) {
	return (
		<SidebarMenu>
			{items.map((item) => {
				const isActive =
					pathname === item.href ||
					(item.href !== "/admin" &&
						pathname.startsWith(item.href));

				return (
					<SidebarMenuItem key={item.href}>
						<SidebarMenuButton
							asChild
							isActive={isActive}
							tooltip={item.label}
						>
							<Link href={item.href}>
								<item.icon className="size-4" />
								<span>{item.label}</span>
							</Link>
						</SidebarMenuButton>
					</SidebarMenuItem>
				);
			})}
		</SidebarMenu>
	);
}

// ─── Component ──────────────────────────────────────────────────────────────

export default function AdminSidebar() {
	const pathname = usePathname();

	return (
		<Sidebar collapsible="icon" variant="sidebar">
			{/* Brand */}
			<SidebarHeader className="px-4 py-4">
				<Link
					href="/admin"
					className="flex items-center gap-3 group-data-[collapsible=icon]:justify-center"
				>
					<div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
						<Monitor className="size-4" />
					</div>
					<span className="text-sm font-bold tracking-wide group-data-[collapsible=icon]:hidden">
						SMART PC
					</span>
				</Link>
			</SidebarHeader>

			<SidebarSeparator />

			{/* Navigation */}
			<SidebarContent>
				<SidebarGroup>
					<SidebarGroupLabel>Tổng Quan</SidebarGroupLabel>
					<SidebarGroupContent>
						<MenuGroup items={MAIN_MENU} pathname={pathname} />
					</SidebarGroupContent>
				</SidebarGroup>

				<SidebarGroup>
					<SidebarGroupLabel>Cửa Hàng</SidebarGroupLabel>
					<SidebarGroupContent>
						<MenuGroup items={CATALOG_MENU} pathname={pathname} />
					</SidebarGroupContent>
				</SidebarGroup>

				<SidebarGroup>
					<SidebarGroupLabel>Hệ Thống</SidebarGroupLabel>
					<SidebarGroupContent>
						<MenuGroup items={SYSTEM_MENU} pathname={pathname} />
					</SidebarGroupContent>
				</SidebarGroup>
			</SidebarContent>

			{/* Footer */}
			<SidebarFooter className="p-3 group-data-[collapsible=icon]:hidden">
				<div className="rounded-lg border border-border/50 p-3">
					<p className="text-xs font-medium text-muted-foreground">
						Smart PC Store v1.0
					</p>
				</div>
			</SidebarFooter>

			<SidebarRail />
		</Sidebar>
	);
}
