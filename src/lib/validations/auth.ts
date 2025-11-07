/**
 * Auth Validation Schemas - Zod
 * مخططات التحقق من المصادقة - Zod
 *
 * All authentication validation schemas
 */

import { z } from 'zod';
import { MESSAGES } from '../constants/messages';
import { CONFIG } from '../constants/config';

// Login Schema
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, MESSAGES.ERROR.REQUIRED_FIELD)
    .email(MESSAGES.ERROR.INVALID_EMAIL)
    .max(CONFIG.EMAIL_MAX_LENGTH),
  password: z
    .string()
    .min(CONFIG.PASSWORD_MIN_LENGTH, MESSAGES.ERROR.INVALID_PASSWORD)
    .max(CONFIG.PASSWORD_MAX_LENGTH),
});

// Register Schema
export const registerSchema = z
  .object({
    name: z
      .string()
      .min(
        CONFIG.NAME_MIN_LENGTH,
        MESSAGES.VALIDATION.MIN_LENGTH('الاسم', CONFIG.NAME_MIN_LENGTH)
      )
      .max(
        CONFIG.NAME_MAX_LENGTH,
        MESSAGES.VALIDATION.MAX_LENGTH('الاسم', CONFIG.NAME_MAX_LENGTH)
      ),
    email: z
      .string()
      .min(1, MESSAGES.ERROR.REQUIRED_FIELD)
      .email(MESSAGES.ERROR.INVALID_EMAIL)
      .max(CONFIG.EMAIL_MAX_LENGTH),
    password: z
      .string()
      .min(CONFIG.PASSWORD_MIN_LENGTH, MESSAGES.ERROR.INVALID_PASSWORD)
      .max(CONFIG.PASSWORD_MAX_LENGTH),
    confirmPassword: z.string().min(1, MESSAGES.ERROR.REQUIRED_FIELD),
    agreeToTerms: z.boolean().refine(val => val === true, {
      message: 'يجب الموافقة على الشروط والأحكام',
    }),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: MESSAGES.ERROR.PASSWORD_MISMATCH,
    path: ['confirmPassword'],
  });

// Forgot Password Schema
export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, MESSAGES.ERROR.REQUIRED_FIELD)
    .email(MESSAGES.ERROR.INVALID_EMAIL)
    .max(CONFIG.EMAIL_MAX_LENGTH),
});

// Reset Password Schema
export const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(CONFIG.PASSWORD_MIN_LENGTH, MESSAGES.ERROR.INVALID_PASSWORD)
      .max(CONFIG.PASSWORD_MAX_LENGTH),
    confirmPassword: z.string().min(1, MESSAGES.ERROR.REQUIRED_FIELD),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: MESSAGES.ERROR.PASSWORD_MISMATCH,
    path: ['confirmPassword'],
  });

// Verify Email Schema
export const verifyEmailSchema = z.object({
  token: z.string().min(1, 'رمز التحقق مطلوب'),
});

// Change Password Schema
export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, MESSAGES.ERROR.REQUIRED_FIELD),
    newPassword: z
      .string()
      .min(CONFIG.PASSWORD_MIN_LENGTH, MESSAGES.ERROR.INVALID_PASSWORD)
      .max(CONFIG.PASSWORD_MAX_LENGTH),
    confirmPassword: z.string().min(1, MESSAGES.ERROR.REQUIRED_FIELD),
  })
  .refine(data => data.newPassword === data.confirmPassword, {
    message: MESSAGES.ERROR.PASSWORD_MISMATCH,
    path: ['confirmPassword'],
  });

// Type exports
export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
export type VerifyEmailInput = z.infer<typeof verifyEmailSchema>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
