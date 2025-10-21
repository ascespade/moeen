import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// API لجلب معلومات الأطباء من الجدول الموجود
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const specialization = searchParams.get('specialization');
    const includeUsers = searchParams.get('include_users') === 'true';

    let query;

    if (includeUsers) {
      // استخدام الدالة الذكية التي تجلب الأطباء مع معلومات المستخدمين
      const { data, error } = await supabase.rpc('get_doctors_with_users');

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
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
      const { data, error } = await supabase.rpc('get_doctors_info');

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
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
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// API لإضافة طبيب جديد (للمدراء فقط)
export async function POST(request: NextRequest) {
  try {
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

    const { data, error } = await supabase
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
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// API لتحديث طبيب (للمدراء فقط)
export async function PUT(request: NextRequest) {
  try {
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
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// API لحذف طبيب (للمدراء فقط)
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    // بدلاً من الحذف، نعطل الطبيب
    const { data, error } = await supabase
      .from('doctors')
      .update({
        is_active: false,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
