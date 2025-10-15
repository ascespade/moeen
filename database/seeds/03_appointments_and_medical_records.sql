-- ========================================
-- APPOINTMENTS AND MEDICAL RECORDS SEED DATA
-- بيانات المواعيد والسجلات الطبية
-- ========================================

-- Insert appointments
INSERT INTO appointments (id, patient_id, doctor_id, scheduled_at, duration_minutes, type, status, payment_status, payment_method, notes, diagnosis, prescription, follow_up_required, follow_up_date, created_by) VALUES
('990e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440001', '770e8400-e29b-41d4-a716-446655440001', '2024-01-15 10:00:00+03', 30, 'consultation', 'completed', 'paid', 'insurance', 'مريض يعاني من ارتفاع في ضغط الدم', 'ارتفاع ضغط الدم من الدرجة الأولى', 'لوسارتان 50 مج مرة يومياً، ميتفورمين 500 مج مرتين يومياً', true, '2024-02-15 10:00:00+03', '550e8400-e29b-41d4-a716-446655440000'),

('990e8400-e29b-41d4-a716-446655440002', '660e8400-e29b-41d4-a716-446655440002', '770e8400-e29b-41d4-a716-446655440002', '2024-01-16 14:00:00+03', 45, 'consultation', 'completed', 'paid', 'card', 'مريضة تعاني من ألم في الصدر', 'ألم في الصدر غير محدد السبب، يحتاج فحوصات إضافية', 'إيكوسبرين 75 مج مرة يومياً، نتروجليسرين عند الحاجة', true, '2024-02-16 14:00:00+03', '550e8400-e29b-41d4-a716-446655440000'),

('990e8400-e29b-41d4-a716-446655440003', '660e8400-e29b-41d4-a716-446655440003', '770e8400-e29b-41d4-a716-446655440003', '2024-01-17 11:00:00+03', 30, 'consultation', 'completed', 'paid', 'cash', 'طفل يعاني من ارتفاع في درجة الحرارة', 'التهاب في الحلق، ارتفاع في درجة الحرارة', 'باراسيتامول 15 مج/كجم كل 6 ساعات، مضاد حيوي أموكسيسيلين', false, NULL, '550e8400-e29b-41d4-a716-446655440000'),

('990e8400-e29b-41d4-a716-446655440004', '660e8400-e29b-41d4-a716-446655440004', '770e8400-e29b-41d4-a716-446655440001', '2024-01-18 09:00:00+03', 30, 'consultation', 'pending', 'unpaid', NULL, 'موعد جديد للمريض', NULL, NULL, false, NULL, '550e8400-e29b-41d4-a716-446655440000'),

('990e8400-e29b-41d4-a716-446655440005', '660e8400-e29b-41d4-a716-446655440005', '770e8400-e29b-41d4-a716-446655440004', '2024-01-19 15:00:00+03', 45, 'consultation', 'confirmed', 'paid', 'bank_transfer', 'متابعة الحمل', 'حمل طبيعي في الأسبوع 28', 'حمض الفوليك 400 ميكروجرام يومياً، كالسيوم 1000 مج يومياً', true, '2024-02-19 15:00:00+03', '550e8400-e29b-41d4-a716-446655440000'),

('990e8400-e29b-41d4-a716-446655440006', '660e8400-e29b-41d4-a716-446655440001', '770e8400-e29b-41d4-a716-446655440005', '2024-01-20 08:00:00+03', 60, 'surgery', 'scheduled', 'unpaid', NULL, 'عملية استئصال المرارة بالمنظار', NULL, NULL, true, '2024-02-20 08:00:00+03', '550e8400-e29b-41d4-a716-446655440000')
ON CONFLICT (id) DO NOTHING;

-- Insert appointment slots
INSERT INTO appointment_slots (id, doctor_id, date, start_time, end_time, is_available, is_booked, appointment_id) VALUES
-- Doctor 1 slots for today
('aa0e8400-e29b-41d4-a716-446655440001', '770e8400-e29b-41d4-a716-446655440001', CURRENT_DATE, '09:00:00', '09:30:00', false, true, '990e8400-e29b-41d4-a716-446655440001'),
('aa0e8400-e29b-41d4-a716-446655440002', '770e8400-e29b-41d4-a716-446655440001', CURRENT_DATE, '09:30:00', '10:00:00', true, false, NULL),
('aa0e8400-e29b-41d4-a716-446655440003', '770e8400-e29b-41d4-a716-446655440001', CURRENT_DATE, '10:00:00', '10:30:00', true, false, NULL),
('aa0e8400-e29b-41d4-a716-446655440004', '770e8400-e29b-41d4-a716-446655440001', CURRENT_DATE, '10:30:00', '11:00:00', true, false, NULL),
('aa0e8400-e29b-41d4-a716-446655440005', '770e8400-e29b-41d4-a716-446655440001', CURRENT_DATE, '11:00:00', '11:30:00', true, false, NULL),

