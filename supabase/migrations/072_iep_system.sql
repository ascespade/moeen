-- Migration: IEP (Individualized Education Program) System
-- Date: 2025-10-17
-- Purpose: نظام متابعة تقدم الأطفال والخطط الفردية

-- جدول IEPs (الخطط الفردية)
CREATE TABLE IF NOT EXISTS ieps (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'archived')),
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- جدول الأهداف (Goals)
CREATE TABLE IF NOT EXISTS iep_goals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  iep_id UUID NOT NULL REFERENCES ieps(id) ON DELETE CASCADE,
  goal_text TEXT NOT NULL,
  domain TEXT CHECK (domain IN ('behavioral', 'motor', 'language', 'social', 'academic', 'self_care')),
  term TEXT CHECK (term IN ('short', 'long')), -- short: 1-3 months, long: 3-6 months
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('high', 'medium', 'low')),
  target_date DATE,
  status TEXT DEFAULT 'not_started' CHECK (status IN ('not_started', 'in_progress', 'achieved', 'discontinued')),
  success_criteria TEXT,
  baseline_assessment TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- جدول تسجيل التقدم (Progress Logs)
CREATE TABLE IF NOT EXISTS goal_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  goal_id UUID NOT NULL REFERENCES iep_goals(id) ON DELETE CASCADE,
  session_id UUID REFERENCES appointments(id),
  progress_percent INTEGER CHECK (progress_percent >= 0 AND progress_percent <= 100),
  notes TEXT,
  recorded_by UUID REFERENCES users(id),
  recorded_at TIMESTAMPTZ DEFAULT NOW()
);

-- جدول ملاحظات الجلسات (Session Notes)
CREATE TABLE IF NOT EXISTS session_notes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id UUID NOT NULL REFERENCES appointments(id) ON DELETE CASCADE,
  therapist_id UUID NOT NULL REFERENCES users(id),
  notes TEXT NOT NULL,
  goals_worked_on UUID[], -- array of goal IDs
  home_recommendations TEXT,
  next_session_focus TEXT,
  session_rating INTEGER CHECK (session_rating >= 1 AND session_rating <= 5),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS Policies

-- ieps
ALTER TABLE ieps ENABLE ROW LEVEL SECURITY;

-- الأسرة ترى IEPs لأطفالها
CREATE POLICY "Families can view their children's IEPs"
  ON ieps FOR SELECT
  USING (
    patient_id IN (
      SELECT id FROM patients
      WHERE EXISTS (
        SELECT 1 FROM patient_guardians pg
        WHERE pg.patient_id = patients.id
        AND pg.guardian_id = auth.uid()
      )
    )
  );

-- الأخصائيون يرون IEPs للأطفال الذين يعالجونهم
CREATE POLICY "Therapists can view IEPs for their patients"
  ON ieps FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM appointments a
      WHERE a.patient_id = ieps.patient_id
      AND a.doctor_id = auth.uid()
    )
  );

-- Admins/Supervisors يرون كل IEPs
CREATE POLICY "Admins can view all IEPs"
  ON ieps FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role IN ('admin', 'supervisor')
    )
  );

-- الأخصائيون يمكنهم إنشاء IEPs
CREATE POLICY "Therapists can create IEPs"
  ON ieps FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role IN ('doctor', 'admin', 'supervisor')
    )
  );

-- iep_goals
ALTER TABLE iep_goals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view goals of accessible IEPs"
  ON iep_goals FOR SELECT
  USING (
    iep_id IN (
      SELECT id FROM ieps
      -- Uses ieps policies
    )
  );

CREATE POLICY "Therapists and admins can manage goals"
  ON iep_goals FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role IN ('doctor', 'admin', 'supervisor')
    )
  );

-- goal_progress
ALTER TABLE goal_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view progress of accessible goals"
  ON goal_progress FOR SELECT
  USING (
    goal_id IN (
      SELECT id FROM iep_goals
      -- Uses iep_goals policies
    )
  );

CREATE POLICY "Therapists can record progress"
  ON goal_progress FOR INSERT
  WITH CHECK (
    recorded_by = auth.uid()
    AND EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role IN ('doctor', 'admin', 'supervisor')
    )
  );

