import { NextRequest, NextResponse } from 'next/server';
import { realDB } from '@/lib/supabase-real';
import { z } from 'zod';
import { requireAuth } from '@/lib/auth/authorize';
import { ErrorHandler } from '@/core/errors';
import { logger } from '@/lib/logger';

const sessionSchema = z.object({
  patient_id: z.string().uuid('Invalid patient ID'),
  doctor_id: z.string().uuid('Invalid doctor ID'),
  appointment_id: z.string().uuid().optional(),
  session_date: z.string().min(1, 'Session date is required'),
  session_time: z.string().min(1, 'Session time is required'),
  duration_minutes: z.number().optional(),
  type: z.enum(['assessment', 'treatment', 'follow_up', 'consultation']),
  notes: z.string().optional(),
  exercises: z.any().optional(),
  insurance_claim_number: z.string().optional(),
});

export async function GET(request: NextRequest) {
  try {
    // Authorize any authenticated user
    const authResult = await requireAuth()(request);
    if (!authResult.authorized) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const { searchParams } = new URL(request.url);
    const patientId = searchParams.get('patientId') || '';
    const doctorId = searchParams.get('doctorId') || '';
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    let sessions;
    if (patientId) {
      sessions = await realDB.getSessions(patientId, limit);
    } else if (doctorId) {
      // Get sessions by doctor (would need to implement this in realDB)
      sessions = await realDB.getSessions('', limit);
    } else {
      sessions = await realDB.getSessions('', limit);
    }

    // Apply pagination
    const paginatedSessions = sessions.slice(offset, offset + limit);

    return NextResponse.json({
      success: true,
      data: paginatedSessions,
      pagination: {
        total: sessions.length,
        limit,
        offset,
        hasMore: offset + limit < sessions.length,
      },
    });
  } catch (error) {
    logger.error('Error fetching sessions', error);
    return ErrorHandler.getInstance().handle(error as Error);
  }
}

export async function POST(request: NextRequest) {
  try {
    // Authorize staff, doctor, supervisor, or admin
    const authResult = await requireAuth(['staff', 'doctor', 'supervisor', 'admin'])(request);
    if (!authResult.authorized) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const body = await request.json();
    const validation = sessionSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: validation.error.issues },
        { status: 400 }
      );
    }

    const session = await realDB.createSession(validation.data);

    return NextResponse.json({
      success: true,
      data: session,
      message: 'Session created successfully',
    });
  } catch (error) {
    logger.error('Error creating session', error);
    return ErrorHandler.getInstance().handle(error as Error);
  }
}
