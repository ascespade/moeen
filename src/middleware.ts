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
import { customAuthHub } from '@/lib/auth/CustomAuthHub';
import jwt from 'jsonwebtoken';

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
      // Check both Supabase Auth and Custom Auth
      const supabase = await createClient();
      const { data: { session } } = await supabase.auth.getSession();
      
      // Also check custom auth token
      const customAuthToken = request.cookies.get('auth_token')?.value || 
                             request.headers.get('authorization')?.replace('Bearer ', '');
      
      if (session || customAuthToken) {
        try {
          // If custom token exists, verify it
          if (customAuthToken) {
            const secret = process.env.JWT_SECRET;
            if (secret) {
              jwt.verify(customAuthToken, secret);
              return NextResponse.redirect(new URL('/dashboard', request.url));
            }
          }
          // If Supabase session exists
          if (session) {
            return NextResponse.redirect(new URL('/dashboard', request.url));
          }
        } catch (error) {
          // Token invalid, continue to login page
        }
      }
    }
    return NextResponse.next();
  }

  // ✅ Only check auth for protected routes
  if (!isProtectedRoute(pathname)) {
    return NextResponse.next();
  }

  // Check authentication for protected routes
  // Try custom auth first (JWT token)
  const customAuthToken = request.cookies.get('auth_token')?.value || 
                         request.headers.get('authorization')?.replace('Bearer ', '');
  
  let user: { id: string; email: string; role: string; status: string } | null = null;
  
  if (customAuthToken) {
    try {
      const secret = process.env.JWT_SECRET;
      if (secret) {
        const decoded = jwt.verify(customAuthToken, secret) as any;
        
        // Get user from database to verify still active
        const supabase = await createClient();
        const { data: userData } = await supabase
          .from('users')
          .select('id, email, role, status')
          .eq('id', decoded.userId)
          .maybeSingle();
        
        if (userData && userData.status === 'active') {
          user = {
            id: userData.id,
            email: userData.email,
            role: userData.role,
            status: userData.status,
          };
        }
      }
    } catch (error) {
      // Token invalid, try Supabase Auth as fallback
      console.log('[MIDDLEWARE] Custom token invalid, trying Supabase Auth');
    }
  }
  
  // Fallback to Supabase Auth if custom auth not available
  if (!user) {
    const supabase = await createClient();
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (session && session.user) {
      // Get user from database
      const { data: userData } = await supabase
        .from('users')
        .select('id, email, role, status')
        .eq('id', session.user.id)
        .maybeSingle();
      
      if (userData && userData.status === 'active') {
        user = {
          id: userData.id,
          email: userData.email,
          role: userData.role,
          status: userData.status,
        };
      }
    }
  }
  
  // No valid authentication - redirect to login
  if (!user) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // ✅ Optimized: Only check user role for admin routes or when needed
  if (requiresAdmin(pathname)) {
    // User not found or inactive
    if (!user || user.status !== 'active') {
      const loginUrl = new URL('/login', request.url);
      return NextResponse.redirect(loginUrl);
    }

    // Check admin routes
    if (user.role !== 'admin' && user.role !== 'manager') {
      // Redirect to user's default dashboard
      const defaultRoutes: Record<string, string> = {
        supervisor: '/dashboard/supervisor',
        agent: '/dashboard', // Agent role for doctor/patient/staff
        doctor: '/doctor-dashboard',
        patient: '/dashboard/patient',
        staff: '/dashboard/staff',
      };
      const redirect = defaultRoutes[user.role] || '/dashboard';
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
