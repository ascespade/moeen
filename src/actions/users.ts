/**
 * Users Actions - Server Actions for User Management
 * إجراءات المستخدمين - Server Actions لإدارة المستخدمين
 * 
 * All user-related server actions
 */

'use server';

import { revalidatePath } from 'next/cache';
import { createAdminClient } from '@/lib/supabase/admin';
import { withAction } from '@/lib/auth/with-action';
import { createUserSchema, updateUserSchema, userProfileSchema } from '@/lib/validations';
import { AppError } from '@/lib/errors';
import { PERMISSIONS } from '@/lib/constants';
import type { UserInsert, UserUpdate } from '@/types/database.types';

/**
 * Create user action
 */
export const createUserAction = withAction(
  async (_user, input: unknown) => {
    const validated = createUserSchema.parse(input);
    const adminClient = createAdminClient();

    const { data, error } = await adminClient
      .from('users')
      .insert({
        email: validated.email,
        name: validated.name,
        phone: validated.phone,
        role: validated.role,
        status: 'active',
      } as UserInsert)
      .select()
      .single();

    if (error) {
      throw AppError.internal(`فشل إنشاء المستخدم: ${error.message}`);
    }

    revalidatePath('/admin/users');
    return data;
  },
  {
    requireAuth: true,
    requirePermission: PERMISSIONS.USERS_CREATE,
  }
);

/**
 * Update user action
 */
export const updateUserAction = withAction(
  async (_user, input: { id: string; data: unknown }) => {
    const validated = updateUserSchema.parse(input.data);
    const adminClient = createAdminClient();

    const { data, error } = await adminClient
      .from('users')
      .update(validated as UserUpdate)
      .eq('id', input.id)
      .select()
      .single();

    if (error) {
      throw AppError.internal(`فشل تحديث المستخدم: ${error.message}`);
    }

    revalidatePath('/admin/users');
    revalidatePath(`/admin/users/${input.id}`);
    return data;
  },
  {
    requireAuth: true,
    requirePermission: PERMISSIONS.USERS_UPDATE,
  }
);

/**
 * Delete user action
 */
export const deleteUserAction = withAction(
  async (_user, userId: string) => {
    const adminClient = createAdminClient();

    const { error } = await adminClient
      .from('users')
      .delete()
      .eq('id', userId);

    if (error) {
      throw AppError.internal(`فشل حذف المستخدم: ${error.message}`);
    }

    revalidatePath('/admin/users');
    return { success: true };
  },
  {
    requireAuth: true,
    requirePermission: PERMISSIONS.USERS_DELETE,
  }
);

/**
 * Update user profile action
 */
export const updateUserProfileAction = withAction(
  async (user, input: unknown) => {
    const validated = userProfileSchema.parse(input);
    const adminClient = createAdminClient();

    const { data, error } = await adminClient
      .from('users')
      .update({
        name: validated.name,
        email: validated.email,
        phone: validated.phone,
        avatar_url: validated.avatar || null,
      })
      .eq('id', user.id)
      .select()
      .single();

    if (error) {
      throw AppError.internal(`فشل تحديث الملف الشخصي: ${error.message}`);
    }

    revalidatePath('/profile');
    return data;
  },
  {
    requireAuth: true,
  }
);
