"use client"

import { Button } from "@/components/ui/button"
import { useAuthStore } from "@/stores/useAuthStore"
import { useCartStore } from "@/stores/useCartStore"

import { useState } from "react"

import { Loader2, LogIn, ShoppingCart, Zap } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

interface AddToCartButtonProps {
  productId: string
  quantity: number
  isInStock: boolean
}

export default function AddToCartButton({ productId, quantity, isInStock }: AddToCartButtonProps) {
  const [isAdding, setIsAdding] = useState(false)
  const [isBuying, setIsBuying] = useState(false)
  const addItem = useCartStore((state) => state.addItem)
  const accessToken = useAuthStore((state) => state.accessToken)
  const isLoggedIn = !!accessToken
  const router = useRouter()

  if (!isLoggedIn) {
    return (
      <Button asChild className="h-12 w-full gap-2 text-base font-semibold">
        <Link href="/dang-nhap">
          <LogIn className="h-5 w-5" />
          Đăng nhập để mua hàng
        </Link>
      </Button>
    )
  }

  const handleAddToCart = async () => {
    setIsAdding(true)
    await addItem(productId, quantity)
    setIsAdding(false)
  }

  const handleBuyNow = () => {
    setIsBuying(true)
    router.push(`/thanh-toan?buyNow=true&productId=${productId}&quantity=${quantity}`)
  }

  const isDisabled = !isInStock || isAdding || isBuying

  return (
    <div className="flex gap-3">
      <Button
        onClick={handleAddToCart}
        disabled={isDisabled}
        variant="outline"
        className="h-12 flex-1 gap-2 text-base font-semibold"
      >
        {isAdding ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" />
            Đang thêm...
          </>
        ) : !isInStock ? (
          "Hết hàng"
        ) : (
          <>
            <ShoppingCart className="h-5 w-5" />
            Thêm vào giỏ
          </>
        )}
      </Button>

      <Button
        onClick={handleBuyNow}
        disabled={isDisabled}
        className="h-12 flex-1 gap-2 text-base font-semibold"
      >
        {isBuying ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" />
            Đang xử lý...
          </>
        ) : (
          <>
            <Zap className="h-5 w-5" />
            Mua Ngay
          </>
        )}
      </Button>
    </div>
  )
}
