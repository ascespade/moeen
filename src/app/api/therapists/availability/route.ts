import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const therapistId = searchParams.get("therapist_id");
    const date = searchParams.get("date");

    const supabase = await createClient();

    let query = supabase.from("therapist_schedules").select("*");

    if (therapistId) {
      query = query.eq("therapist_id", therapistId);
    }

    if (date) {
      query = query.eq("date", date);
    }

    const { data, error } = await query.eq("is_available", true);

    if (error) throw error;

    return NextResponse.json({ schedules: data });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch availability" }, { status: 500 });
  }
}
