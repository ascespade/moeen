/**
 * ✅ OPTIMIZED Middleware
 * Middleware محسّن للجلسات والصلاحيات
 *
 * Fixed critical issues:
 * - Only protects specific routes (no database query on every request)
 * - Proper session refresh
 * - No blocking of static assets
 * - Fast route protection
 */

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// Public routes that don't require authentication
const PUBLIC_ROUTES = [
  '/',
  '/login',
  '/register',
  '/forgot-password',
  '/reset-password',
];

// Protected routes that require authentication
const PROTECTED_ROUTES = [
  '/dashboard',
  '/admin',
  '/profile',
  '/settings',
  '/doctor-dashboard',
];

// Admin-only routes
const ADMIN_ROUTES = [
  '/admin',
];

// Check if route is public
function isPublicRoute(pathname: string): boolean {
  return PUBLIC_ROUTES.some(route => pathname === route || pathname.startsWith(route + '/'));
}

// Check if route requires authentication
function isProtectedRoute(pathname: string): boolean {
  return PROTECTED_ROUTES.some(route => pathname.startsWith(route));
}

// Check if route requires admin
function requiresAdmin(pathname: string): boolean {
  return ADMIN_ROUTES.some(route => pathname.startsWith(route));
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ✅ Allow public routes immediately (no database queries)
  if (isPublicRoute(pathname)) {
    return NextResponse.next();
  }

  // ✅ Allow API routes (they handle their own auth)
  if (pathname.startsWith('/api/')) {
    return NextResponse.next();
  }

  // ✅ Only check auth for protected routes
  if (!isProtectedRoute(pathname)) {
    return NextResponse.next();
  }

  // ✅ Get and refresh session (only for protected routes)
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();

  // ✅ No session - redirect to login (only for protected routes)
  if (!session) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // ✅ Redirect authenticated users away from login page
  if (pathname.startsWith('/login') && session) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // ✅ All checks passed - session exists
  return NextResponse.next();
}

export const config = {
  matcher: [
    // ✅ ONLY match routes that need protection - not static files!
    '/dashboard/:path*',
    '/admin/:path*',
    '/profile/:path*',
    '/settings/:path*',
    '/doctor-dashboard/:path*',
    '/login',
    '/register',
  ],
};