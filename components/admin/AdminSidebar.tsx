"use client"

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
} from "@/components/ui/sidebar"

import {
  LayoutDashboard,
  Package,
  PackagePlus,
  ShoppingCart,
  Tags,
  Truck,
  Users,
  Zap,
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

// ─── Sidebar Menu Config ────────────────────────────────────────────────────

interface AdminMenuItem {
  label: string
  href: string
  icon: React.ComponentType<{ className?: string }>
}

const MAIN_MENU: AdminMenuItem[] = [
  { label: "Tổng Quan", href: "/quan-ly", icon: LayoutDashboard },
  { label: "Đơn Hàng", href: "/quan-ly/don-hang", icon: ShoppingCart },
]

const CATALOG_MENU: AdminMenuItem[] = [
  { label: "Sản Phẩm", href: "/quan-ly/san-pham", icon: Package },
  { label: "Danh Mục", href: "/quan-ly/danh-muc", icon: Tags },
  { label: "Nhà Cung Cấp", href: "/quan-ly/nha-cung-cap", icon: Truck },
  { label: "Nhập Hàng", href: "/quan-ly/nhap-hang", icon: PackagePlus },
]

const SYSTEM_MENU: AdminMenuItem[] = [
  { label: "Người Dùng", href: "/quan-ly/nguoi-dung", icon: Users },
]

// ─── Menu Renderer ──────────────────────────────────────────────────────────

function MenuGroup({ items, pathname }: { items: AdminMenuItem[]; pathname: string }) {
  return (
    <SidebarMenu>
      {items.map((item) => {
        const isActive =
          pathname === item.href || (item.href !== "/quan-ly" && pathname.startsWith(item.href))

        return (
          <SidebarMenuItem key={item.href}>
            <SidebarMenuButton asChild isActive={isActive} tooltip={item.label}>
              <Link href={item.href}>
                <item.icon className="size-4" />
                <span>{item.label}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        )
      })}
    </SidebarMenu>
  )
}

// ─── Component ──────────────────────────────────────────────────────────────

export default function AdminSidebar() {
  const pathname = usePathname()

  return (
    <Sidebar collapsible="icon" variant="sidebar">
      {/* Brand */}
      {/* Brand */}
      <SidebarHeader className="border-border flex h-14 flex-row items-center justify-start border-b p-0 px-4 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0">
        <Link
          href="/quan-ly"
          className="flex w-full items-center justify-start gap-2.5 group-data-[collapsible=icon]:justify-center"
        >
          <div className="bg-primary/10 flex size-8 shrink-0 items-center justify-center rounded-lg">
            <Zap className="text-primary size-4.5" fill="currentColor" />
          </div>
          <span className="text-lg font-bold tracking-tight group-data-[collapsible=icon]:hidden">
            <span className="text-foreground">Smart</span>
            <span className="text-foreground"> PC</span>
          </span>
        </Link>
      </SidebarHeader>

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
        <div className="border-border/50 rounded-lg border p-3">
          <p className="text-muted-foreground text-xs font-medium">Smart PC Store v1.0</p>
        </div>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  )
}
