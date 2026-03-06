"use client";

import OrderTable from "@/components/admin/orders/OrderTable";

export default function AdminOrdersPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Đơn Hàng</h1>
          <p className="text-muted-foreground mt-1">
            Quản lý danh sách đơn hàng và trạng thái xử lý thành toán của khách hàng.
          </p>
        </div>
      </div>

      {/* Main Table */}
      <OrderTable />
    </div>
  );
}
