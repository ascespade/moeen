import { requireAuth } from '@/lib/auth/authorize';
import { realDB } from '@/lib/supabase-real';
import { NextRequest, NextResponse } from 'next/server';

export const revalidate = 60;

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    // Security: Require authentication
    const authResult = await requireAuth(['admin'])(request);
    if (!authResult.authorized || !authResult.user) {
      return NextResponse.json(
        { error: 'Unauthorized - Authentication required' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const searchTerm = searchParams.get('search') || '';
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    const data = await realDB.searchUsers(searchTerm, 'insurance');

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
      { error: 'Failed to fetch insurance' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = await realDB.createUser({
      ...body,
      role: 'insurance',
    });

    return NextResponse.json({
      success: true,
      data,
      message: 'insurance created successfully',
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create insurance' },
      { status: 500 }
    );
  }
}
