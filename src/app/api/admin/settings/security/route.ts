/**
 * Admin Security Settings API - إعدادات الأمان
 * Manage security policies and authentication settings
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { requireAuth } from '@/lib/auth/authorize';

export async function GET(request: NextRequest) {
  try {
    const authResult = await requireAuth(['admin'])(request);
    if (!authResult.authorized) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabase = await createClient();

    const { data: configs, error } = await supabase
      .from('system_config')
      .select('*')
      .eq('category', 'security');

    if (error) {
      return NextResponse.json({ 
        error: 'Failed to fetch security settings',
        details: error.message 
      }, { status: 500 });
    }

    const securitySettings = (configs || []).reduce((acc: Record<string, any>, config: any) => {
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
      data: securitySettings
    });

  } catch (error) {
    console.error('Error in security settings API:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const authResult = await requireAuth(['admin'])(request);
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
            category: 'security',
            description: `Security setting: ${key}`,
            updated_at: new Date().toISOString(),
            updated_by: userId,
            is_secret: true // Security settings are always secret
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
      resource_id: 'security',
      user_id: userId,
      details: { category: 'security', changes: settingKeys }
    });

    return NextResponse.json({
      success: true,
      data: { message: 'Security settings saved successfully', updates }
    });

  } catch (error) {
    console.error('Error saving security settings:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

