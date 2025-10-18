import { NextRequest, NextResponse } from "next/server";
import { getServerSupabase } from "@/lib/supabaseClient";

export async function GET() {
  try {
    const supabase = await getServerSupabase();

    // Get current user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fetch user preferences
    const { data: preferences, error } = await supabase
      .from("user_preferences")
      .select("theme, language, timezone, notifications_enabled")
      .eq("user_id", user.id)
      .single();

    if (error && error.code !== "PGRST116") {
      // PGRST116 = no rows returned
      return NextResponse.json(
        { error: "Failed to fetch preferences" },
        { status: 500 },
      );
    }

    // Return default preferences if none exist
    const defaultPreferences = {
      theme: "light",
      language: "ar",
      timezone: "Asia/Riyadh",
      notifications_enabled: true,
    };

    return NextResponse.json(preferences || defaultPreferences);
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await getServerSupabase();

    // Get current user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { key, value } = await request.json();

    if (!key || value === undefined) {
      return NextResponse.json(
        { error: "Key and value are required" },
        { status: 400 },
      );
    }

    // Validate key
    const validKeys = [
      "theme",
      "language",
      "timezone",
      "notifications_enabled",
    ];
    if (!validKeys.includes(key)) {
      return NextResponse.json(
        { error: "Invalid preference key" },
        { status: 400 },
      );
    }

    // Validate theme value
    if (key === "theme" && !["light", "dark", "system"].includes(value)) {
      return NextResponse.json(
        { error: "Invalid theme value" },
        { status: 400 },
      );
    }

    // Validate language value
    if (key === "language" && !["ar", "en"].includes(value)) {
      return NextResponse.json(
        { error: "Invalid language value" },
        { status: 400 },
      );
    }

    // Upsert user preference
    const { error } = await supabase.from("user_preferences").upsert(
      {
        user_id: user.id,
        [key]: value,
        updated_at: new Date().toISOString(),
      },
      {
        onConflict: "user_id",
      },
    );

    if (error) {
      return NextResponse.json(
        { error: "Failed to save preference" },
        { status: 500 },
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
