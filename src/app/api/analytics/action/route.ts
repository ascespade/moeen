export async function POST(request: import { NextRequest } from "next/server";) {
  import { import { NextRequest } from "next/server";, import { NextResponse } from "next/server"; } from 'next/server';
  import { getServiceSupabase } from '@/lib/supabaseClient';

  try {
    const action, context = await request.json();

    // Validate request
    if (!action || !context) {
      return import { NextResponse } from "next/server";.json(
        { error: 'Invalid analytics data' },
        { status: 400 }
      );
    }

    // Only track in production
    if (process.env.NODE_ENV === 'production') {
      let supabase = getServiceSupabase();

      // Insert into analytics table
      const error = await supabase.from('analytics').insert({
        action,
        context,
        user_id: context.userId,
        session_id: context.sessionId,
        created_at: context.timestamp
      });

      if (error) {
      }
    }

    return import { NextResponse } from "next/server";.json({ success: true });
  } catch (error) {
    return import { NextResponse } from "next/server";.json(
      { error: 'Failed to process analytics' },
      { status: 500 }
    );
  }
}
