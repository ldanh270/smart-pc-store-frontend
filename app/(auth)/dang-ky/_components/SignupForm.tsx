"use client"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { useAuthStore } from "@/stores/useAuthStore"

import { useState } from "react"

import { zodResolver } from "@hookform/resolvers/zod"
import { Eye, EyeOff, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { z } from "zod"

// ── Zod Schema ──────────────────────────────────────────────────────────────
const signupSchema = z
  .object({
    username: z
      .string()
      .min(1, { message: "Tên đăng nhập là bắt buộc" })
      .min(3, { message: "Tên đăng nhập phải có ít nhất 3 ký tự" }),
    displayName: z
      .string()
      .min(1, { message: "Tên hiển thị là bắt buộc" })
      .min(2, { message: "Tên hiển thị phải có ít nhất 2 ký tự" }),
    email: z
      .string()
      .min(1, { message: "Email là bắt buộc" })
      .email({ message: "Email không hợp lệ" }),
    password: z
      .string()
      .min(1, { message: "Mật khẩu là bắt buộc" })
      .min(8, { message: "Mật khẩu phải có ít nhất 8 ký tự" }),
    confirmPassword: z.string().min(1, { message: "Xác nhận mật khẩu là bắt buộc" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Mật khẩu xác nhận không khớp",
    path: ["confirmPassword"],
  })

type SignupFormValues = z.infer<typeof signupSchema>

// ── Google Icon SVG ─────────────────────────────────────────────────────────
const GoogleIcon = () => {
  return (
    <svg width="20" height="20" viewBox="0 0 48 48" aria-hidden="true">
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
  )
}

// ── Signup Form Component ───────────────────────────────────────────────────
export default function SignupForm() {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false)
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const router = useRouter()
  const { signup } = useAuthStore()

  const form = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      username: "",
      displayName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  })

  async function onSubmit(values: SignupFormValues) {
    setIsSubmitting(true)

    const success = await signup(values.username, values.email, values.displayName, values.password)
    if (success) {
      router.push("/dang-nhap")
    }

    setIsSubmitting(false)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4" id="signup-form">
        {/* Username Field */}
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem className="space-y-1.5">
              <FormLabel className="text-foreground text-xs font-semibold">Tên đăng nhập</FormLabel>
              <FormControl>
                <Input
                  id="signup-username"
                  type="text"
                  placeholder="Nhập tên đăng nhập"
                  className="border-border bg-muted/30 focus-visible:border-primary focus-visible:ring-primary/20 placeholder:text-muted-foreground/50 h-11 rounded-lg px-4 text-sm transition-all focus-visible:ring-2"
                  autoComplete="username"
                  {...field}
                />
              </FormControl>
              <FormMessage className="text-[10px]" />
            </FormItem>
          )}
        />

        {/* Display Name Field */}
        <FormField
          control={form.control}
          name="displayName"
          render={({ field }) => (
            <FormItem className="space-y-1.5">
              <FormLabel className="text-foreground text-xs font-semibold">Tên hiển thị</FormLabel>
              <FormControl>
                <Input
                  id="signup-displayname"
                  type="text"
                  placeholder="Ví dụ: Nguyễn Văn A"
                  className="border-border bg-muted/30 focus-visible:border-primary focus-visible:ring-primary/20 placeholder:text-muted-foreground/50 h-11 rounded-lg px-4 text-sm transition-all focus-visible:ring-2"
                  autoComplete="name"
                  {...field}
                />
              </FormControl>
              <FormMessage className="text-[10px]" />
            </FormItem>
          )}
        />

        {/* Email Field */}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem className="space-y-1.5">
              <FormLabel className="text-foreground text-xs font-semibold">Email</FormLabel>
              <FormControl>
                <Input
                  id="signup-email"
                  type="email"
                  placeholder="you@example.com"
                  className="border-border bg-muted/30 focus-visible:border-primary focus-visible:ring-primary/20 placeholder:text-muted-foreground/50 h-11 rounded-lg px-4 text-sm transition-all focus-visible:ring-2"
                  autoComplete="email"
                  {...field}
                />
              </FormControl>
              <FormMessage className="text-[10px]" />
            </FormItem>
          )}
        />

        {/* Password Field */}
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem className="space-y-1.5">
              <FormLabel className="text-foreground text-xs font-semibold">Mật khẩu</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    id="signup-password"
                    type={isPasswordVisible ? "text" : "password"}
                    placeholder="Nhập mật khẩu"
                    className="border-border bg-muted/30 focus-visible:border-primary focus-visible:ring-primary/20 placeholder:text-muted-foreground/50 h-11 rounded-lg px-4 pr-10 text-sm transition-all focus-visible:ring-2"
                    autoComplete="new-password"
                    {...field}
                  />
                  <button
                    type="button"
                    onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                    className="text-muted-foreground hover:text-foreground absolute top-1/2 right-3 -translate-y-1/2 transition-colors"
                    aria-label={isPasswordVisible ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                    id="toggle-password-visibility"
                  >
                    {isPasswordVisible ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                </div>
              </FormControl>
              <FormMessage className="text-[10px]" />
            </FormItem>
          )}
        />

        {/* Confirm Password Field */}
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem className="space-y-1.5">
              <FormLabel className="text-foreground text-xs font-semibold">
                Xác nhận mật khẩu
              </FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    id="signup-confirm-password"
                    type={isConfirmPasswordVisible ? "text" : "password"}
                    placeholder="Xác nhận mật khẩu"
                    className="border-border bg-muted/30 focus-visible:border-primary focus-visible:ring-primary/20 placeholder:text-muted-foreground/50 h-11 rounded-lg px-4 pr-10 text-sm transition-all focus-visible:ring-2"
                    autoComplete="new-password"
                    {...field}
                  />
                  <button
                    type="button"
                    onClick={() => setIsConfirmPasswordVisible(!isConfirmPasswordVisible)}
                    className="text-muted-foreground hover:text-foreground absolute top-1/2 right-3 -translate-y-1/2 transition-colors"
                    aria-label={isConfirmPasswordVisible ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                    id="toggle-confirm-password-visibility"
                  >
                    {isConfirmPasswordVisible ? (
                      <EyeOff className="size-4" />
                    ) : (
                      <Eye className="size-4" />
                    )}
                  </button>
                </div>
              </FormControl>
              <FormMessage className="text-[10px]" />
            </FormItem>
          )}
        />

        {/* Submit Button */}
        <Button
          type="submit"
          size="lg"
          className="glow-primary bg-primary text-primary-foreground hover:bg-primary/90 h-11 w-full rounded-lg font-semibold transition-all hover:scale-[1.01] active:scale-[0.98]"
          disabled={isSubmitting}
          id="signup-submit-button"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 size-4 animate-spin" />
              Đang tạo tài khoản...
            </>
          ) : (
            "Tạo tài khoản"
          )}
        </Button>

        {/* Divider */}
        <div className="relative flex items-center gap-4 py-1">
          <Separator className="flex-1" />
          <span className="text-muted-foreground text-[10px] font-bold tracking-wider uppercase">
            Hoặc
          </span>
          <Separator className="flex-1" />
        </div>

        {/* Google Signup Button */}
        <Button
          type="button"
          variant="outline"
          className="border-border bg-card hover:bg-muted/50 hover:border-muted-foreground/20 h-11 w-full rounded-lg shadow-sm transition-all"
          id="google-signup-button"
        >
          <div className="mr-2">
            <GoogleIcon />
          </div>
          <span className="text-foreground text-sm font-semibold">Đăng ký bằng Google</span>
        </Button>
      </form>
    </Form>
  )
}
