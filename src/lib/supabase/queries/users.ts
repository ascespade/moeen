/**
 * Users Queries - Centralized User Queries
 * استعلامات المستخدمين - الاستعلامات المركزية
 *
 * All user-related database queries
 */

import { cache } from 'react';
import { createClient } from '../server';
import type { User, UserInsert, UserUpdate } from '@/types/database.types';

/**
 * Get all users
 * Uses cache() for request deduplication
 */
export const getUsers = cache(async (): Promise<User[]> => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(`Failed to fetch users: ${error.message}`);
  }

  return data || [];
});

/**
 * Get user by ID
 */
export const getUserById = cache(async (id: string): Promise<User | null> => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      // No rows returned
      return null;
    }
    throw new Error(`Failed to fetch user: ${error.message}`);
  }

  return data;
});

/**
 * Get user by email
 */
export const getUserByEmail = cache(
  async (email: string): Promise<User | null> => {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null;
      }
      throw new Error(`Failed to fetch user: ${error.message}`);
    }

    return data;
  }
);

/**
 * Get users by role
 */
export const getUsersByRole = cache(async (role: string): Promise<User[]> => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('role', role)
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(`Failed to fetch users: ${error.message}`);
  }

  return data || [];
});

/**
 * Get active users
 */
export const getActiveUsers = cache(async (): Promise<User[]> => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('status', 'active')
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(`Failed to fetch active users: ${error.message}`);
  }

  return data || [];
});
