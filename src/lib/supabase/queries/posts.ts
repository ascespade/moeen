/**
 * Posts Queries - Centralized Post Queries
 * استعلامات المنشورات - الاستعلامات المركزية
 * 
 * All post-related database queries
 */

import { cache } from 'react';
import { createClient } from '../server';
import type { Post, PostInsert, PostUpdate } from '@/types/database.types';

/**
 * Get all posts
 */
export const getPosts = cache(async (options?: {
  published?: boolean;
  userId?: string;
  limit?: number;
}): Promise<Post[]> => {
  const supabase = await createClient();
  let query = supabase
    .from('posts')
    .select('*')
    .order('created_at', { ascending: false });

  if (options?.published !== undefined) {
    query = query.eq('published', options.published);
  }

  if (options?.userId) {
    query = query.eq('user_id', options.userId);
  }

  if (options?.limit) {
    query = query.limit(options.limit);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(`Failed to fetch posts: ${error.message}`);
  }

  return data || [];
});

/**
 * Get post by ID
 */
export const getPostById = cache(async (id: string): Promise<Post | null> => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return null;
    }
    throw new Error(`Failed to fetch post: ${error.message}`);
  }

  return data;
});

/**
 * Get published posts
 */
export const getPublishedPosts = cache(async (limit?: number): Promise<Post[]> => {
  return getPosts({ published: true, limit });
});

/**
 * Get posts by user
 */
export const getPostsByUser = cache(async (userId: string): Promise<Post[]> => {
  return getPosts({ userId });
});
