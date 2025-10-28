import { authorize } from '@/lib/auth/authorize';
import { NextRequest, NextResponse } from 'next/server';

// Role-based route protection
const roleRoutes = {
  '/patient': ['patient'],
  '/doctor': ['doctor', 'therapist'], // therapist is treated as doctor role
  '/staff': ['staff', 'nurse', 'supervisor', 'manager', 'admin'],
  '/supervisor': ['supervisor', 'manager', 'admin'],
  '/admin': ['admin'], // Admin only
  '/agent': ['agent', 'staff', 'supervisor', 'manager', 'admin'], // Agent access routes
};

export async function authMiddleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Skip auth for public routes
  if (
    pathname.startsWith('/api/health') ||
    pathname.startsWith('/api/translations') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/static') ||
    pathname === '/' ||
    pathname.startsWith('/login') ||
    pathname.startsWith('/register') ||
    pathname.startsWith('/public')
  ) {
    return NextResponse.next();
  }

  // Check if route requires specific role
  const requiredRole = Object.entries(roleRoutes).find(([route]) =>
    pathname.startsWith(route)
  );

  if (requiredRole) {
    const { user, error } = await authorize(request);

    if (error || !user) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    if (!requiredRole[1].includes(user.role)) {
      return NextResponse.redirect(new URL('/unauthorized', request.url));
    }

    // Add user info to headers for API routes
    const response = NextResponse.next();
    response.headers.set('x-user-id', user.id);
    response.headers.set('x-user-role', user.role);
    response.headers.set('x-user-email', user.email);

    return response;
  }

  return NextResponse.next();
}
