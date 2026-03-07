export interface CartItem {
  cartItemId: number;
  productId: string;
  productName: string;
  price: number;
  quantity: number;
  subtotal: number;
  stockQuantity: number;
}
