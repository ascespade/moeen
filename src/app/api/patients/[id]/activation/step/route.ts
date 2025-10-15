import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { authorize } from '@/lib/auth/authorize';

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { user, error: authError } = await authorize(request);
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabase = createClient();
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

    // Update activation step in patient meta
    const currentMeta = patient.meta || {};
    const updatedMeta = {
      ...currentMeta,
      activation_steps: {
        ...currentMeta.activation_steps,
        [stepId]: {
          completed,
          completed_at: completed ? new Date().toISOString() : null,
          completed_by: completed ? user.id : null
        }
      }
    };

    const { error: updateError } = await supabase
      .from('patients')
      .update({ 
        meta: updatedMeta,
        updated_at: new Date().toISOString()
      })
      .eq('id', patientId);

    if (updateError) {
      console.error('Error updating activation step:', updateError);
      return NextResponse.json({ error: 'Failed to update activation step' }, { status: 500 });
    }

    // Log step completion
    await supabase
      .from('audit_logs')
      .insert({
        action: 'activation_step_completed',
        user_id: user.id,
        resource_type: 'patient',
        resource_id: patientId,
        metadata: {
          step_id: stepId,
          completed,
          patient_name: patient.full_name
        }
      });

    return NextResponse.json({ 
      message: 'Activation step updated successfully',
      stepId,
      completed 
    });

  } catch (error) {
    console.error('Activation step update error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { user, error: authError } = await authorize(request);
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabase = createClient();
    const patientId = params.id;

    // Get patient activation steps
    const { data: patient, error: patientError } = await supabase
      .from('patients')
      .select('id, activated, meta')
      .eq('id', patientId)
      .single();

    if (patientError || !patient) {
      return NextResponse.json({ error: 'Patient not found' }, { status: 404 });
    }

    const activationSteps = patient.meta?.activation_steps || {};
    
    return NextResponse.json({
      patient_id: patient.id,
      activated: patient.activated,
      activation_steps: activationSteps
    });

  } catch (error) {
    console.error('Get activation steps error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}