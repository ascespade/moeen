-- Additional Seed Data for Healthcare System
-- This file adds more data to existing tables

-- Add insurance claims
INSERT INTO insurance_claims (
  patient_id, claim_number, insurance_provider, claim_amount, approved_amount,
  status, submitted_date, created_by, created_at, notes
)
SELECT 
  p.id,
  'CLM-2025-' || LPAD(ROW_NUMBER() OVER()::text, 3, '0'),
  'التأمين السعودي',
  (500 * ROW_NUMBER() OVER())::NUMERIC,
  CASE 
    WHEN ROW_NUMBER() OVER() % 2 = 0 THEN (500 * ROW_NUMBER() OVER() * 0.8)::NUMERIC
    ELSE 0
  END,
  CASE (ROW_NUMBER() OVER() % 4)
    WHEN 0 THEN 'approved'
    WHEN 1 THEN 'pending'
    WHEN 2 THEN 'rejected'
    ELSE 'under_review'
  END,
  CURRENT_DATE - (ROW_NUMBER() OVER() * 2),
  (SELECT id FROM users LIMIT 1),
  CURRENT_TIMESTAMP,
  'ملاحظات للطلب ' || ROW_NUMBER() OVER()
FROM patients p
LIMIT 10
ON CONFLICT (public_id) DO NOTHING;

-- Update existing approvals with additional details
UPDATE approvals
SET 
  notes = notes || E'\nتمت إضافة ملاحظات إضافية',
  updated_at = CURRENT_TIMESTAMP
WHERE id IN (
  SELECT id FROM approvals LIMIT 5
);

-- Count results
SELECT 
  'insurance_claims' as table_name,
  COUNT(*) as count
FROM insurance_claims
UNION ALL
SELECT 'approvals', COUNT(*) FROM approvals
UNION ALL
SELECT 'therapy_sessions', COUNT(*) FROM therapy_sessions
UNION ALL
SELECT 'patients', COUNT(*) FROM patients;
