import { NextRequest, NextResponse } from 'next/server';
import { authorize } from '@/lib/auth/authorize';
import { createClient } from '@/lib/supabase/server';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { user, error: authError } = await authorize(request);
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Only staff, supervisor, and admin can activate patients
    if (!['staff', 'supervisor', 'admin'].includes(user.role)) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
    }
    
    const supabase = await createClient();
    const patientId = params.id;
    
    // Check if patient exists
    const { data: patient, error: patientError } = await supabase
      .from('patients')
      .select('*')
      .eq('id', patientId)
      .single();
      
    if (patientError || !patient) {
      return NextResponse.json({ error: 'Patient not found' }, { status: 404 });
    }
    
    // Check if patient is already active
    if (patient.isActive) {
      return NextResponse.json({ error: 'Patient is already active' }, { status: 400 });
    }
    
    // Activate patient
    const { data: updatedPatient, error: updateError } = await supabase
      .from('patients')
      .update({
        isActive: true,
        activatedAt: new Date().toISOString(),
        activatedBy: user.id,
      })
      .eq('id', patientId)
      .select()
      .single();
      
    if (updateError) {
      return NextResponse.json({ error: 'Failed to activate patient' }, { status: 500 });
    }
    
    // Create audit log
    await supabase.from('audit_logs').insert({
      action: 'patient_activated',
      entityType: 'patient',
      entityId: patientId,
      userId: user.id,
      metadata: {
        patientEmail: patient.email,
        activatedBy: user.id,
      },
    });
    
    return NextResponse.json({
      success: true,
      data: updatedPatient,
      message: 'Patient activated successfully'
    });
  } catch (error) {
    console.error('Error activating patient:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}