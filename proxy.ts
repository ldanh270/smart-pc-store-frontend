import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getRoleFromJwt } from '@/lib/jwt';

// ─── Auth Guard Proxy (replaces middleware.ts) ──────────────────────────────────────────────────
// Bảo vệ các route yêu cầu xác thực / quyền ADMIN.

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('access_token')?.value;
  const role = getRoleFromJwt(token);

  // ── Bảo vệ /admin → yêu cầu đăng nhập + vai trò ADMIN ──────────────────
  if (pathname.startsWith('/admin')) {
    if (!role) {
      // Chưa đăng nhập → chuyển hướng đến trang login
      return NextResponse.redirect(new URL('/dang-nhap', request.url));
    }

    if (role !== 'ADMIN') {
      // Đã đăng nhập nhưng không phải Admin → về trang chủ
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  // ── Bảo vệ /tai-khoan → yêu cầu đăng nhập ─────────────────────────────
  if (pathname.startsWith('/tai-khoan')) {
    if (!role) {
      return NextResponse.redirect(new URL('/dang-nhap', request.url));
    }
  }

  // ── Chuyển hướng người đã đăng nhập ra khỏi trang login ────────────────
  if (pathname.startsWith('/dang-nhap')) {
    if (role) {
      return NextResponse.redirect(
        new URL(role === 'ADMIN' ? '/admin' : '/', request.url),
      );
    }
  }

  // Bảo vệ /don-hang → yêu cầu đăng nhập
  if (pathname.startsWith('/don-hang')) {
    if (!role) {
      return NextResponse.redirect(new URL('/dang-nhap', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/dang-nhap', '/tai-khoan/:path*', '/don-hang/:path*'],
};
