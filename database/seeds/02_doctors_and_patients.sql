-- ========================================
-- DOCTORS AND PATIENTS SEED DATA
-- بيانات البذور للأطباء والمرضى
-- ========================================

-- Insert doctors
INSERT INTO doctors (id, user_id, license_number, full_name, speciality, sub_speciality, phone, email, address, experience_years, education, certifications, schedule, consultation_fee, is_available, rating, total_reviews) VALUES
('550e8400-e29b-41d4-a716-446655440100', '550e8400-e29b-41d4-a716-446655440004', 'DOC-2024-001', 'د. أحمد السعد', 'Internal Medicine', 'Endocrinology', '+966501234571', 'dr.ahmed@moeen.com', 'الرياض، حي النخيل، شارع الملك فهد', 15, 
'[{"degree": "MBBS", "university": "King Saud University", "year": 2009}, {"degree": "MD", "university": "King Faisal Specialist Hospital", "year": 2014}]',
'[{"name": "Board Certified Internal Medicine", "issuer": "Saudi Commission for Health Specialties", "year": 2014}, {"name": "Endocrinology Fellowship", "issuer": "Mayo Clinic", "year": 2016}]',
'{"0": {"isWorking": false, "startTime": "09:00", "endTime": "17:00"}, "1": {"isWorking": true, "startTime": "09:00", "endTime": "17:00"}, "2": {"isWorking": true, "startTime": "09:00", "endTime": "17:00"}, "3": {"isWorking": true, "startTime": "09:00", "endTime": "17:00"}, "4": {"isWorking": true, "startTime": "09:00", "endTime": "17:00"}, "5": {"isWorking": true, "startTime": "09:00", "endTime": "17:00"}, "6": {"isWorking": false, "startTime": "09:00", "endTime": "17:00"}}',
250.00, true, 4.8, 127),

('550e8400-e29b-41d4-a716-446655440101', '550e8400-e29b-41d4-a716-446655440005', 'DOC-2024-002', 'د. سارة محمد', 'Pediatrics', 'Neonatology', '+966501234572', 'dr.sara@moeen.com', 'الرياض، حي العليا، شارع التحلية', 12,
'[{"degree": "MBBS", "university": "King Abdulaziz University", "year": 2012}, {"degree": "MD Pediatrics", "university": "King Fahd Medical City", "year": 2017}]',
'[{"name": "Board Certified Pediatrics", "issuer": "Saudi Commission for Health Specialties", "year": 2017}, {"name": "Neonatology Fellowship", "issuer": "Children''s Hospital of Philadelphia", "year": 2019}]',
'{"0": {"isWorking": false, "startTime": "08:00", "endTime": "16:00"}, "1": {"isWorking": true, "startTime": "08:00", "endTime": "16:00"}, "2": {"isWorking": true, "startTime": "08:00", "endTime": "16:00"}, "3": {"isWorking": true, "startTime": "08:00", "endTime": "16:00"}, "4": {"isWorking": true, "startTime": "08:00", "endTime": "16:00"}, "5": {"isWorking": true, "startTime": "08:00", "endTime": "16:00"}, "6": {"isWorking": false, "startTime": "08:00", "endTime": "16:00"}}',
200.00, true, 4.9, 89),

('550e8400-e29b-41d4-a716-446655440102', '550e8400-e29b-41d4-a716-446655440006', 'DOC-2024-003', 'د. خالد العتيبي', 'Cardiology', 'Interventional Cardiology', '+966501234573', 'dr.khalid@moeen.com', 'الرياض، حي الملز، شارع العليا', 18,
'[{"degree": "MBBS", "university": "King Saud University", "year": 2006}, {"degree": "MD Cardiology", "university": "Cleveland Clinic", "year": 2012}]',
'[{"name": "Board Certified Cardiology", "issuer": "American Board of Internal Medicine", "year": 2012}, {"name": "Interventional Cardiology Fellowship", "issuer": "Cleveland Clinic", "year": 2014}]',
'{"0": {"isWorking": false, "startTime": "10:00", "endTime": "18:00"}, "1": {"isWorking": true, "startTime": "10:00", "endTime": "18:00"}, "2": {"isWorking": true, "startTime": "10:00", "endTime": "18:00"}, "3": {"isWorking": true, "startTime": "10:00", "endTime": "18:00"}, "4": {"isWorking": true, "startTime": "10:00", "endTime": "18:00"}, "5": {"isWorking": true, "startTime": "10:00", "endTime": "18:00"}, "6": {"isWorking": false, "startTime": "10:00", "endTime": "18:00"}}',
350.00, true, 4.7, 156);

