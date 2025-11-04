import { NextRequest, NextResponse } from 'next/server';
import { realDB } from '@/lib/supabase-real';
import { z } from 'zod';
import { requireAuth } from '@/lib/auth/authorize';

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

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    // Security: Require authentication
    const authResult = await requireAuth(["admin", "staff", "doctor", "supervisor"])(request);
    if (!authResult.authorized || !authResult.user) {
      return NextResponse.json(
        { error: 'Unauthorized - Authentication required' },
        { status: 401 }
      );
    }

    // Check permissions using PermissionManager
    const { PermissionManager } = await import('@/lib/permissions');
    const canRead = PermissionManager.hasPermission(
      authResult.user.role as any,
      'insurance-claims',
      'read',
      {
        userId: authResult.user.id,
      }
    );

    if (!canRead) {
      return NextResponse.json(
        { error: 'Forbidden - Insufficient permissions' },
        { status: 403 }
      );
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
      claims = claims.filter((claim: unknown) => claim.status === status);
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
    console.error('Error fetching insurance claims:', error);
    return NextResponse.json(
      { error: 'Failed to fetch insurance claims' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Security: Require authentication
    const authResult = await requireAuth(["doctor", "staff", "admin"])(request);
    if (!authResult.authorized || !authResult.user) {
      return NextResponse.json(
        { error: 'Unauthorized - Authentication required' },
        { status: 401 }
      );
    }

    const body = await request.json();

    // Check permissions using PermissionManager
    const { PermissionManager } = await import('@/lib/permissions');
    const canCreate = PermissionManager.hasPermission(
      authResult.user.role as any,
      'insurance-claims',
      'create',
      {
        userId: authResult.user.id,
        resourceOwnerId: body.patient_id, // Check if doctor can create claim for patient
      }
    );

    if (!canCreate) {
      return NextResponse.json(
        { error: 'Forbidden - Insufficient permissions' },
        { status: 403 }
      );
    }
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
    console.error('Error creating insurance claim:', error);
    return NextResponse.json(
      { error: 'Failed to create insurance claim' },
      { status: 500 }
    );
  }
}
