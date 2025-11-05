/**
 * Auth Service - Business Logic for Authentication
 * خدمة المصادقة - منطق الأعمال للمصادقة
 * 
 * Business logic layer for authentication operations
 */

import { createClient } from '../supabase/server';
import { createAdminClient } from '../supabase/admin';
import { AppError } from '../errors';
import type { User, UserInsert } from '@/types/database.types';

/**
 * Auth Service Class
 */
export class AuthService {
  /**
   * Sign up new user
   */
  static async signUp(email: string, password: string, name: string): Promise<{ user: User }> {
    const supabase = await createClient();
    
    // Sign up with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError) {
      throw AppError.badRequest(`Failed to sign up: ${authError.message}`);
    }

    if (!authData.user) {
      throw AppError.badRequest('Failed to sign up: No user returned');
    }

    // Create user record in users table
    const adminClient = createAdminClient();
    const { error: userError } = await adminClient
      .from('users')
      .insert({
        id: authData.user.id,
        email,
        name,
        role: 'user',
        status: 'active',
      } as UserInsert);

    if (userError) {
      throw AppError.internal(`Failed to create user record: ${userError.message}`);
    }

    // Fetch created user
    const { data: user, error: fetchError } = await adminClient
      .from('users')
      .select('*')
      .eq('id', authData.user.id)
      .single();

    if (fetchError || !user) {
      throw AppError.internal('Failed to fetch created user');
    }

    return { user };
  }

  /**
   * Sign in user
   */
  static async signIn(email: string, password: string): Promise<{ user: User }> {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      throw AppError.unauthorized(`Failed to sign in: ${error.message}`);
    }

    if (!data.user) {
      throw AppError.unauthorized('Failed to sign in: No user returned');
    }

    // Fetch user from users table
    const adminClient = createAdminClient();
    const { data: user, error: userError } = await adminClient
      .from('users')
      .select('*')
      .eq('id', data.user.id)
      .single();

    if (userError || !user) {
      throw AppError.unauthorized('User not found');
    }

    return { user };
  }

  /**
   * Sign out user
   */
  static async signOut(): Promise<void> {
    const supabase = await createClient();
    const { error } = await supabase.auth.signOut();

    if (error) {
      throw AppError.internal(`Failed to sign out: ${error.message}`);
    }
  }

  /**
   * Reset password
   */
  static async resetPassword(email: string): Promise<void> {
    const supabase = await createClient();
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/reset-password`,
    });

    if (error) {
      throw AppError.internal(`Failed to send password reset email: ${error.message}`);
    }
  }

  /**
   * Update password
   */
  static async updatePassword(newPassword: string): Promise<void> {
    const supabase = await createClient();
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) {
      throw AppError.internal(`Failed to update password: ${error.message}`);
    }
  }
}
