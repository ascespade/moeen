import { NextRequest, NextResponse } from 'next/server';
import { getServiceSupabase } from '@/lib/supabaseClient';

const supabase = getServiceSupabase();

export async function GET(
  request: NextRequest,
  { params }: { params: { lang: string } }
) {
  const { lang } = params;

  try {
    // Set cache control headers
    const headers = new Headers();
    headers.set(
      'Cache-Control',
      'public, max-age=3600, stale-while-revalidate=86400'
    );
    headers.set('Content-Type', 'application/json');

    // Check if translations table exists
    const { data: tableCheck, error: tableError } = await supabase
      .from('translations')
      .select('id')
      .limit(1);

    if (tableError && tableError.code === 'PGRST116') {
      // Table doesn't exist, return default translations
      return NextResponse.json(
        {
          ar: getDefaultTranslations('ar'),
          en: getDefaultTranslations('en'),
        },
        { headers }
      );
    }

    if (tableError) throw tableError;

    // Get translations for the requested language
    const { data: translations, error: translationsError } = await supabase
      .from('translations')
      .select('key, value')
      .eq('locale', lang);

    if (translationsError) throw translationsError;

    // If no translations found, try default language
    if (!translations || translations.length === 0) {
      const { data: defaultTranslations, error: defaultError } = await supabase
        .from('translations')
        .select('key, value')
        .eq('locale', 'ar'); // Default to Arabic

      if (defaultError) throw defaultError;

      // Log missing translation keys
      await logMissingTranslationKeys(lang, []);

      return NextResponse.json(
        defaultTranslations.reduce(
          (acc, t) => ({ ...acc, [t.key]: t.value }),
          {}
        ),
        { headers }
      );
    }

    // Convert to key-value object
    const translationObject = translations.reduce(
      (acc, t) => ({
        ...acc,
        [t.key]: t.value,
      }),
      {}
    );

    return NextResponse.json(translationObject, { headers });
  } catch (error) {
    // Return fallback translations
    return NextResponse.json(getDefaultTranslations(lang), {
      headers: {
        'Cache-Control': 'no-cache',
        'Content-Type': 'application/json',
      },
    });
  }
}

async function logMissingTranslationKeys(
  requestedLang: string,
  missingKeys: string[]
) {
  try {
    // Create missing_translations table if it doesn't exist
    await supabase.rpc('exec_sql', {
      sql_query: `
        CREATE TABLE IF NOT EXISTS missing_translations (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          language TEXT NOT NULL,
          key TEXT NOT NULL,
          requested_at TIMESTAMP DEFAULT NOW()
        );
      `,
    });

    // Log missing keys
    if (missingKeys.length > 0) {
      await supabase.from('missing_translations').insert(
        missingKeys.map(key => ({
          language: requestedLang,
          key,
        }))
      );
    }
  } catch (error) {}
}

function getDefaultTranslations(lang: string) {
  const defaultTranslations = {
    ar: {
      'common.welcome': 'مرحباً',
      'common.hello': 'أهلاً وسهلاً',
      'common.goodbye': 'وداعاً',
      'common.yes': 'نعم',
      'common.no': 'لا',
      'common.save': 'حفظ',
      'common.cancel': 'إلغاء',
      'common.edit': 'تعديل',
      'common.delete': 'حذف',
      'common.search': 'بحث',
      'common.loading': 'جاري التحميل...',
      'common.error': 'حدث خطأ',
      'common.success': 'تم بنجاح',
      'dashboard.title': 'لوحة التحكم',
      'dashboard.overview': 'نظرة عامة',
      'dashboard.metrics': 'المقاييس',
      'theme.light': 'الوضع المضيء',
      'theme.dark': 'الوضع المظلم',
      'theme.system': 'النظام',
      'language.arabic': 'العربية',
      'language.english': 'الإنجليزية',
    },
    en: {
      'common.welcome': 'Welcome',
      'common.hello': 'Hello',
      'common.goodbye': 'Goodbye',
      'common.yes': 'Yes',
      'common.no': 'No',
      'common.save': 'Save',
      'common.cancel': 'Cancel',
      'common.edit': 'Edit',
      'common.delete': 'Delete',
      'common.search': 'Search',
      'common.loading': 'Loading...',
      'common.error': 'An error occurred',
      'common.success': 'Success',
      'dashboard.title': 'Dashboard',
      'dashboard.overview': 'Overview',
      'dashboard.metrics': 'Metrics',
      'theme.light': 'Light Mode',
      'theme.dark': 'Dark Mode',
      'theme.system': 'System',
      'language.arabic': 'Arabic',
      'language.english': 'English',
    },
  };

  return (
    defaultTranslations[lang as keyof typeof defaultTranslations] ||
    defaultTranslations.en
  );
}
