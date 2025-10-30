/**
 * Admin Integration Settings API - إعدادات التكاملات
 * Manage third-party integrations (WhatsApp, Payment, SMS, Email)
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
      .eq('category', 'integrations');

    if (error) {
      return NextResponse.json({ 
        error: 'Failed to fetch integration settings',
        details: error.message 
      }, { status: 500 });
    }

    const integrations = (configs || []).reduce((acc: Record<string, any>, config: any) => {
      try {
        // Mask sensitive data when reading
        const value = typeof config.value === 'string' 
          ? JSON.parse(config.value) 
          : config.value;
        
        if (config.is_secret && typeof value === 'object') {
          // Mask API keys and tokens
          Object.keys(value).forEach(k => {
            if (k.toLowerCase().includes('key') || k.toLowerCase().includes('token') || k.toLowerCase().includes('secret')) {
              value[k] = value[k] ? '***' : '';
            }
          });
        }
        
        acc[config.key] = value;
      } catch {
        acc[config.key] = config.value;
      }
      return acc;
    }, {});

    return NextResponse.json({
      success: true,
      data: integrations
    });

  } catch (error) {
    console.error('Error in integration settings API:', error);
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
            category: 'integrations',
            description: `Integration setting: ${key}`,
            updated_at: new Date().toISOString(),
            updated_by: userId,
            is_secret: key.includes('apiKey') || key.includes('token') || key.includes('secret') || key.includes('password')
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
      resource_id: 'integrations',
      user_id: userId,
      details: { category: 'integrations', changes: settingKeys }
    });

    return NextResponse.json({
      success: true,
      data: { message: 'Integration settings saved successfully', updates }
    });

  } catch (error) {
    console.error('Error saving integration settings:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

