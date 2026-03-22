"use client"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { useAuthStore } from "@/stores/useAuthStore"

import { Bell, LogOut, Search, Store } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

// ─── Route Label Map ────────────────────────────────────────────────────────

const ROUTE_LABELS: Record<string, string> = {
  admin: "Dashboard",
  users: "Người Dùng",
  products: "Sản Phẩm",
  categories: "Danh Mục",
  orders: "Đơn Hàng",
  suppliers: "Nhà Cung Cấp",
  "nhap-hang": "Nhập Hàng",
}

// ─── Component ──────────────────────────────────────────────────────────────

export default function AdminHeader() {
  const pathname = usePathname()
  const segments = pathname.split("/").filter(Boolean)
  const { user, logout } = useAuthStore()

  const breadcrumbs = segments.map((segment, index) => ({
    label: ROUTE_LABELS[segment] ?? segment,
    href: "/" + segments.slice(0, index + 1).join("/"),
    isLast: index === segments.length - 1,
  }))

  return (
    <header className="border-border flex h-14 shrink-0 items-center gap-3 border-b px-4">
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
                  <BreadcrumbPage className="font-medium">{crumb.label}</BreadcrumbPage>
                </BreadcrumbItem>
              ) : (
                <>
                  <BreadcrumbItem>
                    <BreadcrumbLink href={crumb.href}>{crumb.label}</BreadcrumbLink>
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
        <Search className="text-muted-foreground absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2" />
        <Input placeholder="Tìm kiếm..." className="bg-muted/50 h-8 w-50 pl-8 text-sm lg:w-65" />
      </div>

      {/* Notifications */}
      <Button variant="ghost" size="icon" className="size-8">
        <Bell className="size-4" />
      </Button>

      <Separator orientation="vertical" className="h-4" />

      {/* User Dropdown */}
      <div className="group relative">
        <button className="hover:bg-accent flex items-center gap-2 rounded-lg px-1.5 py-1 transition-colors">
          <Avatar className="border-border/50 size-7 border">
            <AvatarFallback className="bg-primary/20 text-primary text-xs font-semibold">
              {user?.name?.charAt(0).toUpperCase() ?? "A"}
            </AvatarFallback>
          </Avatar>
          <span className="hidden text-sm font-medium md:block">{user?.name ?? "Admin"}</span>
        </button>

        <div className="border-border/60 bg-popover/95 invisible absolute top-full right-0 z-50 mt-2 w-48 rounded-xl border p-1.5 opacity-0 shadow-xl shadow-black/10 backdrop-blur-xl transition-all duration-200 group-hover:visible group-hover:opacity-100">
          {/* Profile header */}
          <div className="mb-1 px-3 py-2">
            <span className="block truncate text-sm font-medium">{user?.name ?? "Admin"}</span>
            <span className="text-muted-foreground block truncate text-[11px]">
              {user?.email ?? ""}
            </span>
          </div>

          <div className="bg-border/50 my-1 h-px" />

          {/* Menu items */}
          <Link
            href="/"
            className="text-popover-foreground/90 hover:bg-accent hover:text-accent-foreground flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors"
          >
            <Store className="text-muted-foreground size-4 shrink-0" />
            Về Trang Khách
          </Link>

          <div className="bg-border/50 my-1 h-px" />

          {/* Logout */}
          <button
            onClick={async () => {
              await logout()
              window.location.href = "/dang-nhap"
            }}
            className="text-destructive hover:bg-destructive/10 flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm font-medium transition-colors"
          >
            <LogOut className="size-4 shrink-0" />
            Đăng Xuất
          </button>
        </div>
      </div>
    </header>
  )
}
