/**
 * Comments Queries - Centralized Comment Queries
 * استعلامات التعليقات - الاستعلامات المركزية
 *
 * All comment-related database queries
 */

import { cache } from 'react';
import { createClient } from '../server';
import type {
  Comment,
  CommentInsert,
  CommentUpdate,
} from '@/types/database.types';

/**
 * Get comments by post ID
 */
export const getCommentsByPostId = cache(
  async (postId: string): Promise<Comment[]> => {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('comments')
      .select('*')
      .eq('post_id', postId)
      .order('created_at', { ascending: true });

    if (error) {
      throw new Error(`Failed to fetch comments: ${error.message}`);
    }

    return data || [];
  }
);

/**
 * Get comment by ID
 */
export const getCommentById = cache(
  async (id: string): Promise<Comment | null> => {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('comments')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null;
      }
      throw new Error(`Failed to fetch comment: ${error.message}`);
    }

    return data;
  }
);

/**
 * Get replies to a comment (child comments)
 */
export const getCommentReplies = cache(
  async (parentId: string): Promise<Comment[]> => {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('comments')
      .select('*')
      .eq('parent_id', parentId)
      .order('created_at', { ascending: true });

    if (error) {
      throw new Error(`Failed to fetch comment replies: ${error.message}`);
    }

    return data || [];
  }
);

/**
 * Get comments by user
 */
export const getCommentsByUser = cache(
  async (userId: string): Promise<Comment[]> => {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('comments')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch comments: ${error.message}`);
    }

    return data || [];
  }
);
