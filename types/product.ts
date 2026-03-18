// ─── Backend API Response Types (matches SQL Server schema) ──────────────────

export interface BackendProduct {
	id: string;
	productName: string;
	description: string | null;
	imageUrl: string | null;
	currentPrice: number;
	quantity: number;
	categoryId: string;
	categoryName?: string;
	supplierId: string;
	supplierName?: string;
	status: boolean;
	stockStatus?: string;
}

// ─── Admin Product (includes category name from joined data) ────────────────

export interface AdminProduct {
	id: string;
	productName: string;
	description: string | null;
	imageUrl: string | null;
	currentPrice: number;
	quantity: number;
	categoryId: string;
	categoryName?: string;
	supplierId: string;
	supplierName?: string;
	status: boolean;
}

// ─── API Response Wrappers ──────────────────────────────────────────────────

export interface ApiResponse<T> {
	status: number;
	message: string;
	data: T;
}

export interface ApiListResponse<T> {
	status: number;
	message: string;
	data: T[];
}

// ─── Product Create/Update DTO ──────────────────────────────────────────────

export interface ProductCreateDto {
	productName: string;
	description?: string;
	imageUrl?: string;
	currentPrice: number;
	quantity: number;
	supplierId: string;
	categoryId: string;
	status?: boolean;
}

// ─── Product Query Params ───────────────────────────────────────────────────

export interface ProductQueryParams {
	q?: string;
	name?: string;
	categoryId?: string;
	status?: boolean;
	minPrice?: number;
	maxPrice?: number;
	page?: number;
	size?: number;
}

// ─── UI-Ready Product Type ──────────────────────────────────────────────────

export interface Product {
	id: string;
	name: string;
	slug: string;
	price: number;
	originalPrice?: number;
	image: string;
	category: string;
	description?: string;
	badge?: string;
	stockStatus?: string;
	quantity?: number;
}

// ─── Mapper ─────────────────────────────────────────────────────────────────

export function mapBackendProduct(bp: BackendProduct): Product {
	return {
		id: bp.id,
		name: bp.productName,
		slug: bp.id,
		price: bp.currentPrice,
		image: bp.imageUrl || "/products/placeholder.svg",
		category: bp.categoryName ?? "",
		description: bp.description || "",
		stockStatus: bp.stockStatus,
		quantity: bp.quantity,
	};
}
