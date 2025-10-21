import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// GET /api/chatbot/intents - جلب جميع النيات
export async function GET(request: NextRequest) {
  try {
    const { data: intents, error } = await supabase
      .from('chatbot_intents')
      .select('*')
      .order('priority', { ascending: true });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ intents });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/chatbot/intents - إنشاء نية جديدة
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      name,
      description,
      keywords,
      response_template,
      action_type,
      priority = 1,
    } = body;

    const { data: intent, error } = await supabase
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
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ intent }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
