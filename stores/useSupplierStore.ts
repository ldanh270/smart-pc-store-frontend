import { supplierService } from "@/services/supplierService"
import type { Supplier, SupplierCreateDto } from "@/types/supplier"

import { toast } from "sonner"
import { create } from "zustand"

interface SupplierStore {
  suppliers: Supplier[]
  loading: boolean

  fetchSuppliers: () => Promise<void>
  createSupplier: (data: SupplierCreateDto) => Promise<boolean>
  updateSupplier: (id: string, data: SupplierCreateDto) => Promise<boolean>
  deleteSupplier: (id: string) => Promise<boolean>
}

export const useSupplierStore = create<SupplierStore>((set, get) => ({
  suppliers: [],
  loading: false,

  fetchSuppliers: async () => {
    try {
      set({ loading: true })
      const data = await supplierService.getSuppliers()
      set({ suppliers: data })
    } catch (error) {
      console.error("Failed to fetch suppliers:", error)
    } finally {
      set({ loading: false })
    }
  },

  createSupplier: async (data) => {
    try {
      set({ loading: true })
      await supplierService.createSupplier(data)
      toast.success("Thêm nhà cung cấp thành công!")
      await get().fetchSuppliers()
      return true
    } catch {
      return false
    } finally {
      set({ loading: false })
    }
  },

  updateSupplier: async (id: string, data) => {
    try {
      set({ loading: true })
      await supplierService.updateSupplier(id, data)
      toast.success("Cập nhật nhà cung cấp thành công!")
      await get().fetchSuppliers()
      return true
    } catch {
      return false
    } finally {
      set({ loading: false })
    }
  },

  deleteSupplier: async (id: string) => {
    try {
      set({ loading: true })
      await supplierService.deleteSupplier(id)
      toast.success("Xóa nhà cung cấp thành công!")
      await get().fetchSuppliers()
      return true
    } catch {
      return false
    } finally {
      set({ loading: false })
    }
  },
}))
