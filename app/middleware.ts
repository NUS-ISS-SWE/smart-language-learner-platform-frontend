import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const token = request.cookies.get('sllp_auth')?.value;

  // Public routes that don't require authentication
  const publicRoutes = ['/', '/login', '/register', '/forgot-password'];

  // Protected routes that require authentication
  const protectedRoutes = ['/dashboard', '/courses', '/vocabulary', '/compositions', '/evaluations', '/profile', '/settings', '/progress'];

  // Admin routes that require admin role
  const adminRoutes = ['/admin'];

  // Check if the current path is public
  const isPublicRoute = publicRoutes.some(route => pathname === route || pathname.startsWith(`${route}/`));

  // Check if the current path is protected
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));

  // Check if the current path is admin
  const isAdminRoute = adminRoutes.some(route => pathname.startsWith(route));

  // If it's a public route, allow access
  if (isPublicRoute) {
    // Redirect authenticated users away from login/register to dashboard
    if (token && (pathname === '/login' || pathname === '/register')) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
    return NextResponse.next();
  }

  // If it's a protected or admin route and user is not authenticated, redirect to login
  if ((isProtectedRoute || isAdminRoute) && !token) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // For now, allow all authenticated users to access admin routes
  // NOTE: Implement role-based access control once user roles are added to JWT token
  // Extract role from token and verify user is 'admin' or 'instructor' before granting access
  if (isAdminRoute && token) {
    return NextResponse.next();
  }

  return NextResponse.next();
}

// Configure which routes to apply middleware to
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public (public files)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
};
