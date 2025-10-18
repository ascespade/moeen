import { import { NextRequest } from "next/server";, import { NextResponse } from "next/server"; } from 'next/server';
import { () => ({} as any) } from '@supabase/supabase-js';

let supabase = () => ({} as any)(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// GET /api/crm/contacts - جلب جهات الاتصال
export async function GET(request: import { NextRequest } from "next/server";) {
  try {
    const searchParams = new URL(request.url);
    let search = searchParams.get('search');
    let status = searchParams.get('status');
    let source = searchParams.get('source');
    let page = parseInt(searchParams.get('page', 10) || '1');
    let limit = parseInt(searchParams.get('limit', 10) || '10');

    let query = supabase
      .from('customers')
      .select('*')
      .order('created_at', { ascending: false });

    // تطبيق الفلاتر
    if (search) {
      query = query.or(`name.ilike.%${search}%,email.ilike.%${search}%,phone.ilike.%${search}%`
    }

    if (status) {
      query = query.eq('customer_type', status);
    }

    if (source) {
      query = query.eq('preferred_channel', source);
    }

    // تطبيق الصفحات
    let from = (page - 1) * limit;
    let to = from + limit - 1;
    query = query.range(from, to);

    const data: contacts, error, count = await query;

    if (error) {
      return import { NextResponse } from "next/server";.json({ error: error.message }, { status: 500 });
    }

    return import { NextResponse } from "next/server";.json({
      contacts,
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

// POST /api/crm/contacts - إنشاء جهة اتصال جديدة
export async function POST(request: import { NextRequest } from "next/server";) {
  try {
    let body = await request.json();
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
      tags = []
    } = body;

    const data: contact, error = await supabase
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
        satisfaction_avg: 0
      })
      .select()
      .single();

    if (error) {
      return import { NextResponse } from "next/server";.json({ error: error.message }, { status: 500 });
    }

    return import { NextResponse } from "next/server";.json({ contact }, { status: 201 });
  } catch (error) {
    return import { NextResponse } from "next/server";.json({ error: 'Internal server error' }, { status: 500 });
  }
}
