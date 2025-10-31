import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { requireAuth } from '@/lib/auth/authorize';
import { ErrorHandler } from '@/core/errors';
import { logger } from '@/lib/logger';

export async function GET(request: NextRequest) {
  try {
    // Authorize any authenticated user
    const authResult = await requireAuth()(request);
    if (!authResult.authorized) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabase = await createClient();
    const { searchParams } = new URL(request.url);
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
      logger.error('Error fetching doctors', error);
      return ErrorHandler.getInstance().handle(error as Error);
    }

    // Get available time slots for each doctor
    const doctorsWithSlots = await Promise.all(
      doctors.map(async (doctor: any) => {
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
  } catch (error) {
    logger.error('Error in chatbot doctors GET', error);
    return ErrorHandler.getInstance().handle(error as Error);
  }
}

async function getAvailableTimeSlots(doctorId: string, date?: string) {
  const supabase = await createClient();
  const appointmentDate = date || new Date().toISOString().split('T')[0];

  // Get existing appointments for this doctor on this date
  const { data: existingAppointments } = await supabase
    .from('appointments')
    .select('appointment_time')
    .eq('doctor_id', doctorId)
    .eq('appointment_date', appointmentDate)
    .eq('status', 'scheduled');

  const bookedTimes =
    existingAppointments?.map((apt: any) => apt.appointment_time) || [];

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
