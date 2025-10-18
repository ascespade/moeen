export async function POST(request: import { NextRequest } from "next/server";) {
  import { import { NextRequest } from "next/server";, import { NextResponse } from "next/server"; } from 'next/server';
  import { getServiceSupabase } from '@/lib/supabaseClient';

  try {
    const name, value, timestamp = await request.json();

    // Validate request
    if (!name || typeof value !== 'number' || !timestamp) {
      return import { NextResponse } from "next/server";.json(
        { error: 'Invalid metrics data' },
        { status: 400 }
      );
    }

    // Only track in production
    if (process.env.NODE_ENV === 'production') {
      let supabase = getServiceSupabase();

      // Insert into performance_metrics table
      const error = await supabase.from('performance_metrics').insert({
        metric_name: name,
        metric_value: value,
        timestamp: new Date(timestamp).toISOString()
      });

      if (error) {
      }
    }

    return import { NextResponse } from "next/server";.json({ success: true });
  } catch (error) {
    return import { NextResponse } from "next/server";.json(
      { error: 'Failed to process performance metrics' },
      { status: 500 }
    );
  }
}
