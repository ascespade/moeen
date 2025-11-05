/**
 * Settings Validation Schemas - Zod
 * مخططات التحقق من الإعدادات - Zod
 * 
 * All settings-related validation schemas
 */

import { z } from 'zod';
import { MESSAGES } from '../constants/messages';
import { CONFIG } from '../constants/config';

// General Settings Schema
export const generalSettingsSchema = z.object({
  name: z
    .string()
    .min(CONFIG.NAME_MIN_LENGTH, MESSAGES.VALIDATION.MIN_LENGTH('الاسم', CONFIG.NAME_MIN_LENGTH))
    .max(CONFIG.NAME_MAX_LENGTH, MESSAGES.VALIDATION.MAX_LENGTH('الاسم', CONFIG.NAME_MAX_LENGTH)),
  email: z
    .string()
    .email(MESSAGES.ERROR.INVALID_EMAIL)
    .max(CONFIG.EMAIL_MAX_LENGTH),
  phone: z.string().max(CONFIG.PHONE_MAX_LENGTH).optional(),
  language: z.enum(['ar', 'en']).default('ar'),
  timezone: z.string().optional(),
});

// Appearance Settings Schema
export const appearanceSettingsSchema = z.object({
  theme: z.enum(['light', 'dark', 'system']).default('light'),
  fontSize: z.enum(['small', 'medium', 'large']).default('medium'),
  rtl: z.boolean().default(true),
});

// Notification Settings Schema
export const notificationSettingsSchema = z.object({
  emailNotifications: z.boolean().default(true),
  pushNotifications: z.boolean().default(true),
  smsNotifications: z.boolean().default(false),
  appointmentReminders: z.boolean().default(true),
  appointmentReminderHours: z.number().min(1).max(48).default(24),
});

// Security Settings Schema
export const securitySettingsSchema = z.object({
  twoFactorEnabled: z.boolean().default(false),
  sessionTimeout: z.number().min(5).max(480).default(60),
});

// API Keys Settings Schema
export const apiKeysSettingsSchema = z.object({
  openaiKey: z.string().optional(),
  stripeKey: z.string().optional(),
  twilioKey: z.string().optional(),
});

// Type exports
export type GeneralSettingsInput = z.infer<typeof generalSettingsSchema>;
export type AppearanceSettingsInput = z.infer<typeof appearanceSettingsSchema>;
export type NotificationSettingsInput = z.infer<typeof notificationSettingsSchema>;
export type SecuritySettingsInput = z.infer<typeof securitySettingsSchema>;
export type ApiKeysSettingsInput = z.infer<typeof apiKeysSettingsSchema>;
