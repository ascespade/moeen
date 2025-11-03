-- ===================================================
-- Enhanced Authentication & Permissions System
-- نظام محسّن للمصادقة والصلاحيات
-- ===================================================

-- Step 1: Ensure all tables exist with proper structure
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Permissions table (if not exists)
CREATE TABLE IF NOT EXISTS permissions (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  code character varying NOT NULL UNIQUE,
  name character varying NOT NULL,
  description text,
  category character varying,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT permissions_pkey PRIMARY KEY (id)
);

-- Roles table (if not exists)
CREATE TABLE IF NOT EXISTS roles (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  name character varying NOT NULL UNIQUE,
  display_name character varying NOT NULL,
  description text,
  permissions jsonb DEFAULT '{}'::jsonb,
  is_system_role boolean DEFAULT false,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT roles_pkey PRIMARY KEY (id)
);

-- Role permissions junction table
CREATE TABLE IF NOT EXISTS role_permissions (
  role_id uuid NOT NULL,
  permission_id uuid NOT NULL,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT role_permissions_pkey PRIMARY KEY (role_id, permission_id),
  CONSTRAINT role_permissions_role_id_fkey FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE,
  CONSTRAINT role_permissions_permission_id_fkey FOREIGN KEY (permission_id) REFERENCES permissions(id) ON DELETE CASCADE
);

-- User roles junction table
CREATE TABLE IF NOT EXISTS user_roles (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL,
  role_id uuid NOT NULL,
  assigned_by uuid,
  assigned_at timestamp with time zone DEFAULT now(),
  expires_at timestamp with time zone,
  is_active boolean DEFAULT true,
  CONSTRAINT user_roles_pkey PRIMARY KEY (id),
  CONSTRAINT user_roles_user_id_fkey FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT user_roles_role_id_fkey FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE,
  CONSTRAINT user_roles_assigned_by_fkey FOREIGN KEY (assigned_by) REFERENCES users(id) ON DELETE SET NULL
);

-- User permissions (direct permissions override)
CREATE TABLE IF NOT EXISTS user_permissions (
  user_id uuid NOT NULL,
  permission_id uuid NOT NULL,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT user_permissions_pkey PRIMARY KEY (user_id, permission_id),
  CONSTRAINT user_permissions_user_id_fkey FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT user_permissions_permission_id_fkey FOREIGN KEY (permission_id) REFERENCES permissions(id) ON DELETE CASCADE
);

-- Step 2: Create essential permissions
INSERT INTO permissions (code, name, description, category) VALUES
  ('dashboard.view', 'View Dashboard', 'Can access dashboard', 'dashboard'),
  ('dashboard.manage', 'Manage Dashboard', 'Can manage dashboard settings', 'dashboard'),
  
  ('users.create', 'Create Users', 'Can create new users', 'users'),
  ('users.read', 'Read Users', 'Can view users list and details', 'users'),
  ('users.update', 'Update Users', 'Can update user information', 'users'),
  ('users.delete', 'Delete Users', 'Can delete users', 'users'),
  ('users.manage_roles', 'Manage User Roles', 'Can assign roles to users', 'users'),
  
  ('patients.create', 'Create Patients', 'Can create patient records', 'patients'),
  ('patients.read', 'Read Patients', 'Can view patient records', 'patients'),
  ('patients.update', 'Update Patients', 'Can update patient records', 'patients'),
  ('patients.delete', 'Delete Patients', 'Can delete patient records', 'patients'),
  
  ('appointments.create', 'Create Appointments', 'Can create appointments', 'appointments'),
  ('appointments.read', 'Read Appointments', 'Can view appointments', 'appointments'),
  ('appointments.update', 'Update Appointments', 'Can update appointments', 'appointments'),
  ('appointments.delete', 'Delete Appointments', 'Can delete appointments', 'appointments'),
  ('appointments.manage', 'Manage Appointments', 'Full appointment management', 'appointments'),
  
  ('medical_records.read', 'Read Medical Records', 'Can view medical records', 'medical'),
  ('medical_records.create', 'Create Medical Records', 'Can create medical records', 'medical'),
  ('medical_records.update', 'Update Medical Records', 'Can update medical records', 'medical'),
  
  ('settings.view', 'View Settings', 'Can view system settings', 'settings'),
  ('settings.manage', 'Manage Settings', 'Can modify system settings', 'settings'),
  
  ('reports.view', 'View Reports', 'Can view reports', 'reports'),
  ('reports.generate', 'Generate Reports', 'Can generate new reports', 'reports'),
  
  ('admin.access', 'Admin Access', 'Can access admin panel', 'admin'),
  ('admin.manage_users', 'Admin Manage Users', 'Admin can manage all users', 'admin'),
  ('admin.manage_system', 'Admin Manage System', 'Admin can manage system settings', 'admin')
