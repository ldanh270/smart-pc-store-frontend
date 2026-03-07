"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import type { StockImport, StockImportStatus } from "@/types/stockImport";

interface StockImportDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  stockImport: StockImport | null;
}

const STATUS_CONFIG: Record<
  StockImportStatus,
  { label: string; className: string }
> = {
  PENDING: {
    label: "Chờ xử lý",
    className: "border-yellow-500/50 text-yellow-600",
  },
  COMPLETED: {
    label: "Hoàn thành",
    className: "border-emerald-500/50 text-emerald-600",
  },
  CANCELLED: {
    label: "Đã hủy",
    className: "border-red-500/50 text-red-600",
  },
};

export default function StockImportDetailDialog({
  open,
  onOpenChange,
  stockImport,
}: StockImportDetailDialogProps) {
  if (!stockImport) return null;

  const statusCfg = STATUS_CONFIG[stockImport.status];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            Chi Tiết Phiếu Nhập Hàng
            <Badge
              variant="outline"
              className={statusCfg.className}
            >
              {statusCfg.label}
            </Badge>
          </DialogTitle>
          <DialogDescription>
            Mã phiếu:{" "}
            <span className="font-mono font-semibold text-foreground">
              {stockImport.importCode}
            </span>
          </DialogDescription>
        </DialogHeader>

        {/* Info section */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Nhà Cung Cấp</p>
            <p className="font-medium">{stockImport.supplierName}</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Ngày Tạo</p>
            <p className="font-medium">
              {new Date(stockImport.createdAt).toLocaleString("vi-VN")}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Tổng Tiền</p>
            <p className="text-lg font-bold text-primary">
              {stockImport.totalAmount.toLocaleString("vi-VN")}₫
            </p>
          </div>
          {stockImport.notes && (
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Ghi Chú</p>
              <p className="font-medium">{stockImport.notes}</p>
            </div>
          )}
        </div>

        <Separator />

        {/* Items table */}
        <div className="space-y-2">
          <p className="text-sm font-semibold">Danh Sách Sản Phẩm</p>
          <div className="rounded-lg border border-border overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-muted/50">
                <tr>
                  <th className="px-3 py-2 text-left font-medium text-muted-foreground">
                    Sản Phẩm
                  </th>
                  <th className="px-3 py-2 text-right font-medium text-muted-foreground">
                    SL
                  </th>
                  <th className="px-3 py-2 text-right font-medium text-muted-foreground">
                    Đơn Giá
                  </th>
                  <th className="px-3 py-2 text-right font-medium text-muted-foreground">
                    Thành Tiền
                  </th>
                </tr>
              </thead>
              <tbody>
                {stockImport.items.map((item, idx) => (
                  <tr key={idx} className="border-t border-border">
                    <td className="px-3 py-2">{item.productName}</td>
                    <td className="px-3 py-2 text-right">{item.quantity}</td>
                    <td className="px-3 py-2 text-right">
                      {item.unitPrice.toLocaleString("vi-VN")}₫
                    </td>
                    <td className="px-3 py-2 text-right font-medium">
                      {item.totalPrice.toLocaleString("vi-VN")}₫
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-muted/30">
                <tr className="border-t border-border">
                  <td
                    colSpan={3}
                    className="px-3 py-2 text-right font-semibold"
                  >
                    Tổng Cộng:
                  </td>
                  <td className="px-3 py-2 text-right font-bold text-primary">
                    {stockImport.totalAmount.toLocaleString("vi-VN")}₫
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Đóng
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
