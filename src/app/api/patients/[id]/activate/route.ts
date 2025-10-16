import { _NextRequest, NextResponse } from "next/server";

import { _authorize } from "@/lib/auth/authorize";
import { _createClient } from "@/lib/supabase/server";

export async function __POST(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const { user, error: authError } = await authorize(request);

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Only staff, supervisor, and admin can activate patients
    if (!["staff", "supervisor", "admin"].includes(user.role)) {
      return NextResponse.json(
        { error: "Insufficient permissions" },
        { status: 403 },
      );
    }

    const __supabase = createClient();
    const __patientId = params.id;

    // Check if patient exists
    const { data: patient, error: patientError } = await supabase
      .from("patients")
      .select("*")
      .eq("id", patientId)
      .single();

    if (patientError || !patient) {
      return NextResponse.json({ error: "Patient not found" }, { status: 404 });
    }

    // Check if patient is already activated
    if (patient.activated) {
      return NextResponse.json(
        { error: "Patient already activated" },
        { status: 400 },
      );
    }

    // Activate patient
    const { error: updateError } = await supabase
      .from("patients")
      .update({
        activated: true,
        updated_at: new Date().toISOString(),
      })
      .eq("id", patientId);

    if (updateError) {
      return NextResponse.json(
        { error: "Failed to activate patient" },
        { status: 500 },
      );
    }

    // Log activation event
    await supabase.from("audit_logs").insert({
      action: "patient_activated",
      user_id: user.id,
      resource_type: "patient",
      resource_id: patientId,
      metadata: {
        patient_name: patient.full_name,
        activated_by: user.email,
      },
    });

    return NextResponse.json({
      message: "Patient activated successfully",
      activated: true,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function __GET(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const { user, error: authError } = await authorize(request);

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const __supabase = createClient();
    const __patientId = params.id;

    // Get patient activation status
    const { data: patient, error: patientError } = await supabase
      .from("patients")
      .select("id, activated, created_at, updated_at")
      .eq("id", patientId)
      .single();

    if (patientError || !patient) {
      return NextResponse.json({ error: "Patient not found" }, { status: 404 });
    }

    return NextResponse.json({
      patient_id: patient.id,
      activated: patient.activated,
      created_at: patient.created_at,
      updated_at: patient.updated_at,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
