"use client";

import ProductTable from "@/components/admin/products/ProductTable";

export default function AdminProductsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Sản Phẩm</h1>
          <p className="text-muted-foreground mt-1">
            Quản lý danh sách sản phẩm, giá cả và số lượng tồn kho.
          </p>
        </div>
      </div>

      {/* Main Table */}
      <ProductTable />
    </div>
  );
}
