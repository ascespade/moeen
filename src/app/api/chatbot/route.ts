import { NextRequest, NextResponse } from 'next/server';
import { realDB } from '@/lib/supabase-real';
import { requireAuth } from '@/lib/auth/authorize';
import { PermissionManager } from '@/lib/permissions';

export async function GET(request: NextRequest) {
  try {
    // Security: Require authentication and proper permissions
    const authResult = await requireAuth(['admin', 'supervisor', 'staff', 'agent'])(request);
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

    if (!PermissionManager.canAccess(userPermissions, 'chatbot', 'view')) {
      return NextResponse.json(
        { error: 'Forbidden - Insufficient permissions' },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const searchTerm = searchParams.get('search') || '';
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    const data = await realDB.searchUsers(searchTerm, 'chatbot');

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
      { error: 'Failed to fetch chatbot' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Security: Require authentication and proper permissions
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

    if (!PermissionManager.canAccess(userPermissions, 'chatbot', 'create')) {
      return NextResponse.json(
        { error: 'Forbidden - Insufficient permissions' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const data = await realDB.createUser({
      ...body,
      role: 'chatbot',
    });

    return NextResponse.json({
      success: true,
      data,
      message: 'chatbot created successfully',
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create chatbot' },
      { status: 500 }
    );
  }
}
