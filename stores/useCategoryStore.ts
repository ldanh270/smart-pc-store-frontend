import { create } from "zustand";
import { toast } from "sonner";
import { categoryService } from "@/services/categoryService";
import type { Category, CategoryCreateDto } from "@/types/category";

interface CategoryStore {
  categories: Category[];
  loading: boolean;
  
  fetchCategories: () => Promise<void>;
  createCategory: (data: CategoryCreateDto) => Promise<boolean>;
  updateCategory: (id: number, data: CategoryCreateDto) => Promise<boolean>;
  deleteCategory: (id: number) => Promise<boolean>;
}

export const useCategoryStore = create<CategoryStore>((set, get) => ({
  categories: [],
  loading: false,

  fetchCategories: async () => {
    try {
      set({ loading: true });
      const data = await categoryService.getCategories();
      set({ categories: data });
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    } finally {
      set({ loading: false });
    }
  },

  createCategory: async (data) => {
    try {
      set({ loading: true });
      await categoryService.createCategory(data);
      toast.success("Thêm danh mục thành công!");
      await get().fetchCategories();
      return true;
    } catch {
      return false;
    } finally {
      set({ loading: false });
    }
  },

  updateCategory: async (id, data) => {
    try {
      set({ loading: true });
      await categoryService.updateCategory(id, data);
      toast.success("Cập nhật danh mục thành công!");
      await get().fetchCategories();
      return true;
    } catch {
      return false;
    } finally {
      set({ loading: false });
    }
  },

  deleteCategory: async (id) => {
    try {
      set({ loading: true });
      await categoryService.deleteCategory(id);
      toast.success("Xóa danh mục thành công!");
      await get().fetchCategories();
      return true;
    } catch {
      return false;
    } finally {
      set({ loading: false });
    }
  }
}));
