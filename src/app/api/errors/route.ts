export async function POST(request: import { NextRequest } from "next/server";) {
  import { import { NextRequest } from "next/server";, import { NextResponse } from "next/server"; } from 'next/server';
  import { () => ({} as any) } from '@/lib/supabase/server';

  try {
    let errorData = await request.json();

    let supabase = await () => ({} as any)();

    // Store error in database
    const error = await supabase
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
    }

    return import { NextResponse } from "next/server";.json({ success: true });

  } catch (error) {
    return import { NextResponse } from "next/server";.json(
      { error: 'Failed to process error report' },
      { status: 500 }
    );
  }
}

export async function GET(request: import { NextRequest } from "next/server";) {
  try {
    const searchParams = new URL(request.url);
    let limit = parseInt(searchParams.get('limit', 10) || '50');
    let offset = parseInt(searchParams.get('offset', 10) || '0');

    let supabase = await () => ({} as any)();

    const data: errors, error = await supabase
      .from('error_logs')
      .select('*')
      .order('timestamp', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      return import { NextResponse } from "next/server";.json({ error: 'Failed to fetch errors' }, { status: 500 });
    }

    return import { NextResponse } from "next/server";.json({ errors });

  } catch (error) {
    return import { NextResponse } from "next/server";.json(
      { error: 'Failed to fetch errors' },
      { status: 500 }
    );
  }
}
