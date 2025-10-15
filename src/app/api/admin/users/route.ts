/**
 * Admin User Management API - إدارة المستخدمين
 * Manage users, roles, and system configuration
 */

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';
import { ValidationHelper } from '@/core/validation';
import { ErrorHandler } from '@/core/errors';
import { authorize } from '@/middleware/authorize';

const createUserSchema = z.object({
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

const updateUserSchema = z.object({
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

export async function POST(request: NextRequest) {
  try {
    // Authorize admin only
    const authResult = await authorize(['admin'])(request);
    if (!authResult.success) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabase = createClient();
    const body = await request.json();

    // Validate input
    const validation = await ValidationHelper.validateAsync(createUserSchema, body);
    if (!validation.success) {
      return NextResponse.json({ error: validation.error.message }, { status: 400 });
    }

    const { email, password, role, profile, isActive, permissions } = validation.data;

    // Check if user already exists
    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .single();

    if (existingUser) {
      return NextResponse.json({ error: 'User already exists' }, { status: 409 });
    }

    // Create user account
    const { data: user, error: userError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });

    if (userError) {
      return NextResponse.json({ error: 'Failed to create user account' }, { status: 500 });
    }

    // Create user profile
    const { data: userProfile, error: profileError } = await supabase
      .from('users')
      .insert({
        id: user.user.id,
        email,
        role,
        profile,
        isActive,
        permissions: permissions || [],
        createdBy: authResult.user.id,
      })
      .select()
      .single();

    if (profileError) {
      // Clean up auth user if profile creation fails
      await supabase.auth.admin.deleteUser(user.user.id);
      return NextResponse.json({ error: 'Failed to create user profile' }, { status: 500 });
    }

    // Create role-specific profile
    if (role === 'patient') {
      await createPatientProfile(user.user.id, profile);
    } else if (role === 'doctor') {
      await createDoctorProfile(user.user.id, profile);
    }

    // Create audit log
    await supabase.from('audit_logs').insert({
      action: 'user_created',
      entityType: 'user',
      entityId: user.user.id,
      userId: authResult.user.id,
      metadata: {
        email,
        role,
        isActive,
      },
    });

    return NextResponse.json({
      success: true,
      data: userProfile,
      message: 'User created successfully'
    });

  } catch (error) {
    return ErrorHandler.handle(error);
  }
}

export async function GET(request: NextRequest) {
  try {
    // Authorize admin or supervisor
    const authResult = await authorize(['admin', 'supervisor'])(request);
    if (!authResult.success) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabase = createClient();
    const { searchParams } = new URL(request.url);
    const role = searchParams.get('role');
    const isActive = searchParams.get('isActive');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');

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
      `)
      .order('createdAt', { ascending: false })
      .range((page - 1) * limit, page * limit - 1);

    if (role) {
      query = query.eq('role', role);
    }
    if (isActive !== null) {
      query = query.eq('isActive', isActive === 'true');
    }

    const { data: users, error, count } = await query;

    if (error) {
      return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      data: users,
      pagination: {
        page,
        limit,
        total: count || 0,
        pages: Math.ceil((count || 0) / limit),
      },
    });

  } catch (error) {
    return ErrorHandler.handle(error);
  }
}

export async function PUT(request: NextRequest) {
  try {
    // Authorize admin only
    const authResult = await authorize(['admin'])(request);
    if (!authResult.success) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabase = createClient();
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    
    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 });
    }

    const body = await request.json();

    // Validate input
    const validation = await ValidationHelper.validateAsync(updateUserSchema, body);
    if (!validation.success) {
      return NextResponse.json({ error: validation.error.message }, { status: 400 });
    }

    const updateData = validation.data;

    // Update user profile
    const { data: updatedUser, error: updateError } = await supabase
      .from('users')
      .update({
        ...updateData,
        updatedBy: authResult.user.id,
        updatedAt: new Date().toISOString(),
      })
      .eq('id', userId)
      .select()
      .single();

    if (updateError) {
      return NextResponse.json({ error: 'Failed to update user' }, { status: 500 });
    }

    // Create audit log
    await supabase.from('audit_logs').insert({
      action: 'user_updated',
      entityType: 'user',
      entityId: userId,
      userId: authResult.user.id,
      metadata: updateData,
    });

    return NextResponse.json({
      success: true,
      data: updatedUser,
      message: 'User updated successfully'
    });

  } catch (error) {
    return ErrorHandler.handle(error);
  }
}

export async function DELETE(request: NextRequest) {
  try {
    // Authorize admin only
    const authResult = await authorize(['admin'])(request);
    if (!authResult.success) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabase = createClient();
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    
    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 });
    }

    // Prevent self-deletion
    if (userId === authResult.user.id) {
      return NextResponse.json({ error: 'Cannot delete your own account' }, { status: 400 });
    }

    // Soft delete user
    const { error: updateError } = await supabase
      .from('users')
      .update({
        isActive: false,
        deletedAt: new Date().toISOString(),
        deletedBy: authResult.user.id,
      })
      .eq('id', userId);

    if (updateError) {
      return NextResponse.json({ error: 'Failed to delete user' }, { status: 500 });
    }

    // Create audit log
    await supabase.from('audit_logs').insert({
      action: 'user_deleted',
      entityType: 'user',
      entityId: userId,
      userId: authResult.user.id,
      metadata: { softDelete: true },
    });

    return NextResponse.json({
      success: true,
      message: 'User deleted successfully'
    });

  } catch (error) {
    return ErrorHandler.handle(error);
  }
}

async function createPatientProfile(userId: string, profile: any) {
  const supabase = createClient();
  
  const { error } = await supabase
    .from('patients')
    .insert({
      userId,
      fullName: profile.fullName,
      phone: profile.phone,
      dateOfBirth: profile.dateOfBirth,
      address: profile.address,
      medicalRecordNumber: `MR${Date.now()}${Math.random().toString(36).substr(2, 4).toUpperCase()}`,
      isActivated: false,
    });

  return error;
}

async function createDoctorProfile(userId: string, profile: any) {
  const supabase = createClient();
  
  const { error } = await supabase
    .from('doctors')
    .insert({
      userId,
      fullName: profile.fullName,
      phone: profile.phone,
      speciality: 'General Practice', // Default speciality
      licenseNumber: `DR${Date.now()}${Math.random().toString(36).substr(2, 4).toUpperCase()}`,
      schedule: {
        0: { isWorking: false, startTime: '09:00', endTime: '17:00' }, // Sunday
        1: { isWorking: true, startTime: '09:00', endTime: '17:00' },  // Monday
        2: { isWorking: true, startTime: '09:00', endTime: '17:00' },  // Tuesday
        3: { isWorking: true, startTime: '09:00', endTime: '17:00' },  // Wednesday
        4: { isWorking: true, startTime: '09:00', endTime: '17:00' },  // Thursday
        5: { isWorking: true, startTime: '09:00', endTime: '17:00' },  // Friday
        6: { isWorking: false, startTime: '09:00', endTime: '17:00' }, // Saturday
      },
    });

  return error;
}