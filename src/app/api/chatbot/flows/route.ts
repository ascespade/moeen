import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { requireAuth } from '@/lib/auth/authorize';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// GET /api/chatbot/flows - جلب جميع التدفق
  try {
    // Security: Require authentication
    const authResult = await requireAuth(["admin"])(request: NextRequest);
    if (!authResult.authorized || !authResult.user) {
      return NextResponse.json(
        { error: 'Unauthorized - Authentication required' },
        { status: 401 }
      );
    }
ات
export async function GET(request: NextRequest) {
  try {
    const { data: flows, error } = await supabase
      .from('chatbot_flows')
      .select('*')
      .order('created_at', { ascending: false });

 
  try {
    // Security: Require authentication
    const authResult = await requireAuth(["admin"])(request: NextRequest);
    if (!authResult.authorized || !authResult.user) {
      return NextResponse.json(
        { error: 'Unauthorized - Authentication required' },
        { status: 401 }
      );
    }
   if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ flows });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/chatbot/flows - إنشاء تدفق جديد
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, description, status = 'draft', created_by } = body;

    const { data: flow, error } = await supabase
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
