/**
 * Medical Records File Upload API - رفع ملفات السجلات الطبية
 * Handle file uploads for medical records with validation and storage
 */

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';
import { ValidationHelper } from '@/core/validation';
import { ErrorHandler } from '@/core/errors';
import { requireAuth } from '@/lib/auth/authorize';

const uploadSchema = z.object({
  patientId: z.string().uuid('Invalid patient ID'),
  recordType: z.enum(['diagnosis', 'treatment', 'prescription', 'lab_result', 'xray', 'note', 'other']),
  title: z.string().min(1).max(255),
  description: z.string().optional(),
  tags: z.array(z.string()).optional(),
  isConfidential: z.boolean().default(false),
});

const ALLOWED_FILE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'application/pdf',
  'text/plain',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export async function POST(request: NextRequest) {
  try {
    // Authorize user (doctors, staff, admin only)
    const authResult = await requireAuth(['doctor', 'staff', 'admin'])(request);
    if (!authResult.authorized) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabase = await createClient();
    const formData = await request.formData();
    
    const file = formData.get('file') as File;
    const metadata = JSON.parse(formData.get('metadata') as string);

    // Validate metadata
    const validation = await ValidationHelper.validateAsync(uploadSchema, metadata);
    if (!validation.success) {
      return NextResponse.json({ error: validation.error.message }, { status: 400 });
    }

    // Validate file
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      return NextResponse.json({ 
        error: 'File type not allowed',
        allowedTypes: ALLOWED_FILE_TYPES 
      }, { status: 400 });
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ 
        error: 'File too large',
        maxSize: MAX_FILE_SIZE 
      }, { status: 400 });
    }

    // Verify patient exists
    const { data: patient, error: patientError } = await supabase
      .from('patients')
      .select('id, userId')
      .eq('id', metadata.patientId)
      .single();

    if (patientError || !patient) {
      return NextResponse.json({ error: 'Patient not found' }, { status: 404 });
    }

    // Generate unique filename
    const fileExt = file.name.split('.').pop();
    const fileName = `${metadata.recordType}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}.${fileExt}`;
    const filePath = `medical-records/${metadata.patientId}/${fileName}`;

    // Upload file to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('medical-files')
      .upload(filePath, file, {
        contentType: file.type,
        upsert: false,
      });

    if (uploadError) {
      return NextResponse.json({ error: 'Failed to upload file' }, { status: 500 });
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('medical-files')
      .getPublicUrl(filePath);

    // Create medical record entry
    const { data: record, error: recordError } = await supabase
      .from('medical_records')
      .insert({
        patientId: metadata.patientId,
        recordType: metadata.recordType,
        title: metadata.title,
        content: metadata.description,
        attachments: [urlData.publicUrl],
        tags: metadata.tags || [],
        isConfidential: metadata.isConfidential,
        uploadedBy: authResult.user!.id,
      })
      .select()
      .single();

    if (recordError) {
      // Clean up uploaded file if record creation fails
      await supabase.storage.from('medical-files').remove([filePath]);
      return NextResponse.json({ error: 'Failed to create medical record' }, { status: 500 });
    }

    // Create audit log
    await supabase.from('audit_logs').insert({
      action: 'medical_record_uploaded',
      entityType: 'medical_record',
      entityId: record.id,
      userId: authResult.user!.id,
      metadata: {
        patientId: metadata.patientId,
        recordType: metadata.recordType,
        fileName: file.name,
        fileSize: file.size,
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        ...record,
        fileUrl: urlData.publicUrl,
        fileName: file.name,
        fileSize: file.size,
      },
      message: 'File uploaded successfully'
    });

  } catch (error) {
    return ErrorHandler.getInstance().handle(error);
  }
}

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { searchParams } = new URL(request.url);
    const patientId = searchParams.get('patientId');
    const recordType = searchParams.get('recordType');

    if (!patientId) {
      return NextResponse.json({ error: 'Patient ID required' }, { status: 400 });
    }

    let query = supabase
      .from('medical_records')
      .select(`
        *,
        uploadedBy:users(id, email, fullName)
      `)
      .eq('patientId', patientId)
      .order('createdAt', { ascending: false });

    if (recordType) {
      query = query.eq('recordType', recordType);
    }

    const { data: records, error } = await query;

    if (error) {
      return NextResponse.json({ error: 'Failed to fetch records' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      data: records,
      count: records?.length || 0
    });

  } catch (error) {
    return ErrorHandler.getInstance().handle(error);
  }
}