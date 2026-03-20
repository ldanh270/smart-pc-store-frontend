import api from "@/lib/axios"
import { CartItem } from "@/types/cart"
import {
  MyOrder,
  Order,
  OrderDetailView,
  OrderQueryParams,
  PaymentQRInfo,
  TransactionCheckResult,
} from "@/types/order"

export const orderService = {
  purchase: async (items: CartItem[]): Promise<PaymentQRInfo> => {
    const response = await api.post("/purchase", {
      products: items.map(({ productId, quantity }) => ({ productId, quantity })),
    })
    return response.data
  },

  cancelOrder: async (orderId: string): Promise<void> => {
    await api.put(`/orders?id=${orderId}&action=cancel`)
  },

  checkTransaction: async (txnCode: string): Promise<TransactionCheckResult> => {
    const response = await api.get(`/check-transaction?txnCode=${txnCode}`)
    return response.data
  },

  // Admin: get all orders
  getOrders: async (params?: OrderQueryParams): Promise<Order[]> => {
    const response = await api.get("/orders", { params })
    const data = response.data?.data ?? response.data
    return Array.isArray(data) ? data : []
  },

  // Customer: get my orders from /history endpoint
  getMyOrders: async (params?: { page?: number; size?: number }): Promise<MyOrder[]> => {
    const response = await api.get("/history", { params })
    const data = response.data?.data ?? response.data
    return Array.isArray(data) ? data : []
  },

  // Get order detail (order info + items)
  getOrderDetail: async (idOrCode: string): Promise<OrderDetailView> => {
    const response = await api.get(`/orders?id=${idOrCode}&action=view`)
    return response.data?.data ?? response.data
  },

  updateOrderStatus: async (id: number, status: string): Promise<Order> => {
    const response = await api.put(`/orders/${id}`, { status })
    return response.data?.data ?? response.data
  },

  deleteOrder: async (orderId: number): Promise<void> => {
    await api.delete(`/orders/${orderId}`)
  },
}
