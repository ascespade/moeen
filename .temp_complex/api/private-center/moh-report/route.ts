import { NextRequest, NextResponse } from "next/server";
import { privateCenterIntegration } from "@/lib/private-center-integration";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      reportType,
      reportPeriod,
      totalPatients,
      newPatients,
      completedSessions,
      revenue,
      qualityMetrics,
    } = body;

    if (!reportType || !reportPeriod) {
      return NextResponse.json(
        {
          success: false,
          error: "Report type and period are required",
          code: "MISSING_REQUIRED_FIELDS",
        },
        { status: 400 },
      );
    }

    // Submit MOH report
    const result = await privateCenterIntegration.submitMOHReport({
      centerId: process.env.CENTER_ID || "HEMAM001",
      reportType: reportType || "monthly",
      reportPeriod,
      submittedAt: new Date().toISOString(),
      status: "submitted",
      data: {
        totalPatients: totalPatients || 0,
        newPatients: newPatients || 0,
        completedSessions: completedSessions || 0,
        revenue: revenue || 0,
        qualityMetrics: qualityMetrics || {
          patientSatisfaction: 0,
          treatmentOutcomes: 0,
          safetyIncidents: 0,
        },
      },
    });

    return NextResponse.json({
      success: result.success,
      data: {
        reportType,
        reportPeriod,
        result,
        submittedAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error("MOH report submission error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to submit MOH report",
        code: "MOH_REPORT_FAILED",
      },
      { status: 500 },
    );
  }
}
