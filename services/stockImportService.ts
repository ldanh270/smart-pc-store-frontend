import api from "@/lib/axios"
import type {
  BackendPurchaseOrder,
  BackendPurchaseOrderDetail,
  PurchaseOrderStatus,
  StockImport,
  StockImportCancelDto,
  StockImportCreateDto,
  StockImportQueryParams,
  StockImportUpdateDto,
} from "@/types/stockImport"

// ─── Mapper ──────────────────────────────────────────────────────────────────

function mapDetail(boDetail: BackendPurchaseOrderDetail): StockImport {
  const shortCode = boDetail.id ? boDetail.id.substring(0, 8).toUpperCase() : "UNKNOWN"
  return {
    id: boDetail.id,
    importCode: `PO-${shortCode}`,
    supplierId: boDetail.supplierId || "N/A",
    supplierName: boDetail.supplierName || "N/A",
    expectedDeliveryDate: boDetail.expectedDeliveryDate,
    status: (boDetail.status as PurchaseOrderStatus) ?? "DRAFT",
    totalAmount: boDetail.totalAmount ?? 0,
    type: boDetail.type || "NORMAL",
    note: boDetail.note,
    items: (boDetail.items || []).map((item) => ({
      id: item.id,
      productId: item.productId,
      productName: item.productName,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      totalPrice: item.lineTotal,
    })),
    createdAt: boDetail.createdAt || boDetail.orderDate,
    orderDate: boDetail.orderDate,
  }
}

function mapList(bo: BackendPurchaseOrder): StockImport {
  const shortCode = bo.id ? bo.id.substring(0, 8).toUpperCase() : "UNKNOWN"
  return {
    id: bo.id,
    importCode: `PO-${shortCode}`,
    supplierId: bo.supplierId || "N/A",
    supplierName: bo.supplierName || "N/A",
    expectedDeliveryDate: bo.expectedDeliveryDate,
    status: (bo.status as PurchaseOrderStatus) ?? "DRAFT",
    totalAmount: bo.totalAmount ?? 0,
    type: bo.type || "NORMAL",
    note: bo.note,
    items: [],
    createdAt: bo.createdAt || bo.orderDate,
    orderDate: bo.orderDate,
  }
}

// ─── Service ─────────────────────────────────────────────────────────────────

export const stockImportService = {
  /** GET /purchase-orders */
  getStockImports: async (params?: StockImportQueryParams): Promise<StockImport[]> => {
    const response = await api.get("/purchase-orders", { params })
    const data = response.data?.data ?? response.data
    const list: BackendPurchaseOrder[] = Array.isArray(data) ? data : []
    return list.map(mapList)
  },

  /** GET /purchase-orders/:id */
  getStockImport: async (id: string): Promise<StockImport> => {
    const response = await api.get(`/purchase-orders/${id}`)
    const data = response.data?.data ?? response.data
    return mapDetail(data as BackendPurchaseOrderDetail)
  },

  /** POST /purchase-orders/create → status = DRAFT */
  createStockImport: async (data: StockImportCreateDto): Promise<StockImport> => {
    const response = await api.post("/purchase-orders/create", data)
    const body = response.data?.data ?? response.data
    return mapDetail(body as BackendPurchaseOrderDetail)
  },

  /** PUT /purchase-orders/:id — only allowed when status = DRAFT */
  updateStockImport: async (id: string, data: StockImportUpdateDto): Promise<StockImport> => {
    const response = await api.put(`/purchase-orders/${id}`, data)
    const body = response.data?.data ?? response.data
    return mapDetail(body as BackendPurchaseOrderDetail)
  },

  /** POST /purchase-orders/:id/receive — DRAFT → RECEIVED, updates stock */
  receivePurchaseOrder: async (id: string): Promise<StockImport> => {
    const response = await api.post(`/purchase-orders/${id}/receive`, {})
    const body = response.data?.data ?? response.data
    return mapDetail(body as BackendPurchaseOrderDetail)
  },

  /** PUT /purchase-orders/:id/cancel — DRAFT → CANCELLED */
  cancelPurchaseOrder: async (id: string, dto: StockImportCancelDto): Promise<StockImport> => {
    const response = await api.put(`/purchase-orders/${id}/cancel`, dto)
    const body = response.data?.data ?? response.data
    return mapDetail(body as BackendPurchaseOrderDetail)
  },
}
