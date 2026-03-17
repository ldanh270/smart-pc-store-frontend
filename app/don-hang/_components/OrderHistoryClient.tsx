"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Package,
  ChevronRight,
  CheckCircle2,
  Clock,
  XCircle,
  ShoppingBag,
  RefreshCw,
  Loader2,
  ExternalLink,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuthStore } from "@/stores/useAuthStore";
import { orderService } from "@/services/orderService";
import { MyOrder, OrderDetailView, OrderStatus } from "@/types/order";
import { cn, formatPrice } from "@/lib/utils";

// ─── Status helpers ───────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<
  OrderStatus,
  { label: string; icon: React.ElementType; className: string; badgeVariant: "default" | "secondary" | "destructive" | "outline" }
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
};

function StatusBadge({ status }: { status: OrderStatus }) {
  const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.PENDING;
  const Icon = cfg.icon;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold",
        cfg.className
      )}
    >
      <Icon className="h-3.5 w-3.5" />
      {cfg.label}
    </span>
  );
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("vi-VN", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// ─── Order Detail Dialog ──────────────────────────────────────────────────────

function OrderDetailDialog({
  orderId,
  open,
  onClose,
}: {
  orderId: string | null;
  open: boolean;
  onClose: () => void;
}) {
  const [detail, setDetail] = useState<OrderDetailView | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open || !orderId) return;
    setDetail(null);
    setLoading(true);
    orderService
      .getOrderDetail(orderId)
      .then(setDetail)
      .catch(() => toast.error("Không thể tải chi tiết đơn hàng"))
      .finally(() => setLoading(false));
  }, [open, orderId]);

  const total = detail?.items?.reduce(
    (sum, item) => sum + item.unitPrice * item.quantity,
    0
  ) ?? 0;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-base">
            <Package className="h-4 w-4 text-primary" />
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
            <div className="grid grid-cols-2 gap-3 rounded-xl border border-border bg-muted/30 p-3 text-sm">
              <div>
                <p className="text-xs text-muted-foreground">Mã đơn hàng</p>
                <p className="font-mono font-semibold tracking-wider">
                  {detail.order.orderCode}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Trạng thái</p>
                <StatusBadge status={detail.order.status} />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Mã giao dịch</p>
                <p className="font-mono text-xs font-medium tracking-widest">
                  {detail.order.transactionCode}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Ngày đặt</p>
                <p className="text-xs font-medium">
                  {formatDate(detail.order.createdAt)}
                </p>
              </div>
            </div>

            {/* Items */}
            {detail.items && detail.items.length > 0 && (
              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Sản phẩm ({detail.items.length})
                </p>
                <div className="divide-y divide-border rounded-xl border border-border">
                  {detail.items.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between gap-3 px-4 py-3"
                    >
                      <div className="min-w-0 flex-1">
                        <Link
                          href={`/san-pham/${item.productId}`}
                          className="flex items-center gap-1 text-sm font-medium text-foreground transition-colors hover:text-primary"
                        >
                          <span className="line-clamp-1">{item.productName}</span>
                          <ExternalLink className="h-3 w-3 shrink-0 opacity-50" />
                        </Link>
                        <p className="mt-0.5 text-xs text-muted-foreground">
                          {formatPrice(item.unitPrice)} × {item.quantity}
                        </p>
                      </div>
                      <span className="shrink-0 font-mono text-sm font-semibold text-foreground">
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
              <span className="font-mono text-lg font-bold text-primary">
                {formatPrice(total)}
              </span>
            </div>
          </div>
        ) : (
          <p className="py-6 text-center text-sm text-muted-foreground">
            Không có dữ liệu
          </p>
        )}
      </DialogContent>
    </Dialog>
  );
}

// ─── Order Card ───────────────────────────────────────────────────────────────

function OrderCard({
  order,
  onViewDetail,
  onCancel,
  cancelling,
}: {
  order: MyOrder;
  onViewDetail: (id: string) => void;
  onCancel: (id: string) => void;
  cancelling: string | null;
}) {
  const canCancel = order.status === "PENDING";

  return (
    <div className="rounded-xl border border-border bg-card transition-shadow hover:shadow-md">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-5 py-3">
        <div className="flex items-center gap-2.5">
          <Package className="h-4 w-4 text-muted-foreground" />
          <span className="font-mono text-sm font-semibold tracking-wider text-foreground">
            {order.orderCode}
          </span>
        </div>
        <StatusBadge status={order.status} />
      </div>

      {/* Body */}
      <div className="px-5 py-4">
        <div className="grid grid-cols-2 gap-4 text-sm sm:grid-cols-3">
          <div>
            <p className="text-xs text-muted-foreground">Số tiền</p>
            <p className="mt-0.5 font-mono font-bold text-primary">
              {formatPrice(order.amount)}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Mã giao dịch</p>
            <p className="mt-0.5 font-mono text-xs font-semibold tracking-wider">
              {order.transactionCode}
            </p>
          </div>
          <div className="col-span-2 sm:col-span-1">
            <p className="text-xs text-muted-foreground">Ngày đặt</p>
            <p className="mt-0.5 text-xs font-medium">{formatDate(order.createdAt)}</p>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-2 border-t border-border px-5 py-3">
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
        <Button
          variant="outline"
          size="sm"
          onClick={() => onViewDetail(order.id)}
        >
          <ExternalLink className="mr-1.5 h-3.5 w-3.5" />
          Xem chi tiết
        </Button>
      </div>
    </div>
  );
}

