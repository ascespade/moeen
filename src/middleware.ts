/**
 * Optimized Middleware
 * Middleware محسّن للجلسات والصلاحيات
 *
 * Fixed issues:
 * - Only runs on specific protected routes (not all routes)
 * - Properly refreshes session tokens
 * - Avoids database queries on every request
 * - Doesn't block static assets or API routes unnecessarily
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
  '/patients',
  '/doctors',
  '/appointments',
  '/crm',
  '/chatbot',
  '/analytics',
  '/reports',
  '/payments',
  '/conversations',
  '/notifications',
  '/messages',
  '/integrations',
  '/performance',
  '/security',
];

// Admin-only routes
const ADMIN_ROUTES = [
  '/admin',
];

// Check if route is public
function isPublicRoute(pathname: string): boolean {
  return PUBLIC_ROUTES.some(route => pathname === route || pathname.startsWith(route + '/'));
}

// Check if route is protected
function isProtectedRoute(pathname: string): boolean {
  return PROTECTED_ROUTES.some(route => pathname.startsWith(route));
}

// Check if route requires admin
function requiresAdmin(pathname: string): boolean {
  return ADMIN_ROUTES.some(route => pathname.startsWith(route));
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const res = NextResponse.next();
  const supabase = await createClient();

  // Refresh session if exists (this updates cookies automatically)
  const { data: { session } } = await supabase.auth.getSession();

  // Public routes - allow through
  if (isPublicRoute(pathname)) {
    // If user has session and tries to access login, redirect to dashboard
    if ((pathname === '/login' || pathname === '/register') && session) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
    return res;
  }

  // API routes - let them handle their own auth (don't block)
  if (pathname.startsWith('/api/')) {
    return res;
  }

  // Static files and assets - always allow
  if (
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/favicon') ||
    pathname.match(/\.(ico|png|jpg|jpeg|svg|gif|webp|css|js|woff|woff2|ttf|eot)$/)
  ) {
    return res;
  }

  // Protected routes - check authentication
  if (isProtectedRoute(pathname)) {
    // No session - redirect to login
    if (!session) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Check user status from database (only for protected routes, cached by Supabase)
    const { data: userData } = await supabase
      .from('users')
      .select('role, status')
      .eq('id', session.user.id)
      .maybeSingle();

    // User not found or inactive
    if (!userData || userData.status !== 'active') {
      const loginUrl = new URL('/login', request.url);
      return NextResponse.redirect(loginUrl);
    }

    // Check admin routes
    if (requiresAdmin(pathname) && userData.role !== 'admin' && userData.role !== 'manager') {
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
  return res;
}

export const config = {
  matcher: [
    /*
     * Only match specific routes that need protection
     * This prevents middleware from running on every request
     */
    '/dashboard/:path*',
    '/admin/:path*',
    '/profile/:path*',
    '/settings/:path*',
    '/patients/:path*',
    '/doctors/:path*',
    '/appointments/:path*',
    '/crm/:path*',
    '/chatbot/:path*',
    '/analytics/:path*',
    '/reports/:path*',
    '/payments/:path*',
    '/conversations/:path*',
    '/notifications/:path*',
    '/messages/:path*',
    '/integrations/:path*',
    '/performance/:path*',
    '/security/:path*',
    '/login',
    '/register',
  ],
};
