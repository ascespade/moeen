/**
 * Comments Actions - Server Actions for Comment Management
 * إجراءات التعليقات - Server Actions لإدارة التعليقات
 *
 * All comment-related server actions
 */

'use server';

import { revalidatePath } from 'next/cache';
import { createAdminClient } from '@/lib/supabase/admin';
import { withAction } from '@/lib/auth/with-action';
import { createCommentSchema, updateCommentSchema } from '@/lib/validations';
import { AppError } from '@/lib/errors';
import type { CommentInsert, CommentUpdate } from '@/types/database.types';

/**
 * Create comment action
 */
export const createCommentAction = withAction(
  async (user, input: unknown) => {
    const validated = createCommentSchema.parse(input);
    const adminClient = createAdminClient();

    const { data, error } = await adminClient
      .from('comments')
      .insert({
        post_id: validated.postId,
        user_id: user.id,
        content: validated.content,
        parent_id: validated.parentId || null,
      } as CommentInsert)
      .select()
      .single();

    if (error) {
      throw AppError.internal(`فشل إنشاء التعليق: ${error.message}`);
    }

    revalidatePath(`/posts/${validated.postId}`);
    return data;
  },
  {
    requireAuth: true,
  }
);

/**
 * Update comment action
 */
export const updateCommentAction = withAction(
  async (user, input: { id: string; data: unknown }) => {
    const validated = updateCommentSchema.parse(input.data);
    const adminClient = createAdminClient();

    // Check if user owns the comment
    const { data: existingComment } = await adminClient
      .from('comments')
      .select('user_id')
      .eq('id', input.id)
      .single();

    if (!existingComment) {
      throw AppError.notFound('التعليق غير موجود');
    }

    if (existingComment.user_id !== user.id) {
      throw AppError.forbidden('ليس لديك صلاحية لتعديل هذا التعليق');
    }

    const { data, error } = await adminClient
      .from('comments')
      .update(validated as CommentUpdate)
      .eq('id', input.id)
      .select()
      .single();

    if (error) {
      throw AppError.internal(`فشل تحديث التعليق: ${error.message}`);
    }

    revalidatePath(`/posts/${existingComment.post_id}`);
    return data;
  },
  {
    requireAuth: true,
  }
);

/**
 * Delete comment action
 */
export const deleteCommentAction = withAction(
  async (user, commentId: string) => {
    const adminClient = createAdminClient();

    // Check if user owns the comment
    const { data: existingComment } = await adminClient
      .from('comments')
      .select('user_id, post_id')
      .eq('id', commentId)
      .single();

    if (!existingComment) {
      throw AppError.notFound('التعليق غير موجود');
    }

    if (existingComment.user_id !== user.id) {
      throw AppError.forbidden('ليس لديك صلاحية لحذف هذا التعليق');
    }

    const { error } = await adminClient
      .from('comments')
      .delete()
      .eq('id', commentId);

    if (error) {
      throw AppError.internal(`فشل حذف التعليق: ${error.message}`);
    }

    revalidatePath(`/posts/${existingComment.post_id}`);
    return { success: true };
  },
  {
    requireAuth: true,
  }
);
