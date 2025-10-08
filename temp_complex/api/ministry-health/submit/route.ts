import { NextRequest, NextResponse } from "next/server";
import { ministryHealthIntegration } from "@/lib/saudi-ministry-health-integration";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      patientId,
      serviceType,
      serviceCode,
      diagnosisCode,
      serviceDate,
      amount,
      notes,
    } = body;

    if (
      !patientId ||
      !serviceType ||
      !serviceCode ||
      !diagnosisCode ||
      !amount
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

    // Submit to ministry systems
    const result = await ministryHealthIntegration.submitToMinistry(patientId, {
      serviceType,
      serviceCode,
      diagnosisCode,
      serviceDate: serviceDate || new Date().toISOString(),
      amount: parseFloat(amount),
      notes,
    });

    return NextResponse.json({
      success: true,
      data: {
        patientId,
        serviceData: {
          serviceType,
          serviceCode,
          diagnosisCode,
          serviceDate,
          amount,
          notes,
        },
        ministrySubmissions: result,
        submittedAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error("Ministry health submission error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to submit to ministry health systems",
        code: "SUBMISSION_FAILED",
      },
      { status: 500 },
    );
  }
}
