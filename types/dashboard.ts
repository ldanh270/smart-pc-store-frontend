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
