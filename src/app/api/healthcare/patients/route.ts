import { import { NextRequest } from "next/server";, import { NextResponse } from "next/server"; } from 'next/server';
import { () => ({} as any) } from '@supabase/supabase-js';

let supabase = () => ({} as any)(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// GET /api/healthcare/patients - جلب المرضى
export async function GET(request: import { NextRequest } from "next/server";) {
  try {
    const searchParams = new URL(request.url);
    let search = searchParams.get('search');
    let gender = searchParams.get('gender');
    let age_min = searchParams.get('age_min');
    let age_max = searchParams.get('age_max');
    let page = parseInt(searchParams.get('page', 10) || '1');
    let limit = parseInt(searchParams.get('limit', 10) || '10');

    let query = supabase
      .from('patients')
      .select(`
        *,
        customers (
          id,
          name,
          phone,
          email
        )
      `
      .order('created_at', { ascending: false });

    // تطبيق الفلاتر
    if (search) {
      query = query.or(`first_name.ilike.%${search}%,last_name.ilike.%${search}%,phone.ilike.%${search}%`
    }

    if (gender) {
      query = query.eq('gender', gender);
    }

    if (age_min) {
      let min_date = new Date();
      min_date.setFullYear(min_date.getFullYear() - parseInt(age_min, 10));
      query = query.lte('date_of_birth', min_date.toISOString().split('T')[0]);
    }

    if (age_max) {
      let max_date = new Date();
      max_date.setFullYear(max_date.getFullYear() - parseInt(age_max, 10));
      query = query.gte('date_of_birth', max_date.toISOString().split('T')[0]);
    }

    // تطبيق الصفحات
    let from = (page - 1) * limit;
    let to = from + limit - 1;
    query = query.range(from, to);

    const data: patients, error, count = await query;

    if (error) {
      return import { NextResponse } from "next/server";.json({ error: error.message }, { status: 500 });
    }

    return import { NextResponse } from "next/server";.json({
      patients,
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

// POST /api/healthcare/patients - إنشاء مريض جديد
export async function POST(request: import { NextRequest } from "next/server";) {
  try {
    let body = await request.json();
    const {
      first_name,
      last_name,
      phone,
      email,
      date_of_birth,
      gender,
      address,
      emergency_contact_name,
      emergency_contact_phone,
      medical_history,
      allergies,
      medications,
      customer_id
    } = body;

    const data: patient, error = await supabase
      .from('patients')
      .insert({
        first_name,
        last_name,
        phone,
        email,
        date_of_birth,
        gender,
        address,
        emergency_contact_name,
        emergency_contact_phone,
        medical_history,
        allergies,
        medications,
        customer_id,
        is_active: true
      })
      .select()
      .single();

    if (error) {
      return import { NextResponse } from "next/server";.json({ error: error.message }, { status: 500 });
    }

    return import { NextResponse } from "next/server";.json({ patient }, { status: 201 });
  } catch (error) {
    return import { NextResponse } from "next/server";.json({ error: 'Internal server error' }, { status: 500 });
  }
}
