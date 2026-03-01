import { create } from "zustand";
import { toast } from "sonner";
import { cartService } from "@/services/cartService";
import { CartItem } from "@/types/cart";

interface CartState {
  items: CartItem[];
  isLoading: boolean;
  totalItems: number;
  totalPrice: number;
  fetchCart: () => Promise<void>;
  addItem: (productId: number, quantity: number) => Promise<boolean>;
  updateQuantity: (cartItemId: number, quantity: number) => Promise<void>;
  removeItem: (cartItemId: number) => Promise<void>;
  clearCart: () => Promise<void>;
}

function deriveState(items: CartItem[]) {
  return {
    items,
    totalItems: items.reduce((sum, item) => sum + item.quantity, 0),
    totalPrice: items.reduce((sum, item) => sum + item.subtotal, 0),
  };
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  isLoading: false,
  totalItems: 0,
  totalPrice: 0,

  fetchCart: async () => {
    try {
      set({ isLoading: true });
      const items = await cartService.getCart();
      set({ ...deriveState(items), isLoading: false });
    } catch {
      set({ isLoading: false });
    }
  },

  addItem: async (productId, quantity) => {
    try {
      await cartService.addToCart(productId, quantity);
      toast.success("Đã thêm sản phẩm vào giỏ hàng!");
      await get().fetchCart();
      return true;
    } catch {
      toast.error("Không thể thêm sản phẩm vào giỏ hàng");
      return false;
    }
  },

  updateQuantity: async (cartItemId, quantity) => {
    // Optimistic: update UI first
    const prevItems = get().items;
    const optimistic = prevItems.map((item) =>
      item.cartItemId === cartItemId
        ? { ...item, quantity, subtotal: item.price * quantity }
        : item
    );
    set(deriveState(optimistic));

    try {
      await cartService.updateCartItem(cartItemId, quantity);
    } catch {
      // Rollback on error
      set(deriveState(prevItems));
      toast.error("Không thể cập nhật số lượng");
    }
  },

  removeItem: async (cartItemId) => {
    const prevItems = get().items;
    const optimistic = prevItems.filter((item) => item.cartItemId !== cartItemId);
    set(deriveState(optimistic));

    try {
      await cartService.removeCartItem(cartItemId);
      toast.success("Đã xóa sản phẩm khỏi giỏ hàng");
    } catch {
      set(deriveState(prevItems));
      toast.error("Không thể xóa sản phẩm");
    }
  },

  clearCart: async () => {
    const prevItems = get().items;
    set(deriveState([]));

    try {
      await cartService.clearCart();
      toast.success("Đã xóa toàn bộ giỏ hàng");
    } catch {
      set(deriveState(prevItems));
      toast.error("Không thể xóa giỏ hàng");
    }
  },
}));
