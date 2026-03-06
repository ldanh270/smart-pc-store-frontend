"use client";

import { useEffect, useState } from "react";
import {
  MoreHorizontal,
  Pencil,
  Trash2,
  Loader2,
  RefreshCw,
  Eye
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Order } from "@/types/order";
import { useOrderStore } from "@/stores/useOrderStore";
import UpdateOrderStatusDialog from "./UpdateOrderStatusDialog";
import DeleteOrderDialog from "./DeleteOrderDialog";

function formatDate(dateString: string) {
  if (!dateString) return "-";
  return new Date(dateString).toLocaleDateString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
}

export default function OrderTable() {
  const { orders, loading, fetchOrders, updateOrderStatus, deleteOrder } =
    useOrderStore();

  const [editingOrder, setEditingOrder] = useState<Order | null>(null);
  const [deletingOrder, setDeletingOrder] = useState<Order | null>(null);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // ─── Handlers ────────────────────────────────────────────────────────

  async function handleEditOrder({ status }: { status: string }) {
    if (!editingOrder) return;
    const success = await updateOrderStatus(editingOrder.id, status);
    if (success) setEditingOrder(null);
  }

  async function handleDeleteOrder(id: number) {
    const success = await deleteOrder(id);
    if (success) setDeletingOrder(null);
  }

  // ─── Render ──────────────────────────────────────────────────────────

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => fetchOrders()}
            disabled={loading}
          >
            <RefreshCw
              className={`size-4 ${loading ? "animate-spin" : ""}`}
            />
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-lg border border-border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-16">ID</TableHead>
              <TableHead>Mã ĐH</TableHead>
              <TableHead>Tổng Tiền</TableHead>
              <TableHead className="hidden md:table-cell">Mã Giao Dịch</TableHead>
              <TableHead className="hidden lg:table-cell">Ngày Tạo</TableHead>
              <TableHead className="text-center">Trạng Thái</TableHead>
              <TableHead className="w-16 text-right">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} className="py-12 text-center">
                  <Loader2 className="mx-auto size-6 animate-spin text-muted-foreground" />
                  <p className="mt-2 text-sm text-muted-foreground">
                    Đang tải đơn hàng...
                  </p>
                </TableCell>
              </TableRow>
            ) : orders.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="py-12 text-center text-muted-foreground"
                >
                  Không tìm thấy đơn hàng nào.
                </TableCell>
              </TableRow>
            ) : (
              orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-mono text-sm">
                    {order.id}
                  </TableCell>
                  <TableCell className="font-medium whitespace-nowrap">
                    {order.orderCode || "-"}
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    {formatCurrency(order.amount)}
                  </TableCell>
                  <TableCell className="hidden md:table-cell font-mono text-xs text-muted-foreground">
                    {order.transactionCode || "-"}
                  </TableCell>
                  <TableCell className="hidden lg:table-cell text-sm whitespace-nowrap">
                    {formatDate(order.createdAt)}
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge
                      variant={
                        order.status === "COMPLETED"
                          ? "default"
                          : order.status === "PENDING"
                          ? "secondary"
                          : "destructive"
                      }
                      className={
                        order.status === "COMPLETED"
                          ? "bg-emerald-500 hover:bg-emerald-600"
                          : order.status === "PENDING"
                          ? "bg-amber-500 hover:bg-amber-600"
                          : ""
                      }
                    >
                      {order.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="size-8"
                        >
                          <MoreHorizontal className="size-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => setEditingOrder(order)}
                        >
                          <Pencil className="mr-2 size-4" />
                          Cập nhật trạng thái
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-destructive focus:bg-destructive focus:text-destructive-foreground focus:outline-none"
                          onClick={() => setDeletingOrder(order)}
                        >
                          <Trash2 className="mr-2 size-4" />
                          Xóa / Hủy
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Dialogs */}
      <UpdateOrderStatusDialog
        open={!!editingOrder}
        onOpenChange={(open) => {
          if (!open) setEditingOrder(null);
        }}
        order={editingOrder ?? undefined}
        onSubmit={handleEditOrder}
      />

      <DeleteOrderDialog
        open={!!deletingOrder}
        onOpenChange={(open) => {
          if (!open) setDeletingOrder(null);
        }}
        orderCode={deletingOrder?.orderCode ?? String(deletingOrder?.id ?? "")}
        onConfirm={() => {
          if (deletingOrder) handleDeleteOrder(deletingOrder.id);
        }}
      />
    </div>
  );
}
