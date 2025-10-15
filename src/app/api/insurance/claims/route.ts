import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { authorize } from '@/lib/auth/authorize';
import { insuranceService } from '@/lib/insurance/providers';

export async function GET(request: NextRequest) {
  try {
    const { user, error: authError } = await authorize(request);
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const patientId = searchParams.get('patientId');
    const status = searchParams.get('status');

    const supabase = createClient();

    let query = supabase
      .from('insurance_claims')
      .select(`
        id,
        public_id,
        patient_id,
        appointment_id,
        provider,
        claim_status,
        amount,
        created_at,
        patients!inner(id, full_name)
      `)
      .order('created_at', { ascending: false });

    // Filter by patient if specified
    if (patientId) {
      query = query.eq('patient_id', patientId);
    }

    // Filter by status if specified
    if (status) {
      query = query.eq('claim_status', status);
    }

    // Role-based filtering
    if (user.role === 'patient') {
      query = query.eq('patients.user_id', user.id);
    }

    const { data: claims, error: claimsError } = await query;

    if (claimsError) {
      return NextResponse.json({ error: 'Failed to fetch claims' }, { status: 500 });
    }

    const formattedClaims = claims?.map(claim => ({
      id: claim.id,
      patientName: claim.patients.full_name,
      provider: claim.provider,
      amount: claim.amount,
      status: claim.claim_status,
      createdAt: claim.created_at,
      appointmentId: claim.appointment_id
    })) || [];

    return NextResponse.json({ claims: formattedClaims });

  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { user, error: authError } = await authorize(request);
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Only staff, supervisor, and admin can create claims
    if (!['staff', 'supervisor', 'admin'].includes(user.role)) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
    }

    const { 
      patientId, 
      appointmentId, 
      provider, 
      amount, 
      description, 
      diagnosis, 
      treatment 
    } = await request.json();

    if (!patientId || !provider || !amount) {
      return NextResponse.json({ 
        error: 'Missing required fields: patientId, provider, amount' 
      }, { status: 400 });
    }

    const supabase = createClient();

    // Get patient details
    const { data: patient, error: patientError } = await supabase
      .from('patients')
      .select('id, full_name, insurance_provider, insurance_number')
      .eq('id', patientId)
      .single();

    if (patientError || !patient) {
      return NextResponse.json({ error: 'Patient not found' }, { status: 404 });
    }

    // Verify insurance member if provider matches patient's insurance
    if (patient.insurance_provider === provider && patient.insurance_number) {
      const verification = await insuranceService.verifyMember(
        provider,
        patient.insurance_number,
        '' // Date of birth would be needed here
      );

      if (!verification.success) {
        return NextResponse.json({ 
          error: `Insurance verification failed: ${verification.error}` 
        }, { status: 400 });
      }
    }

    // Create claim in database
    const { data: claim, error: claimError } = await supabase
      .from('insurance_claims')
      .insert({
        patient_id: patientId,
        appointment_id: appointmentId,
        provider,
        claim_status: 'draft',
        amount: parseFloat(amount),
        claim_payload: {
          description,
          diagnosis,
          treatment,
          created_by: user.id,
          created_at: new Date().toISOString()
        }
      })
      .select()
      .single();

    if (claimError) {
      return NextResponse.json({ error: 'Failed to create claim' }, { status: 500 });
    }

    // Log claim creation
    await supabase
      .from('audit_logs')
      .insert({
        action: 'claim_created',
        user_id: user.id,
        resource_type: 'insurance_claim',
        resource_id: claim.id,
        metadata: {
          patient_id: patientId,
          provider,
          amount,
          patient_name: patient.full_name
        }
      });

    return NextResponse.json({
      success: true,
      claim: {
        id: claim.id,
        patientName: patient.full_name,
        provider: claim.provider,
        amount: claim.amount,
        status: claim.claim_status,
        createdAt: claim.created_at
      }
    });

  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}