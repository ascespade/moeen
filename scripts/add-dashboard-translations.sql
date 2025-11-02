-- Add Dashboard Translations
-- إضافة ترجمات لوحة التحكم

-- Dashboard Common
INSERT INTO public.translations (key, value, lang_code, namespace) VALUES
('dashboard.loading', 'جاري تحميل لوحة التحكم...', 'ar', 'dashboard'),
('dashboard.error.title', 'فشل في تحميل البيانات', 'ar', 'dashboard'),
('dashboard.error.description', 'حدث خطأ في تحميل البيانات', 'ar', 'dashboard'),
('dashboard.admin.title', 'لوحة تحكم الإدارة', 'ar', 'dashboard'),
('dashboard.admin.description', 'مركز الهمم للرعاية الصحية المتخصصة', 'ar', 'dashboard'),
('dashboard.export', 'تصدير التقرير', 'ar', 'dashboard'),

-- Dashboard Stats
('dashboard.stats.totalPatients', 'إجمالي المرضى', 'ar', 'dashboard'),
('dashboard.stats.active', 'نشط', 'ar', 'dashboard'),
('dashboard.stats.blocked', 'محظور', 'ar', 'dashboard'),
('dashboard.stats.totalAppointments', 'إجمالي المواعيد', 'ar', 'dashboard'),
('dashboard.stats.completed', 'مكتمل', 'ar', 'dashboard'),
('dashboard.stats.pending', 'قيد الانتظار', 'ar', 'dashboard'),
('dashboard.stats.totalRevenue', 'إجمالي الإيرادات', 'ar', 'dashboard'),
('dashboard.stats.totalStaff', 'إجمالي الموظفين', 'ar', 'dashboard'),
('dashboard.stats.onDuty', 'في الخدمة الآن', 'ar', 'dashboard'),
('dashboard.stats.thisMonth', 'هذا الشهر', 'ar', 'dashboard'),

-- Dashboard Claims
('dashboard.claims.title', 'المطالبات التأمينية', 'ar', 'dashboard'),
('dashboard.claims.total', 'إجمالي المطالبات:', 'ar', 'dashboard'),
('dashboard.claims.approved', 'موافق عليها:', 'ar', 'dashboard'),
('dashboard.claims.pending', 'قيد المراجعة:', 'ar', 'dashboard'),
('dashboard.claims.rejected', 'مرفوضة:', 'ar', 'dashboard'),

-- Dashboard Sessions
('dashboard.sessions.title', 'الجلسات العلاجية', 'ar', 'dashboard'),
('dashboard.sessions.total', 'إجمالي الجلسات:', 'ar', 'dashboard'),
('dashboard.sessions.completed', 'مكتملة:', 'ar', 'dashboard'),
('dashboard.sessions.upcoming', 'قادمة:', 'ar', 'dashboard'),

-- Dashboard Performance
('dashboard.performance.title', 'معدلات الأداء', 'ar', 'dashboard'),
('dashboard.performance.appointmentRate', 'معدل إكمال المواعيد:', 'ar', 'dashboard'),
('dashboard.performance.claimApprovalRate', 'معدل الموافقة على المطالبات:', 'ar', 'dashboard'),
('dashboard.performance.sessionCompletionRate', 'معدل إكمال الجلسات:', 'ar', 'dashboard'),

-- Dashboard Activities
('dashboard.activities.title', 'النشاطات الأخيرة', 'ar', 'dashboard'),
('dashboard.activities.empty', 'لا توجد نشاطات حديثة', 'ar', 'dashboard'),

-- Dashboard Staff
('dashboard.staff.title', 'ساعات عمل الموظفين', 'ar', 'dashboard'),
('dashboard.staff.onDuty', 'في الخدمة', 'ar', 'dashboard'),
('dashboard.staff.offDuty', 'خارج الخدمة', 'ar', 'dashboard'),
('dashboard.staff.viewFullReport', 'عرض التقرير الكامل', 'ar', 'dashboard'),
('dashboard.staff.lastCheckIn', 'آخر تسجيل دخول', 'ar', 'dashboard'),
('dashboard.staff.empty', 'لا توجد بيانات للموظفين', 'ar', 'dashboard'),

-- Dashboard Quick Actions
('dashboard.quickActions.title', 'إجراءات سريعة', 'ar', 'dashboard'),
('dashboard.quickActions.addPatient', 'إضافة مريض', 'ar', 'dashboard'),
('dashboard.quickActions.bookAppointment', 'حجز موعد', 'ar', 'dashboard'),
('dashboard.quickActions.insuranceClaim', 'مطالبة تأمين', 'ar', 'dashboard'),
('dashboard.quickActions.addStaff', 'إضافة موظف', 'ar', 'dashboard'),
('dashboard.quickActions.financialReport', 'تقرير مالي', 'ar', 'dashboard'),

-- Common Translations
('common.retry', 'إعادة المحاولة', 'ar', 'common'),
('common.logout', 'خروج', 'ar', 'common'),
('common.settings', 'الإعدادات', 'ar', 'common'),
('common.viewAll', 'عرض الكل', 'ar', 'common'),
('common.currency', 'ريال', 'ar', 'common'),
('common.hours', 'س', 'ar', 'common'),
('common.period.today', 'اليوم', 'ar', 'common'),
('common.period.week', 'هذا الأسبوع', 'ar', 'common'),
('common.period.month', 'هذا الشهر', 'ar', 'common'),
('common.period.year', 'هذا العام', 'ar', 'common')

ON CONFLICT (key, lang_code, namespace) 
DO UPDATE SET value = EXCLUDED.value;
