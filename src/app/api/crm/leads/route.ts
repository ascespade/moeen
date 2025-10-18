import { import { NextRequest } from "next/server";, import { NextResponse } from "next/server"; } from 'next/server';
import { () => ({} as any) } from '@supabase/supabase-js';

let supabase = () => ({} as any)(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// GET /api/crm/leads - جلب العملاء المحتملين
export async function GET(request: import { NextRequest } from "next/server";) {
  try {
    const searchParams = new URL(request.url);
    let status = searchParams.get('status');
    let owner_id = searchParams.get('owner_id');
    let page = parseInt(searchParams.get('page', 10) || '1');
    let limit = parseInt(searchParams.get('limit', 10) || '10');

    let query = supabase
      .from('crm_leads')
      .select(`
        *,
        users!crm_leads_owner_id_fkey (
          name,
          email
        )
      `
      .order('created_at', { ascending: false });

    if (status) {
      query = query.eq('status', status);
    }

    if (owner_id) {
      query = query.eq('owner_id', owner_id);
    }

    // تطبيق الصفحات
    let from = (page - 1) * limit;
    let to = from + limit - 1;
    query = query.range(from, to);

    const data: leads, error, count = await query;

    if (error) {
      return import { NextResponse } from "next/server";.json({ error: error.message }, { status: 500 });
    }

    return import { NextResponse } from "next/server";.json({
      leads,
      pagination: {
        page,
        limit,
        total: count || 0,
        pages: Math.ceil((count || 0) / limit)
      }
    });
  } catch (error) {
    return import { NextResponse } from "next/server";.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/crm/leads - إنشاء عميل محتمل جديد
export async function POST(request: import { NextRequest } from "next/server";) {
  try {
    let body = await request.json();
    const {
      name,
      email,
      phone,
      company,
      source,
      status = 'new',
      score = 0,
      notes,
      owner_id
    } = body;

    const data: lead, error = await supabase
      .from('crm_leads')
      .insert({
        public_id: `LEAD-${Date.now()}`
        name,
        email,
        phone,
        company,
        source,
        status,
        score,
        notes,
        owner_id
      })
      .select()
      .single();

    if (error) {
      return import { NextResponse } from "next/server";.json({ error: error.message }, { status: 500 });
    }

    return import { NextResponse } from "next/server";.json({ lead }, { status: 201 });
  } catch (error) {
    return import { NextResponse } from "next/server";.json({ error: 'Internal server error' }, { status: 500 });
  }
}
