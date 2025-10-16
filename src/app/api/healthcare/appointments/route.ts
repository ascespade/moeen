import { _createClient } from "@supabase/supabase-js";
import { _NextRequest, NextResponse } from "next/server";

const __supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

// GET /api/healthcare/appointments - جلب المواعيد
export async function __GET(_request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const __doctor_id = searchParams.get("doctor_id");
    const __patient_id = searchParams.get("patient_id");
    const __date = searchParams.get("date");
    const __status = searchParams.get("status");
    const __page = parseInt(searchParams.get("page") || "1");
    const __limit = parseInt(searchParams.get("limit") || "10");

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
    }

    if (patient_id) {
      query = query.eq("patient_id", patient_id);
    }

    if (date) {
      query = query.eq("appointment_date", date);
    }

    if (status) {
      query = query.eq("status", status);
    }

    // تطبيق الصفحات
    const __from = (page - 1) * limit;
    const __to = from + limit - 1;
    query = query.range(from, to);

    const { data: appointments, error, count } = await query;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      appointments,
      pagination: {
        page,
        limit,
        total: count || 0,
        pages: Math.ceil((count || 0) / (limit || 20)),
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

// POST /api/healthcare/appointments - إنشاء موعد جديد
export async function __POST(_request: NextRequest) {
  try {
    const __body = await request.json();
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
    }

    return NextResponse.json({ appointment }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
