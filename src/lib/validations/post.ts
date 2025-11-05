/**
 * Post Validation Schemas - Zod
 * مخططات التحقق من المنشورات - Zod
 * 
 * All post-related validation schemas
 */

import { z } from 'zod';
import { _MESSAGES } from '../constants/messages';

// Create Post Schema
export const createPostSchema = z.object({
  title: z
    .string()
    .min(3, 'العنوان يجب أن يكون 3 أحرف على الأقل')
    .max(200, 'العنوان يجب أن لا يتجاوز 200 حرف'),
  content: z
    .string()
    .min(10, 'المحتوى يجب أن يكون 10 أحرف على الأقل')
    .max(5000, 'المحتوى يجب أن لا يتجاوز 5000 حرف'),
  category: z.string().optional(),
  tags: z.array(z.string()).optional(),
  published: z.boolean().default(false),
});

// Update Post Schema
export const updatePostSchema = z.object({
  title: z.string().min(3).max(200).optional(),
  content: z.string().min(10).max(5000).optional(),
  category: z.string().optional(),
  tags: z.array(z.string()).optional(),
  published: z.boolean().optional(),
});

// Type exports
export type CreatePostInput = z.infer<typeof createPostSchema>;
export type UpdatePostInput = z.infer<typeof updatePostSchema>;
