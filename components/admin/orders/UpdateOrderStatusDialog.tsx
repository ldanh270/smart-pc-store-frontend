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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { Order } from "@/types/order"

import { useEffect } from "react"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"

const formSchema = z.object({
  status: z.enum(["PENDING", "PAID", "CANCELLED", "EXPIRED"]),
})

export type OrderStatusFormValues = z.infer<typeof formSchema>

interface UpdateOrderStatusDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  order?: Order
  onSubmit: (data: OrderStatusFormValues) => Promise<void>
}

export default function UpdateOrderStatusDialog({
  open,
  onOpenChange,
  order,
  onSubmit,
}: UpdateOrderStatusDialogProps) {
  const form = useForm<OrderStatusFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      status: "PENDING",
    },
  })

  // Reset form when dialog opens/closes or order changes
  useEffect(() => {
    if (open && order) {
      form.reset({
        status: order.status,
      })
    } else if (!open) {
      form.reset()
    }
  }, [open, order, form])

  const handleSubmit = async (values: OrderStatusFormValues) => {
    await onSubmit(values)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-106.25">
        <DialogHeader>
          <DialogTitle>Cập nhật đơn hàng</DialogTitle>
          <DialogDescription>
            Thay đổi trạng thái của đơn hàng #{order?.orderCode || order?.id}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Trạng thái</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn trạng thái" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="PENDING">Chờ xử lý (PENDING)</SelectItem>
                        <SelectItem value="PAID">Đã thanh toán (PAID)</SelectItem>
                        <SelectItem value="CANCELLED">Đã hủy (CANCELLED)</SelectItem>
                        <SelectItem value="EXPIRED">Đã hết hạn (EXPIRED)</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="pt-4">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Hủy
              </Button>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? "Đang lưu..." : "Lưu thay đổi"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
