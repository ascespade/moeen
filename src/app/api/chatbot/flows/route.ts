import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getServiceSupabase } from '@/lib/supabaseClient';
import { requireAuth } from '@/lib/auth/authorize';
import { ErrorHandler } from '@/core/errors';
import { logger } from '@/lib/logger';

// GET /api/chatbot/flows - جلب جميع التدفقات
export async function GET(request: NextRequest) {
  try {
    // Authorize any authenticated user
    const authResult = await requireAuth()(request);
    if (!authResult.authorized) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabase = await createClient();
    const { data: flows, error } = await supabase
      .from('chatbot_flows')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ flows });
  } catch (error) {
    logger.error('Error fetching chatbot flows', error);
    return ErrorHandler.getInstance().handle(error as Error);
  }
}

// POST /api/chatbot/flows - إنشاء تدفق جديد
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
    const { name, description, status = 'draft', created_by } = body;

    const { data: flow, error } = await supabaseAdmin
      .from('chatbot_flows')
      .insert({
        name,
        description,
        status,
        created_by,
        public_id: `FLOW-${Date.now()}`,
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ flow }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
