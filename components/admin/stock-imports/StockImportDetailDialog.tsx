"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import { stockImportService } from "@/services/stockImportService"
import type { PurchaseOrderType, StockImport } from "@/types/stockImport"
import type { PurchaseOrderStatus } from "@/types/stockImport"

import { useEffect, useState } from "react"
import { Loader2, PackageCheck, XCircle } from "lucide-react"

// ─── Config ───────────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<PurchaseOrderStatus, { label: string; className: string }> = {
  DRAFT: {
    label: "Nháp",
    className: "border-yellow-500/50 text-yellow-600",
  },
  RECEIVED: {
    label: "Đã Nhận Hàng",
    className: "border-emerald-500/50 text-emerald-600",
  },
  CANCELLED: {
    label: "Đã Hủy",
    className: "border-red-500/50 text-red-600",
  },
}

const TYPE_CONFIG: Record<PurchaseOrderType, { label: string; className: string }> = {
  NORMAL: { label: "Thông thường", className: "border-blue-500/50 text-blue-600" },
  ADJUSTMENT: { label: "Điều chỉnh", className: "border-orange-500/50 text-orange-600" },
  IMPORT: { label: "Nhập hàng", className: "border-purple-500/50 text-purple-600" },
}

// ─── Props ────────────────────────────────────────────────────────────────────

interface StockImportDetailDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  stockImport: StockImport | null
  /** Called when user triggers Receive from the detail dialog */
  onReceive?: (id: string) => Promise<void>
  /** Called when user triggers Cancel from the detail dialog */
  onCancel?: (id: string) => void
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function StockImportDetailDialog({
  open,
  onOpenChange,
  stockImport: initialStockImport,
  onReceive,
  onCancel,
}: StockImportDetailDialogProps) {
  const [stockImport, setStockImport] = useState<StockImport | null>(null)
  const [loading, setLoading] = useState(false)
  const [receiving, setReceiving] = useState(false)

  useEffect(() => {
    let mounted = true
    if (open && initialStockImport?.id) {
      if (initialStockImport.items.length > 0) {
        setStockImport(initialStockImport)
        return () => { mounted = false }
      }
      setLoading(true)
      stockImportService
        .getStockImport(initialStockImport.id)
        .then((detail) => { if (mounted) setStockImport(detail) })
        .catch(console.error)
        .finally(() => { if (mounted) setLoading(false) })
    } else {
      setStockImport(null)
    }
    return () => { mounted = false }
  }, [open, initialStockImport])

  if (!open || (!stockImport && !loading)) return null

  const statusCfg = stockImport ? STATUS_CONFIG[stockImport.status] : STATUS_CONFIG.DRAFT
  const isDraft = stockImport?.status === "DRAFT"

  async function handleReceive() {
    if (!stockImport || !onReceive) return
    setReceiving(true)
    try {
      await onReceive(stockImport.id)
      onOpenChange(false)
    } finally {
      setReceiving(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex flex-wrap items-center gap-3">
            Chi Tiết Đơn Đặt Hàng
            {!loading && stockImport && (
              <div className="flex gap-2">
                <Badge variant="outline" className={TYPE_CONFIG[stockImport.type || "NORMAL"].className}>
                  {TYPE_CONFIG[stockImport.type || "NORMAL"].label}
                </Badge>
                <Badge variant="outline" className={statusCfg.className}>
                  {statusCfg.label}
                </Badge>
              </div>
            )}
          </DialogTitle>
          {!loading && stockImport && (
            <DialogDescription>
              Mã đơn:{" "}
              <span className="text-foreground font-mono font-semibold">
                {stockImport.importCode}
              </span>
            </DialogDescription>
          )}
        </DialogHeader>

        {loading ? (
          <div className="flex h-40 items-center justify-center">
            <Loader2 className="text-muted-foreground size-6 animate-spin" />
          </div>
        ) : stockImport ? (
          <>
            {/* Info */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1">
                <p className="text-muted-foreground text-xs">Nhà Cung Cấp</p>
                <p className="font-medium">{stockImport.supplierName}</p>
              </div>
              <div className="space-y-1">
                <p className="text-muted-foreground text-xs">Ngày Tạo</p>
                <p className="font-medium">
                  {stockImport.createdAt ? new Date(stockImport.createdAt).toLocaleString("vi-VN") : "N/A"}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-muted-foreground text-xs">Tổng Tiền</p>
                <p className={`text-lg font-bold ${(stockImport.totalAmount ?? 0) < 0 ? "text-red-600" : "text-primary"}`}>
                  {(stockImport.totalAmount ?? 0).toLocaleString("vi-VN")}₫
                </p>
              </div>
              {stockImport.note && (
                <div className="space-y-1">
                  <p className="text-muted-foreground text-xs">Ghi Chú</p>
                  <p className="font-medium">{stockImport.note}</p>
                </div>
              )}
            </div>

            <Separator />

            {/* DRAFT notice */}
            {isDraft && (
              <div className="bg-background rounded-lg border px-4 py-3">
                <p className="text-destructive/50 text-[13px] leading-relaxed font-medium">
                  Đơn đang ở trạng thái <strong className="font-semibold text-destructive">Nháp</strong> chưa nhập kho. Nhấn <strong className="font-semibold text-destructive">Nhận Hàng</strong> để cập nhật tồn kho.
                </p>
              </div>
            )}

            {/* Items table */}
            <div className="space-y-2">
              <p className="text-sm font-semibold">Danh Sách Sản Phẩm</p>
              <div className="border-border overflow-hidden rounded-lg border">
                <table className="w-full text-sm">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="text-muted-foreground px-3 py-2 text-left font-medium">Sản Phẩm</th>
                      <th className="text-muted-foreground px-3 py-2 text-center font-medium">SL</th>
                      <th className="text-muted-foreground px-3 py-2 text-right font-medium">Đơn Giá</th>
                      <th className="text-muted-foreground px-3 py-2 text-right font-medium">Thành Tiền</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stockImport.items.map((item, idx) => (
                      <tr key={idx} className="border-border border-t">
                        <td className="px-3 py-2">{item.productName}</td>
                        <td className="px-3 py-2 text-center">{item.quantity}</td>
                        <td className="px-3 py-2 text-right">{(item.unitPrice ?? 0).toLocaleString("vi-VN")}₫</td>
                        <td className={`px-3 py-2 text-right font-medium ${(item.totalPrice ?? 0) < 0 ? "text-red-600" : ""}`}>
                          {(item.totalPrice ?? 0).toLocaleString("vi-VN")}₫
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-muted/30">
                    <tr className="border-border border-t">
                      <td colSpan={3} className="px-3 py-2 text-right font-semibold">Tổng Cộng:</td>
                      <td className={`px-3 py-2 text-right font-bold ${(stockImport.totalAmount ?? 0) < 0 ? "text-red-600" : "text-primary"}`}>
                        {(stockImport.totalAmount ?? 0).toLocaleString("vi-VN")}₫
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          </>
        ) : null}

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Đóng
          </Button>
          {isDraft && onCancel && stockImport && (
            <Button
              variant="outline"
              className="text-destructive border-destructive/30 hover:bg-destructive/10"
              onClick={() => { onOpenChange(false); onCancel(stockImport.id) }}
            >
              <XCircle className="mr-2 size-4" />
              Hủy Đơn
            </Button>
          )}
          {isDraft && onReceive && (
            <Button onClick={handleReceive} disabled={receiving}>
              {receiving ? (
                <Loader2 className="mr-2 size-4 animate-spin" />
              ) : (
                <PackageCheck className="mr-2 size-4" />
              )}
              Nhận Hàng
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
