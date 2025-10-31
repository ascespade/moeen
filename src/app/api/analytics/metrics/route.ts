import { NextRequest, NextRequest as NextReq, NextResponse } from 'next/server';
import { getServiceSupabase } from '@/lib/supabaseClient';
import { requireAuth } from '@/lib/auth/authorize';
import { ErrorHandler } from '@/core/errors';
import { logger } from '@/lib/logger';
import { env } from '@/config/env';
import { z } from 'zod';

const metricsSchema = z.object({
  name: z.string().min(1),
  value: z.number(),
  timestamp: z.union([z.string(), z.number()]),
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
    const validation = metricsSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid metrics data', details: validation.error.issues },
        { status: 400 }
      );
    }

    const { name, value, timestamp } = validation.data;

    // Only track in production
    if (env.IS_PRODUCTION) {
      const supabase = getServiceSupabase();

      // Insert into performance_metrics table
      const { error } = await supabase.from('performance_metrics').insert({
        metric_name: name,
        metric_value: value,
        timestamp: new Date(timestamp).toISOString(),
      });

      if (error) {
        logger.error('Failed to insert performance metrics', error);
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    logger.error('Failed to process performance metrics', error);
    return ErrorHandler.getInstance().handle(error as Error);
  }
}
