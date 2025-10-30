/**
 * Authentication Middleware
 * Protects routes based on user authentication and roles
 * Uses Supabase sessions for secure authentication
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// Define protected routes and their required roles
const PROTECTED_ROUTES: Record<string, string[]> = {
  '/dashboard': ['admin', 'doctor', 'patient', 'staff', 'supervisor', 'manager'],
  '/admin': ['admin', 'manager', 'supervisor'],
  '/admin/admin': ['admin', 'manager'],
  '/appointments': ['admin', 'doctor', 'staff'],
  '/patients': ['admin', 'doctor', 'staff'],
  '/doctors': ['admin', 'staff'],
  '/reports': ['admin', 'supervisor'],
  '/settings': ['admin'],
  '/chatbot': ['admin'],
  '/crm': ['admin', 'staff', 'agent'],
  '/analytics': ['admin', 'supervisor'],
  '/messages': ['admin', 'doctor', 'staff'],
  '/notifications': ['admin', 'doctor', 'patient', 'staff', 'supervisor'],
  '/profile': ['admin', 'doctor', 'patient', 'staff', 'supervisor'],
};

// Admin-only routes (strict access)
const ADMIN_ONLY_ROUTES = [
  '/admin/settings',
  '/admin/system',
  '/admin/users',
  '/admin/roles',
];

// Public routes that don't require authentication
const PUBLIC_ROUTES = [
  '/',
  '/login',
  '/register',
  '/forgot-password',
  '/reset-password',
  '/about',
  '/contact',
  '/features',
  '/pricing',
  '/terms',
  '/privacy',
  '/faq',
  '/api/auth/login',
  '/api/auth/register',
  '/api/auth/logout',
];

export async function authMiddleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow public routes and API auth routes
  if (PUBLIC_ROUTES.some(route => pathname === route || pathname.startsWith(route)) || 
      pathname.startsWith('/_next') || 
      pathname.startsWith('/api/public')) {
    return NextResponse.next();
  }

  try {
    // Create Supabase client to check session
    const supabase = await createClient();

    // Get session from Supabase
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession();

    // No session = redirect to login
    if (!session || sessionError) {
    const isAdminRoute = pathname.startsWith('/admin') || 
                        Object.keys(PROTECTED_ROUTES).some(route => pathname.startsWith(route));
    
    if (isAdminRoute) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    } else {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

    // Get user data with role from database
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('id, email, role, status')
      .eq('id', session.user.id)
      .single();
    
    if (userError || !userData) {
      // User not found in database
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      loginUrl.searchParams.set('error', 'user_not_found');
      return NextResponse.redirect(loginUrl);
    }

    // Check if user is active
    if (userData.status !== 'active') {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      loginUrl.searchParams.set('error', 'account_inactive');
      return NextResponse.redirect(loginUrl);
    }

    // Check admin-only routes
    if (ADMIN_ONLY_ROUTES.some(route => pathname.startsWith(route))) {
      if (userData.role !== 'admin') {
        return NextResponse.redirect(new URL('/unauthorized', request.url));
      }
  }

    // Check role-based access for protected routes
  for (const [route, allowedRoles] of Object.entries(PROTECTED_ROUTES)) {
    if (pathname.startsWith(route)) {
      if (!allowedRoles.includes(userData.role)) {
        // User doesn't have permission
        return NextResponse.redirect(new URL('/unauthorized', request.url));
      }
    }
  }

  // Add user data to headers for downstream use
  const response = NextResponse.next();
  response.headers.set('x-user-id', userData.id);
  response.headers.set('x-user-role', userData.role);
  response.headers.set('x-user-email', userData.email);
    response.headers.set('x-session-id', session.access_token);

    // Refresh session if close to expiry (within 5 minutes)
    const expiresAt = session.expires_at ? new Date(session.expires_at * 1000) : null;
    if (expiresAt && expiresAt.getTime() - Date.now() < 5 * 60 * 1000) {
      // Session will expire soon, refresh it
      await supabase.auth.refreshSession();
    }

  return response;
  } catch (error) {
    console.error('Auth middleware error:', error);
    // On error, redirect to login
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    loginUrl.searchParams.set('error', 'auth_error');
    return NextResponse.redirect(loginUrl);
  }
}

// Helper-Middleware to verify session is still valid
export async function verifySession(request: NextRequest): Promise<{
  valid: boolean;
  user?: { id: string; email: string; role: string };
  error?: string;
}> {
  try {
    const supabase = await createClient();
    const { data: { session }, error } = await supabase.auth.getSession();

    if (error || !session) {
      return { valid: false, error: 'No valid session' };
    }

    const { data: userData } = await supabase
      .from('users')
      .select('id, email, role, status')
      .eq('id', session.user.id)
      .single();

    if (!userData || userData.status !== 'active') {
      return { valid: false, error: 'User not found or inactive' };
    }

    return {
      valid: true,
      user: {
        id: userData.id,
        email: userData.email,
        role: userData.role,
      },
    };
  } catch (error) {
    return { valid: false, error: 'Session verification failed' };
  }
}

// Legacy function for backward compatibility (uses localStorage token)
function verifyToken(token: string): { id: string; email: string; role: string } | null {
  try {
    // For testing purposes, decode a simple format
    if (token === 'test-token') {
      return {
        id: 'test-user-id',
        email: 'test@moeen.com',
        role: 'admin'
      };
    }
    
    // Try to parse as JSON (temporary solution)
    const decoded = JSON.parse(atob(token));
    return decoded;
  } catch {
    return null;
  }
}

export function generateToken(user: { id: string; email: string; role: string }): string {
  // Simple token generation (replace with JWT in production)
  return btoa(JSON.stringify(user));
}
