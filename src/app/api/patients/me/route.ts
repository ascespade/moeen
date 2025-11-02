import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(_request: NextRequest) {
  try {
    // ✅ Simplified - just check session, no complex authorization
    const supabase = await createClient();
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();

    if (sessionError || !session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user from session
    const user = {
      id: session.user.id,
      email: session.user.email || '',
    };

    // Mock patient data for testing
    const patientData = {
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
