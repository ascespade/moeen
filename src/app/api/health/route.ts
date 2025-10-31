import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { ErrorHandler } from '@/core/errors';
import { logger } from '@/lib/logger';

export async function GET() {
  try {
    // Real database connection check
    const supabase = await createClient();
    const { error: dbError } = await supabase
      .from('users')
      .select('count')
      .limit(1);
    
    const dbConnected = !dbError;
    const timestamp = new Date().toISOString();

    if (!dbConnected) {
      logger.error('Health check: Database connection failed', dbError);
      return NextResponse.json(
        {
          success: false,
          error: 'Database connection failed',
          timestamp,
          details: dbError?.message,
        },
        { status: 503 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        status: 'healthy',
        database: 'connected',
        timestamp,
        version: '1.0.0',
      },
      message: 'System is healthy',
    });
  } catch (error) {
    logger.error('Health check failed', error);
    return ErrorHandler.getInstance().handle(error as Error);
  }
}
