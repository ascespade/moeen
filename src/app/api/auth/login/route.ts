/**
 * Login API - تسجيل الدخول
 * Real Supabase authentication with full database tracking
 */

import { NextRequest, NextResponse } from "next/server";
import { createClient } from '@/lib/supabase/server';
import { createClient as createServiceClient } from '@supabase/supabase-js';

// Helper to extract IP address from request
function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const realIP = request.headers.get('x-real-ip');
  
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  if (realIP) {
    return realIP;
  }
  return '127.0.0.1';
}

export async function POST(request: NextRequest) {
  const startTime = Date.now();
  
  try {
    const body = await request.json();
    if (!body) {
      return NextResponse.json(
        { success: false, error: "Request body is required" },
        { status: 400 }
      );
    }
    const { email, password, rememberMe } = body || {};

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: "البريد الإلكتروني وكلمة المرور مطلوبان" },
        { status: 400 },
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, error: "البريد الإلكتروني غير صحيح" },
        { status: 400 },
      );
    }

    // Get client info
    const ipAddress = getClientIP(request) || '127.0.0.1';
    const userAgent = request.headers.get('user-agent') || 'Unknown';

    // Real Supabase authentication
    const supabase = await createClient();

    const { data: authData, error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError || !authData?.session) {
      // Try to get user for logging only (don't reveal if user exists)
      const { data: userCheck } = await supabase
        .from('users')
        .select('id, locked_until, failed_login_attempts')
        .eq('email', email)
        .single();

      // Check if account is locked (only if user exists)
      if (userCheck && userCheck.locked_until) {
        const lockedUntil = new Date(userCheck.locked_until);
        if (lockedUntil > new Date()) {
          const minutesLeft = Math.ceil((lockedUntil.getTime() - Date.now()) / 60000);
          
          // Log failed attempt
          await supabase.from('audit_logs').insert({
            user_id: userCheck.id,
            action: 'login_blocked_locked_account',
            resource_type: 'user',
            resource_id: userCheck.id,
            ip_address: ipAddress,
            user_agent: userAgent,
            status: 'failed',
            severity: 'warning',
            metadata: {
              locked_until: userCheck.locked_until,
              minutes_remaining: minutesLeft
            }
          });

          return NextResponse.json(
            { 
              success: false, 
              error: `الحساب مقفل. حاول مرة أخرى بعد ${minutesLeft} دقيقة`,
              lockedUntil: userCheck.locked_until
            },
            { status: 423 } // Locked
          );
        }
      }

      // Increment failed login attempts only if user exists
      if (userCheck) {
        const supabaseAdmin = createServiceClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.SUPABASE_SERVICE_ROLE_KEY!,
          {
            auth: {
              autoRefreshToken: false,
              persistSession: false
            }
          }
        );

        try {
          await supabaseAdmin.rpc('increment_failed_login_attempts', { user_email: email });
        } catch (err) {
          console.error('Error incrementing failed login attempts:', err);
        }
      }

      // Log failed login attempt
      await supabase.from('audit_logs').insert({
        user_id: userCheck?.id || null,
        action: 'failed_login_attempt',
        resource_type: 'user',
        resource_id: userCheck?.id || null,
        ip_address: ipAddress,
        user_agent: userAgent,
        status: 'failed',
        severity: 'warning',
        error_message: signInError?.message || 'Invalid credentials',
        metadata: {
          email: email,
          reason: signInError?.message || 'Invalid credentials'
        },
        duration_ms: Date.now() - startTime
      });

      // Always return same message for security
      return NextResponse.json(
        { success: false, error: "بيانات الدخول غير صحيحة" },
        { status: 401 }, // Always 401 for security
      );
    }

    const { session, user } = authData;

    // Get user profile from database
    const { data: userProfile } = await supabase
      .from('users')
      .select('id, email, name, role, status, is_active, login_count, total_sessions')
      .eq('id', user.id)
      .single();

    // Check if user is active
    if (userProfile && !userProfile.is_active) {
      await supabase.from('audit_logs').insert({
        user_id: user.id,
        action: 'login_blocked_inactive_account',
        resource_type: 'user',
        resource_id: user.id,
        ip_address: ipAddress,
        user_agent: userAgent,
        status: 'failed',
        severity: 'warning',
        metadata: {
          email: email,
          reason: 'Account is inactive'
        }
      });

      return NextResponse.json(
        { success: false, error: "الحساب غير نشط. تواصل مع الإدارة." },
        { status: 403 },
      );
    }

    // Use database function to update last login with full tracking
    const supabaseAdmin = createServiceClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    );

    try {
      await supabaseAdmin.rpc('update_last_login', {
        user_email: email,
        ip_addr: ipAddress,
        user_agent_str: userAgent
      });
    } catch (err) {
      console.error('Error updating last login:', err);
    }

    // Create comprehensive audit log for successful login
    try {
      await supabaseAdmin.from('audit_logs').insert({
        user_id: user.id,
        action: 'user_login',
        resource_type: 'user',
        resource_id: user.id,
        ip_address: ipAddress,
        user_agent: userAgent,
        status: 'success',
        severity: 'info',
        session_id: session.access_token.substring(0, 20),
        metadata: {
          email: user.email,
          role: userProfile?.role || 'user',
          login_count: (userProfile?.login_count || 0) + 1,
          remember_me: rememberMe
        },
        duration_ms: Date.now() - startTime
      });
    } catch (auditError) {
      console.error('Audit log error (non-critical):', auditError);
    }

    const response = NextResponse.json({
      success: true,
      data: { 
        user: userProfile || {
          id: user.id,
          email: user.email,
          name: user.user_metadata?.name || user.email,
          role: 'agent',
          status: 'active'
        },
        token: session.access_token,
        session: {
          expiresAt: session.expires_at,
          expiresIn: session.expires_in
        }
      },
    });

    // Set authentication cookie
    response.cookies.set("auth-token", session.access_token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: rememberMe ? 60 * 60 * 24 * 30 : 60 * 60 * 4,
    });

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { success: false, error: "حدث خطأ أثناء تسجيل الدخول" },
      { status: 500 },
    );
  }
}