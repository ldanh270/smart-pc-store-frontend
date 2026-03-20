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

interface DeleteSupplierDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  supplierName: string
  onConfirm: () => void
}

export default function DeleteSupplierDialog({
  open,
  onOpenChange,
  supplierName,
  onConfirm,
}: DeleteSupplierDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-106.25">
        <DialogHeader>
          <DialogTitle>Xóa nhà cung cấp?</DialogTitle>
          <DialogDescription>
            Bạn có chắc chắn muốn xóa hệ thống cung cấp{" "}
            <span className="text-foreground font-semibold">{supplierName}</span> không? Đây là hành
            động xóa mềm (chuyển trạng thái Ẩn) hoặc xóa hoàn toàn tùy quy định API.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Hủy
          </Button>
          <Button variant="destructive" onClick={onConfirm}>
            Tiếp tục xóa
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
