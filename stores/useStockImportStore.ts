import { stockImportService } from "@/services/stockImportService"
import type {
  PurchaseOrderStatus,
  StockImport,
  StockImportCancelDto,
  StockImportCreateDto,
  StockImportQueryParams,
  StockImportUpdateDto,
} from "@/types/stockImport"

import { toast } from "sonner"
import { create } from "zustand"

interface StockImportStore {
  stockImports: StockImport[]
  loading: boolean

  fetchStockImports: (params?: StockImportQueryParams) => Promise<void>
  createStockImport: (data: StockImportCreateDto) => Promise<boolean>
  updateStockImport: (id: string, data: StockImportUpdateDto) => Promise<boolean>
  receivePurchaseOrder: (id: string) => Promise<boolean>
  cancelPurchaseOrder: (id: string, dto: StockImportCancelDto) => Promise<boolean>
}

/** Replace a single record in the list by id */
function replaceById(list: StockImport[], updated: StockImport): StockImport[] {
  return list.map((imp) => (imp.id === updated.id ? updated : imp))
}

export const useStockImportStore = create<StockImportStore>((set, get) => ({
  stockImports: [],
  loading: false,

  fetchStockImports: async (params?) => {
    try {
      set({ loading: true })
      const data = await stockImportService.getStockImports(params)
      set({ stockImports: data })
    } catch (error) {
      console.error("Failed to fetch purchase orders:", error)
    } finally {
      set({ loading: false })
    }
  },

  createStockImport: async (data) => {
    set({ loading: true })
    try {
      const result = await stockImportService.createStockImport(data)
      set((state) => ({
        loading: false,
        stockImports: [result, ...state.stockImports],
      }))
      await get().fetchStockImports() // Auto-reload to ensure server consistency
      toast.success("Tạo phiếu đặt hàng thành công! (Trạng thái: Nháp)")
      return true
    } catch (error) {
      console.error("Create failed:", error)
      set({ loading: false })
      toast.error("Tạo phiếu đặt hàng thất bại!")
      return false
    }
  },

  updateStockImport: async (id, data) => {
    set({ loading: true })
    try {
      const result = await stockImportService.updateStockImport(id, data)
      set((state) => ({
        loading: false,
        stockImports: replaceById(state.stockImports, result),
      }))
      await get().fetchStockImports() // Auto-reload
      toast.success("Cập nhật phiếu đặt hàng thành công!")
      return true
    } catch (error: unknown) {
      set({ loading: false })
      const msg = (error as { response?: { data?: { message?: string } } })?.response?.data?.message
      toast.error(msg || "Cập nhật phiếu đặt hàng thất bại!")
      return false
    }
  },

  receivePurchaseOrder: async (id) => {
    set({ loading: true })
    try {
      const result = await stockImportService.receivePurchaseOrder(id)
      set((state) => ({
        loading: false,
        stockImports: replaceById(state.stockImports, result),
      }))
      await get().fetchStockImports() // Auto-reload
      toast.success("Nhập kho thành công! Tồn kho đã được cập nhật.")
      return true
    } catch (error: unknown) {
      set({ loading: false })
      const msg = (error as { response?: { data?: { message?: string } } })?.response?.data?.message
      toast.error(msg || "Nhập kho thất bại!")
      return false
    }
  },

  cancelPurchaseOrder: async (id, dto) => {
    set({ loading: true })
    try {
      const result = await stockImportService.cancelPurchaseOrder(id, dto)
      set((state) => ({
        loading: false,
        stockImports: replaceById(state.stockImports, result),
      }))
      await get().fetchStockImports() // Auto-reload
      toast.success("Hủy phiếu đặt hàng thành công!")
      return true
    } catch (error: unknown) {
      set({ loading: false })
      const msg = (error as { response?: { data?: { message?: string } } })?.response?.data?.message
      toast.error(msg || "Hủy phiếu thất bại!")
      return false
    }
  },
}))

/** @deprecated use PurchaseOrderStatus */
export type { PurchaseOrderStatus as StockImportStatus }
