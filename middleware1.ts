import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect /admin routes
  if (pathname.startsWith('/admin')) {
    const accessToken = request.cookies.get('access_token')?.value;
    const userRole = request.cookies.get('role')?.value;

    if (!accessToken) {
      return NextResponse.redirect(new URL('/dang-nhap', request.url));
    }

    // Check if the user's role is admin
    // Typically JWT payload stores role as an array like ["ROLE_ADMIN"] or string "admin".
    // We parsed it on the client into "user_role" cookie.
    if (userRole !== 'ADMIN' && userRole !== 'admin' && !userRole?.includes('ADMIN')) {
      // User is authenticated but NOT an admin
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  // Redirect authenticated users away from /dang-nhap
  if (pathname.startsWith('/dang-nhap')) {
    const accessToken = request.cookies.get('access_token')?.value;
    const userRole = request.cookies.get('user_role')?.value;

    if (accessToken) {
      if (userRole === 'ADMIN' || userRole === 'admin' || userRole?.includes('ADMIN')) {
        return NextResponse.redirect(new URL('/admin', request.url));
      }
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/dang-nhap'],
};
