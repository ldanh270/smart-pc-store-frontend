import api from "@/lib/axios"
import type { ApiResponse } from "@/types/product"
// re-using if ApiResponse is generic
import type { BackendSupplier, Supplier, SupplierCreateDto } from "@/types/supplier"

export const supplierService = {
  getSuppliers: async (): Promise<Supplier[]> => {
    const response = await api.get("/suppliers", { params: { page: 1, size: 100 } })
    const data = response.data?.data ?? response.data
    const backendSuppliers: BackendSupplier[] = Array.isArray(data) ? data : []

    return backendSuppliers.map((bs) => {
      let phone = ""
      let email = ""

      // Parse "0909000001 - a2@test.com" or "contact@intel.com" or "N/A"
      if (bs.contactInfo && bs.contactInfo !== "N/A") {
        const parts = bs.contactInfo.split(" - ")
        if (parts.length === 2) {
          phone = parts[0].trim()
          email = parts[1].trim()
        } else if (bs.contactInfo.includes("@")) {
          email = bs.contactInfo.trim()
        } else {
          phone = bs.contactInfo.trim()
        }
      }

      return {
        id: bs.id,
        name: bs.supplierName,
        email: email || undefined,
        phone: phone || undefined,
        status: bs.status,
        createdAt: new Date().toISOString(), // Mocking dates if BE doesn't provide them
        updatedAt: new Date().toISOString(),
      }
    })
  },

  createSupplier: async (data: SupplierCreateDto): Promise<Supplier> => {
    const response = await api.post<ApiResponse<Supplier>>("/suppliers/create", data)
    return response.data.data
  },

  updateSupplier: async (id: string, data: SupplierCreateDto): Promise<Supplier> => {
    const response = await api.put<ApiResponse<Supplier>>(`/suppliers/${id}`, data)
    return response.data.data
  },

  deleteSupplier: async (id: string): Promise<void> => {
    await api.delete(`/suppliers/${id}`)
  },
}
