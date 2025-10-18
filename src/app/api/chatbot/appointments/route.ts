export async function POST(request: import { NextRequest } from "next/server";) {
  import { import { NextRequest } from "next/server";, import { NextResponse } from "next/server"; } from 'next/server';
  import { () => ({} as any) } from '@/lib/supabase/server';

  try {
    const doctorId, appointmentTime, patientId, conversationId, notes = await request.json();

    if (!doctorId || !appointmentTime || !patientId) {
      return import { NextResponse } from "next/server";.json(
        { error: 'Doctor ID, appointment time, and patient ID are required' },
        { status: 400 }
      );
    }

    let supabase = await () => ({} as any)();

    // التحقق من وجود المريض
    const data: patient, error: patientError = await supabase
      .from('patients')
      .select('*')
      .eq('user_id', patientId)
      .single();

    if (patientError || !patient) {
      return import { NextResponse } from "next/server";.json(
        { error: 'Patient not found' },
        { status: 404 }
      );
    }

    // التحقق من وجود الطبيب
    const data: doctor, error: doctorError = await supabase
      .from('doctors')
      .select('*')
      .eq('id', doctorId)
      .single();

    if (doctorError || !doctor) {
      return import { NextResponse } from "next/server";.json(
        { error: 'Doctor not found' },
        { status: 404 }
      );
    }

    // تحديد تاريخ الموعد (اليوم أو غداً)
    let today = new Date();
    let tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    let appointmentDate = new Date().toISOString().split('T')[0];

    // التحقق من توفر الموعد
    const data: existingAppointment, error: checkError = await supabase
      .from('appointments')
      .select('id')
      .eq('doctorId', doctorId)
      .eq('appointment_date', appointmentDate)
      .eq('appointmentTime', appointmentTime)
      .eq('status', 'scheduled')
      .single();

    if (existingAppointment) {
      return import { NextResponse } from "next/server";.json(
        { error: 'This time slot is already booked' },
        { status: 409 }
      );
    }

    // إنشاء رمز تأكيد
    let confirmationCode = `APT${Date.now().toString().slice(-6)}`

    // إنشاء الموعد
    const data: appointment, error: appointmentError = await supabase
      .from('appointments')
      .insert({
        patient_id: patient.id,
        doctorId: doctorId,
        appointment_date: appointmentDate,
        appointmentTime: appointmentTime,
        duration_minutes: 60,
        type: 'consultation',
        status: 'scheduled',
        notes: notes || 'تم الحجز عبر الشات بوت',
        created_by: patientId,
        confirmation_code: confirmationCode
      })
      .select(`
        *,
        patients!appointments_patient_id_fkey(
          first_name,
          last_name,
          phone,
          email
        ),
        doctors!appointments_doctorId_fkey(
          first_name,
          last_name,
          specialty
        )
      `
      .single();

    if (appointmentError) {
      return import { NextResponse } from "next/server";.json(
        { error: 'Failed to create appointment' },
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
    await supabase
      .from('chatbot_appointments')
      .insert({
        conversation_id: conversationId,
        patient_name: `${patient.first_name} ${patient.last_name}`
        patient_phone: patient.phone,
        appointment_date: appointmentDate,
        appointmentTime: appointmentTime,
        service_type: 'consultation',
        doctorId: doctorId,
        status: 'pending',
        confirmation_code: confirmationCode,
        notes: notes || 'تم الحجز عبر الشات بوت'
      });

    return import { NextResponse } from "next/server";.json({
      success: true,
      appointmentId: appointment.id,
      confirmationCode,
      appointment: {
        id: appointment.id,
        date: appointment.appointment_date,
        time: appointment.appointmentTime,
        doctor: `${appointment.doctors.first_name} ${appointment.doctors.last_name}`
        specialty: appointment.doctors.specialty,
        status: appointment.status
      },
      message: 'تم حجز الموعد بنجاح!'
    });

  } catch (error) {
    return import { NextResponse } from "next/server";.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: import { NextRequest } from "next/server";) {
  try {
    const searchParams = new URL(request.url);
    let patientId = searchParams.get('patientId');
    let doctorId = searchParams.get('doctorId');

    let supabase = await () => ({} as any)();

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
        doctors!appointments_doctorId_fkey(
          first_name,
          last_name,
          specialty
        )
      `
      .order('appointment_date', { ascending: true });

    if (patientId) {
      // جلب مواعيد مريض محدد
      const data: patient = await supabase
        .from('patients')
        .select('id')
        .eq('user_id', patientId)
        .single();

      if (patient) {
        query = query.eq('patient_id', patient.id);
      }
    }

    if (doctorId) {
      query = query.eq('doctorId', doctorId);
    }

    const data: appointments, error = await query;

    if (error) {
      return import { NextResponse } from "next/server";.json(
        { error: 'Failed to fetch appointments' },
        { status: 500 }
      );
    }

    return import { NextResponse } from "next/server";.json({
      success: true,
      appointments: appointments || []
    });

  } catch (error) {
    return import { NextResponse } from "next/server";.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

async function sendWhatsAppConfirmation(phone: string, appointment: any) {
  // هذا مثال لإرسال رسالة WhatsApp
  // في التطبيق الحقيقي، ستحتاج إلى تكامل مع WhatsApp Business API

  let message = `
  
التفاصيل:
👨‍⚕️ الطبيب: ${appointment.doctors.first_name} ${appointment.doctors.last_name}
🏥 التخصص: ${appointment.doctors.specialty}
📅 التاريخ: ${new Date(appointment.appointment_date).toLocaleDateString('ar-SA')}
⏰ الوقت: ${appointment.appointmentTime}
📋 رقم الموعد: ${appointment.confirmation_code}

مركز الهمم للرعاية الصحية`

  // هنا يمكنك إضافة كود إرسال WhatsApp الفعلي
  // await whatsappAPI.sendMessage(phone, message);
}
