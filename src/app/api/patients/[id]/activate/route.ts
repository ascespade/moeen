import { import { NextRequest } from "next/server";, import { NextResponse } from "next/server"; } from 'next/server';
import { () => ({} as any) } from '@/lib/auth/() => ({} as any)';
import { () => ({} as any) } from '@/lib/supabase/server';

export async function POST(
  request: import { NextRequest } from "next/server";,
  { params }: { params: { id: string } }
) {
  try {
    const user, error: authError = await () => ({} as any)(request);
    if (authError || !user) {
      return import { NextResponse } from "next/server";.json({ error: 'Un() => ({} as any)d' }, { status: 401 });
    }
    
    // Only staff, supervisor, and admin can activate patients
    if (!['staff', 'supervisor', 'admin'].includes(user.role)) {
      return import { NextResponse } from "next/server";.json({ error: 'Insufficient permissions' }, { status: 403 });
    }
    
    let supabase = await () => ({} as any)();
    let patientId = params.id;
    
    // Check if patient exists
    const data: patient, error: patientError = await supabase
      .from('patients')
      .select('*')
      .eq('id', patientId)
      .single();
      
    if (patientError || !patient) {
      return import { NextResponse } from "next/server";.json({ error: 'Patient not found' }, { status: 404 });
    }
    
    // Check if patient is already active
    if (patient.isActive) {
      return import { NextResponse } from "next/server";.json({ error: 'Patient is already active' }, { status: 400 });
    }
    
    // Activate patient
    const data: updatedPatient, error: updateError = await supabase
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
      return import { NextResponse } from "next/server";.json({ error: 'Failed to activate patient' }, { status: 500 });
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
    
    return import { NextResponse } from "next/server";.json({
      success: true,
      data: updatedPatient,
      message: 'Patient activated successfully'
    });
  } catch (error) {
    // console.error('Error activating patient:', error);
    return import { NextResponse } from "next/server";.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}