import { NextRequest, NextResponse } from 'next/server';
import { PermissionManager } from '@/lib/permissions';

export async function GET(
  _request: NextRequest,
  { params }: { params: { roleId: string } }
) {
  try {
    const { roleId } = params;

    if (!roleId) {
      return NextResponse.json(
        { success: false, error: 'Role ID is required' },
        { status: 400 }
      );
    }

    const permissions = await PermissionManager.getRolePermissions(roleId);

    return NextResponse.json({
      success: true,
      permissions,
    });
  } catch (error: any) {
    console.error('[API] Error fetching role permissions:', error);
    return NextResponse.json(
      {
        success: false,
        error: error?.message || 'Failed to fetch permissions',
      },
      { status: 500 }
    );
  }
}
