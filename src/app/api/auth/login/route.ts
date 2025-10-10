import { NextResponse } from "next/server";

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

    // Mock admin user; replace with real auth later
    const user = {
      id: "admin-1",
      email,
      name: "Administrator",
      role: "admin",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const token = "mock-admin-token";

    const response = NextResponse.json({
      success: true,
      data: { user, token },
    });

    // Set cookie (httpOnly in production ideally)
    response.cookies.set("auth-token", token, {
      httpOnly: false,
      sameSite: "lax",
      secure: false,
      path: "/",
      maxAge: rememberMe ? 60 * 60 * 24 * 30 : 60 * 60 * 4, // 30d or 4h
    });

    return response;
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Invalid request" },
      { status: 400 },
    );
  }
}
