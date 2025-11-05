/**
 * Settings Actions - Server Actions for Settings Management
 * إجراءات الإعدادات - Server Actions لإدارة الإعدادات
 * 
 * All settings-related server actions
 */

'use server';

import { revalidatePath } from 'next/cache';
import { createAdminClient } from '@/lib/supabase/admin';
import { withAction } from '@/lib/auth/with-action';
import {
  generalSettingsSchema,
  appearanceSettingsSchema,
  notificationSettingsSchema,
  securitySettingsSchema,
} from '@/lib/validations';
import { handleServerActionError } from '@/lib/errors';
import { AppError } from '@/lib/errors';
import type { Setting, SettingInsert, SettingUpdate } from '@/types/database.types';
import type { Json } from '@/types/database.types';

/**
 * Update general settings action
 */
export const updateGeneralSettingsAction = withAction(
  async (user, input: unknown) => {
    const validated = generalSettingsSchema.parse(input);
    const adminClient = createAdminClient();

    // Update user record
    const { error: userError } = await adminClient
      .from('users')
      .update({
        name: validated.name,
        email: validated.email,
        phone: validated.phone || null,
      })
      .eq('id', user.id);

    if (userError) {
      throw AppError.internal(`فشل تحديث الإعدادات: ${userError.message}`);
    }

    // Update profile if exists
    const { error: profileError } = await adminClient
      .from('profiles')
      .upsert({
        user_id: user.id,
        language: validated.language,
        timezone: validated.timezone || null,
      });

    if (profileError) {
      throw AppError.internal(`فشل تحديث الملف الشخصي: ${profileError.message}`);
    }

    revalidatePath('/settings');
    return { success: true };
  },
  {
    requireAuth: true,
  }
);

/**
 * Update appearance settings action
 */
export const updateAppearanceSettingsAction = withAction(
  async (user, input: unknown) => {
    const validated = appearanceSettingsSchema.parse(input);
    const adminClient = createAdminClient();

    const { error } = await adminClient
      .from('settings')
      .upsert({
        user_id: user.id,
        key: 'appearance',
        value: validated as Json,
      } as SettingInsert);

    if (error) {
      throw AppError.internal(`فشل تحديث إعدادات المظهر: ${error.message}`);
    }

    revalidatePath('/settings');
    return { success: true };
  },
  {
    requireAuth: true,
  }
);

/**
 * Update notification settings action
 */
export const updateNotificationSettingsAction = withAction(
  async (user, input: unknown) => {
    const validated = notificationSettingsSchema.parse(input);
    const adminClient = createAdminClient();

    const { error } = await adminClient
      .from('settings')
      .upsert({
        user_id: user.id,
        key: 'notifications',
        value: validated as Json,
      } as SettingInsert);

    if (error) {
      throw AppError.internal(`فشل تحديث إعدادات الإشعارات: ${error.message}`);
    }

    revalidatePath('/settings');
    return { success: true };
  },
  {
    requireAuth: true,
  }
);

/**
 * Update security settings action
 */
export const updateSecuritySettingsAction = withAction(
  async (user, input: unknown) => {
    const validated = securitySettingsSchema.parse(input);
    const adminClient = createAdminClient();

    const { error } = await adminClient
      .from('settings')
      .upsert({
        user_id: user.id,
        key: 'security',
        value: validated as Json,
      } as SettingInsert);

    if (error) {
      throw AppError.internal(`فشل تحديث إعدادات الأمان: ${error.message}`);
    }

    revalidatePath('/settings');
    return { success: true };
  },
  {
    requireAuth: true,
  }
);
