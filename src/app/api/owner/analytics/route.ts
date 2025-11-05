import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth/authorize';

export const revalidate = 60;

export async function GET(request: NextRequest) {
  try {
    // Security: Require authentication
    const authResult = await requireAuth(['admin'])(request);
    if (!authResult.authorized || !authResult.user) {
      return NextResponse.json(
        { error: 'Unauthorized - Authentication required' },
        { status: 401 }
      );
    }

    const supabase = await createClient();

    // Get system metrics
    const { data: metrics, error } = await supabase
      .from('system_metrics')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(30);

    if (error) throw error;

    return NextResponse.json({ metrics });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch analytics' },
      { status: 500 }
    );
  }
}
