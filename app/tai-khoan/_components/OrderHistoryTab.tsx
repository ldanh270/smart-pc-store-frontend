"use client";

import { useEffect, useState } from "react";
import { Loader2, Package, Calendar, Coins, CreditCard } from "lucide-react";
import { toast } from "sonner";

import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

import { orderService } from "@/services/orderService";
import type { OrderHistoryItem } from "@/types/order";

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("vi-VN", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function StatusBadge({ status }: { status: string }) {
  switch (status) {
    case "PAID":
    case "COMPLETED":
      return <Badge className="bg-green-500 hover:bg-green-600">Đã thanh toán</Badge>;
    case "PENDING":
      return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200">Đang chờ xử lý</Badge>;
    case "CANCELLED":
      return <Badge variant="destructive">Đã hủy</Badge>;
    case "EXPIRED":
      return <Badge variant="secondary" className="bg-gray-200 text-gray-800 hover:bg-gray-300 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700">Hết hạn</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
}

export default function OrderHistoryTab() {
  const [orders, setOrders] = useState<OrderHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  const ITEMS_PER_PAGE = 5;
  const totalPages = Math.ceil(orders.length / ITEMS_PER_PAGE);
  const paginatedOrders = orders.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  useEffect(() => {
    orderService
      .getMyOrders()
      .then((data) => {
        setOrders(data);
      })
      .catch(() => {
        toast.error("Không thể tải lịch sử đơn hàng");
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <Card>
        <CardContent className="flex min-h-75 items-center justify-center">
          <Loader2 className="size-8 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  if (orders.length === 0) {
    return (
      <Card>
        <CardContent className="flex min-h-75 flex-col items-center justify-center gap-4 text-center">
          <div className="rounded-full bg-muted p-6">
            <Package className="size-10 text-muted-foreground" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-medium">Chưa có đơn hàng nào</h3>
            <p className="text-sm text-muted-foreground">
              Bạn chưa thực hiện bất kỳ đơn hàng nào.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="space-y-4">
        {paginatedOrders.map((order) => (
          <Card key={order.id} className="overflow-hidden transition-all hover:shadow-md">
            <div className="bg-muted/50 px-6 py-4 flex items-center justify-between border-b">
              <div className="flex items-center gap-2">
                <Package className="size-5 text-primary" />
                <span className="font-semibold text-sm">Mã ĐH: {order.orderCode}</span>
              </div>
              <StatusBadge status={order.status} />
            </div>
            <CardContent className="p-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex items-start gap-4">
                  <div className="rounded-full bg-green-100 p-2.5 dark:bg-green-900/20">
                    <Coins className="size-5 text-green-600 dark:text-green-500" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">Tổng tiền</p>
                    <p className="text-lg font-semibold text-foreground">
                      {formatCurrency(order.amount)}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="rounded-full bg-blue-100 p-2.5 dark:bg-blue-900/20">
                    <Calendar className="size-5 text-blue-600 dark:text-blue-500" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">Thời gian tạo</p>
                    <p className="text-sm font-medium text-foreground mt-1.5">
                      {formatDate(order.createdAt)}
                    </p>
                  </div>
                </div>

                {order.transactionCode && (
                  <div className="flex items-start gap-4 sm:col-span-2 mt-2">
                    <div className="rounded-full bg-orange-100 p-2.5 dark:bg-orange-900/20">
                      <CreditCard className="size-5 text-orange-600 dark:text-orange-500" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">Mã giao dịch</p>
                      <p className="text-sm font-medium text-foreground bg-muted w-fit px-2 py-0.5 rounded-md mt-1 font-mono">
                        {order.transactionCode}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {totalPages > 1 && (
        <Pagination className="mt-6">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={(e) => {
                  e.preventDefault();
                  if (currentPage > 1) setCurrentPage((p) => p - 1);
                }}
                className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
              />
            </PaginationItem>
            
            {Array.from({ length: totalPages }).map((_, i) => (
              <PaginationItem key={i}>
                <PaginationLink
                  onClick={(e) => {
                    e.preventDefault();
                    setCurrentPage(i + 1);
                  }}
                  isActive={currentPage === i + 1}
                  className="cursor-pointer"
                >
                  {i + 1}
                </PaginationLink>
              </PaginationItem>
            ))}

            <PaginationItem>
              <PaginationNext
                onClick={(e) => {
                  e.preventDefault();
                  if (currentPage < totalPages) setCurrentPage((p) => p + 1);
                }}
                className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
}
