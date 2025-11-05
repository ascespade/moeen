/**
 * User Service - Business Logic for Users
 * خدمة المستخدمين - منطق الأعمال للمستخدمين
 * 
 * Business logic layer for user operations
 */

import { createAdminClient } from '../supabase/admin';
import { AppError } from '../errors';
import type { User, UserInsert, UserUpdate } from '@/types/database.types';

/**
 * User Service Class
 */
export class UserService {
  /**
   * Create user
   */
  static async createUser(data: UserInsert): Promise<User> {
    const adminClient = createAdminClient();
    const { data: user, error } = await adminClient
      .from('users')
      .insert(data)
      .select()
      .single();

    if (error) {
      throw AppError.internal(`Failed to create user: ${error.message}`);
    }

    if (!user) {
      throw AppError.internal('Failed to create user: No data returned');
    }

    return user;
  }

  /**
   * Update user
   */
  static async updateUser(id: string, data: UserUpdate): Promise<User> {
    const adminClient = createAdminClient();
    const { data: user, error } = await adminClient
      .from('users')
      .update(data)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw AppError.internal(`Failed to update user: ${error.message}`);
    }

    if (!user) {
      throw AppError.notFound('User not found');
    }

    return user;
  }

  /**
   * Delete user
   */
  static async deleteUser(id: string): Promise<void> {
    const adminClient = createAdminClient();
    const { error } = await adminClient
      .from('users')
      .delete()
      .eq('id', id);

    if (error) {
      throw AppError.internal(`Failed to delete user: ${error.message}`);
    }
  }

  /**
   * Get user by ID
   */
  static async getUserById(id: string): Promise<User | null> {
    const adminClient = createAdminClient();
    const { data, error } = await adminClient
      .from('users')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null;
      }
      throw AppError.internal(`Failed to fetch user: ${error.message}`);
    }

    return data;
  }

  /**
   * Get user by email
   */
  static async getUserByEmail(email: string): Promise<User | null> {
    const adminClient = createAdminClient();
    const { data, error } = await adminClient
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null;
      }
      throw AppError.internal(`Failed to fetch user: ${error.message}`);
    }

    return data;
  }

  /**
   * Get users by role
   */
  static async getUsersByRole(role: string): Promise<User[]> {
    const adminClient = createAdminClient();
    const { data, error } = await adminClient
      .from('users')
      .select('*')
      .eq('role', role)
      .order('created_at', { ascending: false });

    if (error) {
      throw AppError.internal(`Failed to fetch users: ${error.message}`);
    }

    return data || [];
  }
}
