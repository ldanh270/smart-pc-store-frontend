import {
	type BackendProduct,
	type Product,
	mapBackendProduct,
} from "@/types/product";
import { buildApiUrl } from "./base-url";

// ─── Fetch Products (Server-Side) ───────────────────────────────────────────

interface FetchProductsParams {
	name?: string;
	categoryId?: string;
	status?: boolean;
	minPrice?: number;
	maxPrice?: number;
	page?: number;
	size?: number;
	sort?: string;
}

export async function fetchProducts(
	params?: FetchProductsParams
): Promise<Product[]> {
	const url = new URL(buildApiUrl("/products"));

	if (params) {
		if (params.name) url.searchParams.set("name", params.name);
		if (params.categoryId !== undefined)
			url.searchParams.set("categoryId", String(params.categoryId));
		if (params.status !== undefined)
			url.searchParams.set("status", String(params.status));
		if (params.minPrice !== undefined)
			url.searchParams.set("minPrice", String(params.minPrice));
		if (params.maxPrice !== undefined)
			url.searchParams.set("maxPrice", String(params.maxPrice));
		if (params.page !== undefined)
			url.searchParams.set("page", String(params.page));
		if (params.size !== undefined)
			url.searchParams.set("size", String(params.size));
		if (params.sort !== undefined)
			url.searchParams.set("sort", params.sort);
	}

	try {
		const res = await fetch(url.toString(), {
			next: { revalidate: 60 }, // ISR: revalidate every 60 seconds
		});

		if (!res.ok) {
			console.error(`Failed to fetch products: ${res.status}`);
			return [];
		}

		const json = await res.json();

		// Handle all common response shapes:
		// { data: [...] }            — wrapped array
		// { data: { content: [...] } }  — wrapped paginated (Spring)
		// { content: [...] }          — Spring Page without wrapper
		// [...]                       — direct array
		const products: BackendProduct[] =
			Array.isArray(json.data) ? json.data
			: Array.isArray(json.data?.content) ? json.data.content
			: Array.isArray(json.content) ? json.content
			: Array.isArray(json) ? json
			: [];

		return products.map((bp) => mapBackendProduct(bp));
	} catch (error) {
		console.error("Error fetching products:", error);
		return [];
	}
}

// ─── Fetch Single Product (Server-Side) ─────────────────────────────────────

export async function fetchProductById(
	id: string
): Promise<BackendProduct | null> {
	try {
		const res = await fetch(buildApiUrl(`/products/${id}`), {
			next: { revalidate: 60 },
		});

		if (!res.ok) {
			console.error(`Failed to fetch product ${id}: ${res.status}`);
			return null;
		}

		const json = await res.json();

		// Handle: { data: {...} } or direct object
		const product: BackendProduct | null = json.data ?? json ?? null;
		return product;
	} catch (error) {
		console.error("Error fetching product:", error);
		return null;
	}
}
