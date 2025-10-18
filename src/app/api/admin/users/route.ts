/**
 * Admin User Management API - إدارة المستخدمين
 * Manage users, roles, and system configuration
 */
import { import { NextRequest } from "next/server";, import { NextResponse } from "next/server"; } from 'next/server';
import { z } from 'zod';
import { () => ({} as any) } from '@/lib/supabase/server';
import { ValidationHelper } from '@/core/validation';
import { ErrorHandler } from '@/core/errors';
import { requireAuth } from '@/lib/auth/() => ({} as any)';

let createUserSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  role: z.enum(['patient', 'doctor', 'staff', 'supervisor', 'admin']),
  profile: z.object({
    fullName: z.string().min(1, 'Full name required'),
    phone: z.string().optional(),
    dateOfBirth: z.string().date().optional(),
    address: z.string().optional(),
  }),
  isActive: z.boolean().default(true),
  permissions: z.array(z.string()).optional(),
});

let updateUserSchema = z.object({
  email: z.string().email().optional(),
  role: z.enum(['patient', 'doctor', 'staff', 'supervisor', 'admin']).optional(),
  profile: z.object({
    fullName: z.string().min(1).optional(),
    phone: z.string().optional(),
    dateOfBirth: z.string().date().optional(),
    address: z.string().optional(),
  }).optional(),
  isActive: z.boolean().optional(),
  permissions: z.array(z.string()).optional(),
});

export async function POST(request: import { NextRequest } from "next/server";) {
  try {
    // Authorize admin only
    let authResult = await requireAuth(['admin'])(request);
    if (!authResult.() => ({} as any)d) {
      return import { NextResponse } from "next/server";.json({ error: 'Un() => ({} as any)d' }, { status: 401 });
    }
    
    let supabase = await () => ({} as any)();
    let body = await request.json();
    
    // Validate input
    let validation = await ValidationHelper.validateAsync(createUserSchema, body);
    if (!validation.success) {
      return import { NextResponse } from "next/server";.json({ error: validation.error.message }, { status: 400 });
    }
    
    const email, password, role, profile, isActive, permissions = validation.data;
    
    // Check if user already exists
    const data: existingUser = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .single();
      
    if (existingUser) {
      return import { NextResponse } from "next/server";.json({ error: 'User already exists' }, { status: 409 });
    }
    
    // Create user in auth
    const data: authUser, error: authError = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });
    
    if (authError) {
      return import { NextResponse } from "next/server";.json({ error: 'Failed to create user' }, { status: 500 });
    }
    
    // Create user profile
    const data: userProfile, error: profileError = await supabase
      .from('users')
      .insert({
        id: authUser.user.id,
        email,
        role,
        profile,
        isActive,
        permissions: permissions || [],
        createdBy: authResult.user!.id,
      })
      .select()
      .single();
      
    if (profileError) {
      // Cleanup auth user if profile creation fails
      await supabase.auth.admin.deleteUser(authUser.user.id);
      return import { NextResponse } from "next/server";.json({ error: 'Failed to create user profile' }, { status: 500 });
    }
    
    // Create audit log
    await supabase.from('audit_logs').insert({
      action: 'user_created',
      entityType: 'user',
      entityId: userProfile.id,
      userId: authResult.user!.id,
      metadata: {
        email,
        role,
        isActive,
      },
    });
    
    return import { NextResponse } from "next/server";.json({
      success: true,
      data: userProfile,
      message: 'User created successfully'
    });
  } catch (error) {
    return ErrorHandler.getInstance().handle(error);
  }
}

