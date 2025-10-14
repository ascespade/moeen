import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function POST(request: NextRequest) {
  try {
    const refreshToken = request.cookies.get("refresh-token")?.value;

    if (!refreshToken) {
      return NextResponse.json(
        {
          success: false,
          error: "Refresh token not found",
          code: "REFRESH_TOKEN_MISSING",
        },
        { status: 401 },
      );
    }

    const jwtSecret = process.env.JWT_SECRET || "fallback-secret-key";

    try {
      const decoded = jwt.verify(refreshToken, jwtSecret) as {
        userId: string;
        type: string;
        email?: string;
        role?: string;
      };

      if (decoded.type !== "refresh") {
        return NextResponse.json(
          {
            success: false,
            error: "Invalid refresh token",
            code: "INVALID_REFRESH_TOKEN",
          },
          { status: 401 },
        );
      }

      // Generate new access token
      const newToken = jwt.sign(
        {
          userId: decoded.userId,
          email: decoded.email || "",
          role: decoded.role || "patient",
        },
        jwtSecret,
        { expiresIn: "7d" },
      );

      const response = NextResponse.json({
        success: true,
        data: {
          token: newToken,
        },
      });

      // Set new token cookie
      response.cookies.set("auth-token", newToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
        maxAge: 7 * 24 * 60 * 60, // 7 days
      });

      return response;
    } catch (_jwtError) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid or expired refresh token",
          code: "INVALID_REFRESH_TOKEN",
        },
        { status: 401 },
      );
    }
  } catch (error) {
    console.error("Token refresh error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
        code: "INTERNAL_ERROR",
      },
      { status: 500 },
    );
  }
}
