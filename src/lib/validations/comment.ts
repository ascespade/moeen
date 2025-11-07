/**
 * Comment Validation Schemas - Zod
 * مخططات التحقق من التعليقات - Zod
 *
 * All comment-related validation schemas
 */

import { z } from 'zod';
import { MESSAGES } from '../constants/messages';

// Create Comment Schema
export const createCommentSchema = z.object({
  content: z
    .string()
    .min(1, MESSAGES.ERROR.REQUIRED_FIELD)
    .max(1000, 'التعليق يجب أن لا يتجاوز 1000 حرف'),
  postId: z.string().uuid('معرف المنشور غير صحيح'),
  parentId: z.string().uuid().optional(),
});

// Update Comment Schema
export const updateCommentSchema = z.object({
  content: z
    .string()
    .min(1, MESSAGES.ERROR.REQUIRED_FIELD)
    .max(1000, 'التعليق يجب أن لا يتجاوز 1000 حرف'),
});

// Type exports
export type CreateCommentInput = z.infer<typeof createCommentSchema>;
export type UpdateCommentInput = z.infer<typeof updateCommentSchema>;
