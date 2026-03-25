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
import type {
  PurchaseOrderType,
  StockImport,
  StockImportCreateDto,
  StockImportUpdateDto,
} from "@/types/stockImport"

import { useEffect, useMemo, useState } from "react"

import { zodResolver } from "@hookform/resolvers/zod"
import { Info, Loader2, Plus, Trash2 } from "lucide-react"
import { useFieldArray, useForm } from "react-hook-form"
import { z } from "zod"

import { ProductCombobox } from "./ProductCombobox"

// ─── Schema ──────────────────────────────────────────────────────────────────

const itemSchema = z.object({
  productId: z.string().min(1, "Chọn sản phẩm"),
  quantity: z.coerce.number().int().refine((val) => val !== 0, "Số lượng không được bằng 0"),
  unitPrice: z.coerce.number().min(0, "Đơn giá không hợp lệ"),
})

const formSchema = z.object({
  supplierId: z.string().min(1, "Chọn nhà cung cấp"),
  expectedDeliveryDate: z.string().min(1, "Chọn ngày dự kiến giao"),
  type: z.enum(["NORMAL", "ADJUSTMENT", "IMPORT"]).default("NORMAL"),
  note: z.string().optional(),
  items: z.array(itemSchema).min(1, "Cần ít nhất 1 sản phẩm"),
})

type FormValues = z.output<typeof formSchema>
type FormInputValues = z.input<typeof formSchema>

// ─── Props ───────────────────────────────────────────────────────────────────

interface StockImportFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  /** Pass to enable edit mode */
  stockImport?: StockImport
  onSubmit: (data: StockImportCreateDto | StockImportUpdateDto) => Promise<boolean>
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function StockImportFormDialog({
  open,
  onOpenChange,
  stockImport,
  onSubmit,
}: StockImportFormDialogProps) {
  const isEditing = !!stockImport
  const [submitting, setSubmitting] = useState(false)
  const { suppliers, fetchSuppliers } = useSupplierStore()
  const { products, fetchProducts } = useProductStore()

  const form = useForm<FormInputValues, unknown, FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      supplierId: "",
      expectedDeliveryDate: new Date().toISOString().split("T")[0],
      type: "NORMAL",
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
          expectedDeliveryDate: stockImport.expectedDeliveryDate?.split("T")[0] || new Date().toISOString().split("T")[0],
          type: stockImport.type || "NORMAL",
          note: stockImport.note ?? "",
          items: stockImport.items.map((i) => ({
            productId: i.productId,
            quantity: i.quantity,
            unitPrice: i.unitPrice,
          })),
        })
      } else {
        form.reset({
          supplierId: "",
          expectedDeliveryDate: new Date().toISOString().split("T")[0],
          type: "NORMAL",
          note: "",
          items: [{ productId: "", quantity: 1, unitPrice: 0 }],
        })
      }
    }
  }, [open, stockImport, fetchSuppliers, fetchProducts, form])

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
      const payload: StockImportCreateDto = {
        supplierId: values.supplierId,
        expectedDeliveryDate: values.expectedDeliveryDate,
        type: values.type,
        note: values.note || undefined,
        items: values.items.map((item) => ({
          productId: item.productId,
          quantity: Number(item.quantity),
          unitPrice: Number(item.unitPrice),
        })),
      }
      const success = await onSubmit(payload)
      if (success) {
        onOpenChange(false)
        form.reset()
      }
    } catch (error) {
      console.error("Failed to submit form:", error)
    } finally {
      setSubmitting(false)
    }
  }

  // Build supplier/product option lists (include current PO's supplier/products even if inactive)
  const activeSuppliers = suppliers.filter((s) => s.status)
  const activeProducts = products.filter((p) => p.status)

  const supplierOptions: Supplier[] = useMemo(() => {
    if (!stockImport?.supplierId) return activeSuppliers
    const found = activeSuppliers.some((s) => s.id === stockImport.supplierId)
    if (found) return activeSuppliers
    return [
      ...activeSuppliers,
      {
        id: stockImport.supplierId,
        name: stockImport.supplierName || "Nhà cung cấp hiện tại",
        status: false,
        createdAt: stockImport.createdAt,
        updatedAt: stockImport.createdAt,
      },
    ]
  }, [activeSuppliers, stockImport])

  const productOptions: AdminProduct[] = useMemo(() => {
    if (!stockImport?.items.length) return activeProducts
    const existingIds = new Set(activeProducts.map((p) => p.id))
    const missing: AdminProduct[] = []
    for (const item of stockImport.items) {
      if (existingIds.has(item.productId)) continue
      existingIds.add(item.productId)
      missing.push({
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
    return [...activeProducts, ...missing]
  }, [activeProducts, stockImport])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Chỉnh Sửa Đơn Đặt Hàng" : "Tạo Đơn Đặt Hàng Mới"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? `Cập nhật thông tin đơn ${stockImport.importCode}. Chỉ có thể sửa khi đơn ở trạng thái Nháp (DRAFT).`
              : "Tạo đơn đặt hàng mới. Đơn sẽ ở trạng thái Nháp (DRAFT) — chưa nhập kho."}
          </DialogDescription>
        </DialogHeader>

        {/* Info banner */}
        <div className="border-border bg-muted/40 flex gap-3 rounded-lg border p-3">
          <Info className="text-primary mt-0.5 size-4 shrink-0" />
          <p className="text-muted-foreground text-xs leading-relaxed">
            {isEditing
              ? "Chỉnh sửa đơn nháp. Để nhập kho, hãy nhấn Nhận Hàng sau khi lưu."
              : "Sau khi tạo, đơn ở trạng thái Nháp. Nhập kho xảy ra ở bước Nhận Hàng (Receive)."}
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-5">
            {/* Header fields */}
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
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Loại Phiếu</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value} disabled={isEditing}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn loại phiếu" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="NORMAL">Nhập hàng thường</SelectItem>
                        <SelectItem value="ADJUSTMENT">Điều chỉnh tồn kho</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="note"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ghi Chú</FormLabel>
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

            <Separator />

            {/* Items */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold">Danh Sách Sản Phẩm</p>
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
              </div>

              <div className="space-y-3">
                {fields.map((field, idx) => {
                  const qty = Number(watchedItems[idx]?.quantity) || 0
                  const price = Number(watchedItems[idx]?.unitPrice) || 0
                  const lineTotal = qty * price

                  return (
                    <div key={field.id} className="border-border space-y-3 rounded-lg border p-3">
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground text-xs font-medium">
                          Dòng #{idx + 1}
                        </span>
                        {fields.length > 1 && (
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

                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                        <FormField
                          control={form.control}
                          name={`items.${idx}.quantity`}
                          render={({ field: f }) => (
                            <FormItem>
                              <FormLabel className="text-xs">Số Lượng</FormLabel>
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
                          <p className="text-muted-foreground text-xs font-medium">Thành Tiền</p>
                          <div
                            className={cn(
                              "border-border bg-card text-foreground flex h-9 items-center rounded-md border px-3 font-mono text-sm font-medium",
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
                  <p className="text-muted-foreground text-xs">Tổng Giá Trị Đơn Hàng</p>
                  <p className={cn("font-mono text-2xl font-bold", "text-primary")}>
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
                {isEditing ? "Lưu Thay Đổi" : "Tạo Đơn Nháp"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
