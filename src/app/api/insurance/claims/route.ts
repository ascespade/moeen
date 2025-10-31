/**
 * Insurance Claims Processing API - معالجة مطالبات التأمين
 * Handle insurance claims processing, provider integration, and status tracking
 */

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';
import { ValidationHelper } from '@/core/validation';
import { ErrorHandler } from '@/core/errors';
import { requireAuth } from '@/lib/auth/authorize';

const claimSchema = z.object({
  appointmentId: z.string().uuid('Invalid appointment ID'),
  provider: z.enum(['tawuniya', 'bupa', 'axa', 'medgulf', 'other']),
  policyNumber: z.string().min(1, 'Policy number required'),
  memberId: z.string().min(1, 'Member ID required'),
  claimAmount: z.number().positive('Claim amount must be positive'),
  diagnosis: z.string().min(1, 'Diagnosis required'),
  treatment: z.string().min(1, 'Treatment required'),
  attachments: z.array(z.string().url()).optional(),
  notes: z.string().optional(),
  priority: z.enum(['low', 'normal', 'high', 'urgent']).default('normal'),
});

const updateClaimSchema = z.object({
  status: z
    .enum([
      'draft',
      'submitted',
      'under_review',
      'approved',
      'rejected',
      'paid',
    ])
    .optional(),
  providerResponse: z.string().optional(),
  approvedAmount: z.number().positive().optional(),
  rejectionReason: z.string().optional(),
  notes: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    // Authorize staff, supervisor, or admin
    const authResult = await requireAuth(['staff', 'supervisor', 'admin'])(
      request
    );
    if (!authResult.authorized) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabase = await createClient();
    const body = await request.json();

    // Validate input
    const validation = await ValidationHelper.validateAsync(claimSchema, body);
    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.message },
        { status: 400 }
      );
    }

    const {
      appointmentId,
      provider,
      policyNumber,
      memberId,
      claimAmount,
      diagnosis,
      treatment,
      attachments,
      notes,
      priority,
    } = validation.data;

    // Verify appointment exists and get details
    const { data: appointment, error: appointmentError } = await supabase
      .from('appointments')
      .select(
        `
        id,
        patientId,
        doctorId,
        scheduledAt,
        status,
        patients(id, fullName, insuranceProvider, insuranceNumber),
        doctors(id, fullName, speciality)
      `
      )
      .eq('id', appointmentId)
      .single();

    if (appointmentError || !appointment) {
      return NextResponse.json(
        { error: 'Appointment not found' },
        { status: 404 }
      );
    }

    // Verify patient has insurance
    if (!appointment.patients.insuranceProvider) {
      return NextResponse.json(
        { error: 'Patient has no insurance provider' },
        { status: 400 }
      );
    }

    // Generate claim reference
    const claimReference = `CLM${Date.now()}${Math.random().toString(36).substr(2, 6).toUpperCase()}`;

    // Create insurance claim
    const { data: claim, error: claimError } = await supabase
      .from('insurance_claims')
      .insert({
        appointmentId,
        patientId: appointment.patientId,
        provider,
        policyNumber,
        memberId,
        claimAmount,
        diagnosis,
        treatment,
        attachments: attachments || [],
        notes,
        priority,
        claimReference,
        status: 'draft',
        createdBy: authResult.user!.id,
      })
      .select()
      .single();

    if (claimError) {
      return NextResponse.json(
        { error: 'Failed to create insurance claim' },
        { status: 500 }
      );
    }

    // Submit to insurance provider
    const submissionResult = await submitToInsuranceProvider(claim, provider);

    // Update claim with submission result
    const { error: updateError } = await supabase
      .from('insurance_claims')
      .update({
        status: submissionResult.success ? 'submitted' : 'draft',
        providerResponse: submissionResult.response,
        submittedAt: submissionResult.success ? new Date().toISOString() : null,
      })
      .eq('id', claim.id);

    if (updateError) {
      console.error('Failed to update claim submission status:', updateError);
    }

    // Create audit log
    await supabase.from('audit_logs').insert({
      action: 'insurance_claim_created',
      entityType: 'insurance_claim',
      entityId: claim.id,
      userId: authResult.user!.id,
      metadata: {
        appointmentId,
        provider,
        claimAmount,
        status: submissionResult.success ? 'submitted' : 'draft',
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        ...claim,
        submissionResult,
      },
      message: 'Insurance claim created successfully',
    });
  } catch (error) {
    return ErrorHandler.getInstance().handle(error as Error);
  }
}

