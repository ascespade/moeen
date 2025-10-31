import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getServiceSupabase } from '@/lib/supabaseClient';
import { requireAuth } from '@/lib/auth/authorize';
import { ErrorHandler } from '@/core/errors';
import { logger } from '@/lib/logger';

// API لجلب معلومات الأطباء من الجدول الموجود
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
    const specialization = searchParams.get('specialization');
    const includeUsers = searchParams.get('include_users') === 'true';

    let query;

    if (includeUsers) {
      // استخدام الدالة الذكية التي تجلب الأطباء مع معلومات المستخدمين
      const { data, error } = await supabaseAdmin.rpc('get_doctors_with_users');

      if (error) {
        logger.error('Error in get_doctors_with_users RPC', error);
        return ErrorHandler.getInstance().handle(error as Error);
      }

      // فلترة حسب التخصص إذا طُلب ذلك
      let filteredData = data;
      if (specialization) {
        filteredData = data?.filter((doctor: any) =>
          doctor.specialization
            ?.toLowerCase()
            .includes(specialization.toLowerCase())
        );
      }

      return NextResponse.json({ doctors: filteredData });
    } else {
      // استخدام الدالة البسيطة
      const { data, error } = await supabaseAdmin.rpc('get_doctors_info');

      if (error) {
        logger.error('Error in get_doctors_with_users RPC', error);
        return ErrorHandler.getInstance().handle(error as Error);
      }

      // فلترة حسب التخصص إذا طُلب ذلك
      let filteredData = data;
      if (specialization) {
        filteredData = data?.filter((doctor: any) =>
          doctor.specialization
            ?.toLowerCase()
            .includes(specialization.toLowerCase())
        );
      }

      return NextResponse.json({ doctors: filteredData });
    }
  } catch (error) {
    logger.error('Error in doctors GET', error);
    return ErrorHandler.getInstance().handle(error as Error);
  }
}

// API لإضافة طبيب جديد (للمدراء فقط)
export async function POST(request: NextRequest) {
  try {
    // Authorize admin, supervisor, or manager
    const authResult = await requireAuth(['admin', 'supervisor', 'manager'])(request);
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
      specialization,
      license_number,
      phone,
      email,
      consultation_fee,
      experience_years,
      qualifications,
      bio,
      working_hours,
      languages,
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
      .from('doctors')
      .insert({
        user_id,
        first_name,
        last_name,
        specialization,
        license_number,
        phone,
        email,
        consultation_fee,
        experience_years,
        qualifications: qualifications || [],
        bio,
        working_hours: working_hours || {},
        languages: languages || [],
        is_active: true,
      })
      .select()
      .single();

    if (error) {
      logger.error('Error creating doctor', error);
      return ErrorHandler.getInstance().handle(error as Error);
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    logger.error('Error in doctors POST', error);
    return ErrorHandler.getInstance().handle(error as Error);
  }
}

// API لتحديث طبيب (للمدراء فقط)
export async function PUT(request: NextRequest) {
  try {
    // Authorize admin, supervisor, or manager
    const authResult = await requireAuth(['admin', 'supervisor', 'manager'])(request);
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
      .from('doctors')
      .update({
        ...updateData,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      logger.error('Error updating doctor', error);
      return ErrorHandler.getInstance().handle(error as Error);
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    logger.error('Error in doctors PUT', error);
    return ErrorHandler.getInstance().handle(error as Error);
  }
}

// API لحذف طبيب (للمدراء فقط)
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

    // بدلاً من الحذف، نعطل الطبيب
    const { data, error } = await supabaseAdmin
      .from('doctors')
      .update({
        is_active: false,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      logger.error('Error deactivating doctor', error);
      return ErrorHandler.getInstance().handle(error as Error);
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    logger.error('Error in doctors DELETE', error);
    return ErrorHandler.getInstance().handle(error as Error);
  }
}
