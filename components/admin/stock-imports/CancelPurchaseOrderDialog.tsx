"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Loader2 } from "lucide-react"
import { useState } from "react"

interface CancelPurchaseOrderDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  importCode: string
  onConfirm: (reason: string) => Promise<void>
}

export default function CancelPurchaseOrderDialog({
  open,
  onOpenChange,
  importCode,
  onConfirm,
}: CancelPurchaseOrderDialogProps) {
  const [reason, setReason] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleConfirm() {
    if (!reason.trim()) return
    setLoading(true)
    try {
      await onConfirm(reason.trim())
      setReason("")
    } finally {
      setLoading(false)
    }
  }

  function handleClose() {
    if (loading) return
    setReason("")
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Hủy Đơn Đặt Hàng</DialogTitle>
          <DialogDescription>
            Bạn đang hủy đơn{" "}
            <span className="text-foreground font-mono font-semibold">{importCode}</span>.
            Hành động này không thể hoàn tác.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2">
          <label className="text-sm font-medium">
            Lý do hủy <span className="text-destructive">*</span>
          </label>
          <Textarea
            placeholder="Nhập lý do hủy đơn hàng..."
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="resize-none"
            rows={3}
            disabled={loading}
          />
          {!reason.trim() && (
            <p className="text-destructive text-xs">Vui lòng nhập lý do hủy.</p>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={loading}>
            Quay Lại
          </Button>
          <Button
            variant="destructive"
            onClick={handleConfirm}
            disabled={loading || !reason.trim()}
          >
            {loading && <Loader2 className="mr-2 size-4 animate-spin" />}
            Xác Nhận Hủy
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
