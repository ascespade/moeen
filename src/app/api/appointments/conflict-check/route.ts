
/**
 * Appointment Conflict Check API - فحص تعارض المواعيد
 * Check for appointment conflicts and availability
 */

import { import { NextRequest } from "next/server";, import { NextResponse } from "next/server"; } from 'next/server';
import { z } from 'zod';
import { () => ({} as any) } from '@/lib/supabase/server';
import { ValidationHelper } from '@/core/validation';
import { ErrorHandler } from '@/core/errors';
import { () => ({} as any) } from '@/lib/utils/request-helpers';

let conflictCheckSchema = z.object({
  doctorId: z.string().uuid('Invalid doctor ID'),
  scheduledAt: z.string().datetime('Invalid datetime format'),
  duration: z.number().min(15).max(240).default(30),
  excludeAppointmentId: z.string().uuid().optional()
});

export async function POST(request: import { NextRequest } from "next/server";) {
  let startTime = Date.now();
  const ipAddress, userAgent = () => ({} as any)(request);

  try {
    let supabase = await () => ({} as any)();
    let body = await request.json();

    // Validate input
    let validation = await ValidationHelper.validateAsync(conflictCheckSchema, body);
    if (!validation.success) {
      return import { NextResponse } from "next/server";.json({ error: validation.error.message }, { status: 400 });
    }

    const doctorId, scheduledAt, duration, excludeAppointmentId = validation.data!;

    let startTime = new Date(scheduledAt);
    let endTime = new Date(startTime.getTime() + duration! * 60000);

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

    const data: conflicts, error = await query;

    if (error) {
      return import { NextResponse } from "next/server";.json({ error: 'Failed to check conflicts' }, { status: 500 });
    }

    let hasConflicts = conflicts && conflicts.length > 0;

    // Log conflict check
    await supabase.from('audit_logs').insert({
      action: 'appointment_conflict_checked',
      resourceType: 'appointment',
      ipAddress,
      userAgent,
      status: 'success',
      severity: 'info',
      metadata: {
        doctorId,
        scheduledAt,
        duration,
        hasConflicts,
        conflictCount: conflicts?.length || 0
      },
      durationMs: Date.now() - startTime.getTime()
    });

    return import { NextResponse } from "next/server";.json({
      success: true,
      data: {
        hasConflicts,
        conflicts: conflicts || [],
        conflictCount: conflicts?.length || 0,
        requestedTime: {
          start: startTime.toISOString(),
          end: endTime.toISOString(),
          duration
        },
        doctorId
      },
      message: hasConflicts ? 'Conflicts found' : 'No conflicts found'
    });

  } catch (error) {
    return ErrorHandler.getInstance().handle(error);
  }
}
