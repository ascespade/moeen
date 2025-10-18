import { NextRequest, NextResponse } from "next/server";

import { createClient as createServiceClient } from "@supabase/supabase-js";
import { z } from "zod";

import logger from "@/lib/monitoring/logger";
import { createClient } from "@/lib/supabase/server";

/**
 * Forgot Password API - نسيان كلمة المرور
 * Real Supabase password reset with full tracking
 */

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

const forgotPasswordSchema = z.object({
  email: z.string().email("البريد الإلكتروني غير صحيح"),
});

export async function POST(request: NextRequest) {
  const startTime = Date.now();

  try {
    const body = await request.json().catch(() => ({}));
    if (!body || typeof body !== "object")
      return NextResponse.json({ error: "Invalid body" }, { status: 400 });

    // Get client info
    const ipAddress = getClientIP(request) || "127.0.0.1";
    const userAgent = request.headers.get("user-agent") || "Unknown";

    // Validate input
    const validation = forgotPasswordSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
          success: false,
          errors: validation.error.issues.map((err) => ({
            field: err.path[0],
            message: err.message,
          })),
        },
        { status: 400 },
      );

    const { email } = validation.data;
    const supabase = await createClient();

    // Check if user exists in database
    const { data: user } = await supabase
      .from("users")
      .select("id, email")
      .eq("email", email)
      .single();

    // Send password reset email
    const redirectUrl = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3002"}/reset-password`;

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: redirectUrl,
    });

    if (error) {
      console.error("Password reset error:", error);
      // Don't reveal if email exists or not for security
      return NextResponse.json({
        success: true,
        message:
          "إذا كان البريد الإلكتروني مسجلاً، سيتم إرسال رابط إعادة تعيين كلمة المرور",
      });

    // Create comprehensive audit log
    const supabaseAdmin = createServiceClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      },
    );

    if (user) {
      try {
        await supabaseAdmin.from("audit_logs").insert({
          user_id: user.id,
          action: "password_reset_requested",
          resource_type: "user",
          resource_id: user.id,
          ip_address: ipAddress,
          user_agent: userAgent,
          status: "success",
          severity: "info",
          metadata: {
            email: email,
            requested_at: new Date().toISOString(),
            reset_method: "email",
          },
          duration_ms: Date.now() - startTime,
        });
      } catch (auditError) {
        console.error("Audit log error (non-critical):", auditError);
      }
    } else {
      // Log attempt for non-existent user
      try {
        await supabaseAdmin.from("audit_logs").insert({
          action: "password_reset_attempted_unknown_email",
          resource_type: "user",
          ip_address: ipAddress,
          user_agent: userAgent,
          status: "failed",
          severity: "warning",
          metadata: {
            email: email,
            reason: "Email not found",
          },
          duration_ms: Date.now() - startTime,
        });
      } catch (auditError) {
        console.error("Audit log error (non-critical):", auditError);
      }

    return NextResponse.json({
      success: true,
      message: "تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني",
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json(
        success: false,
        error: "حدث خطأ أثناء معالجة طلبك",
      },
      { status: 500 },
    );
  }
}}
