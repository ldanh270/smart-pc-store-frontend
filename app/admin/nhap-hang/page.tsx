"use client"

import StockImportTable from "@/components/admin/stock-imports/StockImportTable"

export default function AdminStockImportPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Nhập Hàng</h1>
        <p className="text-muted-foreground mt-1">
          Quản lý phiếu nhập hàng, theo dõi lịch sử nhập kho từ các nhà cung cấp.
        </p>
      </div>
      <StockImportTable />
    </div>
  )
}
