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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useStockImportStore } from "@/stores/useStockImportStore"
import { stockImportService } from "@/services/stockImportService"
import type {
  PurchaseOrderStatus,
  PurchaseOrderType,
  StockImport,
} from "@/types/stockImport"

import { useEffect, useMemo, useState } from "react"
import { toast } from "sonner"

import {
  Eye,
  Loader2,
  MoreHorizontal,
  PackageCheck,
  Pencil,
  Plus,
  RefreshCw,
  XCircle,
} from "lucide-react"

import CancelPurchaseOrderDialog from "./CancelPurchaseOrderDialog"
import StockImportDetailDialog from "./StockImportDetailDialog"
import StockImportFormDialog from "./StockImportFormDialog"

// ─── Constants ────────────────────────────────────────────────────────────────

const PAGE_SIZE = 10

// ─── Config ──────────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<
  PurchaseOrderStatus,
  { label: string; variant: "outline" | "destructive" | "secondary"; className: string }
> = {
  DRAFT: {
    label: "Nháp",
    variant: "outline",
    className: "border-yellow-500/50 text-yellow-600",
  },
  RECEIVED: {
    label: "Đã Nhận Hàng",
    variant: "outline",
    className: "border-emerald-500/50 text-emerald-600",
  },
  CANCELLED: {
    label: "Đã Hủy",
    variant: "destructive",
    className: "",
  },
}

const TYPE_CONFIG: Record<
  PurchaseOrderType,
  { label: string; variant: "outline" | "secondary"; className: string }
