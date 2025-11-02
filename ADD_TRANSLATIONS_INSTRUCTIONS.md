# ✅ إضافة الترجمات إلى Supabase

## 📝 الخطوات:

### 1. افتح Supabase SQL Editor
- اذهب إلى [Supabase Dashboard](https://supabase.com/dashboard)
- اختر مشروعك
- افتح **SQL Editor**

### 2. شغّل ملف SQL
انسخ محتوى ملف `scripts/add-dashboard-translations-direct.sql` والصقه في SQL Editor ثم اضغط **RUN**

أو استخدم هذا الأمر:

```sql
INSERT INTO public.translations(locale, namespace, key, value) VALUES
-- Dashboard Common
('ar', 'dashboard', 'dashboard.loading', 'جاري تحميل لوحة التحكم...'),
('ar', 'dashboard', 'dashboard.error.title', 'فشل في تحميل البيانات'),
('ar', 'dashboard', 'dashboard.error.description', 'حدث خطأ في تحميل البيانات'),
('ar', 'dashboard', 'dashboard.admin.title', 'لوحة تحكم الإدارة'),
('ar', 'dashboard', 'dashboard.admin.description', 'مركز الهمم للرعاية الصحية المتخصصة'),
('ar', 'dashboard', 'dashboard.export', 'تصدير التقرير'),

-- Dashboard Stats
('ar', 'dashboard', 'dashboard.stats.totalPatients', 'إجمالي المرضى'),
('ar', 'dashboard', 'dashboard.stats.active', 'نشط'),
('ar', 'dashboard', 'dashboard.stats.blocked', 'محظور'),
('ar', 'dashboard', 'dashboard.stats.totalAppointments', 'إجمالي المواعيد'),
('ar', 'dashboard', 'dashboard.stats.completed', 'مكتمل'),
('ar', 'dashboard', 'dashboard.stats.pending', 'قيد الانتظار'),
('ar', 'dashboard', 'dashboard.stats.totalRevenue', 'إجمالي الإيرادات'),
('ar', 'dashboard', 'dashboard.stats.totalStaff', 'إجمالي الموظفين'),
('ar', 'dashboard', 'dashboard.stats.onDuty', 'في الخدمة الآن'),
('ar', 'dashboard', 'dashboard.stats.thisMonth', 'هذا الشهر'),

-- Dashboard Claims
('ar', 'dashboard', 'dashboard.claims.title', 'المطالبات التأمينية'),
('ar', 'dashboard', 'dashboard.claims.total', 'إجمالي المطالبات:'),
('ar', 'dashboard', 'dashboard.claims.approved', 'موافق عليها:'),
('ar', 'dashboard', 'dashboard.claims.pending', 'قيد المراجعة:'),
('ar', 'dashboard', 'dashboard.claims.rejected', 'مرفوضة:'),

-- Dashboard Sessions
('ar', 'dashboard', 'dashboard.sessions.title', 'الجلسات العلاجية'),
('ar', 'dashboard', 'dashboard.sessions.total', 'إجمالي الجلسات:'),
('ar', 'dashboard', 'dashboard.sessions.completed', 'مكتملة:'),
('ar', 'dashboard', 'dashboard.sessions.upcoming', 'قادمة:'),

-- Dashboard Performance
('ar', 'dashboard', 'dashboard.performance.title', 'معدلات الأداء'),
('ar', 'dashboard', 'dashboard.performance.appointmentRate', 'معدل إكمال المواعيد:'),
('ar', 'dashboard', 'dashboard.performance.claimApprovalRate', 'معدل الموافقة على المطالبات:'),
('ar', 'dashboard', 'dashboard.performance.sessionCompletionRate', 'معدل إكمال الجلسات:'),

-- Dashboard Activities
('ar', 'dashboard', 'dashboard.activities.title', 'النشاطات الأخيرة'),
('ar', 'dashboard', 'dashboard.activities.empty', 'لا توجد نشاطات حديثة'),

-- Dashboard Staff
('ar', 'dashboard', 'dashboard.staff.title', 'ساعات عمل الموظفين'),
('ar', 'dashboard', 'dashboard.staff.onDuty', 'في الخدمة'),
('ar', 'dashboard', 'dashboard.staff.offDuty', 'خارج الخدمة'),
('ar', 'dashboard', 'dashboard.staff.viewFullReport', 'عرض التقرير الكامل'),
('ar', 'dashboard', 'dashboard.staff.lastCheckIn', 'آخر تسجيل دخول'),
('ar', 'dashboard', 'dashboard.staff.empty', 'لا توجد بيانات للموظفين'),

-- Dashboard Quick Actions
('ar', 'dashboard', 'dashboard.quickActions.title', 'إجراءات سريعة'),
('ar', 'dashboard', 'dashboard.quickActions.addPatient', 'إضافة مريض'),
('ar', 'dashboard', 'dashboard.quickActions.bookAppointment', 'حجز موعد'),
('ar', 'dashboard', 'dashboard.quickActions.insuranceClaim', 'مطالبة تأمين'),
('ar', 'dashboard', 'dashboard.quickActions.addStaff', 'إضافة موظف'),
('ar', 'dashboard', 'dashboard.quickActions.financialReport', 'تقرير مالي'),

-- Common Translations
('ar', 'common', 'common.retry', 'إعادة المحاولة'),
('ar', 'common', 'common.logout', 'خروج'),
('ar', 'common', 'common.settings', 'الإعدادات'),
('ar', 'common', 'common.viewAll', 'عرض الكل'),
('ar', 'common', 'common.currency', 'ريال'),
('ar', 'common', 'common.hours', 'س'),
('ar', 'common', 'common.period.today', 'اليوم'),
('ar', 'common', 'common.period.week', 'هذا الأسبوع'),
('ar', 'common', 'common.period.month', 'هذا الشهر'),
('ar', 'common', 'common.period.year', 'هذا العام')

ON CONFLICT (locale, namespace, key) 
DO UPDATE SET value = EXCLUDED.value;
```

### 3. تحقق من الإضافة
بعد تشغيل SQL، تحقق من أن الترجمات تم إضافتها:
```sql
SELECT * FROM public.translations WHERE namespace = 'dashboard' OR key LIKE 'common.%';
```

---

**ملاحظة:** 
- الملف الجاهز: `scripts/add-dashboard-translations-direct.sql`
- يمكن نسخه مباشرة وتشغيله في Supabase SQL Editor
