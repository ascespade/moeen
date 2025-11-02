/**
 * ✅ SIMPLIFIED Middleware
 * Middleware مبسّط - فقط فحص session بسيط
 * بدون فحص صلاحيات أو roles
 */

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// Public routes
const PUBLIC_ROUTES = [
  '/',
  '/login',
  '/register',
  '/forgot-password',
  '/reset-password',
];

// Check if route is public
function isPublicRoute(pathname: string): boolean {
  return PUBLIC_ROUTES.some(route => pathname === route || pathname.startsWith(route + '/'));
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ✅ Allow public routes
  if (isPublicRoute(pathname)) {
    return NextResponse.next();
  }

  // ✅ Allow API routes
  if (pathname.startsWith('/api/')) {
    return NextResponse.next();
  }

  // ✅ Simple session check for protected routes
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();

  // ✅ No session - redirect to login
  if (!session) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // ✅ Redirect authenticated users away from login page
  if (pathname.startsWith('/login') && session) {
    return NextResponse.redirect(new URL('/admin/dashboard', request.url));
  }

  // ✅ All good - allow access
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/admin/:path*',
    '/profile/:path*',
    '/settings/:path*',
    '/doctor-dashboard/:path*',
    '/login',
    '/register',
  ],
};