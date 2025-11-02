/**
 * Add Login Translations
 * إضافة ترجمات صفحة تسجيل الدخول
 */

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://socwpqzcalgvpzjwavgh.supabase.co';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNvY3dwcXpjYWxndnB6andhdmdoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1OTMwNTU5MCwiZXhwIjoyMDc0ODgxNTkwfQ.e7U09qA-JUwGzqlJhuBwic2V-wzYCwwKvAwuDS2fsHU';

const translations = [
  { locale: 'ar', namespace: 'login', key: 'login.welcome', value: 'مرحباً بعودتك' },
  { locale: 'ar', namespace: 'login', key: 'login.subtitle', value: 'سجل دخولك للوصول إلى لوحة التحكم' },
  { locale: 'ar', namespace: 'login', key: 'login.email', value: 'البريد الإلكتروني' },
  { locale: 'ar', namespace: 'login', key: 'login.password', value: 'كلمة المرور' },
  { locale: 'ar', namespace: 'login', key: 'login.rememberMe', value: 'تذكرني' },
  { locale: 'ar', namespace: 'login', key: 'login.forgotPassword', value: 'نسيت كلمة المرور؟' },
  { locale: 'ar', namespace: 'login', key: 'login.submitting', value: 'جارٍ تسجيل الدخول...' },
  { locale: 'ar', namespace: 'login', key: 'login.submit', value: 'تسجيل الدخول' },
];

async function addLoginTranslations() {
  console.log('🚀 Adding login translations...');
  console.log(`📊 Total translations: ${translations.length}`);

  const headers = {
    'apikey': SUPABASE_SERVICE_KEY,
    'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
    'Content-Type': 'application/json',
    'Prefer': 'resolution=merge-duplicates',
  };

  let successCount = 0;
  let errorCount = 0;

  for (const translation of translations) {
    try {
      const response = await fetch(`${SUPABASE_URL}/rest/v1/translations?on_conflict=locale,namespace,key`, {
        method: 'POST',
        headers,
        body: JSON.stringify(translation),
      });

      if (response.ok || response.status === 409) {
        console.log(`✅ Added: ${translation.key}`);
        successCount++;
      } else {
        const errorText = await response.text();
        console.error(`❌ Error adding ${translation.key}: ${response.status} - ${errorText}`);
        errorCount++;
      }
    } catch (error: any) {
      console.error(`❌ Exception adding ${translation.key}:`, error.message);
      errorCount++;
    }
    
    await new Promise(resolve => setTimeout(resolve, 50));
  }

  console.log('\n📊 Summary:');
  console.log(`✅ Success: ${successCount}`);
  console.log(`❌ Errors: ${errorCount}`);
}

addLoginTranslations()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('❌ Fatal error:', error);
    process.exit(1);
  });
