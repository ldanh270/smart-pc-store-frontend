"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, User, Mail, Phone, MapPin, Lock, Eye, EyeOff, ShieldCheck, CalendarDays } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import OrderHistoryTab from "./OrderHistoryTab";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { profileService } from "@/services/profileService";
import type { User as UserType } from "@/types/user";
import { toast } from "sonner";

// ── Schemas ──────────────────────────────────────────────────────────────────

const infoSchema = z.object({
  displayName: z.string().min(1, "Tên hiển thị là bắt buộc"),
  email: z.string().email("Email không hợp lệ"),
  phone: z.string().optional(),
  address: z.string().optional(),
});

const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, "Vui lòng nhập mật khẩu hiện tại"),
    newPassword: z
      .string()
      .min(6, "Mật khẩu mới phải có ít nhất 6 ký tự"),
    confirmPassword: z.string().min(1, "Vui lòng xác nhận mật khẩu mới"),
  })
  .refine((d) => d.newPassword === d.confirmPassword, {
    message: "Mật khẩu xác nhận không khớp",
    path: ["confirmPassword"],
  });

type InfoFormValues = z.infer<typeof infoSchema>;
type PasswordFormValues = z.infer<typeof passwordSchema>;

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatDate(dateStr?: string) {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("vi-VN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function RoleBadge({ role }: { role?: string }) {
  const isAdmin = role?.toLowerCase() === "admin";
  return (
    <Badge variant={isAdmin ? "default" : "secondary"} className="text-xs">
      {isAdmin ? "Admin" : "User"}
    </Badge>
  );
}

// ── PasswordField helper ──────────────────────────────────────────────────────

function PasswordInput({
  placeholder,
  ...props
}: React.ComponentProps<typeof Input> & { placeholder?: string }) {
  const [visible, setVisible] = useState(false);
  return (
    <div className="relative">
      <Lock className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
      <Input
        type={visible ? "text" : "password"}
        placeholder={placeholder ?? "••••••••"}
        className="pl-10 pr-10"
        {...props}
      />
      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
        aria-label={visible ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
      >
        {visible ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
      </button>
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────

export default function ProfileClient() {
  const [profile, setProfile] = useState<UserType | null>(null);
  const [loading, setLoading] = useState(true);
  const [infoSubmitting, setInfoSubmitting] = useState(false);
  const [pwSubmitting, setPwSubmitting] = useState(false);

  const infoForm = useForm<InfoFormValues>({
    resolver: zodResolver(infoSchema),
    defaultValues: { displayName: "", email: "", phone: "", address: "" },
  });

  const passwordForm = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: { currentPassword: "", newPassword: "", confirmPassword: "" },
  });

  // ── Fetch profile ────────────────────────────────────────────────────────
  useEffect(() => {
    profileService
      .getProfile()
      .then((data) => {
        setProfile(data);
        infoForm.reset({
          displayName: data.displayName ?? "",
          email: data.email ?? "",
          phone: data.phone ?? "",
          address: data.address ?? "",
        });
      })
      .catch(() => {
        toast.error("Không thể tải thông tin tài khoản");
      })
      .finally(() => setLoading(false));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Submit: update info ───────────────────────────────────────────────────
  async function onInfoSubmit(values: InfoFormValues) {
    if (!profile) return;
    setInfoSubmitting(true);
    try {
      const changedData: Partial<InfoFormValues> = {};
      
      if (values.displayName !== (profile.displayName ?? "")) {
        changedData.displayName = values.displayName;
      }
      if (values.email !== (profile.email ?? "")) {
        changedData.email = values.email;
      }
      if (values.phone !== (profile.phone ?? "")) {
        changedData.phone = values.phone;
      }
      if (values.address !== (profile.address ?? "")) {
        changedData.address = values.address;
      }

      if (Object.keys(changedData).length === 0) {
        setInfoSubmitting(false);
        return;
      }

      const updated = await profileService.updateProfile(changedData);
      setProfile((prev) => (prev ? { ...prev, ...updated } : updated));
      infoForm.reset({
        displayName: updated.displayName ?? "",
        email: updated.email ?? "",
        phone: updated.phone ?? "",
        address: updated.address ?? "",
      });
      toast.success("Cập nhật thông tin thành công");
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const err = error as any;
      toast.error(err?.response?.data?.message || "Lỗi khi cập nhật thông tin");
    } finally {
      setInfoSubmitting(false);
    }
  }

  // ── Submit: change password ───────────────────────────────────────────────
  async function onPasswordSubmit(values: PasswordFormValues) {
    setPwSubmitting(true);
    try {
      await profileService.changePassword({
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
      });
      toast.success("Đổi mật khẩu thành công");
      passwordForm.reset();
    } finally {
      setPwSubmitting(false);
    }
  }

  // ── Loading state ────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="size-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
      {/* ── Header ── */}
      <div className="mb-8 flex items-center gap-4">
        <div>
          <h1 className="text-xl font-bold text-foreground">
            {profile?.displayName || profile?.username}
          </h1>
          <div className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
            <span>@{profile?.username}</span>
            <RoleBadge role={profile?.role} />
          </div>
        </div>
      </div>

      {/* ── Tabs ── */}
      <Tabs defaultValue="info">
        <TabsList className="mb-6 w-full flex">
          <TabsTrigger value="info" className="flex-1">
            Thông tin tài khoản
          </TabsTrigger>
          <TabsTrigger value="history" className="flex-1">
            Lịch sử đơn hàng
          </TabsTrigger>
          <TabsTrigger value="password" className="flex-1">
            Đổi mật khẩu
          </TabsTrigger>
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
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Tên đăng nhập
                  </p>
                  <p className="flex items-center gap-2 text-sm font-medium text-foreground">
                    <User className="size-4 text-muted-foreground" />
                    {profile?.username}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Ngày tạo
                  </p>
                  <p className="flex items-center gap-2 text-sm font-medium text-foreground">
                    <CalendarDays className="size-4 text-muted-foreground" />
                    {formatDate(profile?.createdAt)}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Vai trò
                  </p>
                  <p className="flex items-center gap-2 text-sm font-medium text-foreground">
                    <ShieldCheck className="size-4 text-muted-foreground" />
                    <RoleBadge role={profile?.role} />
                  </p>
                </div>
                {profile?.status && (
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Trạng thái
                    </p>
                    <p className="text-sm font-medium text-foreground">
                      <Badge
                        variant={
                          profile.status === "Active" ? "default" : "destructive"
                        }
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
                <form
                  onSubmit={infoForm.handleSubmit(onInfoSubmit)}
                  className="space-y-4"
                >
                  <FormField
                    control={infoForm.control}
                    name="displayName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tên hiển thị</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <User className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                            <Input
                              placeholder="Nhập tên hiển thị"
                              className="pl-10"
                              {...field}
                            />
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
                            <Mail className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
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
                              <Phone className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
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
                    <Button 
                      type="submit" 
                      disabled={infoSubmitting || !infoForm.formState.isDirty}
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
                <form
                  onSubmit={passwordForm.handleSubmit(onPasswordSubmit)}
                  className="space-y-4"
                >
                  <FormField
                    control={passwordForm.control}
                    name="currentPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Mật khẩu hiện tại</FormLabel>
                        <FormControl>
                          <PasswordInput
                            placeholder="Nhập mật khẩu hiện tại"
                            {...field}
                          />
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
                          <PasswordInput
                            placeholder="Nhập mật khẩu mới"
                            {...field}
                          />
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
                          <PasswordInput
                            placeholder="Nhập lại mật khẩu mới"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex justify-end">
                    <Button type="submit" disabled={pwSubmitting}>
                      {pwSubmitting && (
                        <Loader2 className="mr-2 size-4 animate-spin" />
                      )}
                      Đổi mật khẩu
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── Tab: History ── */}
        <TabsContent value="history">
          <OrderHistoryTab />
        </TabsContent>
      </Tabs>
    </main>
  );
}
