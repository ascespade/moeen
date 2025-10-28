import { NextRequest, NextResponse } from 'next/server';
import { realDB } from '@/lib/supabase-real';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'all';

    // Load real data from database
    const [patients, doctors, appointments, sessions] = await Promise.all([
      realDB.searchUsers('', 'patient'),
      realDB.searchUsers('', 'doctor'),
      realDB.getAppointments(),
      realDB.getSessions(''),
    ]);

    const dynamicData = {
      center_info: {
        name: 'مركز الهمم',
        description: 'مركز متخصص في العلاج الطبيعي والوظيفي',
        established_year: 2020,
        location: 'الرياض، المملكة العربية السعودية',
        phone: '+966 50 123 4567',
        email: 'info@moeen.com',
        website: 'https://moeen.com',
      },
      patients: patients.map((patient: any) => ({
        id: patient.id,
        name: patient.name || patient.full_name,
        status: patient.is_active ? 'نشط' : 'غير نشط',
      })),
      doctors: doctors.map((doctor: any) => ({
        id: doctor.id,
        name: `د. ${doctor.name || doctor.full_name}`,
        specialty: doctor.specialization || doctor.specialty || 'عام',
      })),
      appointments: appointments.map((appointment: any) => ({
        id: appointment.id,
        patient_id: appointment.patient_id,
        doctor_id: appointment.doctor_id,
        date: appointment.scheduled_at
          ? appointment.scheduled_at.split('T')[0]
          : '',
        time: appointment.scheduled_at
          ? appointment.scheduled_at.split('T')[1]?.substring(0, 5)
          : '',
        status: appointment.status,
      })),
      contact_info: [
        {
          id: 1,
          type: 'phone',
          title: 'اتصال مباشر',
          value: '+966 50 123 4567',
          icon: '📞',
          link: 'tel:+966501234567',
          color: 'bg-[var(--brand-primary)]',
        },
        {
          id: 2,
          type: 'email',
          title: 'البريد الإلكتروني',
          value: 'info@moeen.com',
          icon: '📧',
          link: 'mailto:info@moeen.com',
          color: 'bg-[var(--brand-secondary)]',
        },
        {
          id: 3,
          type: 'location',
          title: 'الموقع',
          value: 'الرياض، المملكة العربية السعودية',
          icon: '📍',
          link: '/contact',
          color: 'bg-[var(--brand-accent)]',
        },
      ],
      services: [
        {
          id: 1,
          title: 'إدارة المواعيد',
          description: 'نظام تقويم متطور لإدارة المواعيد والجلسات العلاجية',
          icon: '📅',
          color: 'text-[var(--brand-accent)]',
          bgColor: 'bg-[var(--brand-accent)]/10',
        },
        {
          id: 2,
          title: 'إدارة المرضى',
          description: 'ملفات مرضى شاملة مع سجل طبي مفصل',
          icon: '👤',
          color: 'text-[var(--brand-success)]',
          bgColor: 'bg-[var(--brand-success)]/10',
        },
        {
          id: 3,
          title: 'المطالبات التأمينية',
          description: 'إدارة وتتبع المطالبات التأمينية بسهولة',
          icon: '📋',
          color: 'text-purple-600',
          bgColor: 'bg-purple-50',
        },
        {
          id: 4,
          title: 'الشات بوت الذكي',
          description: 'مساعد ذكي للرد على استفسارات المرضى',
          icon: '🤖',
          color: 'text-[var(--brand-primary)]',
          bgColor: 'bg-[var(--brand-primary)]/10',
        },
        {
          id: 5,
          title: 'إدارة الموظفين',
          description: 'تتبع ساعات العمل والأداء للموظفين',
          icon: '👨‍⚕️',
          color: 'text-[var(--brand-error)]',
          bgColor: 'bg-[var(--brand-error)]/10',
        },
        {
          id: 6,
          title: 'التقارير والتحليلات',
          description: 'تقارير شاملة وإحصائيات مفصلة',
          icon: '📊',
          color: 'text-indigo-600',
          bgColor: 'bg-indigo-50',
        },
      ],
      stats: {
        total_patients: 1247,
        active_patients: 856,
        completed_appointments: 3421,
        satisfaction_rate: 98,
        support_hours: '24/7',
      },
    };

    // إرجاع البيانات حسب النوع المطلوب
    if (type === 'contact') {
      return NextResponse.json({ contact_info: dynamicData.contact_info });
    } else if (type === 'patients') {
      return NextResponse.json({ patients: dynamicData.patients });
    } else if (type === 'doctors') {
      return NextResponse.json({ doctors: dynamicData.doctors });
    } else if (type === 'appointments') {
      return NextResponse.json({ appointments: dynamicData.appointments });
    } else if (type === 'services') {
      return NextResponse.json({ services: dynamicData.services });
    } else {
      // إرجاع جميع البيانات
      return NextResponse.json(dynamicData);
    }
  } catch (error) {
    console.error('Error in dynamic-data API:', error);
    return NextResponse.json(
      { error: 'فشل في جلب البيانات الديناميكية' },
      { status: 500 }
    );
  }
}
