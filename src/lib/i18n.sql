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
('ar','common','app.name','معين'),
('ar','common','nav.dashboard','لوحة التحكم'),
('ar','common','nav.conversations','المحادثات'),
('ar','common','nav.flow','منشئ التدفق'),
('ar','common','nav.review','مركز المراجعة'),
('ar','common','nav.settings','الإعدادات'),
('ar','common','nav.users','إدارة الفريق'),
('ar','common','ui.theme','الثيم'),
('ar','common','ui.language','اللغة'),
('ar','home.hero.title','منصة دردشة متعددة القنوات'),
('ar','home.hero.subtitle','مدعومة بالذكاء الاصطناعي'),
('ar','home.hero.ctaPrimary','جرب الآن مجانًا'),
('ar','home.hero.ctaSecondary','اكتشف المميزات'),
('ar','home.features.unifiedChat','دردشة موحدة'),
('ar','home.features.unifiedChat.desc','كل محادثاتك في واجهة واحدة مع بحث وفلاتر ذكية.'),
('ar','home.features.customers','إدارة العملاء'),
('ar','home.features.customers.desc','ملفات تعريف غنية وسجل كامل للتفاعل.'),
('ar','home.features.reports','تقارير ذكية'),
('ar','home.features.reports.desc','لوحات تحكم ومؤشرات أداء لحظية.'),
('ar','home.cta.title','ابدأ اليوم'),
('ar','home.cta.button','إنشاء حساب'),
('en','common','app.name','Mu\'ayin'),
('en','common','nav.dashboard','Dashboard'),
('en','common','nav.conversations','Conversations')
,('en','common','nav.flow','Flow Builder')
,('en','common','nav.review','Review Center')
,('en','common','nav.settings','Settings')
,('en','common','nav.users','Team Management')
,('en','common','ui.theme','Theme')
,('en','common','ui.language','Language')
,('en','home.hero.title','Omnichannel Messaging Platform')
,('en','home.hero.subtitle','AI-powered')
,('en','home.hero.ctaPrimary','Try for free')
,('en','home.hero.ctaSecondary','Explore features')
,('en','home.features.unifiedChat','Unified chat')
,('en','home.features.unifiedChat.desc','All conversations in one UI with smart filters.')
,('en','home.features.customers','Customer management')
,('en','home.features.customers.desc','Rich profiles and complete interaction history.')
,('en','home.features.reports','Smart analytics')
,('en','home.features.reports.desc','Dashboards and real-time KPIs.')
,('en','home.cta.title','Start today')
,('en','home.cta.button','Create account')
on conflict (locale, namespace, key) do nothing;

