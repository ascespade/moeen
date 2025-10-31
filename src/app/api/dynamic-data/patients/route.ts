import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getServiceSupabase } from '@/lib/supabaseClient';
import { requireAuth } from '@/lib/auth/authorize';
import { ErrorHandler } from '@/core/errors';
import { logger } from '@/lib/logger';

// API لجلب معلومات المرضى من الجدول الموجود
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
    const includeUsers = searchParams.get('include_users') === 'true';
    const gender = searchParams.get('gender');
    const ageRange = searchParams.get('age_range'); // e.g., "0-18", "18-65", "65+"

    let query;

    if (includeUsers) {
      // استخدام الدالة الذكية التي تجلب المرضى مع معلومات المستخدمين
      const { data, error } = await supabaseAdmin.rpc('get_patients_with_users');

      if (error) {
        logger.error('Error in get_patients RPC', error);
        return ErrorHandler.getInstance().handle(error as Error);
      }

      // فلترة حسب الجنس إذا طُلب ذلك
      let filteredData = data;
      if (gender) {
        filteredData = data?.filter(
          (patient: any) =>
            patient.gender?.toLowerCase() === gender.toLowerCase()
        );
      }

      // فلترة حسب العمر إذا طُلب ذلك
      if (ageRange && filteredData) {
        const now = new Date();
        filteredData = filteredData.filter((patient: any) => {
          if (!patient.date_of_birth) return false;

          const birthDate = new Date(patient.date_of_birth);
          const age = now.getFullYear() - birthDate.getFullYear();

          switch (ageRange) {
            case '0-18':
              return age >= 0 && age <= 18;
            case '18-65':
              return age >= 18 && age <= 65;
            case '65+':
              return age > 65;
            default:
              return true;
          }
        });
      }

      return NextResponse.json({ patients: filteredData });
    } else {
      // استخدام الدالة البسيطة
      const { data, error } = await supabaseAdmin.rpc('get_patients_info');

      if (error) {
        logger.error('Error in get_patients RPC', error);
        return ErrorHandler.getInstance().handle(error as Error);
      }

      // فلترة حسب الجنس إذا طُلب ذلك
      let filteredData = data;
      if (gender) {
        filteredData = data?.filter(
          (patient: any) =>
            patient.gender?.toLowerCase() === gender.toLowerCase()
        );
      }

      // فلترة حسب العمر إذا طُلب ذلك
      if (ageRange && filteredData) {
        const now = new Date();
        filteredData = filteredData.filter((patient: any) => {
          if (!patient.date_of_birth) return false;

          const birthDate = new Date(patient.date_of_birth);
          const age = now.getFullYear() - birthDate.getFullYear();

          switch (ageRange) {
            case '0-18':
              return age >= 0 && age <= 18;
            case '18-65':
              return age >= 18 && age <= 65;
            case '65+':
              return age > 65;
            default:
              return true;
          }
        });
      }

      return NextResponse.json({ patients: filteredData });
    }
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// API لإضافة مريض جديد (للمدراء والموظفين)
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
      user_id,
      first_name,
      last_name,
      email,
      phone,
      date_of_birth,
      gender,
      address,
      emergency_contact_name,
      emergency_contact_phone,
      emergency_contact_relation,
      medical_history,
      allergies,
      insurance_provider,
      insurance_number,
      medications,
      blood_type,
      preferred_language,
      communication_preferences,
    } = body;

    if (!first_name || !last_name) {
      return NextResponse.json(
        {
          error: 'First name and last name are required',
        },
        { status: 400 }
      );
    }

    const { data, error } = await supabaseAdmin
      .from('patients')
      .insert({
        user_id,
        first_name,
        last_name,
        email,
        phone,
        date_of_birth,
        gender,
        address,
        emergency_contact_name,
        emergency_contact_phone,
        emergency_contact_relation,
        medical_history,
        allergies,
        insurance_provider,
        insurance_number,
        medications: medications || [],
        blood_type,
        preferred_language: preferred_language || 'ar',
        communication_preferences: communication_preferences || {},
      })
      .select()
      .single();

    if (error) {
      logger.error('Error creating patient', error);
      return ErrorHandler.getInstance().handle(error as Error);
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    logger.error('Error in patients POST', error);
    return ErrorHandler.getInstance().handle(error as Error);
  }
}

// API لتحديث مريض (للمدراء والموظفين)
export async function PUT(request: NextRequest) {
  try {
    // Authorize staff, supervisor, doctor, or admin
    const authResult = await requireAuth(['staff', 'supervisor', 'doctor', 'admin'])(request);
    if (!authResult.authorized) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabase = await createClient();
    const supabaseAdmin = getServiceSupabase();
    const body = await request.json();
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('patients')
      .update({
        ...updateData,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      logger.error('Error updating patient', error);
      return ErrorHandler.getInstance().handle(error as Error);
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    logger.error('Error in patients PUT', error);
    return ErrorHandler.getInstance().handle(error as Error);
  }
}

// API لحذف مريض (للمدراء فقط)
export async function DELETE(request: NextRequest) {
  try {
    // Authorize admin only
    const authResult = await requireAuth(['admin'])(request);
    if (!authResult.authorized) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabase = await createClient();
    const supabaseAdmin = getServiceSupabase();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    // بدلاً من الحذف، نعطل المريض
    const { data, error } = await supabaseAdmin
      .from('patients')
      .update({
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      logger.error('Error deactivating patient', error);
      return ErrorHandler.getInstance().handle(error as Error);
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    logger.error('Error in patients DELETE', error);
    return ErrorHandler.getInstance().handle(error as Error);
  }
}
