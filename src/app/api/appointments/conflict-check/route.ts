/**
 * Appointment Conflict Check API - فحص تعارض المواعيد
 * Check for appointment conflicts and availability
 */

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';
import { ValidationHelper } from '@/core/validation';
import { ErrorHandler } from '@/core/errors';
import { getClientInfo } from '@/lib/utils/request-helpers';

const conflictCheckSchema = z.object({
  doctorId: z.string().uuid('Invalid doctor ID'),
  scheduledAt: z.string().datetime('Invalid datetime format'),
  duration: z.number().min(15).max(240).default(30),
  excludeAppointmentId: z.string().uuid().optional(),
});

export async function POST(request: NextRequest) {
  const startTime = Date.now();
  const { ipAddress, userAgent } = getClientInfo(request);

  try {
    const supabase = await createClient();
    const body = await request.json();

    // Validate input
    const validation = await ValidationHelper.validateAsync(
      conflictCheckSchema,
      body
    );
    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.message },
        { status: 400 }
      );
    }

    const { doctorId, scheduledAt, duration, excludeAppointmentId } =
      validation.data!;

    const startTime = new Date(scheduledAt);
    const endTime = new Date(startTime.getTime() + duration! * 60000);

    // Check for conflicts - IMPORTANT: Database uses snake_case
    // We need to check for overlapping appointments
    // An appointment conflicts if: (appt_start < requested_end) AND (appt_end > requested_start)
    // Since we can't easily calculate appt_end in SQL, we fetch all active appointments
    // and check overlaps in JavaScript
    let query = supabase
      .from('appointments')
      .select('id, scheduled_at, duration, status, patients!inner(full_name)')
      .eq('doctor_id', doctorId)
      .in('status', ['pending', 'confirmed', 'in_progress'])
      // Get appointments that might overlap - start before our end time
      .lt('scheduled_at', endTime.toISOString());

    if (excludeAppointmentId) {
      query = query.neq('id', excludeAppointmentId);
    }

    const { data: allAppointments, error } = await query;
    
    // Filter for actual overlaps in JavaScript
    const conflicts = (allAppointments || []).filter((appt: any) => {
      const apptStart = new Date(appt.scheduled_at);
      const apptEnd = new Date(apptStart.getTime() + (appt.duration || 30) * 60000);
      // Check overlap: appt_start < requested_end AND appt_end > requested_start
      return apptStart < endTime && apptEnd > startTime;
    });

    if (error) {
      return NextResponse.json(
        { error: 'Failed to check conflicts' },
        { status: 500 }
      );
    }

    const hasConflicts = conflicts && conflicts.length > 0;

    // Log conflict check
    // IMPORTANT: Database uses snake_case
    await supabase.from('audit_logs').insert({
      action: 'appointment_conflict_checked',
      resource_type: 'appointment',
      ip_address: ipAddress,
      user_agent: userAgent,
      status: 'success',
      severity: 'secondary',
      metadata: {
        doctorId,
        scheduledAt,
        duration,
        hasConflicts,
        conflict_count: conflicts?.length || 0,
      },
      duration_ms: Date.now() - startTime.getTime(),
    });

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
    return ErrorHandler.getInstance().handle(error as Error);
  }
}
