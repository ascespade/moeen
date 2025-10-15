import { NextRequest, NextResponse } from "next/server";
import { getServiceSupabase } from "@/lib/supabaseClient";

export async function POST(request: NextRequest) {
  try {
    const { name, value, timestamp } = await request.json();

    // Validate request
    if (!name || typeof value !== "number" || !timestamp) {
      return NextResponse.json(
        { error: "Invalid metrics data" },
        { status: 400 },
      );
    }

    // Only track in production
    if (process.env.NODE_ENV === "production") {
      const supabase = getServiceSupabase();

      // Insert into performance_metrics table
      const { error } = await supabase.from("performance_metrics").insert({
        metric_name: name,
        metric_value: value,
        timestamp: new Date(timestamp).toISOString(),
      });

      if (error) {
        }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to process performance metrics" },
      { status: 500 },
    );
  }
}
