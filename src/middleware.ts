/**
 * Enhanced Middleware - Optimized & Fast
 * Middleware محسّن - سريع ومحسّن
 * 
 * ✅ Single database query per request
 * ✅ Cache-friendly
 * ✅ Minimal logic
 * ✅ Clear business rules
 */

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import jwt from 'jsonwebtoken';
import { getDefaultRoute } from './lib/auth/RouteManager';

// Route categories
const PUBLIC_ROUTES = ['/', '/login', '/register', '/forgot-password', '/reset-password'];
const PROTECTED_ROUTES = ['/dashboard', '/admin', '/profile', '/settings', '/doctor-dashboard'];
const ADMIN_ROUTES = ['/admin'];

// Helpers
function isPublicRoute(pathname: string): boolean {
  return PUBLIC_ROUTES.some(route => pathname === route || pathname.startsWith(route + '/'));
}

function isProtectedRoute(pathname: string): boolean {
  return PROTECTED_ROUTES.some(route => pathname.startsWith(route));
}

function requiresAdmin(pathname: string): boolean {
  return ADMIN_ROUTES.some(route => pathname.startsWith(route));
}

interface AuthUser {
  id: string;
  email: string;
  role: string;
  status: string;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow static files and API routes immediately
  if (
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/api/') ||
    pathname.match(/\.(ico|png|jpg|jpeg|gif|svg|webp|css|js|woff|woff2|ttf|eot)$/) ||
    pathname === '/favicon.ico'
  ) {
    return NextResponse.next();
  }

  // Handle public routes
  if (isPublicRoute(pathname)) {
    // Redirect authenticated users away from login/register
    if (pathname.startsWith('/login') || pathname.startsWith('/register')) {
      const token = request.cookies.get('auth_token')?.value;
      if (token) {
        try {
          const secret = process.env.JWT_SECRET;
          if (secret) {
            const decoded = jwt.verify(token, secret) as any;
            
            // Quick check: verify user exists and is active (single optimized query)
            const supabase = await createClient();
            const { data: userData } = await supabase
              .from('users')
              .select('role, status')
              .eq('id', decoded.userId)
              .eq('status', 'active')
              .maybeSingle();

            if (userData) {
              const route = getDefaultRoute(userData.role);
              return NextResponse.redirect(new URL(route, request.url));
            }
          }
        } catch {
          // Token invalid, allow access to login
        }
      }
    }
    return NextResponse.next();
  }

  // Handle protected routes
  if (!isProtectedRoute(pathname)) {
    return NextResponse.next();
  }

  // Get authentication token
  const token = request.cookies.get('auth_token')?.value || 
               request.headers.get('authorization')?.replace('Bearer ', '');

  if (!token) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Verify token and get user (single optimized query)
  let user: AuthUser | null = null;

  try {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      // Don't log in production to avoid information leakage
      return NextResponse.redirect(new URL('/login', request.url));
    }

    const decoded = jwt.verify(token, secret) as any;
    const supabase = await createClient();

    // Single optimized query: get user with status check
    const { data: userData, error } = await supabase
      .from('users')
      .select('id, email, role, status')
      .eq('id', decoded.userId)
      .eq('status', 'active') // Filter at DB level
      .maybeSingle();

    if (error || !userData) {
      // User not found or inactive
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }

    user = {
      id: userData.id,
      email: userData.email,
      role: userData.role,
      status: userData.status,
    };
  } catch {
    // Token invalid or expired
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Business Logic: Check admin routes
  if (requiresAdmin(pathname)) {
    if (user.role !== 'admin' && user.role !== 'manager') {
      // Redirect to user's default dashboard
      const route = getDefaultRoute(user.role);
      return NextResponse.redirect(new URL(route, request.url));
    }
  }

  // Add user info to headers for use in pages (optional optimization)
  const response = NextResponse.next();
  response.headers.set('x-user-id', user.id);
  response.headers.set('x-user-role', user.role);

  return response;
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
    '/forgot-password',
    '/reset-password',
  ],
};
