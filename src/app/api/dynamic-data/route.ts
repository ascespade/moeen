import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// API شامل لجلب جميع البيانات الديناميكية
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const dataType = searchParams.get('type'); // center, doctors, patients, staff, emergency, all

    // استخدام الدالة الذكية الشاملة
    const { data, error } = await supabase.rpc('get_all_dynamic_data');

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // إرجاع البيانات حسب النوع المطلوب
    switch (dataType) {
      case 'center':
        return NextResponse.json({ 
          center_info: data.center_info,
          emergency_contacts: data.emergency_contacts 
        });
      
      case 'doctors':
        return NextResponse.json({ 
          doctors: data.doctors 
        });
      
      case 'patients':
        return NextResponse.json({ 
          patients: data.patients 
        });
      
      case 'staff':
        return NextResponse.json({ 
          staff: data.staff 
        });
      
      case 'emergency':
        return NextResponse.json({ 
          emergency_contacts: data.emergency_contacts 
        });
      
      case 'settings':
        return NextResponse.json({ 
          system_settings: data.system_settings 
        });
      
      default:
        return NextResponse.json(data);
    }
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// API لتحديث البيانات (للمدراء فقط)
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, data: updateData } = body;

    if (!type || !updateData) {
      return NextResponse.json({ 
        error: 'Type and data are required' 
      }, { status: 400 });
    }

    let result;
    let error;

    switch (type) {
      case 'center':
        ({ data: result, error } = await supabase
          .from('center_info')
          .upsert(updateData)
          .select()
          .single());
        break;
      
      case 'emergency':
        ({ data: result, error } = await supabase
          .from('emergency_contacts')
          .upsert(updateData)
          .select()
          .single());
        break;
      
      case 'settings':
        ({ data: result, error } = await supabase
          .from('system_settings')
          .upsert(updateData)
          .select()
          .single());
        break;
      
      default:
        return NextResponse.json({ 
          error: 'Invalid type specified' 
        }, { status: 400 });
    }

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

