-- Migration: Create System & Admin Tables
-- Date: 2024-01-15
-- Description: Creates system administration tables for notifications, audit logs, roles, and settings

-- notifications
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  public_id VARCHAR(255) UNIQUE NOT NULL,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  type VARCHAR(50) DEFAULT 'info', -- 'info', 'success', 'warning', 'error'
  is_read BOOLEAN DEFAULT false,
  action_url VARCHAR(500),
  metadata JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  read_at TIMESTAMP
);

-- internal_messages
CREATE TABLE IF NOT EXISTS internal_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  public_id VARCHAR(255) UNIQUE NOT NULL,
  sender_id UUID REFERENCES users(id),
  recipient_id UUID REFERENCES users(id),
  subject VARCHAR(255),
  content TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  parent_message_id UUID REFERENCES internal_messages(id),
  created_at TIMESTAMP DEFAULT NOW(),
  read_at TIMESTAMP
);

-- audit_logs
CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  public_id VARCHAR(255) UNIQUE NOT NULL,
  user_id UUID REFERENCES users(id),
  action VARCHAR(100) NOT NULL, -- 'create', 'update', 'delete', 'login', 'logout'
  table_name VARCHAR(100) NOT NULL,
  record_id UUID,
  old_values JSONB,
  new_values JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- roles
CREATE TABLE IF NOT EXISTS roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  public_id VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(100) UNIQUE NOT NULL,
  description TEXT,
  permissions JSONB NOT NULL, -- Array of permission strings
  is_system BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- user_roles
CREATE TABLE IF NOT EXISTS user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  public_id VARCHAR(255) UNIQUE NOT NULL,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  role_id UUID REFERENCES roles(id) ON DELETE CASCADE,
  assigned_by UUID REFERENCES users(id),
  assigned_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, role_id)
);

-- settings
CREATE TABLE IF NOT EXISTS settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  public_id VARCHAR(255) UNIQUE NOT NULL,
  key VARCHAR(255) UNIQUE NOT NULL,
  value JSONB NOT NULL,
  description TEXT,
  category VARCHAR(100) DEFAULT 'general', -- 'general', 'api', 'integrations', 'notifications'
  is_public BOOLEAN DEFAULT false,
  updated_by UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Add comments for documentation
COMMENT ON TABLE notifications IS 'System notifications for users';
COMMENT ON TABLE internal_messages IS 'Internal messaging system between users';
COMMENT ON TABLE audit_logs IS 'Audit trail for all system actions';
COMMENT ON TABLE roles IS 'User roles and permissions';
COMMENT ON TABLE user_roles IS 'User role assignments';
COMMENT ON TABLE settings IS 'System configuration settings';
COMMENT ON COLUMN audit_logs.action IS 'Type of action performed';
COMMENT ON COLUMN audit_logs.table_name IS 'Database table affected';
COMMENT ON COLUMN roles.permissions IS 'JSON array of permission strings';
COMMENT ON COLUMN settings.is_public IS 'Whether setting is publicly readable';
