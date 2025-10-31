import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getServiceSupabase } from '@/lib/supabaseClient';
import { requireAuth } from '@/lib/auth/authorize';
import { ErrorHandler } from '@/core/errors';
import { logger } from '@/lib/logger';

// GET /api/healthcare/patients - جلب المرضى
export async function GET(request: NextRequest) {
  try {
    // Authorize staff, supervisor, doctor, or admin
    const authResult = await requireAuth(['staff', 'supervisor', 'doctor', 'admin'])(request);
    if (!authResult.authorized) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabase = await createClient();
    const supabaseAdmin = getServiceSupabase();
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    const gender = searchParams.get('gender');
    const age_min = searchParams.get('age_min');
    const age_max = searchParams.get('age_max');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');

    let query = supabaseAdmin
      .from('patients')
      .select(
        `
        *,
        customers (
          id,
          name,
          phone,
          email
        )
      `
      )
      .order('created_at', { ascending: false });

    // تطبيق الفلاتر
    if (search) {
      query = query.or(
        `first_name.ilike.%${search}%,last_name.ilike.%${search}%,phone.ilike.%${search}%`
      );
    }

    if (gender) {
      query = query.eq('gender', gender);
    }

    if (age_min) {
      const min_date = new Date();
      min_date.setFullYear(min_date.getFullYear() - parseInt(age_min));
      query = query.lte('date_of_birth', min_date.toISOString().split('T')[0]);
    }

    if (age_max) {
      const max_date = new Date();
      max_date.setFullYear(max_date.getFullYear() - parseInt(age_max));
      query = query.gte('date_of_birth', max_date.toISOString().split('T')[0]);
    }

    // تطبيق الصفحات
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    query = query.range(from, to);

    const { data: patients, error, count } = await query;

    if (error) {
      logger.error('Error fetching patients', error);
      return ErrorHandler.getInstance().handle(error as Error);
    }

    return NextResponse.json({
      patients,
      pagination: {
        page,
        limit,
        total: count || 0,
        pages: Math.ceil((count || 0) / limit),
      },
    });
  } catch (error) {
    logger.error('Error in healthcare patients GET', error);
    return ErrorHandler.getInstance().handle(error as Error);
  }
}

// POST /api/healthcare/patients - إنشاء مريض جديد
export async function POST(request: NextRequest) {
  try {
    // Authorize staff, supervisor, doctor, or admin
    const authResult = await requireAuth(['staff', 'supervisor', 'doctor', 'admin'])(request);
    if (!authResult.authorized) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabase = await createClient();
    const supabaseAdmin = getServiceSupabase();
    const body = await request.json();
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
      customer_id,
    } = body;

    const { data: patient, error } = await supabaseAdmin
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
        is_active: true,
      })
      .select()
      .single();

    if (error) {
      logger.error('Error creating patient', error);
      return ErrorHandler.getInstance().handle(error as Error);
    }

    return NextResponse.json({ patient }, { status: 201 });
  } catch (error) {
    logger.error('Error in healthcare patients POST', error);
    return ErrorHandler.getInstance().handle(error as Error);
  }
}
