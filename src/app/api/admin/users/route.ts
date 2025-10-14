// src/app/api/admin/users/route.ts
// Admin Users API endpoint
// Handles user management with RBAC

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import bcrypt from "bcryptjs";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

export async function GET(request: NextRequest) {
  try {
    // Check admin permissions
    const authHeader = request.headers.get("authorization");
    if (!authHeader) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get current user
    const currentUser = await getCurrentUser(authHeader);
    if (!currentUser || !["admin", "manager"].includes(currentUser.role)) {
      return NextResponse.json(
        { error: "Insufficient permissions" },
        { status: 403 },
      );
    }

    // Get all users
    const { data: users, error } = await supabase
      .from("users")
      .select(
        `
        id,
        email,
        name,
        role,
        status,
        last_login,
        created_at,
        user_roles (
          roles (
            name,
            permissions
          )
        )
      `,
      )
      .order("created_at", { ascending: false });

    if (error) throw error;

    const formattedUsers =
      users?.map((user) => ({
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        status: user.status,
        lastLogin: user.last_login,
        createdAt: user.created_at,
        permissions: user.user_roles?.[0]?.roles?.permissions || [],
      })) || [];

    return NextResponse.json({
      users: formattedUsers,
      currentUser: {
        id: currentUser.id,
        name: currentUser.name,
        role: currentUser.role,
      },
    });
  } catch (error) {
    console.error("Admin users GET error:", error);
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Check admin permissions
    const authHeader = request.headers.get("authorization");
    if (!authHeader) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const currentUser = await getCurrentUser(authHeader);
    if (!currentUser || !["admin", "manager"].includes(currentUser.role)) {
      return NextResponse.json(
        { error: "Insufficient permissions" },
        { status: 403 },
      );
    }

    const { email, name, role, password } = await request.json();

    // Validate input
    if (!email || !name || !role || !password) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    // Check if user already exists
    const { data: existingUser } = await supabase
      .from("users")
      .select("id")
      .eq("email", email)
      .single();

    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 409 },
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    const { data: newUser, error: userError } = await supabase
      .from("users")
      .insert({
        email,
        name,
        role,
        password: hashedPassword,
        status: "active",
        created_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (userError) throw userError;

    // Get role permissions
    const { data: roleData } = await supabase
      .from("roles")
      .select("id, permissions")
      .eq("name", role)
      .single();

    if (roleData) {
      // Assign role to user
      await supabase.from("user_roles").insert({
        user_id: newUser.id,
        role_id: roleData.id,
      });
    }

    // Log admin action
    await logAdminAction(currentUser.id, "CREATE_USER", {
      targetUserId: newUser.id,
      targetEmail: email,
      targetRole: role,
    });

    return NextResponse.json({
      message: "User created successfully",
      user: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        role: newUser.role,
        status: newUser.status,
      },
    });
  } catch (error) {
    console.error("Admin users POST error:", error);
    return NextResponse.json(
      { error: "Failed to create user" },
      { status: 500 },
    );
  }
}

async function getCurrentUser(authHeader: string) {
  try {
    const token = authHeader.replace("Bearer ", "");

    // Verify JWT token (simplified - in production, use proper JWT verification)
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser(token);

    if (error || !user) return null;

    // Get user details
    const { data: userData } = await supabase
      .from("users")
      .select("id, email, name, role, status")
      .eq("id", user.id)
      .single();

    return userData;
  } catch (error) {
    console.error("Get current user error:", error);
    return null;
  }
}

async function logAdminAction(userId: string, action: string, details: any) {
  try {
    await supabase.from("audit_logs").insert({
      user_id: userId,
      action,
      details,
      timestamp: new Date().toISOString(),
      ip_address: "127.0.0.1", // Would get from request in production
      user_agent: "Admin Panel",
    });
  } catch (error) {
    console.error("Log admin action error:", error);
  }
}
