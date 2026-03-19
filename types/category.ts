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
  return categoryName
    .normalize("NFD")                   // Tách chữ và dấu
    .replace(/[\u0300-\u036f]/g, "")    // Loại bỏ các dấu
    .replace(/đ/g, "d")                 // Chuyển chữ đ thường
    .replace(/Đ/g, "D")                 // Chuyển chữ Đ hoa
    .toLowerCase()                      // Chuyển về chữ thường
    .trim()                             // Bỏ khoảng trắng 2 đầu
    .replace(/[^a-z0-9 -]/g, "")        // Xóa các ký tự đặc biệt không phải chữ, số, khoảng trắng hay gạch ngang
    .replace(/\s+/g, "-")               // Thay khoảng trắng bằng gạch ngang
    .replace(/-+/g, "-");               // Xóa các gạch ngang liên tiếp (VD: "a---b" thành "a-b")
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
