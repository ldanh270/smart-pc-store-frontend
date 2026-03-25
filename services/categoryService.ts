import api from "@/lib/axios"
import {
  type BackendCategory,
  type Category,
  type CategoryCreateDto,
  mapBackendCategory,
} from "@/types/category"
import type { ApiResponse } from "@/types/product"

export const categoryService = {
  /**
   * GET /categories
   */
  getCategories: async (): Promise<Category[]> => {
    const response = await api.get("/categories", { params: { page: 1, size: 100 } })
    const json = response.data
    const arrayData = Array.isArray(json.data)
      ? json.data
      : Array.isArray(json.content)
        ? json.content
        : Array.isArray(json)
          ? json
          : []

    return arrayData.map(mapBackendCategory)
  },

  /**
   * GET /categories/{id}
   */
  getCategory: async (id: string): Promise<Category> => {
    const response = await api.get<ApiResponse<BackendCategory>>(`/categories/${id}`)
    return mapBackendCategory(response.data.data)
  },

  /**
   * POST /categories/create
   */
  createCategory: async (data: CategoryCreateDto): Promise<Category> => {
    const response = await api.post<ApiResponse<BackendCategory>>("/categories/create", data)
    return mapBackendCategory(response.data.data)
  },

  /**
   * PUT /categories/{id}
   */
  updateCategory: async (id: string, data: CategoryCreateDto): Promise<Category> => {
    const response = await api.put(`/categories/${id}`, data)
    const raw = response.data?.data ?? response.data
    return mapBackendCategory(raw)
  },

  /**
   * DELETE /categories/{id}
   */
  deleteCategory: async (id: string): Promise<void> => {
    await api.delete(`/categories/${id}`)
  },
}
