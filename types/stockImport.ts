// ─── Enums ───────────────────────────────────────────────────────────────────

export type PurchaseOrderStatus = "DRAFT" | "RECEIVED" | "CANCELLED"
export type PurchaseOrderType = "NORMAL" | "ADJUSTMENT" | "IMPORT"

// ─── Backend response shapes ─────────────────────────────────────────────────

export interface BackendPurchaseOrder {
  id: string
  supplierId?: string
  supplierName?: string
  orderDate: string
  expectedDeliveryDate?: string
  createdAt?: string
  status?: PurchaseOrderStatus
  totalAmount: number
  type?: PurchaseOrderType
  note?: string
}

export interface BackendPurchaseOrderDetail extends BackendPurchaseOrder {
  items: {
    id: string
    productId: string
    productName: string
    quantity: number
    unitPrice: number
    lineTotal: number
  }[]
}

// ─── Frontend model ───────────────────────────────────────────────────────────

export interface StockImportItem {
  id?: string
  productId: string
  productName: string
  quantity: number
  unitPrice: number
  totalPrice: number
}

export interface StockImport {
  id: string
  importCode: string
  supplierId: string
  supplierName: string
  expectedDeliveryDate?: string
  status: PurchaseOrderStatus
  totalAmount: number
  type: PurchaseOrderType
  note?: string
  items: StockImportItem[]
  createdAt: string
  orderDate: string
}

// ─── DTOs ─────────────────────────────────────────────────────────────────────

export interface StockImportCreateDto {
  supplierId: string
  expectedDeliveryDate: string
  note?: string
  type?: PurchaseOrderType
  items: {
    productId: string
    quantity: number
    unitPrice: number
  }[]
}

export interface StockImportUpdateDto {
  supplierId?: string
  expectedDeliveryDate?: string
  note?: string
  items?: {
    productId: string
    quantity: number
    unitPrice: number
  }[]
}

export interface StockImportCancelDto {
  reason: string
}

export interface StockImportQueryParams {
  q?: string
  status?: PurchaseOrderStatus
  page?: number
  size?: number
}

// ─── Legacy aliases (kept for backward compat during migration) ───────────────
/** @deprecated use PurchaseOrderStatus */
export type StockImportStatus = PurchaseOrderStatus