-- Doctor 2 slots for today
('aa0e8400-e29b-41d4-a716-446655440006', '770e8400-e29b-41d4-a716-446655440002', CURRENT_DATE, '08:00:00', '08:30:00', true, false, NULL),
('aa0e8400-e29b-41d4-a716-446655440007', '770e8400-e29b-41d4-a716-446655440002', CURRENT_DATE, '08:30:00', '09:00:00', true, false, NULL),
('aa0e8400-e29b-41d4-a716-446655440008', '770e8400-e29b-41d4-a716-446655440002', CURRENT_DATE, '09:00:00', '09:30:00', true, false, NULL),
('aa0e8400-e29b-41d4-a716-446655440009', '770e8400-e29b-41d4-a716-446655440002', CURRENT_DATE, '09:30:00', '10:00:00', true, false, NULL),
('aa0e8400-e29b-41d4-a716-446655440010', '770e8400-e29b-41d4-a716-446655440002', CURRENT_DATE, '10:00:00', '10:30:00', true, false, NULL)
ON CONFLICT (id) DO NOTHING;

-- Insert medical records
INSERT INTO medical_records (id, patient_id, doctor_id, appointment_id, record_type, title, description, content, file_path, file_name, file_size, mime_type, is_confidential, is_verified, verified_by, verified_at, created_by) VALUES
('bb0e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440001', '770e8400-e29b-41d4-a716-446655440001', '990e8400-e29b-41d4-a716-446655440001', 'consultation', 'استشارة طبية - ارتفاع ضغط الدم', 'استشارة طبية للمريض محمد عبدالله الأحمد', 
 '{"chief_complaint": "ارتفاع في ضغط الدم", "history": "مريض يبلغ من العمر 39 عاماً يعاني من ارتفاع في ضغط الدم منذ 6 أشهر", "examination": "ضغط الدم 150/95، الوزن 85 كجم، الطول 175 سم", "diagnosis": "ارتفاع ضغط الدم من الدرجة الأولى", "treatment": "لوسارتان 50 مج مرة يومياً، ميتفورمين 500 مج مرتين يومياً", "follow_up": "مراجعة بعد شهر"}',
 '/uploads/medical_records/consultation_001.pdf', 'consultation_001.pdf', 245760, 'application/pdf', false, true, '770e8400-e29b-41d4-a716-446655440001', NOW(), '550e8400-e29b-41d4-a716-446655440000'),

('bb0e8400-e29b-41d4-a716-446655440002', '660e8400-e29b-41d4-a716-446655440002', '770e8400-e29b-41d4-a716-446655440002', '990e8400-e29b-41d4-a716-446655440002', 'consultation', 'استشارة طبية - ألم في الصدر', 'استشارة طبية للمريضة نورا سعد المطيري', 
 '{"chief_complaint": "ألم في الصدر", "history": "مريضة تبلغ من العمر 34 عاماً تعاني من ألم في الصدر منذ أسبوع", "examination": "الفحص السريري طبيعي، تخطيط القلب طبيعي", "diagnosis": "ألم في الصدر غير محدد السبب", "treatment": "إيكوسبرين 75 مج مرة يومياً، نتروجليسرين عند الحاجة", "follow_up": "مراجعة بعد أسبوعين مع فحوصات إضافية"}',
 '/uploads/medical_records/consultation_002.pdf', 'consultation_002.pdf', 198432, 'application/pdf', false, true, '770e8400-e29b-41d4-a716-446655440002', NOW(), '550e8400-e29b-41d4-a716-446655440000'),

