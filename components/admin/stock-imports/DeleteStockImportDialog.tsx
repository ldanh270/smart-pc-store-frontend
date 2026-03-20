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

interface DeleteStockImportDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  importCode: string
  onConfirm: () => void
}

export default function DeleteStockImportDialog({
  open,
  onOpenChange,
  importCode,
  onConfirm,
}: DeleteStockImportDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-106.5">
        <DialogHeader>
          <DialogTitle>Xóa phiếu nhập hàng?</DialogTitle>
          <DialogDescription>
            Bạn có chắc chắn muốn xóa phiếu nhập{" "}
            <span className="text-foreground font-semibold">{importCode}</span> không? Hành động này
            không thể hoàn tác.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Hủy
          </Button>
          <Button variant="destructive" onClick={onConfirm}>
            Xóa
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
