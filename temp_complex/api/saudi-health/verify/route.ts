import { NextRequest, NextResponse } from "next/server";
import { saudiHealthSystem } from "@/lib/saudi-health-integration";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { nationalId, providerCode } = body;

    if (!nationalId || !providerCode) {
      return NextResponse.json(
        {
          success: false,
          error: "National ID and provider code are required",
          code: "MISSING_REQUIRED_FIELDS",
        },
        { status: 400 },
      );
    }

    // Verify insurance coverage
    const coverage = await saudiHealthSystem.verifyInsuranceCoverage(
      nationalId,
      providerCode,
    );

    return NextResponse.json({
      success: true,
      data: {
        nationalId,
        providerCode,
        coverage,
        verifiedAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error("Saudi health verification error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to verify insurance coverage",
        code: "VERIFICATION_FAILED",
      },
      { status: 500 },
    );
  }
}
