import { NextRequest, NextResponse } from 'next/server';
import { realDB } from '@/lib/supabase-real';
import { requireAuth } from '@/lib/auth/authorize';
import { PermissionManager } from '@/lib/permissions';

export async function GET(request: NextRequest) {
  try {
    // Security: Require authentication and proper permissions for CRM data
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

    if (!PermissionManager.canAccess(userPermissions, 'crm', 'view')) {
      return NextResponse.json(
        { error: 'Forbidden - Insufficient permissions' },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const searchTerm = searchParams.get('search') || '';
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    const data = await realDB.searchUsers(searchTerm, 'crm');

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
    return NextResponse.json({ error: 'Failed to fetch crm' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    // Security: Require authentication for creating CRM records
    const authResult = await requireAuth(['admin', 'staff'])(request);
    if (!authResult.authorized) {
      return NextResponse.json(
        { error: 'Unauthorized - Authentication required' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const data = await realDB.createUser({
      ...body,
      role: 'crm',
    });

    return NextResponse.json({
      success: true,
      data,
      message: 'crm created successfully',
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create crm' },
      { status: 500 }
    );
  }
}
