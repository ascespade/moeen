import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
  globalThis.process?.env?.NEXT_PUBLIC_SUPABASE_URL!,
  // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
  globalThis.process?.env?.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new globalThis.URL(request.url);
    const specialty = searchParams.get('specialty');
    const date = searchParams.get('date');

    let query = supabase
      .from('doctors')
      .select('*')
      .eq('is_active', true)
      .order('first_name', { ascending: true });

    if (specialty) {
      query = query.ilike('specialization', `%${specialty}%`);
    }

    const { data: doctors, error } = await query;

    if (error) {
      return NextResponse.json(
        { error: 'Failed to fetch doctors' },
        { status: 500 }
      );
    }

    // Get available time slots for each doctor
    const doctorsWithSlots = await Promise.all(
      doctors.map(async doctor => {
        const availableSlots = await getAvailableTimeSlots(
          doctor.id,
          date || undefined
        );
        return {
          ...doctor,
          availableSlots,
        };
      })
    );

    return NextResponse.json({
      success: true,
      doctors: doctorsWithSlots,
    });
  } catch {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

async function getAvailableTimeSlots(doctorId: string, date?: string) {
  const appointmentDate = date || new Date().toISOString().split('T')[0];

  // Get existing appointments for this doctor on this date
  const { data: existingAppointments } = await supabase
    .from('appointments')
    .select('appointment_time')
    .eq('doctor_id', doctorId)
    .eq('appointment_date', appointmentDate)
    .eq('status', 'scheduled');

  const bookedTimes =
    existingAppointments?.map(apt => apt.appointment_time) || [];

  // Generate available time slots (9 AM to 5 PM, every hour)
  const availableSlots: string[] = [];
  for (let hour = 9; hour <= 17; hour++) {
    const timeSlot = `${hour.toString().padStart(2, '0')}:00`;
    if (!bookedTimes.includes(timeSlot)) {
      availableSlots.push(timeSlot);
    }
  }

  return availableSlots;
}
