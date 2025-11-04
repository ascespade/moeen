/**
 * Get User Permissions API
 * API الحصول على صلاحيات المستخدم
 */

import { NextRequest, NextResponse } from 'next/server';
import { customAuthHub } from '@/lib/auth/CustomAuthHub';
import jwt from 'jsonwebtoken';

export const revalidate = 60;

export async function GET(req: NextRequest) {
  try {
    // Get token from cookie or header
    const token =
      req.cookies.get('auth_token')?.value ||
      req.headers.get('authorization')?.replace('Bearer ', '');

    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Not authenticated' },
        { status: 401 }
      );
    }

    // Verify token
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      return NextResponse.json(
        { success: false, error: 'Server configuration error' },
        { status: 500 }
      );
    }

    const decoded = jwt.verify(token, secret) as any;

    // Get permissions
    const permissions = await customAuthHub.getUserPermissions(decoded.userId);

    if (!permissions) {
      return NextResponse.json(
        { success: false, error: 'Could not fetch permissions' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      permissions,
    });
  } catch (error) {
    console.error('Get permissions error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
