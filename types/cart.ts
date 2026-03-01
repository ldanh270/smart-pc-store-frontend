export interface CartItem {
  cartItemId: number;
  productId: number;
  productName: string;
  price: number;
  quantity: number;
  subtotal: number;
  stockQuantity: number;
}
