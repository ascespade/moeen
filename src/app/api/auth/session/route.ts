import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth/authorize'
  try {
    // Security: Require authentication
    const authResult = await requireAuth(["admin"])(request);
    if (!authResult.authorized || !authResult.user) {
      return NextResponse.json(
        { error: 'Unauthorized - Authentication required' },
        { status: 401 }
      );
    }
;

export async function GET(request: NextRequest) {
  try {
    // Get token from cookie
    const token = request.cookies.get('auth_token')?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Not authenticated' },
        { status: 401 }
      );
    }

    // Decode token (simplified - use JWT in production)
    try {
      const decoded = JSON.parse(atob(token));

      return NextResponse.json({
        success: true,
        data: {
          id: decoded.id,
          email: decoded.email,
          role: decoded.role,
        },
      });
    } catch {
      return NextResponse.json(
        { success: false, error: 'Invalid token' },
        { status: 401 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
