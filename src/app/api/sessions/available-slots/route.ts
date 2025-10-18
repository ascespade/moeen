import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import logger from '@/lib/monitoring/logger';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const sessionTypeId = searchParams.get('sessionTypeId');
    const date = searchParams.get('date');
    const therapistId = searchParams.get('therapistId'); // optional

    if (!sessionTypeId || !date) {
      return NextResponse.json(
        { error: 'sessionTypeId and date are required' },
        { status: 400 }
      );
    }

    const supabase = createClient();

    // 1. Get session type details (duration)
    const { data: sessionType, error: sessionTypeError } = await supabase
      .from('session_types')
      .select('*')
      .eq('id', sessionTypeId)
      .single();

    if (sessionTypeError || !sessionType) {
      return NextResponse.json(
        { error: 'Session type not found' },
        { status: 404 }
      );
    }

    // 2. Get day of week (0=Sunday)
    const dateObj = new Date(date);
    const dayOfWeek = dateObj.getDay();

    // 3. Get available therapists for this day and session type
    let therapistsQuery = supabase
      .from('therapist_schedules')
      .select(`
        *,
        users!therapist_schedules_therapist_id_fkey (
          id,
          full_name,
          email
        ),
        therapist_specializations!inner (
          session_type_id,
          proficiency_level
        )
      `)
      .eq('day_of_week', dayOfWeek)
      .eq('is_available', true)
      .eq('therapist_specializations.session_type_id', sessionTypeId);

    if (therapistId) {
      therapistsQuery = therapistsQuery.eq('therapist_id', therapistId);
    }

    const { data: schedules, error: schedulesError } = await therapistsQuery;

    if (schedulesError) {
      logger.error('Error fetching therapist schedules', schedulesError);
      return NextResponse.json(
        { error: 'Error fetching schedules' },
        { status: 500 }
      );
    }

    if (!schedules || schedules.length === 0) {
      return NextResponse.json({
        success: true,
        slots: [],
        message: 'No therapists available for this session type on this day',
      });
    }

    // 4. For each therapist, get their booked appointments
    const { data: bookedAppointments, error: appointmentsError } = await supabase
      .from('appointments')
      .select('doctor_id, appointment_time, duration')
      .eq('appointment_date', date)
      .in('doctor_id', schedules.map((s: any) => s.therapist_id))
      .in('status', ['scheduled', 'confirmed', 'in_progress']);

    if (appointmentsError) {
      logger.error('Error fetching appointments', appointmentsError);
    }

    // 5. Generate available slots
    const slots: any[] = [];
    const duration = sessionType.duration;

    for (const schedule of schedules) {
      const therapist = schedule.users;
      const startTime = schedule.start_time;
      const endTime = schedule.end_time;

      // Generate time slots
      const timeSlots = generateTimeSlots(
        startTime,
        endTime,
        duration
      );

      // Filter out booked slots
      const bookedForThisTherapist = bookedAppointments?.filter(
        (apt: any) => apt.doctor_id === schedule.therapist_id
      ) || [];

      for (const slot of timeSlots) {
        const isBooked = bookedForThisTherapist.some((apt: any) => 
          timesOverlap(
            slot.start,
            slot.end,
            apt.appointment_time,
            addMinutes(apt.appointment_time, apt.duration || duration)
          )
        );

        if (!isBooked) {
          slots.push({
            therapistId: therapist.id,
            therapistName: therapist.full_name,
            date,
            startTime: slot.start,
            endTime: slot.end,
            duration,
            sessionType: {
              id: sessionType.id,
              nameAr: sessionType.name_ar,
              nameEn: sessionType.name_en,
              price: sessionType.price,
            },
          });
        }
      }
    }

    // Sort by time
    slots.sort((a, b) => a.startTime.localeCompare(b.startTime));

    logger.info('Available slots generated', {
      sessionTypeId,
      date,
      slotsCount: slots.length,
    });

    return NextResponse.json({
      success: true,
      slots,
      sessionType: {
        id: sessionType.id,
        nameAr: sessionType.name_ar,
        nameEn: sessionType.name_en,
        duration: sessionType.duration,
        price: sessionType.price,
      },
    });

  } catch (error) {
    logger.error('Error in available-slots API', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Helper functions

function generateTimeSlots(
  startTime: string,
  endTime: string,
  duration: number
): Array<{ start: string; end: string }> {
  const slots = [];
  let current = startTime;

  while (current < endTime) {
    const next = addMinutes(current, duration);
    if (next <= endTime) {
      slots.push({ start: current, end: next });
    }
    current = addMinutes(current, 15); // 15 minutes increment
  }

  return slots;
}

function addMinutes(time: string, minutes: number): string {
  const [hours, mins] = time.split(':').map(Number);
  const totalMinutes = hours * 60 + mins + minutes;
  const newHours = Math.floor(totalMinutes / 60);
  const newMins = totalMinutes % 60;
  return `${String(newHours).padStart(2, '0')}:${String(newMins).padStart(2, '0')}`;
}

function timesOverlap(
  start1: string,
  end1: string,
  start2: string,
  end2: string
): boolean {
  return start1 < end2 && end1 > start2;
}
