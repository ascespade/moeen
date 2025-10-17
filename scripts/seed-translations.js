#!/usr/bin/env node
/**
 * Seed Translations - إنشاء الترجمات الأساسية
 */
require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const translations = {
  // Common
  'common.loading': { ar: 'جاري التحميل...', en: 'Loading...' },
  'common.save': { ar: 'حفظ', en: 'Save' },
  'common.cancel': { ar: 'إلغاء', en: 'Cancel' },
  'common.delete': { ar: 'حذف', en: 'Delete' },
  'common.edit': { ar: 'تعديل', en: 'Edit' },
  'common.search': { ar: 'بحث', en: 'Search' },
  'common.filter': { ar: 'تصفية', en: 'Filter' },
  'common.welcome': { ar: 'مرحباً', en: 'Welcome' },
  'common.logout': { ar: 'تسجيل الخروج', en: 'Logout' },
  
  // Auth
  'auth.login': { ar: 'تسجيل الدخول', en: 'Login' },
  'auth.register': { ar: 'إنشاء حساب', en: 'Register' },
  'auth.email': { ar: 'البريد الإلكتروني', en: 'Email' },
  'auth.password': { ar: 'كلمة المرور', en: 'Password' },
  'auth.forgotPassword': { ar: 'نسيت كلمة المرور؟', en: 'Forgot password?' },
  'auth.rememberMe': { ar: 'تذكرني', en: 'Remember me' },
  'auth.welcomeBack': { ar: 'مرحباً بعودتك', en: 'Welcome back' },
  'auth.loginMessage': { ar: 'سجل دخولك للوصول إلى لوحة التحكم', en: 'Login to access your dashboard' },
  'auth.email.required': { ar: 'البريد الإلكتروني مطلوب', en: 'Email is required' },
  'auth.email.invalid': { ar: 'البريد الإلكتروني غير صحيح', en: 'Invalid email' },
  'auth.password.required': { ar: 'كلمة المرور مطلوبة', en: 'Password is required' },
  'auth.login.error': { ar: 'فشل تسجيل الدخول', en: 'Login failed' },
  'auth.login.success': { ar: 'تم تسجيل الدخول بنجاح', en: 'Login successful' },
  'auth.quickTest': { ar: 'تسجيل دخول سريع للاختبار', en: 'Quick test login' },
  'auth.testMessage': { ar: 'اختبر النظام بحسابات تجريبية جاهزة', en: 'Test the system with ready demo accounts' },
  'auth.loggingIn': { ar: 'جارٍ تسجيل الدخول...', en: 'Logging in...' },
  'auth.createAccount': { ar: 'إنشاء حساب جديد', en: 'Create new account' },
  'auth.noAccount': { ar: 'ليس لديك حساب؟', en: "Don't have an account?" },
  
  // Navigation
  'nav.services': { ar: 'الخدمات', en: 'Services' },
  'nav.about': { ar: 'عن معين', en: 'About' },
  'nav.gallery': { ar: 'المعرض', en: 'Gallery' },
  'nav.contact': { ar: 'اتصل بنا', en: 'Contact Us' },
  'nav.dashboard': { ar: 'لوحة التحكم', en: 'Dashboard' },
  'nav.settings': { ar: 'الإعدادات', en: 'Settings' },
  
  // Homepage
  'home.hero.title': { ar: 'مرحباً بك في مُعين', en: 'Welcome to Moeen' },
  'home.hero.subtitle': { ar: 'منصة الرعاية الصحية المتخصصة', en: 'Specialized Healthcare Platform' },
  'home.hero.description': { ar: 'نقدم خدمات متكاملة للرعاية الصحية مع أحدث التقنيات والذكاء الاصطناعي', en: 'Comprehensive healthcare services with latest AI technology' },
  'home.hero.cta': { ar: 'اكتشف خدماتنا', en: 'Discover Our Services' },
  
  // Dashboard
  'dashboard.title': { ar: 'لوحة التحكم', en: 'Dashboard' },
  'dashboard.welcome': { ar: 'مرحباً', en: 'Welcome' },
  'dashboard.overview': { ar: 'إليك نظرة عامة على نشاطك اليوم', en: "Here's your activity overview" },
  'dashboard.stats.appointments': { ar: 'المواعيد القادمة', en: 'Upcoming Appointments' },
  'dashboard.stats.patients': { ar: 'المرضى', en: 'Patients' },
  'dashboard.stats.notifications': { ar: 'الإشعارات', en: 'Notifications' },
  'dashboard.recentActivity': { ar: 'النشاط الأخير', en: 'Recent Activity' },
  'dashboard.quickActions': { ar: 'الإجراءات السريعة', en: 'Quick Actions' },
  
  // Roles
  'role.admin': { ar: 'مدير', en: 'Admin' },
  'role.supervisor': { ar: 'مشرف', en: 'Supervisor' },
  'role.patient': { ar: 'مريض', en: 'Patient' },
  'role.staff': { ar: 'موظف', en: 'Staff' },
  'role.doctor': { ar: 'طبيب', en: 'Doctor' },
  
  // Status
  'status.active': { ar: 'نشط', en: 'Active' },
  'status.inactive': { ar: 'غير نشط', en: 'Inactive' },
  'status.pending': { ar: 'قيد الانتظار', en: 'Pending' },
  'status.completed': { ar: 'مكتمل', en: 'Completed' },
  
  // Errors
  'error.generic': { ar: 'حدث خطأ ما', en: 'Something went wrong' },
  'error.unauthorized': { ar: 'غير مصرح لك', en: 'Unauthorized' },
  'error.notFound': { ar: 'غير موجود', en: 'Not found' },
  'error.serverError': { ar: 'خطأ في الخادم', en: 'Server error' },
};

async function seedTranslations() {
  console.log('🌐 Seeding translations...\n');
  
  try {
    // 1. Ensure languages exist
    console.log('📝 Ensuring languages...');
    const { error: langError } = await supabase
      .from('languages')
      .upsert([
        { code: 'ar', name: 'العربية', is_default: true, direction: 'rtl' },
        { code: 'en', name: 'English', is_default: false, direction: 'ltr' },
      ], { onConflict: 'code' });
    
    if (langError) {
      console.error('❌ Language error:', langError);
      return;
    }
    console.log('✅ Languages ready\n');
    
    // 2. Insert translations
    console.log('📝 Inserting translations...');
    let successCount = 0;
    let errorCount = 0;
    
    for (const [key, values] of Object.entries(translations)) {
      for (const [lang, value] of Object.entries(values)) {
        const { error } = await supabase
          .from('translations')
          .upsert({
            lang_code: lang,
            key: key,
            value: value,
          }, { onConflict: 'lang_code,key' });
        
        if (error) {
          errorCount++;
          console.error(`  ❌ ${key} [${lang}]`);
        } else {
          successCount++;
        }
      }
    }
    
    console.log(`\n✅ Inserted ${successCount} translations`);
    if (errorCount > 0) {
      console.log(`⚠️  ${errorCount} errors`);
    }
    
    // 3. Verify
    const { count } = await supabase
      .from('translations')
      .select('*', { count: 'exact', head: true });
    
    console.log(`\n📊 Total translations in DB: ${count}`);
    console.log('\n✅ Translations seeded successfully!');
    
  } catch (err) {
    console.error('❌ Error:', err.message);
  }
}

seedTranslations();
