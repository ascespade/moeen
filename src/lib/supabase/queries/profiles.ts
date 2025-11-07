/**
 * Profiles Queries - Centralized Profile Queries
 * استعلامات الملفات الشخصية - الاستعلامات المركزية
 *
 * All profile-related database queries
 */

import { cache } from 'react';
import { createClient } from '../server';
import type {
  Profile,
  ProfileInsert,
  ProfileUpdate,
} from '@/types/database.types';

/**
 * Get profile by user ID
 */
export const getProfileByUserId = cache(
  async (userId: string): Promise<Profile | null> => {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null;
      }
      throw new Error(`Failed to fetch profile: ${error.message}`);
    }

    return data;
  }
);

/**
 * Get profile by ID
 */
export const getProfileById = cache(
  async (id: string): Promise<Profile | null> => {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null;
      }
      throw new Error(`Failed to fetch profile: ${error.message}`);
    }

    return data;
  }
);

/**
 * Get user with profile
 */
export const getUserWithProfile = cache(async (userId: string) => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('users')
    .select('*, profiles(*)')
    .eq('id', userId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return null;
    }
    throw new Error(`Failed to fetch user with profile: ${error.message}`);
  }

  return data;
});
