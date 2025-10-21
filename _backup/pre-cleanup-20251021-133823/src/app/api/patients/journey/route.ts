/**
 * Patient Journey Workflow API - رحلة المريض
 * Complete patient journey workflow with activation, pre-visit checklist, and file management
 */

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';
import { ValidationHelper } from '@/core/validation';
import { ErrorHandler } from '@/core/errors';
import { requireAuth } from '@/lib/auth/authorize';

const activationSchema = z.object({
  patientId: z.string().uuid('Invalid patient ID'),
  activationReason: z.string().min(1, 'Activation reason required'),
  notes: z.string().optional(),
});

const checklistSchema = z.object({
  patientId: z.string().uuid('Invalid patient ID'),
  appointmentId: z.string().uuid('Invalid appointment ID'),
  checklistItems: z.array(
    z.object({
      id: z.string(),
      title: z.string(),
      completed: z.boolean(),
      notes: z.string().optional(),
    })
  ),
});

const fileAccessSchema = z.object({
  patientId: z.string().uuid('Invalid patient ID'),
  fileType: z.enum([
    'medical_records',
    'lab_results',
    'prescriptions',
    'insurance_documents',
  ]),
  accessReason: z.string().min(1, 'Access reason required'),
});

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const body = await request.json();
    const { action } = body;

    switch (action) {
      case 'activate':
        return await activatePatient(request, body);
      case 'checklist':
        return await updateChecklist(request, body);
      case 'file_access':
        return await requestFileAccess(request, body);
      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    return ErrorHandler.getInstance().handle(error);
  }
}

async function activatePatient(request: NextRequest, body: any) {
  try {
    // Authorize staff, supervisor, or admin
    const authResult = await requireAuth(['staff', 'supervisor', 'admin'])(
      request
    );
    if (!authResult.authorized) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabase = await createClient();
    const { patientId, activationReason, notes } = body;

    // Validate input
    const validation = await ValidationHelper.validateAsync(
      activationSchema,
      body
    );
    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.message },
        { status: 400 }
      );
    }

    // Verify patient exists and is not already activated
    const { data: patient, error: patientError } = await supabase
      .from('patients')
      .select('id, isActivated, fullName, email')
      .eq('id', patientId)
      .single();

    if (patientError || !patient) {
      return NextResponse.json({ error: 'Patient not found' }, { status: 404 });
    }

    if (patient.isActivated) {
      return NextResponse.json(
        { error: 'Patient already activated' },
        { status: 400 }
      );
    }

    // Activate patient
    const { data: updatedPatient, error: updateError } = await supabase
      .from('patients')
      .update({
        isActivated: true,
        activationDate: new Date().toISOString(),
        activationReason,
        activationNotes: notes,
        activatedBy: authResult.user!.id,
      })
      .eq('id', patientId)
      .select()
      .single();

    if (updateError) {
      return NextResponse.json(
        { error: 'Failed to activate patient' },
        { status: 500 }
      );
    }

    // Create patient file
    await createPatientFile(patientId, supabase);

    // Create audit log
    await supabase.from('audit_logs').insert({
      action: 'patient_activated',
      entityType: 'patient',
      entityId: patientId,
      userId: authResult.user!.id,
      metadata: {
        activationReason,
        notes,
      },
    });

    // Send activation notification
    await sendActivationNotification(patient, supabase);

    return NextResponse.json({
      success: true,
      data: updatedPatient,
      message: 'Patient activated successfully',
    });
  } catch (error) {
    return ErrorHandler.getInstance().handle(error);
  }
}

