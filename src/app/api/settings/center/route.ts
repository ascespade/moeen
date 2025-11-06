import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { requireAuth } from '@/lib/auth/authorize';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// API لجلب معلومات المركز
export const revalidate = 60;

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    // Security: Require authentication
    const authResult = await requireAuth(['admin'])(request);
    if (!authResult.authorized || !authResult.user) {
      return NextResponse.json(
        { error: 'Unauthorized - Authentication required' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const includeStaff = searchParams.get('include_staff') === 'true';
    const includeEmergencyContacts =
      searchParams.get('include_emergency') === 'true';

    // جلب معلومات المركز الأساسية
    const { data: centerInfo, error: centerError } = await supabase
      .from('center_info')
      .select('*')
      .eq('is_active', true)
      .single();

    if (centerError) {
      return NextResponse.json(
        { error: centerError.message },
        {
          status: 500,
          headers: {
            'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
          },
        }
      );
    }

    const response: unknown = { center: centerInfo };

    // جلب معلومات الموظفين إذا طُلب ذلك
    if (includeStaff) {
      const { data: staff, error: staffError } = await supabase
        .from('staff_members')
        .select(
          `
          id,
          public_id,
          first_name,
          last_name,
          position,
          department,
          specialization,
          phone,
          email,
          avatar_url,
          bio,
          qualifications,
          certifications,
          working_schedule,
          is_emergency_contact,
          status
        `
        )
        .eq('status', 'active')
        .order('first_name');

      if (!staffError) {
        response.staff = staff;
      }
    }

    // جلب جهات الاتصال الطارئة إذا طُلب ذلك
    if (includeEmergencyContacts) {
      const { data: emergencyContacts, error: emergencyError } = await supabase
        .from('emergency_contacts')
        .select('*')
        .eq('is_active', true)
        .order('priority');

      if (!emergencyError) {
        response.emergencyContacts = emergencyContacts;
      }
    }

    return NextResponse.json(response);
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// API لتحديث معلومات المركز (للمدراء فقط)
export async function PUT(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json();
    const {
      name,
      name_en,
      description,
      description_en,
      logo_url,
      address,
      city,
      country,
      postal_code,
      phone,
      email,
      website,
      emergency_phone,
      admin_phone,
      working_hours,
      social_media,
      services,
      specialties,
    } = body;

    const { data, error } = await supabase
      .from('center_info')
      .upsert({
        name,
        name_en,
        description,
        description_en,
        logo_url,
        address,
        city,
        country,
        postal_code,
        phone,
        email,
        website,
        emergency_phone,
        admin_phone,
        working_hours,
        social_media,
        services,
        specialties,
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { error: error.message },
        {
          status: 500,
          headers: {
            'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
          },
        }
      );
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
