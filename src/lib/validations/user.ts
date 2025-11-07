/**
 * User Validation Schemas - Zod
 * مخططات التحقق من المستخدم - Zod
 *
 * All user-related validation schemas
 */

import { z } from 'zod';
import { MESSAGES } from '../constants/messages';
import { CONFIG } from '../constants/config';

// User Profile Schema
export const userProfileSchema = z.object({
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
  phone: z
    .string()
    .max(CONFIG.PHONE_MAX_LENGTH, MESSAGES.ERROR.INVALID_PHONE)
    .optional(),
  avatar: z.string().url().optional().or(z.literal('')),
});

// Update User Schema
export const updateUserSchema = z.object({
  name: z
    .string()
    .min(CONFIG.NAME_MIN_LENGTH)
    .max(CONFIG.NAME_MAX_LENGTH)
    .optional(),
  email: z.string().email().max(CONFIG.EMAIL_MAX_LENGTH).optional(),
  phone: z.string().max(CONFIG.PHONE_MAX_LENGTH).optional(),
  role: z
    .enum(['admin', 'doctor', 'patient', 'staff', 'supervisor'])
    .optional(),
  status: z.enum(['active', 'inactive', 'blocked']).optional(),
});

// Create User Schema
export const createUserSchema = z.object({
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
  phone: z.string().max(CONFIG.PHONE_MAX_LENGTH).optional(),
  role: z
    .enum(['admin', 'doctor', 'patient', 'staff', 'supervisor'])
    .default('patient'),
});

// Type exports
export type UserProfileInput = z.infer<typeof userProfileSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
export type CreateUserInput = z.infer<typeof createUserSchema>;
