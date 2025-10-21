import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'all';

    // محاكاة البيانات الديناميكية
    const mockData = {
      center_info: {
        name: 'مركز الهمم',
        description: 'مركز متخصص في العلاج الطبيعي والوظيفي',
        established_year: 2020,
        location: 'الرياض، المملكة العربية السعودية',
        phone: '+966 50 123 4567',
        email: 'info@moeen.com',
        website: 'https://moeen.com',
      },
      patients: [
        { id: 1, name: 'أحمد محمد', status: 'نشط' },
        { id: 2, name: 'فاطمة علي', status: 'نشط' },
        { id: 3, name: 'محمد أحمد', status: 'مكتمل' },
        { id: 4, name: 'نورا سعد', status: 'نشط' },
        { id: 5, name: 'خالد عبدالله', status: 'نشط' },
      ],
      doctors: [
        { id: 1, name: 'د. أحمد محمد', specialty: 'العلاج الطبيعي' },
        { id: 2, name: 'د. فاطمة علي', specialty: 'العلاج الوظيفي' },
        { id: 3, name: 'د. محمد أحمد', specialty: 'العلاج الطبيعي' },
      ],
      appointments: [
        {
          id: 1,
          patient_id: 1,
          doctor_id: 1,
          date: '2024-01-15',
          time: '10:00',
        },
        {
          id: 2,
          patient_id: 2,
          doctor_id: 2,
          date: '2024-01-15',
          time: '11:00',
        },
        {
          id: 3,
          patient_id: 3,
          doctor_id: 1,
          date: '2024-01-16',
          time: '09:00',
        },
      ],
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
      return NextResponse.json({ contact_info: mockData.contact_info });
    } else if (type === 'patients') {
      return NextResponse.json({ patients: mockData.patients });
    } else if (type === 'doctors') {
      return NextResponse.json({ doctors: mockData.doctors });
    } else if (type === 'appointments') {
      return NextResponse.json({ appointments: mockData.appointments });
    } else if (type === 'services') {
      return NextResponse.json({ services: mockData.services });
    } else {
      // إرجاع جميع البيانات
      return NextResponse.json(mockData);
    }
  } catch (error) {
    console.error('Error in dynamic-data API:', error);
    return NextResponse.json(
      { error: 'فشل في جلب البيانات الديناميكية' },
      { status: 500 }
    );
  }
}
