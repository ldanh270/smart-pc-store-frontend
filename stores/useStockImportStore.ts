import { stockImportService } from "@/services/stockImportService"
import type {
  StockImport,
  StockImportAdjustDto,
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
  deleteStockImport: (id: string) => Promise<boolean>
  updateStatus: (id: string, status: string) => Promise<boolean>
  adjustStockImport: (id: string, data: StockImportAdjustDto) => Promise<boolean>
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
      console.error("Failed to fetch stock imports:", error)
    } finally {
      set({ loading: false })
    }
  },

  createStockImport: async (data) => {
    try {
      set({ loading: true })
      const result = await stockImportService.createStockImport(data)
      console.log("Create success:", result)
      toast.success("Tạo phiếu nhập hàng thành công!")
      await get().fetchStockImports()
      return true
    } catch (error) {
      console.error("Create failed:", error)
      toast.error("Tạo phiếu nhập hàng thất bại!")
      return false
    } finally {
      set({ loading: false })
    }
  },

  adjustStockImport: async (id, items) => {
    try {
      set({ loading: true })
      await stockImportService.adjustStockImport(id, items)
      toast.success("Tạo phiếu điều chỉnh thành công!")
      await get().fetchStockImports()
      return true
    } catch (error) {
      console.error("Adjust failed:", error)
      toast.error("Tạo phiếu điều chỉnh thất bại!")
      return false
    } finally {
      set({ loading: false })
    }
  },

  updateStockImport: async (id, data) => {
    try {
      set({ loading: true })
      await stockImportService.updateStockImport(id, data)
      toast.success("Cập nhật phiếu nhập hàng thành công!")
      await get().fetchStockImports()
      return true
    } catch {
      toast.error("Cập nhật phiếu nhập hàng thất bại!")
      return false
    } finally {
      set({ loading: false })
    }
  },

  deleteStockImport: async (id) => {
    try {
      set({ loading: true })
      await stockImportService.deleteStockImport(id)
      toast.success("Xóa phiếu nhập hàng thành công!")
      await get().fetchStockImports()
      return true
    } catch {
      toast.error("Xóa phiếu nhập hàng thất bại!")
      return false
    } finally {
      set({ loading: false })
    }
  },

  updateStatus: async (id, status) => {
    try {
      set({ loading: true })
      await stockImportService.updateStatus(id, status)
      toast.success("Cập nhật trạng thái thành công!")
      await get().fetchStockImports()
      return true
    } catch {
      toast.error("Cập nhật trạng thái thất bại!")
      return false
    } finally {
      set({ loading: false })
    }
  },
}))
