import { NextRequest, NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";
import { authorize } from "@/lib/auth/authorize";
import { validateData, medicalRecordSchema } from "@/lib/validation/schemas";

export async function GET(request: NextRequest) {
  try {
    const { user, error: authError } = await authorize(request);

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const patientId = searchParams.get("patientId");
    const recordType = searchParams.get("type");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");

    const supabase = await createClient();

    let query = supabase
      .from("medical_records")
      .select(
        `
        id,
        patient_id,
        record_type,
        title,
        content,
        attachments,
        created_by,
        created_at,
        updated_at,
        patients!inner(id, full_name, user_id),
        doctors!inner(id, speciality, user_id)
      `,
      )
      .order("created_at", { ascending: false });

    // Apply filters
    if (patientId) query = query.eq("patient_id", patientId);
    if (recordType) query = query.eq("record_type", recordType);

    // Role-based access control
    if (user.role === "patient") {
      query = query.eq("patients.user_id", user.id);
    } else if (user.role === "doctor") {
      query = query.eq("doctors.user_id", user.id);

    // Pagination
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    query = query.range(from, to);

    const { data: records, error: recordsError, count } = await query;

    if (recordsError) {
      return NextResponse.json(
        { error: "Failed to fetch medical records" },
        { status: 500 },
      );

    return NextResponse.json({
      records: records || [],
      pagination: {
        page,
        limit,
        total: count || 0,
        pages: Math.ceil((count || 0) / limit),
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );

export async function POST(request: NextRequest) {
  try {
    const { user, error: authError } = await authorize(request);

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // Only doctors, staff, supervisor, and admin can create medical records
    if (!["doctor", "staff", "supervisor", "admin"].includes(user.role)) {
      return NextResponse.json(
        { error: "Insufficient permissions" },
        { status: 403 },
      );

    const body = await request.json();
    const validation = validateData(medicalRecordSchema, body);

    if (!validation.success) {
      return NextResponse.json(
          error: "Validation failed",
          details: validation.errors,
        },
        { status: 400 },
      );

    const {
      patientId,
      recordType,
      title,
      content,
      attachments = [],
    } = validation.data;

    const supabase = await createClient();

    // Check if patient exists and user has permission
    const { data: patient, error: patientError } = await supabase
      .from("patients")
      .select("id, full_name, user_id")
      .eq("id", patientId)
      .single();

    if (patientError || !patient) {
      return NextResponse.json({ error: "Patient not found" }, { status: 404 });

    // Check permissions
    if (user.role === "doctor") {
      // Check if doctor is assigned to this patient
      const { data: appointment, error: appointmentError } = await supabase
        .from("appointments")
        .select("id")
        .eq("patient_id", patientId)
        .eq("doctor_id", user.id)
        .limit(1);

      if (appointmentError || !appointment || appointment.length === 0) {
        return NextResponse.json(
          { error: "Doctor not assigned to this patient" },
          { status: 403 },
        );

    // Create medical record
    const { data: record, error: recordError } = await supabase
      .from("medical_records")
      .insert({
        patient_id: patientId,
        record_type: recordType,
        title,
        content,
        attachments,
        created_by: user.id,
      })
      .select(
        `
        id,
        patient_id,
        record_type,
        title,
        content,
        attachments,
        created_at,
        patients!inner(full_name)
      `,
      )
      .single();

    if (recordError) {
      return NextResponse.json(
        { error: "Failed to create medical record" },
        { status: 500 },
      );

    // Log record creation
    await supabase.from("audit_logs").insert({
      action: "medical_record_created",
      user_id: user.id,
      resource_type: "medical_record",
      resource_id: record.id,
      metadata: {
        patient_id: patientId,
        record_type: recordType,
        patient_name: patient.full_name,
      },
    });

    return NextResponse.json({
      success: true,
      record: {
        id: record.id,
        patientName: record.patients.full_name,
        recordType: record.record_type,
        title: record.title,
        createdAt: record.created_at,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}}}}}}}}}}
