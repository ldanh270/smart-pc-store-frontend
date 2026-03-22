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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import { useProductStore } from "@/stores/useProductStore"
import { useSupplierStore } from "@/stores/useSupplierStore"
import type { AdminProduct } from "@/types/product"
import type { Supplier } from "@/types/supplier"
import type { StockImport, StockImportAdjustDto, StockImportCreateDto } from "@/types/stockImport"

import { useEffect, useMemo, useState } from "react"

import { zodResolver } from "@hookform/resolvers/zod"
import { Plus, Trash2, Loader2, Info } from "lucide-react"
import { useFieldArray, useForm } from "react-hook-form"
import { z } from "zod"

import { ProductCombobox } from "./ProductCombobox"

// ─── Schema ─────────────────────────────────────────────────────────────────

const itemSchema = z.object({
  productId: z.string().min(1, "Chọn sản phẩm"),
  productName: z.string().optional(), // Để hiển thị khi adjust
  originalQuantity: z.number().optional(), // Lưu số lượng gốc để tham khảo
  quantity: z.coerce.number().int().min(-1000000, "Số lượng không hợp lệ"),
  unitPrice: z.coerce.number().min(0, "Đơn giá không hợp lệ"),
})

const formSchema = z.object({
  supplierId: z.string().min(1, "Chọn nhà cung cấp"),
  expectedDeliveryDate: z.string().min(1, "Chọn ngày dự kiến giao"),
  note: z.string().optional(),
  items: z.array(itemSchema).min(1, "Cần ít nhất 1 sản phẩm"),
})

type FormValues = z.output<typeof formSchema>
type FormInputValues = z.input<typeof formSchema>

// ─── Props ──────────────────────────────────────────────────────────────────

type StockImportFormDialogProps =
  | {
      open: boolean
      onOpenChange: (open: boolean) => void
      stockImport?: StockImport
      isAdjustment?: false
      onSubmit: (data: StockImportCreateDto) => Promise<boolean>
    }
  | {
      open: boolean
      onOpenChange: (open: boolean) => void
      stockImport?: StockImport
      isAdjustment: true
      onSubmit: (data: StockImportAdjustDto) => Promise<boolean>
    }

// ─── Component ──────────────────────────────────────────────────────────────

