import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { logger } from '@/lib/logger';

export async function POST(request: NextRequest) {
  try {
    const errorData = await request.json();
    
    const supabase = createClient();

    // Store error in database
    const { error } = await supabase
      .from('error_logs')
      .insert({
        error_name: errorData.error?.name || 'Unknown',
        error_message: errorData.error?.message || 'Unknown error',
        error_stack: errorData.error?.stack || null,
        error_info: errorData.errorInfo || null,
        user_agent: errorData.userAgent || null,
        url: errorData.url || null,
        timestamp: errorData.timestamp || new Date().toISOString()
      });

    if (error) {
      logger.error('Failed to store error log:', error);
      return NextResponse.json(
        { error: 'Failed to store error log' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });

  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to process error report' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    const supabase = createClient();

    const { data: errors, error } = await supabase
      .from('error_logs')
      .select('*')
      .order('timestamp', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      return NextResponse.json({ error: 'Failed to fetch errors' }, { status: 500 });
    }

    return NextResponse.json({ errors });

  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch errors' },
      { status: 500 }
    );
  }
}