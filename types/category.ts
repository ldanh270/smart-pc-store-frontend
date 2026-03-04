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
