import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

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
      const supabase = createClient();
      
      // Insert into analytics table
      const { error } = await supabase
        .from('analytics')
        .insert({
          action,
          context,
          user_id: context.userId,
          session_id: context.sessionId,
          created_at: context.timestamp,
        });

      if (error) {
        console.error('Failed to log analytics:', error);
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error processing analytics:', error);
    return NextResponse.json(
      { error: 'Failed to process analytics' },
      { status: 500 }
    );
  }
}