export default function StockImportFormDialog(props: StockImportFormDialogProps) {
  const { open, onOpenChange, stockImport } = props
  const isAdjustment = props.isAdjustment === true
  const isEditing = !!stockImport && !isAdjustment
  const [submitting, setSubmitting] = useState(false)
  const { suppliers, fetchSuppliers } = useSupplierStore()
  const { products, fetchProducts } = useProductStore()

  const form = useForm<FormInputValues, unknown, FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      supplierId: "",
      expectedDeliveryDate: new Date().toISOString().split("T")[0],
      note: "",
      items: [{ productId: "", quantity: 1, unitPrice: 0 }],
    },
  })

  useEffect(() => {
    if (open) {
      fetchSuppliers()
      fetchProducts()
      if (stockImport) {
        form.reset({
          supplierId: stockImport.supplierId || "",
          expectedDeliveryDate: stockImport.createdAt?.split("T")[0] || new Date().toISOString().split("T")[0],
          note: stockImport.notes ?? "",
          items: stockImport.items.map((i) => ({
            productId: i.productId,
            productName: i.productName,
            originalQuantity: i.quantity,
            // Nếu là adjustment, mặc định số lượng điều chỉnh là 0
            quantity: isAdjustment ? 0 : i.quantity,
            unitPrice: i.unitPrice,
          })),
        })
      } else {
        form.reset({
          supplierId: "",
          expectedDeliveryDate: new Date().toISOString().split("T")[0],
          note: "",
          items: [{ productId: "", quantity: 1, unitPrice: 0 }],
        })
      }
    }
  }, [open, stockImport, isAdjustment, fetchSuppliers, fetchProducts, form])

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "items",
  })

  const watchedItems = form.watch("items") || []
  const grandTotal = watchedItems.reduce(
    (sum, item) => sum + (Number(item?.quantity) || 0) * (Number(item?.unitPrice) || 0),
    0,
  )

  async function handleSubmit(values: FormValues) {
    setSubmitting(true)
    try {
      if (isAdjustment) {
        const data: StockImportAdjustDto = {
          items: values.items.map((item) => ({
            productId: item.productId,
            quantity: Number(item.quantity),
            unitPrice: Number(item.unitPrice),
          })),
        }
        const success = await props.onSubmit(data)
        if (success) {
          onOpenChange(false)
          form.reset()
        }
      } else {
        const data: StockImportCreateDto = {
          supplierId: values.supplierId,
          expectedDeliveryDate: values.expectedDeliveryDate,
          note: values.note || undefined,
          items: values.items.map((item) => ({
            productId: item.productId,
            quantity: Number(item.quantity),
            unitPrice: Number(item.unitPrice),
          })),
        }
        const success = await props.onSubmit(data)
        if (success) {
          onOpenChange(false)
          form.reset()
        }
      }
    } catch (error) {
      console.error("Failed to submit form:", error)
    } finally {
      setSubmitting(false)
    }
  }

  const activeSuppliers = suppliers.filter((s) => s.status)
  const activeProducts = products.filter((p) => p.status)
  const supplierOptions: Supplier[] = useMemo(() => {
    if (!stockImport?.supplierId) return activeSuppliers
    const hasCurrentSupplier = activeSuppliers.some((s) => s.id === stockImport.supplierId)
    if (hasCurrentSupplier) return activeSuppliers
    return [
      ...activeSuppliers,
      {
        id: stockImport.supplierId,
        name: stockImport.supplierName || "Nhà cung cấp hiện tại",
        status: false,
        createdAt: stockImport.createdAt,
        updatedAt: stockImport.updatedAt,
      },
    ]
  }, [activeSuppliers, stockImport])
  const productOptions: AdminProduct[] = useMemo(() => {
    if (!stockImport?.items.length) return activeProducts

    const existingIds = new Set(activeProducts.map((p) => p.id))
    const missingProducts: AdminProduct[] = []

    for (const item of stockImport.items) {
      if (existingIds.has(item.productId)) continue
      existingIds.add(item.productId)
      missingProducts.push({
        id: item.productId,
        productName: item.productName || "Sản phẩm hiện tại",
        slug: item.productId,
        description: null,
        imageUrl: null,
        currentPrice: item.unitPrice,
        quantity: 0,
        categoryId: "",
        supplierId: stockImport.supplierId,
        supplierName: stockImport.supplierName,
        status: false,
      })
    }

    return [...activeProducts, ...missingProducts]
  }, [activeProducts, stockImport])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={cn(
          "max-h-[90vh] overflow-y-auto",
          isAdjustment ? "sm:max-w-3xl" : "sm:max-w-2xl",
        )}
      >
        <DialogHeader>
          <DialogTitle>
            {isAdjustment
              ? "Điều Chỉnh Phiếu Nhập"
              : isEditing
                ? "Chỉnh Sửa Phiếu Nhập"
                : "Tạo Phiếu Nhập Hàng"}
          </DialogTitle>
          <DialogDescription>
            {isAdjustment
              ? `Đang điều chỉnh phiếu: ${stockImport?.importCode}. Nhập số lượng cộng thêm hoặc trừ đi.`
              : isEditing
                ? "Cập nhật thông tin phiếu nhập hàng."
                : "Điền thông tin để tạo phiếu nhập hàng mới."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-5">
            {!isAdjustment && (
              <div className="grid gap-4 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="supplierId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nhà Cung Cấp</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Chọn nhà cung cấp" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {supplierOptions.map((s) => (
                            <SelectItem key={s.id} value={s.id}>
                              {s.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="expectedDeliveryDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ngày Dự Kiến Giao</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="note"
                  render={({ field }) => (
                    <FormItem className="sm:col-span-2">
                      <FormLabel>GHI CHÚ</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Ghi chú (không bắt buộc)"
                          className="h-10 resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}

            {isAdjustment && (
              <div className="border-border bg-muted/40 flex gap-3 rounded-lg border p-4">
                <Info className="text-primary mt-0.5 size-5 shrink-0" />
                <div className="space-y-1">
                  <p className="text-foreground text-sm font-semibold">Hướng dẫn điều chỉnh</p>
                  <ul className="text-muted-foreground list-disc space-y-1 pl-5 text-sm">
                    <li>Nhập số dương (ví dụ: `5`) để tăng số lượng kho.</li>
                    <li>Nhập số âm (ví dụ: `-3`) để giảm số lượng kho.</li>
                    <li>Có thể nhập đơn giá khác so với phiếu gốc.</li>
                  </ul>
                </div>
              </div>
            )}

            <Separator />

            {/* Items */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold">Danh Sách Sản Phẩm</p>
                {!isAdjustment && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => append({ productId: "", quantity: 1, unitPrice: 0 })}
                    disabled={submitting}
                  >
                    <Plus className="mr-1 size-3" />
                    Thêm dòng
                  </Button>
                )}
              </div>

              <div className="space-y-3">
                {fields.map((field, idx) => {
                  const qty = Number(watchedItems[idx]?.quantity) || 0
                  const price = Number(watchedItems[idx]?.unitPrice) || 0
                  const lineTotal = qty * price
                  const originalQty = watchedItems[idx]?.originalQuantity
                  const productName =
                    typeof watchedItems[idx]?.productName === "string"
                      ? watchedItems[idx].productName
                      : "Sản phẩm không xác định"
                  const productId =
                    typeof watchedItems[idx]?.productId === "string" ? watchedItems[idx].productId : ""

                  return (
                    <div key={field.id} className="border-border space-y-3 rounded-lg border p-3">
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground text-xs font-medium">
                          Dòng #{idx + 1}
                        </span>
                        {isAdjustment && (
                          <span className="text-muted-foreground text-xs">
                            SL gốc: <span className="text-foreground font-mono">{originalQty ?? 0}</span>
                          </span>
                        )}
                        {!isAdjustment && fields.length > 1 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="text-destructive hover:text-destructive size-6"
                            onClick={() => remove(idx)}
                            disabled={submitting}
                          >
                            <Trash2 className="size-3" />
                          </Button>
                        )}
                      </div>

                      {isAdjustment ? (
                        <div className="space-y-1">
                          <p className="text-muted-foreground text-xs font-medium">Sản phẩm</p>
                          <div className="border-border bg-muted/30 rounded-md border px-3 py-2">
                            <p className="text-foreground text-sm font-medium">{productName}</p>
                            <p className="text-muted-foreground font-mono text-xs">{productId}</p>
                          </div>
                        </div>
                      ) : (
                        <FormField
                          control={form.control}
                          name={`items.${idx}.productId`}
                          render={({ field: f }) => (
                            <FormItem>
                              <FormLabel className="text-xs">Sản Phẩm</FormLabel>
                              <FormControl>
                                <ProductCombobox
                                  products={productOptions}
                                  value={typeof f.value === "string" ? f.value : ""}
                                  onChange={f.onChange}
                                  disabled={submitting}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      )}

                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                        <FormField
                          control={form.control}
                          name={`items.${idx}.quantity`}
                          render={({ field: f }) => (
                            <FormItem>
                              <FormLabel className="text-xs">
                                {isAdjustment ? "SL Điều Chỉnh" : "Số Lượng"}
                              </FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  placeholder="0"
                                  name={f.name}
                                  ref={f.ref}
                                  onBlur={f.onBlur}
                                  value={
                                    typeof f.value === "number" || typeof f.value === "string"
                                      ? f.value
                                      : ""
                                  }
                                  onChange={(e) => f.onChange(e.target.value)}
                                  disabled={submitting}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name={`items.${idx}.unitPrice`}
                          render={({ field: f }) => (
                            <FormItem>
                              <FormLabel className="text-xs">Đơn Giá (₫)</FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  min={0}
                                  placeholder="0"
                                  name={f.name}
                                  ref={f.ref}
                                  onBlur={f.onBlur}
                                  value={
                                    typeof f.value === "number" || typeof f.value === "string"
                                      ? f.value
                                      : ""
                                  }
                                  onChange={(e) => f.onChange(e.target.value)}
                                  disabled={submitting}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <div className="space-y-2">
                          <p className="text-muted-foreground text-xs font-medium">Giá trị điều chỉnh</p>
                          <div
                            className={cn(
                              "border-border bg-card text-foreground flex h-9 items-center rounded-md border px-3 text-sm font-medium",
                              "font-mono",
                              lineTotal < 0 && "text-destructive",
                            )}
                          >
                            {lineTotal.toLocaleString("vi-VN")}₫
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Grand total */}
              <div className="border-border bg-card flex justify-end rounded-lg border px-4 py-3">
                <div className="text-right">
                  <p className="text-muted-foreground text-xs">Tổng giá trị điều chỉnh</p>
                  <p
                    className={cn(
                      "font-mono text-2xl font-bold",
                      grandTotal < 0 ? "text-destructive" : "text-primary",
                    )}
                  >
                    {grandTotal.toLocaleString("vi-VN")}₫
                  </p>
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={submitting}>
                Hủy
              </Button>
              <Button type="submit" disabled={submitting}>
                {submitting && <Loader2 className="mr-2 size-4 animate-spin" />}
                {isAdjustment ? "Xác Nhận Điều Chỉnh" : isEditing ? "Cập Nhật" : "Tạo Phiếu Nhập"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
