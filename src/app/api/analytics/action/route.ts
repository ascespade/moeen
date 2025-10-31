import { NextRequest, NextResponse } from 'next/server';
import { getServiceSupabase } from '@/lib/supabaseClient';
import { requireAuth } from '@/lib/auth/authorize';
import { ErrorHandler } from '@/core/errors';
import { logger } from '@/lib/logger';
import { z } from 'zod';

const analyticsSchema = z.object({
  action: z.string().min(1),
  context: z.object({
    userId: z.string().optional(),
    sessionId: z.string().optional(),
    timestamp: z.string().optional(),
  }),
});

export async function POST(request: NextRequest) {
  try {
    // Authorize any authenticated user
    const authResult = await requireAuth()(request);
    if (!authResult.authorized) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const body = await request.json();

    // Validate with Zod
    const validation = analyticsSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid analytics data', details: validation.error.issues },
        { status: 400 }
      );
    }

    const { action, context } = validation.data;

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
        logger.error('Failed to insert analytics', error);
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    logger.error('Failed to process analytics', error);
    return ErrorHandler.getInstance().handle(error as Error);
  }
}
