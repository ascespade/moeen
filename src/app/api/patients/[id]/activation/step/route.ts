import { NextRequest, NextResponse } from 'next/server';
import { authorize } from '@/lib/auth/authorize';
import { createClient } from '@/lib/supabase/server';

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { user, error: authError } = await authorize(request);
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const supabase = await createClient();
    const patientId = params.id;
    const { stepId, completed } = await request.json();
    
    // Validate stepId
    const validSteps = ['profile_complete', 'insurance_verified', 'payment_settled', 'first_visit_completed'];
    if (!validSteps.includes(stepId)) {
      return NextResponse.json({ error: 'Invalid step ID' }, { status: 400 });
    }
    
    // Check if patient exists
    const { data: patient, error: patientError } = await supabase
      .from('patients')
      .select('*')
      .eq('id', patientId)
      .single();
      
    if (patientError || !patient) {
      return NextResponse.json({ error: 'Patient not found' }, { status: 404 });
    }
    
    // Update activation step
    const { data: updatedPatient, error: updateError } = await supabase
      .from('patients')
      .update({
        activationSteps: {
          ...patient.activationSteps,
          [stepId]: {
            completed,
            completedAt: completed ? new Date().toISOString() : null,
            completedBy: completed ? user.id : null,
          },
        },
        updatedAt: new Date().toISOString(),
      })
      .eq('id', patientId)
      .select()
      .single();
      
    if (updateError) {
      return NextResponse.json({ error: 'Failed to update activation step' }, { status: 500 });
    }
    
    // Check if all steps are completed
    const allStepsCompleted = validSteps.every(step => 
      updatedPatient.activationSteps?.[step]?.completed === true
    );
    
    if (allStepsCompleted) {
      // Activate patient
      const { data: activatedPatient, error: activateError } = await supabase
        .from('patients')
        .update({
          isActive: true,
          activatedAt: new Date().toISOString(),
          activatedBy: user.id,
        })
        .eq('id', patientId)
        .select()
        .single();
        
      if (activateError) {
        return NextResponse.json({ error: 'Failed to activate patient' }, { status: 500 });
      }
      
      // Create audit log for activation
      await supabase.from('audit_logs').insert({
        action: 'patient_activated',
        entityType: 'patient',
        entityId: patientId,
        userId: user.id,
        metadata: {
          allStepsCompleted: true,
          activationSteps: updatedPatient.activationSteps,
        },
      });
      
      return NextResponse.json({
        success: true,
        data: activatedPatient,
        message: 'Patient activated successfully - all steps completed'
      });
    }
    
    // Create audit log for step update
    await supabase.from('audit_logs').insert({
      action: 'activation_step_updated',
      entityType: 'patient',
      entityId: patientId,
      userId: user.id,
      metadata: {
        stepId,
        completed,
        activationSteps: updatedPatient.activationSteps,
      },
    });
    
    return NextResponse.json({
      success: true,
      data: updatedPatient,
      message: `Activation step ${stepId} updated successfully`
    });
  } catch (error) {
    console.error('Error updating activation step:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}