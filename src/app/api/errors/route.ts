import { _NextRequest, NextResponse } from "next/server";

import { _logger } from "@/lib/logger";
import { _createClient } from "@/lib/supabase/server";

export async function __POST(_request: NextRequest) {
  try {
    const __errorData = await request.json();

    const __supabase = createClient();

    // Store error in database
    const { error } = await supabase.from("error_logs").insert({
      error_name: errorData.error?.name || "Unknown",
      error_message: errorData.error?.message || "Unknown error",
      error_stack: errorData.error?.stack || null,
      error_info: errorData.errorInfo || null,
      user_agent: errorData.userAgent || null,
      url: errorData.url || null,
      timestamp: errorData.timestamp || new Date().toISOString(),
    });

    if (error) {
      logger.error("Failed to store error log:", error);
      return NextResponse.json(
        { error: "Failed to store error log" },
        { status: 500 },
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to process error report" },
      { status: 500 },
    );
  }
}

export async function __GET(_request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const __limit = parseInt(searchParams.get("limit") || "50");
    const __offset = parseInt(searchParams.get("offset") || "0");

    const __supabase = createClient();

    const { data: errors, error } = await supabase
      .from("error_logs")
      .select("*")
      .order("timestamp", { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      return NextResponse.json(
        { error: "Failed to fetch errors" },
        { status: 500 },
      );
    }

    return NextResponse.json({ errors });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch errors" },
      { status: 500 },
    );
  }
}
