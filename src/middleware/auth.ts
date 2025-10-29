/**
 * Authentication Middleware
 * Protects routes based on user authentication and roles
 */

import { NextRequest, NextResponse } from 'next/server';

// Define protected routes and their required roles
const PROTECTED_ROUTES: Record<string, string[]> = {
  '/dashboard': ['admin', 'doctor', 'patient', 'staff', 'supervisor'],
  '/admin': ['admin'],
  '/appointments': ['admin', 'doctor', 'staff'],
  '/patients': ['admin', 'doctor', 'staff'],
  '/doctors': ['admin', 'staff'],
  '/reports': ['admin', 'supervisor'],
  '/settings': ['admin'],
  '/chatbot': ['admin'],
  '/crm': ['admin', 'staff'],
  '/analytics': ['admin', 'supervisor'],
  '/messages': ['admin', 'doctor', 'staff'],
  '/notifications': ['admin', 'doctor', 'patient', 'staff', 'supervisor'],
  '/profile': ['admin', 'doctor', 'patient', 'staff', 'supervisor'],
};

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
  '/test-crud', // Allow CRUD test page for testing
];

export async function authMiddleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow public routes
  if (PUBLIC_ROUTES.some(route => pathname.startsWith(route)) || 
      pathname.startsWith('/_next') || 
      pathname.startsWith('/api/auth/login') ||
      pathname.startsWith('/api/auth/register')) {
    return NextResponse.next();
  }

  // Get token from cookies or headers
  const token = request.cookies.get('auth_token')?.value || 
                request.headers.get('authorization')?.replace('Bearer ', '');

  // No token = redirect to login
  if (!token) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Verify token and get user data (simplified for now)
  // In production, you would verify JWT and get user role from database
  const userData = verifyToken(token);
  
  if (!userData) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Check role-based access
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

  return response;
}

// Simplified token verification (replace with proper JWT verification)
function verifyToken(token: string): { id: string; email: string; role: string } | null {
  try {
    // For testing purposes, decode a simple format
    // In production, use jsonwebtoken library
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
