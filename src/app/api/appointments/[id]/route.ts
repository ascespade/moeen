import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const supabase = createClient();

    const { data: appointment, error } = await supabase
      .from('appointments')
      .select(`
        *,
        patients!appointments_patient_id_fkey(
          first_name,
          last_name,
          phone,
          email
        ),
        doctors!appointments_doctor_id_fkey(
          first_name,
          last_name,
          specialty,
          phone
        )
      `)
      .eq('id', id)
      .single();

    if (error) {
      return NextResponse.json(
        { error: 'Appointment not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      appointment
    });

  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const updates = await request.json();
    const supabase = createClient();

    // التحقق من وجود الموعد
    const { data: existingAppointment, error: fetchError } = await supabase
      .from('appointments')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchError || !existingAppointment) {
      return NextResponse.json(
        { error: 'Appointment not found' },
        { status: 404 }
      );
    }

    // التحقق من توفر الموعد الجديد إذا تم تغيير الوقت
    if (updates.appointment_date || updates.appointment_time || updates.doctor_id) {
      const checkDate = updates.appointment_date || existingAppointment.appointment_date;
      const checkTime = updates.appointment_time || existingAppointment.appointment_time;
      const checkDoctor = updates.doctor_id || existingAppointment.doctor_id;

      const { data: conflictingAppointment, error: checkError } = await supabase
        .from('appointments')
        .select('id')
        .eq('doctor_id', checkDoctor)
        .eq('appointment_date', checkDate)
        .eq('appointment_time', checkTime)
        .eq('status', 'scheduled')
        .neq('id', id)
        .single();

      if (conflictingAppointment) {
        return NextResponse.json(
          { error: 'This time slot is already booked' },
          { status: 409 }
        );
      }
    }

    // تحديث الموعد
    const { data: appointment, error: updateError } = await supabase
      .from('appointments')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select(`
        *,
        patients!appointments_patient_id_fkey(
          first_name,
          last_name,
          phone,
          email
        ),
        doctors!appointments_doctor_id_fkey(
          first_name,
          last_name,
          specialty,
          phone
        )
      `)
      .single();

    if (updateError) {
      return NextResponse.json(
        { error: 'Failed to update appointment' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      appointment
    });

  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const supabase = createClient();

    // التحقق من وجود الموعد
    const { data: existingAppointment, error: fetchError } = await supabase
      .from('appointments')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchError || !existingAppointment) {
      return NextResponse.json(
        { error: 'Appointment not found' },
        { status: 404 }
      );
    }

    // حذف الموعد
    const { error: deleteError } = await supabase
      .from('appointments')
      .delete()
      .eq('id', id);

    if (deleteError) {
      return NextResponse.json(
        { error: 'Failed to delete appointment' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Appointment deleted successfully'
    });

  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
