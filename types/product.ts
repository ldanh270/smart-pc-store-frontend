// ─── Backend API Response Types (matches SQL Server schema) ──────────────────

export interface BackendProduct {
	id: number;
	productName: string;
	description: string | null;
	imageUrl: string | null;
	currentPrice: number;
	quantity: number;
	categoryId: number;
	supplierId: number;
	status: boolean;
}

export interface ApiListResponse<T> {
	status: number;
	message: string;
	data: T[];
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
	badge?: string;
}

// ─── Mapper ─────────────────────────────────────────────────────────────────

export function mapBackendProduct(bp: BackendProduct): Product {
	return {
		id: String(bp.id),
		name: bp.productName,
		slug: String(bp.id),
		price: bp.currentPrice,
		image: bp.imageUrl ?? "/products/placeholder.svg",
		category: `Category ${bp.categoryId}`,
	};
}
