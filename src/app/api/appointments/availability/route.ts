/**
 * Doctor Availability API - توفر الطبيب
 * Get doctor availability for specific date range
 */

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';
import { ValidationHelper } from '@/core/validation';
import { ErrorHandler } from '@/core/errors';
import { getClientInfo } from '@/lib/utils/request-helpers';

const availabilitySchema = z.object({
  doctorId: z.string().uuid('Invalid doctor ID'),
  date: z.string(),
  duration: z.number().min(15).max(240).default(30),
});

export async function GET(request: NextRequest) {
  const startTime = Date.now();
  const { ipAddress, userAgent } = getClientInfo(request);
  
  try {
    const supabase = await createClient();
    const { searchParams } = new URL(request.url);
    
    const validation = ValidationHelper.validate(availabilitySchema, {
      doctorId: searchParams.get('doctorId'),
      date: searchParams.get('date'),
      duration: parseInt(searchParams.get('duration') || '30'),
    });

    if (!validation.success) {
      return NextResponse.json({ error: validation.error.message }, { status: 400 });
    }

    const { doctorId, date, duration } = validation.data!;

    // Get doctor's schedule
    const { data: doctor, error: doctorError } = await supabase
      .from('doctors')
      .select('schedule, speciality')
      .eq('id', doctorId)
      .single();

    if (doctorError || !doctor) {
      return NextResponse.json({ error: 'Doctor not found' }, { status: 404 });
    }

    const requestedDate = new Date(date);
    const dayOfWeek = requestedDate.getDay();
    const schedule = doctor.schedule?.[dayOfWeek];

    if (!schedule || !schedule.isWorking) {
      return NextResponse.json({
        available: false,
        slots: [],
        message: 'Doctor not working on this day'
      });
    }

    // Generate time slots
    const slots = generateTimeSlots(schedule.startTime, schedule.endTime, duration!);
    
    // Check existing appointments
    const { data: existingAppointments } = await supabase
      .from('appointments')
      .select('scheduledAt, duration')
      .eq('doctorId', doctorId)
      .eq('scheduledAt', date)
      .in('status', ['pending', 'confirmed', 'in_progress']);

    // Filter out occupied slots
    const availableSlots = slots.filter(slot => {
      const slotStart = new Date(`${date}T${slot.time}`);
      const slotEnd = new Date(slotStart.getTime() + duration! * 60000);
      
      return !existingAppointments?.some(apt => {
        const aptStart = new Date(apt.scheduledAt);
        const aptEnd = new Date(aptStart.getTime() + apt.duration * 60000);
        
        return (slotStart < aptEnd && slotEnd > aptStart);
      });
    });

    // Log availability check
    await supabase.from('audit_logs').insert({
      action: 'appointment_availability_checked',
      resourceType: 'appointment',
      ipAddress,
      userAgent,
      status: 'success',
      severity: 'info',
      metadata: {
        doctorId,
        date,
        duration,
        availableSlotsCount: availableSlots.length,
      },
      durationMs: Date.now() - startTime,
    });

    return NextResponse.json({
      available: true,
      slots: availableSlots,
      doctor: {
        id: doctorId,
        speciality: doctor.speciality,
      },
      date,
      duration
    });

  } catch (error) {
    return ErrorHandler.getInstance().handle(error);
  }
}

function generateTimeSlots(startTime: string, endTime: string, duration: number): Array<{time: string, available: boolean}> {
  const slots: Array<{time: string, available: boolean}> = [];
  const start = timeToMinutes(startTime);
  const end = timeToMinutes(endTime);
  
  for (let time = start; time < end; time += duration) {
    slots.push({
      time: minutesToTime(time),
      available: true,
    });
  }
  
  return slots;
}

function timeToMinutes(time: string): number {
  const [hours, minutes] = time.split(':').map(Number);
  return (hours || 0) * 60 + (minutes || 0);
}

function minutesToTime(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
}