-- Translations table
create table if not exists public.translations (
  id bigserial primary key,
  locale text not null check (locale in ('ar','en')),
  namespace text not null default 'common',
  key text not null,
  value text not null,
  unique(locale, namespace, key)
);

-- RLS: allow read to anon, write only to service role
alter table public.translations enable row level security;

create policy "Allow read to anon" on public.translations
  for select using (true);

-- Upserts via service role only
create policy "Service write" on public.translations
  for all using (auth.role() = 'service_role') with check (auth.role() = 'service_role');

-- Seed basic keys
insert into public.translations(locale, namespace, key, value) values
-- Conversations
('ar','common','conv.subtitle','إدارة جميع المحادثات'),
('ar','common','conv.new','محادثة جديدة'),
('ar','common','conv.search','البحث في المحادثات...'),
('ar','common','conv.filter.all','الكل'),
('ar','common','conv.filter.active','نشط'),
('ar','common','conv.filter.pending','معلق'),
('ar','common','conv.filter.resolved','تم الحل'),
('en','common','conv.subtitle','Manage all conversations'),
('en','common','conv.new','New conversation'),
('en','common','conv.search','Search conversations...'),
('en','common','conv.filter.all','All'),
('en','common','conv.filter.active','Active'),
('en','common','conv.filter.pending','Pending'),
('en','common','conv.filter.resolved','Resolved'),

-- Flow
('ar','common','flow.subtitle','إنشاء وإدارة تدفقات المحادثة'),
('ar','common','flow.new','تدفق جديد'),
('ar','common','flow.templates','القوالب الجاهزة'),
('en','common','flow.subtitle','Create and manage flows'),
('en','common','flow.new','New flow'),
('en','common','flow.templates','Templates'),

-- Auth
('ar','common','auth.welcomeBack','مرحباً بك مرة أخرى'),
('ar','common','auth.login.subtitle','سجل دخولك للوصول إلى لوحة التحكم'),
('ar','common','auth.email','البريد الإلكتروني'),
('ar','common','auth.email.placeholder','أدخل بريدك الإلكتروني'),
('ar','common','auth.password','كلمة المرور'),
('ar','common','auth.password.placeholder','أدخل كلمة المرور'),
('ar','common','auth.remember','تذكرني'),
('ar','common','auth.forgot','نسيت كلمة المرور؟'),
('ar','common','auth.login','تسجيل الدخول'),
('en','common','auth.welcomeBack','Welcome back'),
('en','common','auth.login.subtitle','Sign in to access the dashboard'),
('en','common','auth.email','Email'),
('en','common','auth.email.placeholder','Enter your email'),
('en','common','auth.password','Password'),
('en','common','auth.password.placeholder','Enter your password'),
('en','common','auth.remember','Remember me'),
('en','common','auth.forgot','Forgot password?'),
('en','common','auth.login','Sign in'),

