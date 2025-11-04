-- Migration: Create Notifications System Tables
-- ????? ????? ???? ????????? ??????

-- Notification Templates
-- ????? ?????????
CREATE TABLE IF NOT EXISTS notification_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(200) NOT NULL,
  category VARCHAR(100) NOT NULL, -- 'appointment' | 'reminder' | 'system' | 'marketing'
  type VARCHAR(50) NOT NULL, -- 'email' | 'sms' | 'push' | 'in_app' | 'whatsapp'
  title_template TEXT NOT NULL,
  body_template TEXT NOT NULL,
  variables JSONB,
  language VARCHAR(10) DEFAULT 'ar',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Notification Rules
-- ????? ?????????
CREATE TABLE IF NOT EXISTS notification_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(200) NOT NULL,
  trigger_event VARCHAR(100) NOT NULL, -- 'appointment_created' | 'appointment_reminder' | 'payment_due'
  conditions JSONB,
  template_id UUID REFERENCES notification_templates(id),
  recipients JSONB NOT NULL, -- ['patient', 'doctor', 'staff']
  timing_config JSONB, -- {delay: 3600, before: 86400}
  is_active BOOLEAN DEFAULT true,
  priority INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Notifications Queue
-- ????? ?????? ?????????
CREATE TABLE IF NOT EXISTS notifications_queue (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  template_id UUID REFERENCES notification_templates(id),
  type VARCHAR(50) NOT NULL,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  data JSONB,
  status VARCHAR(50) DEFAULT 'pending', -- 'pending' | 'sent' | 'failed' | 'cancelled'
  scheduled_for TIMESTAMP WITH TIME ZONE,
  sent_at TIMESTAMP WITH TIME ZONE,
  error_message TEXT,
  retry_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Notification Preferences
-- ??????? ????????? ??????????
CREATE TABLE IF NOT EXISTS notification_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) UNIQUE,
  email_enabled BOOLEAN DEFAULT true,
  sms_enabled BOOLEAN DEFAULT true,
  push_enabled BOOLEAN DEFAULT true,
  whatsapp_enabled BOOLEAN DEFAULT true,
  in_app_enabled BOOLEAN DEFAULT true,
  categories JSONB, -- {appointments: true, reminders: true, system: false}
  quiet_hours JSONB, -- {start: '22:00', end: '08:00'}
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Notification History
-- ????? ?????????
CREATE TABLE IF NOT EXISTS notifications_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  notification_id UUID REFERENCES notifications_queue(id),
  user_id UUID REFERENCES users(id),
  type VARCHAR(50) NOT NULL,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  status VARCHAR(50) NOT NULL,
  sent_at TIMESTAMP WITH TIME ZONE,
  read_at TIMESTAMP WITH TIME ZONE,
  clicked_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_notifications_queue_user ON notifications_queue(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_queue_status ON notifications_queue(status);
CREATE INDEX IF NOT EXISTS idx_notifications_queue_scheduled ON notifications_queue(scheduled_for) WHERE status = 'pending';
CREATE INDEX IF NOT EXISTS idx_notifications_history_user ON notifications_history(user_id);
CREATE INDEX IF NOT EXISTS idx_notification_rules_trigger ON notification_rules(trigger_event) WHERE is_active = true;
