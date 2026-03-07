// ─── Backend API Response Types (matches SQL Server schema) ──────────────────

export interface BackendCategory {
  id: string;
  categoryName: string;
  description: string | null;
  status: boolean;
  parentId?: string | null;
}

export interface Category {
  id: string;
  name: string;
  description: string | null;
  status: boolean;
  parentId?: string | null;
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
  id: string;
  productName: string;
  description: string | null;
  currentPrice: number;
  quantity: number;
  supplierId: string;
  supplierName: string;
  categoryId: string;
  categoryName: string;
  status: boolean;
  stockStatus: string;
}

export interface BackendCategoryDetail {
  id: string;
  categoryName: string;
  description: string | null;
  status: boolean;
  parentId?: string | null;
  products: CategoryDetailProduct[];
}

export interface CategoryDetail {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  status: boolean;
  parentId?: string | null;
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
