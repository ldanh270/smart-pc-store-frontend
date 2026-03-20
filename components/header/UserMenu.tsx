"use client"

import { cn } from "@/lib/utils"
import { useAuthStore } from "@/stores/useAuthStore"

import { ChevronDown, LayoutDashboard, LogOut, Package, Settings } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function UserMenu() {
  const router = useRouter()
  const { user, logout } = useAuthStore()
  const isAdmin = user?.role?.toUpperCase() === "ADMIN"

  const menuItems = [
    { href: "/tai-khoan", icon: Settings, label: "Tài khoản" },
    { href: "/don-hang", icon: Package, label: "Đơn hàng của tôi" },
    ...(isAdmin ? [{ href: "/admin", icon: LayoutDashboard, label: "Quản lý" }] : []),
  ]

  // Avatar initials
  const initials = user?.name
    ? user.name
        .split(" ")
        .map((w: string) => w[0])
        .slice(-2)
        .join("")
        .toUpperCase()
    : "U"

  return (
    <div className="group relative">
      {/* Trigger button */}
      <button
        type="button"
        className={cn(
          "flex h-9 cursor-pointer items-center gap-2 rounded-lg px-2.5",
          "border-border/60 bg-muted/40 text-foreground border text-sm font-medium",
          "hover:border-primary/40 hover:bg-primary/8 hover:text-primary transition-all duration-200",
        )}
      >
        {/* Avatar */}
        <div className="bg-primary/20 text-primary flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold">
          {initials}
        </div>
        <span className="hidden max-w-20 truncate text-xs font-semibold sm:block">
          {user?.name?.split(" ").pop() || "Account"}
        </span>
        <ChevronDown className="size-3 opacity-50 transition-transform duration-200 group-hover:rotate-180" />
      </button>

      {/* Dropdown */}
      <div className="border-border/60 bg-popover/95 invisible absolute top-full right-0 z-50 mt-2 min-w-56 rounded-xl border p-1.5 opacity-0 shadow-xl shadow-black/10 backdrop-blur-xl transition-all duration-200 group-hover:visible group-hover:opacity-100">
        {/* Profile header */}
        <div className="bg-muted/50 mb-1 flex items-center gap-3 rounded-lg px-3 py-2.5">
          <div className="bg-primary/20 text-primary flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold">
            {initials}
          </div>
          <div className="overflow-hidden">
            <p className="text-foreground truncate text-xs font-semibold">
              {user?.name || "Người dùng"}
            </p>
            <p className="text-muted-foreground truncate text-[10px]">
              {user?.role?.toLowerCase() === "admin" ? "Quản trị viên" : "Khách hàng"}
            </p>
          </div>
        </div>

        <div className="bg-border/50 my-1 h-px" />

        {/* Menu items */}
        {menuItems.map((item) => {
          const Icon = item.icon
          return (
            <Link
              key={item.href}
              href={item.href}
              className="text-popover-foreground/80 hover:bg-accent hover:text-accent-foreground flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors"
            >
              <Icon className="text-muted-foreground size-3.5 shrink-0" />
              {item.label}
            </Link>
          )
        })}

        <div className="bg-border/50 my-1 h-px" />

        {/* Logout */}
        <button
          onClick={async () => {
            await logout()
            router.push("/")
          }}
          className="text-destructive hover:bg-destructive/10 flex w-full cursor-pointer items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm transition-colors"
        >
          <LogOut className="size-3.5 shrink-0" />
          Đăng xuất
        </button>
      </div>
    </div>
  )
}
