import { NextRequest, NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";
import { authorize } from "@/lib/auth/authorize";

interface TimeSlot {
  time: string;
  timeString: string;
  available: boolean;
}

export async function GET(request: NextRequest) {
  try {
    const { user, error: authError } = await authorize(request);

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const doctorId = searchParams.get("doctorId");
    const date = searchParams.get("date");
    const speciality = searchParams.get("speciality");

    if (!date) {
      return NextResponse.json(
        { error: "Date parameter is required" },
        { status: 400 },
      );
    }

    const supabase = await createClient();

    // Get available doctors
    let query = supabase
      .from("doctors")
      .select(
        `
        id,
        speciality,
        schedule,
        users!inner(email)
      `,
      )
      .eq("status", "active");

    if (doctorId) {
      query = query.eq("id", doctorId);
    }
    if (speciality) {
      query = query.eq("speciality", speciality);
    }

    const { data: doctors, error: doctorsError } = await query;

    if (doctorsError) {
      return NextResponse.json(
        { error: "Failed to fetch doctors" },
        { status: 500 },
      );
    }

    // Get existing appointments for the date
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const { data: appointments, error: appointmentsError } = await supabase
      .from("appointments")
      .select("doctor_id, scheduled_at, status")
      .gte("scheduled_at", startOfDay.toISOString())
      .lte("scheduled_at", endOfDay.toISOString())
      .in("status", ["pending", "confirmed", "in_progress"]);

    if (appointmentsError) {
      return NextResponse.json(
        { error: "Failed to fetch appointments" },
        { status: 500 },
      );
    }

    // Generate available time slots for each doctor
    const availableSlots =
      doctors?.map((doctor) => {
        const schedule = doctor.schedule || {};
        const workingHours = schedule.workingHours || {
          start: "09:00",
          end: "17:00",
        };
        const breaks = schedule.breaks || [];
        const slotDuration = 30; // 30 minutes per slot

        const slots: TimeSlot[] = [];
        const startTime = new Date(date);
        const [startHour, startMinute] = workingHours.start
          .split(":")
          .map(Number);
        startTime.setHours(startHour, startMinute, 0, 0);

        const endTime = new Date(date);
        const [endHour, endMinute] = workingHours.end.split(":").map(Number);
        endTime.setHours(endHour, endMinute, 0, 0);

        // Generate time slots
        for (
          let time = new Date(startTime);
          time < endTime;
          time.setMinutes(time.getMinutes() + slotDuration)
        ) {
          const slotTime = time.toISOString();
          const timeString = time.toTimeString().slice(0, 5);

          // Check if slot is during a break
          const isBreakTime = breaks.some((breakTime: any) => {
            const breakStart = new Date(date);
            const [breakStartHour, breakStartMinute] = breakTime.start
              .split(":")
              .map(Number);
            breakStart.setHours(breakStartHour, breakStartMinute, 0, 0);

            const breakEnd = new Date(date);
            const [breakEndHour, breakEndMinute] = breakTime.end
              .split(":")
              .map(Number);
            breakEnd.setHours(breakEndHour, breakEndMinute, 0, 0);

            return time >= breakStart && time < breakEnd;
          });

          // Check if slot is already booked
          const isBooked = appointments?.some(
            (apt) =>
              apt.doctor_id === doctor.id &&
              new Date(apt.scheduled_at).getTime() === time.getTime(),
          );

          if (!isBreakTime && !isBooked) {
            slots.push({
              time: slotTime,
              timeString,
              available: true,
            });
          }
        }

        return {
          doctorId: doctor.id,
          speciality: doctor.speciality,
          email: doctor.users.email,
          availableSlots: slots,
        };
      }) || [];

    return NextResponse.json({
      date,
      doctors: availableSlots,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
