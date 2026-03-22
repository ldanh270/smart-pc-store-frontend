export interface CategoryStat {
  name: string
  value: number
}

export interface DashboardOverview {
  totalRevenue: number
  revenueChangePercent: number
  newOrders: number
  ordersChangePercent: number
  newCustomers: number
  customersChangePercent: number
  productsSold: number
  productsSoldChangePercent: number
}

export interface RevenueDailyItem {
  date: string
  revenue: number
  orders: number
}

export interface RevenueDailyResponse {
  days: number
  timezone: string
  totalRevenue: number
  totalOrders: number
  items: RevenueDailyItem[]
}

export interface TopProduct {
  id: string
  productName: string
  slug: string
  imageUrl?: string
  currentPrice: number
  totalSold: number
}
