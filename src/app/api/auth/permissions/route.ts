import { NextRequest, NextResponse } from 'next/server';
import { ROLES } from '@/constants/roles';

export async function GET(request: NextRequest) {
  try {
    // Get user role from headers (set by auth middleware)
    const userRole = request.headers.get('x-user-role') as any;
    const userEmail = request.headers.get('x-user-email');

    if (!userRole) {
      return NextResponse.json(
        { success: false, error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const roleData = ROLES[userRole];

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
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
