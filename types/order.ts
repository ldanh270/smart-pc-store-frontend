export type OrderStatus = "PENDING" | "COMPLETED" | "CANCELLED";

export interface Order {
  id: number;
  orderCode: string;
  amount: number;
  transactionCode: string;
  status: OrderStatus;
  createdAt: string;
}

// For customer-facing order history (UUID ids from /history endpoint)
export interface MyOrder {
  id: string;
  orderCode: string;
  amount: number;
  transactionCode: string;
  status: OrderStatus;
  createdAt: string;
}

export interface OrderItemDetail {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
}

export interface OrderDetailView {
  order: MyOrder;
  items: OrderItemDetail[];
  qrCode?: string;
}

export interface PaymentQRInfo {
  amount: number;
  transactionCode: string;
  qrUrl: string;
}

export interface TransactionCheckResult {
  transactionCode: string;
  status: string;
  completed: boolean;
  message: string;
}

export interface OrderQueryParams {
  status?: OrderStatus;
  page?: number;
  size?: number;
}

export interface OrderUpdateDto {
  status?: OrderStatus;
}
