import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  try {
    const errorReport = await request.json();

    // Validate error report structure
    if (!errorReport.message || !errorReport.context) {
      return NextResponse.json(
        { error: "Invalid error report structure" },
        { status: 400 },
      );
    }

    // Only log errors in production
    if (process.env.NODE_ENV === "production") {
      const supabase = createClient();

      // Insert into audit_logs table
      const { error } = await supabase.from("audit_logs").insert({
        action: "error_occurred",
        details: errorReport,
        user_id: errorReport.context.userId,
        session_id: errorReport.context.sessionId,
        severity: errorReport.context.severity,
        created_at: errorReport.context.timestamp,
      });

      if (error) {
        console.error("Failed to log error to audit_logs:", error);
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error processing error report:", error);
    return NextResponse.json(
      { error: "Failed to process error report" },
      { status: 500 },
    );
  }
}
