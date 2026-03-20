"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod/v4";
import Image from "next/image";
import {
	Loader2,
	Package,
	ImageIcon,
	Tag,
	DollarSign,
	LayoutGrid,
} from "lucide-react";

import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
	SheetDescription,
} from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

import { useProductStore } from "@/stores/useProductStore";
import { useCategoryStore } from "@/stores/useCategoryStore";
import { useSupplierStore } from "@/stores/useSupplierStore";
import { productService } from "@/services/productService";
import type { AdminProduct } from "@/types/product";

// ── Schemas ───────────────────────────────────────────────────────────────────

const infoSchema = z.object({
	productName: z.string().min(3, "Tên sản phẩm tối thiểu 3 ký tự"),
	description: z.string().optional(),
	imageUrl: z.string().optional(),
	status: z.boolean(),
});

const pricingSchema = z.object({
	currentPrice: z.coerce.number().min(1000, "Giá tối thiểu 1,000 ₫"),
	quantity: z.coerce.number().min(0, "Số lượng không được âm"),
});

const classificationSchema = z.object({
	categoryId: z.string().min(1, "Chọn danh mục"),
	supplierId: z.string().min(1, "Chọn nhà cung cấp"),
});

interface InfoValues {
	productName: string;
	description?: string;
	imageUrl?: string;
	status: boolean;
}

interface PricingValues {
	currentPrice: number;
	quantity: number;
}

interface ClassificationValues {
	categoryId: string;
	supplierId: string;
}

// ── Props ─────────────────────────────────────────────────────────────────────

