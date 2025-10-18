import { NextRequest, NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";
import { authorize } from "@/lib/auth/authorize";
import { insuranceService } from "@/lib/insurance/providers";

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const { user, error: authError } = await authorize(request);

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Only staff, supervisor, and admin can submit claims
    if (!["staff", "supervisor", "admin"].includes(user.role)) {
      return NextResponse.json(
        { error: "Insufficient permissions" },
        { status: 403 },
      );
    }

    const supabase = await createClient();
    const claimId = params.id;

    // Get claim details
    const { data: claim, error: claimError } = await supabase
      .from("insurance_claims")
      .select(
        `
        id,
        patient_id,
        appointment_id,
        provider,
        claim_status,
        amount,
        claim_payload,
        patients!inner(id, full_name, insurance_number)
      `,
      )
      .eq("id", claimId)
      .single();

    if (claimError || !claim) {
      return NextResponse.json({ error: "Claim not found" }, { status: 404 });
    }

    if (claim.claim_status !== "draft") {
      return NextResponse.json(
        {
          error: "Only draft claims can be submitted",
        },
        { status: 400 },
      );
    }

    // Submit claim to insurance provider
    const submissionResult = await insuranceService.createClaim(
      claim.provider,
      {
        patientId: claim.patient_id,
        appointmentId: claim.appointment_id,
        provider: claim.provider,
        amount: claim.amount,
        description: claim.claim_payload?.description || "",
        diagnosis: claim.claim_payload?.diagnosis || "",
        treatment: claim.claim_payload?.treatment || "",
      },
    );

    if (!submissionResult.success) {
      return NextResponse.json(
        {
          error: `Insurance submission failed: ${submissionResult.error}`,
        },
        { status: 400 },
      );
    }

    // Update claim status in database
    const { error: updateError } = await supabase
      .from("insurance_claims")
      .update({
        claim_status: "submitted",
        claim_payload: {
          ...claim.claim_payload,
          external_claim_id: submissionResult.claimId,
          reference_number: submissionResult.referenceNumber,
          submitted_at: new Date().toISOString(),
          submitted_by: user.id,
        },
        updated_at: new Date().toISOString(),
      })
      .eq("id", claimId);

    if (updateError) {
      return NextResponse.json(
        { error: "Failed to update claim status" },
        { status: 500 },
      );
    }

    // Log claim submission
    await supabase.from("audit_logs").insert({
      action: "claim_submitted",
      user_id: user.id,
      resource_type: "insurance_claim",
      resource_id: claimId,
      metadata: {
        provider: claim.provider,
        external_claim_id: submissionResult.claimId,
        reference_number: submissionResult.referenceNumber,
        patient_name: claim.patients.full_name,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Claim submitted successfully",
      claim: {
        id: claimId,
        status: "submitted",
        externalClaimId: submissionResult.claimId,
        referenceNumber: submissionResult.referenceNumber,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const { user, error: authError } = await authorize(request);

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const supabase = await createClient();
    const claimId = params.id;

    // Get claim details
    const { data: claim, error: claimError } = await supabase
      .from("insurance_claims")
      .select(
        `
        id,
        public_id,
        patient_id,
        appointment_id,
        provider,
        claim_status,
        amount,
        claim_payload,
        created_at,
        updated_at,
        patients!inner(id, full_name, insurance_number)
      `,
      )
      .eq("id", claimId)
      .single();

    if (claimError || !claim) {
      return NextResponse.json({ error: "Claim not found" }, { status: 404 });
    }

    // Check if user has permission to view this claim
    if (user.role === "patient" && claim.patients.id !== user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    return NextResponse.json({
      claim: {
        id: claim.id,
        publicId: claim.public_id,
        patientName: claim.patients.full_name,
        provider: claim.provider,
        status: claim.claim_status,
        amount: claim.amount,
        description: claim.claim_payload?.description,
        diagnosis: claim.claim_payload?.diagnosis,
        treatment: claim.claim_payload?.treatment,
        externalClaimId: claim.claim_payload?.external_claim_id,
        referenceNumber: claim.claim_payload?.reference_number,
        createdAt: claim.created_at,
        updatedAt: claim.updated_at,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
