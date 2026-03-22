import api from "@/lib/axios"
import type { CategoryStat, DashboardOverview, RevenueDailyResponse, TopProduct } from "@/types/dashboard"

export const dashboardService = {
  getOverview: async (): Promise<DashboardOverview> => {
    const response = await api.get("/dashboard/overview")
    return response.data?.data ?? response.data
  },

  getCategoryStats: async (): Promise<CategoryStat[]> => {
    const response = await api.get("/dashboard/category-stats")
    return response.data?.data ?? response.data
  },

  getRevenueDaily: async (): Promise<RevenueDailyResponse> => {
    const response = await api.get("/dashboard/revenue-daily")
    return response.data?.data ?? response.data
  },

  getTopProducts: async (): Promise<TopProduct[]> => {
    const response = await api.get("/dashboard/top-products")
    return response.data?.data ?? response.data
  },
}
