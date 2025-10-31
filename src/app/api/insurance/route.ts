import { NextRequest, NextResponse } from 'next/server';
import { realDB } from '@/lib/supabase-real';
import { requireAuth } from '@/lib/auth/authorize';
import { ErrorHandler } from '@/core/errors';

export async function GET(request: NextRequest) {
  try {
    // Authorize staff, supervisor, doctor, or admin
    const authResult = await requireAuth(['staff', 'supervisor', 'doctor', 'admin'])(request);
    if (!authResult.authorized) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
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
    return ErrorHandler.getInstance().handle(error as Error);
  }
}

export async function POST(request: NextRequest) {
  try {
    // Authorize supervisor or admin only
    const authResult = await requireAuth(['supervisor', 'admin'])(request);
    if (!authResult.authorized) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
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
    return ErrorHandler.getInstance().handle(error as Error);
  }
}
