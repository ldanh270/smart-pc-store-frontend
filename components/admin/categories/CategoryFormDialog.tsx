"use client";

import { useEffect, useState } from "react";
import { z } from "zod/v4";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
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
import { Switch } from "@/components/ui/switch";
import type { Category } from "@/types/category";

// ─── Schema ─────────────────────────────────────────────────────────────────

const categoryFormSchema = z.object({
	categoryName: z.string().min(2, "Tên danh mục tối thiểu 2 ký tự"),
	description: z.string().optional(),
	status: z.boolean(),
});

export interface CategoryFormValues {
	categoryName: string;
	description?: string;
	status: boolean;
}

// ─── Props ──────────────────────────────────────────────────────────────────

interface CategoryFormDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	category?: Category;
	onSubmit: (data: CategoryFormValues) => Promise<void> | void;
}

// ─── Component ──────────────────────────────────────────────────────────────

export default function CategoryFormDialog({
	open,
	onOpenChange,
	category,
	onSubmit,
}: CategoryFormDialogProps) {
	const isEditing = !!category;
	const [isSubmitting, setIsSubmitting] = useState(false);

	const form = useForm<CategoryFormValues>({
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		resolver: zodResolver(categoryFormSchema) as any,
		defaultValues: {
			categoryName: "",
			description: "",
			status: true,
		},
	});

	// Reset form with category data when dialog opens
	useEffect(() => {
		if (open) {
			if (category) {
				form.reset({
					categoryName: category.name ?? "",
					description: category.description ?? "",
					status: category.status ?? true,
				});
			} else {
				form.reset({
					categoryName: "",
					description: "",
					status: true,
				});
			}
			setIsSubmitting(false);
		}
	}, [open, category, form]);

	async function handleSubmit(values: CategoryFormValues) {
		setIsSubmitting(true);
		try {
			await onSubmit({
				...values,
				description: values.description || undefined,
			});
		} finally {
			setIsSubmitting(false);
		}
	}

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-md">
				<DialogHeader>
					<DialogTitle>
						{isEditing ? "Chỉnh Sửa Danh Mục" : "Thêm Danh Mục Mới"}
					</DialogTitle>
					<DialogDescription>
						{isEditing
							? "Cập nhật thông tin danh mục sản phẩm."
							: "Điền thông tin để thêm danh mục mới."}
					</DialogDescription>
				</DialogHeader>

				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(handleSubmit)}
						className="space-y-4"
					>
						{/* Category Name */}
						<FormField
							control={form.control}
							name="categoryName"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Tên Danh Mục</FormLabel>
									<FormControl>
										<Input
											placeholder="VD: Laptop, Bàn phím, Chuột..."
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
											placeholder="Mô tả ngắn gọn về danh mục..."
											className="min-h-20 resize-none"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						{/* Status Toggle */}
						<FormField
							control={form.control}
							name="status"
							render={({ field }) => (
								<FormItem className="flex items-center justify-between rounded-lg border border-border p-3">
									<div>
										<FormLabel>Trạng Thái</FormLabel>
										<p className="text-xs text-muted-foreground">
											Hiển thị danh mục trên trang web
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
								disabled={isSubmitting}
							>
								Hủy
							</Button>
							<Button type="submit" disabled={isSubmitting}>
								{isSubmitting && (
									<Loader2 className="mr-2 size-4 animate-spin" />
								)}
								{isEditing ? "Cập Nhật" : "Tạo Mới"}
							</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}
