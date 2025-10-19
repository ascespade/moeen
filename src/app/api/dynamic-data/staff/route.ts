import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// API لجلب معلومات الموظفين من جدول users الموجود
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const role = searchParams.get('role'); // admin, manager, agent, supervisor
    const status = searchParams.get('status') || 'active';

    // استخدام الدالة الذكية التي تجلب الموظفين من جدول users
    const { data, error } = await supabase.rpc('get_staff_info');
    
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // فلترة حسب الدور إذا طُلب ذلك
    let filteredData = data;
    if (role) {
      filteredData = data?.filter((staff: any) => 
        staff.role?.toLowerCase() === role.toLowerCase()
      );
    }

    // فلترة حسب الحالة إذا طُلب ذلك
    if (status) {
      filteredData = filteredData?.filter((staff: any) => 
        staff.status?.toLowerCase() === status.toLowerCase()
      );
    }

    return NextResponse.json({ staff: filteredData });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// API لإضافة موظف جديد (للمدراء فقط)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      email,
      password_hash,
      name,
      role,
      phone,
      timezone,
      language,
      preferences,
      metadata
    } = body;

    if (!email || !name || !role) {
      return NextResponse.json({ 
        error: 'Email, name, and role are required' 
      }, { status: 400 });
    }

    // التحقق من صحة الدور
    const validRoles = ['admin', 'manager', 'agent', 'supervisor'];
    if (!validRoles.includes(role)) {
      return NextResponse.json({ 
        error: 'Invalid role. Must be one of: admin, manager, agent, supervisor' 
      }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('users')
      .insert({
        email,
        password_hash,
        name,
        role,
        phone,
        timezone: timezone || 'Asia/Riyadh',
        language: language || 'ar',
        preferences: preferences || {},
        metadata: metadata || {},
        is_active: true,
        status: 'active'
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// API لتحديث موظف (للمدراء فقط)
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    // التحقق من صحة الدور إذا تم تحديثه
    if (updateData.role) {
      const validRoles = ['admin', 'manager', 'agent', 'supervisor'];
      if (!validRoles.includes(updateData.role)) {
        return NextResponse.json({ 
          error: 'Invalid role. Must be one of: admin, manager, agent, supervisor' 
        }, { status: 400 });
      }
    }

    const { data, error } = await supabase
      .from('users')
      .update({
        ...updateData,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// API لحذف موظف (للمدراء فقط)
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    // بدلاً من الحذف، نعطل الموظف
    const { data, error } = await supabase
      .from('users')
      .update({ 
        is_active: false,
        status: 'inactive',
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

