import { authService } from "@/services/authService"
import { AuthState } from "@/types/store"

import { toast } from "sonner"
import { create } from "zustand"
import { persist } from "zustand/middleware"

/** Extract a human-readable message from an API error. */
function getErrorMessage(error: unknown, fallback: string): string {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const data = (error as any)?.response?.data
  if (typeof data === "string" && data.length > 0) return data
  if (typeof data?.message === "string") return data.message
  if (typeof data?.error === "string") return data.error
  return fallback
}

/** Decode the JWT payload without verifying the signature. */
function decodeJwtPayload(token: string): Record<string, unknown> | null {
  try {
    return JSON.parse(atob(token.split(".")[1]))
  } catch {
    return null
  }
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      user: null,
      loading: false,

      signup: async (username: string, email: string, displayName: string, password: string) => {
        try {
          set({ loading: true })
          await authService.signup(username, password, email, displayName)
          toast.success("Đăng kí thành công! Bạn sẽ được chuyển hướng đến trang đăng nhập")
          return true
        } catch (error) {
          toast.error(getErrorMessage(error, "Đăng kí không thành công"))
          return false
        } finally {
          set({ loading: false })
        }
      },

      login: async (username: string, password: string) => {
        try {
          set({ loading: true })
          const data = await authService.login(username, password)

          // Normalise token key across backend conventions
          const accessToken: string | undefined =
            data.accessToken ?? data.token ?? data.access_token

          // Derive user info from the response body or from the token payload
          let user = null
          if (data.user) {
            user = {
              id: data.user.id,
              name: data.user.displayName ?? data.user.name ?? username,
              email: data.user.email ?? "",
              role: data.user.role ?? "user",
            }
          } else if (accessToken) {
            const payload = decodeJwtPayload(accessToken)
            if (payload) {
              user = {
                id: payload.id ?? payload.sub,
                name: payload.displayName ?? payload.name ?? payload.sub ?? username,
                email: payload.email ?? "",
                role: payload.role ?? "user",
              }
            }
          }

          set({ accessToken, user })

          // Sync to cookie so the Next.js middleware can read it server-side
          if (typeof document !== "undefined" && accessToken) {
            document.cookie = `access_token=${accessToken}; path=/; max-age=86400; SameSite=Lax`
          }

          toast.success("Đăng nhập thành công!")
          return true
        } catch (error) {
          toast.error(getErrorMessage(error, "Đăng nhập không thành công"))
          return false
        } finally {
          set({ loading: false })
        }
      },

      logout: async () => {
        try {
          await authService.logout()
        } catch (error) {
          // Expected when the token is already expired — not a real error
          console.log("Logout note:", getErrorMessage(error, "Phiên đã hết hạn"))
        }

        set({ accessToken: null, user: null })

        if (typeof window !== "undefined") {
          localStorage.removeItem("auth-storage")
          document.cookie = "access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"
          document.cookie = "refresh_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"
        }

        toast.success("Đăng xuất thành công!")
      },
    }),
    {
      name: "auth-storage",

      // ─── Security: access token must NOT be persisted to localStorage ────────
      //
      // localStorage is readable by any JS on the page (XSS risk).
      // Access tokens are short-lived; the refresh flow re-issues one on every
      // page load, so persisting them gives attackers a window with no benefit.
      // refresh_token + user info are safe to persist (user stays "logged in"
      // across reloads and the refresh call re-hydrates the access token).
      //
      // ─── Only user is persisted to localStorage ──────────────────────────
      //
      // accessToken: in-memory only (short-lived, re-issued on every load via /refresh)
      // refreshToken: managed by the backend via HttpOnly cookie — not stored in JS
      //
      partialize: (state) => ({
        user: state.user,
      }),
    },
  ),
)