-- UI common
('ar','common','ui.preview','معاينة'),
('ar','common','ui.save','حفظ'),
('en','common','ui.preview','Preview'),
('en','common','ui.save','Save'),
('ar','common','app.name','معين'),
('ar','common','nav.dashboard','لوحة التحكم'),
('ar','common','nav.conversations','المحادثات'),
('ar','common','nav.flow','منشئ التدفق'),
('ar','common','nav.review','مركز المراجعة'),
('ar','common','nav.settings','الإعدادات'),
('ar','common','nav.users','إدارة الفريق'),
('ar','common','ui.theme','الثيم'),
('ar','common','ui.language','اللغة'),
('ar','common','home.hero.title','منصة دردشة متعددة القنوات'),
('ar','common','home.hero.subtitle','مدعومة بالذكاء الاصطناعي'),
('ar','common','home.hero.ctaPrimary','جرب الآن مجانًا'),
('ar','common','home.hero.ctaSecondary','اكتشف المميزات'),
('ar','common','home.features.unifiedChat','دردشة موحدة'),
('ar','common','home.features.unifiedChat.desc','كل محادثاتك في واجهة واحدة مع بحث وفلاتر ذكية.'),
('ar','common','home.features.customers','إدارة العملاء'),
('ar','common','home.features.customers.desc','ملفات تعريف غنية وسجل كامل للتفاعل.'),
('ar','common','home.features.reports','تقارير ذكية'),
('ar','common','home.features.reports.desc','لوحات تحكم ومؤشرات أداء لحظية.'),
('ar','common','home.cta.title','ابدأ اليوم'),
('ar','common','home.cta.button','إنشاء حساب'),
('en','common','app.name','Mu''ayin'),
('en','common','nav.dashboard','Dashboard'),
('en','common','nav.conversations','Conversations')
,('en','common','nav.flow','Flow Builder')
,('en','common','nav.review','Review Center')
,('en','common','nav.settings','Settings')
,('en','common','nav.users','Team Management')
,('en','common','ui.theme','Theme')
,('en','common','ui.language','Language')
,('en','common','home.hero.title','Omnichannel Messaging Platform')
,('en','common','home.hero.subtitle','AI-powered')
,('en','common','home.hero.ctaPrimary','Try for free')
,('en','common','home.hero.ctaSecondary','Explore features')
,('en','common','home.features.unifiedChat','Unified chat')
,('en','common','home.features.unifiedChat.desc','All conversations in one UI with smart filters.')
,('en','common','home.features.customers','Customer management')
,('en','common','home.features.customers.desc','Rich profiles and complete interaction history.')
,('en','common','home.features.reports','Smart analytics')
,('en','common','home.features.reports.desc','Dashboards and real-time KPIs.')
,('en','common','home.cta.title','Start today')
,('en','common','home.cta.button','Create account'),

-- Dashboard translations
('ar','common','dashboard.title','لوحة التحكم'),
('ar','common','dashboard.overview','نظرة عامة'),
('ar','common','dashboard.stats','الإحصائيات'),
('ar','common','dashboard.recentActivity','النشاط الأخير'),
('ar','common','dashboard.quickActions','الإجراءات السريعة'),
('en','common','dashboard.title','Dashboard'),
('en','common','dashboard.overview','Overview'),
('en','common','dashboard.stats','Statistics'),
('en','common','dashboard.recentActivity','Recent Activity'),
('en','common','dashboard.quickActions','Quick Actions'),

-- Users Management
('ar','common','users.title','إدارة المستخدمين'),
('ar','common','users.addUser','إضافة مستخدم'),
('ar','common','users.editUser','تعديل المستخدم'),
('ar','common','users.deleteUser','حذف المستخدم'),
('ar','common','users.role','الدور'),
('ar','common','users.status','الحالة'),
('ar','common','users.active','نشط'),
('ar','common','users.inactive','غير نشط'),
('en','common','users.title','User Management'),
('en','common','users.addUser','Add User'),
('en','common','users.editUser','Edit User'),
('en','common','users.deleteUser','Delete User'),
('en','common','users.role','Role'),
('en','common','users.status','Status'),
('en','common','users.active','Active'),
('en','common','users.inactive','Inactive'),

-- Settings
('ar','common','settings.title','الإعدادات'),
('ar','common','settings.general','عام'),
('ar','common','settings.notifications','الإشعارات'),
('ar','common','settings.security','الأمان'),
('ar','common','settings.integrations','التكاملات'),
('ar','common','settings.save','حفظ التغييرات'),
('ar','common','settings.cancel','إلغاء'),
('en','common','settings.title','Settings'),
('en','common','settings.general','General'),
('en','common','settings.notifications','Notifications'),
('en','common','settings.security','Security'),
('en','common','settings.integrations','Integrations'),
('en','common','settings.save','Save Changes'),
('en','common','settings.cancel','Cancel'),

