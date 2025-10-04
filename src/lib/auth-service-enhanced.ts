// Enhanced Authentication Service - نظام مصادقة محسن
// Muayin Assistant - Smart Methodology Implementation

import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const jwtSecret = process.env.JWT_SECRET || 'muayin-secret-key-2024';

const supabase = createClient(supabaseUrl, supabaseKey);

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'manager' | 'supervisor' | 'agent' | 'demo';
  status: 'active' | 'inactive' | 'suspended' | 'pending';
  phone?: string;
  avatar_url?: string;
  timezone: string;
  language: string;
  is_active: boolean;
  last_login?: string;
  login_count: number;
  preferences: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface LoginResult {
  success: boolean;
  user?: User;
  token?: string;
  error?: string;
}

export interface RegisterResult {
  success: boolean;
  user?: User;
  error?: string;
}

class EnhancedAuthService {
  // Login with enhanced security
  async login(email: string, password: string): Promise<LoginResult> {
    try {
      // Get user from database
      const { data: user, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .eq('is_active', true)
        .single();

      if (error || !user) {
        return {
          success: false,
          error: 'البريد الإلكتروني أو كلمة المرور غير صحيحة'
        };
      }

      // Check if user is locked
      if (user.locked_until && new Date(user.locked_until) > new Date()) {
        return {
          success: false,
          error: 'تم حظر الحساب مؤقتاً. يرجى المحاولة لاحقاً'
        };
      }

      // Verify password
      const isValidPassword = await bcrypt.compare(password, user.password_hash);
      if (!isValidPassword) {
        // Increment failed login attempts
        await this.incrementFailedLoginAttempts(user.id);
        return {
          success: false,
          error: 'البريد الإلكتروني أو كلمة المرور غير صحيحة'
        };
      }

      // Reset failed login attempts
      await this.resetFailedLoginAttempts(user.id);

      // Update login info
      await this.updateLoginInfo(user.id);

      // Generate JWT token
      const token = jwt.sign(
        { 
          userId: user.id, 
          email: user.email, 
          role: user.role 
        },
        jwtSecret,
        { expiresIn: '24h' }
      );

      // Return user without password
      const { password_hash, ...userWithoutPassword } = user;

      return {
        success: true,
        user: userWithoutPassword as User,
        token
      };

    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        error: 'حدث خطأ في الخادم'
      };
    }
  }

  // Register new user
  async register(userData: {
    email: string;
    password: string;
    name: string;
    role?: string;
    phone?: string;
  }): Promise<RegisterResult> {
    try {
      // Check if user already exists
      const { data: existingUser } = await supabase
        .from('users')
        .select('id')
        .eq('email', userData.email)
        .single();

      if (existingUser) {
        return {
          success: false,
          error: 'البريد الإلكتروني مستخدم بالفعل'
        };
      }

      // Hash password
      const passwordHash = await bcrypt.hash(userData.password, 12);

      // Create user
      const { data: newUser, error } = await supabase
        .from('users')
        .insert({
          email: userData.email,
          password_hash: passwordHash,
          name: userData.name,
          role: userData.role || 'agent',
          phone: userData.phone,
          preferences: {
            theme: 'light',
            language: 'ar'
          }
        })
        .select()
        .single();

      if (error) {
        return {
          success: false,
          error: 'فشل في إنشاء الحساب'
        };
      }

      // Return user without password
      const { password_hash, ...userWithoutPassword } = newUser;

      return {
        success: true,
        user: userWithoutPassword as User
      };

    } catch (error) {
      console.error('Register error:', error);
      return {
        success: false,
        error: 'حدث خطأ في الخادم'
      };
    }
  }

  // Verify JWT token
  async verifyToken(token: string): Promise<{ valid: boolean; user?: User; error?: string }> {
    try {
      const decoded = jwt.verify(token, jwtSecret) as any;
      
      // Get user from database
      const { data: user, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', decoded.userId)
        .eq('is_active', true)
        .single();

      if (error || !user) {
        return { valid: false, error: 'المستخدم غير موجود' };
      }

      const { password_hash, ...userWithoutPassword } = user;
      return { valid: true, user: userWithoutPassword as User };

    } catch (error) {
      return { valid: false, error: 'رمز غير صحيح' };
    }
  }

  // Get user by ID
  async getUserById(userId: string): Promise<User | null> {
    try {
      const { data: user, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .eq('is_active', true)
        .single();

      if (error || !user) return null;

      const { password_hash, ...userWithoutPassword } = user;
      return userWithoutPassword as User;

    } catch (error) {
      console.error('Get user error:', error);
      return null;
    }
  }

  // Update user profile
  async updateProfile(userId: string, updates: Partial<User>): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase
        .from('users')
        .update(updates)
        .eq('id', userId);

      if (error) {
        return { success: false, error: 'فشل في تحديث الملف الشخصي' };
      }

      return { success: true };

    } catch (error) {
      console.error('Update profile error:', error);
      return { success: false, error: 'حدث خطأ في الخادم' };
    }
  }

  // Change password
  async changePassword(userId: string, currentPassword: string, newPassword: string): Promise<{ success: boolean; error?: string }> {
    try {
      // Get current user
      const { data: user, error } = await supabase
        .from('users')
        .select('password_hash')
        .eq('id', userId)
        .single();

      if (error || !user) {
        return { success: false, error: 'المستخدم غير موجود' };
      }

      // Verify current password
      const isValidPassword = await bcrypt.compare(currentPassword, user.password_hash);
      if (!isValidPassword) {
        return { success: false, error: 'كلمة المرور الحالية غير صحيحة' };
      }

      // Hash new password
      const newPasswordHash = await bcrypt.hash(newPassword, 12);

      // Update password
      const { error: updateError } = await supabase
        .from('users')
        .update({ password_hash: newPasswordHash })
        .eq('id', userId);

      if (updateError) {
        return { success: false, error: 'فشل في تحديث كلمة المرور' };
      }

      return { success: true };

    } catch (error) {
      console.error('Change password error:', error);
      return { success: false, error: 'حدث خطأ في الخادم' };
    }
  }

  // Private helper methods
  private async incrementFailedLoginAttempts(userId: string): Promise<void> {
    try {
      await supabase
        .from('users')
        .update({
          failed_login_attempts: supabase.raw('failed_login_attempts + 1'),
          locked_until: supabase.raw('CASE WHEN failed_login_attempts >= 4 THEN NOW() + INTERVAL \'15 minutes\' ELSE locked_until END')
        })
        .eq('id', userId);
    } catch (error) {
      console.error('Increment failed login attempts error:', error);
    }
  }

  private async resetFailedLoginAttempts(userId: string): Promise<void> {
    try {
      await supabase
        .from('users')
        .update({
          failed_login_attempts: 0,
          locked_until: null
        })
        .eq('id', userId);
    } catch (error) {
      console.error('Reset failed login attempts error:', error);
    }
  }

  private async updateLoginInfo(userId: string): Promise<void> {
    try {
      await supabase
        .from('users')
        .update({
          last_login: new Date().toISOString(),
          login_count: supabase.raw('login_count + 1')
        })
        .eq('id', userId);
    } catch (error) {
      console.error('Update login info error:', error);
    }
  }
}

export const enhancedAuthService = new EnhancedAuthService();


