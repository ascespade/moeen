-- Migration: Supervisor Notifications System
-- Date: 2025-10-17
-- Purpose: نظام إشعارات المشرف (Call requests, alerts, summaries)

-- جدول طلبات المكالمات (Call Requests)
CREATE TABLE IF NOT EXISTS call_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  requester_id UUID NOT NULL REFERENCES users(id),
  patient_id UUID REFERENCES patients(id),
  reason TEXT,
  priority TEXT DEFAULT 'high' CHECK (priority IN ('emergency', 'high', 'medium', 'low')),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'acknowledged', 'completed', 'cancelled')),
  assigned_to UUID REFERENCES users(id),
  acknowledged_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- جدول قواعد الإشعارات
CREATE TABLE IF NOT EXISTS notification_rules (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_type TEXT NOT NULL,  -- 'call_requested', 'session_cancelled', etc.
  priority TEXT NOT NULL CHECK (priority IN ('emergency', 'important', 'info')),
  notify_roles TEXT[] DEFAULT ARRAY['supervisor', 'admin'],
  channels TEXT[] DEFAULT ARRAY['whatsapp', 'sms', 'email', 'push'],
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- جدول تفضيلات إشعارات المشرفين
CREATE TABLE IF NOT EXISTS supervisor_notification_preferences (
  user_id UUID PRIMARY KEY REFERENCES users(id),
  whatsapp_enabled BOOLEAN DEFAULT true,
  sms_enabled BOOLEAN DEFAULT true,
  email_enabled BOOLEAN DEFAULT true,
  push_enabled BOOLEAN DEFAULT true,
  
  -- أنواع الإشعارات
  emergency_alerts BOOLEAN DEFAULT true,
  call_requests BOOLEAN DEFAULT true,
  session_alerts BOOLEAN DEFAULT true,
  insurance_alerts BOOLEAN DEFAULT true,
  daily_summary BOOLEAN DEFAULT true,
  weekly_report BOOLEAN DEFAULT true,
  
  -- أوقات الهدوء (Quiet hours)
  quiet_hours_start TIME DEFAULT '22:00',
  quiet_hours_end TIME DEFAULT '07:00',
  
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- جدول سجل الإشعارات المرسلة
CREATE TABLE IF NOT EXISTS notification_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  notification_id UUID REFERENCES notifications(id),
  recipient_id UUID NOT NULL REFERENCES users(id),
  channel TEXT NOT NULL, -- 'whatsapp', 'sms', 'email', 'push'
  status TEXT DEFAULT 'sent' CHECK (status IN ('sent', 'delivered', 'failed', 'read')),
  sent_at TIMESTAMPTZ DEFAULT NOW(),
  delivered_at TIMESTAMPTZ,
  read_at TIMESTAMPTZ,
  error_message TEXT
);

-- إدراج قواعد الإشعارات الافتراضية
INSERT INTO notification_rules (event_type, priority, notify_roles, channels) VALUES
('call_requested', 'emergency', ARRAY['supervisor', 'admin'], ARRAY['whatsapp', 'sms', 'push']),
('session_cancelled_last_minute', 'important', ARRAY['supervisor'], ARRAY['whatsapp', 'push']),
('therapist_absent', 'emergency', ARRAY['supervisor', 'admin'], ARRAY['whatsapp', 'sms']),
('insurance_claim_approved', 'info', ARRAY['supervisor'], ARRAY['push', 'email']),
('payment_received', 'info', ARRAY['admin'], ARRAY['push']),
('negative_review', 'important', ARRAY['supervisor', 'admin'], ARRAY['whatsapp', 'email']);

-- RLS Policies

-- call_requests
ALTER TABLE call_requests ENABLE ROW LEVEL SECURITY;

-- المستخدم يمكنه رؤية طلباته
CREATE POLICY "Users can view their own call requests"
  ON call_requests FOR SELECT
  USING (requester_id = auth.uid());

-- المستخدم يمكنه إنشاء طلبات
CREATE POLICY "Users can create call requests"
  ON call_requests FOR INSERT
  WITH CHECK (requester_id = auth.uid());

-- المشرفون يرون جميع الطلبات
CREATE POLICY "Supervisors can view all call requests"
  ON call_requests FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role IN ('supervisor', 'admin')
    )
  );

