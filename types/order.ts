export type OrderStatus = "PENDING" | "COMPLETED" | "CANCELLED";

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
  found: boolean;
  message: string;
}
