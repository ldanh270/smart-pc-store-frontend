import api from "@/lib/axios";
import type {
	AdminProduct,
	ApiResponse,
	ProductCreateDto,
	ProductQueryParams,
} from "@/types/product";

export const productService = {
	/**
	 * GET /products — list with optional search, filters, pagination
	 */
	getProducts: async (
		params?: ProductQueryParams,
	): Promise<AdminProduct[]> => {
		const response = await api.get("/products", { params });
		// Handle both ApiResponse<T[]> wrapper and direct array response
		const data = response.data?.data ?? response.data;
		return Array.isArray(data) ? data : [];
	},

	/**
	 * GET /products/{id} — single product detail
	 */
	getProduct: async (id: string): Promise<AdminProduct> => {
		const response = await api.get(`/products/${id}`);
		return response.data?.data ?? response.data;
	},

	/**
	 * POST /products/create — create new product
	 */
	createProduct: async (data: ProductCreateDto): Promise<AdminProduct> => {
		const response = await api.post<ApiResponse<AdminProduct>>(
			"/products/create",
			data,
		);
		return response.data.data;
	},

	/**
	 * PUT /products/{id} — update product
	 */
	updateProduct: async (
		id: string,
		data: ProductCreateDto,
	): Promise<AdminProduct> => {
		const response = await api.put<ApiResponse<AdminProduct>>(
			`/products/${id}`,
			data,
		);
		return response.data.data;
	},

	/**
	 * DELETE /products/{id} — soft delete (status = false)
	 */
	deleteProduct: async (id: string): Promise<void> => {
		await api.delete(`/products/${id}`);
	},
};