-- Insert patients
INSERT INTO patients (id, user_id, medical_record_number, full_name, date_of_birth, gender, phone, email, address, emergency_contact_name, emergency_contact_phone, insurance_provider, insurance_number, insurance_expiry, is_activated, activation_date, medical_history, allergies, medications) VALUES
('550e8400-e29b-41d4-a716-446655440200', '550e8400-e29b-41d4-a716-446655440007', 'MR-2024-001', 'محمد عبدالله', '1985-03-15', 'male', '+966501234574', 'patient1@example.com', 'الرياض، حي النرجس، شارع الملك عبدالعزيز', 'عبدالله محمد', '+966501234600', 'التأمين التعاوني', 'INS-2024-001', '2025-12-31', true, '2024-01-15 10:30:00+03',
'[{"condition": "Diabetes Type 2", "diagnosed": "2020-03-15", "status": "controlled"}, {"condition": "Hypertension", "diagnosed": "2019-08-20", "status": "stable"}]',
'[{"allergen": "Penicillin", "severity": "moderate", "reaction": "rash"}, {"allergen": "Shellfish", "severity": "severe", "reaction": "anaphylaxis"}]',
'[{"name": "Metformin", "dosage": "500mg", "frequency": "twice daily", "started": "2020-03-20"}, {"name": "Lisinopril", "dosage": "10mg", "frequency": "once daily", "started": "2019-08-25"}]'),

('550e8400-e29b-41d4-a716-446655440201', '550e8400-e29b-41d4-a716-446655440008', 'MR-2024-002', 'نورا أحمد', '1990-07-22', 'female', '+966501234575', 'patient2@example.com', 'الرياض، حي العليا، شارع التحلية', 'أحمد نورا', '+966501234601', 'بوبا العربية', 'INS-2024-002', '2025-06-30', true, '2024-02-10 14:20:00+03',
'[{"condition": "Asthma", "diagnosed": "2018-05-10", "status": "well-controlled"}, {"condition": "Migraine", "diagnosed": "2021-02-14", "status": "episodic"}]',
'[{"allergen": "Dust mites", "severity": "moderate", "reaction": "wheezing"}, {"allergen": "Pollen", "severity": "mild", "reaction": "sneezing"}]',
'[{"name": "Albuterol inhaler", "dosage": "90mcg", "frequency": "as needed", "started": "2018-05-15"}, {"name": "Sumatriptan", "dosage": "50mg", "frequency": "as needed", "started": "2021-02-20"}]'),

('550e8400-e29b-41d4-a716-446655440202', '550e8400-e29b-41d4-a716-446655440009', 'MR-2024-003', 'عبدالرحمن سالم', '1978-11-08', 'male', '+966501234576', 'patient3@example.com', 'الرياض، حي الملز، شارع العليا', 'سالم عبدالرحمن', '+966501234602', 'تأمين تكافل', 'INS-2024-003', '2025-09-15', true, '2024-01-20 09:15:00+03',
'[{"condition": "Coronary Artery Disease", "diagnosed": "2022-01-10", "status": "stable"}, {"condition": "High Cholesterol", "diagnosed": "2021-11-05", "status": "controlled"}]',
'[{"allergen": "Aspirin", "severity": "mild", "reaction": "stomach upset"}]',
'[{"name": "Atorvastatin", "dosage": "20mg", "frequency": "once daily", "started": "2021-11-10"}, {"name": "Clopidogrel", "dosage": "75mg", "frequency": "once daily", "started": "2022-01-15"}]'),

('550e8400-e29b-41d4-a716-446655440203', '550e8400-e29b-41d4-a716-446655440010', 'MR-2024-004', 'فاطمة محمد', '1995-01-30', 'female', '+966501234577', 'patient4@example.com', 'الرياض، حي النرجس، شارع الملك عبدالعزيز', 'محمد فاطمة', '+966501234603', 'التأمين التعاوني', 'INS-2024-004', '2025-11-20', true, '2024-03-05 16:45:00+03',
'[{"condition": "Pregnancy", "diagnosed": "2024-02-01", "status": "ongoing"}, {"condition": "Iron Deficiency Anemia", "diagnosed": "2024-02-15", "status": "treated"}]',
'[{"allergen": "Latex", "severity": "mild", "reaction": "skin irritation"}]',
'[{"name": "Prenatal Vitamins", "dosage": "1 tablet", "frequency": "once daily", "started": "2024-02-01"}, {"name": "Iron Supplement", "dosage": "65mg", "frequency": "once daily", "started": "2024-02-20"}]');

-- Log completion
INSERT INTO system_metrics (metric_key, metric_value, metric_unit, metadata) VALUES
('doctors_seeded', 3, 'count', '{"timestamp": "NOW()", "specialities": ["Internal Medicine", "Pediatrics", "Cardiology"]}'),
('patients_seeded', 4, 'count', '{"timestamp": "NOW()", "activated": true}');