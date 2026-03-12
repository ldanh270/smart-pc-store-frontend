"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/stores/useAuthStore";
import { refreshAccessToken } from "@/lib/axios";

/**
 * Runs once on app mount. If the store has a persisted user (from localStorage)
 * but no accessToken (never persisted), call /auth/refresh to restore the session.
 * The backend reads the refresh token from its HttpOnly cookie automatically.
 * Auto-logout only happens when /auth/refresh itself fails
 * (handled inside the axios response interceptor).
 */
export default function AuthInitializer() {
  useEffect(() => {
    const { user, accessToken } = useAuthStore.getState();
    if (!user || accessToken) return;

    refreshAccessToken().catch(() => {
      // Refresh failed (e.g. refresh token expired) — clearAuth and
      // redirect are handled inside the axios response interceptor.
    });
  }, []);

  return null;
}
