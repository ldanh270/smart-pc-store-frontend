import api from "@/lib/axios";
import { Order, PaymentQRInfo, TransactionCheckResult } from "@/types/order";
import { CartItem } from "@/types/cart";

export const orderService = {
  createOrder: async (items: CartItem[]): Promise<Order> => {
    const response = await api.post("/orders/create", {
      items: items.map(({ productId, quantity }) => ({ productId, quantity })),
    });
    return response.data;
  },

  cancelOrder: async (orderId: number): Promise<void> => {
    await api.delete(`/orders/${orderId}`);
  },

  getPaymentQR: async (orderId: number): Promise<PaymentQRInfo> => {
    const response = await api.get(`/payment/qr?orderId=${orderId}`);
    return response.data;
  },

  checkTransaction: async (txnCode: string): Promise<TransactionCheckResult> => {
    const response = await api.get(`/check-transaction?txnCode=${txnCode}`);
    return response.data;
  },
};
