"use client"

import { Button } from "@/components/ui/button"
import { useCartStore } from "@/stores/useCartStore"
import { CartItem } from "@/types/cart"

import { Minus, Plus, Trash2 } from "lucide-react"
import { toast } from "sonner"

interface CartItemRowProps {
  item: CartItem
}

export default function CartItemRow({ item }: CartItemRowProps) {
  const { updateQuantity, removeItem } = useCartStore()

  const isMinQuantity = item.quantity <= 1
  const isMaxQuantity = item.quantity >= item.stockQuantity

  function handleDecrease() {
    if (isMinQuantity) return
    updateQuantity(item.cartItemId, item.quantity - 1)
  }

  function handleIncrease() {
    if (isMaxQuantity) {
      toast.error("Không đủ hàng trong kho")
      return
    }
    updateQuantity(item.cartItemId, item.quantity + 1)
  }

  function handleRemove() {
    removeItem(item.cartItemId)
  }

  return (
    <div className="border-border flex items-center gap-4 border-b py-5 last:border-b-0 sm:gap-6">
      {/* Product Image Placeholder */}
      <div className="bg-muted flex size-20 shrink-0 items-center justify-center rounded-md sm:size-24">
        <span className="text-muted-foreground text-xs">Ảnh</span>
      </div>

      {/* Product Info */}
      <div className="flex min-w-0 flex-1 flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        {/* Name */}
        <div className="min-w-0 flex-1">
          <h3 className="text-foreground truncate font-sans text-sm font-semibold sm:text-base">
            {item.productName}
          </h3>
          <p className="text-muted-foreground mt-0.5 font-mono text-sm">
            {item.price.toLocaleString("vi-VN")}đ
          </p>
        </div>

        {/* Quantity Controls */}
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="border-border flex items-center rounded-md border">
            <Button
              variant="ghost"
              size="icon"
              className="size-8 rounded-none rounded-l-md"
              onClick={handleDecrease}
              disabled={isMinQuantity}
              aria-label="Giảm số lượng"
            >
              <Minus className="size-3.5" />
            </Button>
            <span className="text-foreground flex w-10 items-center justify-center font-mono text-sm font-medium">
              {item.quantity}
            </span>
            <Button
              variant="ghost"
              size="icon"
              className="size-8 rounded-none rounded-r-md"
              onClick={handleIncrease}
              aria-label="Tăng số lượng"
            >
              <Plus className="size-3.5" />
            </Button>
          </div>

          {/* Subtotal */}
          <span className="text-foreground min-w-20 text-right font-mono text-sm font-bold sm:min-w-28 sm:text-base">
            {item.subtotal.toLocaleString("vi-VN")}đ
          </span>

          {/* Remove */}
          <Button
            variant="ghost"
            size="icon"
            className="text-muted-foreground hover:text-destructive size-8 shrink-0"
            onClick={handleRemove}
            aria-label="Xóa sản phẩm"
          >
            <Trash2 className="size-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