-- المشرفون يمكنهم تحديث الطلبات
CREATE POLICY "Supervisors can update call requests"
  ON call_requests FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role IN ('supervisor', 'admin')
    )
  );

-- notification_rules
ALTER TABLE notification_rules ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage notification rules"
  ON notification_rules FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role IN ('admin', 'supervisor')
    )
  );

CREATE POLICY "Anyone can view notification rules"
  ON notification_rules FOR SELECT
  USING (true);

-- supervisor_notification_preferences
ALTER TABLE supervisor_notification_preferences ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own preferences"
  ON supervisor_notification_preferences FOR ALL
  USING (user_id = auth.uid());

-- notification_logs
ALTER TABLE notification_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view all logs"
  ON notification_logs FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role IN ('admin', 'supervisor')
    )
  );

CREATE POLICY "Users can view their own notification logs"
  ON notification_logs FOR SELECT
  USING (recipient_id = auth.uid());

-- Indexes
CREATE INDEX IF NOT EXISTS idx_call_requests_status ON call_requests(status);
CREATE INDEX IF NOT EXISTS idx_call_requests_priority ON call_requests(priority);
CREATE INDEX IF NOT EXISTS idx_call_requests_assigned ON call_requests(assigned_to);
CREATE INDEX IF NOT EXISTS idx_call_requests_created ON call_requests(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notification_logs_recipient ON notification_logs(recipient_id);
CREATE INDEX IF NOT EXISTS idx_notification_logs_status ON notification_logs(status);

-- Function: Get on-duty supervisor
CREATE OR REPLACE FUNCTION get_on_duty_supervisor()
RETURNS UUID AS $$
DECLARE
  v_supervisor_id UUID;
BEGIN
  -- Get first available supervisor (можно توسيعه لاحقاً لدعم نظام Shifts)
  SELECT id INTO v_supervisor_id
  FROM users
  WHERE role = 'supervisor'
  AND id IN (
    SELECT user_id FROM supervisor_notification_preferences
    WHERE emergency_alerts = true
    AND whatsapp_enabled = true
  )
  ORDER BY RANDOM()
  LIMIT 1;
  
  -- Fallback to admin if no supervisor found
  IF v_supervisor_id IS NULL THEN
    SELECT id INTO v_supervisor_id
    FROM users
    WHERE role = 'admin'
    LIMIT 1;
  END IF;
  
  RETURN v_supervisor_id;
END;
$$ LANGUAGE plpgsql;

-- Function: Check if in quiet hours
CREATE OR REPLACE FUNCTION is_in_quiet_hours(p_user_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  v_prefs RECORD;
  v_current_time TIME;
BEGIN
  v_current_time := CURRENT_TIME;
  
  SELECT * INTO v_prefs
  FROM supervisor_notification_preferences
  WHERE user_id = p_user_id;
  
  IF NOT FOUND THEN
    RETURN false; -- No preferences = allow
  END IF;
  
  -- Check if current time is in quiet hours
  IF v_prefs.quiet_hours_start < v_prefs.quiet_hours_end THEN
    -- Normal case: 22:00 - 07:00 (doesn't cross midnight)
    RETURN v_current_time >= v_prefs.quiet_hours_start 
       AND v_current_time < v_prefs.quiet_hours_end;
  ELSE
    -- Crosses midnight: 22:00 - 07:00 next day
    RETURN v_current_time >= v_prefs.quiet_hours_start 
        OR v_current_time < v_prefs.quiet_hours_end;
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Comments
COMMENT ON TABLE call_requests IS 'طلبات المكالمات العاجلة من المرضى/الأسر';
COMMENT ON TABLE notification_rules IS 'قواعد الإشعارات التلقائية حسب نوع الحدث';
COMMENT ON TABLE supervisor_notification_preferences IS 'تفضيلات إشعارات المشرفين';
COMMENT ON TABLE notification_logs IS 'سجل الإشعارات المرسلة (audit trail)';
COMMENT ON FUNCTION get_on_duty_supervisor IS 'الحصول على المشرف المناوب';
COMMENT ON FUNCTION is_in_quiet_hours IS 'التحقق من أوقات الهدوء لتجنب إزعاج المشرف';
