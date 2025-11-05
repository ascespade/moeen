import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// GET /api/chatbot/config - جلب إعدادات الشات بوت
export const revalidate = 60;

export async function GET(_request: NextRequest): Promise<NextResponse> {
  try {
    const { data: config, error } = await supabase
      .from('chatbot_configs')
      .select('*')
      .eq('is_active', true)
      .single();

    if (error) {
      // إنشاء إعدادات افتراضية إذا لم تكن موجودة
      const defaultConfig = {
        id: '00000000-0000-0000-0000-000000000100',
        name: 'مركز الهمم Chatbot',
        whatsapp_api_url: 'https://graph.facebook.com/v18.0',
        whatsapp_token: '',
        webhook_url: '',
        is_active: true,
        ai_model: 'gemini_pro',
        language: 'ar',
        timezone: 'Asia/Riyadh',
        business_hours: {
          start: '08:00',
          end: '17:00',
          days: [1, 2, 3, 4, 5],
        },
        auto_reply_enabled: true,
        auto_reply_message:
          'مرحباً بك في مركز الهمم! 👋\n\nيمكنني مساعدتك في:\n📅 حجز المواعيد\n❌ إلغاء المواعيد\n🔔 تذكير بالمواعيد\nℹ️ معلومات عن الخدمات\n\nكيف يمكنني مساعدتك اليوم؟',
      };

      return NextResponse.json({ config: defaultConfig });
    }

    return NextResponse.json({ config });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/chatbot/config - حفظ إعدادات الشات بوت
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json();
    const {
      name,
      whatsapp_api_url,
      whatsapp_token,
      webhook_url,
      is_active,
      ai_model,
      language,
      timezone,
      business_hours,
      auto_reply_enabled,
      auto_reply_message,
    } = body;

    // البحث عن إعدادات موجودة
    const { data: existingConfig } = await supabase
      .from('chatbot_configs')
      .select('id')
      .eq('is_active', true)
      .single();

    let result;
    if (existingConfig) {
      // تحديث الإعدادات الموجودة
      const { data, error } = await supabase
        .from('chatbot_configs')
        .update({
          name,
          whatsapp_api_url,
          whatsapp_token,
          webhook_url,
          is_active,
          ai_model,
          language,
          timezone,
          business_hours,
          auto_reply_enabled,
          auto_reply_message,
          updated_at: new Date().toISOString(),
        })
        .eq('id', existingConfig.id)
        .select()
        .single();

      result = { data, error };
    } else {
      // إنشاء إعدادات جديدة
      const { data, error } = await supabase
        .from('chatbot_configs')
        .insert({
          name,
          whatsapp_api_url,
          whatsapp_token,
          webhook_url,
          is_active,
          ai_model,
          language,
          timezone,
          business_hours,
          auto_reply_enabled,
          auto_reply_message,
        })
        .select()
        .single();

      result = { data, error };
    }

    if (result.error) {
      return NextResponse.json(
        { error: result.error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ config: result.data });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
