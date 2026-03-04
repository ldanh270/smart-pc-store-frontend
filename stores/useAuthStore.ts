import { create } from "zustand";
import { persist } from "zustand/middleware";
import { toast } from "sonner";
import { authService } from "@/services/authService";
import { AuthState } from "@/types/store";

/** Extract a human-readable message from an API error. */
function getErrorMessage(error: unknown, fallback: string): string {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const data = (error as any)?.response?.data;
  if (typeof data === "string" && data.length > 0) return data;
  if (typeof data?.message === "string") return data.message;
  if (typeof data?.error === "string") return data.error;
  return fallback;
}

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
          toast.error(getErrorMessage(error, "Đăng kí không thành công"));
          return false;
        } finally {
          set({ loading: false });
        }
      },

      login: async (username: string, password: string) => {
        try {
          set({ loading: true });
          const data = await authService.login(username, password);
          const accessToken = data.accessToken || data.token;
          const refreshToken = data.refreshToken;

          let user = data.user || null;
          if (!user && accessToken) {
            try {
              const payload = JSON.parse(atob(accessToken.split('.')[1]));
              user = {
                id: payload.id || payload.sub,
                name: payload.displayName || payload.name || payload.sub || username,
                email: payload.email || "",
                role: payload.role || "user",
              };
            } catch (e) {
              console.error("Failed to parse JWT", e);
            }
          }

          set({ accessToken, refreshToken, user });

          // Sync access token to cookie for Next.js middleware
          if (typeof document !== 'undefined') {
            document.cookie = `access_token=${accessToken}; path=/; max-age=86400; SameSite=Lax`;
          }

          toast.success("Đăng nhập thành công!");
          return true;
        } catch (error) {
          toast.error(getErrorMessage(error, "Đăng nhập không thành công"));
          return false;
        } finally {
          set({ loading: false });
        }
      },

      logout: () => {
        set({ accessToken: null, refreshToken: null, user: null });
        if (typeof document !== 'undefined') {
          document.cookie = 'access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
        }
        toast.success("Đăng xuất thành công!");
      }
    }),
    {
      name: "auth-storage", // Khóa lưu trong localStorage
    }
  )
);