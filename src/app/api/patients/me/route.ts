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

    // ✅ Fetch real patient data from database
    const { data: patient, error: patientError } = await supabase
      .from('patients')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle();

    if (patientError || !patient) {
      return NextResponse.json(
        { error: 'Patient not found' },
        { status: 404 }
      );
    }

    // ✅ Fetch next appointment
    const { data: nextAppointment } = await supabase
      .from('appointments')
      .select(`
        id,
        appointment_date,
        status,
        doctors(first_name, last_name)
      `)
      .eq('patient_id', patient.id)
      .in('status', ['scheduled', 'confirmed'])
      .gte('appointment_date', new Date().toISOString())
      .order('appointment_date', { ascending: true })
      .limit(1)
      .maybeSingle();

    // ✅ Fetch recent appointments
    const { data: recentAppointments } = await supabase
      .from('appointments')
      .select(`
        id,
        appointment_date,
        status,
        doctors(first_name, last_name)
      `)
      .eq('patient_id', patient.id)
      .order('appointment_date', { ascending: false })
      .limit(5);

    // ✅ Fetch insurance status
    const { data: insurance } = await supabase
      .from('insurance_claims')
      .select('insurance_provider, claim_number, status')
      .eq('patient_id', patient.id)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    // ✅ Fetch payment status
    const { data: payments } = await supabase
      .from('payments')
      .select('amount, status, created_at')
      .eq('patient_id', patient.id)
      .order('created_at', { ascending: false })
      .limit(1);

    const outstanding = payments
      ?.filter(p => p.status !== 'paid')
      .reduce((sum, p) => sum + (p.amount || 0), 0) || 0;

    const patientData = {
      id: patient.id,
      fullName: `${patient.first_name || ''} ${patient.last_name || ''}`.trim(),
      activated: patient.activated || false,
      nextAppointment: nextAppointment ? {
        id: nextAppointment.id,
        date: nextAppointment.appointment_date,
        doctor: nextAppointment.doctors 
          ? `${nextAppointment.doctors.first_name || ''} ${nextAppointment.doctors.last_name || ''}`.trim()
          : null,
        status: nextAppointment.status,
      } : null,
      recentAppointments: (recentAppointments || []).map(apt => ({
        id: apt.id,
        date: apt.appointment_date,
        doctor: apt.doctors
          ? `${apt.doctors.first_name || ''} ${apt.doctors.last_name || ''}`.trim()
          : null,
        status: apt.status,
      })),
      insuranceStatus: insurance ? {
        provider: insurance.insurance_provider || '',
        number: insurance.claim_number || '',
        status: insurance.status || 'unknown',
      } : null,
      paymentStatus: {
        outstanding,
        lastPayment: payments?.[0]?.created_at || null,
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
