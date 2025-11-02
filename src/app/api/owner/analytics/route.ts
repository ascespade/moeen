import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { requireAuth } from '@
  try {
    // Security: Require authentication
    const authResult = await requireAuth(["admin"])(request);
    if (!authResult.authorized || !authResult.user) {
      return NextResponse.json(
        { error: 'Unauthorized - Authentication required' },
        { status: 401 }
      );
    }
/lib/auth/authorize';

export async function GET() {
  try {
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