> = {
  NORMAL: {
    label: "Thông thường",
    variant: "outline",
    className: "border-blue-500/50 text-blue-600",
  },
  ADJUSTMENT: {
    label: "Điều chỉnh",
    variant: "outline",
    className: "border-orange-500/50 text-orange-600",
  },
  IMPORT: {
    label: "Nhập hàng",
    variant: "outline",
    className: "border-purple-500/50 text-purple-600",
  },
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function StockImportTable() {
  const {
    stockImports,
    loading,
    fetchStockImports,
    createStockImport,
    updateStockImport,
    receivePurchaseOrder,
    cancelPurchaseOrder,
  } = useStockImportStore()

  // ── Dialog state ──────────────────────────────────────────────────────────
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [editingImport, setEditingImport] = useState<StockImport | null>(null)
  const [viewingImport, setViewingImport] = useState<StockImport | null>(null)
  const [cancelingImport, setCancelingImport] = useState<StockImport | null>(null)
  const [loadingActionId, setLoadingActionId] = useState<string | null>(null)

  // ── Filters ───────────────────────────────────────────────────────────────
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<PurchaseOrderStatus | "ALL">("ALL")
  const [currentPage, setCurrentPage] = useState(1)

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [search, statusFilter])

  // Initial load
  useEffect(() => {
    fetchStockImports()
  }, [fetchStockImports])

  // ── Handlers ──────────────────────────────────────────────────────────────

  async function handleOpenEdit(imp: StockImport) {
    setLoadingActionId(imp.id)
    try {
      const detail = await stockImportService.getStockImport(imp.id)
      setEditingImport(detail)
    } catch {
      toast.error("Không thể lấy chi tiết đơn hàng")
    } finally {
      setLoadingActionId(null)
    }
  }

  async function handleOpenViewDetail(imp: StockImport) {
    setLoadingActionId(imp.id)
    try {
      const detail = await stockImportService.getStockImport(imp.id)
      setViewingImport(detail)
    } catch {
      toast.error("Không thể lấy chi tiết đơn hàng")
    } finally {
      setLoadingActionId(null)
    }
  }

  async function handleCreate(data: Parameters<typeof createStockImport>[0]) {
    const success = await createStockImport(data)
    if (success) {
      setIsCreateOpen(false)
      setCurrentPage(1)
    }
    return success
  }

  async function handleEdit(data: Parameters<typeof updateStockImport>[1]) {
    if (!editingImport) return false
    const success = await updateStockImport(editingImport.id, data)
    if (success) setEditingImport(null)
    return success
  }

  async function handleReceive(id: string) {
    await receivePurchaseOrder(id)
  }

  async function handleCancelConfirm(reason: string) {
    if (!cancelingImport) return
    const success = await cancelPurchaseOrder(cancelingImport.id, { reason })
    if (success) setCancelingImport(null)
  }

  // Quick receive from table row (no detail dialog)
  async function handleQuickReceive(imp: StockImport) {
    setLoadingActionId(imp.id)
    try {
      await receivePurchaseOrder(imp.id)
    } finally {
      setLoadingActionId(null)
    }
  }

  // ── Filtering & pagination ────────────────────────────────────────────────

  const filtered = useMemo(
    () =>
      stockImports.filter((imp) => {
        const matchesSearch =
          search === "" ||
          imp.importCode.toLowerCase().includes(search.toLowerCase()) ||
          imp.supplierName.toLowerCase().includes(search.toLowerCase())
        const matchesStatus = statusFilter === "ALL" || imp.status === statusFilter
        return matchesSearch && matchesStatus
      }),
    [stockImports, search, statusFilter],
  )

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const safePage = Math.min(currentPage, totalPages)
  const paginated = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE)

  const pageNumbers = useMemo(() => {
    if (totalPages <= 5) return Array.from({ length: totalPages }, (_, i) => i + 1)
    if (safePage <= 3) return [1, 2, 3, 4, 5]
    if (safePage >= totalPages - 2)
      return [totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages]
    return [safePage - 2, safePage - 1, safePage, safePage + 1, safePage + 2]
  }, [totalPages, safePage])

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex max-w-md flex-1 gap-2">
          <Input
            placeholder="Tìm theo mã đơn, nhà cung cấp..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-9"
          />
          <Select
            value={statusFilter}
            onValueChange={(v) => setStatusFilter(v as PurchaseOrderStatus | "ALL")}
          >
            <SelectTrigger className="h-9 w-40 shrink-0">
              <SelectValue placeholder="Trạng thái" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">Tất cả</SelectItem>
              <SelectItem value="DRAFT">Nháp</SelectItem>
              <SelectItem value="RECEIVED">Đã Nhận Hàng</SelectItem>
              <SelectItem value="CANCELLED">Đã Hủy</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            className="h-9 w-9"
            onClick={() => fetchStockImports()}
            disabled={loading}
          >
            <RefreshCw className={`size-4 ${loading ? "animate-spin" : ""}`} />
          </Button>
          <Button className="h-9" onClick={() => setIsCreateOpen(true)}>
            <Plus className="mr-2 size-4" />
            Tạo Đơn Đặt Hàng
          </Button>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="text-muted-foreground flex gap-4 text-sm">
        <span>
          Tổng: <span className="text-foreground font-semibold">{stockImports.length}</span> đơn hàng
        </span>
        <span>•</span>
        <span>
          Nháp:{" "}
          <span className="font-semibold text-amber-500">
            {stockImports.filter((i) => i.status === "DRAFT").length}
          </span>
        </span>
        <span>•</span>
        <span>
          Đã Nhận Hàng:{" "}
          <span className="font-semibold text-emerald-600">
            {stockImports.filter((i) => i.status === "RECEIVED").length}
          </span>
        </span>
        <span>•</span>
        <span>
          Đã Hủy:{" "}
          <span className="text-destructive font-semibold">
            {stockImports.filter((i) => i.status === "CANCELLED").length}
          </span>
        </span>
      </div>

      {/* Table */}
      <div className="border-border rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-36">Mã Đơn</TableHead>
              <TableHead>Nhà Cung Cấp</TableHead>
              <TableHead className="text-right">Tổng Tiền</TableHead>
              <TableHead className="text-center">Loại</TableHead>
              <TableHead className="text-center">Trạng Thái</TableHead>
              <TableHead className="hidden lg:table-cell">Ngày Tạo</TableHead>
              <TableHead className="w-16" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow key="loading">
                <TableCell colSpan={7} className="py-12 text-center">
                  <Loader2 className="text-muted-foreground mx-auto size-6 animate-spin" />
                  <p className="text-muted-foreground mt-2 text-sm">Đang tải dữ liệu...</p>
                </TableCell>
              </TableRow>
            ) : paginated.length === 0 ? (
              <TableRow key="empty">
                <TableCell colSpan={7} className="text-muted-foreground py-12 text-center">
                  Không tìm thấy đơn đặt hàng nào.
                </TableCell>
              </TableRow>
            ) : (
              paginated.map((imp, index) => {
                const cfg = STATUS_CONFIG[imp.status] ?? STATUS_CONFIG.DRAFT
                const typeCfg = TYPE_CONFIG[imp.type || "NORMAL"]
                const isNegative = (imp.totalAmount ?? 0) < 0
                const isItemLoading = loadingActionId === imp.id
                const isDraft = imp.status === "DRAFT"

                return (
                  <TableRow key={`${imp.id}-${index}`}>
                    <TableCell className="font-mono text-sm font-semibold">
                      {imp.importCode}
                    </TableCell>
                    <TableCell>
                      <p className="font-medium">{imp.supplierName}</p>
                    </TableCell>
                    <TableCell
                      className={`text-right font-semibold ${isNegative ? "text-red-600" : "text-primary"}`}
                    >
                      {(imp.totalAmount ?? 0).toLocaleString("vi-VN")}₫
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant={typeCfg.variant} className={typeCfg.className}>
                        {typeCfg.label}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant={cfg.variant} className={cfg.className}>
                        {cfg.label}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground hidden text-sm lg:table-cell">
                      {imp.createdAt ? new Date(imp.createdAt).toLocaleDateString("vi-VN") : "N/A"}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="size-8"
                            disabled={isItemLoading}
                          >
                            {isItemLoading ? (
                              <Loader2 className="size-4 animate-spin" />
                            ) : (
                              <MoreHorizontal className="size-4" />
                            )}
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          {/* View — always available */}
                          <DropdownMenuItem onClick={() => handleOpenViewDetail(imp)}>
                            <Eye className="mr-2 size-4" />
                            Xem Chi Tiết
                          </DropdownMenuItem>

                          {/* DRAFT-only actions */}
                          {isDraft && (
                            <>
                              <DropdownMenuItem onClick={() => handleOpenEdit(imp)}>
                                <Pencil className="mr-2 size-4" />
                                Chỉnh Sửa
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={() => handleQuickReceive(imp)}>
                                <PackageCheck className="mr-2 size-4 text-emerald-600" />
                                Nhận Hàng (Nhập Kho)
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="text-destructive"
                                onClick={() => setCancelingImport(imp)}
                              >
                                <XCircle className="mr-2 size-4" />
                                Hủy Đơn
                              </DropdownMenuItem>
                            </>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                )
              })
            )}
          </TableBody>
        </Table>
      </div>

      {/* Footer */}
      {!loading && filtered.length > 0 && (
        <div className="flex items-center justify-between px-2">
          <p className="text-muted-foreground text-sm">
            Đang hiển thị trang {safePage}
          </p>

          <Pagination className="mx-0 w-auto">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={(e) => { e.preventDefault(); setCurrentPage((p) => Math.max(1, p - 1)) }}
                  className={safePage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>

              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={(e) => { e.preventDefault(); setCurrentPage((p) => Math.min(totalPages, p + 1)) }}
                  className={safePage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}

      {/* Dialogs */}
      <StockImportFormDialog
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
        onSubmit={handleCreate as any}
      />

      <StockImportFormDialog
        open={!!editingImport}
        onOpenChange={(open) => { if (!open) setEditingImport(null) }}
        stockImport={editingImport ?? undefined}
        onSubmit={handleEdit}
      />

      <StockImportDetailDialog
        open={!!viewingImport}
        onOpenChange={(open) => { if (!open) setViewingImport(null) }}
        stockImport={viewingImport}
        onReceive={handleReceive}
        onCancel={(id) => {
          const imp = stockImports.find((i) => i.id === id)
          if (imp) setCancelingImport(imp)
        }}
      />

      <CancelPurchaseOrderDialog
        open={!!cancelingImport}
        onOpenChange={(open) => { if (!open) setCancelingImport(null) }}
        importCode={cancelingImport?.importCode ?? ""}
        onConfirm={handleCancelConfirm}
      />
    </div>
  )
}
