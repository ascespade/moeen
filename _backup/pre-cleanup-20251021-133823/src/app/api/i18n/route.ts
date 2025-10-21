import { NextRequest, NextResponse } from 'next/server';
import { getServerSupabase } from '@/lib/supabaseClient';

// Fallback messages when database is not available
function getFallbackMessages(locale: string, ns: string) {
  const fallbackMessages: Record<
    string,
    Record<string, Record<string, string>>
  > = {
    ar: {
      homepage: {
        'hero.slide1.title': 'مرحباً بك في مُعين',
        'hero.slide1.subtitle': 'منصة الرعاية الصحية المتخصصة',
        'hero.slide1.description':
          'نقدم خدمات متكاملة للرعاية الصحية مع أحدث التقنيات والذكاء الاصطناعي',
        'hero.slide1.cta': 'اكتشف خدماتنا',
        'nav.services': 'الخدمات',
        'nav.about': 'عن معين',
        'nav.gallery': 'المعرض',
        'nav.contact': 'اتصل بنا',
        'nav.login': 'تسجيل الدخول',
        'nav.register': 'إنشاء حساب',
        'theme.label': 'الثيم',
        'language.label': 'اللغة',
      },
      common: {
        save: 'حفظ',
        cancel: 'إلغاء',
        delete: 'حذف',
        edit: 'تعديل',
        add: 'إضافة',
        search: 'بحث',
        loading: 'جاري التحميل...',
        error: 'خطأ',
        success: 'نجح',
      },
    },
    en: {
      homepage: {
        'hero.slide1.title': 'Welcome to Mu3een',
        'hero.slide1.subtitle': 'Specialized Healthcare Platform',
        'hero.slide1.description':
          'We provide comprehensive healthcare services with the latest technologies and artificial intelligence',
        'hero.slide1.cta': 'Discover Our Services',
        'nav.services': 'Services',
        'nav.about': 'About',
        'nav.gallery': 'Gallery',
        'nav.contact': 'Contact',
        'nav.login': 'Login',
        'nav.register': 'Register',
        'theme.label': 'Theme',
        'language.label': 'Language',
      },
      common: {
        save: 'Save',
        cancel: 'Cancel',
        delete: 'Delete',
        edit: 'Edit',
        add: 'Add',
        search: 'Search',
        loading: 'Loading...',
        error: 'Error',
        success: 'Success',
      },
    },
  };

  return NextResponse.json({
    locale,
    ns,
    messages: fallbackMessages[locale]?.[ns] || {},
    source: 'fallback',
  });
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const locale = searchParams.get('locale') || 'ar';
  const ns = searchParams.get('ns') || 'common';

  try {
    const supabase = await getServerSupabase();
    const { data, error } = await supabase
      .from('translations')
      .select('key, value')
      .eq('locale', locale)
      .eq('namespace', ns);

    if (error) {
      return getFallbackMessages(locale, ns);
    }

    if (data && data.length > 0) {
      const messages: Record<string, string> = {};
      for (const row of data) {
        messages[row.key] = row.value;
      }
      return NextResponse.json({ locale, ns, messages, source: 'database' });
    }

    return getFallbackMessages(locale, ns);
  } catch (error) {
    return getFallbackMessages(locale, ns);
  }
}
