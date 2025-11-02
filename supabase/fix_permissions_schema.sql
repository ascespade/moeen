-- ===================================================
-- Fix Permissions Schema and Data
-- إصلاح صلاحيات قاعدة البيانات
-- ===================================================

-- Step 1: Ensure permissions table has correct structure
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

-- Step 2: Ensure roles table has correct structure
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

-- Step 3: Ensure role_permissions table exists
CREATE TABLE IF NOT EXISTS role_permissions (
  role_id uuid NOT NULL,
  permission_id uuid NOT NULL,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT role_permissions_pkey PRIMARY KEY (role_id, permission_id),
  CONSTRAINT role_permissions_role_id_fkey FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE,
  CONSTRAINT role_permissions_permission_id_fkey FOREIGN KEY (permission_id) REFERENCES permissions(id) ON DELETE CASCADE
);

-- Step 4: Ensure user_roles table exists
CREATE TABLE IF NOT EXISTS user_roles (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  user_id uuid,
  role_id uuid,
  assigned_by uuid,
  assigned_at timestamp with time zone DEFAULT now(),
  expires_at timestamp with time zone,
  is_active boolean DEFAULT true,
  CONSTRAINT user_roles_pkey PRIMARY KEY (id),
  CONSTRAINT user_roles_user_id_fkey FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT user_roles_role_id_fkey FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE,
  CONSTRAINT user_roles_assigned_by_fkey FOREIGN KEY (assigned_by) REFERENCES users(id) ON DELETE SET NULL
);

-- Step 5: Create basic permissions
INSERT INTO permissions (code, name, description, category) VALUES
  ('dashboard.view', 'View Dashboard', 'Can view dashboard', 'dashboard')
ON CONFLICT (code) DO NOTHING;

INSERT INTO permissions (code, name, description, category) VALUES
  ('users.create', 'Create Users', 'Can create new users', 'users'),
  ('users.read', 'Read Users', 'Can view users', 'users'),
  ('users.update', 'Update Users', 'Can update users', 'users'),
  ('users.delete', 'Delete Users', 'Can delete users', 'users')
ON CONFLICT (code) DO NOTHING;

INSERT INTO permissions (code, name, description, category) VALUES
  ('patients.create', 'Create Patients', 'Can create patients', 'patients'),
  ('patients.read', 'Read Patients', 'Can view patients', 'patients'),
  ('patients.update', 'Update Patients', 'Can update patients', 'patients'),
  ('patients.delete', 'Delete Patients', 'Can delete patients', 'patients')
ON CONFLICT (code) DO NOTHING;

INSERT INTO permissions (code, name, description, category) VALUES
  ('appointments.create', 'Create Appointments', 'Can create appointments', 'appointments'),
  ('appointments.read', 'Read Appointments', 'Can view appointments', 'appointments'),
  ('appointments.update', 'Update Appointments', 'Can update appointments', 'appointments'),
  ('appointments.delete', 'Delete Appointments', 'Can delete appointments', 'appointments')
ON CONFLICT (code) DO NOTHING;

INSERT INTO permissions (code, name, description, category) VALUES
  ('settings.manage', 'Manage Settings', 'Can manage system settings', 'settings'),
  ('reports.view', 'View Reports', 'Can view reports', 'reports')
ON CONFLICT (code) DO NOTHING;

-- Step 6: Create roles
INSERT INTO roles (name, display_name, description, is_system_role) VALUES
  ('admin', 'Administrator', 'Full system access', true),
  ('manager', 'Manager', 'Management access', true),
  ('supervisor', 'Supervisor', 'Supervisory access', true),
  ('agent', 'Agent', 'Standard user access', true)
ON CONFLICT (name) DO NOTHING;

-- Step 7: Assign permissions to admin role (all permissions)
DO $$
DECLARE
  admin_role_id uuid;
  perm_record RECORD;
BEGIN
  SELECT id INTO admin_role_id FROM roles WHERE name = 'admin';
  
  IF admin_role_id IS NOT NULL THEN
    FOR perm_record IN SELECT id FROM permissions LOOP
      INSERT INTO role_permissions (role_id, permission_id, is_active)
      VALUES (admin_role_id, perm_record.id, true)
      ON CONFLICT (role_id, permission_id) DO UPDATE SET is_active = true;
    END LOOP;
  END IF;
END $$;

-- Step 8: Assign permissions to manager role
DO $$
DECLARE
  manager_role_id uuid;
  perm_codes text[] := ARRAY['dashboard.view', 'users.read', 'users.update', 'patients.read', 'patients.update', 'appointments.read', 'appointments.update', 'reports.view'];
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

-- Step 9: Assign permissions to supervisor role
DO $$
DECLARE
  supervisor_role_id uuid;
  perm_codes text[] := ARRAY['dashboard.view', 'patients.read', 'patients.update', 'appointments.create', 'appointments.read', 'appointments.update'];
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

-- Step 10: Assign permissions to agent role (basic access)
DO $$
DECLARE
  agent_role_id uuid;
  perm_codes text[] := ARRAY['dashboard.view', 'patients.read', 'appointments.read', 'appointments.create'];
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

-- Step 11: Assign roles to test users
DO $$
DECLARE
  admin_user_id uuid;
  admin_role_id uuid;
  manager_role_id uuid;
  supervisor_role_id uuid;
  agent_role_id uuid;
BEGIN
  -- Get role IDs
  SELECT id INTO admin_role_id FROM roles WHERE name = 'admin';
  SELECT id INTO manager_role_id FROM roles WHERE name = 'manager';
  SELECT id INTO supervisor_role_id FROM roles WHERE name = 'supervisor';
  SELECT id INTO agent_role_id FROM roles WHERE name = 'agent';
  
  -- Assign admin role to admin@test.com
  SELECT id INTO admin_user_id FROM users WHERE email = 'admin@test.com';
  IF admin_user_id IS NOT NULL AND admin_role_id IS NOT NULL THEN
    INSERT INTO user_roles (user_id, role_id, is_active)
    VALUES (admin_user_id, admin_role_id, true)
    ON CONFLICT DO NOTHING;
  END IF;
  
  -- Assign agent role to doctor/patient/staff (they all use agent role in users table)
  FOR admin_user_id IN SELECT id FROM users WHERE email IN ('doctor@test.com', 'patient@test.com', 'staff@test.com') LOOP
    IF agent_role_id IS NOT NULL THEN
      INSERT INTO user_roles (user_id, role_id, is_active)
      VALUES (admin_user_id, agent_role_id, true)
      ON CONFLICT DO NOTHING;
    END IF;
  END LOOP;
END $$;

-- Step 12: Verify setup
SELECT 
  r.name as role_name,
  COUNT(DISTINCT rp.permission_id) as permission_count,
  COUNT(DISTINCT ur.user_id) as user_count
FROM roles r
LEFT JOIN role_permissions rp ON r.id = rp.role_id AND rp.is_active = true
LEFT JOIN user_roles ur ON r.id = ur.role_id AND ur.is_active = true
WHERE r.name IN ('admin', 'manager', 'supervisor', 'agent')
GROUP BY r.name
ORDER BY r.name;

-- Done! ✅
-- تم إعداد الصلاحيات بنجاح
