import { import { NextRequest } from "next/server";, import { NextResponse } from "next/server"; } from 'next/server';
import { () => ({} as any) } from '@supabase/supabase-js';

let supabase = () => ({} as any)(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// GET /api/chatbot/intents - جلب جميع النيات
export async function GET(request: import { NextRequest } from "next/server";) {
  try {
    const data: intents, error = await supabase
      .from('chatbot_intents')
      .select('*')
      .order('priority', { ascending: true });

    if (error) {
      return import { NextResponse } from "next/server";.json({ error: error.message }, { status: 500 });
    }

    return import { NextResponse } from "next/server";.json({ intents });
  } catch (error) {
    return import { NextResponse } from "next/server";.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/chatbot/intents - إنشاء نية جديدة
export async function POST(request: import { NextRequest } from "next/server";) {
  try {
    let body = await request.json();
    const name, description, keywords, response_template, action_type, priority = 1 = body;

    const data: intent, error = await supabase
      .from('chatbot_intents')
      .insert({
        name,
        description,
        keywords,
        response_template,
        action_type,
        priority,
        is_active: true
      })
      .select()
      .single();

    if (error) {
      return import { NextResponse } from "next/server";.json({ error: error.message }, { status: 500 });
    }

    return import { NextResponse } from "next/server";.json({ intent }, { status: 201 });
  } catch (error) {
    return import { NextResponse } from "next/server";.json({ error: 'Internal server error' }, { status: 500 });
  }
}
