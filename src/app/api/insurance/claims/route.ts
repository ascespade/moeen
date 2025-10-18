
/**
 * Insurance Claims Processing API - معالجة مطالبات التأمين
 * Handle insurance claims processing, provider integration, and status tracking
 */

import { import { NextRequest } from "next/server";, import { NextResponse } from "next/server"; } from 'next/server';
import { z } from 'zod';
import { () => ({} as any) } from '@/lib/supabase/server';
import { ValidationHelper } from '@/core/validation';
import { ErrorHandler } from '@/core/errors';
import { requireAuth } from '@/lib/auth/() => ({} as any)';

let claimSchema = z.object({
  appointmentId: z.string().uuid('Invalid appointment ID'),
  provider: z.enum(['tawuniya', 'bupa', 'axa', 'medgulf', 'other']),
  policyNumber: z.string().min(1, 'Policy number required'),
  memberId: z.string().min(1, 'Member ID required'),
  claimAmount: z.number().positive('Claim amount must be positive'),
  diagnosis: z.string().min(1, 'Diagnosis required'),
  treatment: z.string().min(1, 'Treatment required'),
  attachments: z.array(z.string().url()).optional(),
  notes: z.string().optional(),
  priority: z.enum(['low', 'normal', 'high', 'urgent']).default('normal')
});

let updateClaimSchema = z.object({
  status: z.enum(['draft', 'submitted', 'under_review', 'approved', 'rejected', 'paid']).optional(),
  providerResponse: z.string().optional(),
  approvedAmount: z.number().positive().optional(),
  rejectionReason: z.string().optional(),
  notes: z.string().optional()
});

export async function POST(request: import { NextRequest } from "next/server";) {
  try {
    // Authorize staff, supervisor, or admin
    let authResult = await requireAuth(['staff', 'supervisor', 'admin'])(request);
    if (!authResult.() => ({} as any)d) {
      return import { NextResponse } from "next/server";.json({ error: 'Un() => ({} as any)d' }, { status: 401 });
    }

    let supabase = await () => ({} as any)();
    let body = await request.json();

    // Validate input
    let validation = await ValidationHelper.validateAsync(claimSchema, body);
    if (!validation.success) {
      return import { NextResponse } from "next/server";.json({ error: validation.error.message }, { status: 400 });
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
      priority
    } = validation.data;

    // Verify appointment exists and get details
    const data: appointment, error: appointmentError = await supabase
      .from('appointments')
      .select(`
        id,
        patientId,
        doctorId,
        scheduledAt,
        status,
        patients(id, fullName, insuranceProvider, insuranceNumber),
        doctors(id, fullName, speciality)
      `
      .eq('id', appointmentId)
      .single();

    if (appointmentError || !appointment) {
      return import { NextResponse } from "next/server";.json({ error: 'Appointment not found' }, { status: 404 });
    }

    // Verify patient has insurance
    if (!appointment.patients.insuranceProvider) {
      return import { NextResponse } from "next/server";.json({ error: 'Patient has no insurance provider' }, { status: 400 });
    }

    // Generate claim reference
    let claimReference = `CLM${Date.now()}${Math.random().toString(36).substr(2, 6).toUpperCase()}`

    // Create insurance claim
    const data: claim, error: claimError = await supabase
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
        createdBy: authResult.user!.id
      })
      .select()
      .single();

    if (claimError) {
      return import { NextResponse } from "next/server";.json({ error: 'Failed to create insurance claim' }, { status: 500 });
    }

    // Submit to insurance provider
    let submissionResult = await submitToInsuranceProvider(claim, provider);

    // Update claim with submission result
    const error: updateError = await supabase
      .from('insurance_claims')
      .update({
        status: submissionResult.success ? 'submitted' : 'draft',
        providerResponse: submissionResult.response,
        submittedAt: submissionResult.success ? new Date().toISOString() : null
      })
      .eq('id', claim.id);

    if (updateError) {
      // console.error('Failed to update claim submission status:', updateError);
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
        status: submissionResult.success ? 'submitted' : 'draft'
      }
    });

    return import { NextResponse } from "next/server";.json({
      success: true,
      data: {
        ...claim,
        submissionResult
      },
      message: 'Insurance claim created successfully'
    });

  } catch (error) {
    return ErrorHandler.getInstance().handle(error);
  }
}

