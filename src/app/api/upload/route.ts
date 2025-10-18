import { NextRequest, NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";
import { authorize } from "@/lib/auth/authorize";

export async function POST(request: NextRequest) {
  try {
    const { user, error: authError } = await authorize(request);

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const formData = await request.formData();
    const file = formData.get("file") as File;
    const type = formData.get("type") as string; // 'medical_record', 'insurance_claim', 'profile'
    const patientId = formData.get("patientId") as string;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });

    if (
      !type ||
      !["medical_record", "insurance_claim", "profile"].includes(type)
    ) {
      return NextResponse.json({ error: "Invalid file type" }, { status: 400 });

    // Validate file size (10MB max)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: "File too large. Maximum size is 10MB" },
        { status: 400 },
      );

    // Validate file type
    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/gif",
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "text/plain",
    ];

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
          error:
            "Invalid file type. Allowed types: JPG, PNG, GIF, PDF, DOC, DOCX, TXT",
        },
        { status: 400 },
      );

    const supabase = await createClient();

    // Generate unique filename
    const timestamp = Date.now();
    const fileExtension = file.name.split(".").pop();
    const fileName = `${type}_${timestamp}_${user.id}.${fileExtension}`;
    const filePath = `uploads/${type}/${fileName}`;

    // Convert file to buffer
    const fileBuffer = await file.arrayBuffer();

    // Upload to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("medical-documents")
      .upload(filePath, fileBuffer, {
        contentType: file.type,
        upsert: false,
      });

    if (uploadError) {
      return NextResponse.json(
        { error: "Failed to upload file" },
        { status: 500 },
      );

    // Get public URL
    const { data: urlData } = supabase.storage
      .from("medical-documents")
      .getPublicUrl(filePath);

    // Save file metadata to database
    const { data: fileRecord, error: dbError } = await supabase
      .from("file_uploads")
      .insert({
        user_id: user.id,
        patient_id: patientId || null,
        file_name: file.name,
        file_path: filePath,
        file_url: urlData.publicUrl,
        file_type: file.type,
        file_size: file.size,
        upload_type: type,
        uploaded_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (dbError) {
      // Clean up uploaded file if database insert fails
      await supabase.storage.from("medical-documents").remove([filePath]);

      return NextResponse.json(
        { error: "Failed to save file metadata" },
        { status: 500 },
      );

    // Log file upload
    await supabase.from("audit_logs").insert({
      action: "file_uploaded",
      user_id: user.id,
      resource_type: "file_upload",
      resource_id: fileRecord.id,
      metadata: {
        file_name: file.name,
        file_type: file.type,
        file_size: file.size,
        upload_type: type,
        patient_id: patientId,
      },
    });

    return NextResponse.json({
      success: true,
      file: {
        id: fileRecord.id,
        fileName: file.name,
        fileUrl: urlData.publicUrl,
        fileType: file.type,
        fileSize: file.size,
        uploadedAt: fileRecord.uploaded_at,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );

export async function GET(request: NextRequest) {
  try {
    const { user, error: authError } = await authorize(request);

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const patientId = searchParams.get("patientId");
    const type = searchParams.get("type");

    const supabase = await createClient();

    let query = supabase
      .from("file_uploads")
      .select(
        `
        id,
        file_name,
        file_url,
        file_type,
        file_size,
        upload_type,
        uploaded_at,
        patients!inner(id, full_name, user_id)
      `,
      )
      .order("uploaded_at", { ascending: false });

    // Apply filters
    if (patientId) query = query.eq("patient_id", patientId);
    if (type) query = query.eq("upload_type", type);

    // Role-based access control
    if (user.role === "patient") {
      query = query.eq("patients.user_id", user.id);

    const { data: files, error: filesError } = await query;

    if (filesError) {
      return NextResponse.json(
        { error: "Failed to fetch files" },
        { status: 500 },
      );

    return NextResponse.json({ files: files || [] });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}}}}}}}}}}}
