import { create } from "zustand";
import { toast } from "sonner";
import { orderService } from "@/services/orderService";
import type { Order, OrderQueryParams } from "@/types/order";

interface OrderStore {
  orders: Order[];
  loading: boolean;
  totalOrders: number;
  
  fetchOrders: (params?: OrderQueryParams) => Promise<void>;
  updateOrderStatus: (id: number, status: string) => Promise<boolean>;
  deleteOrder: (id: number) => Promise<boolean>;
}

export const useOrderStore = create<OrderStore>((set, get) => ({
  orders: [],
  loading: false,
  totalOrders: 0,

  fetchOrders: async (params) => {
    try {
      set({ loading: true });
      const data = await orderService.getOrders(params);
      set({ orders: data, totalOrders: data.length });
    } catch (error) {
      console.error("Failed to fetch orders:", error);
      toast.error("Không thể tải danh sách đơn hàng");
    } finally {
      set({ loading: false });
    }
  },

  updateOrderStatus: async (id, status) => {
    try {
      set({ loading: true });
      await orderService.updateOrderStatus(id, status);
      toast.success("Cập nhật trạng thái đơn hàng thành công!");
      await get().fetchOrders();
      return true;
    } catch {
      toast.error("Lỗi khi cập nhật trạng thái đơn hàng");
      return false;
    } finally {
      set({ loading: false });
    }
  },

  deleteOrder: async (id) => {
    try {
      set({ loading: true });
      await orderService.deleteOrder(id);
      toast.success("Xóa/hủy đơn hàng thành công!");
      await get().fetchOrders();
      return true;
    } catch {
      toast.error("Lỗi khi xóa đơn hàng");
      return false;
    } finally {
      set({ loading: false });
    }
  },
}));