async function updateChecklist(request: NextRequest, body: any) {
  try {
    // Authorize patient, staff, or admin
    const authResult = await requireAuth(['patient', 'staff', 'admin'])(
      request
    );
    if (!authResult.authorized) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabase = await createClient();
    const { patientId, appointmentId, checklistItems } = body;

    // Validate input
    const validation = await ValidationHelper.validateAsync(
      checklistSchema,
      body
    );
    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.message },
        { status: 400 }
      );
    }

    // Verify appointment exists and belongs to patient
    const { data: appointment, error: appointmentError } = await supabase
      .from('appointments')
      .select('id, patientId, scheduledAt, status')
      .eq('id', appointmentId)
      .eq('patientId', patientId)
      .single();

    if (appointmentError || !appointment) {
      return NextResponse.json(
        { error: 'Appointment not found' },
        { status: 404 }
      );
    }

    // Update or create checklist
    const { data: checklist, error: checklistError } = await supabase
      .from('patient_checklists')
      .upsert({
        patientId,
        appointmentId,
        checklistItems,
        completedAt: checklistItems.every((item: any) => item.completed)
          ? new Date().toISOString()
          : null,
        updatedBy: authResult.user!.id,
      })
      .select()
      .single();

    if (checklistError) {
      return NextResponse.json(
        { error: 'Failed to update checklist' },
        { status: 500 }
      );
    }

    // Create audit log
    await supabase.from('audit_logs').insert({
      action: 'checklist_updated',
      entityType: 'patient_checklist',
      entityId: checklist.id,
      userId: authResult.user!.id,
      metadata: {
        patientId,
        appointmentId,
        completedItems: checklistItems.filter((item: any) => item.completed)
          .length,
        totalItems: checklistItems.length,
      },
    });

    return NextResponse.json({
      success: true,
      data: checklist,
      message: 'Checklist updated successfully',
    });
  } catch (error) {
    return ErrorHandler.getInstance().handle(error);
  }
}

async function requestFileAccess(request: NextRequest, body: any) {
  try {
    // Authorize patient, staff, or admin
    const authResult = await requireAuth(['patient', 'staff', 'admin'])(
      request
    );
    if (!authResult.authorized) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabase = await createClient();
    const { patientId, fileType, accessReason } = body;

    // Validate input
    const validation = await ValidationHelper.validateAsync(
      fileAccessSchema,
      body
    );
    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.message },
        { status: 400 }
      );
    }

    // Verify patient exists and is activated
    const { data: patient, error: patientError } = await supabase
      .from('patients')
      .select('id, isActivated, fullName')
      .eq('id', patientId)
      .single();

    if (patientError || !patient) {
      return NextResponse.json({ error: 'Patient not found' }, { status: 404 });
    }

    if (!patient.isActivated) {
      return NextResponse.json(
        { error: 'Patient not activated' },
        { status: 400 }
      );
    }

    // Get files based on type
    let files;
    switch (fileType) {
      case 'medical_records':
        const { data: medicalRecords } = await supabase
          .from('medical_records')
          .select('*')
          .eq('patientId', patientId)
          .order('createdAt', { ascending: false });
        files = medicalRecords;
        break;
      case 'lab_results':
        const { data: labResults } = await supabase
          .from('medical_records')
          .select('*')
          .eq('patientId', patientId)
          .eq('recordType', 'lab_result')
          .order('createdAt', { ascending: false });
        files = labResults;
        break;
      case 'prescriptions':
        const { data: prescriptions } = await supabase
          .from('medical_records')
          .select('*')
          .eq('patientId', patientId)
          .eq('recordType', 'prescription')
          .order('createdAt', { ascending: false });
        files = prescriptions;
        break;
      case 'insurance_documents':
        const { data: insuranceDocs } = await supabase
          .from('insurance_claims')
          .select('*')
          .eq('patientId', patientId)
          .order('createdAt', { ascending: false });
        files = insuranceDocs;
        break;
      default:
        return NextResponse.json(
          { error: 'Invalid file type' },
          { status: 400 }
        );
    }

    // Create audit log
    await supabase.from('audit_logs').insert({
      action: 'file_access_requested',
      entityType: 'patient_file',
      entityId: patientId,
      userId: authResult.user!.id,
      metadata: {
        fileType,
        accessReason,
        fileCount: files?.length || 0,
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        patientId,
        fileType,
        files: files || [],
        count: files?.length || 0,
      },
      message: 'File access granted',
    });
  } catch (error) {
    return ErrorHandler.getInstance().handle(error);
  }
}

async function createPatientFile(patientId: string, supabase: any) {
  // Create initial patient file structure
  const { error } = await supabase.from('patient_files').insert({
    patientId,
    fileType: 'main',
    title: 'Patient File',
    content: 'Initial patient file created upon activation',
    isActive: true,
  });

  if (error) {
    console.error('Failed to create patient file:', error);
  }
}

async function sendActivationNotification(patient: any, supabase: any) {
  // Send activation notification to patient
  await supabase.from('notifications').insert({
    type: 'patient_activated',
    recipientId: patient.id,
    recipientType: 'patient',
    title: 'حسابك مفعل الآن',
    message: 'تم تفعيل حسابك بنجاح. يمكنك الآن الوصول إلى ملفك الطبي.',
    channels: ['email', 'in_app'],
    priority: 'normal',
  });
}
