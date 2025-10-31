import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { requireAuth } from '@/lib/auth/authorize';
import { ErrorHandler } from '@/core/errors';

// GET /api/crm/leads - جلب العملاء المحتملين
export async function GET(request: NextRequest) {
  try {
    // Authorize staff, supervisor, or admin
    const authResult = await requireAuth(['staff', 'supervisor', 'admin'])(request);
    if (!authResult.authorized) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabase = await createClient();
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const owner_id = searchParams.get('owner_id');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');

    let query = supabase
      .from('crm_leads')
      .select(
        `
        *,
        users!crm_leads_owner_id_fkey (
          name,
          email
        )
      `
      )
      .order('created_at', { ascending: false });

    if (status) {
      query = query.eq('status', status);
    }

    if (owner_id) {
      query = query.eq('owner_id', owner_id);
    }

    // تطبيق الصفحات
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    query = query.range(from, to);

    const { data: leads, error, count } = await query;

    if (error) {
      return ErrorHandler.getInstance().handle(error as Error);
    }

    return NextResponse.json({
      leads,
      pagination: {
        page,
        limit,
        total: count || 0,
        pages: Math.ceil((count || 0) / limit),
      },
    });
  } catch (error) {
    return ErrorHandler.getInstance().handle(error as Error);
  }
}

// POST /api/crm/leads - إنشاء عميل محتمل جديد
export async function POST(request: NextRequest) {
  try {
    // Authorize staff, supervisor, or admin
    const authResult = await requireAuth(['staff', 'supervisor', 'admin'])(request);
    if (!authResult.authorized) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabase = await createClient();
    const body = await request.json();
    const {
      name,
      email,
      phone,
      company,
      source,
      status = 'new',
      score = 0,
      notes,
      owner_id,
    } = body;

    const { data: lead, error } = await supabase
      .from('crm_leads')
      .insert({
        public_id: `LEAD-${Date.now()}`,
        name,
        email,
        phone,
        company,
        source,
        status,
        score,
        notes,
        owner_id,
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ lead }, { status: 201 });
  } catch (error) {
    return ErrorHandler.getInstance().handle(error as Error);
  }
}
