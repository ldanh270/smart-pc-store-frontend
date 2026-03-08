"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/stores/useAuthStore";
import { refreshAccessToken } from "@/lib/axios";

/**
 * Runs once on app mount. If the store has a refreshToken (persisted in
 * localStorage) but no accessToken (never persisted), proactively fetch
 * a fresh access token so the UI is fully authenticated from the start —
 * avoiding the "admin link disappears after F5" issue.
 */
export default function AuthInitializer() {
  useEffect(() => {
    const { refreshToken, accessToken } = useAuthStore.getState();
    if (refreshToken && !accessToken) {
      refreshAccessToken().catch(() => {
        // Refresh failed (e.g. refresh token expired) — clearAuth and
        // redirect are handled inside the axios response interceptor.
      });
    }
  }, []);

  return null;
}