ON CONFLICT (code) DO NOTHING;

-- Step 3: Create roles
INSERT INTO roles (name, display_name, description, is_system_role) VALUES
  ('admin', 'Administrator', 'Full system access and management', true),
  ('manager', 'Manager', 'Management and oversight access', true),
  ('supervisor', 'Supervisor', 'Supervisory and coordination access', true),
  ('agent', 'Agent', 'Standard user access', true),
  ('doctor', 'Doctor', 'Doctor-specific access', true),
  ('patient', 'Patient', 'Patient portal access', true),
  ('staff', 'Staff', 'Staff member access', true)
ON CONFLICT (name) DO NOTHING;

-- Step 4: Assign permissions to admin (all permissions)
DO $$
DECLARE
  admin_role_id uuid;
  perm_record RECORD;
BEGIN
  SELECT id INTO admin_role_id FROM roles WHERE name = 'admin';
  
  IF admin_role_id IS NOT NULL THEN
    FOR perm_record IN SELECT id FROM permissions WHERE is_active = true LOOP
      INSERT INTO role_permissions (role_id, permission_id, is_active)
      VALUES (admin_role_id, perm_record.id, true)
      ON CONFLICT (role_id, permission_id) DO UPDATE SET is_active = true;
    END LOOP;
  END IF;
END $$;

-- Step 5: Assign permissions to manager
DO $$
DECLARE
  manager_role_id uuid;
  perm_codes text[] := ARRAY[
    'dashboard.view', 'dashboard.manage',
    'users.read', 'users.update',
    'patients.read', 'patients.update',
    'appointments.create', 'appointments.read', 'appointments.update', 'appointments.manage',
    'medical_records.read',
    'settings.view',
    'reports.view', 'reports.generate'
  ];
  perm_record RECORD;
BEGIN
  SELECT id INTO manager_role_id FROM roles WHERE name = 'manager';
  
  IF manager_role_id IS NOT NULL THEN
    FOR perm_record IN SELECT id FROM permissions WHERE code = ANY(perm_codes) LOOP
      INSERT INTO role_permissions (role_id, permission_id, is_active)
      VALUES (manager_role_id, perm_record.id, true)
      ON CONFLICT (role_id, permission_id) DO UPDATE SET is_active = true;
    END LOOP;
  END IF;
END $$;

-- Step 6: Assign permissions to supervisor
DO $$
DECLARE
  supervisor_role_id uuid;
  perm_codes text[] := ARRAY[
    'dashboard.view',
    'patients.read', 'patients.update',
    'appointments.create', 'appointments.read', 'appointments.update',
    'medical_records.read', 'medical_records.create', 'medical_records.update'
  ];
  perm_record RECORD;
BEGIN
  SELECT id INTO supervisor_role_id FROM roles WHERE name = 'supervisor';
  
  IF supervisor_role_id IS NOT NULL THEN
    FOR perm_record IN SELECT id FROM permissions WHERE code = ANY(perm_codes) LOOP
      INSERT INTO role_permissions (role_id, permission_id, is_active)
      VALUES (supervisor_role_id, perm_record.id, true)
      ON CONFLICT (role_id, permission_id) DO UPDATE SET is_active = true;
    END LOOP;
  END IF;
END $$;

-- Step 7: Assign permissions to agent (basic access)
DO $$
DECLARE
  agent_role_id uuid;
  perm_codes text[] := ARRAY[
    'dashboard.view',
    'patients.read',
    'appointments.read', 'appointments.create'
  ];
  perm_record RECORD;
BEGIN
  SELECT id INTO agent_role_id FROM roles WHERE name = 'agent';
  
  IF agent_role_id IS NOT NULL THEN
    FOR perm_record IN SELECT id FROM permissions WHERE code = ANY(perm_codes) LOOP
      INSERT INTO role_permissions (role_id, permission_id, is_active)
      VALUES (agent_role_id, perm_record.id, true)
      ON CONFLICT (role_id, permission_id) DO UPDATE SET is_active = true;
    END LOOP;
  END IF;
END $$;

