import { NextResponse } from "next/server";
import { getServiceSupabase } from "@/lib/supabaseClient";
export async function POST(request: Request) {
  try {
    const { email, password, rememberMe } = await request.json();

    // Simple mock validation
    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: "Email and password are required" },
        { status: 400 },
      );
    }

    // Real Supabase auth
    const supabase = getServiceSupabase();
    const { data: authData, error: signInError } =
      await supabase.auth.signInWithPassword({
        email,
        password,
      });

    if (signInError || !authData?.session) {
      return NextResponse.json(
        { success: false, error: "Invalid credentials" },
        { status: 401 },
      );
    }

    const { session, user } = authData;

    const response = NextResponse.json({
      success: true,
      data: { user, token: session.access_token },
    });

    // Set cookie
    response.cookies.set("auth-token", session.access_token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: rememberMe ? 60 * 60 * 24 * 30 : 60 * 60 * 4,
    });

    return response;
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Invalid request" },
      { status: 400 },
    );
  }
}
