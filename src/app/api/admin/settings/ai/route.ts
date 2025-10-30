/**
 * Admin AI Settings API - إعدادات الذكاء الاصطناعي
 * Manage AI chatbot and automation settings
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { requireAuth } from '@/lib/auth/authorize';

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
      .eq('category', 'ai');

    if (error) {
      return NextResponse.json({ 
        error: 'Failed to fetch AI settings',
        details: error.message 
      }, { status: 500 });
    }

    const aiSettings = (configs || []).reduce((acc: Record<string, any>, config: any) => {
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
      data: aiSettings
    });

  } catch (error) {
    console.error('Error in AI settings API:', error);
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

    // Save AI settings
    const settingKeys = Object.keys(body);
    const updates = await Promise.all(
      settingKeys.map(async (key) => {
        const value = body[key];
        
        const { error } = await supabase
          .from('system_config')
          .upsert({
            key,
            value: typeof value === 'object' ? JSON.stringify(value) : value,
            category: 'ai',
            description: `AI setting: ${key}`,
            updated_at: new Date().toISOString(),
            updated_by: userId,
            is_secret: key.includes('apiKey') || key.includes('token') || key.includes('secret')
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
      resource_id: 'ai',
      user_id: userId,
      details: { category: 'ai', changes: settingKeys }
    });

    return NextResponse.json({
      success: true,
      data: { message: 'AI settings saved successfully', updates }
    });

  } catch (error) {
    console.error('Error saving AI settings:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

