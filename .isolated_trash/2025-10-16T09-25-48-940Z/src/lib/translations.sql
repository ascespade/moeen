-- إنشاء جدول الترجمات
CREATE TABLE IF NOT EXISTS translations (
  id SERIAL PRIMARY KEY,
  key VARCHAR(255) NOT NULL,
  value TEXT NOT NULL,
  locale VARCHAR(10) NOT NULL DEFAULT 'ar',
  namespace VARCHAR(50) NOT NULL DEFAULT 'common',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(key, locale, namespace)
);

-- إدراج الترجمات الأساسية
INSERT INTO translations (key, value, locale, namespace) VALUES
-- الصفحة الرئيسية - العربية
('home.hero.title', 'منصة دردشة متعددة القنوات', 'ar', 'common'),
('home.hero.subtitle', 'مدعومة بالذكاء الاصطناعي', 'ar', 'common'),
('home.hero.ctaPrimary', 'جرب الآن مجانًا', 'ar', 'common'),
('home.hero.ctaSecondary', 'اكتشف المميزات', 'ar', 'common'),
('home.features.unifiedChat', 'دردشة موحدة', 'ar', 'common'),
('home.features.unifiedChat.desc', 'كل محادثاتك في واجهة واحدة مع بحث وفلاتر ذكية.', 'ar', 'common'),
('home.features.customers', 'إدارة العملاء', 'ar', 'common'),
('home.features.customers.desc', 'ملفات تعريف غنية وسجل كامل للتفاعل.', 'ar', 'common'),
('home.features.reports', 'تقارير ذكية', 'ar', 'common'),
('home.features.reports.desc', 'لوحات تحكم ومؤشرات أداء لحظية.', 'ar', 'common'),
('home.cta.title', 'ابدأ اليوم', 'ar', 'common'),
('home.cta.button', 'إنشاء حساب', 'ar', 'common'),

-- الصفحة الرئيسية - الإنجليزية
('home.hero.title', 'Multi-Channel Chat Platform', 'en', 'common'),
('home.hero.subtitle', 'Powered by Artificial Intelligence', 'en', 'common'),
('home.hero.ctaPrimary', 'Try Now for Free', 'en', 'common'),
('home.hero.ctaSecondary', 'Discover Features', 'en', 'common'),
('home.features.unifiedChat', 'Unified Chat', 'en', 'common'),
('home.features.unifiedChat.desc', 'All your conversations in one interface with smart search and filters.', 'en', 'common'),
('home.features.customers', 'Customer Management', 'en', 'common'),
('home.features.customers.desc', 'Rich profiles and complete interaction history.', 'en', 'common'),
('home.features.reports', 'Smart Reports', 'en', 'common'),
('home.features.reports.desc', 'Real-time dashboards and performance indicators.', 'en', 'common'),
('home.cta.title', 'Start Today', 'en', 'common'),
('home.cta.button', 'Create Account', 'en', 'common')
ON CONFLICT (key, locale, namespace) DO UPDATE SET
  value = EXCLUDED.value,
  updated_at = NOW();
