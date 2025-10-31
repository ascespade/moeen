import { NextRequest, NextResponse } from 'next/server';
import { getServerSupabase } from '@/lib/supabaseClient';
import { requireAuth } from '@/lib/auth/authorize';
import { ErrorHandler } from '@/core/errors';

export async function GET(request: NextRequest) {
  try {
    // Authorize any authenticated user
    const authResult = await requireAuth()(request);
    if (!authResult.authorized) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const supabase = await getServerSupabase();

    // Get current user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    // Return default preferences for unauthenticated users
    const defaultPreferences = {
      theme: 'light',
      language: 'ar',
      timezone: 'Asia/Riyadh',
      notifications_enabled: true,
    };

    if (authError || !user) {
      return NextResponse.json(defaultPreferences);
    }

    // Fetch user preferences
    const { data: preferences, error } = await supabase
      .from('user_preferences')
      .select('theme, language, timezone, notifications_enabled')
      .eq('user_id', user.id)
      .single();

    if (error && error.code !== 'PGRST116') {
      // PGRST116 = no rows returned
      return ErrorHandler.getInstance().handle(error as Error);
    }

    return NextResponse.json(preferences || defaultPreferences);
  } catch (error) {
    return ErrorHandler.getInstance().handle(error as Error);
  }
}

export async function POST(request: NextRequest) {
  try {
    // Authorize any authenticated user (but allow unauthenticated for localStorage fallback)
    const authResult = await requireAuth()(request);
    
    const supabase = await getServerSupabase();

    // Allow saving preferences for unauthenticated users (they use localStorage)
    // Only save to DB if authenticated
    const { key, value } = await request.json();

    // Get current user from supabase
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      // Unauthenticated users - return success (they use localStorage)
      return NextResponse.json({ success: true, source: 'localStorage' });
    }

    if (!key || value === undefined) {
      return NextResponse.json(
        { error: 'Key and value are required' },
        { status: 400 }
      );
    }

    // Validate key
    const validKeys = [
      'theme',
      'language',
      'timezone',
      'notifications_enabled',
    ];
    if (!validKeys.includes(key)) {
      return NextResponse.json(
        { error: 'Invalid preference key' },
        { status: 400 }
      );
    }

    // Validate theme value
    if (key === 'theme' && !['light', 'dark', 'system'].includes(value)) {
      return NextResponse.json(
        { error: 'Invalid theme value' },
        { status: 400 }
      );
    }

    // Validate language value
    if (key === 'language' && !['ar', 'en'].includes(value)) {
      return NextResponse.json(
        { error: 'Invalid language value' },
        { status: 400 }
      );
    }

    // Upsert user preference
    const { error } = await supabase.from('user_preferences').upsert(
      {
        user_id: user.id,
        [key]: value,
        updated_at: new Date().toISOString(),
      },
      {
        onConflict: 'user_id',
      }
    );

    if (error) {
      return ErrorHandler.getInstance().handle(error as Error);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return ErrorHandler.getInstance().handle(error as Error);
  }
}
