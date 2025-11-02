/**
 * Unified Middleware - OPTIMIZED VERSION
 * Middleware موحد للجلسات والصلاحيات
 *
 * ✅ Fixed: Only runs on protected routes
 * ✅ Fixed: Session refresh handled properly
 * ✅ Fixed: No blocking database queries on every request
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

  // ✅ Allow static files and API routes immediately (no auth check)
  if (
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/api/') ||
    pathname.match(/\.(ico|png|jpg|jpeg|gif|svg|webp|css|js|woff|woff2|ttf|eot)$/) ||
    pathname === '/favicon.ico'
  ) {
    return NextResponse.next();
  }

  // ✅ Allow public routes
  if (isPublicRoute(pathname)) {
    // If accessing login/register while authenticated, redirect to dashboard
    if (pathname.startsWith('/login') || pathname.startsWith('/register')) {
      const supabase = await createClient();
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
      }
    }
    return NextResponse.next();
  }

  // ✅ Only check auth for protected routes
  if (!isProtectedRoute(pathname)) {
    return NextResponse.next();
  }

  // Check authentication for protected routes
  const supabase = await createClient();
  
  // Refresh session (Supabase handles this automatically via cookies)
  const { data: { session }, error: sessionError } = await supabase.auth.getSession();

  // No session - redirect to login
  if (!session || sessionError) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // ✅ Optimized: Only check user role for admin routes or when needed
  if (requiresAdmin(pathname)) {
    // Only query database for admin route checks
    const { data: userData } = await supabase
      .from('users')
      .select('role, status')
      .eq('id', session.user.id)
      .maybeSingle();

    // User not found or inactive
    if (!userData || (userData.status && userData.status !== 'active')) {
      const loginUrl = new URL('/login', request.url);
      return NextResponse.redirect(loginUrl);
    }

    // Check admin routes
    if (userData.role !== 'admin' && userData.role !== 'manager') {
      // Redirect to user's default dashboard
      const defaultRoutes: Record<string, string> = {
        supervisor: '/dashboard/supervisor',
        doctor: '/doctor-dashboard',
        patient: '/dashboard/patient',
        staff: '/dashboard/staff',
      };
      const redirect = defaultRoutes[userData.role] || '/dashboard';
      return NextResponse.redirect(new URL(redirect, request.url));
    }
  }

  // All checks passed
  return NextResponse.next();
}

export const config = {
  matcher: [
    // ✅ Only match routes that need protection
    '/dashboard/:path*',
    '/admin/:path*',
    '/profile/:path*',
    '/settings/:path*',
    '/doctor-dashboard/:path*',
    '/login',
    '/register',
    '/forgot-password',
    '/reset-password',
  ],
};
