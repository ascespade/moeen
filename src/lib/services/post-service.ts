/**
 * Post Service - Business Logic for Posts
 * خدمة المنشورات - منطق الأعمال للمنشورات
 * 
 * Business logic layer for post operations
 */

import { createAdminClient } from '../supabase/admin';
import { AppError } from '../errors';
import type { Post, PostInsert, PostUpdate } from '@/types/database.types';

/**
 * Post Service Class
 */
export class PostService {
  /**
   * Create post
   */
  static async createPost(data: PostInsert): Promise<Post> {
    const adminClient = createAdminClient();
    const { data: post, error } = await adminClient
      .from('posts')
      .insert(data)
      .select()
      .single();

    if (error) {
      throw AppError.internal(`Failed to create post: ${error.message}`);
    }

    if (!post) {
      throw AppError.internal('Failed to create post: No data returned');
    }

    return post;
  }

  /**
   * Update post
   */
  static async updatePost(id: string, data: PostUpdate, userId: string): Promise<Post> {
    const adminClient = createAdminClient();

    // Check ownership
    const { data: existingPost } = await adminClient
      .from('posts')
      .select('user_id')
      .eq('id', id)
      .single();

    if (!existingPost) {
      throw AppError.notFound('Post not found');
    }

    if (existingPost.user_id !== userId) {
      throw AppError.forbidden('You do not have permission to update this post');
    }

    const { data: post, error } = await adminClient
      .from('posts')
      .update(data)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw AppError.internal(`Failed to update post: ${error.message}`);
    }

    if (!post) {
      throw AppError.notFound('Post not found');
    }

    return post;
  }

  /**
   * Delete post
   */
  static async deletePost(id: string, userId: string): Promise<void> {
    const adminClient = createAdminClient();

    // Check ownership
    const { data: existingPost } = await adminClient
      .from('posts')
      .select('user_id')
      .eq('id', id)
      .single();

    if (!existingPost) {
      throw AppError.notFound('Post not found');
    }

    if (existingPost.user_id !== userId) {
      throw AppError.forbidden('You do not have permission to delete this post');
    }

    const { error } = await adminClient
      .from('posts')
      .delete()
      .eq('id', id);

    if (error) {
      throw AppError.internal(`Failed to delete post: ${error.message}`);
    }
  }

  /**
   * Get post by ID
   */
  static async getPostById(id: string): Promise<Post | null> {
    const adminClient = createAdminClient();
    const { data, error } = await adminClient
      .from('posts')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null;
      }
      throw AppError.internal(`Failed to fetch post: ${error.message}`);
    }

    return data;
  }

  /**
   * Get published posts
   */
  static async getPublishedPosts(limit?: number): Promise<Post[]> {
    const adminClient = createAdminClient();
    let query = adminClient
      .from('posts')
      .select('*')
      .eq('published', true)
      .order('created_at', { ascending: false });

    if (limit) {
      query = query.limit(limit);
    }

    const { data, error } = await query;

    if (error) {
      throw AppError.internal(`Failed to fetch posts: ${error.message}`);
    }

    return data || [];
  }
}