-- Channels
('ar','common','channels.title','إدارة القنوات'),
('ar','common','channels.whatsapp','واتساب'),
('ar','common','channels.telegram','تيليجرام'),
('ar','common','channels.facebook','فيسبوك'),
('ar','common','channels.instagram','إنستغرام'),
('ar','common','channels.twitter','تويتر'),
('ar','common','channels.addChannel','إضافة قناة'),
('ar','common','channels.configure','تكوين'),
('en','common','channels.title','Channel Management'),
('en','common','channels.whatsapp','WhatsApp'),
('en','common','channels.telegram','Telegram'),
('en','common','channels.facebook','Facebook'),
('en','common','channels.instagram','Instagram'),
('en','common','channels.twitter','Twitter'),
('en','common','channels.addChannel','Add Channel'),
('en','common','channels.configure','Configure'),

-- Review Center
('ar','common','review.title','مركز المراجعة'),
('ar','common','review.pending','في الانتظار'),
('ar','common','review.approved','موافق عليه'),
('ar','common','review.rejected','مرفوض'),
('ar','common','review.comments','التعليقات'),
('ar','common','review.approve','موافقة'),
('ar','common','review.reject','رفض'),
('en','common','review.title','Review Center'),
('en','common','review.pending','Pending'),
('en','common','review.approved','Approved'),
('en','common','review.rejected','Rejected'),
('en','common','review.comments','Comments'),
('en','common','review.approve','Approve'),
('en','common','review.reject','Reject'),

-- Common Actions
('ar','common','actions.create','إنشاء'),
('ar','common','actions.edit','تعديل'),
('ar','common','actions.delete','حذف'),
('ar','common','actions.view','عرض'),
('ar','common','actions.search','بحث'),
('ar','common','actions.filter','تصفية'),
('ar','common','actions.export','تصدير'),
('ar','common','actions.import','استيراد'),
('ar','common','actions.refresh','تحديث'),
('en','common','actions.create','Create'),
('en','common','actions.edit','Edit'),
('en','common','actions.delete','Delete'),
('en','common','actions.view','View'),
('en','common','actions.search','Search'),
('en','common','actions.filter','Filter'),
('en','common','actions.export','Export'),
('en','common','actions.import','Import'),
('en','common','actions.refresh','Refresh'),

-- Status Messages
('ar','common','status.success','تم بنجاح'),
('ar','common','status.error','خطأ'),
('ar','common','status.warning','تحذير'),
('ar','common','status.info','معلومات'),
('ar','common','status.loading','جاري التحميل...'),
('ar','common','status.noData','لا توجد بيانات'),
('en','common','status.success','Success'),
('en','common','status.error','Error'),
('en','common','status.warning','Warning'),
('en','common','status.info','Info'),
('en','common','status.loading','Loading...'),
('en','common','status.noData','No data available'),

-- Form Labels
('ar','common','form.name','الاسم'),
('ar','common','form.email','البريد الإلكتروني'),
('ar','common','form.phone','رقم الهاتف'),
('ar','common','form.message','الرسالة'),
('ar','common','form.subject','الموضوع'),
('ar','common','form.required','مطلوب'),
('ar','common','form.optional','اختياري'),
('en','common','form.name','Name'),
('en','common','form.email','Email'),
('en','common','form.phone','Phone'),
('en','common','form.message','Message'),
('en','common','form.subject','Subject'),
('en','common','form.required','Required'),
('en','common','form.optional','Optional'),

-- Time and Date
('ar','common','time.today','اليوم'),
('ar','common','time.yesterday','أمس'),
('ar','common','time.thisWeek','هذا الأسبوع'),
('ar','common','time.thisMonth','هذا الشهر'),
('ar','common','time.thisYear','هذا العام'),
('en','common','time.today','Today'),
('en','common','time.yesterday','Yesterday'),
('en','common','time.thisWeek','This Week'),
('en','common','time.thisMonth','This Month'),
('en','common','time.thisYear','This Year')
on conflict (locale, namespace, key) do nothing;

