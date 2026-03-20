"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useUserStore } from "@/stores/useUserStore"
import type { User } from "@/types/user"

import { useEffect, useState } from "react"

import { Loader2, MoreHorizontal, Pencil, Plus, RefreshCw, Trash2 } from "lucide-react"

import DeleteUserDialog from "./DeleteUserDialog"
import UserFormDialog, { type UserFormValues } from "./UserFormDialog"

export default function UserTable() {
  const { users, loading, fetchUsers, createUser, updateUser, deleteUser } = useUserStore()

  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [deletingUser, setDeletingUser] = useState<User | null>(null)

  useEffect(() => {
    fetchUsers()
  }, [fetchUsers])

  // ─── Handlers ────────────────────────────────────────────────────────

  async function handleCreateUser(data: UserFormValues) {
    const success = await createUser(data as Parameters<typeof createUser>[0])
    if (success) setIsCreateOpen(false)
  }

  async function handleEditUser(data: UserFormValues) {
    if (!editingUser) return
    const success = await updateUser(editingUser.id, data as Parameters<typeof updateUser>[1])
    if (success) setEditingUser(null)
  }

  async function handleDeleteUser(id: number) {
    const success = await deleteUser(id)
    if (success) setDeletingUser(null)
  }

  // ─── Render ──────────────────────────────────────────────────────────

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
        <div className="flex gap-2">
          <Button variant="outline" size="icon" onClick={() => fetchUsers()} disabled={loading}>
            <RefreshCw className={`size-4 ${loading ? "animate-spin" : ""}`} />
          </Button>
          <Button onClick={() => setIsCreateOpen(true)}>
            <Plus className="mr-2 size-4" />
            Thêm Người Dùng
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="border-border rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-16">ID</TableHead>
              <TableHead>Username</TableHead>
              <TableHead>Tên Hiển Thị</TableHead>
              <TableHead>Email</TableHead>
              <TableHead className="hidden md:table-cell">Điện Thoại</TableHead>
              <TableHead className="text-center">Vai Trò</TableHead>
              <TableHead className="text-center">Trạng Thái</TableHead>
              <TableHead className="w-16" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={8} className="py-12 text-center">
                  <Loader2 className="text-muted-foreground mx-auto size-6 animate-spin" />
                  <p className="text-muted-foreground mt-2 text-sm">Đang tải người dùng...</p>
                </TableCell>
              </TableRow>
            ) : users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-muted-foreground py-12 text-center">
                  Không tìm thấy người dùng nào.
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-mono text-sm">{user.id}</TableCell>
                  <TableCell className="font-medium">{user.username}</TableCell>
                  <TableCell>{user.displayName}</TableCell>
                  <TableCell className="text-sm">{user.email}</TableCell>
                  <TableCell className="hidden md:table-cell">{user.phone || "-"}</TableCell>
                  <TableCell className="text-center">
                    <Badge variant={user.role === "admin" ? "default" : "secondary"}>
                      {user.role === "admin" ? "Admin" : "User"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge
                      variant={user.status === "Active" ? "outline" : "destructive"}
                      className={
                        user.status === "Active" ? "border-emerald-500/50 text-emerald-600" : ""
                      }
                    >
                      {user.status ?? "Active"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="size-8">
                          <MoreHorizontal className="size-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => setEditingUser(user)}>
                          <Pencil className="mr-2 size-4" />
                          Chỉnh sửa
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-destructive"
                          onClick={() => setDeletingUser(user)}
                        >
                          <Trash2 className="mr-2 size-4" />
                          Xóa
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Dialogs */}
      <UserFormDialog
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
        onSubmit={handleCreateUser}
      />

      <UserFormDialog
        open={!!editingUser}
        onOpenChange={(open) => {
          if (!open) setEditingUser(null)
        }}
        user={editingUser ?? undefined}
        onSubmit={handleEditUser}
      />

      <DeleteUserDialog
        open={!!deletingUser}
        onOpenChange={(open) => {
          if (!open) setDeletingUser(null)
        }}
        userName={deletingUser?.displayName ?? ""}
        onConfirm={() => {
          if (deletingUser) handleDeleteUser(deletingUser.id)
        }}
      />
    </div>
  )
}