// ─── Filter bar ───────────────────────────────────────────────────────────────

const FILTER_OPTIONS: { value: OrderStatus | "ALL"; label: string }[] = [
  { value: "ALL", label: "Tất cả" },
  { value: "PENDING", label: "Chờ thanh toán" },
  { value: "PAID", label: "Đã thanh toán" },
  { value: "CANCELLED", label: "Đã huỷ" },
  { value: "EXPIRED", label: "Hết hạn" },
];

// ─── Main Component ───────────────────────────────────────────────────────────

export default function OrderHistoryClient() {
  const accessToken = useAuthStore((state) => state.accessToken);
  const isLoggedIn = !!accessToken;

  const [orders, setOrders] = useState<MyOrder[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [filter, setFilter] = useState<OrderStatus | "ALL">("ALL");
  const [detailId, setDetailId] = useState<string | null>(null);
  const [cancelling, setCancelling] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const PAGE_SIZE = 10;

  const fetchOrders = async (reset = false) => {
    if (!isLoggedIn) return;
    setIsLoading(true);
    try {
      const currentPage = reset ? 0 : page;
      const data = await orderService.getMyOrders({
        page: currentPage,
        size: PAGE_SIZE,
      });
      setOrders((prev) => (reset ? data : [...prev, ...data]));
      setHasMore(data.length === PAGE_SIZE);
      if (!reset) setPage((p) => p + 1);
      else setPage(1);
    } catch {
      toast.error("Không thể tải lịch sử đơn hàng");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoggedIn]);

  const handleCancel = async (orderId: string) => {
    setCancelling(orderId);
    try {
      await orderService.cancelOrder(orderId);
      toast.success("Đã huỷ đơn hàng");
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: "CANCELLED" as OrderStatus } : o))
      );
    } catch {
      toast.error("Không thể huỷ đơn hàng. Vui lòng thử lại.");
    } finally {
      setCancelling(null);
    }
  };

  const filtered =
    filter === "ALL" ? orders : orders.filter((o) => o.status === filter);

  // ── Not logged in ────────────────────────────────────────────────────────

  if (!isLoggedIn) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 px-4 text-center">
        <ShoppingBag className="h-14 w-14 text-muted-foreground/40" />
        <div>
          <h3 className="text-lg font-semibold">Vui lòng đăng nhập</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Bạn cần đăng nhập để xem lịch sử đơn hàng.
          </p>
        </div>
        <Button asChild>
          <Link href="/dang-nhap">Đăng nhập ngay</Link>
        </Button>
      </div>
    );
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-8 lg:px-8">
      {/* Breadcrumb */}
      <nav className="mb-6 flex items-center gap-1.5 text-sm text-muted-foreground">
        <Link href="/" className="transition-colors hover:text-foreground">Trang chủ</Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <Link href="/tai-khoan" className="transition-colors hover:text-foreground">Tài khoản</Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="font-medium text-foreground">Đơn hàng của tôi</span>
      </nav>

      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Đơn Hàng Của Tôi</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Theo dõi và quản lý tất cả đơn hàng của bạn
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => fetchOrders(true)}
          disabled={isLoading}
        >
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
              : orders.filter((o) => o.status === opt.value).length;
          return (
            <button
              key={opt.value}
              onClick={() => setFilter(opt.value)}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors",
                filter === opt.value
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-background text-muted-foreground hover:border-primary/50 hover:text-foreground"
              )}
            >
              {opt.label}
              {count > 0 && (
                <span
                  className={cn(
                    "flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[10px]",
                    filter === opt.value
                      ? "bg-primary-foreground/20 text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  )}
                >
                  {count}
                </span>
              )}
            </button>
          );
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
        <div className="flex min-h-[30vh] flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-border p-8 text-center">
          <div className="rounded-full bg-muted p-4">
            <ShoppingBag className="h-8 w-8 text-muted-foreground" />
          </div>
          <div>
            <h3 className="text-base font-semibold">
              {filter === "ALL" ? "Chưa có đơn hàng nào" : "Không có đơn hàng phù hợp"}
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
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
              <Button
                variant="outline"
                onClick={() => fetchOrders(false)}
                disabled={isLoading}
              >
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
      />
    </main>
  );
}
