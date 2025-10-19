-- ================================================================
-- 🔧 DYNAMIC SETTINGS SYSTEM
-- ================================================================
-- Migration: Create dynamic settings system to replace hardcoded values
-- Date: 2025-01-17
-- Purpose: نظام إعدادات ديناميكي لاستبدال جميع القيم الهارد كودد

-- جدول الإعدادات العامة
CREATE TABLE IF NOT EXISTS system_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key VARCHAR(255) UNIQUE NOT NULL,
  value TEXT,
  type VARCHAR(50) DEFAULT 'string' CHECK (type IN ('string', 'number', 'boolean', 'json', 'email', 'phone', 'url')),
  category VARCHAR(100) NOT NULL,
  description TEXT,
  is_public BOOLEAN DEFAULT false,
  is_encrypted BOOLEAN DEFAULT false,
  validation_rules JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- جدول معلومات المركز الطبي
CREATE TABLE IF NOT EXISTS center_info (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  name_en VARCHAR(255),
  description TEXT,
  description_en TEXT,
  logo_url TEXT,
  address TEXT,
  city VARCHAR(100),
  country VARCHAR(100) DEFAULT 'Saudi Arabia',
  postal_code VARCHAR(20),
  phone VARCHAR(20),
  email VARCHAR(255),
  website VARCHAR(255),
  emergency_phone VARCHAR(20),
  admin_phone VARCHAR(20),
  working_hours JSONB DEFAULT '{}',
  social_media JSONB DEFAULT '{}',
  services JSONB DEFAULT '[]',
  specialties JSONB DEFAULT '[]',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- جدول معلومات الأطباء والموظفين
CREATE TABLE IF NOT EXISTS staff_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  public_id VARCHAR(255) UNIQUE NOT NULL DEFAULT 'stf_' || TO_CHAR(NOW(), 'YYYYMMDD') || '_' || substring(md5(random()::text), 1, 8),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  position VARCHAR(100),
  department VARCHAR(100),
  specialization VARCHAR(100),
  license_number VARCHAR(100),
  phone VARCHAR(20),
  email VARCHAR(255),
  emergency_contact_name VARCHAR(100),
  emergency_contact_phone VARCHAR(20),
  hire_date DATE,
  salary DECIMAL(10,2),
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended', 'terminated')),
  avatar_url TEXT,
  bio TEXT,
  qualifications JSONB DEFAULT '[]',
  certifications JSONB DEFAULT '[]',
  working_schedule JSONB DEFAULT '{}',
  is_emergency_contact BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- جدول معلومات الاتصال الطارئة
CREATE TABLE IF NOT EXISTS emergency_contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  type VARCHAR(50) NOT NULL CHECK (type IN ('medical', 'crisis', 'admin', 'security', 'technical')),
  priority INTEGER DEFAULT 1 CHECK (priority >= 1 AND priority <= 5),
  is_available_24_7 BOOLEAN DEFAULT false,
  working_hours JSONB DEFAULT '{}',
  notes TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- جدول إعدادات التطبيق الديناميكية
CREATE TABLE IF NOT EXISTS app_configurations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  config_key VARCHAR(255) UNIQUE NOT NULL,
  config_value TEXT,
  config_type VARCHAR(50) DEFAULT 'string' CHECK (config_type IN ('string', 'number', 'boolean', 'json', 'array')),
  category VARCHAR(100) NOT NULL,
  description TEXT,
  is_public BOOLEAN DEFAULT false,
  validation_rules JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- جدول إعدادات التكاملات الخارجية
CREATE TABLE IF NOT EXISTS integration_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  integration_name VARCHAR(100) NOT NULL,
  integration_type VARCHAR(50) NOT NULL CHECK (integration_type IN ('whatsapp', 'email', 'sms', 'payment', 'analytics', 'ai')),
  config_data JSONB NOT NULL DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  last_tested_at TIMESTAMPTZ,
  health_score INTEGER DEFAULT 0 CHECK (health_score >= 0 AND health_score <= 100),
  error_count INTEGER DEFAULT 0,
  last_error TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- إنشاء فهارس لتحسين الأداء
CREATE INDEX IF NOT EXISTS idx_system_settings_category ON system_settings(category);
CREATE INDEX IF NOT EXISTS idx_system_settings_key ON system_settings(key);
CREATE INDEX IF NOT EXISTS idx_staff_members_status ON staff_members(status);
CREATE INDEX IF NOT EXISTS idx_staff_members_department ON staff_members(department);
CREATE INDEX IF NOT EXISTS idx_emergency_contacts_type ON emergency_contacts(type);
CREATE INDEX IF NOT EXISTS idx_emergency_contacts_priority ON emergency_contacts(priority);
CREATE INDEX IF NOT EXISTS idx_app_configurations_category ON app_configurations(category);
CREATE INDEX IF NOT EXISTS idx_integration_settings_type ON integration_settings(integration_type);

-- إدراج البيانات الافتراضية
INSERT INTO system_settings (key, value, type, category, description, is_public) VALUES
('app_name', 'Mu3een', 'string', 'general', 'اسم التطبيق', true),
('app_version', '1.0.0', 'string', 'general', 'إصدار التطبيق', true),
('app_description', 'منصة دردشة متعددة القنوات مدعومة بالذكاء الاصطناعي', 'string', 'general', 'وصف التطبيق', true),
('upload_max_size', '10485760', 'number', 'file', 'الحد الأقصى لحجم الملفات (بايت)', false),
('upload_allowed_types', '["image/jpeg", "image/png", "image/gif"]', 'json', 'file', 'أنواع الملفات المسموحة', false),
('rate_limit_window_ms', '900000', 'number', 'security', 'نافذة تحديد المعدل (ملي ثانية)', false),
('rate_limit_max_requests', '100', 'number', 'security', 'الحد الأقصى للطلبات في النافذة', false),
('jwt_expires_in', '7d', 'string', 'auth', 'مدة انتهاء صلاحية JWT', false),
('refresh_token_expires_in', '30d', 'string', 'auth', 'مدة انتهاء صلاحية Refresh Token', false),
('enable_analytics', 'true', 'boolean', 'features', 'تفعيل التحليلات', false),
('enable_debug', 'false', 'boolean', 'features', 'تفعيل وضع التصحيح', false),
('enable_ai', 'true', 'boolean', 'features', 'تفعيل الذكاء الاصطناعي', false);

-- إدراج معلومات المركز الافتراضية
INSERT INTO center_info (name, name_en, description, phone, email, emergency_phone, admin_phone, city, services, specialties) VALUES
('مركز الهمام للرعاية الصحية', 'Al-Hemam Healthcare Center', 'مركز متخصص في الرعاية الصحية والتأهيل', '+966501234567', 'info@alhemam.sa', '+966501234567', '+966501234568', 'جدة', 
'["استشارات طبية", "علاج طبيعي", "طب نفسي", "علاج نطق", "تأهيل"]',
'["التوحد", "متلازمة داون", "تأخر النطق", "التأهيل الحركي", "الطب النفسي للأطفال"]');

-- إدراج جهات الاتصال الطارئة الافتراضية
INSERT INTO emergency_contacts (name, phone, type, priority, is_available_24_7) VALUES
('الطوارئ الطبية', '+966501234567', 'medical', 1, true),
('الطوارئ الإدارية', '+966501234568', 'admin', 2, true),
('الطوارئ النفسية', '997', 'crisis', 1, true),
('الدعم الفني', '+966501234569', 'technical', 3, false);

-- إدراج إعدادات التطبيق الافتراضية
INSERT INTO app_configurations (config_key, config_value, config_type, category, description) VALUES
('api_timeout', '30000', 'number', 'api', 'مهلة API (ملي ثانية)'),
('api_retries', '3', 'number', 'api', 'عدد المحاولات للـ API'),
('cors_origins', '["http://localhost:3000", "http://localhost:3001"]', 'json', 'api', 'أصول CORS المسموحة'),
('log_level', 'info', 'string', 'logging', 'مستوى السجلات'),
('backup_frequency', 'daily', 'string', 'backup', 'تكرار النسخ الاحتياطي'),
('session_timeout', '3600', 'number', 'auth', 'مهلة الجلسة (ثانية)');

-- إنشاء دوال مساعدة
CREATE OR REPLACE FUNCTION get_system_setting(setting_key VARCHAR(255))
RETURNS TEXT AS $$
BEGIN
  RETURN (SELECT value FROM system_settings WHERE key = setting_key);
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION get_app_config(config_key VARCHAR(255))
RETURNS TEXT AS $$
BEGIN
  RETURN (SELECT config_value FROM app_configurations WHERE config_key = config_key);
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION get_center_info()
RETURNS JSON AS $$
BEGIN
  RETURN (SELECT row_to_json(center_info) FROM center_info WHERE is_active = true LIMIT 1);
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION get_emergency_contacts(contact_type VARCHAR(50) DEFAULT NULL)
RETURNS JSON AS $$
BEGIN
  IF contact_type IS NULL THEN
    RETURN (SELECT json_agg(row_to_json(emergency_contacts)) FROM emergency_contacts WHERE is_active = true ORDER BY priority);
  ELSE
    RETURN (SELECT json_agg(row_to_json(emergency_contacts)) FROM emergency_contacts WHERE type = contact_type AND is_active = true ORDER BY priority);
  END IF;
END;
$$ LANGUAGE plpgsql;

-- إنشاء triggers للتحديث التلقائي
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_system_settings_updated_at BEFORE UPDATE ON system_settings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_center_info_updated_at BEFORE UPDATE ON center_info FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_staff_members_updated_at BEFORE UPDATE ON staff_members FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_emergency_contacts_updated_at BEFORE UPDATE ON emergency_contacts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_app_configurations_updated_at BEFORE UPDATE ON app_configurations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_integration_settings_updated_at BEFORE UPDATE ON integration_settings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- إنشاء RLS policies
ALTER TABLE system_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE center_info ENABLE ROW LEVEL SECURITY;
ALTER TABLE staff_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE emergency_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE app_configurations ENABLE ROW LEVEL SECURITY;
ALTER TABLE integration_settings ENABLE ROW LEVEL SECURITY;

-- سياسات الأمان للقراءة العامة
CREATE POLICY "Public read access for public settings" ON system_settings FOR SELECT USING (is_public = true);
CREATE POLICY "Public read access for center info" ON center_info FOR SELECT USING (is_active = true);
CREATE POLICY "Public read access for emergency contacts" ON emergency_contacts FOR SELECT USING (is_active = true);

-- سياسات الأمان للمدراء
CREATE POLICY "Admin full access to system settings" ON system_settings FOR ALL USING (
  EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role = 'admin')
);

