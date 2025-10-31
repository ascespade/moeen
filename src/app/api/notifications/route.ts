import { NextRequest, NextResponse } from 'next/server';
import { realDB } from '@/lib/supabase-real';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const searchTerm = searchParams.get('search') || '';
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    const data = await realDB.searchUsers(searchTerm, 'notifications');

    return NextResponse.json({
      success: true,
      data: data.slice(offset, offset + limit),
      pagination: {
        total: data.length,
        limit,
        offset,
        hasMore: offset + limit < data.length,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch notifications' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Security: Require authentication and proper permissions for creating notifications
    const authResult = await requireAuth(['admin', 'supervisor', 'staff'])(request);
    if (!authResult.authorized || !authResult.user) {
      return NextResponse.json(
        { error: 'Unauthorized - Authentication required' },
        { status: 401 }
      );
    }

    // Check permissions using unified permission system
    const userPermissions = PermissionManager.getUserPermissions(
      authResult.user.role,
      authResult.user.meta?.permissions || []
    );

    if (!PermissionManager.canAccess(userPermissions, 'notifications', 'manage')) {
      return NextResponse.json(
        { error: 'Forbidden - Insufficient permissions' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const data = await realDB.createUser({
      ...body,
      role: 'notifications',
    });

    return NextResponse.json({
      success: true,
      data,
      message: 'notifications created successfully',
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create notifications' },
      { status: 500 }
    );
  }
}
