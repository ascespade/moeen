-- Migration: Create Reports and System Metrics
-- Date: 2025-10-15
-- Description: Creates tables for reporting system and system metrics

-- Create reports_admin table
CREATE TABLE IF NOT EXISTS reports_admin (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  public_id VARCHAR(255) UNIQUE NOT NULL,
  type TEXT NOT NULL,
  payload JSONB DEFAULT '{}',
  generated_at TIMESTAMP DEFAULT NOW(),
  created_by UUID REFERENCES users(id),
  status TEXT DEFAULT 'generated' CHECK (status IN ('generated', 'processing', 'failed'))
);

-- Create system_metrics table
CREATE TABLE IF NOT EXISTS system_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  metric_key TEXT NOT NULL,
  metric_value DECIMAL(15,4),
  meta JSONB DEFAULT '{}',
  recorded_at TIMESTAMP DEFAULT NOW()
);

-- Create languages table (if not exists)
CREATE TABLE IF NOT EXISTS languages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  is_default BOOLEAN DEFAULT FALSE,
  direction TEXT DEFAULT 'rtl' CHECK (direction IN ('ltr', 'rtl')),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Insert default languages
INSERT INTO languages (code, name, is_default, direction) VALUES 
('ar', 'العربية', TRUE, 'rtl'),
('en', 'English', FALSE, 'ltr')
ON CONFLICT (code) DO NOTHING;

-- Enable RLS on all tables
ALTER TABLE reports_admin ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE languages ENABLE ROW LEVEL SECURITY;

-- RLS policies for reports_admin
CREATE POLICY "Admins can view all reports" ON reports_admin
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role = 'admin'
    )
  );

CREATE POLICY "Supervisors can view reports" ON reports_admin
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role IN ('supervisor', 'admin')
    )
  );

-- RLS policies for system_metrics
CREATE POLICY "Service role can manage metrics" ON system_metrics
  FOR ALL USING (auth.role() = 'service_role');

-- RLS policies for languages
CREATE POLICY "Allow read to all" ON languages
  FOR SELECT USING (true);

CREATE POLICY "Service role can manage languages" ON languages
  FOR ALL USING (auth.role() = 'service_role');

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_reports_admin_type ON reports_admin(type);
CREATE INDEX IF NOT EXISTS idx_reports_admin_generated_at ON reports_admin(generated_at);
CREATE INDEX IF NOT EXISTS idx_reports_admin_created_by ON reports_admin(created_by);
CREATE INDEX IF NOT EXISTS idx_reports_admin_status ON reports_admin(status);

CREATE INDEX IF NOT EXISTS idx_system_metrics_key ON system_metrics(metric_key);
CREATE INDEX IF NOT EXISTS idx_system_metrics_recorded_at ON system_metrics(recorded_at);

CREATE INDEX IF NOT EXISTS idx_languages_code ON languages(code);
CREATE INDEX IF NOT EXISTS idx_languages_is_default ON languages(is_default);

-- Add comments
COMMENT ON TABLE reports_admin IS 'Administrative reports and analytics';
COMMENT ON TABLE system_metrics IS 'System performance and usage metrics';
COMMENT ON TABLE languages IS 'Supported languages for internationalization';
COMMENT ON COLUMN reports_admin.payload IS 'Report data and configuration';
COMMENT ON COLUMN system_metrics.meta IS 'Additional metric metadata';
