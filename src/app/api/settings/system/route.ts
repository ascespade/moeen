import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// API لجلب الإعدادات العامة
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const key = searchParams.get('key');
    const publicOnly = searchParams.get('public') === 'true';

    let query = supabase.from('system_settings').select('*');

    if (category) {
      query = query.eq('category', category);
    }

    if (key) {
      query = query.eq('key', key);
    }

    if (publicOnly) {
      query = query.eq('is_public', true);
    }

    const { data, error } = await query;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // تحويل البيانات إلى شكل مناسب
    const settings =
      data?.reduce(
        (acc, setting) => {
          let value = setting.value;

          // تحويل الأنواع المختلفة
          switch (setting.type) {
            case 'number':
              value = parseFloat(setting.value);
              break;
            case 'boolean':
              value = setting.value === 'true';
              break;
            case 'json':
              try {
                value = JSON.parse(setting.value);
              } catch {
                value = setting.value;
              }
              break;
          }

          acc[setting.key] = value;
          return acc;
        },
        {} as Record<string, any>
      ) || {};

    return NextResponse.json({ settings });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// API لتحديث الإعدادات (للمدراء فقط)
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { key, value, type, category, description, is_public, is_encrypted } =
      body;

    if (!key || value === undefined) {
      return NextResponse.json(
        { error: 'Key and value are required' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('system_settings')
      .upsert({
        key,
        value: String(value),
        type: type || 'string',
        category: category || 'general',
        description,
        is_public: is_public || false,
        is_encrypted: is_encrypted || false,
        updated_at: new Date().toISOString(),
      })
      .select();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data: data[0] });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// API لحذف إعداد (للمدراء فقط)
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const key = searchParams.get('key');

    if (!key) {
      return NextResponse.json({ error: 'Key is required' }, { status: 400 });
    }

    const { error } = await supabase
      .from('system_settings')
      .delete()
      .eq('key', key);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
