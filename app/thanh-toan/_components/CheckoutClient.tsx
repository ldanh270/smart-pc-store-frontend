"use client"

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { orderService } from "@/services/orderService"
import { productService } from "@/services/productService"
import { useAuthStore } from "@/stores/useAuthStore"
import { useCartStore } from "@/stores/useCartStore"
import { CartItem } from "@/types/cart"

import { useEffect, useState } from "react"

import { ChevronRight, Loader2, ShoppingBag } from "lucide-react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { toast } from "sonner"

export default function CheckoutClient() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { items, totalPrice, totalItems, isLoading, fetchCart } = useCartStore()
  const accessToken = useAuthStore((state) => state.accessToken)
  const [isCreating, setIsCreating] = useState(false)

  const isBuyNow = searchParams.get("buyNow") === "true"
  const [buyNowItem, setBuyNowItem] = useState<CartItem | null>(null)
  const [isBuyNowLoading, setIsBuyNowLoading] = useState(isBuyNow)

  const isLoggedIn = !!accessToken

  const buyNowProductId = searchParams.get("productId")
  const buyNowQuantity = searchParams.get("quantity")

  useEffect(() => {
    if (!isLoggedIn) return

    if (isBuyNow && buyNowProductId && buyNowQuantity) {
      const fetchBuyNowProduct = async () => {
        try {
          setIsBuyNowLoading(true)
          const product = await productService.getProduct(buyNowProductId)
          const qty = Number(buyNowQuantity)

          setBuyNowItem({
            cartItemId: -1,
            productId: product.id,
            productName: product.productName,
            price: product.currentPrice,
            quantity: qty,
            subtotal: product.currentPrice * qty,
            stockQuantity: product.quantity,
          })
        } catch {
          toast.error("Không thể tải thông tin sản phẩm.")
        } finally {
          setIsBuyNowLoading(false)
        }
      }

      fetchBuyNowProduct()
    } else {
      fetchCart()
    }
  }, [isLoggedIn, fetchCart, isBuyNow, buyNowProductId, buyNowQuantity])

  const displayItems = isBuyNow ? (buyNowItem ? [buyNowItem] : []) : items
  const displayTotalItems = isBuyNow ? buyNowItem?.quantity || 0 : totalItems
  const displayTotalPrice = isBuyNow ? buyNowItem?.subtotal || 0 : totalPrice
  const displayLoading = isBuyNow ? isBuyNowLoading : isLoading

  const handleConfirmOrder = async () => {
    setIsCreating(true)
    try {
      const paymentInfo = await orderService.purchase(displayItems)
      sessionStorage.setItem("pendingPayment", JSON.stringify(paymentInfo))
      router.push("/thanh-toan/payment")
    } catch {
      toast.error("Không thể tạo đơn hàng. Vui lòng thử lại.")
      setIsCreating(false)
    }
  }

  if (!isLoggedIn) {
    return (
      <main className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
        <div className="flex flex-col items-center justify-center py-24">
          <p className="text-muted-foreground mb-4 text-center">
            Vui lòng đăng nhập để tiếp tục thanh toán.
          </p>
          <Button asChild>
            <Link href="/dang-nhap">Đăng nhập</Link>
          </Button>
        </div>
      </main>
    )
  }

  if (displayLoading) {
    return (
      <main className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
        <CheckoutBreadcrumb />
        <div className="flex flex-col gap-8 lg:flex-row">
          <div className="flex-1 space-y-3">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-20 w-full rounded-lg" />
            ))}
          </div>
          <Skeleton className="h-80 w-full shrink-0 rounded-lg lg:w-80" />
        </div>
      </main>
    )
  }

  if (!displayLoading && displayItems.length === 0) {
    return (
      <main className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
        <CheckoutBreadcrumb />
        <div className="flex flex-col items-center justify-center py-24">
          <p className="text-muted-foreground mb-4 text-center">
            Giỏ hàng trống. Vui lòng thêm sản phẩm trước khi thanh toán.
          </p>
          <Button asChild>
            <Link href="/">Tiếp tục mua hàng</Link>
          </Button>
        </div>
      </main>
    )
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
      <CheckoutBreadcrumb />

      <h1 className="text-foreground mb-6 font-sans text-2xl font-bold tracking-wide uppercase">
        Xác Nhận Đơn Hàng
      </h1>

      <div className="flex flex-col gap-8 lg:flex-row">
        {/* Product list */}
        <div className="flex-1 space-y-3">
          <p className="text-muted-foreground text-sm font-semibold tracking-wider uppercase">
            Sản phẩm ({displayTotalItems})
          </p>
          <div className="divide-border border-border bg-card divide-y rounded-xl border">
            {displayItems.map((item) => (
              <div key={item.cartItemId} className="flex items-center gap-4 p-4">
                <div className="bg-muted text-muted-foreground flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-sm font-bold">
                  {item.quantity}x
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-foreground truncate font-sans text-sm font-medium">
                    {item.productName}
                  </p>
                  <p className="text-muted-foreground mt-0.5 font-mono text-xs">
                    {item.price.toLocaleString("vi-VN")}đ / cái
                  </p>
                </div>
                <span className="text-foreground shrink-0 font-mono text-sm font-semibold">
                  {item.subtotal.toLocaleString("vi-VN")}đ
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Order summary sidebar */}
        <aside className="w-full shrink-0 lg:w-80">
          <div className="border-border bg-card sticky top-36 rounded-xl border p-5">
            <p className="text-muted-foreground mb-4 text-sm font-semibold tracking-wider uppercase">
              Tóm tắt đơn hàng
            </p>

            <div className="space-y-2.5">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">
                  Tạm tính ({displayTotalItems} sản phẩm)
                </span>
                <span className="font-mono">{displayTotalPrice.toLocaleString("vi-VN")}đ</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Phí vận chuyển</span>
                <span className="font-medium text-emerald-600">Miễn phí</span>
              </div>
            </div>

            <Separator className="my-4" />

            <div className="mb-5 flex items-center justify-between">
              <span className="text-foreground font-sans font-semibold">Thành tiền</span>
              <span className="text-primary font-mono text-xl font-bold">
                {displayTotalPrice.toLocaleString("vi-VN")}đ
              </span>
            </div>

            {/* Payment method note */}
            <div className="border-border bg-muted/40 mb-4 flex items-start gap-2.5 rounded-lg border p-3">
              <ShoppingBag className="text-muted-foreground mt-0.5 h-4 w-4 shrink-0" />
              <p className="text-muted-foreground text-xs leading-relaxed">
                Thanh toán qua QR banking. Đơn hàng được xác nhận ngay sau khi nhận được tiền.
              </p>
            </div>

            <Button
              size="lg"
              className="w-full font-sans text-sm font-bold tracking-wider uppercase"
              onClick={handleConfirmOrder}
              disabled={isCreating || displayTotalItems === 0}
            >
              {isCreating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Đang xử lý...
                </>
              ) : (
                "Xác Nhận & Thanh Toán"
              )}
            </Button>

            <Button variant="ghost" size="sm" className="text-muted-foreground mt-2 w-full" asChild>
              <Link href="/gio-hang">Quay lại giỏ hàng</Link>
            </Button>
          </div>
        </aside>
      </div>
    </main>
  )
}

function CheckoutBreadcrumb() {
  return (
    <nav
      aria-label="Breadcrumb"
      className="text-muted-foreground mb-6 flex items-center gap-1.5 text-sm"
    >
      <Link href="/" className="hover:text-foreground transition-colors">
        Trang chủ
      </Link>
      <ChevronRight className="h-3.5 w-3.5" />
      <Link href="/gio-hang" className="hover:text-foreground transition-colors">
        Giỏ hàng
      </Link>
      <ChevronRight className="h-3.5 w-3.5" />
      <span className="text-foreground font-medium">Thanh toán</span>
    </nav>
  )
}
