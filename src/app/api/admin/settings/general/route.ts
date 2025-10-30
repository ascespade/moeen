/**
 * Admin General Settings API - الإعدادات العامة
 * Manage general system settings (center info, business hours, localization)
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { requireAuth } from '@/lib/auth/authorize';

export async function GET(request: NextRequest) {
  try {
    // Authorize admin or manager only
    const authResult = await requireAuth(['admin', 'manager'])(request);
    if (!authResult.authorized) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabase = await createClient();

    // Get general settings from system_config
    const { data: configs, error } = await supabase
      .from('system_config')
      .select('*')
      .eq('category', 'general')
      .order('key');

    if (error) {
      console.error('Error fetching general settings:', error);
      return NextResponse.json({ 
        error: 'Failed to fetch settings',
        details: error.message 
      }, { status: 500 });
    }

    // Transform configs to object format
    const settings = (configs || []).reduce((acc: Record<string, any>, config: any) => {
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
      data: {
        centerName: settings.centerName || 'مركز الهمم للرعاية الصحية المتخصصة',
        centerNameEn: settings.centerNameEn || 'Hemam Specialized Healthcare Center',
        address: settings.address || '',
        phone: settings.phone || '',
        email: settings.email || '',
        website: settings.website || '',
        description: settings.description || '',
        businessHours: settings.businessHours || {
          start: '08:00',
          end: '18:00',
          days: ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday']
        },
        timezone: settings.timezone || 'Asia/Riyadh',
        locale: settings.locale || 'ar-SA',
        currency: settings.currency || 'SAR',
        dateFormat: settings.dateFormat || 'DD/MM/YYYY',
        timeFormat: settings.timeFormat || '24'
      }
    });

  } catch (error) {
    console.error('Error in general settings API:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    // Authorize admin or manager only
    const authResult = await requireAuth(['admin', 'manager'])(request);
    if (!authResult.authorized) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const supabase = await createClient();

    // Get current user ID for audit
    const { data: { user } } = await supabase.auth.getUser();
    const userId = user?.id || 'system';

    // Prepare settings to save
    const settingsKeys = [
      'centerName',
      'centerNameEn', 
      'address',
      'phone',
      'email',
      'website',
      'description',
      'businessHours',
      'timezone',
      'locale',
      'currency',
      'dateFormat',
      'timeFormat'
    ];

    // Upsert each setting
    const updates = await Promise.all(
      settingsKeys.map(async (key) => {
        const value = body[key];
        if (value === undefined) return null;

        const { error } = await supabase
          .from('system_config')
          .upsert({
            key,
            value: typeof value === 'object' ? JSON.stringify(value) : value,
            category: 'general',
            description: `General setting: ${key}`,
            updated_at: new Date().toISOString(),
            updated_by: userId
          }, {
            onConflict: 'key'
          });

        if (error) {
          console.error(`Error saving setting ${key}:`, error);
          return { key, error: error.message };
        }
        return { key, success: true };
      })
    );

    // Log the change
    await supabase.from('audit_logs').insert({
      action: 'update',
      resource_type: 'settings',
      resource_id: 'general',
      user_id: userId,
      details: {
        category: 'general',
        changes: settingsKeys.filter(k => body[k] !== undefined)
      }
    });

    return NextResponse.json({
      success: true,
      data: {
        message: 'Settings saved successfully',
        updates: updates.filter(u => u !== null)
      }
    });

  } catch (error) {
    console.error('Error saving general settings:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

