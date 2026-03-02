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
import { Button } from "@/components/ui/button";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import type { User } from "@/types/user";

// ─── Schema ─────────────────────────────────────────────────────────────────

const userFormSchema = z.object({
	username: z.string().min(3, "Username tối thiểu 3 ký tự"),
	displayName: z.string().min(2, "Tên hiển thị tối thiểu 2 ký tự"),
	email: z.email("Email không hợp lệ"),
	phone: z.string().optional(),
	address: z.string().optional(),
	role: z.enum(["user", "admin"]),
	status: z.enum(["active", "inactive"]),
});

type UserFormValues = z.infer<typeof userFormSchema>;

// ─── Props ──────────────────────────────────────────────────────────────────

interface UserFormDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	user?: User;
	onSubmit: (data: UserFormValues) => void;
}

// ─── Component ──────────────────────────────────────────────────────────────

export default function UserFormDialog({
	open,
	onOpenChange,
	user,
	onSubmit,
}: UserFormDialogProps) {
	const isEditing = !!user;

	const form = useForm<UserFormValues>({
		resolver: zodResolver(userFormSchema),
		defaultValues: {
			username: user?.username ?? "",
			displayName: user?.displayName ?? "",
			email: user?.email ?? "",
			phone: user?.phone ?? "",
			address: user?.address ?? "",
			role: user?.role ?? "user",
			status: (user?.status as "active" | "inactive") ?? "active",
		},
	});

	function handleSubmit(values: UserFormValues) {
		onSubmit(values);
		form.reset();
	}

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-lg">
				<DialogHeader>
					<DialogTitle>
						{isEditing
							? "Chỉnh Sửa Người Dùng"
							: "Thêm Người Dùng Mới"}
					</DialogTitle>
					<DialogDescription>
						{isEditing
							? "Cập nhật thông tin người dùng."
							: "Điền thông tin để tạo người dùng mới."}
					</DialogDescription>
				</DialogHeader>

				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(handleSubmit)}
						className="space-y-4"
					>
						{/* Username */}
						<FormField
							control={form.control}
							name="username"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Username</FormLabel>
									<FormControl>
										<Input
											placeholder="username"
											disabled={isEditing}
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						{/* Display Name */}
						<FormField
							control={form.control}
							name="displayName"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Tên Hiển Thị</FormLabel>
									<FormControl>
										<Input
											placeholder="Nguyễn Văn A"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						{/* Email */}
						<FormField
							control={form.control}
							name="email"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Email</FormLabel>
									<FormControl>
										<Input
											type="email"
											placeholder="email@example.com"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						{/* Phone & Address row */}
						<div className="grid gap-4 sm:grid-cols-2">
							<FormField
								control={form.control}
								name="phone"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Số Điện Thoại</FormLabel>
										<FormControl>
											<Input
												placeholder="0901234567"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="role"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Vai Trò</FormLabel>
										<Select
											onValueChange={field.onChange}
											defaultValue={field.value}
										>
											<FormControl>
												<SelectTrigger>
													<SelectValue placeholder="Chọn vai trò" />
												</SelectTrigger>
											</FormControl>
											<SelectContent>
												<SelectItem value="user">
													User
												</SelectItem>
												<SelectItem value="admin">
													Admin
												</SelectItem>
											</SelectContent>
										</Select>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>

						{/* Address */}
						<FormField
							control={form.control}
							name="address"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Địa Chỉ</FormLabel>
									<FormControl>
										<Input
											placeholder="123 Đường ABC, Quận XYZ"
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
											Cho phép người dùng đăng nhập
										</p>
									</div>
									<FormControl>
										<Switch
											checked={field.value === "active"}
											onCheckedChange={(checked) =>
												field.onChange(
													checked
														? "active"
														: "inactive",
												)
											}
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
