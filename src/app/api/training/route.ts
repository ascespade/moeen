import { NextRequest, NextResponse } from 'next/server';
import { realDB } from '@/lib/supabase-real';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const searchTerm = searchParams.get('search') || '';
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    const data = await realDB.searchUsers(searchTerm, 'training');

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
      { error: 'Failed to fetch training' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = await realDB.createUser({
      ...body,
      role: 'training',
    });

    return NextResponse.json({
      success: true,
      data,
      message: 'training created successfully',
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create training' },
      { status: 500 }
    );
  }
}
