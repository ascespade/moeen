/**
 * Appointment Conflict Check API - فحص تعارض المواعيد
 * Check for appointment conflicts and availability
 */

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';
import { ValidationHelper } from '@/core/validation';
import { ErrorHandler } from '@/core/errors';

const conflictCheckSchema = z.object({
  doctorId: z.string().uuid('Invalid doctor ID'),
  scheduledAt: z.string().datetime('Invalid datetime format'),
  duration: z.number().min(15).max(240).default(30),
  excludeAppointmentId: z.string().uuid().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient();
    const body = await request.json();

    // Validate input
    const validation = await ValidationHelper.validateAsync(conflictCheckSchema, body);
    if (!validation.success) {
      return NextResponse.json({ error: validation.error.message }, { status: 400 });
    }

    const { doctorId, scheduledAt, duration, excludeAppointmentId } = validation.data;

    const startTime = new Date(scheduledAt);
    const endTime = new Date(startTime.getTime() + duration * 60000);

    // Check for conflicts
    let query = supabase
      .from('appointments')
      .select('id, scheduledAt, duration, status, patients(fullName)')
      .eq('doctorId', doctorId)
      .in('status', ['pending', 'confirmed', 'in_progress'])
      .gte('scheduledAt', startTime.toISOString())
      .lte('scheduledAt', endTime.toISOString());

    if (excludeAppointmentId) {
      query = query.neq('id', excludeAppointmentId);
    }

    const { data: conflicts, error } = await query;

    if (error) {
      return NextResponse.json({ error: 'Failed to check conflicts' }, { status: 500 });
    }

    const hasConflicts = conflicts && conflicts.length > 0;

    return NextResponse.json({
      success: true,
      data: {
        hasConflicts,
        conflicts: conflicts || [],
        conflictCount: conflicts?.length || 0,
        requestedTime: {
          start: startTime.toISOString(),
          end: endTime.toISOString(),
          duration,
        },
        doctorId,
      },
      message: hasConflicts ? 'Conflicts found' : 'No conflicts found',
    });

  } catch (error) {
    return ErrorHandler.handle(error);
  }
}