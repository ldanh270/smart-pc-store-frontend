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
import { useProductStore } from "@/stores/useProductStore"
import type { AdminProduct } from "@/types/product"

import { useEffect, useState } from "react"

import {
  Eye,
  EyeOff,
  Loader2,
  MoreHorizontal,
  Pencil,
  Plus,
  RefreshCw,
  Search,
  Trash2,
} from "lucide-react"
import Image from "next/image"

import DeleteProductDialog from "./DeleteProductDialog"
import ProductEditSheet from "./ProductEditSheet"
import ProductFormDialog from "./ProductFormDialog"

// ─── Component ──────────────────────────────────────────────────────────────

export default function ProductTable() {
  const {
    products,
    loading,
    fetchProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    lastParams,
  } = useProductStore()

  const [searchQuery, setSearchQuery] = useState("")
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<AdminProduct | null>(null)
  const [deletingProduct, setDeletingProduct] = useState<AdminProduct | null>(null)

  // ─── Fetch Products from Backend ────────────────────────────────────

  useEffect(() => {
    const debounce = setTimeout(() => {
      fetchProducts({ name: searchQuery || undefined, page: 1, size: 20 })
    }, 300)
    return () => clearTimeout(debounce)
  }, [searchQuery, fetchProducts])

  // ─── Pagination ─────────────────────────────────────────────────────

  const currentPage = lastParams?.page || 1
  const pageSize = lastParams?.size || 10
  const hasNextPage = products.length === pageSize

  function handlePreviousPage() {
    if (currentPage > 1) {
      fetchProducts({ page: currentPage - 1 })
    }
  }

  function handleNextPage() {
    if (hasNextPage) {
      fetchProducts({ page: currentPage + 1 })
    }
  }

  // ─── Handlers (API-backed via Store) ────────────────────────────────

  async function handleCreateProduct(data: Omit<AdminProduct, "id">) {
    const success = await createProduct({
      productName: data.productName,
      description: data.description ?? undefined,
      imageUrl: data.imageUrl ?? undefined,
      currentPrice: data.currentPrice,
      quantity: data.quantity,
      supplierId: data.supplierId,
      categoryId: data.categoryId,
      status: data.status,
    })
    if (success) {
      setIsCreateOpen(false)
    }
  }

  async function handleToggleStatus(product: AdminProduct) {
    await updateProduct(product.id, {
      productName: product.productName,
      description: product.description ?? undefined,
      imageUrl: product.imageUrl ?? undefined,
      currentPrice: product.currentPrice,
      quantity: product.quantity,
      supplierId: product.supplierId,
      categoryId: product.categoryId,
      status: !product.status,
    })
  }

  async function handleDeleteProduct(id: string) {
    const success = await deleteProduct(id)
    if (success) {
      setDeletingProduct(null)
    }
  }

  // ─── Render ─────────────────────────────────────────────────────────

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative max-w-sm flex-1">
          <Search className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
          <Input
            placeholder="Tìm kiếm sản phẩm..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="icon" onClick={() => fetchProducts()} disabled={loading}>
            <RefreshCw className={`size-4 ${loading ? "animate-spin" : ""}`} />
          </Button>
          <Button onClick={() => setIsCreateOpen(true)}>
            <Plus className="mr-2 size-4" />
            Thêm Sản Phẩm
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="border-border rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-16">ID</TableHead>
              <TableHead className="w-14">Ảnh</TableHead>
              <TableHead>Tên Sản Phẩm</TableHead>
              <TableHead className="text-right">Giá</TableHead>
              <TableHead className="hidden text-center md:table-cell">Tồn Kho</TableHead>
              <TableHead className="hidden text-center lg:table-cell">Danh Mục</TableHead>
              <TableHead className="hidden text-center lg:table-cell">Nhà Cung Cấp</TableHead>
              <TableHead className="text-center">Trạng Thái</TableHead>
              <TableHead className="w-16" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={8} className="py-12 text-center">
                  <Loader2 className="text-muted-foreground mx-auto size-6 animate-spin" />
                  <p className="text-muted-foreground mt-2 text-sm">Đang tải sản phẩm...</p>
                </TableCell>
              </TableRow>
            ) : products.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="text-muted-foreground py-12 text-center">
                  Không tìm thấy sản phẩm nào.
                </TableCell>
              </TableRow>
            ) : (
              products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell className="font-mono text-sm">{product.id}</TableCell>
                  <TableCell>
                    <div className="bg-muted relative size-10 overflow-hidden rounded-md">
                      <Image
                        src={product.imageUrl || "/products/placeholder.svg"}
                        alt={product.productName}
                        fill
                        className="object-cover"
                        sizes="40px"
                      />
                    </div>
                  </TableCell>
                  <TableCell>
                    <p className="max-w-62.5 truncate text-sm font-medium">{product.productName}</p>
                    <p className="text-muted-foreground max-w-62.5 truncate text-xs">
                      {product.description}
                    </p>
                  </TableCell>
                  <TableCell className="text-right font-mono text-sm font-semibold">
                    {product.currentPrice.toLocaleString("vi-VN")} ₫
                  </TableCell>
                  <TableCell className="hidden text-center md:table-cell">
                    <span
                      className={`font-mono text-sm ${
                        product.quantity === 0 ? "text-destructive font-semibold" : ""
                      }`}
                    >
                      {product.quantity}
                    </span>
                  </TableCell>
                  <TableCell className="hidden text-center lg:table-cell">
                    <Badge variant="secondary">{product.categoryName ?? product.categoryId}</Badge>
                  </TableCell>
                  <TableCell className="hidden text-center lg:table-cell">
                    <span className="text-sm">{product.supplierName ?? product.supplierId}</span>
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge
                      variant={product.status ? "outline" : "destructive"}
                      className={product.status ? "border-emerald-500/50 text-emerald-600" : ""}
                    >
                      {product.status ? "Đang bán" : "Ẩn"}
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
                        <DropdownMenuItem onClick={() => setEditingProduct(product)}>
                          <Pencil className="mr-2 size-4" />
                          Chỉnh sửa
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleToggleStatus(product)}>
                          {product.status ? (
                            <>
                              <EyeOff className="mr-2 size-4" />
                              Ẩn sản phẩm
                            </>
                          ) : (
                            <>
                              <Eye className="mr-2 size-4" />
                              Hiện sản phẩm
                            </>
                          )}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-destructive"
                          onClick={() => setDeletingProduct(product)}
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
      <div className="flex items-center justify-between px-2">
        <p className="text-muted-foreground text-sm">Đang hiển thị trang {currentPage}</p>
        <Pagination className="mx-0 w-auto">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={handlePreviousPage}
                className={currentPage <= 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
              />
            </PaginationItem>
            <PaginationItem>
              <PaginationNext
                onClick={handleNextPage}
                className={!hasNextPage ? "pointer-events-none opacity-50" : "cursor-pointer"}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>

      {/* Dialogs */}
      <ProductFormDialog
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
        onSubmit={handleCreateProduct}
      />

      <ProductEditSheet
        product={editingProduct}
        open={!!editingProduct}
        onOpenChange={(open) => {
          if (!open) setEditingProduct(null)
        }}
      />

      <DeleteProductDialog
        open={!!deletingProduct}
        onOpenChange={(open) => {
          if (!open) setDeletingProduct(null)
        }}
        productName={deletingProduct?.productName ?? ""}
        onConfirm={() => {
          if (deletingProduct) handleDeleteProduct(deletingProduct.id)
        }}
      />
    </div>
  )
}
