"use client"

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"

import { useState } from "react"

import { Loader2 } from "lucide-react"

interface DeleteOrderDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  orderCode: string
  onConfirm: () => Promise<void> | void
}

export default function DeleteOrderDialog({
  open,
  onOpenChange,
  orderCode,
  onConfirm,
}: DeleteOrderDialogProps) {
  const [loading, setLoading] = useState(false)

  const handleConfirm = async () => {
    try {
      setLoading(true)
      await onConfirm()
      onOpenChange(false)
    } finally {
      setLoading(false)
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Xóa / Hủy Đơn Hàng</AlertDialogTitle>
          <AlertDialogDescription>
            Bạn có chắc chắn muốn xóa/hủy đơn hàng{" "}
            <span className="text-foreground font-semibold">{orderCode}</span> không? Hành động này
            không thể hoàn tác.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading}>Hủy</AlertDialogCancel>
          <Button variant="destructive" onClick={handleConfirm} disabled={loading}>
            {loading && <Loader2 className="mr-2 size-4 animate-spin" />}
            Đồng ý
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
