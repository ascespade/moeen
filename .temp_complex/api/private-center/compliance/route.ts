import { NextRequest, NextResponse } from "next/server";
import { privateCenterIntegration } from "@/lib/private-center-integration";

export async function GET(request: NextRequest) {
  try {
    // Validate center compliance
    const compliance =
      await privateCenterIntegration.validateCenterCompliance();

    return NextResponse.json({
      success: true,
      data: {
        compliance,
        validatedAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error("Private center compliance validation error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to validate center compliance",
        code: "COMPLIANCE_VALIDATION_FAILED",
      },
      { status: 500 },
    );
  }
}