('bb0e8400-e29b-41d4-a716-446655440003', '660e8400-e29b-41d4-a716-446655440003', '770e8400-e29b-41d4-a716-446655440003', '990e8400-e29b-41d4-a716-446655440003', 'consultation', 'استشارة طبية - التهاب الحلق', 'استشارة طبية للطفل عبدالرحمن خالد الحربي', 
 '{"chief_complaint": "ارتفاع في درجة الحرارة والتهاب في الحلق", "history": "طفل يبلغ من العمر 6 سنوات يعاني من ارتفاع في درجة الحرارة والتهاب في الحلق منذ يومين", "examination": "درجة الحرارة 38.5°C، التهاب في الحلق، تضخم في اللوزتين", "diagnosis": "التهاب في الحلق، ارتفاع في درجة الحرارة", "treatment": "باراسيتامول 15 مج/كجم كل 6 ساعات، مضاد حيوي أموكسيسيلين", "follow_up": "مراجعة بعد 3 أيام"}',
 '/uploads/medical_records/consultation_003.pdf', 'consultation_003.pdf', 187654, 'application/pdf', false, true, '770e8400-e29b-41d4-a716-446655440003', NOW(), '550e8400-e29b-41d4-a716-446655440000'),

('bb0e8400-e29b-41d4-a716-446655440004', '660e8400-e29b-41d4-a716-446655440001', '770e8400-e29b-41d4-a716-446655440001', NULL, 'lab_result', 'نتائج فحص الدم الشامل', 'نتائج فحص الدم الشامل للمريض محمد عبدالله الأحمد', 
 '{"test_name": "فحص الدم الشامل", "test_date": "2024-01-15", "results": {"hemoglobin": "14.2 g/dL", "white_blood_cells": "7.5 K/μL", "platelets": "250 K/μL", "glucose": "95 mg/dL", "cholesterol": "180 mg/dL"}, "reference_range": "طبيعي", "interpretation": "النتائج ضمن المعدل الطبيعي"}',
 '/uploads/medical_records/lab_result_001.pdf', 'lab_result_001.pdf', 156789, 'application/pdf', false, true, '770e8400-e29b-41d4-a716-446655440001', NOW(), '550e8400-e29b-41d4-a716-446655440000'),

('bb0e8400-e29b-41d4-a716-446655440005', '660e8400-e29b-41d4-a716-446655440002', '770e8400-e29b-41d4-a716-446655440002', NULL, 'imaging', 'تقرير الأشعة السينية للصدر', 'تقرير الأشعة السينية للصدر للمريضة نورا سعد المطيري', 
 '{"exam_type": "أشعة سينية للصدر", "exam_date": "2024-01-16", "findings": "الرئتان طبيعيتان، القلب بحجم طبيعي، لا توجد علامات على وجود التهاب رئوي", "impression": "صورة طبيعية للصدر", "recommendations": "لا حاجة لفحوصات إضافية"}',
 '/uploads/medical_records/xray_001.pdf', 'xray_001.pdf', 312456, 'application/pdf', false, true, '770e8400-e29b-41d4-a716-446655440002', NOW(), '550e8400-e29b-41d4-a716-446655440000'),

('bb0e8400-e29b-41d4-a716-446655440006', '660e8400-e29b-41d4-a716-446655440005', '770e8400-e29b-41d4-a716-446655440004', '990e8400-e29b-41d4-a716-446655440005', 'consultation', 'متابعة الحمل - الأسبوع 28', 'متابعة الحمل للمريضة ريم عبدالعزيز الشمري', 
 '{"pregnancy_week": 28, "blood_pressure": "120/80", "weight_gain": "8 كجم", "fetal_heart_rate": "140 bpm", "fundal_height": "28 سم", "ultrasound_findings": "الجنين ينمو بشكل طبيعي، المشيمة في وضع طبيعي", "recommendations": "متابعة منتظمة، تناول الفيتامينات المطلوبة"}',
 '/uploads/medical_records/pregnancy_001.pdf', 'pregnancy_001.pdf', 278901, 'application/pdf', false, true, '770e8400-e29b-41d4-a716-446655440004', NOW(), '550e8400-e29b-41d4-a716-446655440000')
ON CONFLICT (id) DO NOTHING;

-- Insert file uploads
INSERT INTO file_uploads (id, user_id, entity_type, entity_id, file_name, original_name, file_path, file_size, mime_type, file_hash, is_processed, processing_status, metadata, created_by) VALUES
('cc0e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440007', 'medical_record', 'bb0e8400-e29b-41d4-a716-446655440001', 'consultation_001.pdf', 'استشارة طبية - محمد الأحمد.pdf', '/uploads/medical_records/consultation_001.pdf', 245760, 'application/pdf', 'a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6', true, 'completed', '{"uploaded_by": "doctor", "patient_consent": true}', '550e8400-e29b-41d4-a716-446655440000'),

