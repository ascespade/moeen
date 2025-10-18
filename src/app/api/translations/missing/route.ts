import { NextRequest, NextResponse } from "next/server";
import { getServiceSupabase } from "@/lib/supabaseClient";

const supabase = getServiceSupabase();

export async function POST(request: NextRequest) {
  try {
    const { language, key, requestedAt } = await request.json();

    if (!language || !key) {
      return NextResponse.json(
        { error: "Language and key are required" },
        { status: 400 },
      );
    }

    // Create missing_translations table if it doesn't exist
    await supabase.rpc("exec_sql", {
      sql_query: `
        CREATE TABLE IF NOT EXISTS missing_translations (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          language TEXT NOT NULL,
          key TEXT NOT NULL,
          requested_at TIMESTAMP DEFAULT NOW(),
          created_at TIMESTAMP DEFAULT NOW()
        );
      `,
    });

    // Insert missing translation key
    const { data, error } = await supabase.from("missing_translations").insert({
      language,
      key,
      requested_at: requestedAt || new Date().toISOString(),
    });

    if (error) {
      return NextResponse.json(
        { error: "Failed to log missing translation" },
        { status: 500 },
      );
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const language = searchParams.get("language");

    let query = supabase
      .from("missing_translations")
      .select("*")
      .order("created_at", { ascending: false });

    if (language) {
      query = query.eq("language", language);
    }

    const { data, error } = await query;

    if (error) {
      return NextResponse.json(
        { error: "Failed to fetch missing translations" },
        { status: 500 },
      );
    }

    return NextResponse.json({ data });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
