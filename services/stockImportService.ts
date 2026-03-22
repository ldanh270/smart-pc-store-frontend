import api from "@/lib/axios"
import type { ApiResponse } from "@/types/product"
import type {
  BackendPurchaseOrder,
  BackendPurchaseOrderDetail,
  StockImportAdjustDto,
  StockImport,
  StockImportCreateDto,
  StockImportQueryParams,
  StockImportUpdateDto,
} from "@/types/stockImport"

export const stockImportService = {
  getStockImports: async (params?: StockImportQueryParams): Promise<StockImport[]> => {
    // Add timestamp to bypass cache if needed
    const queryParams = { ...params, _t: Date.now() }
    const response = await api.get("/purchase-orders", { params: queryParams })
    const data = response.data?.data ?? response.data

    // Explicitly type and map the backend response
    const backendOrders: BackendPurchaseOrder[] = Array.isArray(data) ? data : []

    return backendOrders.map((bo) => {
      // Generate a short PO code from the UUID: e.g. PO-B216B421
      const shortCode = bo.id ? bo.id.substring(0, 8).toUpperCase() : "UNKNOWN"

      return {
        id: bo.id,
        importCode: `PO-${shortCode}`,
        supplierId: bo.supplierId || "N/A",
        supplierName: bo.supplierName || "N/A",
        status: "COMPLETED", // Default status, as API doesn't provide it
        totalAmount: bo.totalAmount,
        type: bo.type || "NORMAL",
        items: [], // API list doesn't return items
        createdAt: bo.orderDate, // Map orderDate to createdAt
        updatedAt: bo.orderDate, // Map orderDate to updatedAt
      }
    })
  },

  getStockImport: async (id: string): Promise<StockImport> => {
    const response = await api.get(`/purchase-orders/${id}`)
    const data = response.data?.data ?? response.data
    const boDetail = data as BackendPurchaseOrderDetail

    const shortCode = boDetail.id ? boDetail.id.substring(0, 8).toUpperCase() : "UNKNOWN"

    return {
      id: boDetail.id,
      importCode: `PO-${shortCode}`,
      supplierId: boDetail.supplierId || "N/A",
      supplierName: boDetail.supplierName || "N/A",
      status: "COMPLETED",
      totalAmount: boDetail.totalAmount,
      type: boDetail.type || "NORMAL",
      items: (boDetail.items || []).map((item) => ({
        id: item.id,
        productId: item.productId,
        productName: item.productName,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        totalPrice: item.lineTotal,
      })),
      createdAt: boDetail.orderDate,
      updatedAt: boDetail.orderDate,
    }
  },

  createStockImport: async (data: StockImportCreateDto): Promise<StockImport> => {
    // Đảm bảo dùng đúng endpoint /purchase-orders/create
    const response = await api.post("/purchase-orders/create", data)
    const boDetail = (response.data?.data ?? response.data) as BackendPurchaseOrderDetail

    const shortCode = boDetail.id ? boDetail.id.substring(0, 8).toUpperCase() : "UNKNOWN"

    return {
      id: boDetail.id,
      importCode: `PO-${shortCode}`,
      supplierId: boDetail.supplierId || "N/A",
      supplierName: boDetail.supplierName || "N/A",
      status: "COMPLETED",
      totalAmount: boDetail.totalAmount,
      type: boDetail.type || "NORMAL",
      items: (boDetail.items || []).map((item) => ({
        id: item.id,
        productId: item.productId,
        productName: item.productName,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        totalPrice: item.lineTotal,
      })),
      createdAt: boDetail.orderDate,
      updatedAt: boDetail.orderDate,
    }
  },

  adjustStockImport: async (id: string, data: StockImportAdjustDto): Promise<StockImport> => {
    // Chỉ gửi mảng items theo đúng yêu cầu backend
    const response = await api.post(`/purchase-orders/${id}/adjust`, data)
    const boDetail = (response.data?.data ?? response.data) as BackendPurchaseOrderDetail

    const shortCode = boDetail.id ? boDetail.id.substring(0, 8).toUpperCase() : "UNKNOWN"

    return {
      id: boDetail.id,
      importCode: `PO-${shortCode}`,
      supplierId: boDetail.supplierId || "N/A",
      supplierName: boDetail.supplierName || "N/A",
      status: "COMPLETED",
      totalAmount: boDetail.totalAmount,
      type: boDetail.type || "ADJUSTMENT",
      items: (boDetail.items || []).map((item) => ({
        id: item.id,
        productId: item.productId,
        productName: item.productName,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        totalPrice: item.lineTotal,
      })),
      createdAt: boDetail.orderDate,
      updatedAt: boDetail.orderDate,
    }
  },

  updateStockImport: async (id: string, data: StockImportUpdateDto): Promise<StockImport> => {
    const response = await api.put<ApiResponse<StockImport>>(`/purchase-orders/${id}`, data)
    return response.data.data
  },

  deleteStockImport: async (id: string): Promise<void> => {
    await api.delete(`/purchase-orders/${id}`)
  },

  updateStatus: async (id: string, status: string): Promise<StockImport> => {
    const response = await api.patch<ApiResponse<StockImport>>(`/purchase-orders/${id}/status`, {
      status,
    })
    return response.data.data
  },
}
