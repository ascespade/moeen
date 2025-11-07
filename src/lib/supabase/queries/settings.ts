/**
 * Settings Queries - Centralized Settings Queries
 * استعلامات الإعدادات - الاستعلامات المركزية
 *
 * All settings-related database queries
 */

import { cache } from 'react';
import { createClient } from '../server';
import type {
  Setting,
  SettingInsert,
  SettingUpdate,
} from '@/types/database.types';
import type { Json } from '@/types/database.types';

/**
 * Get settings by user ID
 */
export const getSettingsByUserId = cache(
  async (userId: string): Promise<Setting[]> => {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('settings')
      .select('*')
      .eq('user_id', userId)
      .order('key', { ascending: true });

    if (error) {
      throw new Error(`Failed to fetch settings: ${error.message}`);
    }

    return data || [];
  }
);

/**
 * Get setting by key
 */
export const getSettingByKey = cache(
  async (userId: string, key: string): Promise<Setting | null> => {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('settings')
      .select('*')
      .eq('user_id', userId)
      .eq('key', key)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null;
      }
      throw new Error(`Failed to fetch setting: ${error.message}`);
    }

    return data;
  }
);

/**
 * Get setting value
 */
export const getSettingValue = cache(
  async <T = Json>(userId: string, key: string): Promise<T | null> => {
    const setting = await getSettingByKey(userId, key);
    return (setting?.value as T) || null;
  }
);
