import { dashboardService } from "@/services/dashboardService"
import type { CategoryStat, DashboardOverview, RevenueDailyResponse, TopProduct } from "@/types/dashboard"

import { create } from "zustand"

interface DashboardStore {
  overview: DashboardOverview | null
  categoryStats: CategoryStat[]
  revenueDaily: RevenueDailyResponse | null
  topProducts: TopProduct[]
  loading: boolean

  fetchOverview: () => Promise<void>
  fetchCategoryStats: () => Promise<void>
  fetchRevenueDaily: () => Promise<void>
  fetchTopProducts: () => Promise<void>
  fetchAll: () => Promise<void>
}

export const useDashboardStore = create<DashboardStore>((set, get) => ({
  overview: null,
  categoryStats: [],
  revenueDaily: null,
  topProducts: [],
  loading: false,

  fetchOverview: async () => {
    try {
      set({ loading: true })
      const data = await dashboardService.getOverview()
      set({ overview: data })
    } catch (error) {
      console.error("Failed to fetch dashboard overview:", error)
    } finally {
      set({ loading: false })
    }
  },

  fetchCategoryStats: async () => {
    try {
      set({ loading: true })
      const data = await dashboardService.getCategoryStats()
      set({ categoryStats: data })
    } catch (error) {
      console.error("Failed to fetch category stats:", error)
    } finally {
      set({ loading: false })
    }
  },

  fetchRevenueDaily: async () => {
    try {
      set({ loading: true })
      const data = await dashboardService.getRevenueDaily()
      set({ revenueDaily: data })
    } catch (error) {
      console.error("Failed to fetch revenue daily:", error)
    } finally {
      set({ loading: false })
    }
  },

  fetchTopProducts: async () => {
    try {
      set({ loading: true })
      const data = await dashboardService.getTopProducts()
      set({ topProducts: data })
    } catch (error) {
      console.error("Failed to fetch top products:", error)
    } finally {
      set({ loading: false })
    }
  },

  fetchAll: async () => {
    try {
      set({ loading: true })
      await Promise.all([
        get().fetchOverview(),
        get().fetchCategoryStats(),
        get().fetchRevenueDaily(),
        get().fetchTopProducts(),
      ])
    } catch (error) {
      console.error("Failed to fetch all dashboard data:", error)
    } finally {
      set({ loading: false })
    }
  },
}))
