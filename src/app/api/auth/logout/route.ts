/**
 * Logout API - تسجيل الخروج
 * Real Supabase session cleanup with full tracking
 */

import logger from '@/lib/monitoring/logger';
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createClient as createServiceClient } from "@supabase/supabase-js";

// Helper to extract IP address from request
function getClientIP(request: NextRequest): string {
  try {
    return (
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip") ||
      "127.0.0.1"
    );
  } catch {
    return "127.0.0.1";
  }
}

export async function POST(request: NextRequest) {
  const startTime = Date.now();
  try {
    const supabase = await createClient();

    // Get current user before logout for audit
    const {
      data: { user },
    } = await supabase.auth.getUser();

    // Sign out from Supabase (clears session)
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error("Supabase logout error:", error);
    }

    // Get client info
    const ipAddress = getClientIP(request) || "127.0.0.1";
    const userAgent = request.headers.get("user-agent") || "Unknown";

    // Get user profile for complete tracking
    let sessionDuration = 0;
    if (user) {
      const { data: userProfile } = await supabase
        .from("users")
        .select("last_login")
        .eq("id", user.id)
        .single();

      if (userProfile?.last_login) {
        sessionDuration =
          Date.now() - new Date(userProfile.last_login).getTime();
      }
    }

    // Create comprehensive audit log
    if (user) {
      const supabaseAdmin = createServiceClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!,
        {
          auth: {
            autoRefreshToken: false,
            persistSession: false,
          },
        },
      );

      try {
        await supabaseAdmin.from("audit_logs").insert({
          user_id: user.id,
          action: "user_logout",
          resource_type: "user",
          resource_id: user.id,
          ip_address: ipAddress,
          user_agent: userAgent,
          status: "success",
          severity: "info",
          metadata: {
            logout_time: new Date().toISOString(),
            session_duration_ms: sessionDuration,
            session_duration_minutes: Math.round(sessionDuration / 60000),
          },
          duration_ms: Date.now() - startTime,
        });
      } catch (auditError) {
        console.error("Audit log error (non-critical):", auditError);
      }
    }

    // Clear auth cookie
    const response = NextResponse.json({
      success: true,
      message: "Logged out successfully",
    });

    response.cookies.set("auth-token", "", {
      path: "/",
      maxAge: 0,
      httpOnly: true,
      sameSite: "lax",
    });

    return response;
  } catch (error) {
    console.error("Logout error:", error);

    // Still clear cookie even if Supabase fails
    const response = NextResponse.json({
      success: true,
      message: "Logged out successfully",
    });

    response.cookies.set("auth-token", "", {
      path: "/",
      maxAge: 0,
    });

    return response;
  }
}
