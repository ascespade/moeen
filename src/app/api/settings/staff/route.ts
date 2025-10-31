import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { requireAuth } from '@/lib/auth/authorize';
import { ErrorHandler } from '@/core/errors';

// API لجلب الموظفين
export async function GET(request: NextRequest) {
  try {
    // Authorize staff, supervisor, doctor, or admin
    const authResult = await requireAuth(['staff', 'supervisor', 'doctor', 'admin'])(request);
    if (!authResult.authorized) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabase = await createClient();
    const { searchParams } = new URL(request.url);
    const department = searchParams.get('department');
    const status = searchParams.get('status') || 'active';
    const isEmergencyContact = searchParams.get('emergency_contact') === 'true';

    let query = supabase.from('staff_members').select(`
        id,
        public_id,
        first_name,
        last_name,
        position,
        department,
        specialization,
        license_number,
        phone,
        email,
        emergency_contact_name,
        emergency_contact_phone,
        hire_date,
        status,
        avatar_url,
        bio,
        qualifications,
        certifications,
        working_schedule,
        is_emergency_contact
      `);

    if (department) {
      query = query.eq('department', department);
    }

    if (status) {
      query = query.eq('status', status);
    }

    if (isEmergencyContact) {
      query = query.eq('is_emergency_contact', true);
    }

    query = query.order('first_name');

    const { data, error } = await query;

    if (error) {
      return ErrorHandler.getInstance().handle(error as Error);
    }

    return NextResponse.json({ staff: data });
  } catch (error) {
    return ErrorHandler.getInstance().handle(error as Error);
  }
}

// API لإضافة موظف جديد (للمدراء فقط)
export async function POST(request: NextRequest) {
  try {
    // Authorize supervisor or admin only
    const authResult = await requireAuth(['supervisor', 'admin'])(request);
    if (!authResult.authorized) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabase = await createClient();
    const body = await request.json();
    const {
      user_id,
      first_name,
      last_name,
      position,
      department,
      specialization,
      license_number,
      phone,
      email,
      emergency_contact_name,
      emergency_contact_phone,
      hire_date,
      salary,
      avatar_url,
      bio,
      qualifications,
      certifications,
      working_schedule,
      is_emergency_contact,
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
      .from('staff_members')
      .insert({
        user_id,
        first_name,
        last_name,
        position,
        department,
        specialization,
        license_number,
        phone,
        email,
        emergency_contact_name,
        emergency_contact_phone,
        hire_date,
        salary,
        avatar_url,
        bio,
        qualifications: qualifications || [],
        certifications: certifications || [],
        working_schedule: working_schedule || {},
        is_emergency_contact: is_emergency_contact || false,
        status: 'active',
      })
      .select()
      .single();

    if (error) {
      return ErrorHandler.getInstance().handle(error as Error);
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    return ErrorHandler.getInstance().handle(error as Error);
  }
}

// API لتحديث موظف (للمدراء فقط)
export async function PUT(request: NextRequest) {
  try {
    // Authorize supervisor or admin only
    const authResult = await requireAuth(['supervisor', 'admin'])(request);
    if (!authResult.authorized) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabase = await createClient();
    const body = await request.json();
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('staff_members')
      .update({
        ...updateData,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return ErrorHandler.getInstance().handle(error as Error);
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    return ErrorHandler.getInstance().handle(error as Error);
  }
}

// API لحذف موظف (للمدراء فقط)
export async function DELETE(request: NextRequest) {
  try {
    // Authorize admin only
    const authResult = await requireAuth(['admin'])(request);
    if (!authResult.authorized) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabase = await createClient();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    const { error } = await supabase
      .from('staff_members')
      .delete()
      .eq('id', id);

    if (error) {
      return ErrorHandler.getInstance().handle(error as Error);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return ErrorHandler.getInstance().handle(error as Error);
  }
}
