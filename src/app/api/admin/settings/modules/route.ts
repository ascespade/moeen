/**
 * Admin Module Settings API - إعدادات المودولات
 * Manage module enablement and configuration
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
      .eq('category', 'modules');

    if (error) {
      return NextResponse.json({ 
        error: 'Failed to fetch module settings',
        details: error.message 
      }, { status: 500 });
    }

    const modules = (configs || []).reduce((acc: Record<string, any>, config: any) => {
      try {
        acc[config.key] = typeof config.value === 'string' 
          ? JSON.parse(config.value) 
          : config.value;
      } catch {
        acc[config.key] = config.value;
      }
      return acc;
    }, {});

    // Default modules configuration
    const defaultModules = {
      reception: { enabled: true, features: [], settings: {} },
      doctor: { enabled: true, features: [], settings: {} },
      patient: { enabled: true, features: [], settings: {} },
      therapy: { enabled: true, features: [], settings: {} },
      emr: { enabled: true, features: [], settings: {} },
      finance: { enabled: true, features: [], settings: {} },
      admin: { enabled: true, features: [], settings: {} },
      settings: { enabled: true, features: [], settings: {} }
    };

    return NextResponse.json({
      success: true,
      data: { ...defaultModules, ...modules }
    });

  } catch (error) {
    console.error('Error in module settings API:', error);
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

    // Save each module configuration
    const moduleKeys = Object.keys(body);
    const updates = await Promise.all(
      moduleKeys.map(async (moduleKey) => {
        const moduleConfig = body[moduleKey];
        
        const { error } = await supabase
          .from('system_config')
          .upsert({
            key: moduleKey,
            value: JSON.stringify(moduleConfig),
            category: 'modules',
            description: `Module configuration: ${moduleKey}`,
            updated_at: new Date().toISOString(),
            updated_by: userId
          }, {
            onConflict: 'key'
          });

        if (error) {
          return { module: moduleKey, error: error.message };
        }
        return { module: moduleKey, success: true };
      })
    );

    // Log changes
    await supabase.from('audit_logs').insert({
      action: 'update',
      resource_type: 'settings',
      resource_id: 'modules',
      user_id: userId,
      details: {
        category: 'modules',
        changedModules: moduleKeys
      }
    });

    return NextResponse.json({
      success: true,
      data: {
        message: 'Module settings saved successfully',
        updates
      }
    });

  } catch (error) {
    console.error('Error saving module settings:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

