/**
 * Doctor Availability API - توفر الطبيب
 * Get doctor availability for specific date range
 */

import { _NextRequest, NextResponse } from "next/server";
import { _z } from "zod";

import { _ErrorHandler } from "@/core/errors";
import { _ValidationHelper } from "@/core/validation";
import { _createClient } from "@/lib/supabase/server";

const __availabilitySchema = z.object({
  doctorId: z.string().uuid("Invalid doctor ID"),
  date: z.string().date("Invalid date format"),
  duration: z.number().min(15).max(240).default(30),
});

export async function __GET(_request: NextRequest) {
  try {
    const __supabase = createClient();
    const { searchParams } = new URL(request.url);

    const __validation = ValidationHelper.validate(availabilitySchema, {
      doctorId: searchParams.get("doctorId"),
      date: searchParams.get("date"),
      duration: parseInt(searchParams.get("duration") || "30"),
    });

    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.message },
        { status: 400 },
      );
    }

    const { doctorId, date, duration } = validation.data;

    // Get doctor's schedule
    const { data: doctor, error: doctorError } = await supabase
      .from("doctors")
      .select("schedule, speciality")
      .eq("id", doctorId)
      .single();

    if (doctorError || !doctor) {
      return NextResponse.json({ error: "Doctor not found" }, { status: 404 });
    }

    const __requestedDate = new Date(date);
    const __dayOfWeek = requestedDate.getDay();
    const __schedule = doctor.schedule?.[dayOfWeek];

    if (!schedule || !schedule.isWorking) {
      return NextResponse.json({
        available: false,
        slots: [],
        message: "Doctor not working on this day",
      });
    }

    // Generate time slots
    const __slots = generateTimeSlots(
      schedule.startTime,
      schedule.endTime,
      duration || 30,
    );

    // Check existing appointments
    const { data: existingAppointments } = await supabase
      .from("appointments")
      .select("scheduledAt, duration")
      .eq("doctorId", doctorId)
      .eq("scheduledAt", date)
      .in("status", ["pending", "confirmed", "in_progress"]);

    // Filter out occupied slots
    const __slotDuration = duration || 30;
    const __availableSlots = slots.filter((slot) => {
      const __slotStart = new Date(`${date}T${slot.time}`);
      const __slotEnd = new Date(slotStart.getTime() + slotDuration * 60000);

      return !existingAppointments?.some((_apt: unknown) => {
        const __aptStart = new Date(apt.scheduledAt);
        const __aptEnd = new Date(aptStart.getTime() + apt.duration * 60000);

        return slotStart < aptEnd && slotEnd > aptStart;
      });
    });

    return NextResponse.json({
      available: true,
      slots: availableSlots,
      doctor: {
        id: doctorId,
        speciality: doctor.speciality,
      },
      date,
      duration,
    });
  } catch (error) {
    return ErrorHandler.getInstance().handle(error as Error);
  }
}

function __generateTimeSlots(
  startTime: string,
  endTime: string,
  duration: number,
): { time: string; available: boolean }[] {
  const slots: { time: string; available: boolean }[] = [];
  const __start = timeToMinutes(startTime);
  const __end = timeToMinutes(endTime);

  for (let time = start; time < end; time += duration) {
    slots.push({
      time: minutesToTime(time),
      available: true,
    });
  }

  return slots;
}

function __timeToMinutes(_time: string): number {
  const [hours = 0, minutes = 0] = time.split(":").map(Number);
  return hours * 60 + minutes;
}

function __minutesToTime(_minutes: number): string {
  const __hours = Math.floor(minutes / 60);
  const __mins = minutes % 60;
  return `${hours.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}`;
}
