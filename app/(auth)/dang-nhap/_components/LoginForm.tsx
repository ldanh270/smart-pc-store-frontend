"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Eye, EyeOff, User, Lock, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { useAuthStore } from "@/stores/useAuthStore";
import { useRouter } from "next/navigation";

// ── Zod Schema ──────────────────────────────────────────────────────────────
const loginSchema = z.object({
	username: z
		.string()
		.min(1, { message: "Tên đăng nhập là bắt buộc" }),
	password: z
		.string()
		.min(1, { message: "Mật khẩu là bắt buộc" })
		.min(6, { message: "Mật khẩu phải có ít nhất 6 ký tự" }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

// ── Google Icon SVG ─────────────────────────────────────────────────────────
const GoogleIcon = () => {
	return (
		<svg
			width="20"
			height="20"
			viewBox="0 0 48 48"
			aria-hidden="true"
		>
			<path
				fill="#FFC107"
				d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"
			/>
			<path
				fill="#FF3D00"
				d="m6.306 14.691 6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z"
			/>
			<path
				fill="#4CAF50"
				d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0 1 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"
			/>
			<path
				fill="#1976D2"
				d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 0 1-4.087 5.571l.003-.002 6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z"
			/>
		</svg>
	);
}

// ── Login Form Component ────────────────────────────────────────────────────
export default function LoginForm() {
	const [isPasswordVisible, setIsPasswordVisible] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);
  const {login} = useAuthStore();
  const router = useRouter();

	const form = useForm<LoginFormValues>({
		resolver: zodResolver(loginSchema),
		defaultValues: {
			username: "",
			password: "",
		},
	});

	async function onSubmit(values: LoginFormValues) {
		setIsSubmitting(true);

    const {username, password} = values;
    const success = await login(username, password);

    if (success) {
      const user = useAuthStore.getState().user;
      const userRole = user?.role;
      
      if (userRole === 'ADMIN' || userRole === 'admin' || userRole?.includes('ADMIN')) {
        router.push("/admin"); 
      } else {
        router.push("/");
      }
      router.refresh();
    }

		setIsSubmitting(false);
	}

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className="space-y-5"
				id="login-form"
			>
				{/* Username Field */}
				<FormField
					control={form.control}
					name="username"
					render={({ field }) => (
						<FormItem>
							<FormLabel className="font-sans text-sm font-medium text-foreground">
								Tên đăng nhập
							</FormLabel>
							<FormControl>
								<div className="relative">
									<User className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
									<Input
										id="login-username"
										type="text"
										placeholder="Nhập tên đăng nhập"
										className="pl-10"
										autoComplete="username"
										{...field}
									/>
								</div>
							</FormControl>
							<FormMessage className="text-destructive" />
						</FormItem>
					)}
				/>

				{/* Password Field */}
				<FormField
					control={form.control}
					name="password"
					render={({ field }) => (
						<FormItem>
							<div className="flex items-center justify-between">
								<FormLabel className="font-sans text-sm font-medium text-foreground">
									Mật khẩu
								</FormLabel>
								<Link
									href="/forgot-password"
									className="text-xs font-medium text-primary hover:text-primary/80 transition-colors"
									id="forgot-password-link"
								>
									Quên mật khẩu?
								</Link>
							</div>
							<FormControl>
								<div className="relative">
									<Lock className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
									<Input
										id="login-password"
										type={isPasswordVisible ? "text" : "password"}
										placeholder="••••••••"
										className="pl-10 pr-10"
										autoComplete="current-password"
										{...field}
									/>
									<button
										type="button"
										onClick={() => setIsPasswordVisible(!isPasswordVisible)}
										className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
										aria-label={
											isPasswordVisible ? "Ẩn mật khẩu" : "Hiện mật khẩu"
										}
										id="toggle-password-visibility"
									>
										{isPasswordVisible ? (
											<EyeOff className="size-4" />
										) : (
											<Eye className="size-4" />
										)}
									</button>
								</div>
							</FormControl>
							<FormMessage className="text-destructive" />
						</FormItem>
					)}
				/>

				{/* Submit Button */}
				<Button
					type="submit"
					size="lg"
					className="w-full font-sans font-semibold"
					disabled={isSubmitting}
					id="login-submit-button"
				>
					{isSubmitting ? (
						<>
							<Loader2 className="size-4 animate-spin" />
							Đang đăng nhập...
						</>
					) : (
						"Đăng nhập"
					)}
				</Button>

				{/* Divider */}
				<div className="relative flex items-center gap-4 py-1">
					<Separator className="flex-1" />
					<span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
						Hoặc
					</span>
					<Separator className="flex-1" />
				</div>

				{/* Google Login Button */}
				<Button
					type="button"
					variant="outline"
					size="lg"
					className="w-full font-sans font-medium gap-3"
					id="google-login-button"
				>
					<GoogleIcon />
					Đăng nhập bằng Google
				</Button>
			</form>
		</Form>
	);
}
