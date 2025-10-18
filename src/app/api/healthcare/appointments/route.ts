import { NextRequest, NextResponse } from "next/server";

import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

// GET /api/healthcare/appointments - جلب المواعيد
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const doctor_id = searchParams.get("doctor_id");
    const patient_id = searchParams.get("patient_id");
    const date = searchParams.get("date");
    const status = searchParams.get("status");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");

    let query = supabase
      .from("appointments")
      .select(
        `
        *,
        patients (
          id,
          first_name,
          last_name,
          phone
        ),
        doctors (
          id,
          first_name,
          last_name,
          specialization
        )
      `,
      )
      .order("appointment_date", { ascending: true });

    if (doctor_id) {
      query = query.eq("doctor_id", doctor_id);

    if (patient_id) {
      query = query.eq("patient_id", patient_id);

    if (date) {
      query = query.eq("appointment_date", date);

    if (status) {
      query = query.eq("status", status);

    // تطبيق الصفحات
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    query = query.range(from, to);

    const { data: appointments, error, count } = await query;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json({
      appointments,
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
  }

// POST /api/healthcare/appointments - إنشاء موعد جديد
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      patient_id,
      doctor_id,
      appointment_date,
      appointment_time,
      duration = 60,
      type,
      notes,
      insurance_covered = false,
      insurance_company,
      insurance_number,
    } = body;

    const { data: appointment, error } = await supabase
      .from("appointments")
      .insert({
        patient_id,
        doctor_id,
        appointment_date,
        appointment_time,
        duration,
        type,
        notes,
        status: "scheduled",
        insurance_covered,
        insurance_company,
        insurance_number,
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json({ appointment }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
