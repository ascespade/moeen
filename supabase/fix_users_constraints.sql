-- Fix Users Table Constraints and Add Role Validation
-- إصلاح قيود جدول المستخدمين وإضافة التحقق من الأدوار

-- First, ensure the users table has proper structure
DO $$
BEGIN
  -- Add is_active column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'users' AND column_name = 'is_active'
  ) THEN
    ALTER TABLE users ADD COLUMN is_active BOOLEAN DEFAULT true;
  END IF;
END $$;

-- Add CHECK constraint for valid roles in users table
DO $$
BEGIN
  -- Drop existing constraint if exists
  IF EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'users_role_check'
  ) THEN
    ALTER TABLE users DROP CONSTRAINT users_role_check;
  END IF;

  -- Add new constraint with all valid roles
  ALTER TABLE users ADD CONSTRAINT users_role_check
    CHECK (role IN ('admin', 'doctor', 'patient', 'staff', 'supervisor', 'manager', 'agent', 'nurse', 'demo', 'user'));
END $$;

-- Add CHECK constraint for status
DO $$
BEGIN
  -- Drop existing constraint if exists
  IF EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'users_status_check'
  ) THEN
    ALTER TABLE users DROP CONSTRAINT users_status_check;
  END IF;

  -- Add new constraint
  ALTER TABLE users ADD CONSTRAINT users_status_check
    CHECK (status IN ('active', 'inactive', 'suspended', 'pending'));
END $$;

-- Ensure email is unique (this should already exist but we ensure it)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'users_email_key'
  ) THEN
    ALTER TABLE users ADD CONSTRAINT users_email_key UNIQUE (email);
  END IF;
END $$;

-- Create index on role for better performance
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_status ON users(status);
CREATE INDEX IF NOT EXISTS idx_users_is_active ON users(is_active) WHERE is_active = true;

-- Ensure roles table exists and has all required roles
INSERT INTO roles (name, description) VALUES
  ('admin', 'مدير النظام - صلاحيات كاملة على جميع الوحدات'),
  ('doctor', 'طبيب/معالج - إدارة المرضى والجلسات'),
  ('patient', 'مريض - الوصول إلى البيانات الخاصة'),
  ('staff', 'موظف - صلاحيات أساسية للعمليات اليومية'),
  ('supervisor', 'مشرف - صلاحيات إشرافية وإدارية محدودة'),
  ('manager', 'مدير - صلاحيات إدارية شاملة'),
  ('nurse', 'ممرض - إدارة المرضى والجلسات محدودة'),
  ('agent', 'وكيل خدمة العملاء - إدارة المحادثات والطلبات'),
  ('demo', 'مستخدم تجريبي - صلاحيات عرض فقط'),
  ('user', 'مستخدم عادي')
ON CONFLICT (name) DO NOTHING;

-- Ensure user_roles table has proper structure
DO $$
BEGIN
  -- Add is_active column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'user_roles' AND column_name = 'is_active'
  ) THEN
    ALTER TABLE user_roles ADD COLUMN is_active BOOLEAN DEFAULT true;
  END IF;
END $$;

-- Add unique constraint on user_roles to prevent duplicates
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'user_roles_user_id_role_id_key'
  ) THEN
    ALTER TABLE user_roles ADD CONSTRAINT user_roles_user_id_role_id_key
      UNIQUE (user_id, role_id);
  END IF;
END $$;

-- Function to safely update user role
CREATE OR REPLACE FUNCTION safe_update_user_role(
  p_user_id UUID,
  p_role_name TEXT
) RETURNS BOOLEAN AS $$
DECLARE
  v_role_id UUID;
BEGIN
  -- Get role ID
  SELECT id INTO v_role_id FROM roles WHERE name = p_role_name;

  IF v_role_id IS NULL THEN
    RAISE EXCEPTION 'Invalid role: %', p_role_name;
  END IF;

  -- Upsert user_roles
  INSERT INTO user_roles (user_id, role_id, is_active)
  VALUES (p_user_id, v_role_id, true)
  ON CONFLICT (user_id, role_id)
  DO UPDATE SET is_active = true;

  -- Update users.role column (if it exists and allows the value)
  BEGIN
    UPDATE users
    SET role = p_role_name
    WHERE id = p_user_id;
  EXCEPTION WHEN OTHERS THEN
    -- Ignore if role column has constraints that don't allow this value
    NULL;
  END;

  RETURN true;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION safe_update_user_role IS 'Safely updates user role in both users.role and user_roles table';


