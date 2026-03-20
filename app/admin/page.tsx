"use client"

import CategoryDonutChart from "@/components/admin/dashboard/CategoryDonutChart"
import RevenueChart from "@/components/admin/dashboard/RevenueChart"
import StatCard from "@/components/admin/dashboard/StatCard"
import TopProducts from "@/components/admin/dashboard/TopProducts"
import VisitorAreaChart from "@/components/admin/dashboard/VisitorAreaChart"
import { Skeleton } from "@/components/ui/skeleton"
import { dashboardService } from "@/services/dashboardService"
import type { DashboardOverview } from "@/types/dashboard"

import { useEffect, useState } from "react"

import { DollarSign, Package, ShoppingCart, Users } from "lucide-react"

export default function AdminDashboardPage() {
  const [data, setData] = useState<DashboardOverview | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchOverview = async () => {
      try {
        const overview = await dashboardService.getOverview()
        setData(overview)
      } catch (error) {
        console.error("Failed to fetch dashboard overview:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchOverview()
  }, [])

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value)
  }

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat("vi-VN").format(value)
  }

  if (loading) {
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
          value={data ? formatCurrency(data.totalRevenue) : "0đ"}
          icon={DollarSign}
          trend={data?.revenueChangePercent ?? 0}
          trendLabel="so với tháng trước"
          description="Đã thanh toán thành công"
        />
        <StatCard
          label="Đơn Hàng Mới"
          value={data ? `+${formatNumber(data.newOrders)}` : "0"}
          icon={ShoppingCart}
          trend={data?.ordersChangePercent ?? 0}
          trendLabel="so với tháng trước"
          description="Đơn hàng mới trong tháng"
        />
        <StatCard
          label="Khách Hàng Mới"
          value={data ? `+${formatNumber(data.newCustomers)}` : "0"}
          icon={Users}
          trend={data?.customersChangePercent ?? 0}
          trendLabel="so với tháng trước"
          description="Tài khoản đăng ký mới"
        />
        <StatCard
          label="Sản Phẩm Đã Bán"
          value={data ? formatNumber(data.productsSold) : "0"}
          icon={Package}
          trend={data?.productsSoldChangePercent ?? 0}
          trendLabel="so với tháng trước"
          description="Tổng số lượng sản phẩm"
        />
      </div>

      {/* Charts Row */}
      <div className="grid gap-4 md:grid-cols-2">
        <RevenueChart />
        <VisitorAreaChart />
      </div>

      {/* Details Row */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <div className="h-full lg:col-span-1">
          <CategoryDonutChart />
        </div>
        <div className="h-full lg:col-span-2">
          <TopProducts />
        </div>
      </div>
    </div>
  )
}