export async function GET(request: NextRequest) {
  try {
    // Authorize staff, supervisor, or admin
    const authResult = await requireAuth(['staff', 'supervisor', 'admin'])(
      request
    );
    if (!authResult.authorized) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabase = await createClient();
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const provider = searchParams.get('provider');
    const patientId = searchParams.get('patientId');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');

    let query = supabase
      .from('insurance_claims')
      .select(
        `
        *,
        appointment:appointments(
          id,
          scheduledAt,
          patients(id, fullName, insuranceProvider),
          doctors(id, fullName, speciality)
        ),
        createdBy:users(id, email, fullName)
      `
      )
      .order('createdAt', { ascending: false })
      .range((page - 1) * limit, page * limit - 1);

    if (status) {
      query = query.eq('status', status);
    }
    if (provider) {
      query = query.eq('provider', provider);
    }
    if (patientId) {
      query = query.eq('patientId', patientId);
    }

    const { data: claims, error, count } = await query;

    if (error) {
      return NextResponse.json(
        { error: 'Failed to fetch insurance claims' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: claims,
      pagination: {
        page,
        limit,
        total: count || 0,
        pages: Math.ceil((count || 0) / limit),
      },
    });
  } catch (error) {
    return ErrorHandler.getInstance().handle(error as Error);
  }
}

export async function PUT(request: NextRequest) {
  try {
    // Authorize supervisor or admin only
    const authResult = await requireAuth(['supervisor', 'admin'])(request);
    if (!authResult.authorized) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabase = await createClient();
    const { searchParams } = new URL(request.url);
    const claimId = searchParams.get('claimId');

    if (!claimId) {
      return NextResponse.json({ error: 'Claim ID required' }, { status: 400 });
    }

    const body = await request.json();

    // Validate input
    const validation = await ValidationHelper.validateAsync(
      updateClaimSchema,
      body
    );
    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.message },
        { status: 400 }
      );
    }

    const updateData = validation.data;

    // Update claim
    const { data: updatedClaim, error: updateError } = await supabase
      .from('insurance_claims')
      .update({
        ...updateData,
        updatedBy: authResult.user!.id,
        updatedAt: new Date().toISOString(),
      })
      .eq('id', claimId)
      .select()
      .single();

    if (updateError) {
      return NextResponse.json(
        { error: 'Failed to update claim' },
        { status: 500 }
      );
    }

    // Create audit log
    await supabase.from('audit_logs').insert({
      action: 'insurance_claim_updated',
      entityType: 'insurance_claim',
      entityId: claimId,
      userId: authResult.user!.id,
      metadata: updateData,
    });

    return NextResponse.json({
      success: true,
      data: updatedClaim,
      message: 'Insurance claim updated successfully',
    });
  } catch (error) {
    return ErrorHandler.getInstance().handle(error as Error);
  }
}

async function submitToInsuranceProvider(claim: any, provider: string) {
  try {
    // This would integrate with actual insurance provider APIs
    // For now, we'll simulate the submission

    const providerEndpoints = {
      tawuniya: 'https://api.tawuniya.com/claims',
      bupa: 'https://api.bupa.com/claims',
      axa: 'https://api.axa.com/claims',
      medgulf: 'https://api.medgulf.com/claims',
      other: null,
    };

    const endpoint = providerEndpoints[provider];

    if (!endpoint) {
      return {
        success: false,
        response: 'Provider integration not available',
      };
    }

    // Simulate API call
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env[`${provider.toUpperCase()}_API_KEY`]}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        claimReference: claim.claimReference,
        policyNumber: claim.policyNumber,
        memberId: claim.memberId,
        claimAmount: claim.claimAmount,
        diagnosis: claim.diagnosis,
        treatment: claim.treatment,
        attachments: claim.attachments,
      }),
    });

    if (response.ok) {
      const result = await response.json();
      return {
        success: true,
        response: result,
      };
    } else {
      return {
        success: false,
        response: `Provider API error: ${response.status}`,
      };
    }
  } catch (error) {
    return {
      success: false,
      response: `Provider integration error: ${error}`,
    };
  }
}