interface ProductEditSheetProps {
	product: AdminProduct | null;
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function ProductEditSheet({
	product,
	open,
	onOpenChange,
}: ProductEditSheetProps) {
	const { updateProduct } = useProductStore();
	const { categories, fetchCategories } = useCategoryStore();
	const { suppliers, fetchSuppliers } = useSupplierStore();

	const [fetched, setFetched] = useState<AdminProduct | null>(null);
	const [fetchLoading, setFetchLoading] = useState(false);
	const [imagePreview, setImagePreview] = useState("");
	const [infoSubmitting, setInfoSubmitting] = useState(false);
	const [pricingSubmitting, setPricingSubmitting] = useState(false);
	const [classSubmitting, setClassSubmitting] = useState(false);

	// ── Forms ─────────────────────────────────────────────────────────────────

	const infoForm = useForm<InfoValues>({
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		resolver: zodResolver(infoSchema) as any,
		defaultValues: { productName: "", description: "", imageUrl: "", status: true },
	});

	const pricingForm = useForm<PricingValues>({
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		resolver: zodResolver(pricingSchema) as any,
		defaultValues: { currentPrice: 0, quantity: 0 },
	});

	const classificationForm = useForm<ClassificationValues>({
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		resolver: zodResolver(classificationSchema) as any,
		defaultValues: { categoryId: "", supplierId: "" },
	});

	// ── Fetch on open ─────────────────────────────────────────────────────────

	useEffect(() => {
		if (!open || !product) return;

		if (categories.length === 0) fetchCategories();
		if (suppliers.length === 0) fetchSuppliers();

		setFetchLoading(true);
		const identifier = product.slug || product.id;
		productService
			.getProductBySlug(identifier)
			.then((data: AdminProduct) => {
				setFetched(data);
				setImagePreview(data.imageUrl || "");

				infoForm.reset({
					productName: data.productName ?? "",
					description: data.description ?? "",
					imageUrl: data.imageUrl ?? "",
					status: data.status ?? true,
				});
				pricingForm.reset({
					currentPrice: data.currentPrice ?? 0,
					quantity: data.quantity ?? 0,
				});
				classificationForm.reset({
					categoryId: String(data.categoryId ?? ""),
					supplierId: String(data.supplierId ?? ""),
				});
			})
			.finally(() => setFetchLoading(false));
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [open, product?.id]);

	// Live preview from imageUrl field
	const watchedImageUrl = infoForm.watch("imageUrl");
	useEffect(() => {
		setImagePreview(watchedImageUrl || "");
	}, [watchedImageUrl]);

	// ── Handlers ──────────────────────────────────────────────────────────────

	async function onInfoSubmit(values: InfoValues) {
		if (!fetched) return;
		setInfoSubmitting(true);
		try {
			const changed: Partial<InfoValues> = {};
			if (values.productName !== fetched.productName)
				changed.productName = values.productName;
			if ((values.description ?? "") !== (fetched.description ?? ""))
				changed.description = values.description;
			if ((values.imageUrl ?? "") !== (fetched.imageUrl ?? ""))
				changed.imageUrl = values.imageUrl;
			if (values.status !== fetched.status) changed.status = values.status;

			if (Object.keys(changed).length === 0) return;

			const updated = await updateProduct(fetched.id, {
				...fetched,
				...changed,
				description: (changed.description ?? fetched.description) || undefined,
				imageUrl: (changed.imageUrl ?? fetched.imageUrl) || undefined,
			});
			if (updated) {
				setFetched(updated);
				infoForm.reset(values);
			}
		} finally {
			setInfoSubmitting(false);
		}
	}

	async function onPricingSubmit(values: PricingValues) {
		if (!fetched) return;
		setPricingSubmitting(true);
		try {
			const changed: Partial<PricingValues> = {};
			if (values.currentPrice !== fetched.currentPrice)
				changed.currentPrice = values.currentPrice;
			if (values.quantity !== fetched.quantity)
				changed.quantity = values.quantity;

			if (Object.keys(changed).length === 0) return;

			const updated = await updateProduct(fetched.id, {
				...fetched,
				...changed,
				description: fetched.description || undefined,
				imageUrl: fetched.imageUrl || undefined,
			});
			if (updated) {
				setFetched(updated);
				pricingForm.reset(values);
			}
		} finally {
			setPricingSubmitting(false);
		}
	}

	async function onClassificationSubmit(values: ClassificationValues) {
		if (!fetched) return;
		setClassSubmitting(true);
		try {
			const changed: Partial<ClassificationValues> = {};
			if (values.categoryId !== String(fetched.categoryId))
				changed.categoryId = values.categoryId;
			if (values.supplierId !== String(fetched.supplierId))
				changed.supplierId = values.supplierId;

			if (Object.keys(changed).length === 0) return;

			const updated = await updateProduct(fetched.id, {
				productName: fetched.productName,
				description: fetched.description || undefined,
				imageUrl: fetched.imageUrl || undefined,
				currentPrice: fetched.currentPrice,
				quantity: fetched.quantity,
				supplierId: changed.supplierId ?? fetched.supplierId,
				categoryId: changed.categoryId ?? fetched.categoryId,
				status: fetched.status,
			});
			if (updated) {
				setFetched(updated);
				classificationForm.reset(values);
			}
		} finally {
			setClassSubmitting(false);
		}
	}

	// ── Render ────────────────────────────────────────────────────────────────

	return (
		<Sheet open={open} onOpenChange={onOpenChange}>
			<SheetContent className="flex w-full flex-col gap-0 overflow-y-auto p-0 sm:max-w-lg">
				{/* Header */}
				<SheetHeader className="border-b px-6 py-5">
					<SheetTitle className="flex items-center gap-2 text-lg">
						<Package className="size-5 text-muted-foreground" />
						Chỉnh Sửa Sản Phẩm
					</SheetTitle>
					{fetched && !fetchLoading ? (
						<SheetDescription className="flex flex-wrap items-center gap-2 text-xs">
							<span className="font-mono text-muted-foreground">
								#{fetched.id}
							</span>
							<Badge
								variant={fetched.status ? "default" : "secondary"}
								className="text-xs"
							>
								{fetched.status ? "Đang bán" : "Đã ẩn"}
							</Badge>
							{fetched.categoryName && (
								<Badge variant="outline" className="text-xs">
									{fetched.categoryName}
								</Badge>
							)}
						</SheetDescription>
					) : (
						<Skeleton className="h-4 w-48" />
					)}
				</SheetHeader>

				{/* Body */}
				<div className="flex-1 px-6 py-6">
					{fetchLoading ? (
						<div className="space-y-4">
							<Skeleton className="h-40 w-full rounded-xl" />
							<Skeleton className="h-4 w-1/3" />
							<Skeleton className="h-10 w-full" />
							<Skeleton className="h-24 w-full" />
							<Skeleton className="h-10 w-full" />
							<Skeleton className="h-10 w-full" />
						</div>
					) : (
						<Tabs defaultValue="info" className="space-y-5">
							<TabsList className="grid w-full grid-cols-3">
								<TabsTrigger value="info" className="gap-1.5">
									<Tag className="size-3.5" />
									Thông tin
								</TabsTrigger>
								<TabsTrigger value="pricing" className="gap-1.5">
									<DollarSign className="size-3.5" />
									Giá & Kho
								</TabsTrigger>
								<TabsTrigger value="classification" className="gap-1.5">
									<LayoutGrid className="size-3.5" />
									Phân loại
								</TabsTrigger>
							</TabsList>

							{/* ── Tab: Thông tin ─────────────────────────────────────── */}
							<TabsContent value="info">
								<Card>
									<CardHeader className="pb-4">
										<CardTitle className="text-sm font-medium">
											Thông tin cơ bản
										</CardTitle>
										<CardDescription className="text-xs">
											Cập nhật tên, mô tả, hình ảnh và trạng thái hiển thị.
										</CardDescription>
									</CardHeader>
									<CardContent className="space-y-5">
										{/* Image preview */}
										<div className="relative h-40 w-full overflow-hidden rounded-lg border bg-muted">
											{imagePreview ? (
												<Image
													src={imagePreview}
													alt="Xem trước hình ảnh"
													fill
													className="object-contain"
													sizes="(max-width: 512px) 100vw, 512px"
												/>
											) : (
												<div className="flex h-full flex-col items-center justify-center gap-2 text-muted-foreground">
													<ImageIcon className="size-10 opacity-30" />
													<span className="text-xs">Chưa có hình ảnh</span>
												</div>
											)}
										</div>

										<Separator />

										<Form {...infoForm}>
											<form
												onSubmit={infoForm.handleSubmit(onInfoSubmit)}
												className="space-y-4"
											>
												<FormField
													control={infoForm.control}
													name="productName"
													render={({ field }) => (
														<FormItem>
															<FormLabel>Tên sản phẩm</FormLabel>
															<FormControl>
																<Input
																	placeholder="Nhập tên sản phẩm..."
																	{...field}
																/>
															</FormControl>
															<FormMessage />
														</FormItem>
													)}
												/>

												<FormField
													control={infoForm.control}
													name="description"
													render={({ field }) => (
														<FormItem>
															<FormLabel>Mô tả</FormLabel>
															<FormControl>
																<Textarea
																	placeholder="Mô tả chi tiết sản phẩm..."
																	className="min-h-24 resize-none"
																	{...field}
																/>
															</FormControl>
															<FormMessage />
														</FormItem>
													)}
												/>

												<FormField
													control={infoForm.control}
													name="imageUrl"
													render={({ field }) => (
														<FormItem>
															<FormLabel>URL hình ảnh</FormLabel>
															<FormControl>
																<Input
																	placeholder="https://..."
																	{...field}
																/>
															</FormControl>
															<FormMessage />
														</FormItem>
													)}
												/>

												<FormField
													control={infoForm.control}
													name="status"
													render={({ field }) => (
														<FormItem className="flex items-center justify-between rounded-lg border p-3">
															<div className="space-y-0.5">
																<FormLabel className="text-sm">
																	Trạng thái hiển thị
																</FormLabel>
																<p className="text-xs text-muted-foreground">
																	{field.value
																		? "Đang hiển thị và bán trên cửa hàng"
																		: "Đã ẩn khỏi cửa hàng"}
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

												<div className="flex justify-end pt-1">
													<Button
														type="submit"
														disabled={
															!infoForm.formState.isDirty || infoSubmitting
														}
													>
														{infoSubmitting && (
															<Loader2 className="mr-2 size-4 animate-spin" />
														)}
														Lưu thay đổi
													</Button>
												</div>
											</form>
										</Form>
									</CardContent>
								</Card>
							</TabsContent>

							{/* ── Tab: Giá & Kho ─────────────────────────────────────── */}
							<TabsContent value="pricing">
								<Card>
									<CardHeader className="pb-4">
										<CardTitle className="text-sm font-medium">
											Giá bán & Tồn kho
										</CardTitle>
										<CardDescription className="text-xs">
											Điều chỉnh giá bán và số lượng sản phẩm.
										</CardDescription>
									</CardHeader>
									<CardContent className="space-y-5">
										{/* Current values reference */}
										{fetched && (
											<div className="grid grid-cols-2 gap-3 rounded-lg bg-muted/50 p-3 text-sm">
												<div className="space-y-0.5">
													<p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
														Giá hiện tại
													</p>
													<p className="font-semibold text-foreground">
														{fetched.currentPrice.toLocaleString("vi-VN")} ₫
													</p>
												</div>
												<div className="space-y-0.5">
													<p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
														Tồn kho hiện tại
													</p>
													<p className="font-semibold text-foreground">
														{fetched.quantity} sản phẩm
													</p>
												</div>
											</div>
										)}

										<Separator />

										<Form {...pricingForm}>
											<form
												onSubmit={pricingForm.handleSubmit(onPricingSubmit)}
												className="space-y-4"
											>
												<FormField
													control={pricingForm.control}
													name="currentPrice"
													render={({ field }) => (
														<FormItem>
															<FormLabel>Giá bán (₫)</FormLabel>
															<FormControl>
																<Input type="number" min={0} {...field} />
															</FormControl>
															<FormMessage />
														</FormItem>
													)}
												/>

												<FormField
													control={pricingForm.control}
													name="quantity"
													render={({ field }) => (
														<FormItem>
															<FormLabel>Số lượng tồn kho</FormLabel>
															<FormControl>
																<Input type="number" min={0} {...field} />
															</FormControl>
															<FormMessage />
														</FormItem>
													)}
												/>

												<div className="flex justify-end pt-1">
													<Button
														type="submit"
														disabled={
															!pricingForm.formState.isDirty ||
															pricingSubmitting
														}
													>
														{pricingSubmitting && (
															<Loader2 className="mr-2 size-4 animate-spin" />
														)}
														Lưu thay đổi
													</Button>
												</div>
											</form>
										</Form>
									</CardContent>
								</Card>
							</TabsContent>

							{/* ── Tab: Phân loại ─────────────────────────────────────── */}
							<TabsContent value="classification">
								<Card>
									<CardHeader className="pb-4">
										<CardTitle className="text-sm font-medium">
											Phân loại sản phẩm
										</CardTitle>
										<CardDescription className="text-xs">
											Chỉnh danh mục và nhà cung cấp của sản phẩm.
										</CardDescription>
									</CardHeader>
									<CardContent className="space-y-5">
										{/* Current values reference */}
										{fetched && (
											<div className="grid grid-cols-2 gap-3 rounded-lg bg-muted/50 p-3 text-sm">
												<div className="space-y-0.5">
													<p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
														Danh mục hiện tại
													</p>
													<p className="font-medium text-foreground">
														{fetched.categoryName || "—"}
													</p>
												</div>
												<div className="space-y-0.5">
													<p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
														Nhà cung cấp hiện tại
													</p>
													<p className="font-medium text-foreground">
														{fetched.supplierName || "—"}
													</p>
												</div>
											</div>
										)}

										<Separator />

										<Form {...classificationForm}>
											<form
												onSubmit={classificationForm.handleSubmit(
													onClassificationSubmit,
												)}
												className="space-y-4"
											>
												<FormField
													control={classificationForm.control}
													name="categoryId"
													render={({ field }) => (
														<FormItem>
															<FormLabel>Danh mục</FormLabel>
															<Select
																onValueChange={field.onChange}
																value={field.value}
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

												<FormField
													control={classificationForm.control}
													name="supplierId"
													render={({ field }) => (
														<FormItem>
															<FormLabel>Nhà cung cấp</FormLabel>
															<Select
																onValueChange={field.onChange}
																value={field.value}
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

												<div className="flex justify-end pt-1">
													<Button
														type="submit"
														disabled={
															!classificationForm.formState.isDirty ||
															classSubmitting
														}
													>
														{classSubmitting && (
															<Loader2 className="mr-2 size-4 animate-spin" />
														)}
														Lưu thay đổi
													</Button>
												</div>
											</form>
										</Form>
									</CardContent>
								</Card>
							</TabsContent>
						</Tabs>
					)}
				</div>
			</SheetContent>
		</Sheet>
	);
}
