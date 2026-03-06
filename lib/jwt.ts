// ─── JWT Helpers ─────────────────────────────────────────────────────────────
// Shared between Next.js middleware (Edge Runtime) and client components.

export interface JwtPayload {
  userId?: number;
  username?: string;
  role?: string;
  exp?: number;
}

/**
 * Decode the payload of a JWT **without verifying the signature**.
 * Returns `null` when the token is malformed or expired.
 */
export function decodeJwtPayload(token: string): JwtPayload | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;

    // Base64url → Base64 → decode
    const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    const json = atob(base64);
    const payload = JSON.parse(json) as JwtPayload;

    // Optionally, you COULD reject expired tokens here, but keeping it allows
    // the UI to show authorized elements long enough to trigger an API call, 
    // which then gracefully handles the 401 auto-refresh via Axios.
    // if (payload.exp && payload.exp * 1000 < Date.now()) return null;

    return payload;
  } catch {
    return null;
  }
}

/**
 * Extract the uppercased role from a raw JWT string.
 * Returns `null` when the token is absent, malformed, or expired.
 */
export function getRoleFromJwt(token: string | undefined | null): string | null {
  if (!token) return null;
  const payload = decodeJwtPayload(token);
  return payload?.role?.toUpperCase() ?? null;
}