CREATE POLICY "Admin full access to center info" ON center_info FOR ALL USING (
  EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role = 'admin')
);

CREATE POLICY "Admin full access to staff members" ON staff_members FOR ALL USING (
  EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role = 'admin')
);

CREATE POLICY "Admin full access to emergency contacts" ON emergency_contacts FOR ALL USING (
  EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role = 'admin')
);

CREATE POLICY "Admin full access to app configurations" ON app_configurations FOR ALL USING (
  EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role = 'admin')
);

CREATE POLICY "Admin full access to integration settings" ON integration_settings FOR ALL USING (
  EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role = 'admin')
);

-- سياسات الأمان للموظفين
CREATE POLICY "Staff read access to staff members" ON staff_members FOR SELECT USING (
  EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role IN ('admin', 'agent', 'staff'))
);

CREATE POLICY "Staff read access to emergency contacts" ON emergency_contacts FOR SELECT USING (
  EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role IN ('admin', 'agent', 'staff'))
);

COMMENT ON TABLE system_settings IS 'جدول الإعدادات العامة للنظام - يحل محل القيم الهارد كودد';
COMMENT ON TABLE center_info IS 'معلومات المركز الطبي - بيانات ديناميكية';
COMMENT ON TABLE staff_members IS 'أعضاء الفريق الطبي والإداري';
COMMENT ON TABLE emergency_contacts IS 'جهات الاتصال الطارئة';
COMMENT ON TABLE app_configurations IS 'إعدادات التطبيق الديناميكية';
COMMENT ON TABLE integration_settings IS 'إعدادات التكاملات الخارجية';

