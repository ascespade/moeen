/**
 * Add Dashboard Translations via REST API
 * إضافة ترجمات لوحة التحكم عبر REST API
 */

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://socwpqzcalgvpzjwavgh.supabase.co';
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || 'sbp_a1d07c37833d0bfd3bd1e05129c811813dd223dd';

const translations = [
  { locale: 'ar', namespace: 'dashboard', key: 'dashboard.loading', value: 'جاري تحميل لوحة التحكم...' },
  { locale: 'ar', namespace: 'dashboard', key: 'dashboard.error.title', value: 'فشل في تحميل البيانات' },
  { locale: 'ar', namespace: 'dashboard', key: 'dashboard.error.description', value: 'حدث خطأ في تحميل البيانات' },
  { locale: 'ar', namespace: 'dashboard', key: 'dashboard.admin.title', value: 'لوحة تحكم الإدارة' },
  { locale: 'ar', namespace: 'dashboard', key: 'dashboard.admin.description', value: 'مركز الهمم للرعاية الصحية المتخصصة' },
  { locale: 'ar', namespace: 'dashboard', key: 'dashboard.export', value: 'تصدير التقرير' },
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
  { locale: 'ar', namespace: 'dashboard', key: 'dashboard.claims.title', value: 'المطالبات التأمينية' },
  { locale: 'ar', namespace: 'dashboard', key: 'dashboard.claims.total', value: 'إجمالي المطالبات:' },
  { locale: 'ar', namespace: 'dashboard', key: 'dashboard.claims.approved', value: 'موافق عليها:' },
  { locale: 'ar', namespace: 'dashboard', key: 'dashboard.claims.pending', value: 'قيد المراجعة:' },
  { locale: 'ar', namespace: 'dashboard', key: 'dashboard.claims.rejected', value: 'مرفوضة:' },
  { locale: 'ar', namespace: 'dashboard', key: 'dashboard.sessions.title', value: 'الجلسات العلاجية' },
  { locale: 'ar', namespace: 'dashboard', key: 'dashboard.sessions.total', value: 'إجمالي الجلسات:' },
  { locale: 'ar', namespace: 'dashboard', key: 'dashboard.sessions.completed', value: 'مكتملة:' },
  { locale: 'ar', namespace: 'dashboard', key: 'dashboard.sessions.upcoming', value: 'قادمة:' },
  { locale: 'ar', namespace: 'dashboard', key: 'dashboard.performance.title', value: 'معدلات الأداء' },
  { locale: 'ar', namespace: 'dashboard', key: 'dashboard.performance.appointmentRate', value: 'معدل إكمال المواعيد:' },
  { locale: 'ar', namespace: 'dashboard', key: 'dashboard.performance.claimApprovalRate', value: 'معدل الموافقة على المطالبات:' },
  { locale: 'ar', namespace: 'dashboard', key: 'dashboard.performance.sessionCompletionRate', value: 'معدل إكمال الجلسات:' },
  { locale: 'ar', namespace: 'dashboard', key: 'dashboard.activities.title', value: 'النشاطات الأخيرة' },
  { locale: 'ar', namespace: 'dashboard', key: 'dashboard.activities.empty', value: 'لا توجد نشاطات حديثة' },
  { locale: 'ar', namespace: 'dashboard', key: 'dashboard.staff.title', value: 'ساعات عمل الموظفين' },
  { locale: 'ar', namespace: 'dashboard', key: 'dashboard.staff.onDuty', value: 'في الخدمة' },
  { locale: 'ar', namespace: 'dashboard', key: 'dashboard.staff.offDuty', value: 'خارج الخدمة' },
  { locale: 'ar', namespace: 'dashboard', key: 'dashboard.staff.viewFullReport', value: 'عرض التقرير الكامل' },
  { locale: 'ar', namespace: 'dashboard', key: 'dashboard.staff.lastCheckIn', value: 'آخر تسجيل دخول' },
  { locale: 'ar', namespace: 'dashboard', key: 'dashboard.staff.empty', value: 'لا توجد بيانات للموظفين' },
  { locale: 'ar', namespace: 'dashboard', key: 'dashboard.quickActions.title', value: 'إجراءات سريعة' },
  { locale: 'ar', namespace: 'dashboard', key: 'dashboard.quickActions.addPatient', value: 'إضافة مريض' },
  { locale: 'ar', namespace: 'dashboard', key: 'dashboard.quickActions.bookAppointment', value: 'حجز موعد' },
  { locale: 'ar', namespace: 'dashboard', key: 'dashboard.quickActions.insuranceClaim', value: 'مطالبة تأمين' },
  { locale: 'ar', namespace: 'dashboard', key: 'dashboard.quickActions.addStaff', value: 'إضافة موظف' },
  { locale: 'ar', namespace: 'dashboard', key: 'dashboard.quickActions.financialReport', value: 'تقرير مالي' },
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

async function addTranslationsViaREST() {
  console.log('🚀 Adding translations via REST API...');
  console.log(`📊 Total translations: ${translations.length}`);
  console.log(`🔗 URL: ${SUPABASE_URL}/rest/v1/translations`);

  let successCount = 0;
  let errorCount = 0;

  // Use service key for authentication
  const headers = {
    'apikey': SUPABASE_SERVICE_KEY,
    'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
    'Content-Type': 'application/json',
    'Prefer': 'resolution=merge-duplicates',
  };

  // Insert one by one with upsert
  for (const translation of translations) {
    try {
      const response = await fetch(`${SUPABASE_URL}/rest/v1/translations?on_conflict=locale,namespace,key`, {
        method: 'POST',
        headers: {
          ...headers,
          'Prefer': 'resolution=merge-duplicates',
        },
        body: JSON.stringify(translation),
      });

      if (response.ok) {
        console.log(`✅ Added: ${translation.key}`);
        successCount++;
      } else {
        const errorText = await response.text();
        let errorMsg = errorText;
        try {
          const errorJson = JSON.parse(errorText);
          errorMsg = errorJson.message || errorText;
        } catch {}
        
        // If duplicate (409), consider it success
        if (response.status === 409) {
          console.log(`ℹ️  Already exists: ${translation.key}`);
          successCount++;
        } else {
          console.error(`❌ Error adding ${translation.key}: ${response.status} - ${errorMsg}`);
          errorCount++;
        }
      }
    } catch (error: any) {
      console.error(`❌ Exception adding ${translation.key}:`, error.message);
      errorCount++;
    }
    
    // Small delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 50));
  }

  console.log('\n📊 Summary:');
  console.log(`✅ Success: ${successCount}`);
  console.log(`❌ Errors: ${errorCount}`);
  console.log(`📝 Total: ${translations.length}`);
}

addTranslationsViaREST()
  .then(() => {
    console.log('✅ Done!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Fatal error:', error);
    process.exit(1);
  });
