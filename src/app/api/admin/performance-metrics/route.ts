/**
 * Admin Performance Metrics API
 * مقاييس الأداء - بيانات حقيقية من قاعدة البيانات
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { requireAuth } from '@/lib/auth/authorize';

export const revalidate = 60;

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const authResult = await requireAuth(['admin', 'supervisor'])(request);
    if (!authResult.authorized) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabase = await createClient();
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const limit = parseInt(searchParams.get('limit') || '50');

    // Get performance metrics from database (if table exists)
    // For now, return empty array - metrics should be collected from system logs
    let query = supabase
      .from('performance_metrics')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (category) {
      query = query.eq('category', category);
    }

    const { data: metrics, error } = await query;

    if (error) {
      // Table doesn't exist yet - return empty array (no mock data)
      console.error('Performance metrics table not found:', error);
      return NextResponse.json({
        success: true,
        data: [],
        message: 'Performance metrics table not configured yet',
      });
    }

    return NextResponse.json({
      success: true,
      data: metrics || [],
    });
  } catch (error) {
    console.error('Error fetching performance metrics:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch performance metrics',
        data: [],
      },
      { status: 500 }
    );
  }
}
