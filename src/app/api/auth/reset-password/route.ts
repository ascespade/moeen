/**
 * Reset Password API - إعادة تعيين كلمة المرور
 * Real Supabase password update - no mocks
 */

import { logger } from '@/lib/logger';
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { z } from 'zod';
import { ErrorHandler } from '@/core/errors';

const resetPasswordSchema = z
  .object({
    password: z.string().min(6, 'كلمة المرور يجب أن تكون 6 أحرف على الأقل'),
    confirmPassword: z.string(),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: 'كلمة المرور غير متطابقة',
    path: ['confirmPassword'],
  });

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input
    const validation = resetPasswordSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          errors: validation.error.issues.map(err => ({
            field: err.path[0],
            message: err.message,
          })),
        },
        { status: 400 }
      );
    }

    const { password } = validation.data;
    const supabase = await createClient();

    // Get current user (must be authenticated via reset token)
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json(
        {
          success: false,
          error: 'غير مصرح. الرجاء استخدام رابط إعادة التعيين الصحيح.',
        },
        { status: 401 }
      );
    }

    // Update password
    const { error: updateError } = await supabase.auth.updateUser({
      password,
    });

    if (updateError) {
      logger.error('Password update error', updateError);
      return NextResponse.json(
        {
          success: false,
          error: 'فشل تحديث كلمة المرور. حاول مرة أخرى.',
        },
        { status: 500 }
      );
    }

    // Update last_password_change in users table
    await supabase
      .from('users')
      .update({
        last_password_change: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('id', user.id);

    // Create audit log
    try {
      await supabase.from('audit_logs').insert({
        user_id: user.id,
        action: 'password_reset_completed',
        resource_type: 'user',
        resource_id: user.id,
        new_values: {
          reset_at: new Date().toISOString(),
        },
      });
    } catch (auditError) {
      logger.warn('Audit log error (non-critical)', { error: auditError });
    }

    return NextResponse.json({
      success: true,
      message: 'تم تحديث كلمة المرور بنجاح',
    });
  } catch (error) {
    logger.error('Reset password error', error);
    return ErrorHandler.getInstance().handle(error as Error);
  }
}
