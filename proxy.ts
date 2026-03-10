import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getRoleFromJwt } from '@/lib/jwt';

// ─── Proxy (Next.js 16+ replaces middleware.ts) ───────────────────────────────

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('access_token')?.value;
  const role = getRoleFromJwt(token);

  // Protect /admin routes
  if (pathname.startsWith('/admin')) {
    if (!role) {
      // No token or invalid/expired token → redirect to login
      return NextResponse.redirect(new URL('/dang-nhap', request.url));
    }

    if (role !== 'ADMIN') {
      // Authenticated but not an admin → redirect to home
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  // Protect /tai-khoan (profile) — must be logged in
  if (pathname.startsWith('/tai-khoan')) {
    if (!role) {
      return NextResponse.redirect(new URL('/dang-nhap', request.url));
    }
  }

  // Redirect authenticated users away from /dang-nhap
  if (pathname.startsWith('/dang-nhap')) {
    if (role) {
      return NextResponse.redirect(
        new URL('/', request.url),
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/dang-nhap', '/tai-khoan/:path*'],
};
