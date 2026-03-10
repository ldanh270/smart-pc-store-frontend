export type OrderStatus = "PENDING" | "PAID" | "CANCELLED" | "EXPIRED";

export interface Order {
  id: number;
  orderCode: string;
  amount: number;
  transactionCode: string;
  status: OrderStatus;
  createdAt: string;
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

export interface OrderHistoryItem {
  id: string;
  orderCode: string;
  amount: number;
  transactionCode: string;
  status: OrderStatus;
  createdAt: string;
}
