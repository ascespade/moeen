import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// GET /api/chatbot/appointments - جلب مواعيد الشات بوت
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const patient_phone = searchParams.get('patient_phone');
    const status = searchParams.get('status');
    const date = searchParams.get('date');

    let query = supabase
      .from('chatbot_appointments')
      .select(`
        *,
        chatbot_conversations (
          whatsapp_number,
          customer_name
        )
      `)
      .order('appointment_date', { ascending: true });

    if (patient_phone) {
      query = query.eq('patient_phone', patient_phone);
    }

    if (status) {
      query = query.eq('status', status);
    }

    if (date) {
      query = query.eq('appointment_date', date);
    }

    const { data: appointments, error } = await query;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ appointments });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/chatbot/appointments - إنشاء موعد من الشات بوت
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      conversation_id,
      patient_name,
      patient_phone,
      appointment_date,
      appointment_time,
      service_type,
      doctor_id,
      notes
    } = body;

    // إنشاء رمز تأكيد
    const confirmation_code = `APT${Date.now().toString().slice(-6)}`;

    const { data: appointment, error } = await supabase
      .from('chatbot_appointments')
      .insert({
        conversation_id,
        patient_name,
        patient_phone,
        appointment_date,
        appointment_time,
        service_type,
        doctor_id,
        status: 'pending',
        confirmation_code,
        notes
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ appointment }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
