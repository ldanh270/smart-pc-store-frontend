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
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import type { Supplier } from "@/types/supplier"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod/v4"

// ─── Schema ─────────────────────────────────────────────────────────────────

const supplierFormSchema = z.object({
  name: z.string().min(2, "Tên nhà cung cấp tối thiểu 2 ký tự"),
  contactName: z.string().optional(),
  email: z.string().email("Email không hợp lệ").optional().or(z.literal("")),
  phone: z.string().optional(),
  address: z.string().optional(),
  status: z.boolean(),
})

interface SupplierFormValues {
  name: string
  contactName?: string
  email?: string
  phone?: string
  address?: string
  status: boolean
}

// ─── Props ──────────────────────────────────────────────────────────────────

interface SupplierFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  supplier?: Supplier
  onSubmit: (data: Omit<Supplier, "id" | "createdAt" | "updatedAt">) => void
}

// ─── Component ──────────────────────────────────────────────────────────────

export default function SupplierFormDialog({
  open,
  onOpenChange,
  supplier,
  onSubmit,
}: SupplierFormDialogProps) {
  const isEditing = !!supplier

  const form = useForm<SupplierFormValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(supplierFormSchema) as any,
    defaultValues: {
      name: supplier?.name ?? "",
      contactName: supplier?.contactName ?? "",
      email: supplier?.email ?? "",
      phone: supplier?.phone ?? "",
      address: supplier?.address ?? "",
      status: supplier?.status ?? true,
    },
  })

  function handleSubmit(values: SupplierFormValues) {
    onSubmit({
      ...values,
      email: values.email || undefined,
      phone: values.phone || undefined,
      address: values.address || undefined,
      contactName: values.contactName || undefined,
    })
    form.reset()
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Chỉnh sửa Nhà Cung Cấp" : "Thêm Nhà Cung Cấp"}</DialogTitle>
          <DialogDescription>
            {isEditing ? "Cập nhật thông tin chi tiết." : "Điển thông tin nhà cung cấp mới."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tên Nhà Cung Cấp</FormLabel>
                  <FormControl>
                    <Input placeholder="Intel Vietnam" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="contactName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Người Liên Hệ</FormLabel>
                  <FormControl>
                    <Input placeholder="Nguyễn Văn A" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="contact@intel.vn" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Số điện thoại</FormLabel>
                    <FormControl>
                      <Input placeholder="0901234567" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Địa Chỉ</FormLabel>
                  <FormControl>
                    <Input placeholder="Quận 1, TP Hồ Chí Minh" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem className="border-border flex items-center justify-between rounded-lg border p-3">
                  <div>
                    <FormLabel>Trạng Thái</FormLabel>
                    <p className="text-muted-foreground text-xs">Hiển thị mua bán/nhập hàng</p>
                  </div>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Hủy
              </Button>
              <Button type="submit">{isEditing ? "Cập Nhật" : "Tạo Mới"}</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
