import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const patientId = searchParams.get('patientId');
    const doctorId = searchParams.get('doctorId');
    const status = searchParams.get('status');
    const date = searchParams.get('date');

    const supabase = createClient();

    let query = supabase
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
      .order('appointment_date', { ascending: true });

    if (patientId) {
      // جلب مواعيد مريض محدد
      const { data: patient } = await supabase
        .from('patients')
        .select('id')
        .eq('user_id', patientId)
        .single();

      if (patient) {
        query = query.eq('patient_id', patient.id);
      }
    }

    if (doctorId) {
      query = query.eq('doctor_id', doctorId);
    }

    if (status) {
      query = query.eq('status', status);
    }

    if (date) {
      query = query.eq('appointment_date', date);
    }

    const { data: appointments, error } = await query;

    if (error) {
      console.error('Error fetching appointments:', error);
      return NextResponse.json(
        { error: 'Failed to fetch appointments' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      appointments: appointments || []
    });

  } catch (error) {
    console.error('Error in GET appointments:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { 
      patientId, 
      doctorId, 
      appointmentDate, 
      appointmentTime, 
      duration = 30, 
      notes,
      type = 'consultation'
    } = await request.json();

    if (!patientId || !doctorId || !appointmentDate || !appointmentTime) {
      return NextResponse.json(
        { error: 'patientId, doctorId, appointmentDate, and appointmentTime are required' },
        { status: 400 }
      );
    }

    const supabase = createClient();

    // التحقق من وجود المريض
    const { data: patient, error: patientError } = await supabase
      .from('patients')
      .select('id')
      .eq('user_id', patientId)
      .single();

    if (patientError || !patient) {
      return NextResponse.json(
        { error: 'Patient not found' },
        { status: 404 }
      );
    }

    // التحقق من وجود الطبيب
    const { data: doctor, error: doctorError } = await supabase
      .from('doctors')
      .select('id')
      .eq('id', doctorId)
      .single();

    if (doctorError || !doctor) {
      return NextResponse.json(
        { error: 'Doctor not found' },
        { status: 404 }
      );
    }

    // التحقق من توفر الموعد
    const { data: existingAppointment, error: checkError } = await supabase
      .from('appointments')
      .select('id')
      .eq('doctor_id', doctorId)
      .eq('appointment_date', appointmentDate)
      .eq('appointment_time', appointmentTime)
      .eq('status', 'scheduled')
      .single();

    if (existingAppointment) {
      return NextResponse.json(
        { error: 'This time slot is already booked' },
        { status: 409 }
      );
    }

    // إنشاء رمز تأكيد
    const confirmationCode = `APT${Date.now().toString().slice(-6)}`;

    // إنشاء الموعد
    const { data: appointment, error: appointmentError } = await supabase
      .from('appointments')
      .insert({
        patient_id: patient.id,
        doctor_id: doctorId,
        appointment_date: appointmentDate,
        appointment_time: appointmentTime,
        duration: duration,
        status: 'scheduled',
        notes: notes || '',
        public_id: confirmationCode
      })
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

    if (appointmentError) {
      console.error('Error creating appointment:', appointmentError);
      return NextResponse.json(
        { error: 'Failed to create appointment' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      appointment,
      confirmationCode
    });

  } catch (error) {
    console.error('Appointment creation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}