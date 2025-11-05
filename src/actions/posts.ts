/**
 * Posts Actions - Server Actions for Post Management
 * إجراءات المنشورات - Server Actions لإدارة المنشورات
 * 
 * All post-related server actions
 */

'use server';

import { revalidatePath } from 'next/cache';
import { createAdminClient } from '@/lib/supabase/admin';
import { withAction } from '@/lib/auth/with-action';
import { createPostSchema, updatePostSchema } from '@/lib/validations';
import { handleServerActionError } from '@/lib/errors';
import { AppError } from '@/lib/errors';
import type { Post, PostInsert, PostUpdate } from '@/types/database.types';

/**
 * Create post action
 */
export const createPostAction = withAction(
  async (user, input: unknown) => {
    const validated = createPostSchema.parse(input);
    const adminClient = createAdminClient();

    const { data, error } = await adminClient
      .from('posts')
      .insert({
        user_id: user.id,
        title: validated.title,
        content: validated.content,
        category: validated.category || null,
        tags: validated.tags || null,
        published: validated.published,
      } as PostInsert)
      .select()
      .single();

    if (error) {
      throw AppError.internal(`فشل إنشاء المنشور: ${error.message}`);
    }

    revalidatePath('/posts');
    return data;
  },
  {
    requireAuth: true,
  }
);

/**
 * Update post action
 */
export const updatePostAction = withAction(
  async (user, input: { id: string; data: unknown }) => {
    const validated = updatePostSchema.parse(input.data);
    const adminClient = createAdminClient();

    // Check if user owns the post
    const { data: existingPost } = await adminClient
      .from('posts')
      .select('user_id')
      .eq('id', input.id)
      .single();

    if (!existingPost) {
      throw AppError.notFound('المنشور غير موجود');
    }

    if (existingPost.user_id !== user.id) {
      throw AppError.forbidden('ليس لديك صلاحية لتعديل هذا المنشور');
    }

    const { data, error } = await adminClient
      .from('posts')
      .update(validated as PostUpdate)
      .eq('id', input.id)
      .select()
      .single();

    if (error) {
      throw AppError.internal(`فشل تحديث المنشور: ${error.message}`);
    }

    revalidatePath('/posts');
    revalidatePath(`/posts/${input.id}`);
    return data;
  },
  {
    requireAuth: true,
  }
);

/**
 * Delete post action
 */
export const deletePostAction = withAction(
  async (user, postId: string) => {
    const adminClient = createAdminClient();

    // Check if user owns the post
    const { data: existingPost } = await adminClient
      .from('posts')
      .select('user_id')
      .eq('id', postId)
      .single();

    if (!existingPost) {
      throw AppError.notFound('المنشور غير موجود');
    }

    if (existingPost.user_id !== user.id) {
      throw AppError.forbidden('ليس لديك صلاحية لحذف هذا المنشور');
    }

    const { error } = await adminClient
      .from('posts')
      .delete()
      .eq('id', postId);

    if (error) {
      throw AppError.internal(`فشل حذف المنشور: ${error.message}`);
    }

    revalidatePath('/posts');
    return { success: true };
  },
  {
    requireAuth: true,
  }
);
