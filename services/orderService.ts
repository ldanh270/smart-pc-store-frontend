import api from "@/lib/axios";
import { Order, PaymentQRInfo, TransactionCheckResult, OrderQueryParams, OrderHistoryItem } from "@/types/order";
import { CartItem } from "@/types/cart";

export const orderService = {
  purchase: async (items: CartItem[]): Promise<PaymentQRInfo> => {
    const response = await api.post("/purchase", {
      products: items.map(({ productId, quantity }) => ({ productId, quantity })),
    });
    return response.data;
  },

  cancelOrder: async (orderId: number): Promise<void> => {
    await api.delete(`/orders/${orderId}`);
  },

  checkTransaction: async (txnCode: string): Promise<TransactionCheckResult> => {
    const response = await api.get(`/check-transaction?txnCode=${txnCode}`);
    return response.data;
  },

  getOrders: async (params?: OrderQueryParams): Promise<Order[]> => {
    const response = await api.get("/orders", { params });
    const data = response.data?.data ?? response.data;
    return Array.isArray(data) ? data : [];
  },

  getOrderHistory: async (): Promise<OrderHistoryItem[]> => {
    const response = await api.get("/history");
    const data = response.data?.data ?? response.data;
    return Array.isArray(data) ? data : [];
  },

  updateOrderStatus: async (id: number, status: string): Promise<Order> => {
    const response = await api.put(`/orders/${id}`, { status });
    return response.data?.data ?? response.data;
  },

  deleteOrder: async (orderId: number): Promise<void> => {
    await api.delete(`/orders/${orderId}`);
  },
};
