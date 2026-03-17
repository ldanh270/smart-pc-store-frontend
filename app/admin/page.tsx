import { Package, ShoppingCart, Users, DollarSign } from "lucide-react";
import StatCard from "@/components/admin/dashboard/StatCard";
import RevenueChart from "@/components/admin/dashboard/RevenueChart";
import VisitorAreaChart from "@/components/admin/dashboard/VisitorAreaChart";
import CategoryDonutChart from "@/components/admin/dashboard/CategoryDonutChart";
import TopProducts from "@/components/admin/dashboard/TopProducts";
import RecentOrders from "@/components/admin/dashboard/RecentOrders";

export default function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Tổng Quan</h1>
        <p className="text-muted-foreground mt-1">
          Theo dõi hoạt động kinh doanh của cửa hàng.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Tổng Doanh Thu"
          value="452.000.000đ"
          icon={DollarSign}
          trend={12.5}
          trendLabel="so với tháng trước"
          description="Đã thanh toán thành công"
        />
        <StatCard
          label="Đơn Hàng Mới"
          value="+350"
          icon={ShoppingCart}
          trend={8.2}
          trendLabel="so với tháng trước"
          description="Đơn hàng đang xử lý"
        />
        <StatCard
          label="Khách Hàng Mới"
          value="+12"
          icon={Users}
          trend={-2.4}
          trendLabel="so với tháng trước"
          description="Tài khoản đăng ký mới"
        />
        <StatCard
          label="Sản Phẩm Đã Bán"
          value="1,234"
          icon={Package}
          trend={18.5}
          trendLabel="so với tháng trước"
          description="Tổng số lượng"
        />
      </div>

      {/* Charts Row */}
      <div className="grid gap-4 md:grid-cols-2">
        <RevenueChart />
        <VisitorAreaChart />
      </div>

      {/* Details Row */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <div className="lg:col-span-1 h-full">
          <CategoryDonutChart />
        </div>
        <div className="lg:col-span-2 h-full">
          <TopProducts />
        </div>
      </div>

      {/* Recent Orders */}
      <div>
        <RecentOrders />
      </div>
    </div>
  );
}
