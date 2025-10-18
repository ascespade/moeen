-- Migration: Session Types for Al Hemam Center
-- Date: 2025-10-17
-- Purpose: إنشاء جدول أنواع الجلسات الـ9 المتخصصة

-- إنشاء جدول session_types
CREATE TABLE IF NOT EXISTS session_types (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name_ar TEXT NOT NULL,
  name_en TEXT NOT NULL,
  description TEXT,
  duration INTEGER NOT NULL, -- minutes
  price DECIMAL(10, 2), -- السعر بالريال
  color TEXT, -- لون للUI (hex color)
  icon TEXT, -- emoji icon
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- إدراج 9 أنواع الجلسات لمركز الهمم
INSERT INTO session_types (name_ar, name_en, description, duration, price, color, icon) VALUES
(
  'تعديل السلوك',
  'Behavior Modification (ABA)',
  'خطط سلوكية فردية مبنية على منهج تحليل السلوك التطبيقي لتعزيز المهارات الاجتماعية والسلوكيات الإيجابية',
  90,
  300.00,
  '#3B82F6',
  '🧩'
),
(
  'علاج وظيفي',
  'Occupational Therapy',
  'تحسين المهارات الحركية الدقيقة والكبرى والاعتماد على الذات في الأنشطة اليومية',
  45,
  200.00,
  '#10B981',
  '🎯'
),
(
  'تكامل حسي',
  'Sensory Integration',
  'معالجة الحساسيات الحسية وتحسين التعامل مع المدخلات الحسية في غرف متخصصة',
  60,
  250.00,
  '#8B5CF6',
  '✨'
),
(
  'تنمية مهارات في الجلسة',
  'Skills Development',
  'جلسات فردية مكثفة لتطوير المهارات الأكاديمية والاجتماعية واللغوية',
  60,
  220.00,
  '#F59E0B',
  '📚'
),
(
  'برنامج التدخل المبكر',
  'Early Intervention',
  'برنامج متخصص للكشف والتدخل المبكر للأطفال من عمر 0-3 سنوات لضمان أفضل النتائج',
  45,
  180.00,
  '#EC4899',
  '👶'
),
(
  'البرنامج الشامل',
  'Comprehensive Program',
  'برنامج تأهيلي متكامل يجمع جميع الخدمات العلاجية في خطة واحدة شاملة ومنسقة',
  120,
  500.00,
  '#6366F1',
  '🌟'
),
(
  'علاج التأتأة',
  'Stuttering Treatment',
  'جلسات متخصصة لعلاج التلعثم والتأتأة باستخدام أحدث التقنيات العلاجية المثبتة علمياً',
  60,
  230.00,
  '#F97316',
  '🗣️'
),
(
  'علاج مشاكل الصوت',
  'Voice Disorders Treatment',
  'تشخيص وعلاج اضطرابات الصوت والنطق بطرق علمية متقدمة',
  45,
  200.00,
  '#EF4444',
  '🎤'
),
(
  'التأهيل السمعي',
  'Auditory Rehabilitation',
  'برامج تأهيل متخصصة لتحسين مهارات السمع والتواصل السمعي',
  60,
  240.00,
  '#14B8A6',
  '👂'
);

-- تحديث جدول appointments لربطه بـ session_types
ALTER TABLE appointments ADD COLUMN IF NOT EXISTS session_type_id UUID REFERENCES session_types(id);

-- تحديث duration من session_type (optional trigger للتحديث التلقائي)
CREATE OR REPLACE FUNCTION update_appointment_duration()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.session_type_id IS NOT NULL THEN
    SELECT duration INTO NEW.duration
    FROM session_types
    WHERE id = NEW.session_type_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_appointment_duration
  BEFORE INSERT OR UPDATE ON appointments
  FOR EACH ROW
  WHEN (NEW.session_type_id IS NOT NULL)
  EXECUTE FUNCTION update_appointment_duration();

-- RLS Policies for session_types
ALTER TABLE session_types ENABLE ROW LEVEL SECURITY;

-- الجميع يمكنهم رؤية أنواع الجلسات
CREATE POLICY "Anyone can view session types"
  ON session_types FOR SELECT
  USING (true);

-- فقط الـ admin/supervisor يمكنهم التعديل
CREATE POLICY "Only admins can modify session types"
  ON session_types FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role IN ('admin', 'supervisor')
    )
  );

-- Index للأداء
CREATE INDEX IF NOT EXISTS idx_session_types_active ON session_types(is_active);
CREATE INDEX IF NOT EXISTS idx_appointments_session_type ON appointments(session_type_id);

-- Comments
COMMENT ON TABLE session_types IS 'أنواع الجلسات المتخصصة لمركز الهمم';
COMMENT ON COLUMN session_types.name_ar IS 'الاسم بالعربية';
COMMENT ON COLUMN session_types.name_en IS 'الاسم بالإنجليزية';
COMMENT ON COLUMN session_types.duration IS 'مدة الجلسة بالدقائق';
COMMENT ON COLUMN session_types.price IS 'السعر بالريال السعودي';
