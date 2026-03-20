import api from "@/lib/axios"
import type { ApiResponse } from "@/types/product"
import type {
  BackendPurchaseOrder,
  BackendPurchaseOrderDetail,
  StockImport,
  StockImportCreateDto,
  StockImportQueryParams,
  StockImportUpdateDto,
} from "@/types/stockImport"

export const stockImportService = {
  getStockImports: async (params?: StockImportQueryParams): Promise<StockImport[]> => {
    // Call the new real endpoint
    const response = await api.get("/purchase-orders", { params })
    const data = response.data?.data ?? response.data

    // Explicitly type and map the backend response
    const backendOrders: BackendPurchaseOrder[] = Array.isArray(data) ? data : []

    return backendOrders.map((bo) => {
      // Generate a short PO code from the UUID: e.g. PO-B216B421
      const shortCode = bo.id ? bo.id.substring(0, 8).toUpperCase() : "UNKNOWN"

      return {
        id: bo.id,
        importCode: `PO-${shortCode}`,
        supplierId: bo.supplierId,
        supplierName: bo.supplierName,
        status: "COMPLETED", // Default status, as API doesn't provide it
        totalAmount: bo.totalAmount,
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
      supplierId: boDetail.supplierId,
      supplierName: boDetail.supplierName,
      status: "COMPLETED",
      totalAmount: boDetail.totalAmount,
      items: boDetail.items.map((item) => ({
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
    const response = await api.post<ApiResponse<StockImport>>("/purchase-orders/create", data)
    return response.data.data
  },

  updateStockImport: async (id: string, data: StockImportUpdateDto): Promise<StockImport> => {
    const response = await api.put<ApiResponse<StockImport>>(`/stock-imports/${id}`, data)
    return response.data.data
  },

  deleteStockImport: async (id: string): Promise<void> => {
    await api.delete(`/stock-imports/${id}`)
  },

  updateStatus: async (id: string, status: string): Promise<StockImport> => {
    const response = await api.patch<ApiResponse<StockImport>>(`/stock-imports/${id}/status`, {
      status,
    })
    return response.data.data
  },
}
