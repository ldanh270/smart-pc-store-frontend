"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Eye, EyeOff, Mail, Key, Loader2, ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
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

		const { username, password } = values;
		const success = await login(username, password);

		if (success) {
			router.push("/");
		}

		setIsSubmitting(false);
	}

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className="space-y-6"
				id="login-form"
			>
				{/* Email Field */}
				<FormField
					control={form.control}
					name="username"
					render={({ field }) => (
						<FormItem className="space-y-2">
							<FormLabel className="text-[13px] font-semibold text-foreground/90">
								Email
							</FormLabel>
							<FormControl>
								<div className="relative group">
									<div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted-foreground/50 group-focus-within:text-primary transition-colors">
										<Mail className="size-4.5" />
									</div>
									<Input
										id="login-username"
										type="text"
										placeholder="Nhập email của bạn"
										className="h-12 rounded-xl border-border/60 bg-background/50 pl-10 pr-4 text-sm transition-all hover:bg-muted/50 focus-visible:border-primary focus-visible:ring-[4px] focus-visible:ring-primary/10 focus-visible:bg-background placeholder:text-muted-foreground/40 shadow-sm"
										autoComplete="username"
										{...field}
									/>
								</div>
							</FormControl>
							<FormMessage className="text-xs" />
						</FormItem>
					)}
				/>

				{/* Password Field */}
				<FormField
					control={form.control}
					name="password"
					render={({ field }) => (
						<FormItem className="space-y-2">
							<FormLabel className="text-[13px] font-semibold text-foreground/90">
								Mật khẩu
							</FormLabel>
							<FormControl>
								<div className="relative group">
									<div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted-foreground/50 group-focus-within:text-primary transition-colors">
										<Key className="size-4.5" />
									</div>
									<Input
										id="login-password"
										type={isPasswordVisible ? "text" : "password"}
										placeholder="Nhập mật khẩu"
										className="h-12 rounded-xl border-border/60 bg-background/50 pl-10 pr-10 text-sm transition-all hover:bg-muted/50 focus-visible:border-primary focus-visible:ring-[4px] focus-visible:ring-primary/10 focus-visible:bg-background placeholder:text-muted-foreground/40 shadow-sm"
										autoComplete="current-password"
										{...field}
									/>
									<button
										type="button"
										onClick={() => setIsPasswordVisible(!isPasswordVisible)}
										className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground/50 hover:text-foreground transition-colors p-1"
										aria-label={isPasswordVisible ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
										id="toggle-password-visibility"
									>
										{isPasswordVisible ? <EyeOff className="size-4.5" /> : <Eye className="size-4.5" />}
									</button>
								</div>
							</FormControl>
							<FormMessage className="text-xs" />
						</FormItem>
					)}
				/>

				{/* Remember Me & Forgot Password */}
				<div className="flex items-center justify-between pt-1 pb-3">
					<div className="flex items-center space-x-2.5">
						<Checkbox id="remember" className="size-4 rounded-md border-border/60 bg-background/50 data-[state=checked]:bg-primary data-[state=checked]:border-primary transition-all" />
						<label htmlFor="remember" className="text-xs font-medium text-muted-foreground cursor-pointer hover:text-foreground transition-colors select-none">
							Ghi nhớ đăng nhập
						</label>
					</div>
					<Link href="/forgot-password" className="text-xs font-medium text-muted-foreground hover:text-primary transition-colors">
						Quên mật khẩu?
					</Link>
				</div>

				{/* Submit Button */}
				<Button
					type="submit"
					size="lg"
					className="group glow-primary h-12 w-full rounded-xl bg-primary font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition-all duration-300 hover:bg-primary/90 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-primary/30 active:translate-y-0"
					disabled={isSubmitting}
					id="login-submit-button"
				>
					{isSubmitting ? (
						<>
							<Loader2 className="mr-2 size-5 animate-spin" />
							Đang đăng nhập...
						</>
					) : (
						<span className="flex items-center justify-center gap-2">
							Đăng nhập
							<ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
						</span>
					)}
				</Button>

                <div className="relative py-2">
					<div className="absolute inset-0 flex items-center">
						<span className="w-full border-t border-border/40" />
					</div>
					<div className="relative flex justify-center text-xs uppercase">
						<span className="bg-card px-3 text-muted-foreground/60 font-medium tracking-wider">Hoặc tiếp tục với</span>
					</div>
				</div>

				{/* Google Login Button */}
				<Button
					type="button"
					variant="outline"
					className="h-12 w-full flex items-center justify-center gap-3 rounded-xl border border-border/50 bg-background/30 shadow-sm transition-all duration-300 hover:bg-muted/80 hover:border-border/80 focus-visible:ring-4 focus-visible:ring-muted hover:-translate-y-0.5"
					id="google-login-button"
				>
					<GoogleIcon />
					<span className="text-[13px] font-semibold text-foreground/90">Đăng nhập bằng Google</span>
				</Button>
			</form>
		</Form>
	);
}
