// ─── Backend API Response Types (matches SQL Server schema) ──────────────────

export interface BackendProduct {
  id: string
  productName: string
  slug: string // From backend
  description: string | null
  imageUrl: string | null
  currentPrice: number
  quantity: number
  categoryId: string
  categoryName?: string
  supplierId: string
  supplierName?: string
  status: boolean
  stockStatus?: string
}

// ─── Admin Product (includes category name from joined data) ────────────────

export interface AdminProduct {
  id: string
  productName: string
  slug: string
  description: string | null
  imageUrl: string | null
  currentPrice: number
  quantity: number
  categoryId: string
  categoryName?: string
  supplierId: string
  supplierName?: string
  status: boolean
}

// ─── API Response Wrappers ──────────────────────────────────────────────────

export interface ApiResponse<T> {
  status: number
  message: string
  data: T
}

export interface ApiListResponse<T> {
  status: number
  message: string
  data: T[]
}

// ─── Product Create/Update DTO ──────────────────────────────────────────────

export interface ProductCreateDto {
  productName: string
  description?: string
  imageUrl?: string
  currentPrice: number
  quantity: number
  supplierId: string
  categoryId: string
  status?: boolean
}

// ─── Product Query Params ───────────────────────────────────────────────────

export interface ProductQueryParams {
  q?: string
  name?: string
  categoryId?: string
  status?: boolean
  minPrice?: number
  maxPrice?: number
  page?: number
  size?: number
}

// ─── UI-Ready Product Type ──────────────────────────────────────────────────

export interface Product {
  id: string
  name: string
  slug: string
  price: number
  originalPrice?: number
  image: string
  category: string
  description?: string
  badge?: string
  stockStatus?: string
  quantity?: number
}

// ─── Utils ──────────────────────────────────────────────────────────────────

export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .normalize("NFD") // Separate accents
    .replace(/[\u0300-\u036f]/g, "") // Remove accents
    .replace(/[đĐ]/g, "d")
    .replace(/[^a-z0-9\s-]/g, "") // Remove non-alphanumeric
    .replace(/[\s-]+/g, "-") // Replace spaces/hyphens with a single hyphen
    .replace(/^-+|-+$/g, "") // Remove leading/trailing hyphens
}

// ─── Mapper ─────────────────────────────────────────────────────────────────

export function mapBackendProduct(bp: BackendProduct): Product {
  const name = bp.productName || "Sản phẩm không tên"
  return {
    id: bp.id,
    name: name,
    slug: bp.slug || bp.id, // Direct slug from backend
    price: bp.currentPrice,
    image: bp.imageUrl || "/products/placeholder.svg",
    category: bp.categoryName ?? "Linh kiện",
    description: bp.description || "",
    stockStatus: bp.stockStatus,
    quantity: bp.quantity,
  }
}
