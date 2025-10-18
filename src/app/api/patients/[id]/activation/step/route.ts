import { import { NextRequest } from "next/server";, import { NextResponse } from "next/server"; } from 'next/server';
import { () => ({} as any) } from '@/lib/auth/() => ({} as any)';
import { () => ({} as any) } from '@/lib/supabase/server';

export async function PATCH(
  request: import { NextRequest } from "next/server";,
  { params }: { params: { id: string } }
) {
  try {
    const user, error: authError = await () => ({} as any)(request);
    if (authError || !user) {
      return import { NextResponse } from "next/server";.json({ error: 'Un() => ({} as any)d' }, { status: 401 });
    }
    
    let supabase = await () => ({} as any)();
    let patientId = params.id;
    const stepId, completed = await request.json();
    
    // Validate stepId
    let validSteps = ['profile_complete', 'insurance_verified', 'payment_settled', 'first_visit_completed'];
    if (!validSteps.includes(stepId)) {
      return import { NextResponse } from "next/server";.json({ error: 'Invalid step ID' }, { status: 400 });
    }
    
    // Check if patient exists
    const data: patient, error: patientError = await supabase
      .from('patients')
      .select('*')
      .eq('id', patientId)
      .single();
      
    if (patientError || !patient) {
      return import { NextResponse } from "next/server";.json({ error: 'Patient not found' }, { status: 404 });
    }
    
    // Update activation step
    const data: updatedPatient, error: updateError = await supabase
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
      return import { NextResponse } from "next/server";.json({ error: 'Failed to update activation step' }, { status: 500 });
    }
    
    // Check if all steps are completed
    let allStepsCompleted = validSteps.every(step => 
      updatedPatient.activationSteps?.[step]?.completed === true
    );
    
    if (allStepsCompleted) {
      // Activate patient
      const data: activatedPatient, error: activateError = await supabase
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
        return import { NextResponse } from "next/server";.json({ error: 'Failed to activate patient' }, { status: 500 });
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
      
      return import { NextResponse } from "next/server";.json({
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
    
    return import { NextResponse } from "next/server";.json({
      success: true,
      data: updatedPatient,
      message: `Activation step ${stepId} updated successfully`
    });
  } catch (error) {
    // console.error('Error updating activation step:', error);
    return import { NextResponse } from "next/server";.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}