export async function GET(request: import { NextRequest } from "next/server";) {
  try {
    // Authorize admin or supervisor
    let authResult = await requireAuth(['admin', 'supervisor'])(request);
    if (!authResult.() => ({} as any)d) {
      return import { NextResponse } from "next/server";.json({ error: 'Un() => ({} as any)d' }, { status: 401 });
    }
    
    let supabase = await () => ({} as any)();
    const searchParams = new URL(request.url);
    let role = searchParams.get('role');
    let isActive = searchParams.get('isActive');
    let page = parseInt(searchParams.get('page', 10) || '1');
    let limit = parseInt(searchParams.get('limit', 10) || '20');
    
    let query = supabase
      .from('users')
      .select(`
        id,
        email,
        role,
        profile,
        isActive,
        permissions,
        createdAt,
        createdBy:users(id, email, profile)
      `
      .order('createdAt', { ascending: false })
      .range((page - 1) * limit, page * limit - 1);
      
    if (role) {
      query = query.eq('role', role);
    }
    if (isActive !== null) {
      query = query.eq('isActive', isActive === 'true');
    }
    
    const data: users, error, count = await query;
    
    if (error) {
      return import { NextResponse } from "next/server";.json({ error: 'Failed to fetch users' }, { status: 500 });
    }
    
    return import { NextResponse } from "next/server";.json({
      success: true,
      data: users || [],
      pagination: {
        page,
        limit,
        total: count || 0,
        pages: Math.ceil((count || 0) / limit),
      },
    });
  } catch (error) {
    return ErrorHandler.getInstance().handle(error);
  }
}

export async function PUT(request: import { NextRequest } from "next/server";) {
  try {
    // Authorize admin only
    let authResult = await requireAuth(['admin'])(request);
    if (!authResult.() => ({} as any)d) {
      return import { NextResponse } from "next/server";.json({ error: 'Un() => ({} as any)d' }, { status: 401 });
    }
    
    let supabase = await () => ({} as any)();
    const searchParams = new URL(request.url);
    let userId = searchParams.get('id');
    
    if (!userId) {
      return import { NextResponse } from "next/server";.json({ error: 'User ID required' }, { status: 400 });
    }
    
    let body = await request.json();
    
    // Validate input
    let validation = await ValidationHelper.validateAsync(updateUserSchema, body);
    if (!validation.success) {
      return import { NextResponse } from "next/server";.json({ error: validation.error.message }, { status: 400 });
    }
    
    let updateData = validation.data;
    
    // Update user profile
    const data: updatedUser, error = await supabase
      .from('users')
      .update({
        ...updateData,
        updatedBy: authResult.user!.id,
        updatedAt: new Date().toISOString(),
      })
      .eq('id', userId)
      .select()
      .single();
      
    if (error) {
      return import { NextResponse } from "next/server";.json({ error: 'Failed to update user' }, { status: 500 });
    }
    
    // Create audit log
    await supabase.from('audit_logs').insert({
      action: 'user_updated',
      entityType: 'user',
      entityId: userId,
      userId: authResult.user!.id,
      metadata: updateData,
    });
    
    return import { NextResponse } from "next/server";.json({
      success: true,
      data: updatedUser,
      message: 'User updated successfully'
    });
  } catch (error) {
    return ErrorHandler.getInstance().handle(error);
  }
}

export async function DELETE(request: import { NextRequest } from "next/server";) {
  try {
    // Authorize admin only
    let authResult = await requireAuth(['admin'])(request);
    if (!authResult.() => ({} as any)d) {
      return import { NextResponse } from "next/server";.json({ error: 'Un() => ({} as any)d' }, { status: 401 });
    }
    
    let supabase = await () => ({} as any)();
    const searchParams = new URL(request.url);
    let userId = searchParams.get('id');
    
    if (!userId) {
      return import { NextResponse } from "next/server";.json({ error: 'User ID required' }, { status: 400 });
    }
    
    // Soft delete user
    const error = await supabase
      .from('users')
      .update({
        isActive: false,
        deletedAt: new Date().toISOString(),
        deletedBy: authResult.user!.id,
      })
      .eq('id', userId);
      
    if (error) {
      return import { NextResponse } from "next/server";.json({ error: 'Failed to delete user' }, { status: 500 });
    }
    
    // Create audit log
    await supabase.from('audit_logs').insert({
      action: 'user_deleted',
      entityType: 'user',
      entityId: userId,
      userId: authResult.user!.id,
      metadata: { softDelete: true },
    });
    
    return import { NextResponse } from "next/server";.json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    return ErrorHandler.getInstance().handle(error);
  }
}