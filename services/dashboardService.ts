import api from "@/lib/axios"
import type { DashboardOverview } from "@/types/dashboard"

export const dashboardService = {
  getOverview: async (): Promise<DashboardOverview> => {
    const response = await api.get("/dashboard/overview")
    return response.data?.data ?? response.data
  },
}
