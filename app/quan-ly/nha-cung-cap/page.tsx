"use client"

import SupplierTable from "@/components/admin/suppliers/SupplierTable"

export default function AdminSuppliersPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Nhà Cung Cấp</h1>
          <p className="text-muted-foreground mt-1">
            Quản lý thông tin các nhà cung cấp sản phẩm cho Smart PC Store.
          </p>
        </div>
      </div>

      {/* Main Table */}
      <SupplierTable />
    </div>
  )
}
