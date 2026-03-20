"use client";

import { z } from "zod/v4";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useEffect } from "react";
import type { AdminProduct } from "@/types/product";
import { slugify } from "@/types/product";
import { useCategoryStore } from "@/stores/useCategoryStore";
import { useSupplierStore } from "@/stores/useSupplierStore";

// ─── Schema ─────────────────────────────────────────────────────────────────

const productFormSchema = z.object({
	productName: z.string().min(3, "Tên sản phẩm tối thiểu 3 ký tự"),
	description: z.string().optional(),
	imageUrl: z.string().optional(),
	currentPrice: z.coerce.number().min(1000, "Giá tối thiểu 1,000 ₫"),
	quantity: z.coerce.number().min(0, "Số lượng không được âm"),
	categoryId: z.string().min(1, "Chọn danh mục"),
	supplierId: z.string().min(1, "Chọn nhà cung cấp"),
	status: z.boolean(),
});

// Explicitly define form values because z.coerce in Zod v4 infers `unknown`
// which breaks @hookform/resolvers/zod type inference
interface ProductFormValues {
	productName: string;
	description?: string;
	imageUrl?: string;
	currentPrice: number;
	quantity: number;
	categoryId: string;
	supplierId: string;
	status: boolean;
}

// ─── Props ──────────────────────────────────────────────────────────────────

interface ProductFormDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	product?: AdminProduct;
	onSubmit: (data: Omit<AdminProduct, "id">) => void;
}

// ─── Component ──────────────────────────────────────────────────────────────

export default function ProductFormDialog({
	open,
	onOpenChange,
	product,
	onSubmit,
}: ProductFormDialogProps) {
	const isEditing = !!product;
	const { categories, fetchCategories } = useCategoryStore();
	const { suppliers, fetchSuppliers } = useSupplierStore();

	useEffect(() => {
		if (open) {
			if (categories.length === 0) fetchCategories();
			if (suppliers.length === 0) fetchSuppliers();
		}
	}, [open, categories.length, suppliers.length, fetchCategories, fetchSuppliers]);

	const form = useForm<ProductFormValues>({
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		resolver: zodResolver(productFormSchema) as any,
		defaultValues: {
			productName: product?.productName ?? "",
			description: product?.description ?? "",
			imageUrl: product?.imageUrl ?? "",
			currentPrice: product?.currentPrice ?? 0,
			quantity: product?.quantity ?? 0,
			categoryId: product?.categoryId ?? "",
			supplierId: product?.supplierId ?? "",
			status: product?.status ?? true,
		},
	});

	function handleSubmit(values: ProductFormValues) {
		const category = categories.find(
			(c) => c.id === values.categoryId,
		);
		onSubmit({
			...values,
			description: values.description ?? null,
			imageUrl: values.imageUrl || null,
			categoryName: category?.name ?? "Không xác định",
			slug: product?.slug || slugify(values.productName),
		});
		form.reset();
	}

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
				<DialogHeader>
					<DialogTitle>
						{isEditing
							? "Chỉnh Sửa Sản Phẩm"
							: "Thêm Sản Phẩm Mới"}
					</DialogTitle>
					<DialogDescription>
						{isEditing
							? "Cập nhật thông tin sản phẩm."
							: "Điền thông tin để thêm sản phẩm mới."}
					</DialogDescription>
				</DialogHeader>

				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(handleSubmit)}
						className="space-y-4"
					>
						{/* Product Name */}
						<FormField
							control={form.control}
							name="productName"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Tên Sản Phẩm</FormLabel>
									<FormControl>
										<Input
											placeholder="CPU Intel Core i9-14900K"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						{/* Description */}
						<FormField
							control={form.control}
							name="description"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Mô Tả</FormLabel>
									<FormControl>
										<Textarea
											placeholder="Mô tả chi tiết sản phẩm..."
											rows={3}
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						{/* Price & Quantity */}
						<div className="grid gap-4 sm:grid-cols-2">
							<FormField
								control={form.control}
								name="currentPrice"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Giá (₫)</FormLabel>
										<FormControl>
											<Input
												type="number"
												placeholder="14990000"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="quantity"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Tồn Kho</FormLabel>
										<FormControl>
											<Input
												type="number"
												placeholder="25"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>

						{/* Category & Image URL */}
						<div className="grid gap-4 sm:grid-cols-2">
							<FormField
								control={form.control}
								name="categoryId"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Danh Mục</FormLabel>
										<Select
											onValueChange={field.onChange}
											defaultValue={field.value || undefined}
										>
											<FormControl>
												<SelectTrigger>
													<SelectValue placeholder="Chọn danh mục" />
												</SelectTrigger>
											</FormControl>
											<SelectContent>
												{categories.map((cat) => (
													<SelectItem
														key={cat.id}
														value={String(cat.id)}
													>
														{cat.name}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
										<FormMessage />
									</FormItem>
								)}
							/>

							{/* Supplier Selection */}
							<FormField
								control={form.control}
								name="supplierId"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Nhà Cung Cấp</FormLabel>
										<Select
											onValueChange={field.onChange}
											defaultValue={field.value || undefined}
										>
											<FormControl>
												<SelectTrigger>
													<SelectValue placeholder="Chọn nhà cung cấp" />
												</SelectTrigger>
											</FormControl>
											<SelectContent>
												{suppliers.map((sup) => (
													<SelectItem
														key={sup.id}
														value={String(sup.id)}
													>
														{sup.name}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>

						{/* Image URL (Full Width) */}
						<FormField
							control={form.control}
							name="imageUrl"
							render={({ field }) => (
								<FormItem>
									<FormLabel>URL Hình Ảnh</FormLabel>
									<FormControl>
										<Input
											placeholder="/products/cpu.jpg"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						{/* Status */}
						<FormField
							control={form.control}
							name="status"
							render={({ field }) => (
								<FormItem className="flex items-center justify-between rounded-lg border border-border p-3">
									<div>
										<FormLabel>Trạng Thái</FormLabel>
										<p className="text-xs text-muted-foreground">
											Hiển thị sản phẩm trên cửa hàng
										</p>
									</div>
									<FormControl>
										<Switch
											checked={field.value}
											onCheckedChange={field.onChange}
										/>
									</FormControl>
								</FormItem>
							)}
						/>

						<DialogFooter>
							<Button
								type="button"
								variant="outline"
								onClick={() => onOpenChange(false)}
							>
								Hủy
							</Button>
							<Button type="submit">
								{isEditing ? "Cập Nhật" : "Tạo Mới"}
							</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}
