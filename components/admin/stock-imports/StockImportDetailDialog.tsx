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
import type { StockImport, StockImportStatus } from "@/types/stockImport"

import { useEffect, useState } from "react"

import { Loader2 } from "lucide-react"

interface StockImportDetailDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  stockImport: StockImport | null
}

const STATUS_CONFIG: Record<StockImportStatus, { label: string; className: string }> = {
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
}

export default function StockImportDetailDialog({
  open,
  onOpenChange,
  stockImport: initialStockImport,
}: StockImportDetailDialogProps) {
  const [stockImport, setStockImport] = useState<StockImport | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    let isMounted = true
    if (open && initialStockImport?.id) {
      const fetchDetail = async () => {
        try {
          const detail = await stockImportService.getStockImport(initialStockImport.id)
          if (isMounted) {
            setStockImport(detail)
          }
        } catch (error) {
          console.error(error)
        } finally {
          if (isMounted) setLoading(false)
        }
      }
      setLoading(true)
      fetchDetail()
    } else {
      setStockImport(null)
      setLoading(false)
    }
    return () => {
      isMounted = false
    }
  }, [open, initialStockImport])

  if (!open || (!stockImport && !loading)) return null

  const statusCfg = stockImport ? STATUS_CONFIG[stockImport.status] : STATUS_CONFIG.COMPLETED

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            Chi Tiết Phiếu Nhập Hàng
            {!loading && stockImport && (
              <Badge variant="outline" className={statusCfg.className}>
                {statusCfg.label}
              </Badge>
            )}
          </DialogTitle>
          {!loading && stockImport && (
            <DialogDescription>
              Mã phiếu:{" "}
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
            {/* Info section */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1">
                <p className="text-muted-foreground text-xs">Nhà Cung Cấp</p>
                <p className="font-medium">{stockImport.supplierName}</p>
              </div>
              <div className="space-y-1">
                <p className="text-muted-foreground text-xs">Ngày Tạo</p>
                <p className="font-medium">
                  {new Date(stockImport.createdAt).toLocaleString("vi-VN")}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-muted-foreground text-xs">Tổng Tiền</p>
                <p className="text-primary text-lg font-bold">
                  {stockImport.totalAmount.toLocaleString("vi-VN")}₫
                </p>
              </div>
              {stockImport.notes && (
                <div className="space-y-1">
                  <p className="text-muted-foreground text-xs">Ghi Chú</p>
                  <p className="font-medium">{stockImport.notes}</p>
                </div>
              )}
            </div>

            <Separator />

            {/* Items table */}
            <div className="space-y-2">
              <p className="text-sm font-semibold">Danh Sách Sản Phẩm</p>
              <div className="border-border overflow-hidden rounded-lg border">
                <table className="w-full text-sm">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="text-muted-foreground px-3 py-2 text-left font-medium">
                        Sản Phẩm
                      </th>
                      <th className="text-muted-foreground px-3 py-2 text-right font-medium">SL</th>
                      <th className="text-muted-foreground px-3 py-2 text-right font-medium">
                        Đơn Giá
                      </th>
                      <th className="text-muted-foreground px-3 py-2 text-right font-medium">
                        Thành Tiền
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {stockImport.items.map((item, idx) => (
                      <tr key={idx} className="border-border border-t">
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
                    <tr className="border-border border-t">
                      <td colSpan={3} className="px-3 py-2 text-right font-semibold">
                        Tổng Cộng:
                      </td>
                      <td className="text-primary px-3 py-2 text-right font-bold">
                        {stockImport.totalAmount.toLocaleString("vi-VN")}₫
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          </>
        ) : null}

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Đóng
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
