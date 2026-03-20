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

interface DeleteUserDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  userName: string
  onConfirm: () => void
}

export default function DeleteUserDialog({
  open,
  onOpenChange,
  userName,
  onConfirm,
}: DeleteUserDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-106.25">
        <DialogHeader>
          <DialogTitle>Xóa người dùng?</DialogTitle>
          <DialogDescription>
            Bạn có chắc chắn muốn xóa người dùng{" "}
            <span className="text-foreground font-semibold">{userName}</span>? Hành động này không
            thể hoàn tác.
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
