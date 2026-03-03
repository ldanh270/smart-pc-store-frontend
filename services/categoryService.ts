import api from "@/lib/axios";
import { type Category, type CategoryCreateDto, mapBackendCategory, type BackendCategory } from "@/types/category";
import type { ApiResponse } from "@/types/product";

export const categoryService = {
  /**
   * GET /categories
   */
  getCategories: async (): Promise<Category[]> => {
    const response = await api.get("/categories");
    const data = response.data?.data ?? response.data;
    const arrayData = Array.isArray(data) ? data : [];
    return arrayData.map(mapBackendCategory);
  },

  /**
   * GET /categories/{id}
   */
  getCategory: async (id: number): Promise<Category> => {
    const response = await api.get<ApiResponse<BackendCategory>>(`/categories/${id}`);
    return mapBackendCategory(response.data.data);
  },

  /**
   * POST /categories/create
   */
  createCategory: async (data: CategoryCreateDto): Promise<Category> => {
    const response = await api.post<ApiResponse<BackendCategory>>("/categories/create", data);
    return mapBackendCategory(response.data.data);
  },

  /**
   * PUT /categories/{id}
   */
  updateCategory: async (id: number, data: CategoryCreateDto): Promise<Category> => {
    const response = await api.put<ApiResponse<BackendCategory>>(`/categories/${id}`, data);
    return mapBackendCategory(response.data.data);
  },

  /**
   * DELETE /categories/{id}
   */
  deleteCategory: async (id: number): Promise<void> => {
    await api.delete(`/categories/${id}`);
  },
};
