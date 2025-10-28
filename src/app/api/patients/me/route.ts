import { _NextRequest, NextResponse } from 'next/server';

import { _authorize } from '@/lib/auth/authorize';

export async function __GET(_request: NextRequest) {
  try {
    const { user, error } = await authorize(request);

    if (error || !user) {
      return NextResponse.json({ error }, { status: 401 });
    }

    // Mock patient data for testing
    const __patientData = {
      id: user.id,
      fullName: 'أحمد محمد العتيبي',
      activated: true,
      nextAppointment: {
        id: 'apt-1',
        date: '2024-01-20',
        doctor: 'د. سارة أحمد',
        status: 'confirmed',
      },
      recentAppointments: [
        {
          id: 'apt-1',
          date: '2024-01-20',
          doctor: 'د. سارة أحمد',
          status: 'confirmed',
        },
        {
          id: 'apt-2',
          date: '2024-01-15',
          doctor: 'د. محمد حسن',
          status: 'completed',
        },
      ],
      insuranceStatus: {
        provider: 'شركة التأمين الوطنية',
        number: 'INS-123456',
        status: 'active',
      },
      paymentStatus: {
        outstanding: 0,
        lastPayment: '2024-01-10',
      },
    };

    return NextResponse.json(patientData);
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
