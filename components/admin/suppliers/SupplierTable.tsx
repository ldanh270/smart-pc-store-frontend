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
import { Input } from "@/components/ui/input"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useSupplierStore } from "@/stores/useSupplierStore"
import type { Supplier } from "@/types/supplier"

import { useEffect, useState } from "react"

import { Loader2, MoreHorizontal, Pencil, Plus, RefreshCw, Search, Trash2 } from "lucide-react"

import DeleteSupplierDialog from "./DeleteSupplierDialog"
import SupplierFormDialog from "./SupplierFormDialog"

export default function SupplierTable() {
  const { suppliers, loading, fetchSuppliers, createSupplier, updateSupplier, deleteSupplier } =
    useSupplierStore()

  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null)
  const [deletingSupplier, setDeletingSupplier] = useState<Supplier | null>(null)
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    fetchSuppliers()
  }, [fetchSuppliers])

  // ─── Filtered Data ──────────────────────────────────────────────────

  const filteredSuppliers = suppliers.filter((supplier) => {
    const q = searchQuery.toLowerCase()
    const mask = `SUP-${supplier.id.substring(0, 8).toUpperCase()}`.toLowerCase()
    return (
      supplier.name?.toLowerCase().includes(q) ||
      supplier.email?.toLowerCase().includes(q) ||
      supplier.phone?.toLowerCase().includes(q) ||
      mask.includes(q)
    )
  })

  // ─── Pagination ──────────────────────────────────────────────────────

  const PAGE_SIZE = 10
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery])

  const totalPages = Math.max(1, Math.ceil(filteredSuppliers.length / PAGE_SIZE))
  const safePage = Math.min(currentPage, totalPages)
  const paginatedSuppliers = filteredSuppliers.slice(
    (safePage - 1) * PAGE_SIZE,
    safePage * PAGE_SIZE,
  )

  const hasNextPage = safePage < totalPages

  function handlePreviousPage(e: React.MouseEvent) {
    e.preventDefault()
    if (safePage > 1) setCurrentPage((p) => p - 1)
  }

  function handleNextPage(e: React.MouseEvent) {
    e.preventDefault()
    if (hasNextPage) setCurrentPage((p) => p + 1)
  }

  async function handleCreateSupplier(data: Omit<Supplier, "id" | "createdAt" | "updatedAt">) {
    const success = await createSupplier(data)
    if (success) {
      setIsCreateOpen(false)
    }
  }

  async function handleEditSupplier(updated: Supplier) {
    const success = await updateSupplier(updated.id, {
      name: updated.name,
      contactName: updated.contactName,
      email: updated.email,
      phone: updated.phone,
      address: updated.address,
      status: updated.status,
    })
    if (success) {
      setEditingSupplier(null)
    }
  }

  async function handleDeleteSupplier(id: string) {
    const success = await deleteSupplier(id)
    if (success) {
      setDeletingSupplier(null)
    }
  }

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {/* Search */}
        <div className="relative max-w-sm flex-1">
          <Search className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
          <Input
            placeholder="Tìm kiếm nhà cung cấp..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Button variant="outline" size="icon" onClick={() => fetchSuppliers()} disabled={loading}>
            <RefreshCw className={`size-4 ${loading ? "animate-spin" : ""}`} />
          </Button>
          <Button onClick={() => setIsCreateOpen(true)}>
            <Plus className="mr-2 size-4" />
            Thêm Nhà Cung Cấp
          </Button>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="text-muted-foreground flex gap-4 text-sm">
        <span>
          Tổng: <span className="text-foreground font-semibold">{suppliers.length}</span> nhà cung cấp
        </span>
        <span>•</span>
        <span>
          Hoạt động:{" "}
          <span className="font-semibold text-emerald-600">
            {suppliers.filter((s) => s.status).length}
          </span>
        </span>
        <span>•</span>
        <span>
          Ngừng HĐ:{" "}
          <span className="text-destructive font-semibold">
            {suppliers.filter((s) => !s.status).length}
          </span>
        </span>
      </div>

      {/* Table */}
      <div className="border-border rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-16">ID</TableHead>
              <TableHead>Tên Nhà Cung Cấp</TableHead>
              <TableHead>Email</TableHead>
              <TableHead className="hidden md:table-cell">Điện thoại</TableHead>
              <TableHead className="text-center">Trạng Thái</TableHead>
              <TableHead className="w-16" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="py-12 text-center">
                  <Loader2 className="text-muted-foreground mx-auto size-6 animate-spin" />
                  <p className="text-muted-foreground mt-2 text-sm">
                    Đang tải hệ thống cung cấp...
                  </p>
                </TableCell>
              </TableRow>
            ) : paginatedSuppliers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-muted-foreground py-12 text-center">
                  {searchQuery
                    ? `Không tìm thấy nhà cung cấp phù hợp với "${searchQuery}".`
                    : "Không tìm thấy nhà cung cấp nào."}
                </TableCell>
              </TableRow>
            ) : (
              paginatedSuppliers.map((supplier) => (
                <TableRow key={supplier.id}>
                  <TableCell className="font-mono text-sm">
                    SUP-{supplier.id.substring(0, 8).toUpperCase()}
                  </TableCell>
                  <TableCell>
                    <p className="font-medium">{supplier.name}</p>
                    {supplier.contactName && (
                      <p className="text-muted-foreground text-xs">{supplier.contactName}</p>
                    )}
                  </TableCell>
                  <TableCell>{supplier.email || "-"}</TableCell>
                  <TableCell className="hidden md:table-cell">{supplier.phone || "-"}</TableCell>
                  <TableCell className="text-center">
                    <Badge
                      variant={supplier.status ? "outline" : "destructive"}
                      className={supplier.status ? "border-emerald-500/50 text-emerald-600" : ""}
                    >
                      {supplier.status ? "Hoạt động" : "Ngừng HĐ"}
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
                        <DropdownMenuItem onClick={() => setEditingSupplier(supplier)}>
                          <Pencil className="mr-2 size-4" />
                          Chỉnh sửa
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-destructive"
                          onClick={() => setDeletingSupplier(supplier)}
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

      {/* Pagination */}
      {!loading && filteredSuppliers.length > 0 && (
        <div className="flex items-center justify-between px-2">
          <p className="text-muted-foreground text-sm">Đang hiển thị trang {safePage}</p>
          <Pagination className="mx-0 w-auto">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={handlePreviousPage}
                  className={safePage <= 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>
              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={handleNextPage}
                  className={!hasNextPage ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}

      {/* Dialogs */}
      <SupplierFormDialog
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
        onSubmit={handleCreateSupplier}
      />

      <SupplierFormDialog
        open={!!editingSupplier}
        onOpenChange={(open) => {
          if (!open) setEditingSupplier(null)
        }}
        supplier={editingSupplier ?? undefined}
        onSubmit={(data) => {
          if (editingSupplier) {
            handleEditSupplier({ ...editingSupplier, ...data } as Supplier)
          }
        }}
      />

      <DeleteSupplierDialog
        open={!!deletingSupplier}
        onOpenChange={(open) => {
          if (!open) setDeletingSupplier(null)
        }}
        supplierName={deletingSupplier?.name ?? ""}
        onConfirm={() => {
          if (deletingSupplier) handleDeleteSupplier(deletingSupplier.id)
        }}
      />
    </div>
  )
}
