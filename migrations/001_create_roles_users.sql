-- create users and roles
CREATE TABLE IF NOT EXISTS users (id serial primary key, email text unique, password_hash text, role text, meta jsonb, created_at timestamptz default now());
CREATE TABLE IF NOT EXISTS roles (role text primary key, description text);
-- Insert all canonical roles
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
ON CONFLICT DO NOTHING;
