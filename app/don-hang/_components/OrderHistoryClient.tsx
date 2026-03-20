"use client"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { cn, formatPrice } from "@/lib/utils"
import { orderService } from "@/services/orderService"
import { useAuthStore } from "@/stores/useAuthStore"
import { MyOrder, OrderDetailView, OrderStatus } from "@/types/order"
import { slugify } from "@/types/product"

import { useCallback, useEffect, useRef, useState } from "react"

import {
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Clock,
  ExternalLink,
  Loader2,
  Package,
  RefreshCw,
  ShoppingBag,
  XCircle,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { toast } from "sonner"

// ─── Status helpers ───────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<
  OrderStatus,
  {
    label: string
    icon: React.ElementType
    className: string
    badgeVariant: "default" | "secondary" | "destructive" | "outline"
  }
> = {
  PENDING: {
    label: "Chờ thanh toán",
    icon: Clock,
    className: "text-amber-600 bg-amber-50 border-amber-200",
    badgeVariant: "outline",
  },
  PAID: {
    label: "Đã thanh toán",
    icon: CheckCircle2,
    className: "text-emerald-600 bg-emerald-50 border-emerald-200",
    badgeVariant: "default",
  },
  CANCELLED: {
    label: "Đã huỷ",
    icon: XCircle,
    className: "text-red-600 bg-red-50 border-red-200",
    badgeVariant: "destructive",
  },
  EXPIRED: {
    label: "Hết hạn",
    icon: XCircle,
    className: "text-gray-600 bg-gray-50 border-gray-200",
    badgeVariant: "outline",
  },
}

function StatusBadge({ status }: { status: OrderStatus }) {
  const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.PENDING
  const Icon = cfg.icon
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold",
        cfg.className,
      )}
    >
      <Icon className="h-3.5 w-3.5" />
      {cfg.label}
    </span>
  )
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("vi-VN", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

// ─── Order Detail Dialog ──────────────────────────────────────────────────────

function OrderDetailDialog({
  orderId,
  open,
  onClose,
  onPaymentSuccess,
}: {
  orderId: string | null
  open: boolean
  onClose: () => void
  onPaymentSuccess?: () => void
}) {
  const [detail, setDetail] = useState<OrderDetailView | null>(null)
  const [loading, setLoading] = useState(false)

  const [timeLeft, setTimeLeft] = useState(0)
  const [paymentMessage, setPaymentMessage] = useState("")

  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const clearTimers = useCallback(() => {
    if (pollRef.current) clearInterval(pollRef.current)
    if (countdownRef.current) clearInterval(countdownRef.current)
    pollRef.current = null
    countdownRef.current = null
  }, [])

  useEffect(() => {
    if (!open || !orderId) {
      clearTimers()
      return
    }

    const timer = setTimeout(() => {
      setDetail(null)
      setLoading(true)
      orderService
        .getOrderDetail(orderId)
        .then((data) => {
          setDetail(data)
          if (data.order.status === "PENDING") {
            const TIMEOUT_SECONDS = 5 * 60
            const expireAt = new Date(data.order.createdAt).getTime() + TIMEOUT_SECONDS * 1000

            countdownRef.current = setInterval(() => {
              const now = Date.now()
              const remaining = Math.max(0, Math.floor((expireAt - now) / 1000))
              setTimeLeft(remaining)
              if (remaining <= 0) clearTimers()
            }, 1000)

            pollRef.current = setInterval(async () => {
              try {
                const result = await orderService.checkTransaction(data.order.transactionCode)
                setPaymentMessage(result.message)
                if (result.completed) {
                  clearTimers()
                  toast.success("Thanh toán thành công!")
                  setDetail((prev) =>
                    prev
                      ? { ...prev, order: { ...prev.order, status: "PAID" as OrderStatus } }
                      : null,
                  )
                  if (onPaymentSuccess) onPaymentSuccess()
                }
              } catch {
                // ignore network errors during poll
              }
            }, 3000)
          }
        })
        .catch(() => toast.error("Không thể tải chi tiết đơn hàng"))
        .finally(() => setLoading(false))
    }, 0)

    return () => {
      clearTimers()
      clearTimeout(timer)
    }
  }, [open, orderId, clearTimers, onPaymentSuccess])

  const total = detail?.items?.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0) ?? 0

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-base">
            <Package className="text-primary h-4 w-4" />
            Chi tiết đơn hàng
          </DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className="space-y-3 py-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-12 w-full rounded-lg" />
            ))}
          </div>
        ) : detail ? (
          <div className="space-y-4">
            {/* Order Meta */}
            <div className="border-border bg-muted/30 grid grid-cols-2 gap-3 rounded-xl border p-3 text-sm">
              <div>
                <p className="text-muted-foreground text-xs">Mã đơn hàng</p>
                <p className="font-mono font-semibold tracking-wider">{detail.order.orderCode}</p>
              </div>
              <div>
                <p className="text-muted-foreground text-xs">Trạng thái</p>
                <StatusBadge status={detail.order.status} />
              </div>
              <div>
                <p className="text-muted-foreground text-xs">Mã giao dịch</p>
                <p className="font-mono text-xs font-medium tracking-widest">
                  {detail.order.transactionCode}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground text-xs">Ngày đặt</p>
                <p className="text-xs font-medium">{formatDate(detail.order.createdAt)}</p>
              </div>
            </div>

            {/* Payment QR Area for Pending Orders */}
            {detail.order.status === "PENDING" && detail.qrCode && timeLeft > 0 && (
              <div className="border-primary/50 bg-primary/5 rounded-xl border-2 border-dashed p-4 text-center">
                <p className="text-foreground mb-3 text-sm font-semibold">
                  Tiếp tục thanh toán bằng mã QR
                </p>
                <div className="flex flex-col items-center justify-center gap-2">
                  <div className="inline-block rounded-xl border bg-white p-2 shadow-sm">
                    <Image
                      src={detail.qrCode}
                      alt="QR Thanh toán"
                      width={180}
                      height={180}
                      unoptimized
                      className="mx-auto"
                    />
                  </div>
                </div>

                <div className="mt-3 mb-2 flex items-center justify-center gap-2 font-mono text-lg font-bold text-red-500">
                  <Clock className="h-5 w-5" />
                  {Math.floor(timeLeft / 60)
                    .toString()
                    .padStart(2, "0")}
                  :{(timeLeft % 60).toString().padStart(2, "0")}
                </div>
                <div className="text-muted-foreground flex items-center justify-center gap-2 text-xs">
                  <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                  <span>{paymentMessage || "Đang chờ xác nhận thanh toán..."}</span>
                </div>
              </div>
            )}

            {detail.order.status === "PENDING" && timeLeft <= 0 && (
              <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-center text-sm text-red-600">
                <XCircle className="mx-auto mb-2 h-8 w-8 text-red-500" />
                <p>Mã QR thanh toán này đã hết hạn (5 phút).</p>
              </div>
            )}

            {/* Items */}
            {detail.items && detail.items.length > 0 && (
              <div>
                <p className="text-muted-foreground mb-2 text-xs font-semibold tracking-wider uppercase">
                  Sản phẩm ({detail.items.length})
                </p>
                <div className="divide-border border-border divide-y rounded-xl border">
                  {detail.items.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between gap-3 px-4 py-3"
                    >
                      <div className="min-w-0 flex-1">
                        <Link
                          href={`/san-pham/${slugify(item.productName)}-${item.productId}`}
                          className="text-foreground hover:text-primary flex items-center gap-1 text-sm font-medium transition-colors"
                        >
                          <span className="line-clamp-1">{item.productName}</span>
                          <ExternalLink className="h-3 w-3 shrink-0 opacity-50" />
                        </Link>
                        <p className="text-muted-foreground mt-0.5 text-xs">
                          {formatPrice(item.unitPrice)} × {item.quantity}
                        </p>
                      </div>
                      <span className="text-foreground shrink-0 font-mono text-sm font-semibold">
                        {formatPrice(item.unitPrice * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <Separator />

            {/* Total */}
            <div className="flex items-center justify-between px-1">
              <span className="font-semibold">Tổng cộng</span>
              <span className="text-primary font-mono text-lg font-bold">{formatPrice(total)}</span>
            </div>
          </div>
        ) : (
          <p className="text-muted-foreground py-6 text-center text-sm">Không có dữ liệu</p>
        )}
      </DialogContent>
    </Dialog>
  )
}

// ─── Order Card ───────────────────────────────────────────────────────────────

function OrderCard({
  order,
  onViewDetail,
  onCancel,
  cancelling,
}: {
  order: MyOrder
  onViewDetail: (id: string) => void
  onCancel: (id: string) => void
  cancelling: string | null
}) {
  const canCancel = order.status === "PENDING"

  return (
    <div className="border-border bg-card rounded-xl border transition-shadow hover:shadow-md">
      {/* Header */}
      <div className="border-border flex flex-wrap items-center justify-between gap-3 border-b px-5 py-3">
        <div className="flex items-center gap-2.5">
          <Package className="text-muted-foreground h-4 w-4" />
          <span className="text-foreground font-mono text-sm font-semibold tracking-wider">
            {order.orderCode}
          </span>
        </div>
        <StatusBadge status={order.status} />
      </div>

      {/* Body */}
      <div className="px-5 py-4">
        <div className="grid grid-cols-2 gap-4 text-sm sm:grid-cols-3">
          <div>
            <p className="text-muted-foreground text-xs">Số tiền</p>
            <p className="text-primary mt-0.5 font-mono font-bold">{formatPrice(order.amount)}</p>
          </div>
          <div>
            <p className="text-muted-foreground text-xs">Mã giao dịch</p>
            <p className="mt-0.5 font-mono text-xs font-semibold tracking-wider">
              {order.transactionCode}
            </p>
          </div>
          <div className="col-span-2 sm:col-span-1">
            <p className="text-muted-foreground text-xs">Ngày đặt</p>
            <p className="mt-0.5 text-xs font-medium">{formatDate(order.createdAt)}</p>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="border-border flex items-center justify-end gap-2 border-t px-5 py-3">
        {canCancel && (
          <Button
            variant="ghost"
            size="sm"
            className="text-destructive hover:bg-destructive/10 hover:text-destructive"
            disabled={cancelling === order.id}
            onClick={() => onCancel(order.id)}
          >
            {cancelling === order.id ? (
              <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
            ) : (
              <XCircle className="mr-1.5 h-3.5 w-3.5" />
            )}
            Huỷ đơn
          </Button>
        )}
        <Button variant="outline" size="sm" onClick={() => onViewDetail(order.orderCode)}>
          <ExternalLink className="mr-1.5 h-3.5 w-3.5" />
          Xem chi tiết
        </Button>
      </div>
    </div>
  )
}

// ─── Filter bar ───────────────────────────────────────────────────────────────

const FILTER_OPTIONS: { value: OrderStatus | "ALL"; label: string }[] = [
  { value: "ALL", label: "Tất cả" },
  { value: "PENDING", label: "Chờ thanh toán" },
  { value: "PAID", label: "Đã thanh toán" },
  { value: "CANCELLED", label: "Đã huỷ" },
  { value: "EXPIRED", label: "Hết hạn" },
]

// ─── Main Component ───────────────────────────────────────────────────────────

export default function OrderHistoryClient() {
  const accessToken = useAuthStore((state) => state.accessToken)
  const isLoggedIn = !!accessToken

  const [orders, setOrders] = useState<MyOrder[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [filter, setFilter] = useState<OrderStatus | "ALL">("ALL")
  const [detailId, setDetailId] = useState<string | null>(null)
  const [cancelling, setCancelling] = useState<string | null>(null)
  const [page, setPage] = useState(0)
  const [hasMore, setHasMore] = useState(true)
  const PAGE_SIZE = 10

  const fetchOrders = async (reset = false) => {
    if (!isLoggedIn) return
    setIsLoading(true)
    try {
      const currentPage = reset ? 0 : page
      const data = await orderService.getMyOrders({
        page: currentPage,
        size: PAGE_SIZE,
      })
      setOrders((prev) => (reset ? data : [...prev, ...data]))
      setHasMore(data.length === PAGE_SIZE)
      if (!reset) setPage((p) => p + 1)
      else setPage(1)
    } catch {
      toast.error("Không thể tải lịch sử đơn hàng")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchOrders(true)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoggedIn])

  const handleCancel = async (orderId: string) => {
    setCancelling(orderId)
    try {
      await orderService.cancelOrder(orderId)
      toast.success("Đã huỷ đơn hàng")
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: "CANCELLED" as OrderStatus } : o)),
      )
    } catch {
      toast.error("Không thể huỷ đơn hàng. Vui lòng thử lại.")
    } finally {
      setCancelling(null)
    }
  }

  const filtered = filter === "ALL" ? orders : orders.filter((o) => o.status === filter)

  // ── Not logged in ────────────────────────────────────────────────────────

  if (!isLoggedIn) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 px-4 text-center">
        <ShoppingBag className="text-muted-foreground/40 h-14 w-14" />
        <div>
          <h3 className="text-lg font-semibold">Vui lòng đăng nhập</h3>
          <p className="text-muted-foreground mt-1 text-sm">
            Bạn cần đăng nhập để xem lịch sử đơn hàng.
          </p>
        </div>
        <Button asChild>
          <Link href="/dang-nhap">Đăng nhập ngay</Link>
        </Button>
      </div>
    )
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-8 lg:px-8">
      {/* Breadcrumb */}
      <nav className="text-muted-foreground mb-6 flex items-center gap-1.5 text-sm">
        <Link href="/" className="hover:text-foreground transition-colors">
          Trang chủ
        </Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <Link href="/tai-khoan" className="hover:text-foreground transition-colors">
          Tài khoản
        </Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="text-foreground font-medium">Đơn hàng của tôi</span>
      </nav>

      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-foreground text-2xl font-bold">Đơn Hàng Của Tôi</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Theo dõi và quản lý tất cả đơn hàng của bạn
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={() => fetchOrders(true)} disabled={isLoading}>
          <RefreshCw className={cn("mr-1.5 h-3.5 w-3.5", isLoading && "animate-spin")} />
          Làm mới
        </Button>
      </div>

      {/* Filter tabs */}
      <div className="mb-6 flex flex-wrap gap-2">
        {FILTER_OPTIONS.map((opt) => {
          const count =
            opt.value === "ALL"
              ? orders.length
              : orders.filter((o) => o.status === opt.value).length
          return (
            <button
              key={opt.value}
              onClick={() => setFilter(opt.value)}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors",
                filter === opt.value
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-background text-muted-foreground hover:border-primary/50 hover:text-foreground",
              )}
            >
              {opt.label}
              {count > 0 && (
                <span
                  className={cn(
                    "flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[10px]",
                    filter === opt.value
                      ? "bg-primary-foreground/20 text-primary-foreground"
                      : "bg-muted text-muted-foreground",
                  )}
                >
                  {count}
                </span>
              )}
            </button>
          )
        })}
      </div>

      {/* Loading skeleton */}
      {isLoading && orders.length === 0 && (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-36 w-full rounded-xl" />
          ))}
        </div>
      )}

      {/* Empty state */}
      {!isLoading && filtered.length === 0 && (
        <div className="border-border flex min-h-[30vh] flex-col items-center justify-center gap-3 rounded-xl border border-dashed p-8 text-center">
          <div className="bg-muted rounded-full p-4">
            <ShoppingBag className="text-muted-foreground h-8 w-8" />
          </div>
          <div>
            <h3 className="text-base font-semibold">
              {filter === "ALL" ? "Chưa có đơn hàng nào" : "Không có đơn hàng phù hợp"}
            </h3>
            <p className="text-muted-foreground mt-1 text-sm">
              {filter === "ALL"
                ? "Hãy bắt đầu mua sắm để tạo đơn hàng đầu tiên của bạn!"
                : "Thử chọn bộ lọc khác để xem thêm đơn hàng."}
            </p>
          </div>
          {filter === "ALL" && (
            <Button asChild className="mt-2">
              <Link href="/san-pham">Khám phá sản phẩm</Link>
            </Button>
          )}
        </div>
      )}

      {/* Orders list */}
      {filtered.length > 0 && (
        <div className="space-y-4">
          {filtered.map((order) => (
            <OrderCard
              key={order.id}
              order={order}
              onViewDetail={(id) => setDetailId(id)}
              onCancel={handleCancel}
              cancelling={cancelling}
            />
          ))}

          {/* Load more */}
          {hasMore && filter === "ALL" && (
            <div className="flex justify-center pt-2">
              <Button variant="outline" onClick={() => fetchOrders(false)} disabled={isLoading}>
                {isLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <ChevronDown className="mr-2 h-4 w-4" />
                )}
                Tải thêm đơn hàng
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Order Detail Dialog */}
      <OrderDetailDialog
        orderId={detailId}
        open={!!detailId}
        onClose={() => setDetailId(null)}
        onPaymentSuccess={() => fetchOrders(true)}
      />
    </main>
  )
}
