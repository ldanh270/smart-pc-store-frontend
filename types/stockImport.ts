export type StockImportStatus = "PENDING" | "COMPLETED" | "CANCELLED"

export interface BackendPurchaseOrder {
  id: string
  supplierId: string
  supplierName: string
  orderDate: string
  totalAmount: number
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
  status: StockImportStatus
  totalAmount: number
  notes?: string
  items: StockImportItem[]
  createdAt: string
  updatedAt: string
}

export interface StockImportCreateDto {
  supplierId: string
  note?: string
  expectedDeliveryDate: string
  items: {
    productId: string
    quantity: number
    unitPrice: number
  }[]
}

export interface StockImportUpdateDto {
  supplierId?: string
  notes?: string
  status?: StockImportStatus
  items?: {
    productId: string
    quantity: number
    unitPrice: number
  }[]
}

export interface StockImportQueryParams {
  supplierId?: string
  status?: StockImportStatus
  page?: number
  size?: number
}
