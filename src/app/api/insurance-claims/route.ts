import { NextRequest, NextResponse } from 'next/server';
import { realDB } from '@/lib/supabase-real';
import { z } from 'zod';
import { requireAuth } from '@/lib/auth/authorize';
import { ErrorHandler } from '@/core/errors';
import { logger } from '@/lib/logger';

const insuranceClaimSchema = z.object({
  patient_id: z.string().uuid('Invalid patient ID'),
  appointment_id: z.string().uuid().optional(),
  session_id: z.string().uuid().optional(),
  insurance_provider: z.string().min(1, 'Insurance provider is required'),
  claim_number: z.string().min(1, 'Claim number is required'),
  service_code: z.string().optional(),
  diagnosis_code: z.string().optional(),
  amount: z.number().min(0, 'Amount must be positive'),
  status: z.string().optional(),
});

export async function GET(request: NextRequest) {
  try {
    // Authorize staff, supervisor, doctor, or admin
    const authResult = await requireAuth(['staff', 'supervisor', 'doctor', 'admin'])(request);
    if (!authResult.authorized) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const { searchParams } = new URL(request.url);
    const patientId = searchParams.get('patientId') || '';
    const status = searchParams.get('status') || '';
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    let claims;
    if (patientId) {
      claims = await realDB.getInsuranceClaims(patientId);
    } else {
      // Get all claims (would need to implement this in realDB)
      claims = [];
    }

    // Filter by status if provided
    if (status) {
      claims = claims.filter((claim: any) => claim.status === status);
    }

    // Apply pagination
    const paginatedClaims = claims.slice(offset, offset + limit);

    return NextResponse.json({
      success: true,
      data: paginatedClaims,
      pagination: {
        total: claims.length,
        limit,
        offset,
        hasMore: offset + limit < claims.length,
      },
    });
  } catch (error) {
    logger.error('Error fetching insurance claims', error);
    return ErrorHandler.getInstance().handle(error as Error);
  }
}

export async function POST(request: NextRequest) {
  try {
    // Authorize staff, supervisor, doctor, or admin
    const authResult = await requireAuth(['staff', 'supervisor', 'doctor', 'admin'])(request);
    if (!authResult.authorized) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const body = await request.json();
    const validation = insuranceClaimSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: validation.error.issues },
        { status: 400 }
      );
    }

    const claim = await realDB.createInsuranceClaim(validation.data);

    return NextResponse.json({
      success: true,
      data: claim,
      message: 'Insurance claim created successfully',
    });
  } catch (error) {
    logger.error('Error creating insurance claim', error);
    return ErrorHandler.getInstance().handle(error as Error);
  }
}
