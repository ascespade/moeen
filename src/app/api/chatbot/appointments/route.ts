import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const { doctorId, appointmentTime, patientId, conversationId, notes, patientName, patientPhone } =
      await request.json();

    if (!doctorId || !appointmentTime) {
      return NextResponse.json(
        { error: 'Doctor ID and appointment time are required' },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // البحث عن المريض بالهاتف أو إنشاء مريض جديد
    let patient;
    if (patientId) {
      const { data: existingPatient, error: patientError } = await supabase
        .from('patients')
        .select('*')
        .eq('id', patientId)
        .single();
      
      if (patientError || !existingPatient) {
        return NextResponse.json({ error: 'Patient not found' }, { status: 404 });
      }
      patient = existingPatient;
    } else {
      // إنشاء مريض جديد
      const { data: newPatient, error: createError } = await supabase
        .from('patients')
        .insert({
          first_name: patientName.split(' ')[0] || 'غير محدد',
          last_name: patientName.split(' ').slice(1).join(' ') || 'غير محدد',
          phone: patientPhone,
          email: `${patientPhone}_${Date.now()}@temp.com`,
          public_id: `TEMP_${Date.now()}`,
          user_id: '550e8400-e29b-41d4-a716-446655440001', // Default admin user
          created_by: '550e8400-e29b-41d4-a716-446655440001',
          updated_by: '550e8400-e29b-41d4-a716-446655440001'
        })
        .select()
        .single();
      
      if (createError) {
        console.error('Patient creation error:', createError);
        return NextResponse.json({ error: 'Failed to create patient: ' + createError.message }, { status: 500 });
      }
      
      if (!newPatient) {
        return NextResponse.json({ error: 'Failed to create patient: No data returned' }, { status: 500 });
      }
      patient = newPatient;
    }

    // التحقق من وجود الطبيب
    const { data: doctor, error: doctorError } = await supabase
      .from('doctors')
      .select('*')
      .eq('id', doctorId)
      .single();

    if (doctorError || !doctor) {
      return NextResponse.json({ error: 'Doctor not found' }, { status: 404 });
    }

    // تحديد تاريخ الموعد (اليوم أو غداً)
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const appointmentDate = new Date().toISOString().split('T')[0];

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
        duration_minutes: 60,
        type: 'consultation',
        status: 'scheduled',
        notes: notes || 'تم الحجز عبر الشات بوت',
        created_by: patientId,
        confirmation_code: confirmationCode,
      })
      .select(
        `
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
          specialization
        )
      `
      )
      .single();

    if (appointmentError) {
      console.error('Appointment creation error:', appointmentError);
      return NextResponse.json(
        { error: 'Failed to create appointment: ' + appointmentError.message },
        { status: 500 }
      );
    }

    // إرسال رسالة تأكيد عبر WhatsApp (إذا كان متاحاً)
    try {
      if (patient.phone) {
        await sendWhatsAppConfirmation(patient.phone, appointment);
      }
    } catch (whatsappError) {
      // لا نفشل العملية إذا فشل إرسال WhatsApp
    }

    // حفظ سجل في chatbot_appointments
    await supabase.from('chatbot_appointments').insert({
      conversation_id: conversationId,
      patient_name: `${patient.first_name} ${patient.last_name}`,
      patient_phone: patient.phone,
      appointment_date: appointmentDate,
      appointment_time: appointmentTime,
      service_type: 'consultation',
      doctor_id: doctorId,
      status: 'pending',
      confirmation_code: confirmationCode,
      notes: notes || 'تم الحجز عبر الشات بوت',
    });

    return NextResponse.json({
      success: true,
      appointmentId: appointment.id,
      confirmationCode,
      appointment: {
        id: appointment.id,
        date: appointment.appointment_date,
        time: appointment.appointment_time,
        doctor: `${appointment.doctors.first_name} ${appointment.doctors.last_name}`,
        specialty: appointment.doctors.specialty,
        status: appointment.status,
      },
      message: 'تم حجز الموعد بنجاح!',
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const patientId = searchParams.get('patientId');
    const doctorId = searchParams.get('doctorId');

    const supabase = await createClient();

    let query = supabase
      .from('appointments')
      .select(
        `
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
          specialization
        )
      `
      )
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

    const { data: appointments, error } = await query;

    if (error) {
      return NextResponse.json(
        { error: 'Failed to fetch appointments' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      appointments: appointments || [],
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

async function sendWhatsAppConfirmation(phone: string, appointment: any) {
  // هذا مثال لإرسال رسالة WhatsApp
  // في التطبيق الحقيقي، ستحتاج إلى تكامل مع WhatsApp Business API

  const message = `تم حجز موعدك بنجاح!
  
التفاصيل:
👨‍⚕️ الطبيب: ${appointment.doctors.first_name} ${appointment.doctors.last_name}
🏥 التخصص: ${appointment.doctors.specialty}
📅 التاريخ: ${new Date(appointment.appointment_date).toLocaleDateString('ar-SA')}
⏰ الوقت: ${appointment.appointment_time}
📋 رقم الموعد: ${appointment.confirmation_code}

مركز الهمم للرعاية الصحية`;

  // هنا يمكنك إضافة كود إرسال WhatsApp الفعلي
  // await whatsappAPI.sendMessage(phone, message);
}