-- Step 8: Create database functions
CREATE OR REPLACE FUNCTION verify_password(
  password_input TEXT,
  password_hash TEXT
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN crypt(password_input, password_hash) = password_hash;
EXCEPTION
  WHEN OTHERS THEN
    RETURN FALSE;
END;
$$;

CREATE OR REPLACE FUNCTION hash_password(
  password_input TEXT
)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN crypt(password_input, gen_salt('bf'));
EXCEPTION
  WHEN OTHERS THEN
    RETURN NULL;
END;
$$;

GRANT EXECUTE ON FUNCTION verify_password(TEXT, TEXT) TO authenticated, anon, service_role;
GRANT EXECUTE ON FUNCTION hash_password(TEXT) TO authenticated, anon, service_role;

-- Step 9: Function to get user permissions (optimized)
CREATE OR REPLACE FUNCTION get_user_permissions(user_id_param uuid)
RETURNS TABLE (
  permission_code varchar,
  resource varchar,
  action varchar
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  WITH user_role_perms AS (
    -- Get permissions from user's roles
    SELECT DISTINCT p.code
    FROM user_roles ur
    JOIN role_permissions rp ON ur.role_id = rp.role_id AND rp.is_active = true
    JOIN permissions p ON rp.permission_id = p.id AND p.is_active = true
    WHERE ur.user_id = user_id_param
      AND ur.is_active = true
  ),
  direct_perms AS (
    -- Get direct user permissions
    SELECT DISTINCT p.code
    FROM user_permissions up
    JOIN permissions p ON up.permission_id = p.id AND p.is_active = true
    WHERE up.user_id = user_id_param
      AND up.is_active = true
  ),
  all_perms AS (
    SELECT code FROM user_role_perms
    UNION
    SELECT code FROM direct_perms
  )
  SELECT 
    ap.code as permission_code,
    SPLIT_PART(ap.code, '.', 1) as resource,
    SPLIT_PART(ap.code, '.', 2) as action
  FROM all_perms ap
  ORDER BY ap.code;
END;
$$;

GRANT EXECUTE ON FUNCTION get_user_permissions(uuid) TO authenticated, anon, service_role;

-- Step 10: Ensure test users have passwords and roles
DO $$
DECLARE
  user_record RECORD;
  role_record RECORD;
BEGIN
  FOR user_record IN SELECT id, email, role::text as role_name FROM users WHERE email LIKE '%@test.com' LOOP
    -- Update password if missing
    UPDATE users
    SET password_hash = CASE
      WHEN email = 'admin@test.com' THEN crypt('Admin123!', gen_salt('bf'))
      WHEN email = 'doctor@test.com' THEN crypt('Doctor123!', gen_salt('bf'))
      WHEN email = 'patient@test.com' THEN crypt('Patient123!', gen_salt('bf'))
      WHEN email = 'staff@test.com' THEN crypt('Staff123!', gen_salt('bf'))
      ELSE password_hash
    END
    WHERE id = user_record.id AND (password_hash IS NULL OR password_hash = '');
    
    -- Assign role based on email
    SELECT id INTO role_record FROM roles WHERE 
      CASE 
        WHEN user_record.email = 'admin@test.com' THEN name = 'admin'
        WHEN user_record.email LIKE '%doctor%' THEN name = 'agent'
        WHEN user_record.email LIKE '%patient%' THEN name = 'agent'
        WHEN user_record.email LIKE '%staff%' THEN name = 'agent'
        ELSE name = 'agent'
      END;
    
    IF role_record.id IS NOT NULL THEN
      INSERT INTO user_roles (user_id, role_id, is_active)
      VALUES (user_record.id, role_record.id, true)
      ON CONFLICT DO NOTHING;
    END IF;
  END LOOP;
END $$;

-- Step 11: Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_roles_user_id ON user_roles(user_id) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_user_roles_role_id ON user_roles(role_id) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_role_permissions_role_id ON role_permissions(role_id) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_user_permissions_user_id ON user_permissions(user_id) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_status ON users(status) WHERE status = 'active';

-- Step 12: Verify setup
SELECT 
  'Permissions' as table_name,
  COUNT(*) as count
FROM permissions
UNION ALL
SELECT 
  'Roles',
  COUNT(*)
FROM roles
UNION ALL
SELECT 
  'Role Permissions',
  COUNT(*)
FROM role_permissions
WHERE is_active = true
UNION ALL
SELECT 
  'User Roles',
  COUNT(*)
FROM user_roles
WHERE is_active = true;

-- Done! ✅
-- تم تحسين النظام بالكامل
