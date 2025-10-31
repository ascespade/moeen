import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth/authorize';
import { PermissionManager, ROLES } from '@/lib/permissions';

export async function GET(request: NextRequest) {
  try {
    // Use unified authentication system
    const authResult = await requireAuth()(request);

    if (!authResult.authorized || !authResult.user) {
      return NextResponse.json(
        { success: false, error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const userRole = authResult.user.role;

    // Get permissions using unified PermissionManager
    const permissions = PermissionManager.getRolePermissions(userRole);
    const roleData = ROLES[userRole];

    return NextResponse.json({
      success: true,
      data: {
        role: userRole,
        email: authResult.user.email,
        permissions: permissions || [],
        label: roleData?.name || userRole,
        labelAr: roleData?.name || userRole,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
