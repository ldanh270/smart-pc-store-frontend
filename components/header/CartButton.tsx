"use client"

import { cn } from "@/lib/utils"
import { useAuthStore } from "@/stores/useAuthStore"
import { useCartStore } from "@/stores/useCartStore"

import { useEffect } from "react"

import { ShoppingBag } from "lucide-react"
import Link from "next/link"

export default function CartButton() {
  const totalItems = useCartStore((state) => state.totalItems)
  const fetchCart = useCartStore((state) => state.fetchCart)
  const accessToken = useAuthStore((state) => state.accessToken)

  useEffect(() => {
    if (accessToken) fetchCart()
  }, [accessToken, fetchCart])

  return (
    <Link
      href="/gio-hang"
      className={cn(
        "group relative flex h-9 w-9 items-center justify-center rounded-lg",
        "border-border/60 bg-muted/40 text-muted-foreground border",
        "hover:border-primary/40 hover:bg-primary/8 hover:text-primary transition-all duration-200",
      )}
      aria-label="Giỏ hàng"
    >
      <ShoppingBag className="size-4 transition-transform group-hover:scale-110" />

      {/* Badge */}
      <span
        className={cn(
          "absolute -top-1.5 -right-1.5 flex min-h-4.5 min-w-4.5 items-center justify-center rounded-full",
          "bg-primary text-primary-foreground px-1 text-[10px] leading-none font-bold",
          "shadow-primary/30 ring-background shadow-lg ring-2",
          "transition-transform",
          totalItems > 0 ? "scale-100" : "scale-75 opacity-70",
        )}
      >
        {totalItems > 99 ? "99+" : totalItems}
      </span>
    </Link>
  )
}
