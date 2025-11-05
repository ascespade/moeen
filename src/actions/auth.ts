/**
 * Auth Actions - Server Actions for Authentication
 * إجراءات المصادقة - Server Actions للمصادقة
 * 
 * All authentication-related server actions
 */

'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { loginSchema, registerSchema, resetPasswordSchema, forgotPasswordSchema } from '@/lib/validations';
import { handleServerActionError } from '@/lib/errors';
import { AppError } from '@/lib/errors';
import { ROUTES } from '@/lib/constants';

/**
 * Login action
 */
export async function loginAction(input: { email: string; password: string }) {
  try {
    // Validate input
    const validated = loginSchema.parse(input);

    const supabase = await createClient();
    const { data, error } = await supabase.auth.signInWithPassword({
      email: validated.email,
      password: validated.password,
    });

    if (error) {
      throw AppError.unauthorized('فشل تسجيل الدخول. يرجى التحقق من البيانات');
    }

    if (!data.user) {
      throw AppError.unauthorized('فشل تسجيل الدخول');
    }

    revalidatePath(ROUTES.DASHBOARD);
    return { success: true, data: { user: data.user } };
  } catch (error) {
    return handleServerActionError(error);
  }
}

/**
 * Register action
 */
export async function registerAction(input: {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  agreeToTerms: boolean;
}) {
  try {
    // Validate input
    const validated = registerSchema.parse(input);

    const supabase = await createClient();
    
    // Sign up user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: validated.email,
      password: validated.password,
    });

    if (authError) {
      throw AppError.badRequest(`فشل إنشاء الحساب: ${authError.message}`);
    }

    if (!authData.user) {
      throw AppError.badRequest('فشل إنشاء الحساب');
    }

    // Create user record in users table
    const adminClient = createAdminClient();
    const { error: userError } = await adminClient
      .from('users')
      .insert({
        id: authData.user.id,
        email: validated.email,
        name: validated.name,
        role: 'user',
        status: 'active',
      });

    if (userError) {
      throw AppError.internal(`فشل إنشاء سجل المستخدم: ${userError.message}`);
    }

    revalidatePath(ROUTES.AUTH.LOGIN);
    return { success: true, data: { user: authData.user } };
  } catch (error) {
    return handleServerActionError(error);
  }
}

/**
 * Logout action
 */
export async function logoutAction() {
  try {
    const supabase = await createClient();
    const { error } = await supabase.auth.signOut();

    if (error) {
      throw AppError.internal(`فشل تسجيل الخروج: ${error.message}`);
    }

    revalidatePath(ROUTES.HOME);
    return { success: true };
  } catch (error) {
    return handleServerActionError(error);
  }
}

/**
 * Forgot password action
 */
export async function forgotPasswordAction(input: { email: string }) {
  try {
    const validated = forgotPasswordSchema.parse(input);

    const supabase = await createClient();
    const { error } = await supabase.auth.resetPasswordForEmail(validated.email, {
      redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}${ROUTES.AUTH.RESET_PASSWORD}`,
    });

    if (error) {
      throw AppError.internal(`فشل إرسال رابط إعادة تعيين كلمة المرور: ${error.message}`);
    }

    return { success: true };
  } catch (error) {
    return handleServerActionError(error);
  }
}

/**
 * Reset password action
 */
export async function resetPasswordAction(input: { password: string; confirmPassword: string }) {
  try {
    const validated = resetPasswordSchema.parse(input);

    const supabase = await createClient();
    const { error } = await supabase.auth.updateUser({
      password: validated.password,
    });

    if (error) {
      throw AppError.internal(`فشل إعادة تعيين كلمة المرور: ${error.message}`);
    }

    revalidatePath(ROUTES.AUTH.LOGIN);
    return { success: true };
  } catch (error) {
    return handleServerActionError(error);
  }
}

/**
 * Verify email action
 */
export async function verifyEmailAction(token: string) {
  try {
    const supabase = await createClient();
    const { error } = await supabase.auth.verifyOtp({
      token_hash: token,
      type: 'email',
    });

    if (error) {
      throw AppError.badRequest(`فشل التحقق من البريد الإلكتروني: ${error.message}`);
    }

    revalidatePath(ROUTES.AUTH.LOGIN);
    return { success: true };
  } catch (error) {
    return handleServerActionError(error);
  }
}
