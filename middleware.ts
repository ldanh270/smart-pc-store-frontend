import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// ─── Helpers ─────────────────────────────────────────────────────────────────

interface JwtPayload {
  userId?: number;
  username?: string;
  role?: string;
  exp?: number;
}

/**
 * Decode the payload of a JWT without verifying the signature.
 * Returns `null` when the token is malformed or expired.
 */
function decodeJwtPayload(token: string): JwtPayload | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;

    // Base64url → Base64 → decode
    const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    const json = atob(base64);
    const payload = JSON.parse(json) as JwtPayload;

    // Reject expired tokens
    if (payload.exp && payload.exp * 1000 < Date.now()) return null;

    return payload;
  } catch {
    return null;
  }
}

/**
 * Extract the role from the access-token cookie.
 * Returns the uppercased role string, or `null` when absent / invalid.
 */
function getRoleFromToken(request: NextRequest): string | null {
  const token = request.cookies.get('access_token')?.value;
  if (!token) return null;

  const payload = decodeJwtPayload(token);
  return payload?.role?.toUpperCase() ?? null;
}

// ─── Middleware ───────────────────────────────────────────────────────────────

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect /admin routes
  if (pathname.startsWith('/admin')) {
    const role = getRoleFromToken(request);

    if (!role) {
      // No token or invalid/expired token → redirect to login
      return NextResponse.redirect(new URL('/dang-nhap', request.url));
    }

    if (role !== 'ADMIN') {
      // Authenticated but not an admin → redirect to home
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  // Redirect authenticated users away from /dang-nhap
  if (pathname.startsWith('/dang-nhap')) {
    const role = getRoleFromToken(request);

    if (role) {
      return NextResponse.redirect(
        new URL(role === 'ADMIN' ? '/admin' : '/', request.url),
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/dang-nhap'],
};
