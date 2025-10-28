-- ================================================================
-- 🔌 INTEGRATION CONFIGS & TEST LOGS
-- ================================================================
-- Migration: Integration configurations for external services
-- Date: 2025-01-17
-- Description: Creates tables for managing external integrations (WhatsApp, SMS, Email, etc.)

-- Enable pgcrypto for encryption if not already enabled
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create integration_configs table
CREATE TABLE IF NOT EXISTS integration_configs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  public_id VARCHAR(255) UNIQUE NOT NULL DEFAULT 'int_' || TO_CHAR(NOW(), 'YYYYMMDD') || '_' || substring(md5(random()::text), 1, 8),
  integration_type VARCHAR(50) NOT NULL, -- 'whatsapp', 'sms', 'email', 'google_calendar', 'slack', 'seha', 'tatman', etc.
  name VARCHAR(255) NOT NULL,
  description TEXT,
  config JSONB NOT NULL DEFAULT '{}', -- Encrypted API keys, URLs, tokens
  status VARCHAR(20) DEFAULT 'inactive' CHECK (status IN ('active', 'inactive', 'error', 'testing')),
  is_enabled BOOLEAN DEFAULT false,
  last_test_at TIMESTAMPTZ,
  last_test_status VARCHAR(20) CHECK (last_test_status IN ('success', 'failed', 'pending', NULL)),
  last_test_message TEXT,
  health_score INTEGER DEFAULT 0 CHECK (health_score >= 0 AND health_score <= 100),
  metadata JSONB DEFAULT '{}',
  created_by UUID REFERENCES users(id),
  updated_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(integration_type, name)
);

-- Create integration_test_logs table
CREATE TABLE IF NOT EXISTS integration_test_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  public_id VARCHAR(255) UNIQUE NOT NULL DEFAULT 'itl_' || TO_CHAR(NOW(), 'YYYYMMDD') || '_' || substring(md5(random()::text), 1, 8),
  integration_config_id UUID REFERENCES integration_configs(id) ON DELETE CASCADE,
  integration_type VARCHAR(50) NOT NULL,
  test_type VARCHAR(50) NOT NULL, -- 'connection', 'send_message', 'verify_credentials', etc.
  status VARCHAR(20) NOT NULL CHECK (status IN ('success', 'failed', 'timeout')),
  request_data JSONB,
  response_data JSONB,
  error_message TEXT,
  duration_ms INTEGER,
  tested_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_integration_configs_type ON integration_configs(integration_type);
CREATE INDEX IF NOT EXISTS idx_integration_configs_status ON integration_configs(status);
CREATE INDEX IF NOT EXISTS idx_integration_configs_enabled ON integration_configs(is_enabled);
CREATE INDEX IF NOT EXISTS idx_integration_configs_updated_at ON integration_configs(updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_integration_test_logs_config_id ON integration_test_logs(integration_config_id);
CREATE INDEX IF NOT EXISTS idx_integration_test_logs_created_at ON integration_test_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_integration_test_logs_status ON integration_test_logs(status);

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_integration_configs_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_integration_configs_updated_at
  BEFORE UPDATE ON integration_configs
  FOR EACH ROW
  EXECUTE FUNCTION update_integration_configs_updated_at();

-- Create audit trigger for integration configs
CREATE OR REPLACE FUNCTION audit_integration_configs()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    INSERT INTO audit_logs (action, table_name, record_id, new_values, user_id, created_at)
    VALUES ('INSERT', 'integration_configs', NEW.id::TEXT, row_to_json(NEW)::JSONB, NEW.created_by, NOW());
  ELSIF TG_OP = 'UPDATE' THEN
    INSERT INTO audit_logs (action, table_name, record_id, old_values, new_values, user_id, created_at)
    VALUES ('UPDATE', 'integration_configs', NEW.id::TEXT, row_to_json(OLD)::JSONB, row_to_json(NEW)::JSONB, NEW.updated_by, NOW());
  ELSIF TG_OP = 'DELETE' THEN
    INSERT INTO audit_logs (action, table_name, record_id, old_values, created_at)
    VALUES ('DELETE', 'integration_configs', OLD.id::TEXT, row_to_json(OLD)::JSONB, NOW());
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_audit_integration_configs
  AFTER INSERT OR UPDATE OR DELETE ON integration_configs
  FOR EACH ROW
  EXECUTE FUNCTION audit_integration_configs();

-- Insert default integration configurations (inactive by default)
INSERT INTO integration_configs (integration_type, name, description, config, status) VALUES
('whatsapp', 'WhatsApp Business API', 'تكامل واتساب بيزنس للرسائل والإشعارات', 
  '{"api_url": "", "access_token": "", "phone_number_id": "", "webhook_verify_token": ""}'::JSONB, 
  'inactive'),
('sms', 'Twilio SMS Gateway', 'خدمة إرسال الرسائل النصية', 
  '{"account_sid": "", "auth_token": "", "from_number": ""}'::JSONB, 
  'inactive'),
('email', 'SendGrid Email Service', 'خدمة إرسال البريد الإلكتروني', 
  '{"api_key": "", "from_email": "", "from_name": ""}'::JSONB, 
  'inactive'),
('google_calendar', 'Google Calendar Integration', 'مزامنة المواعيد مع تقويم جوجل', 
  '{"client_id": "", "client_secret": "", "refresh_token": "", "calendar_id": "primary"}'::JSONB, 
  'inactive'),
('slack', 'Slack Notifications', 'إشعارات سلاك للفريق', 
  '{"webhook_url": "", "channel": "#notifications"}'::JSONB, 
  'inactive'),
('seha', 'Seha Platform Integration', 'تكامل منصة صحة', 
  '{"api_url": "", "api_key": "", "facility_id": ""}'::JSONB, 
  'inactive'),
('tatman', 'Tatman Insurance', 'تكامل تأمين طمأن', 
  '{"api_url": "", "api_key": "", "provider_id": ""}'::JSONB, 
  'inactive')
ON CONFLICT (integration_type, name) DO NOTHING;

-- Add comment to tables
COMMENT ON TABLE integration_configs IS 'Stores configuration for external service integrations';
COMMENT ON TABLE integration_test_logs IS 'Logs all integration connection tests and their results';
COMMENT ON COLUMN integration_configs.config IS 'JSONB field containing encrypted API keys and configuration';
COMMENT ON COLUMN integration_configs.health_score IS 'Integration health score 0-100 based on recent test results';

