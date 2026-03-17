"use client";

import { useEffect } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod/v4";
import { Plus, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { useSupplierStore } from "@/stores/useSupplierStore";
import { useProductStore } from "@/stores/useProductStore";
import type { StockImport, StockImportCreateDto } from "@/types/stockImport";
import { ProductCombobox } from "./ProductCombobox";

// ─── Schema ─────────────────────────────────────────────────────────────────

const itemSchema = z.object({
  productId: z.string().min(1, "Chọn sản phẩm"),
  quantity: z.coerce.number().int().min(1, "Số lượng tối thiểu 1"),
  unitPrice: z.coerce.number().min(0, "Đơn giá không hợp lệ"),
});

const formSchema = z.object({
  supplierId: z.string().min(1, "Chọn nhà cung cấp"),
  expectedDeliveryDate: z.string().min(1, "Chọn ngày dự kiến giao"),
  note: z.string().optional(),
  items: z.array(itemSchema).min(1, "Cần ít nhất 1 sản phẩm"),
});

type FormValues = z.infer<typeof formSchema>;

// ─── Props ──────────────────────────────────────────────────────────────────

interface StockImportFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  stockImport?: StockImport;
  onSubmit: (data: StockImportCreateDto) => void;
}

// ─── Component ──────────────────────────────────────────────────────────────

export default function StockImportFormDialog({
  open,
  onOpenChange,
  stockImport,
  onSubmit,
}: StockImportFormDialogProps) {
  const isEditing = !!stockImport;
  const { suppliers, fetchSuppliers } = useSupplierStore();
  const { products, fetchProducts } = useProductStore();

  useEffect(() => {
    if (open) {
      fetchSuppliers();
      fetchProducts();
    }
  }, [open, fetchSuppliers, fetchProducts]);

  const form = useForm<FormValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(formSchema) as any,
    defaultValues: {
      supplierId: stockImport?.supplierId ?? "",
      expectedDeliveryDate: stockImport ? stockImport.createdAt.split("T")[0] : new Date().toISOString().split("T")[0],
      note: stockImport?.notes ?? "",
      items: stockImport?.items.map((i) => ({
        productId: i.productId,
        quantity: i.quantity,
        unitPrice: i.unitPrice,
      })) ?? [{ productId: "", quantity: 1, unitPrice: 0 }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "items",
  });

  const watchedItems = form.watch("items");
  const grandTotal = watchedItems.reduce(
    (sum, item) => sum + (item.quantity || 0) * (item.unitPrice || 0),
    0
  );

  function handleSubmit(values: FormValues) {
    onSubmit({
      supplierId: values.supplierId,
      expectedDeliveryDate: values.expectedDeliveryDate,
      note: values.note || undefined,
      items: values.items,
    });
    form.reset();
  }

  const activeSuppliers = suppliers.filter((s) => s.status);
  const activeProducts = products.filter((p) => p.status);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Chỉnh Sửa Phiếu Nhập" : "Tạo Phiếu Nhập Hàng"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Cập nhật thông tin phiếu nhập hàng."
              : "Điền thông tin để tạo phiếu nhập hàng mới."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-5"
          >
            {/* Supplier, Date & Notes */}
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
                        {activeSuppliers.map((s) => (
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
                      <Input
                        type="date"
                        {...field}
                      />
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
                        className="resize-none h-10"
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
                  onClick={() =>
                    append({ productId: "", quantity: 1, unitPrice: 0 })
                  }
                >
                  <Plus className="mr-1 size-3" />
                  Thêm dòng
                </Button>
              </div>

              {fields.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">
                  Chưa có sản phẩm. Nhấn &quot;Thêm dòng&quot; để bắt đầu.
                </p>
              )}

              <div className="space-y-3">
                {fields.map((field, idx) => {
                  const qty = watchedItems[idx]?.quantity || 0;
                  const price = watchedItems[idx]?.unitPrice || 0;
                  const lineTotal = qty * price;

                  return (
                    <div
                      key={field.id}
                      className="rounded-lg border border-border p-3 space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-medium text-muted-foreground">
                          Sản phẩm #{idx + 1}
                        </span>
                        {fields.length > 1 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="size-6 text-destructive hover:text-destructive"
                            onClick={() => remove(idx)}
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
                                products={activeProducts}
                                value={f.value}
                                onChange={f.onChange}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="grid grid-cols-3 gap-3">
                        <FormField
                          control={form.control}
                          name={`items.${idx}.quantity`}
                          render={({ field: f }) => (
                            <FormItem>
                              <FormLabel className="text-xs">
                                Số Lượng
                              </FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  min={1}
                                  placeholder="0"
                                  {...f}
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
                              <FormLabel className="text-xs">
                                Đơn Giá (₫)
                              </FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  min={0}
                                  placeholder="0"
                                  {...f}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <div className="space-y-2">
                          <p className="text-xs font-medium">Thành Tiền</p>
                          <div className="flex h-9 items-center rounded-md border border-border bg-muted/40 px-3 text-sm font-medium">
                            {lineTotal.toLocaleString("vi-VN")}₫
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Grand total */}
              <div className="flex justify-end rounded-lg border border-border bg-muted/30 px-4 py-3">
                <div className="text-right">
                  <p className="text-xs text-muted-foreground">Tổng Tiền</p>
                  <p className="text-xl font-bold text-primary">
                    {grandTotal.toLocaleString("vi-VN")}₫
                  </p>
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Hủy
              </Button>
              <Button type="submit">
                {isEditing ? "Cập Nhật" : "Tạo Phiếu Nhập"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
