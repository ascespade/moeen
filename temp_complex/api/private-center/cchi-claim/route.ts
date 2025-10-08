import { NextRequest, NextResponse } from "next/server";
import { privateCenterIntegration } from "@/lib/private-center-integration";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      patientId,
      nationalId,
      serviceCode,
      diagnosisCode,
      serviceDate,
      amount,
      provider,
      notes,
    } = body;

    if (
      !patientId ||
      !nationalId ||
      !serviceCode ||
      !diagnosisCode ||
      !amount ||
      !provider
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "All required fields must be provided",
          code: "MISSING_REQUIRED_FIELDS",
        },
        { status: 400 },
      );
    }

    // Submit CCHI claim
    const result = await privateCenterIntegration.submitCCHIClaim({
      patientId,
      nationalId,
      serviceCode,
      diagnosisCode,
      serviceDate: serviceDate || new Date().toISOString(),
      amount: parseFloat(amount),
      provider,
      notes,
    });

    return NextResponse.json({
      success: result.success,
      data: {
        patientId,
        nationalId,
        serviceCode,
        diagnosisCode,
        result,
        submittedAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error("CCHI claim submission error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to submit CCHI claim",
        code: "CCHI_CLAIM_FAILED",
      },
      { status: 500 },
    );
  }
}
