"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { User } from "@/types/user"

import { useEffect } from "react"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod/v4"

// ─── Schemas ────────────────────────────────────────────────────────────────

/** Schema for creating a new user – username, password, displayName, email are required */
const createUserSchema = z.object({
  username: z.string().min(3, "Tên đăng nhập tối thiểu 3 ký tự"),
  password: z.string().min(8, "Mật khẩu tối thiểu 8 ký tự"),
  displayName: z.string().min(2, "Tên hiển thị tối thiểu 2 ký tự"),
  email: z.string().email("Email không hợp lệ"),
  phone: z.string().optional(),
  address: z.string().optional(),
  status: z.string().default("Active"),
  role: z.string().default("user"),
})

/** Schema for editing – all fields optional, only validate non-empty values */
const editUserSchema = z.object({
  username: z.string().optional(),
  password: z.string().min(8, "Mật khẩu tối thiểu 8 ký tự").optional().or(z.literal("")),
  displayName: z.string().min(2, "Tên hiển thị tối thiểu 2 ký tự").optional().or(z.literal("")),
  email: z.string().email("Email không hợp lệ").optional().or(z.literal("")),
  phone: z.string().optional(),
  address: z.string().optional(),
  status: z.string().optional(),
  role: z.string().optional(),
})

export interface UserFormValues {
  username?: string
  password?: string
  displayName?: string
  email?: string
  phone?: string
  address?: string
  status?: string
  role?: string
}

// ─── Props ──────────────────────────────────────────────────────────────────

interface UserFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  user?: User
  onSubmit: (data: UserFormValues) => void
}

// ─── Component ──────────────────────────────────────────────────────────────

export default function UserFormDialog({
  open,
  onOpenChange,
  user,
  onSubmit,
}: UserFormDialogProps) {
  const isEditing = !!user

  const form = useForm<UserFormValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(isEditing ? editUserSchema : createUserSchema) as any,
    defaultValues: {
      username: "",
      password: "",
      displayName: "",
      email: "",
      phone: "",
      address: "",
      status: "Active",
      role: "user",
    },
  })

  // Reset form with user data whenever the dialog opens or user changes
  useEffect(() => {
    if (open && user) {
      form.reset({
        username: user.username ?? "",
        password: "",
        displayName: user.displayName ?? "",
        email: user.email ?? "",
        phone: user.phone ?? "",
        address: user.address ?? "",
        status: user.status ?? "Active",
        role: user.role ?? "user",
      })
    } else if (open && !user) {
      form.reset({
        username: "",
        password: "",
        displayName: "",
        email: "",
        phone: "",
        address: "",
        status: "Active",
        role: "user",
      })
    }
  }, [open, user, form])

  function handleSubmit(values: UserFormValues) {
    if (isEditing && user) {
      // Only include fields that actually changed
      const changed: UserFormValues = {}

      if (values.displayName && values.displayName !== user.displayName) {
        changed.displayName = values.displayName
      }
      if (values.email && values.email !== user.email) {
        changed.email = values.email
      }
      if (values.phone !== undefined && values.phone !== (user.phone ?? "")) {
        changed.phone = values.phone || undefined
      }
      if (values.address !== undefined && values.address !== (user.address ?? "")) {
        changed.address = values.address || undefined
      }
      if (values.password) {
        changed.password = values.password
      }
      if (values.status && values.status !== (user.status ?? "Active")) {
        changed.status = values.status
      }
      if (values.role && values.role !== user.role) {
        changed.role = values.role
      }

      onSubmit(changed)
    } else {
      // Create mode: send all values
      onSubmit({
        ...values,
        password: values.password || undefined,
        phone: values.phone || undefined,
        address: values.address || undefined,
      })
    }
    form.reset()
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Chỉnh Sửa Người Dùng" : "Thêm Người Dùng Mới"}</DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Chỉ cần thay đổi các trường bạn muốn cập nhật."
              : "Điền thông tin để thêm người dùng mới."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            {/* Username */}
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tên Đăng Nhập</FormLabel>
                  <FormControl>
                    <Input placeholder="nguyenvana" disabled={isEditing} {...field} />
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
                    <Input placeholder="Nguyễn Văn A" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Email & Phone */}
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="user@gmail.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Số Điện Thoại</FormLabel>
                    <FormControl>
                      <Input placeholder="0901234567" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Password */}
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {isEditing ? "Mật Khẩu Mới (để trống nếu không đổi)" : "Mật Khẩu"}
                  </FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="••••••••" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Address */}
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Địa Chỉ</FormLabel>
                  <FormControl>
                    <Input placeholder="Quận 1, TP Hồ Chí Minh" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Role & Status */}
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Vai Trò</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn vai trò" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="user">User</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Trạng Thái</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn trạng thái" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Active">Active</SelectItem>
                        <SelectItem value="Blocked">Blocked</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Hủy
              </Button>
              <Button type="submit">{isEditing ? "Cập Nhật" : "Tạo Mới"}</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
