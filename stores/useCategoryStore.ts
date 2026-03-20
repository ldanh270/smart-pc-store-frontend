import { create } from "zustand";
import { toast } from "sonner";
import { categoryService } from "@/services/categoryService";
import type { Category, CategoryCreateDto } from "@/types/category";

interface CategoryStore {
  categories: Category[];
  loading: boolean;
  
  fetchCategories: () => Promise<void>;
  createCategory: (data: CategoryCreateDto) => Promise<boolean>;
  updateCategory: (id: string, data: CategoryCreateDto) => Promise<boolean>;
  deleteCategory: (id: string) => Promise<boolean>;
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
      // Re-fetch to get the server-assigned ID and data
      await get().fetchCategories();
      return true;
    } catch {
      return false;
    } finally {
      set({ loading: false });
    }
  },

  updateCategory: async (id: string, data) => {
    try {
      set({ loading: true });
      const updatedCategory = await categoryService.updateCategory(id, data);

      set((state) => ({
        categories: state.categories.map((c) =>
          c.id === id ? updatedCategory : c,
        ),
      }));
      toast.success("Cập nhật danh mục thành công!");
      return true;
    } catch (error) {
      console.error("Update category failed:", error);
      toast.error("Không thể cập nhật danh mục.");
      return false;
    } finally {
      set({ loading: false });
    }
  },

  deleteCategory: async (id: string) => {
    try {
      set({ loading: true });
      await categoryService.deleteCategory(id);

      // Optimistic: remove from local state immediately
      set((state) => ({
        categories: state.categories.filter((c) => c.id !== id),
      }));
      toast.success("Xóa danh mục thành công!");
      return true;
    } catch {
      return false;
    } finally {
      set({ loading: false });
    }
  }
}));
