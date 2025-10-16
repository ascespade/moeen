import { NextRequest, NextResponse } from "next/server";
import { ministryHealthIntegration } from "@/lib/saudi-ministry-health-integration";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { patientData } = body;

    if (!patientData) {
      return NextResponse.json(
        {
          success: false,
          error: "Patient data is required",
          code: "MISSING_PATIENT_DATA",
        },
        { status: 400 },
      );
    }

    // Validate ministry compliance
    const compliance =
      await ministryHealthIntegration.validateMinistryCompliance(patientData);

    return NextResponse.json({
      success: true,
      data: {
        compliance,
        validatedAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error("Ministry compliance validation error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to validate ministry compliance",
        code: "COMPLIANCE_VALIDATION_FAILED",
      },
      { status: 500 },
    );
  }
}
