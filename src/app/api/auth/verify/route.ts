/**
 * Verify JWT Token API - Optimized
 * API التحقق من Token - محسّن
 *
 * ? Fast verification
 * ? Cached permissions
 * ? Clean response
 */

import { NextRequest, NextResponse } from 'next/server';
import { customAuthHub } from '@/lib/auth/CustomAuthHub';
import { logger } from '@/lib/utils/logger';

export async function POST(req: NextRequest) {
  try {
    const { token } = await req.json();

    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Token is required' },
        { status: 400 }
      );
    }

    // Verify token (optimized)
    const user = await customAuthHub.verifyToken(token);

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Invalid or expired token' },
        { status: 401 }
      );
    }

    // Get permissions (cached, fast)
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
    // Only log in development
    if (process.env.NODE_ENV === 'development') {
      logger.error('[VERIFY] Error:', { error });
    }

    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
