"use client"

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { useCartStore } from "@/stores/useCartStore"

import Link from "next/link"

export default function CartSummary() {
  const { totalPrice, totalItems } = useCartStore()

  return (
    <div className="border-border bg-card rounded-lg border p-5">
      {/* Subtotal */}
      <div className="flex items-center justify-between">
        <span className="text-muted-foreground text-sm">Tạm tính:</span>
        <span className="text-foreground font-mono text-base font-semibold">
          {totalPrice.toLocaleString("vi-VN")}đ
        </span>
      </div>

      <Separator className="my-4" />

      {/* Grand Total */}
      <div className="flex items-center justify-between">
        <span className="text-foreground font-sans text-base font-semibold">Thành tiền:</span>
        <span className="text-primary font-mono text-xl font-bold">
          {totalPrice.toLocaleString("vi-VN")}đ
        </span>
      </div>

      <Separator className="my-4" />

      {/* CTA Buttons */}
      <div className="flex flex-col gap-3">
        <Button
          size="lg"
          className="w-full font-sans text-sm font-bold tracking-wider uppercase"
          disabled={totalItems === 0}
          asChild={totalItems > 0}
        >
          {totalItems > 0 ? (
            <Link href="/thanh-toan">Thanh Toán Ngay</Link>
          ) : (
            <span>Thanh Toán Ngay</span>
          )}
        </Button>
        <Button
          variant="outline"
          size="lg"
          className="w-full font-sans text-sm font-medium tracking-wider uppercase"
          asChild
        >
          <Link href="/">Tiếp Tục Mua Hàng</Link>
        </Button>
      </div>
    </div>
  )
}
