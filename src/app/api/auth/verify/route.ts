/**
 * Verify JWT Token API
 */

import { NextRequest, NextResponse } from 'next/server';
import { customAuthHub } from '@/lib/auth/CustomAuthHub';

export async function POST(req: NextRequest) {
  try {
    const { token } = await req.json();

    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Token is required' },
        { status: 400 }
      );
    }

    try {
      // Verify token
      const user = await customAuthHub.verifyToken(token);

      if (!user) {
        return NextResponse.json(
          { success: false, error: 'Invalid or expired token' },
          { status: 401 }
        );
      }

      // Get user permissions
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
    } catch (error: any) {
      // Handle JWT errors
      if (error.message?.includes('JWT_SECRET')) {
        return NextResponse.json(
          { success: false, error: 'JWT configuration error. Please check JWT_SECRET in .env file.' },
          { status: 500 }
        );
      }
      throw error;
    }
  } catch (error) {
    console.error('Verify token error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
