-- ===================================================
-- COMPLETE SEED DATA
-- Moeen Healthcare Management System
-- ===================================================

-- Insert canonical roles
INSERT INTO roles (role, description) VALUES 
  ('patient','مريض - الوصول إلى البيانات الخاصة'),
  ('doctor','طبيب/معالج - إدارة المرضى والجلسات'),
  ('staff','موظف - صلاحيات أساسية للعمليات اليومية'),
  ('supervisor','مشرف - صلاحيات إشرافية وإدارية محدودة'),
  ('admin','مدير النظام - صلاحيات كاملة على جميع الوحدات'),
  ('manager','مدير - صلاحيات إدارية شاملة'),
  ('nurse','ممرض - إدارة المرضى والجلسات محدودة'),
  ('agent','وكيل خدمة العملاء - إدارة المحادثات والطلبات'),
  ('demo','مستخدم تجريبي - صلاحيات عرض فقط')
ON CONFLICT (role) DO NOTHING;

-- Insert default languages
INSERT INTO languages (code, name, is_default, direction) VALUES
    ('ar', 'العربية', TRUE, 'rtl'),
    ('en', 'English', FALSE, 'ltr')
ON CONFLICT (code) DO NOTHING;

-- Insert basic translations (Arabic)
INSERT INTO translations (lang_code, key, value) VALUES
    ('ar', 'welcome', 'مرحباً'),
    ('ar', 'login', 'تسجيل الدخول'),
    ('ar', 'logout', 'تسجيل الخروج'),
    ('ar', 'dashboard', 'لوحة التحكم'),
    ('ar', 'patients', 'المرضى'),
    ('ar', 'doctors', 'الأطباء'),
    ('ar', 'appointments', 'المواعيد')
ON CONFLICT DO NOTHING;

-- Insert basic translations (English)
INSERT INTO translations (lang_code, key, value) VALUES
    ('en', 'welcome', 'Welcome'),
    ('en', 'login', 'Login'),
    ('en', 'logout', 'Logout'),
    ('en', 'dashboard', 'Dashboard'),
    ('en', 'patients', 'Patients'),
    ('en', 'doctors', 'Doctors'),
    ('en', 'appointments', 'Appointments')
ON CONFLICT DO NOTHING;

