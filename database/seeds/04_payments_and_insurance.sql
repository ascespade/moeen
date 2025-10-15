-- ========================================
-- PAYMENTS AND INSURANCE SEED DATA
-- بيانات المدفوعات والتأمين
-- ========================================

-- Insert payments
INSERT INTO payments (id, appointment_id, patient_id, amount, currency, payment_method, status, transaction_id, gateway_response, description, paid_at, created_by) VALUES
('ee0e8400-e29b-41d4-a716-446655440001', '990e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440001', 200.00, 'SAR', 'insurance', 'completed', 'TXN_INS_001', '{"provider": "تأمين تكافل", "claim_number": "TKF2024001", "approved_amount": 200.00, "deductible": 0.00}', 'دفع استشارة طبية - تأمين', NOW(), '550e8400-e29b-41d4-a716-446655440000'),

('ee0e8400-e29b-41d4-a716-446655440002', '990e8400-e29b-41d4-a716-446655440002', '660e8400-e29b-41d4-a716-446655440002', 350.00, 'SAR', 'card', 'completed', 'TXN_CARD_001', '{"gateway": "stripe", "payment_intent": "pi_1234567890", "charge_id": "ch_1234567890", "receipt_url": "https://pay.stripe.com/receipts/1234567890"}', 'دفع استشارة طبية - بطاقة ائتمان', NOW(), '550e8400-e29b-41d4-a716-446655440000'),

('ee0e8400-e29b-41d4-a716-446655440003', '990e8400-e29b-41d4-a716-446655440003', '660e8400-e29b-41d4-a716-446655440003', 250.00, 'SAR', 'cash', 'completed', 'TXN_CASH_001', '{"receipt_number": "RCP_001", "received_by": "سارة محمد القحطاني", "received_at": "2024-01-17T11:30:00Z"}', 'دفع استشارة طبية - نقداً', NOW(), '550e8400-e29b-41d4-a716-446655440000'),

('ee0e8400-e29b-41d4-a716-446655440004', '990e8400-e29b-41d4-a716-446655440005', '660e8400-e29b-41d4-a716-446655440005', 300.00, 'SAR', 'bank_transfer', 'completed', 'TXN_BANK_001', '{"bank": "البنك الأهلي السعودي", "transfer_reference": "TRF_001", "transfer_date": "2024-01-19T15:30:00Z"}', 'دفع استشارة طبية - تحويل بنكي', NOW(), '550e8400-e29b-41d4-a716-446655440000'),

('ee0e8400-e29b-41d4-a716-446655440005', '990e8400-e29b-41d4-a716-446655440006', '660e8400-e29b-41d4-a716-446655440001', 5000.00, 'SAR', 'insurance', 'pending', 'TXN_INS_002', '{"provider": "تأمين تكافل", "claim_number": "TKF2024002", "status": "under_review"}', 'دفع عملية جراحية - تأمين', NULL, '550e8400-e29b-41d4-a716-446655440000'),

('ee0e8400-e29b-41d4-a716-446655440006', NULL, '660e8400-e29b-41d4-a716-446655440001', 150.00, 'SAR', 'card', 'completed', 'TXN_CARD_002', '{"gateway": "moyasar", "payment_id": "pay_1234567890", "status": "paid"}', 'دفع فحوصات إضافية', NOW(), '550e8400-e29b-41d4-a716-446655440000')
ON CONFLICT (id) DO NOTHING;

-- Insert insurance claims
INSERT INTO insurance_claims (id, patient_id, appointment_id, provider, claim_number, claim_amount, approved_amount, status, submission_date, approval_date, documents, created_by) VALUES
('ff0e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440001', '990e8400-e29b-41d4-a716-446655440001', 'تأمين تكافل', 'TKF2024001', 200.00, 200.00, 'approved', '2024-01-15 10:30:00+03', '2024-01-15 11:00:00+03', '["consultation_report.pdf", "prescription.pdf", "medical_certificate.pdf"]', '550e8400-e29b-41d4-a716-446655440000'),

('ff0e8400-e29b-41d4-a716-446655440002', '660e8400-e29b-41d4-a716-446655440001', '990e8400-e29b-41d4-a716-446655440006', 'تأمين تكافل', 'TKF2024002', 5000.00, NULL, 'under_review', '2024-01-20 08:30:00+03', NULL, '["surgery_consultation.pdf", "pre_surgery_tests.pdf", "surgery_authorization.pdf"]', '550e8400-e29b-41d4-a716-446655440000'),

('ff0e8400-e29b-41d4-a716-446655440003', '660e8400-e29b-41d4-a716-446655440002', NULL, 'تأمين بوبا العربية', 'BPA2024001', 500.00, 450.00, 'approved', '2024-01-10 14:00:00+03', '2024-01-10 16:00:00+03', '["lab_tests.pdf", "imaging_reports.pdf"]', '550e8400-e29b-41d4-a716-446655440000'),

('ff0e8400-e29b-41d4-a716-446655440004', '660e8400-e29b-41d4-a716-446655440003', NULL, 'تأمين الأهلي', 'AHL2024001', 300.00, NULL, 'submitted', '2024-01-18 09:00:00+03', NULL, '["consultation_report.pdf", "prescription.pdf"]', '550e8400-e29b-41d4-a716-446655440000'),

