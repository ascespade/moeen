import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { requireAuth } from '@/lib/auth/authorize';
import { ErrorHandler } from '@/core/errors';

// GET /api/crm/contacts - جلب جهات الاتصال
export async function GET(request: NextRequest) {
  try {
    // Authorize staff, supervisor, or admin
    const authResult = await requireAuth(['staff', 'supervisor', 'admin'])(request);
    if (!authResult.authorized) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabase = await createClient();
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    const status = searchParams.get('status');
    const source = searchParams.get('source');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');

    let query = supabase
      .from('customers')
      .select('*')
      .order('created_at', { ascending: false });

    // تطبيق الفلاتر
    if (search) {
      query = query.or(
        `name.ilike.%${search}%,email.ilike.%${search}%,phone.ilike.%${search}%`
      );
    }

    if (status) {
      query = query.eq('customer_type', status);
    }

    if (source) {
      query = query.eq('preferred_channel', source);
    }

    // تطبيق الصفحات
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    query = query.range(from, to);

    const { data: contacts, error, count } = await query;

    if (error) {
      return ErrorHandler.getInstance().handle(error as Error);
    }

    return NextResponse.json({
      contacts,
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

// POST /api/crm/contacts - إنشاء جهة اتصال جديدة
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
      whatsapp,
      date_of_birth,
      gender,
      nationality,
      city,
      preferred_language = 'ar',
      preferred_channel,
      customer_type = 'individual',
      organization_name,
      notes,
      tags = [],
    } = body;

    const { data: contact, error } = await supabase
      .from('customers')
      .insert({
        name,
        email,
        phone,
        whatsapp,
        date_of_birth,
        gender,
        nationality,
        city,
        preferred_language,
        preferred_channel,
        customer_type,
        organization_name,
        notes,
        tags,
        is_active: true,
        total_conversations: 0,
        total_messages: 0,
        satisfaction_avg: 0,
      })
      .select()
      .single();

    if (error) {
      return ErrorHandler.getInstance().handle(error as Error);
    }

    return NextResponse.json({ contact }, { status: 201 });
  } catch (error) {
    return ErrorHandler.getInstance().handle(error as Error);
  }
}
