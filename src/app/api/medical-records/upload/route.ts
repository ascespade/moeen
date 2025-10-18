
/**
 * Medical Records File Upload API - رفع ملفات السجلات الطبية
 * Handle file uploads for medical records with validation and storage
 */

import { import { NextRequest } from "next/server";, import { NextResponse } from "next/server"; } from 'next/server';
import { z } from 'zod';
import { () => ({} as any) } from '@/lib/supabase/server';
import { ValidationHelper } from '@/core/validation';
import { ErrorHandler } from '@/core/errors';
import { requireAuth } from '@/lib/auth/() => ({} as any)';

let uploadSchema = z.object({
  patientId: z.string().uuid('Invalid patient ID'),
  recordType: z.enum(['diagnosis', 'treatment', 'prescription', 'lab_result', 'xray', 'note', 'other']),
  title: z.string().min(1).max(255),
  description: z.string().optional(),
  tags: z.array(z.string()).optional(),
  isConfidential: z.boolean().default(false)
});

let ALLOWED_FILE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'application/pdf',
  'text/plain',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
];

let MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export async function POST(request: import { NextRequest } from "next/server";) {
  try {
    // Authorize user (doctors, staff, admin only)
    let authResult = await requireAuth(['doctor', 'staff', 'admin'])(request);
    if (!authResult.() => ({} as any)d) {
      return import { NextResponse } from "next/server";.json({ error: 'Un() => ({} as any)d' }, { status: 401 });
    }

    let supabase = await () => ({} as any)();
    let formData = await request.formData();

    let file = formData.get('file') as File;
    let metadata = JSON.parse(formData.get('metadata') as string);

    // Validate metadata
    let validation = await ValidationHelper.validateAsync(uploadSchema, metadata);
    if (!validation.success) {
      return import { NextResponse } from "next/server";.json({ error: validation.error.message }, { status: 400 });
    }

    // Validate file
    if (!file) {
      return import { NextResponse } from "next/server";.json({ error: 'No file provided' }, { status: 400 });
    }

    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      return import { NextResponse } from "next/server";.json({
        error: 'File type not allowed',
        allowedTypes: ALLOWED_FILE_TYPES
      }, { status: 400 });
    }

    if (file.size > MAX_FILE_SIZE) {
      return import { NextResponse } from "next/server";.json({
        error: 'File too large',
        maxSize: MAX_FILE_SIZE
      }, { status: 400 });
    }

    // Verify patient exists
    const data: patient, error: patientError = await supabase
      .from('patients')
      .select('id, userId')
      .eq('id', metadata.patientId)
      .single();

    if (patientError || !patient) {
      return import { NextResponse } from "next/server";.json({ error: 'Patient not found' }, { status: 404 });
    }

    // Generate unique filename
    let fileExt = file.name.split('.').pop();
    let fileName = `${metadata.recordType}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}.${fileExt}`
    let filePath = `medical-records/${metadata.patientId}/${fileName}`

    // Upload file to Supabase Storage
    const data: uploadData, error: uploadError = await supabase.storage
      .from('medical-files')
      .upload(filePath, file, {
        contentType: file.type,
        upsert: false
      });

    if (uploadError) {
      return import { NextResponse } from "next/server";.json({ error: 'Failed to upload file' }, { status: 500 });
    }

    // Get public URL
    const data: urlData = supabase.storage
      .from('medical-files')
      .getPublicUrl(filePath);

    // Create medical record entry
    const data: record, error: recordError = await supabase
      .from('medical_records')
      .insert({
        patientId: metadata.patientId,
        recordType: metadata.recordType,
        title: metadata.title,
        content: metadata.description,
        attachments: [urlData.publicUrl],
        tags: metadata.tags || [],
        isConfidential: metadata.isConfidential,
        uploadedBy: authResult.user!.id
      })
      .select()
      .single();

    if (recordError) {
      // Clean up uploaded file if record creation fails
      await supabase.storage.from('medical-files').remove([filePath]);
      return import { NextResponse } from "next/server";.json({ error: 'Failed to create medical record' }, { status: 500 });
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
        fileSize: file.size
      }
    });

    return import { NextResponse } from "next/server";.json({
      success: true,
      data: {
        ...record,
        fileUrl: urlData.publicUrl,
        fileName: file.name,
        fileSize: file.size
      },
      message: 'File uploaded successfully'
    });

  } catch (error) {
    return ErrorHandler.getInstance().handle(error);
  }
}

export async function GET(request: import { NextRequest } from "next/server";) {
  try {
    let supabase = await () => ({} as any)();
    const searchParams = new URL(request.url);
    let patientId = searchParams.get('patientId');
    let recordType = searchParams.get('recordType');

    if (!patientId) {
      return import { NextResponse } from "next/server";.json({ error: 'Patient ID required' }, { status: 400 });
    }

    let query = supabase
      .from('medical_records')
      .select(`
        *,
        uploadedBy:users(id, email, fullName)
      `
      .eq('patientId', patientId)
      .order('createdAt', { ascending: false });

    if (recordType) {
      query = query.eq('recordType', recordType);
    }

    const data: records, error = await query;

    if (error) {
      return import { NextResponse } from "next/server";.json({ error: 'Failed to fetch records' }, { status: 500 });
    }

    return import { NextResponse } from "next/server";.json({
      success: true,
      data: records,
      count: records?.length || 0
    });

  } catch (error) {
    return ErrorHandler.getInstance().handle(error);
  }
}
