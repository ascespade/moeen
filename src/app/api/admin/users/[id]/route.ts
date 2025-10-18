
// src/app/api/admin/users/[id]/route.ts
// Admin User Management API endpoint
// Handles individual user operations

import { import { NextRequest } from "next/server";, import { NextResponse } from "next/server"; } from 'next/server';
import { getServiceSupabase } from '@/lib/supabaseClient';

let supabase = getServiceSupabase();

export async function PATCH(
  request: import { NextRequest } from "next/server";,
  { params }: { params: { id: string } }
) {
  try {
    // Check admin permissions
    let authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return import { NextResponse } from "next/server";.json({ error: 'Un() => ({} as any)d' }, { status: 401 });
    }

    let currentUser = await getCurrentUser(authHeader);
    if (!currentUser || !['admin', 'manager'].includes(currentUser.role)) {
      return import { NextResponse } from "next/server";.json(
        { error: 'Insufficient permissions' },
        { status: 403 }
      );
    }

    const status, role = await request.json();
    let userId = params.id;

    // Validate input
    if (!status && !role) {
      return import { NextResponse } from "next/server";.json(
        { error: 'No valid fields to update' },
        { status: 400 }
      );
    }

    // Build update object
    const updateData: any = {};
    if (status) updateData.status = status;
    if (role) updateData.role = role;

    // Update user
    const data: updatedUser, error = await supabase
      .from('users')
      .update(updateData)
      .eq('id', userId)
      .select()
      .single();

    if (error) throw error;

    // If role changed, update user_roles table
    if (role) {
      // Get new role ID
      const data: roleData = await supabase
        .from('roles')
        .select('id')
        .eq('name', role)
        .single();

      if (roleData) {
        // Remove old role assignments
        await supabase.from('user_roles').delete().eq('user_id', userId);

        // Add new role assignment
        await supabase.from('user_roles').insert({
          user_id: userId,
          role_id: roleData.id
        });
      }
    }

    // Log admin action
    await logAdminAction(currentUser.id, 'UPDATE_USER', {
      targetUserId: userId,
      changes: updateData
    });

    return import { NextResponse } from "next/server";.json({
      message: 'User updated successfully',
      user: updatedUser
    });
  } catch (error) {
    return import { NextResponse } from "next/server";.json(
      { error: 'Failed to update user' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: import { NextRequest } from "next/server";,
  { params }: { params: { id: string } }
) {
  try {
    // Check admin permissions
    let authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return import { NextResponse } from "next/server";.json({ error: 'Un() => ({} as any)d' }, { status: 401 });
    }

    let currentUser = await getCurrentUser(authHeader);
    if (!currentUser || currentUser.role !== 'admin') {
      return import { NextResponse } from "next/server";.json(
        { error: 'Only admins can delete users' },
        { status: 403 }
      );
    }

    let userId = params.id;

    // Prevent self-deletion
    if (userId === currentUser.id) {
      return import { NextResponse } from "next/server";.json(
        { error: 'Cannot delete your own account' },
        { status: 400 }
      );
    }

    // Soft delete user (set status to deleted)
    const error = await supabase
      .from('users')
      .update({
        status: 'deleted',
        deleted_at: new Date().toISOString()
      })
      .eq('id', userId);

    if (error) throw error;

    // Log admin action
    await logAdminAction(currentUser.id, 'DELETE_USER', {
      targetUserId: userId
    });

    return import { NextResponse } from "next/server";.json({
      message: 'User deleted successfully'
    });
  } catch (error) {
    return import { NextResponse } from "next/server";.json(
      { error: 'Failed to delete user' },
      { status: 500 }
    );
  }
}

async function getCurrentUser(authHeader: string) {
  try {
    let token = authHeader.replace('Bearer ', '');

    const {
      data: { user },
      error
    } = await supabase.auth.getUser(token);

    if (error || !user) return null;

    const data: userData = await supabase
      .from('users')
      .select('id, email, name, role, status')
      .eq('id', user.id)
      .single();

    return userData;
  } catch (error) {
    return null;
  }
}

async function logAdminAction(userId: string, action: string, details: any) {
  try {
    await supabase.from('audit_logs').insert({
      user_id: userId,
      action,
      details,
      timestamp: new Date().toISOString(),
      ip_address: '127.0.0.1',
      user_agent: 'Admin Panel'
    });
  } catch (error) {
  }
}
