import axios, { type AxiosRequestConfig } from "axios";
import { toast } from "sonner";
import { useAuthStore } from "@/stores/useAuthStore";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_MODE === "development" ? process.env.NEXT_PUBLIC_API_URL : "/api",
  withCredentials: true,
});

// ─── Helpers to read/write persisted auth store ─────────────────────────────

function getAuthState() {
  if (typeof window === "undefined") return null;
  return useAuthStore.getState();
}

function setAccessToken(accessToken: string) {
  if (typeof window === "undefined") return;
  try {
    // Update Zustand state (triggers UI re-render and auto-persists to localStorage)
    useAuthStore.setState({ accessToken });
    
    // Also sync the cookie so the Next.js middleware knows about the new token
    document.cookie = `access_token=${accessToken}; path=/; max-age=86400; SameSite=Lax`;
  } catch {
    // Silently ignore
  }
}

function clearAuth() {
  if (typeof window === "undefined") return;
  try {
    // Update Zustand state
    useAuthStore.setState({ accessToken: null, refreshToken: null, user: null });
    
    // Clear cookies
    document.cookie = 'access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    document.cookie = 'refresh_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
  } catch {
    // Silently ignore
  }
}

// ─── Request Interceptor: Attach Bearer Token ───────────────────────────────

api.interceptors.request.use((config) => {
  const auth = getAuthState();
  if (auth?.accessToken) {
    config.headers.Authorization = `Bearer ${auth.accessToken}`;
  }
  return config;
});

// ─── Response Interceptor: Auto Refresh on 401 ─────────────────────────────

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
}> = [];

function processQueue(error: unknown, token: string | null) {
  failedQueue.forEach((prom) => {
    if (token) {
      prom.resolve(token);
    } else {
      prom.reject(error);
    }
  });
  failedQueue = [];
}

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    // Global toast notifications for specific error codes
    // Skip auth endpoints — the auth store handles those errors itself.
    const status = error.response?.status;
    const isAuthEndpoint = error.config?.url?.includes("/auth/");
    if (status && !isAuthEndpoint) {
      if ([400, 403, 404, 409].includes(status)) {
        const message = error.response?.data?.message || error.response?.data?.error || `Error: ${status}`;
        toast.error(message);
      }
    }

    const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };

    // Only handle 401 and skip if already retried or is an auth endpoint
    if (status !== 401 || originalRequest._retry || isAuthEndpoint) {
      if (status === 401 && !isAuthEndpoint) {
        const message = error.response?.data?.message || "Unauthorized";
        toast.error(message);
      }
      return Promise.reject(error);
    }

    // Queue this request if a refresh is already in progress
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({
          resolve: (token: string) => {
            originalRequest.headers = {
              ...originalRequest.headers,
              Authorization: `Bearer ${token}`,
            };
            resolve(api(originalRequest));
          },
          reject,
        });
      });
    }

    originalRequest._retry = true;
    isRefreshing = true;

    const auth = getAuthState();

    // We DO NOT instantly log out if !auth?.accessToken here.
    // The user might have a valid HttpOnly refresh cookie but an empty store (e.g., hard refresh).
    // Let the /refresh endpoint decide if the session is truly dead.

    try {
      const refreshToken = auth?.refreshToken;

      // Backend might expect the refresh token in the body, or it might just read it from cookies.
      // We send it in the body if we have it, but we let cookies work if we don't.
      const payload = refreshToken ? { refreshToken } : {};

      const { data } = await axios.post(
        `${api.defaults.baseURL}/auth/refresh`,
        payload,
        { withCredentials: true }
      );

      const newAccessToken: string = data.accessToken || data.token;
      
      if (!newAccessToken) {
        throw new Error("Invalid refresh response");
      }

      // Update only the access token
      setAccessToken(newAccessToken);
      processQueue(null, newAccessToken);

      // Retry original request with new token
      originalRequest.headers = {
        ...originalRequest.headers,
        Authorization: `Bearer ${newAccessToken}`,
      };
      return api(originalRequest);
    } catch (refreshError) {
      processQueue(refreshError, null);
      clearAuth();
      if (typeof window !== "undefined") {
        window.location.href = "/dang-nhap";
      }
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);

export default api;