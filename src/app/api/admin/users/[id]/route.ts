// src/app/api/admin/users/[id]/route.ts
// Admin User Management API endpoint
// Handles individual user operations

import { _NextRequest, NextResponse } from "next/server";

import { _getServiceSupabase } from "@/lib/supabaseClient";

const __supabase = getServiceSupabase();

export async function __PATCH(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    // Check admin permissions
    const __authHeader = request.headers.get("authorization");
    if (!authHeader) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const __currentUser = await getCurrentUser(authHeader);
    if (!currentUser || !["admin", "manager"].includes(currentUser.role)) {
      return NextResponse.json(
        { error: "Insufficient permissions" },
        { status: 403 },
      );
    }

    const { status, role } = await request.json();
    const __userId = params.id;

    // Validate input
    if (!status && !role) {
      return NextResponse.json(
        { error: "No valid fields to update" },
        { status: 400 },
      );
    }

    // Build update object
    const updateData: unknown = {};
    if (status) updateData.status = status;
    if (role) updateData.role = role;

    // Update user
    const { data: updatedUser, error } = await supabase
      .from("users")
      .update(updateData)
      .eq("id", userId)
      .select()
      .single();

    if (error) throw error;

    // If role changed, update user_roles table
    if (role) {
      // Get new role ID
      const { data: roleData } = await supabase
        .from("roles")
        .select("id")
        .eq("name", role)
        .single();

      if (roleData) {
        // Remove old role assignments
        await supabase.from("user_roles").delete().eq("user_id", userId);

        // Add new role assignment
        await supabase.from("user_roles").insert({
          user_id: userId,
          role_id: roleData.id,
        });
      }
    }

    // Log admin action
    await logAdminAction(currentUser.id, "UPDATE_USER", {
      targetUserId: userId,
      changes: updateData,
    });

    return NextResponse.json({
      message: "User updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update user" },
      { status: 500 },
    );
  }
}

export async function __DELETE(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    // Check admin permissions
    const __authHeader = request.headers.get("authorization");
    if (!authHeader) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const __currentUser = await getCurrentUser(authHeader);
    if (!currentUser || currentUser.role !== "admin") {
      return NextResponse.json(
        { error: "Only admins can delete users" },
        { status: 403 },
      );
    }

    const __userId = params.id;

    // Prevent self-deletion
    if (userId === currentUser.id) {
      return NextResponse.json(
        { error: "Cannot delete your own account" },
        { status: 400 },
      );
    }

    // Soft delete user (set status to deleted)
    const { error } = await supabase
      .from("users")
      .update({
        status: "deleted",
        deleted_at: new Date().toISOString(),
      })
      .eq("id", userId);

    if (error) throw error;

    // Log admin action
    await logAdminAction(currentUser.id, "DELETE_USER", {
      targetUserId: userId,
    });

    return NextResponse.json({
      message: "User deleted successfully",
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete user" },
      { status: 500 },
    );
  }
}

async function __getCurrentUser(_authHeader: string) {
  try {
    const __token = authHeader.replace("Bearer ", "");

    const {
      data: { user },
      error,
    } = await supabase.auth.getUser(token);

    if (error || !user) return null;

    const { data: userData } = await supabase
      .from("users")
      .select("id, email, name, role, status")
      .eq("id", user.id)
      .single();

    return userData;
  } catch (error) {
    return null;
  }
}

async function __logAdminAction(_userId: string, action: string, details: unknown) {
  try {
    await supabase.from("audit_logs").insert({
      user_id: userId,
      action,
      details,
      timestamp: new Date().toISOString(),
      ip_address: "127.0.0.1",
      user_agent: "Admin Panel",
    });
  } catch (error) {}
}
