import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getServiceSupabase } from '@/lib/supabaseClient';
import { requireAuth } from '@/lib/auth/authorize';
import { ErrorHandler } from '@/core/errors';
import { logger } from '@/lib/logger';

// GET /api/chatbot/intents - جلب جميع النيات
export async function GET(request: NextRequest) {
  try {
    // Authorize any authenticated user
    const authResult = await requireAuth()(request);
    if (!authResult.authorized) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabase = await createClient();
    const { data: intents, error } = await supabase
      .from('chatbot_intents')
      .select('*')
      .order('priority', { ascending: true });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ intents });
  } catch (error) {
    logger.error('Error fetching chatbot intents', error);
    return ErrorHandler.getInstance().handle(error as Error);
  }
}

// POST /api/chatbot/intents - إنشاء نية جديدة
export async function POST(request: NextRequest) {
  try {
    // Authorize admin or staff
    const authResult = await requireAuth(['admin', 'staff'])(request);
    if (!authResult.authorized) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabase = await createClient();
    const supabaseAdmin = getServiceSupabase();
    const body = await request.json();
    const {
      name,
      description,
      keywords,
      response_template,
      action_type,
      priority = 1,
    } = body;

    const { data: intent, error } = await supabaseAdmin
      .from('chatbot_intents')
      .insert({
        name,
        description,
        keywords,
        response_template,
        action_type,
        priority,
        is_active: true,
      })
      .select()
      .single();

    if (error) {
      logger.error('Error creating intent', error);
      return ErrorHandler.getInstance().handle(error as Error);
    }

    return NextResponse.json({ intent }, { status: 201 });
  } catch (error) {
    logger.error('Error in chatbot intents POST', error);
    return ErrorHandler.getInstance().handle(error as Error);
  }
}
