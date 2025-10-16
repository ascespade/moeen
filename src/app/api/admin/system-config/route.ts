/**
 * System Configuration API - إعدادات النظام
 * Manage system-wide configuration and settings
 */

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';
import { ValidationHelper } from '@/core/validation';
import { ErrorHandler } from '@/core/errors';
import { authorize, requireRole } from '@/lib/auth/authorize';

const configSchema = z.object({
  key: z.string().min(1, 'Configuration key required'),
  value: z.any(),
  type: z.enum(['string', 'number', 'boolean', 'object', 'array']),
  description: z.string().optional(),
  isPublic: z.boolean().default(false),
  category: z.string().default('general'),
});

export async function POST(request: NextRequest) {
  try {
    // Authorize admin only
    const { user: authUser, error: authError } = await authorize(request);
    if (authError || !authUser || !requireRole(['admin'])(authUser)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabase = createClient();
    const body = await request.json();

    // Validate input
    const validation = await ValidationHelper.validateAsync(configSchema, body);
    if (!validation.success) {
      return NextResponse.json({ error: validation.error.message }, { status: 400 });
    }

    const { key, value, type, description, isPublic, category } = validation.data;

    // Create or update configuration
    const { data: config, error } = await supabase
      .from('system_config')
      .upsert({
        key,
        value,
        type,
        description,
        isPublic,
        category,
        updatedBy: authUser.id,
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: 'Failed to save configuration' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      data: config,
      message: 'Configuration saved successfully'
    });

  } catch (error) {
    return ErrorHandler.getInstance().handle(error);
  }
}

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient();
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const isPublic = searchParams.get('isPublic') === 'true';

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

    const { data: configs, error } = await query;

    if (error) {
      return NextResponse.json({ error: 'Failed to fetch configurations' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      data: configs,
      count: configs?.length || 0
    });

  } catch (error) {
    return ErrorHandler.getInstance().handle(error);
  }
}