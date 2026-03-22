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
  PurchaseOrderType,
  StockImport,
  StockImportAdjustDto,
  StockImportStatus,
} from "@/types/stockImport"

import { useEffect, useState } from "react"
import { toast } from "sonner"

import {
  ClipboardEdit,
  Eye,
  Loader2,
  MoreHorizontal,
  PackageCheck,
  Pencil,
  Plus,
  RefreshCw,
  Trash2,
  XCircle,
} from "lucide-react"

import DeleteStockImportDialog from "./DeleteStockImportDialog"
import StockImportDetailDialog from "./StockImportDetailDialog"
import StockImportFormDialog from "./StockImportFormDialog"

// ─── Status config ───────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<
  StockImportStatus,
  { label: string; variant: "outline" | "destructive" | "secondary"; className: string }
> = {
  PENDING: {
    label: "Chờ xử lý",
    variant: "outline",
    className: "border-yellow-500/50 text-yellow-600",
  },
  COMPLETED: {
    label: "Hoàn thành",
    variant: "outline",
    className: "border-emerald-500/50 text-emerald-600",
  },
  CANCELLED: {
    label: "Đã hủy",
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
    deleteStockImport,
    updateStatus,
    adjustStockImport,
  } = useStockImportStore()

  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [editingImport, setEditingImport] = useState<StockImport | null>(null)
  const [adjustingImport, setAdjustingImport] = useState<StockImport | null>(null)
  const [viewingImport, setViewingImport] = useState<StockImport | null>(null)
  const [deletingImport, setDeletingImport] = useState<StockImport | null>(null)
  const [loadingActionId, setLoadingActionId] = useState<string | null>(null)
  
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<StockImportStatus | "ALL">("ALL")

  useEffect(() => {
    fetchStockImports()
  }, [fetchStockImports])

  async function handleOpenEdit(imp: StockImport) {
    setLoadingActionId(imp.id)
    try {
      const detail = await stockImportService.getStockImport(imp.id)
      setEditingImport(detail)
    } catch {
      toast.error("Không thể lấy chi tiết phiếu nhập")
    } finally {
      setLoadingActionId(null)
    }
  }

  async function handleOpenAdjust(imp: StockImport) {
    setLoadingActionId(imp.id)
    try {
      const detail = await stockImportService.getStockImport(imp.id)
      setAdjustingImport(detail)
    } catch {
      toast.error("Không thể lấy chi tiết phiếu nhập")
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
      toast.error("Không thể lấy chi tiết phiếu nhập")
    } finally {
      setLoadingActionId(null)
    }
  }

  async function handleCreate(data: Parameters<typeof createStockImport>[0]) {
    const success = await createStockImport(data)
    if (success) setIsCreateOpen(false)
    return success
  }

  async function handleEdit(data: Parameters<typeof createStockImport>[0]) {
    if (!editingImport) return false
    const success = await updateStockImport(editingImport.id, data)
    if (success) setEditingImport(null)
    return success
  }

  async function handleAdjust(data: StockImportAdjustDto) {
    if (!adjustingImport) return false
    const success = await adjustStockImport(adjustingImport.id, data)
    if (success) setAdjustingImport(null)
    return success
  }

  async function handleDelete() {
    if (!deletingImport) return
    const success = await deleteStockImport(deletingImport.id)
    if (success) setDeletingImport(null)
  }

  // Filtered list
  const filtered = stockImports.filter((imp) => {
    const matchesSearch =
      search === "" ||
      imp.importCode.toLowerCase().includes(search.toLowerCase()) ||
      imp.supplierName.toLowerCase().includes(search.toLowerCase())
    const matchesStatus = statusFilter === "ALL" || imp.status === statusFilter
    return matchesSearch && matchesStatus
  })

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex max-w-md flex-1 gap-2">
          <Input
            placeholder="Tìm theo mã phiếu, nhà cung cấp..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-9"
          />
          <Select
            value={statusFilter}
            onValueChange={(v) => setStatusFilter(v as StockImportStatus | "ALL")}
          >
            <SelectTrigger className="h-9 w-36 shrink-0">
              <SelectValue placeholder="Trạng thái" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">Tất cả</SelectItem>
              <SelectItem value="PENDING">Chờ xử lý</SelectItem>
              <SelectItem value="COMPLETED">Hoàn thành</SelectItem>
              <SelectItem value="CANCELLED">Đã hủy</SelectItem>
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
            Tạo Phiếu Nhập
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="border-border rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-36">Mã Phiếu</TableHead>
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
              <TableRow>
                <TableCell colSpan={7} className="py-12 text-center">
                  <Loader2 className="text-muted-foreground mx-auto size-6 animate-spin" />
                  <p className="text-muted-foreground mt-2 text-sm">Đang tải dữ liệu...</p>
                </TableCell>
              </TableRow>
            ) : filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-muted-foreground py-12 text-center">
                  Không tìm thấy phiếu nhập hàng nào.
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((imp) => {
                const cfg = STATUS_CONFIG[imp.status]
                const typeCfg = TYPE_CONFIG[imp.type || "NORMAL"]
                const isNegative = imp.totalAmount < 0
                const isItemLoading = loadingActionId === imp.id

                return (
                  <TableRow key={imp.id}>
                    <TableCell className="font-mono text-sm font-semibold">
                      {imp.importCode}
                    </TableCell>
                    <TableCell>
                      <p className="font-medium">{imp.supplierName}</p>
                    </TableCell>
                    <TableCell className={`text-right font-semibold ${isNegative ? "text-red-600" : "text-primary"}`}>
                      {imp.totalAmount.toLocaleString("vi-VN")}₫
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
                      {new Date(imp.createdAt).toLocaleDateString("vi-VN")}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="size-8" disabled={isItemLoading}>
                            {isItemLoading ? (
                              <Loader2 className="size-4 animate-spin" />
                            ) : (
                              <MoreHorizontal className="size-4" />
                            )}
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleOpenViewDetail(imp)}>
                            <Eye className="mr-2 size-4" />
                            Xem Chi Tiết
                          </DropdownMenuItem>
                          {imp.type !== "ADJUSTMENT" && (
                            <DropdownMenuItem onClick={() => handleOpenAdjust(imp)}>
                              <ClipboardEdit className="mr-2 size-4 text-orange-600" />
                              Điều Chỉnh (Adjust)
                            </DropdownMenuItem>
                          )}
                          {imp.status === "PENDING" && (
                            <>
                              <DropdownMenuItem onClick={() => handleOpenEdit(imp)}>
                                <Pencil className="mr-2 size-4" />
                                Chỉnh Sửa
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={() => updateStatus(imp.id, "COMPLETED")}>
                                <PackageCheck className="mr-2 size-4 text-emerald-600" />
                                Xác Nhận Nhập
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => updateStatus(imp.id, "CANCELLED")}>
                                <XCircle className="mr-2 size-4 text-yellow-600" />
                                Hủy Phiếu
                              </DropdownMenuItem>
                            </>
                          )}
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-destructive"
                            onClick={() => setDeletingImport(imp)}
                          >
                            <Trash2 className="mr-2 size-4" />
                            Xóa
                          </DropdownMenuItem>
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

      {/* Summary row */}
      {!loading && filtered.length > 0 && (
        <div className="text-muted-foreground flex items-center justify-between px-1 text-sm">
          <span>{filtered.length} phiếu nhập</span>
          <span>
            Tổng:{" "}
            <span className="text-foreground font-semibold">
              {filtered.reduce((sum, i) => sum + i.totalAmount, 0).toLocaleString("vi-VN")}₫
            </span>
          </span>
        </div>
      )}

      {/* Dialogs */}
      <StockImportFormDialog
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
        onSubmit={handleCreate}
      />

      <StockImportFormDialog
        open={!!editingImport}
        onOpenChange={(open) => {
          if (!open) setEditingImport(null)
        }}
        stockImport={editingImport ?? undefined}
        onSubmit={handleEdit}
      />

      <StockImportFormDialog
        open={!!adjustingImport}
        onOpenChange={(open) => {
          if (!open) setAdjustingImport(null)
        }}
        stockImport={adjustingImport ?? undefined}
        isAdjustment={true}
        onSubmit={handleAdjust}
      />

      <StockImportDetailDialog
        open={!!viewingImport}
        onOpenChange={(open) => {
          if (!open) setViewingImport(null)
        }}
        stockImport={viewingImport}
      />

      <DeleteStockImportDialog
        open={!!deletingImport}
        onOpenChange={(open) => {
          if (!open) setDeletingImport(null)
        }}
        importCode={deletingImport?.importCode ?? ""}
        onConfirm={handleDelete}
      />
    </div>
  )
}
