/**
 * Unified Middleware
 * Middleware موحد للجلسات والصلاحيات
 *
 * Simplified middleware that handles all route protection
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
  '/api/auth/login',
  '/api/auth/register',
  '/api/auth/logout',
  '/api/auth/me',
];

// Routes that require authentication but no specific role
const AUTHENTICATED_ROUTES = [
  '/dashboard',
  '/profile',
  '/settings',
];

// Admin routes
const ADMIN_ROUTES = [
  '/admin',
];

// Check if route is public
function isPublicRoute(pathname: string): boolean {
  return PUBLIC_ROUTES.some(route => pathname.startsWith(route));
}

// Check if route requires admin
function requiresAdmin(pathname: string): boolean {
  return ADMIN_ROUTES.some(route => pathname.startsWith(route));
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow public routes
  if (isPublicRoute(pathname)) {
    return NextResponse.next();
  }

  // Allow API routes (they handle their own auth)
  if (pathname.startsWith('/api/')) {
    return NextResponse.next();
  }

  // Check authentication
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();

  // No session - redirect to login
  if (!session) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Get user role
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

  // All checks passed
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
