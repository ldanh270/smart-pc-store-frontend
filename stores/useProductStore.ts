import { create } from "zustand";
import { toast } from "sonner";
import { productService } from "@/services/productService";
import type { AdminProduct, ProductCreateDto, ProductQueryParams } from "@/types/product";

interface ProductStore {
  products: AdminProduct[];
  loading: boolean;
  
  // Store the last used params so we can easily refetch (e.g., after create/delete)
  lastParams: ProductQueryParams;
  
  fetchProducts: (params?: ProductQueryParams) => Promise<void>;
  createProduct: (data: ProductCreateDto) => Promise<boolean>;
  updateProduct: (id: number, data: ProductCreateDto) => Promise<boolean>;
  deleteProduct: (id: number) => Promise<boolean>;
}

export const useProductStore = create<ProductStore>((set, get) => ({
  products: [],
  loading: false,
  lastParams: { page: 1, size: 10 },

  fetchProducts: async (params = {}) => {
    try {
      set({ loading: true });
      // Merge with default/last params
      const currentParams = { ...get().lastParams, ...params };
      const data = await productService.getProducts(currentParams);
      
      set({ 
        products: data, 
        lastParams: currentParams 
      });
    } catch (error) {
      console.error("Failed to fetch products:", error);
    } finally {
      set({ loading: false });
    }
  },

  createProduct: async (data: ProductCreateDto) => {
    try {
      set({ loading: true });
      await productService.createProduct(data);
      toast.success("Thêm sản phẩm thành công!");
      await get().fetchProducts(get().lastParams);
      return true;
    } catch {
      return false;
    } finally {
      set({ loading: false });
    }
  },

  updateProduct: async (id: number, data: ProductCreateDto) => {
    try {
      set({ loading: true });
      await productService.updateProduct(id, data);
      toast.success("Cập nhật sản phẩm thành công!");
      await get().fetchProducts(get().lastParams);
      return true;
    } catch {
      return false;
    } finally {
      set({ loading: false });
    }
  },

  deleteProduct: async (id: number) => {
    try {
      set({ loading: true });
      await productService.deleteProduct(id);
      toast.success("Xóa sản phẩm thành công!");
      await get().fetchProducts(get().lastParams);
      return true;
    } catch {
      return false;
    } finally {
      set({ loading: false });
    }
  }
}));