-- session_notes
ALTER TABLE session_notes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Therapists can view and create their own notes"
  ON session_notes FOR ALL
  USING (therapist_id = auth.uid());

CREATE POLICY "Admins can view all notes"
  ON session_notes FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role IN ('admin', 'supervisor')
    )
  );

-- Families can view notes for their children's sessions
CREATE POLICY "Families can view notes for their children"
  ON session_notes FOR SELECT
  USING (
    session_id IN (
      SELECT a.id FROM appointments a
      INNER JOIN patients p ON a.patient_id = p.id
      INNER JOIN patient_guardians pg ON p.id = pg.patient_id
      WHERE pg.guardian_id = auth.uid()
    )
  );

-- Indexes للأداء
CREATE INDEX IF NOT EXISTS idx_ieps_patient ON ieps(patient_id);
CREATE INDEX IF NOT EXISTS idx_ieps_status ON ieps(status);
CREATE INDEX IF NOT EXISTS idx_iep_goals_iep ON iep_goals(iep_id);
CREATE INDEX IF NOT EXISTS idx_iep_goals_status ON iep_goals(status);
CREATE INDEX IF NOT EXISTS idx_goal_progress_goal ON goal_progress(goal_id);
CREATE INDEX IF NOT EXISTS idx_session_notes_session ON session_notes(session_id);
CREATE INDEX IF NOT EXISTS idx_session_notes_therapist ON session_notes(therapist_id);

-- Triggers للتحديث التلقائي

CREATE OR REPLACE FUNCTION update_iep_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_iep_updated_at
  BEFORE UPDATE ON ieps
  FOR EACH ROW
  EXECUTE FUNCTION update_iep_updated_at();

CREATE TRIGGER set_goal_updated_at
  BEFORE UPDATE ON iep_goals
  FOR EACH ROW
  EXECUTE FUNCTION update_iep_updated_at();

-- Function: Calculate goal progress percentage
CREATE OR REPLACE FUNCTION calculate_goal_progress(p_goal_id UUID)
RETURNS INTEGER AS $$
DECLARE
  v_avg_progress INTEGER;
BEGIN
  SELECT COALESCE(AVG(progress_percent)::INTEGER, 0)
  INTO v_avg_progress
  FROM goal_progress
  WHERE goal_id = p_goal_id;
  
  RETURN v_avg_progress;
END;
$$ LANGUAGE plpgsql;

-- Function: Get IEP summary
CREATE OR REPLACE FUNCTION get_iep_summary(p_iep_id UUID)
RETURNS JSON AS $$
DECLARE
  v_summary JSON;
BEGIN
  SELECT json_build_object(
    'total_goals', COUNT(*),
    'not_started', COUNT(*) FILTER (WHERE status = 'not_started'),
    'in_progress', COUNT(*) FILTER (WHERE status = 'in_progress'),
    'achieved', COUNT(*) FILTER (WHERE status = 'achieved'),
    'overall_progress', AVG(
      (SELECT COALESCE(AVG(progress_percent), 0)
       FROM goal_progress gp
       WHERE gp.goal_id = iep_goals.id)
    )::INTEGER
  )
  INTO v_summary
  FROM iep_goals
  WHERE iep_id = p_iep_id;
  
  RETURN v_summary;
END;
$$ LANGUAGE plpgsql;

-- Comments
COMMENT ON TABLE ieps IS 'الخطط التعليمية/التأهيلية الفردية';
COMMENT ON TABLE iep_goals IS 'أهداف الخطط الفردية';
COMMENT ON TABLE goal_progress IS 'تسجيل التقدم نحو تحقيق الأهداف';
COMMENT ON TABLE session_notes IS 'ملاحظات الأخصائيين بعد كل جلسة';
COMMENT ON COLUMN iep_goals.domain IS 'المجال: سلوكي، حركي، لغوي، اجتماعي، أكاديمي، رعاية ذاتية';
COMMENT ON COLUMN iep_goals.term IS 'المدى: قصير (1-3 شهور) أو طويل (3-6 شهور)';
