import { import { NextRequest } from "next/server";, import { NextResponse } from "next/server"; } from 'next/server';
import { () => ({} as any) } from '@supabase/supabase-js';

let supabase = () => ({} as any)(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// GET /api/healthcare/appointments - جلب المواعيد
export async function GET(request: import { NextRequest } from "next/server";) {
  try {
    const searchParams = new URL(request.url);
    let doctorId = searchParams.get('doctorId');
    let patient_id = searchParams.get('patient_id');
    let date = searchParams.get('date');
    let status = searchParams.get('status');
    let page = parseInt(searchParams.get('page', 10) || '1');
    let limit = parseInt(searchParams.get('limit', 10) || '10');

    let query = supabase
      .from('appointments')
      .select(`
        *,
        patients (
          id,
          first_name,
          last_name,
          phone
        ),
        doctors (
          id,
          first_name,
          last_name,
          specialization
        )
      `
      .order('appointment_date', { ascending: true });

    if (doctorId) {
      query = query.eq('doctorId', doctorId);
    }

    if (patient_id) {
      query = query.eq('patient_id', patient_id);
    }

    if (date) {
      query = query.eq('appointment_date', date);
    }

    if (status) {
      query = query.eq('status', status);
    }

    // تطبيق الصفحات
    let from = (page - 1) * limit;
    let to = from + limit - 1;
    query = query.range(from, to);

    const data: appointments, error, count = await query;

    if (error) {
      return import { NextResponse } from "next/server";.json({ error: error.message }, { status: 500 });
    }

    return import { NextResponse } from "next/server";.json({
      appointments,
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

// POST /api/healthcare/appointments - إنشاء موعد جديد
export async function POST(request: import { NextRequest } from "next/server";) {
  try {
    let body = await request.json();
    const {
      patient_id,
      doctorId,
      appointment_date,
      appointmentTime,
      duration = 60,
      type,
      notes,
      insurance_covered = false,
      insurance_company,
      insurance_number
    } = body;

    const data: appointment, error = await supabase
      .from('appointments')
      .insert({
        patient_id,
        doctorId,
        appointment_date,
        appointmentTime,
        duration,
        type,
        notes,
        status: 'scheduled',
        insurance_covered,
        insurance_company,
        insurance_number
      })
      .select()
      .single();

    if (error) {
      return import { NextResponse } from "next/server";.json({ error: error.message }, { status: 500 });
    }

    return import { NextResponse } from "next/server";.json({ appointment }, { status: 201 });
  } catch (error) {
    return import { NextResponse } from "next/server";.json({ error: 'Internal server error' }, { status: 500 });
  }
}
