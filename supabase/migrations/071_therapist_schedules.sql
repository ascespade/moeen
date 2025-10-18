-- Migration: Therapist Schedules
-- Date: 2025-10-17
-- Purpose: إنشاء نظام جداول الأخصائيين لتحديد المواعيد المتاحة

-- إنشاء جدول therapist_schedules
CREATE TABLE IF NOT EXISTS therapist_schedules (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  therapist_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  day_of_week INTEGER NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6), -- 0=Sunday, 6=Saturday
  start_time TIME NOT NULL,
  end_time TIME NOT NULL CHECK (end_time > start_time),
  is_available BOOLEAN DEFAULT true,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- منع التداخل في نفس اليوم لنفس الأخصائي
  CONSTRAINT no_schedule_overlap UNIQUE (therapist_id, day_of_week, start_time, end_time)
);

-- جدول للعطلات والإجازات
CREATE TABLE IF NOT EXISTS therapist_time_off (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  therapist_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL CHECK (end_date >= start_date),
  reason TEXT,
  is_approved BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- جدول لتخصص الأخصائيين (أي أنواع جلسات يمكنهم تقديمها)
CREATE TABLE IF NOT EXISTS therapist_specializations (
  therapist_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  session_type_id UUID NOT NULL REFERENCES session_types(id) ON DELETE CASCADE,
  proficiency_level TEXT DEFAULT 'intermediate', -- 'beginner', 'intermediate', 'expert'
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (therapist_id, session_type_id)
);

-- RLS Policies

-- therapist_schedules
ALTER TABLE therapist_schedules ENABLE ROW LEVEL SECURITY;

-- الأخصائي يمكنه رؤية وتعديل جدوله
CREATE POLICY "Therapists can manage their own schedules"
  ON therapist_schedules FOR ALL
  USING (therapist_id = auth.uid());

-- الـ admin/supervisor يمكنهم رؤية وتعديل كل الجداول
CREATE POLICY "Admins can manage all schedules"
  ON therapist_schedules FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role IN ('admin', 'supervisor')
    )
  );

-- الجميع يمكنهم رؤية الجداول (لحجز المواعيد)
CREATE POLICY "Anyone can view schedules"
  ON therapist_schedules FOR SELECT
  USING (is_available = true);

-- therapist_time_off
ALTER TABLE therapist_time_off ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Therapists can manage their time off"
  ON therapist_time_off FOR ALL
  USING (therapist_id = auth.uid());

CREATE POLICY "Admins can manage all time off"
  ON therapist_time_off FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role IN ('admin', 'supervisor')
    )
  );

-- therapist_specializations
ALTER TABLE therapist_specializations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view specializations"
  ON therapist_specializations FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage specializations"
  ON therapist_specializations FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role IN ('admin', 'supervisor')
    )
  );

-- Indexes للأداء
CREATE INDEX IF NOT EXISTS idx_therapist_schedules_therapist ON therapist_schedules(therapist_id);
CREATE INDEX IF NOT EXISTS idx_therapist_schedules_day ON therapist_schedules(day_of_week);
CREATE INDEX IF NOT EXISTS idx_therapist_schedules_available ON therapist_schedules(is_available);
CREATE INDEX IF NOT EXISTS idx_therapist_time_off_dates ON therapist_time_off(therapist_id, start_date, end_date);
CREATE INDEX IF NOT EXISTS idx_therapist_specializations ON therapist_specializations(therapist_id, session_type_id);

-- Function: Get available therapists for a specific session type and time
CREATE OR REPLACE FUNCTION get_available_therapists(
  p_session_type_id UUID,
  p_date DATE,
  p_start_time TIME
)
RETURNS TABLE (
  therapist_id UUID,
  therapist_name TEXT,
  proficiency_level TEXT
) AS $$
DECLARE
  v_day_of_week INTEGER;
BEGIN
  -- Get day of week (0=Sunday in PostgreSQL)
  v_day_of_week := EXTRACT(DOW FROM p_date);
  
  RETURN QUERY
  SELECT DISTINCT
    u.id,
    u.full_name,
    ts.proficiency_level
  FROM users u
  INNER JOIN therapist_specializations ts ON u.id = ts.therapist_id
  INNER JOIN therapist_schedules sch ON u.id = sch.therapist_id
  WHERE 
    -- Therapist has this specialization
    ts.session_type_id = p_session_type_id
    -- Therapist works on this day
    AND sch.day_of_week = v_day_of_week
    -- Requested time is within schedule
    AND p_start_time >= sch.start_time
    AND p_start_time < sch.end_time
    -- Schedule is active
    AND sch.is_available = true
    -- Therapist is not on time off
    AND NOT EXISTS (
      SELECT 1 FROM therapist_time_off tto
      WHERE tto.therapist_id = u.id
      AND p_date BETWEEN tto.start_date AND tto.end_date
    )
    -- No conflicting appointment
    AND NOT EXISTS (
      SELECT 1 FROM appointments a
      WHERE a.doctor_id = u.id
      AND a.appointment_date = p_date
      AND a.appointment_time = p_start_time
      AND a.status NOT IN ('cancelled', 'no_show')
    )
  ORDER BY ts.proficiency_level DESC, u.full_name;
END;
$$ LANGUAGE plpgsql;

-- Comments
COMMENT ON TABLE therapist_schedules IS 'جداول عمل الأخصائيين الأسبوعية';
COMMENT ON TABLE therapist_time_off IS 'إجازات وعطلات الأخصائيين';
COMMENT ON TABLE therapist_specializations IS 'تخصصات الأخصائيين (أنواع الجلسات التي يقدمونها)';
COMMENT ON FUNCTION get_available_therapists IS 'البحث عن الأخصائيين المتاحين لنوع جلسة ووقت محدد';