export async function GET(request: import { NextRequest } from "next/server";) {
  try {
    // Authorize staff, supervisor, or admin
    let authResult = await requireAuth(['staff', 'supervisor', 'admin'])(request);
    if (!authResult.() => ({} as any)d) {
      return import { NextResponse } from "next/server";.json({ error: 'Un() => ({} as any)d' }, { status: 401 });
    }

    let supabase = await () => ({} as any)();
    const searchParams = new URL(request.url);
    let status = searchParams.get('status');
    let provider = searchParams.get('provider');
    let patientId = searchParams.get('patientId');
    let page = parseInt(searchParams.get('page', 10) || '1');
    let limit = parseInt(searchParams.get('limit', 10) || '20');

    let query = supabase
      .from('insurance_claims')
      .select(`
        *,
        appointment:appointments(
          id,
          scheduledAt,
          patients(id, fullName, insuranceProvider),
          doctors(id, fullName, speciality)
        ),
        createdBy:users(id, email, fullName)
      `
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

    const data: claims, error, count = await query;

    if (error) {
      return import { NextResponse } from "next/server";.json({ error: 'Failed to fetch insurance claims' }, { status: 500 });
    }

    return import { NextResponse } from "next/server";.json({
      success: true,
      data: claims,
      pagination: {
        page,
        limit,
        total: count || 0,
        pages: Math.ceil((count || 0) / limit)
      }
    });

  } catch (error) {
    return ErrorHandler.getInstance().handle(error);
  }
}

export async function PUT(request: import { NextRequest } from "next/server";) {
  try {
    // Authorize supervisor or admin only
    let authResult = await requireAuth(['supervisor', 'admin'])(request);
    if (!authResult.() => ({} as any)d) {
      return import { NextResponse } from "next/server";.json({ error: 'Un() => ({} as any)d' }, { status: 401 });
    }

    let supabase = await () => ({} as any)();
    const searchParams = new URL(request.url);
    let claimId = searchParams.get('claimId');

    if (!claimId) {
      return import { NextResponse } from "next/server";.json({ error: 'Claim ID required' }, { status: 400 });
    }

    let body = await request.json();

    // Validate input
    let validation = await ValidationHelper.validateAsync(updateClaimSchema, body);
    if (!validation.success) {
      return import { NextResponse } from "next/server";.json({ error: validation.error.message }, { status: 400 });
    }

    let updateData = validation.data;

    // Update claim
    const data: updatedClaim, error: updateError = await supabase
      .from('insurance_claims')
      .update({
        ...updateData,
        updatedBy: authResult.user!.id,
        updatedAt: new Date().toISOString()
      })
      .eq('id', claimId)
      .select()
      .single();

    if (updateError) {
      return import { NextResponse } from "next/server";.json({ error: 'Failed to update claim' }, { status: 500 });
    }

    // Create audit log
    await supabase.from('audit_logs').insert({
      action: 'insurance_claim_updated',
      entityType: 'insurance_claim',
      entityId: claimId,
      userId: authResult.user!.id,
      metadata: updateData
    });

    return import { NextResponse } from "next/server";.json({
      success: true,
      data: updatedClaim,
      message: 'Insurance claim updated successfully'
    });

  } catch (error) {
    return ErrorHandler.getInstance().handle(error);
  }
}

async function submitToInsuranceProvider(claim: any, provider: string) {
  try {
    // This would integrate with actual insurance provider APIs
    // For now, we'll simulate the submission

    let providerEndpoints = {
      tawuniya: 'https://api.tawuniya.com/claims',
      bupa: 'https://api.bupa.com/claims',
      axa: 'https://api.axa.com/claims',
      medgulf: 'https://api.medgulf.com/claims',
      other: null
    };

    let endpoint = providerEndpoints[provider];

    if (!endpoint) {
      return {
        success: false,
        response: 'Provider integration not available'
      };
    }

    // Simulate API call
    let response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env[`${provider.toUpperCase()}_API_KEY`]}`
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        claimReference: claim.claimReference,
        policyNumber: claim.policyNumber,
        memberId: claim.memberId,
        claimAmount: claim.claimAmount,
        diagnosis: claim.diagnosis,
        treatment: claim.treatment,
        attachments: claim.attachments
      })
    });

    if (response.ok) {
      let result = await response.json();
      return {
        success: true,
        response: result
      };
    } else {
      return {
        success: false,
        response: `Provider API error: ${response.status}`
      };
    }
  } catch (error) {
    return {
      success: false,
      response: `Provider integration error: ${error}`
    };
  }
}
