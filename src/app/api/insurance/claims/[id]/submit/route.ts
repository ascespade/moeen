import { NextRequest, NextResponse } from 'next/server';
import { authorize } from '@/lib/auth/authorize';
import { createClient } from '@/lib/supabase/server';
import { insuranceService } from '@/lib/insurance/providers';

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { user, error: authError } = await authorize(request);
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Only staff, supervisor, and admin can submit claims
    if (!['staff', 'supervisor', 'admin'].includes(user.role)) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
    }
    
    const supabase = await createClient();
    const claimId = params.id;
    
    // Get claim details
    const { data: claim, error: claimError } = await supabase
      .from('insurance_claims')
      .select('*')
      .eq('id', claimId)
      .single();
      
    if (claimError || !claim) {
      return NextResponse.json({ error: 'Claim not found' }, { status: 404 });
    }
    
    // Check if claim is already submitted
    if (claim.status === 'submitted' || claim.status === 'approved' || claim.status === 'rejected') {
      return NextResponse.json({ error: 'Claim already processed' }, { status: 400 });
    }
    
    // Submit claim to insurance provider
    const submissionResult = await insuranceService.submitClaim({
      claimId: claim.id,
      patientId: claim.patientId,
      providerId: claim.providerId,
      amount: claim.amount,
      description: claim.description,
      diagnosis: claim.diagnosis,
      treatment: claim.treatment,
      documents: claim.documents || [],
    });
    
    if (!submissionResult.success) {
      return NextResponse.json({ 
        error: 'Failed to submit claim to insurance provider',
        details: submissionResult.error 
      }, { status: 500 });
    }
    
    // Update claim status
    const { data: updatedClaim, error: updateError } = await supabase
      .from('insurance_claims')
      .update({
        status: 'submitted',
        submittedAt: new Date().toISOString(),
        submittedBy: user.id,
        externalClaimId: submissionResult.claimId,
        submissionData: submissionResult.data,
      })
      .eq('id', claimId)
      .select()
      .single();
      
    if (updateError) {
      return NextResponse.json({ error: 'Failed to update claim status' }, { status: 500 });
    }
    
    // Create audit log
    await supabase.from('audit_logs').insert({
      action: 'claim_submitted',
      entityType: 'insurance_claim',
      entityId: claimId,
      userId: user.id,
      metadata: {
        externalClaimId: submissionResult.claimId,
        providerId: claim.providerId,
        amount: claim.amount,
      },
    });
    
    return NextResponse.json({
      success: true,
      data: updatedClaim,
      message: 'Claim submitted successfully'
    });
  } catch (error) {
    console.error('Error submitting claim:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}