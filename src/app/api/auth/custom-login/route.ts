/**
 * Simple Login API - Clean & Simple
 */

import { customAuthHub } from '@/lib/auth/CustomAuthHub';
import jwt from 'jsonwebtoken';
import { NextRequest, NextResponse } from 'next/server';
import { logger } from '@/lib/utils/logger';

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Login
    const result = await customAuthHub.login(email, password);

    if (!result.user || !result.token) {
      return NextResponse.json(
        { success: false, error: result.error || 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Get permissions
    const permissions = await customAuthHub.getUserPermissions(result.user.id);

    // Generate JWT token (always ensure it's a proper JWT)
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      return NextResponse.json(
        { success: false, error: 'Server configuration error' },
        { status: 500 }
      );
    }

    // Always generate fresh JWT with all required fields
    const jwtToken = jwt.sign(
      {
        userId: result.user.id,
        email: result.user.email,
        role: result.user.role,
        status: result.user.status || 'active',
      },
      jwtSecret,
      {
        expiresIn: process.env.JWT_EXPIRES_IN || '7d',
      }
    );

    // Create response
    const response = NextResponse.json({
      success: true,
      data: {
        user: {
          id: result.user.id,
          email: result.user.email,
          name: result.user.name,
          role: result.user.role,
          avatar: result.user.avatar_url,
          status: result.user.status,
        },
        token: jwtToken,
        permissions: permissions || null,
      },
    });

    // Set cookie (important: same domain, path, and settings)
    const isProduction = process.env.NODE_ENV === 'production';
    response.cookies.set('auth_token', jwtToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    });

    return response;
  } catch (error) {
    logger.error('[LOGIN] Error:', error, {});
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
