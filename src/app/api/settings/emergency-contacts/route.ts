import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { requireAuth } from '@/lib/auth/authorize';
import { ErrorHandler } from '@/core/errors';

// API لجلب جهات الاتصال الطارئة
export async function GET(request: NextRequest) {
  try {
    // Authorize any authenticated user
    const authResult = await requireAuth()(request);
    if (!authResult.authorized) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabase = await createClient();
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const priority = searchParams.get('priority');

    let query = supabase
      .from('emergency_contacts')
      .select('*')
      .eq('is_active', true);

    if (type) {
      query = query.eq('type', type);
    }

    if (priority) {
      query = query.eq('priority', parseInt(priority));
    }

    query = query.order('priority');

    const { data, error } = await query;

    if (error) {
      return ErrorHandler.getInstance().handle(error as Error);
    }

    return NextResponse.json({ emergencyContacts: data });
  } catch (error) {
    return ErrorHandler.getInstance().handle(error as Error);
  }
}

// API لإضافة جهة اتصال طارئة جديدة (للمدراء فقط)
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
      name,
      phone,
      type,
      priority,
      is_available_24_7,
      working_hours,
      notes,
    } = body;

    if (!name || !phone || !type) {
      return NextResponse.json(
        {
          error: 'Name, phone, and type are required',
        },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('emergency_contacts')
      .insert({
        name,
        phone,
        type,
        priority: priority || 1,
        is_available_24_7: is_available_24_7 || false,
        working_hours,
        notes,
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

// API لتحديث جهة اتصال طارئة (للمدراء فقط)
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
      .from('emergency_contacts')
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

// API لحذف جهة اتصال طارئة (للمدراء فقط)
export async function DELETE(request: NextRequest) {
  try {
    // Authorize supervisor or admin only
    const authResult = await requireAuth(['supervisor', 'admin'])(request);
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
      .from('emergency_contacts')
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
