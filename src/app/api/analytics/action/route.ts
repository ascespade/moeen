import { NextRequest, NextResponse } from 'next/server';
import { getServiceSupabase } from '@/lib/supabaseClient';
import { requireAuth } from '@/lib/auth/authorize';
  try {
    // Security: Require authentication
    const authResult = await requireAuth(["admin"])(request: NextRequest);
    if (!authResult.authorized || !authResult.user) {
      return NextResponse.json(
        { error: 'Unauthorized - Authentication required' },
        { status: 401 }
      );
    }


export async function POST(request: NextRequest) {
  try {
    const { action, context } = await request.json();

    // Validate request
    if (!action || !context) {
      return NextResponse.json(
        { error: 'Invalid analytics data' },
        { status: 400 }
      );
    }

    // Only track in production
    if (process.env.NODE_ENV === 'production') {
      const supabase = getServiceSupabase();

      // Insert into analytics table
      const { error } = await supabase.from('analytics').insert({
        action,
        context,
        user_id: context.userId,
        session_id: context.sessionId,
        created_at: context.timestamp,
      });

      if (error) {
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to process analytics' },
      { status: 500 }
    );
  }
}
