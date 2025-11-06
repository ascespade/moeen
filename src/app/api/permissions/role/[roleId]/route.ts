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
  } catch (error: unknown) {
    const { logger } = await import('@/lib/utils/logger');
    logger.error('[API] Error fetching role permissions', { error: error instanceof Error ? error.message : String(error) });
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch permissions',
      },
      { status: 500 }
    );
  }
}

