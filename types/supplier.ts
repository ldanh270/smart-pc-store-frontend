export interface BackendSupplier {
  id: string;
  supplierName: string;
  contactInfo: string;
  componentTypes: string;
  leadTimeDays: number;
  status: boolean;
}

export interface Supplier {
  id: string;
  name: string;
  contactName?: string;
  email?: string;
  phone?: string;
  address?: string;
  status: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SupplierCreateDto {
  name: string;
  contactName?: string;
  email?: string;
  phone?: string;
  address?: string;
  status?: boolean;
}
