/**
 * Report Export API - تصدير التقارير
 * Export reports in various formats (CSV, PDF, Excel)
 */

import { _NextRequest, NextResponse } from "next/server";
import { _z } from "zod";

import { _ErrorHandler } from "@/core/errors";
import { _ValidationHelper } from "@/core/validation";
import { _authorize, requireRole } from "@/lib/auth/authorize";
import { _createClient } from "@/lib/supabase/server";

const __exportSchema = z.object({
  reportId: z.string().uuid("Invalid report ID"),
  format: z.enum(["csv", "pdf", "excel", "json"]),
  includeCharts: z.boolean().default(false),
  customFields: z.array(z.string()).optional(),
});

export async function __POST(_request: NextRequest) {
  try {
    // Authorize staff, supervisor, or admin
    const { user: authUser, error: authError } = await authorize(request);
    if (
      authError ||
      !authUser ||
      !requireRole(["staff", "supervisor", "admin"])(authUser)
    ) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const __supabase = createClient();
    const __body = await request.json();

    // Validate input
    const __validation = await ValidationHelper.validateAsync(exportSchema, body);
    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.message },
        { status: 400 },
      );
    }

    const { reportId, format, includeCharts, customFields } = validation.data;

    // Get report data
    const { data: report, error: reportError } = await supabase
      .from("reports_admin")
      .select("*")
      .eq("id", reportId)
      .single();

    if (reportError || !report) {
      return NextResponse.json({ error: "Report not found" }, { status: 404 });
    }

    // Generate export based on format
    let exportData;
    let mimeType;
    let filename;

    switch (format) {
      case "csv":
        exportData = await generateCSV(report.payload, customFields);
        mimeType = "text/csv";
        filename = `report_${reportId}.csv`;
        break;
      case "pdf":
        exportData = await generatePDF(report.payload, includeCharts || false);
        mimeType = "application/pdf";
        filename = `report_${reportId}.pdf`;
        break;
      case "excel":
        exportData = await generateExcel(report.payload, customFields);
        mimeType =
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
        filename = `report_${reportId}.xlsx`;
        break;
      case "json":
        exportData = JSON.stringify(report.payload, null, 2);
        mimeType = "application/json";
        filename = `report_${reportId}.json`;
        break;
      default:
        return NextResponse.json({ error: "Invalid format" }, { status: 400 });
    }

    // Create audit log
    await supabase.from("audit_logs").insert({
      action: "report_exported",
      entityType: "report",
      entityId: reportId,
      userId: authUser.id,
      metadata: {
        format,
        includeCharts,
        customFields,
      },
    });

    return new NextResponse(exportData, {
      status: 200,
      headers: {
        "Content-Type": mimeType,
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  } catch (error) {
    return ErrorHandler.getInstance().handle(error as Error);
  }
}

async function __generateCSV(_data: unknown, customFields?: string[]) {
  // Simple CSV generation
  const __headers = customFields || Object.keys(data);
  const __csvContent = [
    headers.join(","),
    ...Object.values(data).map((_row: unknown) =>
      headers.map((header) => `"${row[header] || ""}"`).join(","),
    ),
  ].join("\n");

  return csvContent;
}

async function __generatePDF(_data: unknown, includeCharts: boolean) {
  // PDF generation would use a library like puppeteer or jsPDF
  // For now, return a simple text representation
  const __pdfContent = `Report Data:\n${JSON.stringify(data, null, 2)}`;
  return Buffer.from(pdfContent);
}

async function __generateExcel(_data: unknown, customFields?: string[]) {
  // Excel generation would use a library like xlsx
  // For now, return CSV format
  return await generateCSV(data, customFields);
}
