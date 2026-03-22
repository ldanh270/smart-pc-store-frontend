"use client"

import CategoryDonutChart from "@/components/admin/dashboard/CategoryDonutChart"
import RevenueChart from "@/components/admin/dashboard/RevenueChart"
import StatCard from "@/components/admin/dashboard/StatCard"
import TopProducts from "@/components/admin/dashboard/TopProducts"
import { Skeleton } from "@/components/ui/skeleton"
import { useDashboardStore } from "@/stores/useDashboardStore"

import { useEffect } from "react"

import { DollarSign, Package, ShoppingCart, Users } from "lucide-react"

export default function AdminDashboardPage() {
  const { overview, revenueDaily, loading, fetchAll } = useDashboardStore()

  useEffect(() => {
    fetchAll()
  }, [fetchAll])

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value)
  }

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat("vi-VN").format(value)
  }

  if (loading && !overview) {
    return (
      <div className="space-y-6">
        <div>
          <Skeleton className="h-10 w-48" />
          <Skeleton className="mt-2 h-4 w-64" />
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-32 w-full" />
          ))}
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <Skeleton className="h-80 w-full" />
          <Skeleton className="h-80 w-full" />
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Tổng Quan</h1>
        <p className="text-muted-foreground mt-1">Theo dõi hoạt động kinh doanh của cửa hàng.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Tổng Doanh Thu"
          value={overview ? formatCurrency(overview.totalRevenue) : "0đ"}
          icon={DollarSign}
          trend={overview?.revenueChangePercent ?? 0}
          trendLabel="so với tháng trước"
          description="Đã thanh toán thành công"
        />
        <StatCard
          label="Đơn Hàng Mới"
          value={overview ? `+${formatNumber(overview.newOrders)}` : "0"}
          icon={ShoppingCart}
          trend={overview?.ordersChangePercent ?? 0}
          trendLabel="so với tháng trước"
          description="Đơn hàng mới trong tháng"
        />
        <StatCard
          label="Khách Hàng Mới"
          value={overview ? `+${formatNumber(overview.newCustomers)}` : "0"}
          icon={Users}
          trend={overview?.customersChangePercent ?? 0}
          trendLabel="so với tháng trước"
          description="Tài khoản đăng ký mới"
        />
        <StatCard
          label="Sản Phẩm Đã Bán"
          value={overview ? formatNumber(overview.productsSold) : "0"}
          icon={Package}
          trend={overview?.productsSoldChangePercent ?? 0}
          trendLabel="so với tháng trước"
          description="Tổng số lượng sản phẩm"
        />
      </div>

      {/* Charts Row */}
      <div className="grid h-fit gap-4 md:grid-cols-10">
        <RevenueChart data={revenueDaily} className="col-span-7 h-fit w-full" />
        <div className="col-span-3 flex h-full flex-col gap-4">
          <CategoryDonutChart className="h-full w-full" />
          <TopProducts className="h-full w-full" />
        </div>
      </div>
    </div>
  )
}
