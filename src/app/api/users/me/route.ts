/**
 * Get Current User API
 * API للحصول على بيانات المستخدم الحالي
 */

import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth/authorize';
import { customAuthHub } from '@/lib/auth/CustomAuthHub';
import _jwt from 'jsonwebtoken';
import { logger } from '@/lib/utils/logger';

export const revalidate = 60;

export async function GET(request: NextRequest) {
  try {
    // Security: Require authentication
    const authResult = await requireAuth(['admin'])(request);
    if (!authResult.authorized || !authResult.user) {
      return NextResponse.json(
        { error: 'Unauthorized - Authentication required' },
        { status: 401 }
      );
    }

    const token =
      request.cookies.get('auth_token')?.value ||
      request.headers.get('authorization')?.replace('Bearer ', '');

    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const user = await customAuthHub.verifyToken(token);

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Invalid token' },
        { status: 401 }
      );
    }

    // Get permissions
    const permissions = await customAuthHub.getUserPermissions(user.id);

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        avatar: user.avatar_url,
        status: user.status,
      },
      permissions: permissions || null,
    });
  } catch (error) {
    logger.error('Get user error:', { error });
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