('ff0e8400-e29b-41d4-a716-446655440005', '660e8400-e29b-41d4-a716-446655440005', '990e8400-e29b-41d4-a716-446655440005', 'تأمين الراجحي', 'RAJ2024001', 300.00, 300.00, 'approved', '2024-01-19 15:30:00+03', '2024-01-19 16:00:00+03', '["pregnancy_consultation.pdf", "ultrasound_report.pdf"]', '550e8400-e29b-41d4-a716-446655440000'),

('ff0e8400-e29b-41d4-a716-446655440006', '660e8400-e29b-41d4-a716-446655440004', NULL, 'تأمين سابك', 'SAB2024001', 200.00, NULL, 'draft', NULL, NULL, '[]', '550e8400-e29b-41d4-a716-446655440000')
ON CONFLICT (id) DO NOTHING;

-- Insert patient checklists
INSERT INTO patient_checklists (id, patient_id, checklist_type, items, status, completed_at, created_by) VALUES
('gg0e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440001', 'pre_visit', '{"fasting_required": false, "medications_to_bring": ["لوسارتان", "ميتفورمين"], "documents_required": ["بطاقة الهوية", "بطاقة التأمين"], "arrival_time": "15 دقيقة قبل الموعد", "questions_to_prepare": ["هل هناك تغيير في الأدوية؟", "هل هناك أعراض جديدة؟"]}', 'completed', NOW(), '550e8400-e29b-41d4-a716-446655440000'),

('gg0e8400-e29b-41d4-a716-446655440002', '660e8400-e29b-41d4-a716-446655440002', 'pre_visit', '{"fasting_required": true, "medications_to_bring": [], "documents_required": ["بطاقة الهوية", "بطاقة التأمين", "تقرير الأشعة السابقة"], "arrival_time": "20 دقيقة قبل الموعد", "questions_to_prepare": ["متى بدأ الألم؟", "هل يزداد الألم مع الحركة؟"]}', 'completed', NOW(), '550e8400-e29b-41d4-a716-446655440000'),

('gg0e8400-e29b-41d4-a716-446655440003', '660e8400-e29b-41d4-a716-446655440003', 'pre_visit', '{"fasting_required": false, "medications_to_bring": [], "documents_required": ["بطاقة الهوية", "بطاقة التأمين", "سجل التطعيمات"], "arrival_time": "10 دقائق قبل الموعد", "questions_to_prepare": ["متى بدأت الحمى؟", "هل هناك أعراض أخرى؟"]}', 'completed', NOW(), '550e8400-e29b-41d4-a716-446655440000'),

('gg0e8400-e29b-41d4-a716-446655440004', '660e8400-e29b-41d4-a716-446655440004', 'pre_visit', '{"fasting_required": false, "medications_to_bring": [], "documents_required": ["بطاقة الهوية", "بطاقة التأمين"], "arrival_time": "15 دقيقة قبل الموعد", "questions_to_prepare": ["ما هي الأعراض الحالية؟", "هل هناك تاريخ مرضي سابق؟"]}', 'pending', NULL, '550e8400-e29b-41d4-a716-446655440000'),

('gg0e8400-e29b-41d4-a716-446655440005', '660e8400-e29b-41d4-a716-446655440005', 'pre_visit', '{"fasting_required": false, "medications_to_bring": ["حمض الفوليك", "كالسيوم"], "documents_required": ["بطاقة الهوية", "بطاقة التأمين", "سجل الحمل"], "arrival_time": "15 دقيقة قبل الموعد", "questions_to_prepare": ["هل هناك تغيير في حركة الجنين؟", "هل هناك أعراض غير طبيعية؟"]}', 'completed', NOW(), '550e8400-e29b-41d4-a716-446655440000'),

('gg0e8400-e29b-41d4-a716-446655440006', '660e8400-e29b-41d4-a716-446655440001', 'post_visit', '{"medications_to_take": ["لوسارتان 50 مج مرة يومياً", "ميتفورمين 500 مج مرتين يومياً"], "follow_up_date": "2024-02-15", "dietary_restrictions": ["تقليل الملح", "تقليل السكريات"], "activity_restrictions": ["ممارسة الرياضة بانتظام", "تجنب التدخين"], "symptoms_to_watch": ["صداع شديد", "دوخة", "ضيق في التنفس"]}', 'completed', NOW(), '550e8400-e29b-41d4-a716-446655440000'),

('gg0e8400-e29b-41d4-a716-446655440007', '660e8400-e29b-41d4-a716-446655440002', 'post_visit', '{"medications_to_take": ["إيكوسبرين 75 مج مرة يومياً", "نتروجليسرين عند الحاجة"], "follow_up_date": "2024-02-16", "dietary_restrictions": ["تجنب الأطعمة الدسمة", "تناول الألياف"], "activity_restrictions": ["تجنب المجهود الشديد", "ممارسة رياضة خفيفة"], "symptoms_to_watch": ["ألم في الصدر", "ضيق في التنفس", "تعرق"]}', 'completed', NOW(), '550e8400-e29b-41d4-a716-446655440000'),

('gg0e8400-e29b-41d4-a716-446655440008', '660e8400-e29b-41d4-a716-446655440003', 'medication', '{"medications": ["باراسيتامول 15 مج/كجم كل 6 ساعات", "أموكسيسيلين 25 مج/كجم مرتين يومياً"], "duration": "5 أيام", "instructions": ["تناول مع الطعام", "إكمال الجرعة كاملة"], "side_effects_to_watch": ["طفح جلدي", "إسهال", "غثيان"]}', 'completed', NOW(), '550e8400-e29b-41d4-a716-446655440000')
ON CONFLICT (id) DO NOTHING;

SELECT 'Payments and insurance seed data inserted successfully!' as status;