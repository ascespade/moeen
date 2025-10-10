-- Migration: Create Dynamic Content Tables
-- Date: 2024-01-15
-- Description: Creates tables for dynamic content management, user preferences, and enhanced translations

-- Create user_preferences table
CREATE TABLE IF NOT EXISTS user_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  public_id VARCHAR(255) UNIQUE NOT NULL,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  theme VARCHAR(20) DEFAULT 'system' CHECK (theme IN ('light', 'dark', 'system')),
  language VARCHAR(5) DEFAULT 'ar' CHECK (language IN ('ar', 'en')),
  font_size VARCHAR(10) DEFAULT 'md' CHECK (font_size IN ('sm', 'md', 'lg')),
  direction VARCHAR(3) DEFAULT 'rtl' CHECK (direction IN ('ltr', 'rtl')),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Create enhanced translations table (if not exists)
CREATE TABLE IF NOT EXISTS translations (
  id BIGSERIAL PRIMARY KEY,
  locale TEXT NOT NULL CHECK (locale IN ('ar','en')),
  namespace TEXT NOT NULL DEFAULT 'common',
  key TEXT NOT NULL,
  value TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(locale, namespace, key)
);

-- Enable RLS on new tables
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE translations ENABLE ROW LEVEL SECURITY;

-- RLS policies for user_preferences
CREATE POLICY "Users can view own preferences" ON user_preferences
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own preferences" ON user_preferences
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own preferences" ON user_preferences
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS policies for translations
CREATE POLICY "Allow read to anon" ON translations
  FOR SELECT USING (true);

CREATE POLICY "Service write" ON translations
  FOR ALL USING (auth.role() = 'service_role') WITH CHECK (auth.role() = 'service_role');

-- Insert default user preferences in settings
INSERT INTO settings (key, value, description, category, is_public) VALUES
('default_user_preferences', 
 '{"theme": "system", "language": "ar", "fontSize": "md", "direction": "rtl"}',
 'Default user preferences for new users',
 'user',
 true),
('theme_config',
 '{"mode": "system", "primaryColor": "#F58220", "secondaryColor": "#009688", "accentColor": "#007BFF", "borderRadius": "0.5rem", "fontFamily": "var(--font-cairo)"}',
 'Global theme configuration',
 'theme',
 true)
ON CONFLICT (key) DO UPDATE SET
  value = EXCLUDED.value,
  updated_at = NOW();

-- Insert homepage content settings
INSERT INTO settings (key, value, description, category, is_public) VALUES
('homepage_hero_slides',
 '[]',
 'Homepage hero slides content',
 'homepage',
 true),
('homepage_services',
 '[]',
 'Homepage services content',
 'homepage',
 true),
('homepage_testimonials',
 '[]',
 'Homepage testimonials content',
 'homepage',
 true),
('homepage_gallery',
 '[]',
 'Homepage gallery images',
 'homepage',
 true),
('homepage_faqs',
 '[]',
 'Homepage FAQ content',
 'homepage',
 true)
ON CONFLICT (key) DO UPDATE SET
  value = EXCLUDED.value,
  updated_at = NOW();

-- Insert comprehensive translations
INSERT INTO translations (locale, namespace, key, value) VALUES
-- Homepage translations
('ar', 'common', 'homepage.services.title', 'خدماتنا المتكاملة'),
('ar', 'common', 'homepage.services.subtitle', 'نقدم مجموعة شاملة من الخدمات الصحية المتطورة لضمان أفضل رعاية لمرضانا'),
('ar', 'common', 'homepage.testimonials.title', 'آراء عملائنا'),
('ar', 'common', 'homepage.testimonials.subtitle', 'اكتشف ما يقوله عملاؤنا عن خدماتنا'),
('ar', 'common', 'homepage.gallery.title', 'معرض الصور'),
('ar', 'common', 'homepage.gallery.subtitle', 'اكتشف بيئة العمل المتطورة في عياداتنا'),
('ar', 'common', 'homepage.faq.title', 'الأسئلة الشائعة'),
('ar', 'common', 'homepage.faq.subtitle', 'إجابات على أكثر الأسئلة شيوعاً'),
('ar', 'common', 'homepage.contact.title', 'ابدأ رحلتك الصحية معنا'),
('ar', 'common', 'homepage.contact.subtitle', 'احجز موعدك اليوم واستمتع بأفضل الخدمات الصحية'),

('en', 'common', 'homepage.services.title', 'Our Integrated Services'),
('en', 'common', 'homepage.services.subtitle', 'We provide a comprehensive range of advanced healthcare services to ensure the best care for our patients'),
('en', 'common', 'homepage.testimonials.title', 'Client Testimonials'),
('en', 'common', 'homepage.testimonials.subtitle', 'Discover what our clients say about our services'),
('en', 'common', 'homepage.gallery.title', 'Photo Gallery'),
('en', 'common', 'homepage.gallery.subtitle', 'Discover the advanced work environment in our clinics'),
('en', 'common', 'homepage.faq.title', 'Frequently Asked Questions'),
('en', 'common', 'homepage.faq.subtitle', 'Answers to the most common questions'),
('en', 'common', 'homepage.contact.title', 'Start Your Health Journey With Us'),
('en', 'common', 'homepage.contact.subtitle', 'Book your appointment today and enjoy the best healthcare services'),

-- Theme translations
('ar', 'common', 'theme.label', 'الثيم'),
('ar', 'common', 'theme.light', 'الوضع المضيء'),
('ar', 'common', 'theme.dark', 'الوضع المظلم'),
('ar', 'common', 'theme.system', 'النظام'),

('en', 'common', 'theme.label', 'Theme'),
('en', 'common', 'theme.light', 'Light Mode'),
('en', 'common', 'theme.dark', 'Dark Mode'),
('en', 'common', 'theme.system', 'System'),

-- Language translations
('ar', 'common', 'language.label', 'اللغة'),
('ar', 'common', 'language.arabic', 'العربية'),
('ar', 'common', 'language.english', 'الإنجليزية'),

('en', 'common', 'language.label', 'Language'),
('en', 'common', 'language.arabic', 'Arabic'),
('en', 'common', 'language.english', 'English')
ON CONFLICT (locale, namespace, key) DO UPDATE SET
  value = EXCLUDED.value,
  updated_at = NOW();

-- Add comments for documentation
COMMENT ON TABLE user_preferences IS 'User-specific preferences for theme, language, and UI settings';
COMMENT ON TABLE translations IS 'Dynamic translations for internationalization';
COMMENT ON COLUMN user_preferences.theme IS 'User theme preference: light, dark, or system';
COMMENT ON COLUMN user_preferences.language IS 'User language preference: ar or en';
COMMENT ON COLUMN user_preferences.font_size IS 'User font size preference: sm, md, or lg';
COMMENT ON COLUMN user_preferences.direction IS 'Text direction: ltr or rtl';