"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
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
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { profileService } from "@/services/profileService"
import type { User as UserType } from "@/types/user"

import { useEffect, useState } from "react"

import { zodResolver } from "@hookform/resolvers/zod"
import {
  CalendarDays,
  Eye,
  EyeOff,
  Loader2,
  Lock,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  User,
} from "lucide-react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"

// ── Schemas ──────────────────────────────────────────────────────────────────

const infoSchema = z.object({
  displayName: z.string().min(1, "Tên hiển thị là bắt buộc"),
  email: z.string().email("Email không hợp lệ"),
  phone: z.string().optional(),
  address: z.string().optional(),
})

const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, "Vui lòng nhập mật khẩu hiện tại"),
    newPassword: z.string().min(6, "Mật khẩu mới phải có ít nhất 6 ký tự"),
    confirmPassword: z.string().min(1, "Vui lòng xác nhận mật khẩu mới"),
  })
  .refine((d) => d.newPassword === d.confirmPassword, {
    message: "Mật khẩu xác nhận không khớp",
    path: ["confirmPassword"],
  })

type InfoFormValues = z.infer<typeof infoSchema>
type PasswordFormValues = z.infer<typeof passwordSchema>

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatDate(dateStr?: string) {
  if (!dateStr) return "—"
  return new Date(dateStr).toLocaleDateString("vi-VN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

function RoleBadge({ role }: { role?: string }) {
  const isAdmin = role?.toLowerCase() === "admin"
  return (
    <Badge variant={isAdmin ? "default" : "secondary"} className="text-xs">
      {isAdmin ? "Admin" : "User"}
    </Badge>
  )
}

// ── PasswordField helper ──────────────────────────────────────────────────────

function PasswordInput({
  placeholder,
  ...props
}: React.ComponentProps<typeof Input> & { placeholder?: string }) {
  const [visible, setVisible] = useState(false)
  return (
    <div className="relative">
      <Lock className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2" />
      <Input
        type={visible ? "text" : "password"}
        placeholder={placeholder ?? "••••••••"}
        className="pr-10 pl-10"
        {...props}
      />
      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        className="text-muted-foreground hover:text-foreground absolute top-1/2 right-3 -translate-y-1/2 transition-colors"
        aria-label={visible ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
      >
        {visible ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
      </button>
    </div>
  )
}

// ── Main Component ────────────────────────────────────────────────────────────

export default function ProfileClient() {
  const [profile, setProfile] = useState<UserType | null>(null)
  const [loading, setLoading] = useState(true)
  const [infoSubmitting, setInfoSubmitting] = useState(false)
  const [pwSubmitting, setPwSubmitting] = useState(false)

  const infoForm = useForm<InfoFormValues>({
    resolver: zodResolver(infoSchema),
    defaultValues: { displayName: "", email: "", phone: "", address: "" },
  })

  const passwordForm = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: { currentPassword: "", newPassword: "", confirmPassword: "" },
  })

  // ── Fetch profile ────────────────────────────────────────────────────────
  useEffect(() => {
    profileService
      .getProfile()
      .then((data) => {
        setProfile(data)
        infoForm.reset({
          displayName: data.displayName ?? "",
          email: data.email ?? "",
          phone: data.phone ?? "",
          address: data.address ?? "",
        })
      })
      .catch(() => {
        toast.error("Không thể tải thông tin tài khoản")
      })
      .finally(() => setLoading(false))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // ── Submit: update info ───────────────────────────────────────────────────
  async function onInfoSubmit(values: InfoFormValues) {
    if (!profile) return
    setInfoSubmitting(true)
    try {
      const changedData: Partial<InfoFormValues> = {}

      if (values.displayName !== (profile.displayName ?? "")) {
        changedData.displayName = values.displayName
      }
      if (values.email !== (profile.email ?? "")) {
        changedData.email = values.email
      }
      if (values.phone !== (profile.phone ?? "")) {
        changedData.phone = values.phone
      }
      if (values.address !== (profile.address ?? "")) {
        changedData.address = values.address
      }

      if (Object.keys(changedData).length === 0) {
        setInfoSubmitting(false)
        return
      }

      const updated = await profileService.updateProfile(changedData)
      setProfile((prev) => (prev ? { ...prev, ...updated } : updated))
      infoForm.reset({
        displayName: updated.displayName ?? "",
        email: updated.email ?? "",
        phone: updated.phone ?? "",
        address: updated.address ?? "",
      })
      toast.success("Cập nhật thông tin thành công")
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const err = error as any
      toast.error(err?.response?.data?.message || "Lỗi khi cập nhật thông tin")
    } finally {
      setInfoSubmitting(false)
    }
  }

  // ── Submit: change password ───────────────────────────────────────────────
  async function onPasswordSubmit(values: PasswordFormValues) {
    setPwSubmitting(true)
    try {
      await profileService.changePassword({
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
      })
      toast.success("Đổi mật khẩu thành công")
      passwordForm.reset()
    } finally {
      setPwSubmitting(false)
    }
  }

  // ── Loading state ────────────────────────────────────────────────────────
  if (loading) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center gap-4">
          <div className="space-y-2">
            <Skeleton className="h-7 w-48" />
            <div className="flex items-center gap-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-5 w-16 rounded-full" />
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-muted grid grid-cols-2 gap-2 rounded-lg p-1">
            <Skeleton className="h-8 w-full rounded-md" />
            <Skeleton className="h-8 w-full rounded-md" />
          </div>

          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-32" />
              <Skeleton className="mt-2 h-4 w-64" />
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="space-y-2">
                    <Skeleton className="h-3 w-20" />
                    <Skeleton className="h-5 w-32" />
                  </div>
                ))}
              </div>
              <Separator />
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-10 w-full rounded-md" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    )
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
      {/* ── Header ── */}
      <div className="mb-8 flex items-center gap-4">
        <div>
          <h1 className="text-foreground text-xl font-bold">
            {profile?.displayName || profile?.username}
          </h1>
          <div className="text-muted-foreground mt-1 flex items-center gap-2 text-sm">
            <span>@{profile?.username}</span>
            <RoleBadge role={profile?.role} />
          </div>
        </div>
      </div>

      {/* ── Tabs ── */}
      <Tabs defaultValue="info">
        <TabsList className="mb-6 grid w-2xl grid-cols-2">
          <TabsTrigger value="info">Thông tin tài khoản</TabsTrigger>
          <TabsTrigger value="password">Đổi mật khẩu</TabsTrigger>
        </TabsList>

        {/* ── Tab: Info ── */}
        <TabsContent value="info">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Thông tin cá nhân</CardTitle>
              <CardDescription>
                Cập nhật tên hiển thị, email, số điện thoại và địa chỉ của bạn.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Read-only fields */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-1">
                  <p className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
                    Tên đăng nhập
                  </p>
                  <p className="text-foreground flex items-center gap-2 text-sm font-medium">
                    <User className="text-muted-foreground size-4" />
                    {profile?.username}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
                    Ngày tạo
                  </p>
                  <p className="text-foreground flex items-center gap-2 text-sm font-medium">
                    <CalendarDays className="text-muted-foreground size-4" />
                    {formatDate(profile?.createdAt)}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
                    Vai trò
                  </p>
                  <p className="text-foreground flex items-center gap-2 text-sm font-medium">
                    <ShieldCheck className="text-muted-foreground size-4" />
                    <RoleBadge role={profile?.role} />
                  </p>
                </div>
                {profile?.status && (
                  <div className="space-y-1">
                    <p className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
                      Trạng thái
                    </p>
                    <p className="text-foreground text-sm font-medium">
                      <Badge
                        variant={profile.status === "Active" ? "default" : "destructive"}
                        className="text-xs"
                      >
                        {profile.status}
                      </Badge>
                    </p>
                  </div>
                )}
              </div>

              <Separator />

              {/* Editable form */}
              <Form {...infoForm}>
                <form onSubmit={infoForm.handleSubmit(onInfoSubmit)} className="space-y-4">
                  <FormField
                    control={infoForm.control}
                    name="displayName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tên hiển thị</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <User className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2" />
                            <Input placeholder="Nhập tên hiển thị" className="pl-10" {...field} />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={infoForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Mail className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2" />
                            <Input
                              type="email"
                              placeholder="Nhập email"
                              className="pl-10"
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <FormField
                      control={infoForm.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Số điện thoại</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Phone className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2" />
                              <Input
                                type="tel"
                                placeholder="Nhập số điện thoại"
                                className="pl-10"
                                {...field}
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={infoForm.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          <span className="flex items-center gap-1">
                            <MapPin className="size-4" />
                            Địa chỉ
                          </span>
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Nhập địa chỉ"
                            className="resize-none"
                            rows={3}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex justify-end">
                    <Button type="submit" disabled={infoSubmitting || !infoForm.formState.isDirty}>
                      {infoSubmitting && <Loader2 className="mr-2 size-4 animate-spin" />}
                      Lưu thay đổi
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── Tab: Password ── */}
        <TabsContent value="password">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Đổi mật khẩu</CardTitle>
              <CardDescription>
                Để bảo mật tài khoản, vui lòng không chia sẻ mật khẩu với người khác.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...passwordForm}>
                <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-4">
                  <FormField
                    control={passwordForm.control}
                    name="currentPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Mật khẩu hiện tại</FormLabel>
                        <FormControl>
                          <PasswordInput placeholder="Nhập mật khẩu hiện tại" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={passwordForm.control}
                    name="newPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Mật khẩu mới</FormLabel>
                        <FormControl>
                          <PasswordInput placeholder="Nhập mật khẩu mới" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={passwordForm.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Xác nhận mật khẩu mới</FormLabel>
                        <FormControl>
                          <PasswordInput placeholder="Nhập lại mật khẩu mới" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex justify-end">
                    <Button type="submit" disabled={pwSubmitting}>
                      {pwSubmitting && <Loader2 className="mr-2 size-4 animate-spin" />}
                      Đổi mật khẩu
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </main>
  )
}
