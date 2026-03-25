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
import { useCategoryStore } from "@/stores/useCategoryStore"
import type { Category, CategoryCreateDto } from "@/types/category"

import { useEffect, useState } from "react"

import { Loader2, MoreHorizontal, Pencil, Plus, RefreshCw, Search, Trash2 } from "lucide-react"

import CategoryFormDialog, { type CategoryFormValues } from "./CategoryFormDialog"
import DeleteCategoryDialog from "./DeleteCategoryDialog"

export default function CategoryTable() {
  const { categories, loading, fetchCategories, createCategory, updateCategory, deleteCategory } =
    useCategoryStore()

  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [deletingCategory, setDeletingCategory] = useState<Category | null>(null)
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    fetchCategories()
  }, [fetchCategories])

  // ─── Filtered Data ──────────────────────────────────────────────────

  const filteredCategories = categories.filter((cat) => {
    const q = searchQuery.toLowerCase()
    const mask = `DM-${cat.id.substring(0, 8).toUpperCase()}`.toLowerCase()
    return cat.name?.toLowerCase().includes(q) || mask.includes(q)
  })

  // ─── Pagination ──────────────────────────────────────────────────────

  const PAGE_SIZE = 10
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery])

  const totalPages = Math.max(1, Math.ceil(filteredCategories.length / PAGE_SIZE))
  const safePage = Math.min(currentPage, totalPages)
  const paginatedCategories = filteredCategories.slice(
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

  // ─── Handlers ────────────────────────────────────────────────────────

  async function handleCreateCategory(data: CategoryFormValues) {
    const dto: CategoryCreateDto = {
      categoryName: data.categoryName,
      description: data.description,
      status: data.status,
    }
    const success = await createCategory(dto)
    if (success) setIsCreateOpen(false)
  }

  async function handleEditCategory(data: CategoryFormValues) {
    if (!editingCategory) return
    const dto: CategoryCreateDto = {
      categoryName: data.categoryName,
      description: data.description,
      status: data.status,
    }
    const success = await updateCategory(editingCategory.id, dto)
    if (success) setEditingCategory(null)
  }

  async function handleDeleteCategory(id: string) {
    const success = await deleteCategory(id)
    if (success) setDeletingCategory(null)
  }

  // ─── Render ──────────────────────────────────────────────────────────

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {/* Search */}
        <div className="relative max-w-sm flex-1">
          <Search className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
          <Input
            placeholder="Tìm kiếm danh mục..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => fetchCategories()}
            disabled={loading}
          >
            <RefreshCw className={`size-4 ${loading ? "animate-spin" : ""}`} />
          </Button>
          <Button onClick={() => setIsCreateOpen(true)}>
            <Plus className="mr-2 size-4" />
            Thêm Danh Mục
          </Button>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="text-muted-foreground flex gap-4 text-sm">
        <span>
          Tổng: <span className="text-foreground font-semibold">{categories.length}</span> danh mục
        </span>
        <span>•</span>
        <span>
          Hoạt động:{" "}
          <span className="font-semibold text-emerald-600">
            {categories.filter((c) => c.status).length}
          </span>
        </span>
        <span>•</span>
        <span>
          Tắt:{" "}
          <span className="text-destructive font-semibold">
            {categories.filter((c) => !c.status).length}
          </span>
        </span>
      </div>

      {/* Table */}
      <div className="border-border rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-16">ID</TableHead>
              <TableHead>Tên Danh Mục</TableHead>
              <TableHead className="hidden md:table-cell">Mô Tả</TableHead>
              <TableHead className="text-center">Trạng Thái</TableHead>
              <TableHead className="w-16" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} className="py-12 text-center">
                  <Loader2 className="text-muted-foreground mx-auto size-6 animate-spin" />
                  <p className="text-muted-foreground mt-2 text-sm">Đang tải danh mục...</p>
                </TableCell>
              </TableRow>
            ) : paginatedCategories.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-muted-foreground py-12 text-center">
                  {searchQuery
                    ? `Không tìm thấy danh mục phù hợp với "${searchQuery}".`
                    : "Chưa có danh mục nào. Hãy thêm danh mục mới!"}
                </TableCell>
              </TableRow>
            ) : (
              paginatedCategories.map((category) => (
                <TableRow key={category.id}>
                  <TableCell className="font-mono text-sm">
                    DM-{category.id.substring(0, 8).toUpperCase()}
                  </TableCell>
                  <TableCell>
                    <p className="font-medium">{category.name}</p>
                  </TableCell>
                  <TableCell className="text-muted-foreground hidden max-w-75 truncate text-sm md:table-cell">
                    {category.description || "—"}
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge
                      variant={category.status ? "outline" : "destructive"}
                      className={category.status ? "border-emerald-500/50 text-emerald-600" : ""}
                    >
                      {category.status ? "Hoạt động" : "Đã tắt"}
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
                        <DropdownMenuItem onClick={() => setEditingCategory(category)}>
                          <Pencil className="mr-2 size-4" />
                          Chỉnh sửa
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-destructive"
                          onClick={() => setDeletingCategory(category)}
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
      {!loading && filteredCategories.length > 0 && (
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
      <CategoryFormDialog
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
        onSubmit={handleCreateCategory}
      />

      <CategoryFormDialog
        open={!!editingCategory}
        onOpenChange={(open) => {
          if (!open) setEditingCategory(null)
        }}
        category={editingCategory ?? undefined}
        onSubmit={handleEditCategory}
      />

      <DeleteCategoryDialog
        open={!!deletingCategory}
        onOpenChange={(open) => {
          if (!open) setDeletingCategory(null)
        }}
        categoryName={deletingCategory?.name ?? ""}
        onConfirm={() => {
          if (deletingCategory) handleDeleteCategory(deletingCategory.id)
        }}
      />
    </div>
  )
}
