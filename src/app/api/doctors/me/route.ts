import { NextRequest, NextResponse } from 'next/server';

import { authorize } from '@/lib/auth/authorize';

export async function GET(_request: NextRequest) {
  try {
    const { user, error } = await authorize(_request);

    if (error || !user) {
      return NextResponse.json({ error }, { status: 401 });
    }

    // Mock doctor data for testing
    const doctorData = {
      id: user.id,
      fullName: 'د. أحمد محمد',
      speciality: 'العلاج الطبيعي',
      todayAppointments: [
        {
          id: '1',
          patientName: 'محمد العتيبي',
          time: '09:00',
          status: 'pending',
          patientId: 'patient-1',
        },
        {
          id: '2',
          patientName: 'فاطمة السعيد',
          time: '10:30',
          status: 'in_progress',
          patientId: 'patient-2',
        },
      ],
      recentPatients: [
        {
          id: 'patient-1',
          name: 'محمد العتيبي',
          lastVisit: '2024-01-15',
          status: 'active',
        },
        {
          id: 'patient-2',
          name: 'فاطمة السعيد',
          lastVisit: '2024-01-14',
          status: 'active',
        },
      ],
      schedule: {
        workingHours: '08:00 - 16:00',
        breaks: ['12:00 - 13:00'],
      },
    };

    return NextResponse.json(doctorData);
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
