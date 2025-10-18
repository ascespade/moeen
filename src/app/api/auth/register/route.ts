/**
 * User Registration API - تسجيل المستخدمين
 * Creates new user accounts with proper validation
 */

import logger from '@/lib/monitoring/logger';
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { z } from "zod";
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

const registerSchema = z
  .object({
    name: z.string().min(1, "الاسم مطلوب"),
    email: z.string().email("البريد الإلكتروني غير صحيح"),
    password: z.string().min(6, "كلمة المرور يجب أن تكون 6 أحرف على الأقل"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "كلمة المرور غير متطابقة",
    path: ["confirmPassword"],
  });

export async function POST(request: NextRequest) {
  const startTime = Date.now();

  try {
    const body = await request.json().catch(() => null);
    if (!body || typeof body !== "object")
      return NextResponse.json({ error: "Invalid body" }, { status: 400 });

    // Get client info
    const ipAddress = getClientIP(request) || "127.0.0.1";
    const userAgent = request.headers.get("user-agent") || "Unknown";

    // Validate input
    const validation = registerSchema.safeParse(body);
    if (!validation.success) {
      const errors = validation.error.issues.map((err) => ({
        field: err.path[0],
        message: err.message,
      }));
      return NextResponse.json(
        {
          success: false,
          errors,
        },
        { status: 400 },
      );
    }

    const { name, email, password } = validation.data;

    // Get regular Supabase client
    const supabase = await createClient();

    // Check if user already exists in users table
    const { data: existingUser } = await supabase
      .from("users")
      .select("id")
      .eq("email", email)
      .maybeSingle();

    if (existingUser) {
      return NextResponse.json(
        {
          success: false,
          errors: [
            { field: "email", message: "البريد الإلكتروني مستخدم بالفعل" },
          ],
        },
        { status: 409 },
      );
    }

    // Create admin client for auth operations
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

    // Create user in Supabase Auth
    const { data: authData, error: authError } =
      await supabaseAdmin.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: {
          name: name,
        },
      });

    if (authError) {
      console.error("Auth creation error:", authError);
      return NextResponse.json(
        {
          success: false,
          errors: [
            {
              field: "general",
              message: `حدث خطأ أثناء إنشاء الحساب: ${authError.message}`,
            },
          ],
        },
        { status: 500 },
      );
    }

    if (!authData.user) {
      return NextResponse.json(
        {
          success: false,
          errors: [{ field: "general", message: "فشل إنشاء حساب المصادقة" }],
        },
        { status: 500 },
      );
    }

    // Create user profile in users table
    const { data: userProfile, error: profileError } = await supabaseAdmin
      .from("users")
      .insert({
        id: authData.user.id,
        email: email,
        name: name,
        role: "agent", // Default role
        status: "active",
        is_active: true,
        timezone: "Asia/Riyadh",
        language: "ar",
        last_ip_address: ipAddress,
        last_user_agent: userAgent,
        last_activity_at: new Date().toISOString(),
        last_password_change: new Date().toISOString(),
        login_count: 0,
        failed_login_attempts: 0,
        total_sessions: 0,
        preferences: {},
        metadata: {
          registered_via: "web",
          registration_ip: ipAddress,
          registration_user_agent: userAgent,
          registration_timestamp: new Date().toISOString(),
        },
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (profileError) {
      console.error("Profile creation error:", profileError);

      // Try to delete the auth user
      try {
        await supabaseAdmin.auth.admin.deleteUser(authData.user.id);
      } catch (deleteError) {
        console.error(
          "Failed to delete auth user after profile creation failure:",
          deleteError,
        );
      }

      return NextResponse.json(
        {
          success: false,
          errors: [
            {
              field: "general",
              message: `فشل إنشاء الملف الشخصي: ${profileError.message}`,
            },
          ],
        },
        { status: 500 },
      );
    }

    // Create audit log (optional, don't fail if this fails)
    try {
      await supabaseAdmin.from("audit_logs").insert({
        user_id: authData.user.id,
        action: "user_registered",
        resource_type: "user",
        resource_id: authData.user.id,
        ip_address: ipAddress,
        user_agent: userAgent,
        status: "success",
        severity: "info",
        new_values: {
          email,
          name,
          role: "agent",
        },
        metadata: {
          registration_method: "email_password",
          email_verified: false,
          account_status: "active",
        },
        duration_ms: Date.now() - startTime,
      });
    } catch (auditError) {
      console.error("Audit log error (non-critical):", auditError);
    }

    return NextResponse.json(
      {
        success: true,
        message: "تم إنشاء الحساب بنجاح",
        data: {
          id: authData.user.id,
          email: authData.user.email,
          name: name,
        },
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      {
        success: false,
        errors: [
          {
            field: "general",
            message: `حدث خطأ غير متوقع: ${error instanceof Error ? error.message : "Unknown error"}`,
          },
        ],
      },
      { status: 500 },
    );
  }
}
