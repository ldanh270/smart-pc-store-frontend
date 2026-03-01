import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_MODE === "development" ? process.env.NEXT_PUBLIC_API_URL : "/api",
  withCredentials: true,
});

// Automatically attach Bearer token from persisted auth store
api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    try {
      const raw = localStorage.getItem("auth-storage");
      if (raw) {
        const parsed = JSON.parse(raw);
        const token = parsed?.state?.accessToken;
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      }
    } catch {
      // Silently ignore parse errors
    }
  }
  return config;
});

export default api;