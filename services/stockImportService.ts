import api from "@/lib/axios";
import type { ApiResponse } from "@/types/product";
import type {
  StockImport,
  StockImportCreateDto,
  StockImportUpdateDto,
  StockImportQueryParams,
} from "@/types/stockImport";

export const stockImportService = {
  getStockImports: async (params?: StockImportQueryParams): Promise<StockImport[]> => {
    const response = await api.get("/stock-imports", { params });
    const data = response.data?.data ?? response.data;
    return Array.isArray(data) ? data : [];
  },

  getStockImport: async (id: string): Promise<StockImport> => {
    const response = await api.get<ApiResponse<StockImport>>(`/stock-imports/${id}`);
    return response.data.data;
  },

  createStockImport: async (data: StockImportCreateDto): Promise<StockImport> => {
    const response = await api.post<ApiResponse<StockImport>>("/stock-imports", data);
    return response.data.data;
  },

  updateStockImport: async (id: string, data: StockImportUpdateDto): Promise<StockImport> => {
    const response = await api.put<ApiResponse<StockImport>>(`/stock-imports/${id}`, data);
    return response.data.data;
  },

  deleteStockImport: async (id: string): Promise<void> => {
    await api.delete(`/stock-imports/${id}`);
  },

  updateStatus: async (id: string, status: string): Promise<StockImport> => {
    const response = await api.patch<ApiResponse<StockImport>>(`/stock-imports/${id}/status`, { status });
    return response.data.data;
  },
};
