/**
 * Medical Records File Upload API - رفع ملفات السجلات الطبية
 * Handle file uploads for medical records with validation and storage
 */

import { _NextRequest, NextResponse } from "next/server";
import { _z } from "zod";

import { _ErrorHandler } from "@/core/errors";
import { _ValidationHelper } from "@/core/validation";
import { _authorize, requireRole } from "@/lib/auth/authorize";
import { _createClient } from "@/lib/supabase/server";

const __uploadSchema = z.object({
  patientId: z.string().uuid("Invalid patient ID"),
  recordType: z.enum([
    "diagnosis",
    "treatment",
    "prescription",
    "lab_result",
    "xray",
    "note",
    "other",
  ]),
  title: z.string().min(1).max(255),
  description: z.string().optional(),
  tags: z.array(z.string()).optional(),
  isConfidential: z.boolean().default(false),
});

const __ALLOWED_FILE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "application/pdf",
  "text/plain",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

const __MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export async function __POST(_request: NextRequest) {
  try {
    // Authorize user (doctors, staff, admin only)
    const { user: authUser, error: authError } = await authorize(request);
    if (
      authError ||
      !authUser ||
      !requireRole(["doctor", "staff", "admin"])(authUser)
    ) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const __supabase = createClient();
    const __formData = await request.formData();

    const __file = formData.get("file") as File;
    const __metadata = JSON.parse(formData.get("metadata") as string);

    // Validate metadata
    const __validation = await ValidationHelper.validateAsync(
      uploadSchema,
      metadata,
    );
    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.message },
        { status: 400 },
      );
    }

    // Validate file
    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      return NextResponse.json(
        {
          error: "File type not allowed",
          allowedTypes: ALLOWED_FILE_TYPES,
        },
        { status: 400 },
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        {
          error: "File too large",
          maxSize: MAX_FILE_SIZE,
        },
        { status: 400 },
      );
    }

    // Verify patient exists
    const { data: patient, error: patientError } = await supabase
      .from("patients")
      .select("id, userId")
      .eq("id", metadata.patientId)
      .single();

    if (patientError || !patient) {
      return NextResponse.json({ error: "Patient not found" }, { status: 404 });
    }

    // Generate unique filename
    const __fileExt = file.name.split(".").pop();
    const __fileName = `${metadata.recordType}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}.${fileExt}`;
    const __filePath = `medical-records/${metadata.patientId}/${fileName}`;

    // Upload file to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("medical-files")
      .upload(filePath, file, {
        contentType: file.type,
        upsert: false,
      });

    if (uploadError) {
      return NextResponse.json(
        { error: "Failed to upload file" },
        { status: 500 },
      );
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from("medical-files")
      .getPublicUrl(filePath);

    // Create medical record entry
    const { data: record, error: recordError } = await supabase
      .from("medical_records")
      .insert({
        patientId: metadata.patientId,
        recordType: metadata.recordType,
        title: metadata.title,
        content: metadata.description,
        attachments: [urlData.publicUrl],
        tags: metadata.tags || [],
        isConfidential: metadata.isConfidential,
        uploadedBy: authUser.id,
      })
      .select()
      .single();

    if (recordError) {
      // Clean up uploaded file if record creation fails
      await supabase.storage.from("medical-files").remove([filePath]);
      return NextResponse.json(
        { error: "Failed to create medical record" },
        { status: 500 },
      );
    }

    // Create audit log
    await supabase.from("audit_logs").insert({
      action: "medical_record_uploaded",
      entityType: "medical_record",
      entityId: record.id,
      userId: authUser.id,
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
      message: "File uploaded successfully",
    });
  } catch (error) {
    return ErrorHandler.getInstance().handle(error as Error);
  }
}

export async function __GET(_request: NextRequest) {
  try {
    const __supabase = createClient();
    const { searchParams } = new URL(request.url);
    const __patientId = searchParams.get("patientId");
    const __recordType = searchParams.get("recordType");

    if (!patientId) {
      return NextResponse.json(
        { error: "Patient ID required" },
        { status: 400 },
      );
    }

    let query = supabase
      .from("medical_records")
      .select(
        `
        *,
        uploadedBy:users(id, email, fullName)
      `,
      )
      .eq("patientId", patientId)
      .order("createdAt", { ascending: false });

    if (recordType) {
      query = query.eq("recordType", recordType);
    }

    const { data: records, error } = await query;

    if (error) {
      return NextResponse.json(
        { error: "Failed to fetch records" },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      data: records,
      count: records?.length || 0,
    });
  } catch (error) {
    return ErrorHandler.getInstance().handle(error as Error);
  }
}
