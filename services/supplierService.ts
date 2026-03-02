import api from "@/lib/axios";
import type { ApiResponse } from "@/types/product"; // re-using if ApiResponse is generic
import type { Supplier, SupplierCreateDto } from "@/types/supplier";

export const supplierService = {
  getSuppliers: async (): Promise<Supplier[]> => {
    const response = await api.get("/suppliers");
    const data = response.data?.data ?? response.data;
    return Array.isArray(data) ? data : [];
  },

  createSupplier: async (data: SupplierCreateDto): Promise<Supplier> => {
    const response = await api.post<ApiResponse<Supplier>>("/suppliers/create", data);
    return response.data.data;
  },

  updateSupplier: async (id: number, data: SupplierCreateDto): Promise<Supplier> => {
    const response = await api.put<ApiResponse<Supplier>>(`/suppliers/${id}`, data);
    return response.data.data;
  },

  deleteSupplier: async (id: number): Promise<void> => {
    await api.delete(`/suppliers/${id}`);
  },
};
