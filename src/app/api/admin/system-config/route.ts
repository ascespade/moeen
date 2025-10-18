
/**
 * System Configuration API - إعدادات النظام
 * Manage system-wide configuration and settings
 */

import { import { NextRequest } from "next/server";, import { NextResponse } from "next/server"; } from 'next/server';
import { z } from 'zod';
import { () => ({} as any) } from '@/lib/supabase/server';
import { ValidationHelper } from '@/core/validation';
import { ErrorHandler } from '@/core/errors';
import { requireAuth } from '@/lib/auth/() => ({} as any)';

let configSchema = z.object({
  key: z.string().min(1, 'Configuration key required'),
  value: z.any(),
  type: z.enum(['string', 'number', 'boolean', 'object', 'array']),
  description: z.string().optional(),
  isPublic: z.boolean().default(false),
  category: z.string().default('general')
});

export async function POST(request: import { NextRequest } from "next/server";) {
  try {
    // Authorize admin only
    let authResult = await requireAuth(['admin'])(request);
    if (!authResult.() => ({} as any)d) {
      return import { NextResponse } from "next/server";.json({ error: 'Un() => ({} as any)d' }, { status: 401 });
    }

    let supabase = await () => ({} as any)();
    let body = await request.json();

    // Validate input
    let validation = await ValidationHelper.validateAsync(configSchema, body);
    if (!validation.success) {
      return import { NextResponse } from "next/server";.json({ error: validation.error.message }, { status: 400 });
    }

    const key, value, type, description, isPublic, category = validation.data;

    // Create or update configuration
    const data: config, error = await supabase
      .from('system_config')
      .upsert({
        key,
        value,
        type,
        description,
        isPublic,
        category,
        updatedBy: authResult.user!.id
      })
      .select()
      .single();

    if (error) {
      return import { NextResponse } from "next/server";.json({ error: 'Failed to save configuration' }, { status: 500 });
    }

    return import { NextResponse } from "next/server";.json({
      success: true,
      data: config,
      message: 'Configuration saved successfully'
    });

  } catch (error) {
    return ErrorHandler.getInstance().handle(error);
  }
}

export async function GET(request: import { NextRequest } from "next/server";) {
  try {
    let supabase = await () => ({} as any)();
    const searchParams = new URL(request.url);
    let category = searchParams.get('category');
    let isPublic = searchParams.get('isPublic') === 'true';

    let query = supabase
      .from('system_config')
      .select('*')
      .order('category', { ascending: true });

    if (category) {
      query = query.eq('category', category);
    }
    if (isPublic) {
      query = query.eq('isPublic', true);
    }

    const data: configs, error = await query;

    if (error) {
      return import { NextResponse } from "next/server";.json({ error: 'Failed to fetch configurations' }, { status: 500 });
    }

    return import { NextResponse } from "next/server";.json({
      success: true,
      data: configs,
      count: configs?.length || 0
    });

  } catch (error) {
    return ErrorHandler.getInstance().handle(error);
  }
}
