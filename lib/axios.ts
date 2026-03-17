import axios, { type AxiosRequestConfig, type InternalAxiosRequestConfig } from "axios";
import { toast } from "sonner";
import { useAuthStore } from "@/stores/useAuthStore";
import { getApiBaseUrl } from "@/lib/api/base-url";

const api = axios.create({
  baseURL: getApiBaseUrl(),
  withCredentials: true,
  timeout: 15_000,
});

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getAuthState() {
  if (typeof window === "undefined") return null;
  return useAuthStore.getState();
}

export function setAccessToken(accessToken: string) {
  if (typeof window === "undefined") return;
  useAuthStore.setState({ accessToken });
  document.cookie = `access_token=${accessToken}; path=/; max-age=86400; SameSite=Lax`;
}

export function clearAuth() {
  if (typeof window === "undefined") return;
  useAuthStore.setState({ accessToken: null, user: null });
  localStorage.removeItem("auth-storage");
  document.cookie = "access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
  document.cookie = "refresh_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
}

// ─── Proactive expiry check (refresh 30s before actual expiry) ────────────────

function isTokenExpiredOrExpiringSoon(token: string, bufferSeconds = 30): boolean {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    if (!payload.exp) return false;
    return payload.exp * 1000 < Date.now() + bufferSeconds * 1000;
  } catch {
    return true; // malformed token — treat as expired
  }
}

// ─── Refresh singleton (Promise-based, no race conditions) ───────────────────
//
// Using a shared Promise instead of isRefreshing + failedQueue:
//   - Multiple concurrent 401s all await the same promise
//   - No manual queue management
//   - Automatically cleared when the promise settles
//
let refreshPromise: Promise<string> | null = null;

export async function refreshAccessToken(): Promise<string> {
  // Re-use an in-flight refresh rather than firing a second request
  if (refreshPromise) return refreshPromise;

  refreshPromise = (async () => {
    const { data } = await axios.post(
      `${api.defaults.baseURL}/auth/refresh`,
      {},
      { withCredentials: true, timeout: 10_000 }
    );

    // Normalise the token key across different backend conventions
    const newToken: string =
      data.accessToken ?? data.token ?? data.access_token;

    if (!newToken) throw new Error("Refresh response is missing the access token");

    setAccessToken(newToken);
    return newToken;
  })().finally(() => {
    // Always clear the singleton so the next expiry starts fresh
    refreshPromise = null;
  });

  return refreshPromise;
}

// ─── Request interceptor: proactive refresh + attach token ───────────────────

api.interceptors.request.use(async (config: InternalAxiosRequestConfig) => {
  const auth = getAuthState();
  if (!auth?.accessToken) return config;

  // If the token will expire very soon, refresh before the request goes out.
  // This avoids a needless 401 round-trip for the common "tab left open" case.
  if (isTokenExpiredOrExpiringSoon(auth.accessToken)) {
    try {
      const freshToken = await refreshAccessToken();
      config.headers.Authorization = `Bearer ${freshToken}`;
      return config;
    } catch {
      // Refresh failed — let the request proceed; the response interceptor
      // will catch the resulting 401/403 and redirect to login.
    }
  }

  config.headers.Authorization = `Bearer ${auth.accessToken}`;
  return config;
});

// ─── Response interceptor: reactive 401/403 handler ─────────────────────────

// These paths handle their own errors — never attempt a refresh for them.
const AUTH_PATHS = ["/auth/login", "/auth/signup", "/auth/logout", "/auth/refresh"];

api.interceptors.response.use(
  (response) => response,

  async (error) => {
    const status: number | undefined = error.response?.status;
    const requestUrl: string = error.config?.url ?? "";
    const isAuthCall = AUTH_PATHS.some((p) => requestUrl.includes(p));
    const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };

    // ── Non-401/403 errors: show toast (skip auth-related calls) ──────────
    if (status && ![401, 403].includes(status) && !isAuthCall) {
      if ([400, 404, 409].includes(status)) {
        const message =
          error.response?.data?.message ??
          error.response?.data?.error ??
          `Lỗi ${status}`;
        if (typeof window !== "undefined") {
          toast.error(message);
        }
      }
      return Promise.reject(error);
    }

    // ── Auth calls and already-retried requests: reject immediately ────────
    if (isAuthCall || originalRequest._retry) {
      return Promise.reject(error);
    }

    // ── 401 / 403 on a regular call: attempt refresh then retry ───────────
    if (status === 401 || status === 403) {
      originalRequest._retry = true;

      try {
        const freshToken = await refreshAccessToken();
        originalRequest.headers = {
          ...originalRequest.headers,
          Authorization: `Bearer ${freshToken}`,
        };
        return api(originalRequest);
      } catch {
        // Refresh failed — session is truly dead
        clearAuth();
        toast.error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
        if (typeof window !== "undefined") {
          window.location.href = "/dang-nhap";
        }
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
