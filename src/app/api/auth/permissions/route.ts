import { NextRequest, NextResponse } from 'next/server';
import { ROLES } from '@/constants/roles';
import { requireAuth } from '@/lib/auth/authorize';
import { ErrorHandler } from '@/core/errors';

export async function GET(request: NextRequest) {
  try {
    // Properly authenticate user
    const authResult = await requireAuth()(request);
    if (!authResult.authorized || !authResult.user) {
      return NextResponse.json(
        { success: false, error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const userRole = authResult.user.role;
    const userEmail = authResult.user.email;

    const roleData = ROLES[userRole as keyof typeof ROLES];

    return NextResponse.json({
      success: true,
      data: {
        role: userRole,
        email: userEmail,
        permissions: roleData?.permissions || [],
        label: roleData?.label || userRole,
        labelAr: roleData?.labelAr || userRole,
      },
    });
  } catch (error) {
    return ErrorHandler.getInstance().handle(error as Error);
  }
}
