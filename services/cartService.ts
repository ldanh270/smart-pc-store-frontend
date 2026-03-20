import api from "@/lib/axios"
import { CartItem } from "@/types/cart"

export const cartService = {
  getCart: async (): Promise<CartItem[]> => {
    const response = await api.get("/cart")
    return response.data
  },

  addToCart: async (productId: string, quantity: number): Promise<string> => {
    const response = await api.post("/cart/add", { productId, quantity })
    return response.data
  },

  updateCartItem: async (cartItemId: number, quantity: number): Promise<string> => {
    const response = await api.put(`/cart/items/${cartItemId}`, { quantity })
    return response.data
  },

  removeCartItem: async (cartItemId: number): Promise<string> => {
    const response = await api.delete(`/cart/items/${cartItemId}`)
    return response.data
  },

  clearCart: async (): Promise<string> => {
    const response = await api.delete("/cart")
    return response.data
  },
}
