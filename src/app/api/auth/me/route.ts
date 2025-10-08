import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

// Mock user database (in production, use a real database)
const mockUsers = [
  {
    id: '1',
    email: 'admin@mu3een.com',
    name: 'Admin User',
    role: 'admin' as const,
    avatar: null,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: '2',
    email: 'user@mu3een.com',
    name: 'Regular User',
    role: 'user' as const,
    avatar: null,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
];

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('auth-token')?.value;
    
    if (!token) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Authentication required',
          code: 'AUTHENTICATION_REQUIRED' 
        },
        { status: 401 }
      );
    }

    const jwtSecret = process.env.JWT_SECRET || 'fallback-secret-key';
    
    try {
      const decoded = jwt.verify(token, jwtSecret) as { userId: string; email: string; role: string };
      
      // Find user
      const user = mockUsers.find(u => u.id === decoded.userId);
      if (!user) {
        return NextResponse.json(
          { 
            success: false, 
            error: 'User not found',
            code: 'USER_NOT_FOUND' 
          },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        data: {
          user,
        },
      });

    } catch (_jwtError) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Invalid or expired token',
          code: 'INVALID_TOKEN' 
        },
        { status: 401 }
      );
    }

  } catch (error) {
    console.error('Get user error:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Internal server error',
        code: 'INTERNAL_ERROR' 
      },
      { status: 500 }
    );
  }
}