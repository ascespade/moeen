/**
 * Admin Notification Settings API - إعدادات الإشعارات
 * Manage notification templates and settings
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { requireAuth } from '@/lib/auth/authorize';
import { ErrorHandler } from '@/core/errors';
import { logger } from '@/lib/logger';

export async function GET(request: NextRequest) {
  try {
    const authResult = await requireAuth(['admin', 'manager'])(request);
    if (!authResult.authorized) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabase = await createClient();

    const { data: configs, error } = await supabase
      .from('system_config')
      .select('*')
      .eq('category', 'notifications');

    if (error) {
      return NextResponse.json({ 
        error: 'Failed to fetch notification settings',
        details: error.message 
      }, { status: 500 });
    }

    const notifications = (configs || []).reduce((acc: Record<string, any>, config: any) => {
      try {
        acc[config.key] = typeof config.value === 'string' 
          ? JSON.parse(config.value) 
          : config.value;
      } catch {
        acc[config.key] = config.value;
      }
      return acc;
    }, {});

    return NextResponse.json({
      success: true,
      data: notifications
    });

  } catch (error) {
    logger.error('Error in notification settings API', error);
    return ErrorHandler.getInstance().handle(error as Error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const authResult = await requireAuth(['admin', 'manager'])(request);
    if (!authResult.authorized) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    const userId = user?.id || 'system';

    const settingKeys = Object.keys(body);
    const updates = await Promise.all(
      settingKeys.map(async (key) => {
        const value = body[key];
        
        const { error } = await supabase
          .from('system_config')
          .upsert({
            key,
            value: typeof value === 'object' ? JSON.stringify(value) : value,
            category: 'notifications',
            description: `Notification setting: ${key}`,
            updated_at: new Date().toISOString(),
            updated_by: userId
          }, {
            onConflict: 'key'
          });

        if (error) {
          return { key, error: error.message };
        }
        return { key, success: true };
      })
    );

    await supabase.from('audit_logs').insert({
      action: 'update',
      resource_type: 'settings',
      resource_id: 'notifications',
      user_id: userId,
      details: { category: 'notifications', changes: settingKeys }
    });

    return NextResponse.json({
      success: true,
      data: { message: 'Notification settings saved successfully', updates }
    });

  } catch (error) {
    logger.error('Error saving notification settings', error);
    return ErrorHandler.getInstance().handle(error as Error);
  }
}

