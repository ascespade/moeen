import { _NextResponse } from "next/server";

import { _getServiceSupabase } from "@/lib/supabaseClient";
export async function __POST(_request: Request) {
  try {
    const { email, password, rememberMe } = await request.json();

    // Simple mock validation
    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: "Email and password are required" },
        { status: 400 },
      );
    }

    // Development test credentials (fallback if Supabase auth fails)
    if (email === "test@moeen.com" && password === "test123") {
      // First try to get the test user from database
      const __supabase = getServiceSupabase();
      const { data: testUser, error: userError } = await supabase
        .from("users")
        .select("id, email, name, role")
        .eq("email", "test@moeen.com")
        .single();

      if (testUser) {
        const __mockToken = "mock-jwt-token-" + Date.now();

        const __response = NextResponse.json({
          success: true,
          data: {
            user: {
              id: testUser.id,
              email: testUser.email,
              role: testUser.role,
              name: testUser.name,
              created_at: new Date().toISOString(),
            },
            token: mockToken,
          },
        });

        // Set cookie
        response.cookies.set("auth-token", mockToken, {
          httpOnly: true,
          sameSite: "lax",
          secure: process.env.NODE_ENV === "production",
          path: "/",
          maxAge: rememberMe ? 60 * 60 * 24 * 30 : 60 * 60 * 4,
        });

        return response;
      }
    }

    // Real Supabase auth for other users
    const __supabase = getServiceSupabase();
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

    const __response = NextResponse.json({
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
