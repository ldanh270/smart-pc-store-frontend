import { create } from "zustand";
import { persist } from "zustand/middleware";
import { toast } from "sonner";
import { authService } from "@/services/authService";
import { AuthState } from "@/types/store";

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      refreshToken: null,
      user: null,
      loading: false,
      
      signup: async (username: string, email: string, displayName: string, password: string) => {
        try {
          set({ loading: true });
          await authService.signup(username, password, email, displayName);

          toast.success("Đăng kí thành công! Bạn sẽ được chuyển hướng đến trang đăng nhập");
          return true;
        } catch (error) {
          console.error("ERROR useAuthStore - signup: " + error);
          toast.error("Đăng kí không thành công");
          return false;
        } finally {
          set({ loading: false });
        }
      },

      login: async (username: string, password: string) => {
        try {
          set({ loading: true });
          const {accessToken, refreshToken, user: serverUser} = await authService.login(username, password);

          let user = serverUser || null;
          if (!user && accessToken) {
            try {
              const payload = JSON.parse(atob(accessToken.split('.')[1]));
              user = {
                name: payload.displayName || payload.name || payload.sub || username,
                email: payload.email || "",
              };
            } catch (e) {
              console.error("Failed to parse JWT", e);
            }
          }

          set({ accessToken, refreshToken, user });

          toast.success("Đăng nhập thành công!");
          return true;
        } catch (error) {
          console.error("ERROR useAuthStore - login: " + error);
          toast.error("Đăng nhập không thành công");
          return false;
        } finally {
          set({ loading: false });
        }
      },

      logout: () => {
        set({ accessToken: null, refreshToken: null, user: null });
        toast.success("Đăng xuất thành công!");
      }
    }),
    {
      name: "auth-storage", // Khóa lưu trong localStorage
    }
  )
);