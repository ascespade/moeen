/**
 * Add Dashboard Translations to Supabase
 * إضافة ترجمات لوحة التحكم إلى Supabase
 */

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://socwpqzcalgvpzjwavgh.supabase.co';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || 'sbp_a1d07c37833d0bfd3bd1e05129c811813dd223dd';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

const translations = [
  // Dashboard Common
  { locale: 'ar', namespace: 'dashboard', key: 'dashboard.loading', value: 'جاري تحميل لوحة التحكم...' },
  { locale: 'ar', namespace: 'dashboard', key: 'dashboard.error.title', value: 'فشل في تحميل البيانات' },
  { locale: 'ar', namespace: 'dashboard', key: 'dashboard.error.description', value: 'حدث خطأ في تحميل البيانات' },
  { locale: 'ar', namespace: 'dashboard', key: 'dashboard.admin.title', value: 'لوحة تحكم الإدارة' },
  { locale: 'ar', namespace: 'dashboard', key: 'dashboard.admin.description', value: 'مركز الهمم للرعاية الصحية المتخصصة' },
  { locale: 'ar', namespace: 'dashboard', key: 'dashboard.export', value: 'تصدير التقرير' },

  // Dashboard Stats
  { locale: 'ar', namespace: 'dashboard', key: 'dashboard.stats.totalPatients', value: 'إجمالي المرضى' },
  { locale: 'ar', namespace: 'dashboard', key: 'dashboard.stats.active', value: 'نشط' },
  { locale: 'ar', namespace: 'dashboard', key: 'dashboard.stats.blocked', value: 'محظور' },
  { locale: 'ar', namespace: 'dashboard', key: 'dashboard.stats.totalAppointments', value: 'إجمالي المواعيد' },
  { locale: 'ar', namespace: 'dashboard', key: 'dashboard.stats.completed', value: 'مكتمل' },
  { locale: 'ar', namespace: 'dashboard', key: 'dashboard.stats.pending', value: 'قيد الانتظار' },
  { locale: 'ar', namespace: 'dashboard', key: 'dashboard.stats.totalRevenue', value: 'إجمالي الإيرادات' },
  { locale: 'ar', namespace: 'dashboard', key: 'dashboard.stats.totalStaff', value: 'إجمالي الموظفين' },
  { locale: 'ar', namespace: 'dashboard', key: 'dashboard.stats.onDuty', value: 'في الخدمة الآن' },
  { locale: 'ar', namespace: 'dashboard', key: 'dashboard.stats.thisMonth', value: 'هذا الشهر' },

  // Dashboard Claims
  { locale: 'ar', namespace: 'dashboard', key: 'dashboard.claims.title', value: 'المطالبات التأمينية' },
  { locale: 'ar', namespace: 'dashboard', key: 'dashboard.claims.total', value: 'إجمالي المطالبات:' },
  { locale: 'ar', namespace: 'dashboard', key: 'dashboard.claims.approved', value: 'موافق عليها:' },
  { locale: 'ar', namespace: 'dashboard', key: 'dashboard.claims.pending', value: 'قيد المراجعة:' },
  { locale: 'ar', namespace: 'dashboard', key: 'dashboard.claims.rejected', value: 'مرفوضة:' },

  // Dashboard Sessions
  { locale: 'ar', namespace: 'dashboard', key: 'dashboard.sessions.title', value: 'الجلسات العلاجية' },
  { locale: 'ar', namespace: 'dashboard', key: 'dashboard.sessions.total', value: 'إجمالي الجلسات:' },
  { locale: 'ar', namespace: 'dashboard', key: 'dashboard.sessions.completed', value: 'مكتملة:' },
  { locale: 'ar', namespace: 'dashboard', key: 'dashboard.sessions.upcoming', value: 'قادمة:' },

  // Dashboard Performance
  { locale: 'ar', namespace: 'dashboard', key: 'dashboard.performance.title', value: 'معدلات الأداء' },
  { locale: 'ar', namespace: 'dashboard', key: 'dashboard.performance.appointmentRate', value: 'معدل إكمال المواعيد:' },
  { locale: 'ar', namespace: 'dashboard', key: 'dashboard.performance.claimApprovalRate', value: 'معدل الموافقة على المطالبات:' },
  { locale: 'ar', namespace: 'dashboard', key: 'dashboard.performance.sessionCompletionRate', value: 'معدل إكمال الجلسات:' },

  // Dashboard Activities
  { locale: 'ar', namespace: 'dashboard', key: 'dashboard.activities.title', value: 'النشاطات الأخيرة' },
  { locale: 'ar', namespace: 'dashboard', key: 'dashboard.activities.empty', value: 'لا توجد نشاطات حديثة' },

  // Dashboard Staff
  { locale: 'ar', namespace: 'dashboard', key: 'dashboard.staff.title', value: 'ساعات عمل الموظفين' },
  { locale: 'ar', namespace: 'dashboard', key: 'dashboard.staff.onDuty', value: 'في الخدمة' },
  { locale: 'ar', namespace: 'dashboard', key: 'dashboard.staff.offDuty', value: 'خارج الخدمة' },
  { locale: 'ar', namespace: 'dashboard', key: 'dashboard.staff.viewFullReport', value: 'عرض التقرير الكامل' },
  { locale: 'ar', namespace: 'dashboard', key: 'dashboard.staff.lastCheckIn', value: 'آخر تسجيل دخول' },
  { locale: 'ar', namespace: 'dashboard', key: 'dashboard.staff.empty', value: 'لا توجد بيانات للموظفين' },

  // Dashboard Quick Actions
  { locale: 'ar', namespace: 'dashboard', key: 'dashboard.quickActions.title', value: 'إجراءات سريعة' },
  { locale: 'ar', namespace: 'dashboard', key: 'dashboard.quickActions.addPatient', value: 'إضافة مريض' },
  { locale: 'ar', namespace: 'dashboard', key: 'dashboard.quickActions.bookAppointment', value: 'حجز موعد' },
  { locale: 'ar', namespace: 'dashboard', key: 'dashboard.quickActions.insuranceClaim', value: 'مطالبة تأمين' },
  { locale: 'ar', namespace: 'dashboard', key: 'dashboard.quickActions.addStaff', value: 'إضافة موظف' },
  { locale: 'ar', namespace: 'dashboard', key: 'dashboard.quickActions.financialReport', value: 'تقرير مالي' },

  // Common Translations
  { locale: 'ar', namespace: 'common', key: 'common.retry', value: 'إعادة المحاولة' },
  { locale: 'ar', namespace: 'common', key: 'common.logout', value: 'خروج' },
  { locale: 'ar', namespace: 'common', key: 'common.settings', value: 'الإعدادات' },
  { locale: 'ar', namespace: 'common', key: 'common.viewAll', value: 'عرض الكل' },
  { locale: 'ar', namespace: 'common', key: 'common.currency', value: 'ريال' },
  { locale: 'ar', namespace: 'common', key: 'common.hours', value: 'س' },
  { locale: 'ar', namespace: 'common', key: 'common.period.today', value: 'اليوم' },
  { locale: 'ar', namespace: 'common', key: 'common.period.week', value: 'هذا الأسبوع' },
  { locale: 'ar', namespace: 'common', key: 'common.period.month', value: 'هذا الشهر' },
  { locale: 'ar', namespace: 'common', key: 'common.period.year', value: 'هذا العام' },
];

async function addTranslations() {
  console.log('🚀 Adding translations to Supabase...');
  console.log(`📊 Total translations: ${translations.length}`);

  let successCount = 0;
  let errorCount = 0;

  for (const translation of translations) {
    try {
      const { error } = await supabase
        .from('translations')
        .upsert(translation, {
          onConflict: 'locale,namespace,key',
        });

      if (error) {
        console.error(`❌ Error adding ${translation.key}:`, error.message);
        errorCount++;
      } else {
        console.log(`✅ Added: ${translation.key}`);
        successCount++;
      }
    } catch (error: any) {
      console.error(`❌ Exception adding ${translation.key}:`, error.message);
      errorCount++;
    }
  }

  console.log('\n📊 Summary:');
  console.log(`✅ Success: ${successCount}`);
  console.log(`❌ Errors: ${errorCount}`);
  console.log(`📝 Total: ${translations.length}`);
}

addTranslations()
  .then(() => {
    console.log('✅ Done!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Fatal error:', error);
    process.exit(1);
  });