('cc0e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440008', 'medical_record', 'bb0e8400-e29b-41d4-a716-446655440002', 'consultation_002.pdf', 'استشارة طبية - نورا المطيري.pdf', '/uploads/medical_records/consultation_002.pdf', 198432, 'application/pdf', 'b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a1', true, 'completed', '{"uploaded_by": "doctor", "patient_consent": true}', '550e8400-e29b-41d4-a716-446655440000'),

('cc0e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440009', 'medical_record', 'bb0e8400-e29b-41d4-a716-446655440003', 'consultation_003.pdf', 'استشارة طبية - عبدالرحمن الحربي.pdf', '/uploads/medical_records/consultation_003.pdf', 187654, 'application/pdf', 'c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a1b2', true, 'completed', '{"uploaded_by": "doctor", "patient_consent": true}', '550e8400-e29b-41d4-a716-446655440000'),

('cc0e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440007', 'medical_record', 'bb0e8400-e29b-41d4-a716-446655440004', 'lab_result_001.pdf', 'نتائج فحص الدم - محمد الأحمد.pdf', '/uploads/medical_records/lab_result_001.pdf', 156789, 'application/pdf', 'd4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a1b2c3', true, 'completed', '{"uploaded_by": "lab_technician", "patient_consent": true}', '550e8400-e29b-41d4-a716-446655440000'),

('cc0e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440008', 'medical_record', 'bb0e8400-e29b-41d4-a716-446655440005', 'xray_001.pdf', 'أشعة الصدر - نورا المطيري.pdf', '/uploads/medical_records/xray_001.pdf', 312456, 'application/pdf', 'e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a1b2c3d4', true, 'completed', '{"uploaded_by": "radiologist", "patient_consent": true}', '550e8400-e29b-41d4-a716-446655440000')
ON CONFLICT (id) DO NOTHING;

-- Insert patient files
INSERT INTO patient_files (id, patient_id, file_type, file_name, file_path, file_size, mime_type, is_accessible, access_level, created_by) VALUES
('dd0e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440001', 'medical_record', 'consultation_001.pdf', '/uploads/patient_files/pat_001/consultation_001.pdf', 245760, 'application/pdf', true, 'patient', '550e8400-e29b-41d4-a716-446655440000'),

('dd0e8400-e29b-41d4-a716-446655440002', '660e8400-e29b-41d4-a716-446655440001', 'lab_result', 'lab_result_001.pdf', '/uploads/patient_files/pat_001/lab_result_001.pdf', 156789, 'application/pdf', true, 'patient', '550e8400-e29b-41d4-a716-446655440000'),

('dd0e8400-e29b-41d4-a716-446655440003', '660e8400-e29b-41d4-a716-446655440002', 'medical_record', 'consultation_002.pdf', '/uploads/patient_files/pat_002/consultation_002.pdf', 198432, 'application/pdf', true, 'patient', '550e8400-e29b-41d4-a716-446655440000'),

('dd0e8400-e29b-41d4-a716-446655440004', '660e8400-e29b-41d4-a716-446655440002', 'imaging', 'xray_001.pdf', '/uploads/patient_files/pat_002/xray_001.pdf', 312456, 'application/pdf', true, 'patient', '550e8400-e29b-41d4-a716-446655440000'),

('dd0e8400-e29b-41d4-a716-446655440005', '660e8400-e29b-41d4-a716-446655440003', 'medical_record', 'consultation_003.pdf', '/uploads/patient_files/pat_003/consultation_003.pdf', 187654, 'application/pdf', true, 'patient', '550e8400-e29b-41d4-a716-446655440000'),

('dd0e8400-e29b-41d4-a716-446655440006', '660e8400-e29b-41d4-a716-446655440005', 'medical_record', 'pregnancy_001.pdf', '/uploads/patient_files/pat_005/pregnancy_001.pdf', 278901, 'application/pdf', true, 'patient', '550e8400-e29b-41d4-a716-446655440000')
ON CONFLICT (id) DO NOTHING;

SELECT 'Appointments and medical records seed data inserted successfully!' as status;