// ─── Backend API Response Types (matches SQL Server schema) ──────────────────

export interface BackendCategory {
  id: number;
  categoryName: string;
  description: string | null;
  status: boolean;
  parentId?: number | null;
}

export interface Category {
  id: number;
  name: string;
  description: string | null;
  status: boolean;
  parentId?: number | null;
}

export interface CategoryCreateDto {
  categoryName: string;
  description?: string;
  status?: boolean;
}

export function mapBackendCategory(bc: BackendCategory): Category {
  return {
    id: bc.id,
    name: bc.categoryName,
    description: bc.description,
    status: bc.status,
    parentId: bc.parentId ?? null,
  };
}

// ─── Slug Utility ───────────────────────────────────────────────────────────

export function generateCategorySlug(categoryName: string): string {
  return categoryName.trim().toLowerCase().replace(/\s+/g, "-");
}

// ─── Category Detail (with nested products) ─────────────────────────────────

export interface CategoryDetailProduct {
  id: number;
  productName: string;
  description: string | null;
  currentPrice: number;
  quantity: number;
  supplierId: number;
  supplierName: string;
  categoryId: number;
  categoryName: string;
  status: boolean;
  stockStatus: string;
}

export interface BackendCategoryDetail {
  id: number;
  categoryName: string;
  description: string | null;
  status: boolean;
  parentId?: number | null;
  products: CategoryDetailProduct[];
}

export interface CategoryDetail {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  status: boolean;
  parentId?: number | null;
  products: CategoryDetailProduct[];
}

export function mapBackendCategoryDetail(bc: BackendCategoryDetail): CategoryDetail {
  return {
    id: bc.id,
    name: bc.categoryName,
    slug: generateCategorySlug(bc.categoryName),
    description: bc.description,
    status: bc.status,
    parentId: bc.parentId ?? null,
    products: bc.products ?? [],
  };
}
