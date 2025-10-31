import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getServiceSupabase } from '@/lib/supabaseClient';
import { requireAuth } from '@/lib/auth/authorize';
import { ErrorHandler } from '@/core/errors';
import { logger } from '@/lib/logger';

// GET /api/healthcare/appointments - جلب المواعيد
export async function GET(request: NextRequest) {
  try {
    // Authorize any authenticated user
    const authResult = await requireAuth()(request);
    if (!authResult.authorized) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabase = await createClient();
    const supabaseAdmin = getServiceSupabase();
    const { searchParams } = new URL(request.url);
    const doctor_id = searchParams.get('doctor_id');
    const patient_id = searchParams.get('patient_id');
    const date = searchParams.get('date');
    const status = searchParams.get('status');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');

    let query = supabaseAdmin
      .from('appointments')
      .select(
        `
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
      )
      .order('appointment_date', { ascending: true });

    if (doctor_id) {
      query = query.eq('doctor_id', doctor_id);
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
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    query = query.range(from, to);

    const { data: appointments, error, count } = await query;

    if (error) {
      logger.error('Error fetching appointments', error);
      return ErrorHandler.getInstance().handle(error as Error);
    }

    return NextResponse.json({
      appointments,
      pagination: {
        page,
        limit,
        total: count || 0,
        pages: Math.ceil((count || 0) / limit),
      },
    });
  } catch (error) {
    logger.error('Error in healthcare appointments GET', error);
    return ErrorHandler.getInstance().handle(error as Error);
  }
}

// POST /api/healthcare/appointments - إنشاء موعد جديد
export async function POST(request: NextRequest) {
  try {
    // Authorize any authenticated user (patients, staff, doctors can create appointments)
    const authResult = await requireAuth()(request);
    if (!authResult.authorized) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabase = await createClient();
    const supabaseAdmin = getServiceSupabase();
    const body = await request.json();
    const {
      patient_id,
      doctor_id,
      appointment_date,
      appointment_time,
      duration = 60,
      type,
      notes,
      insurance_covered = false,
      insurance_company,
      insurance_number,
    } = body;

    const { data: appointment, error } = await supabaseAdmin
      .from('appointments')
      .insert({
        patient_id,
        doctor_id,
        appointment_date,
        appointment_time,
        duration,
        type,
        notes,
        status: 'scheduled',
        insurance_covered,
        insurance_company,
        insurance_number,
      })
      .select()
      .single();

    if (error) {
      logger.error('Error creating appointment', error);
      return ErrorHandler.getInstance().handle(error as Error);
    }

    return NextResponse.json({ appointment }, { status: 201 });
  } catch (error) {
    logger.error('Error in healthcare appointments POST', error);
    return ErrorHandler.getInstance().handle(error as Error);
  }
}
