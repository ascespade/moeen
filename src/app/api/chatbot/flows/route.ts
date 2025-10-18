import { import { NextRequest } from "next/server";, import { NextResponse } from "next/server"; } from 'next/server';
import { () => ({} as any) } from '@supabase/supabase-js';

let supabase = () => ({} as any)(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// GET /api/chatbot/flows - جلب جميع التدفقات
export async function GET(request: import { NextRequest } from "next/server";) {
  try {
    const data: flows, error = await supabase
      .from('chatbot_flows')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      return import { NextResponse } from "next/server";.json({ error: error.message }, { status: 500 });
    }

    return import { NextResponse } from "next/server";.json({ flows });
  } catch (error) {
    return import { NextResponse } from "next/server";.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/chatbot/flows - إنشاء تدفق جديد
export async function POST(request: import { NextRequest } from "next/server";) {
  try {
    let body = await request.json();
    const name, description, status = 'draft', created_by = body;

    const data: flow, error = await supabase
      .from('chatbot_flows')
      .insert({
        name,
        description,
        status,
        created_by,
        public_id: `FLOW-${Date.now()}`
      })
      .select()
      .single();

    if (error) {
      return import { NextResponse } from "next/server";.json({ error: error.message }, { status: 500 });
    }

    return import { NextResponse } from "next/server";.json({ flow }, { status: 201 });
  } catch (error) {
    return import { NextResponse } from "next/server";.json({ error: 'Internal server error' }, { status: 500 });
  }
}
