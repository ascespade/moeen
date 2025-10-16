-- ========================================
-- PATIENTS AND DOCTORS SEED DATA
-- بيانات المرضى والأطباء
-- ========================================

-- Insert patients
INSERT INTO patients (id, user_id, medical_record_number, full_name, first_name, last_name, date_of_birth, gender, phone, email, address, emergency_contact, insurance_provider, insurance_number, insurance_expiry, blood_type, allergies, medical_conditions, medications, is_activated, activation_date, created_by) VALUES
('660e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440007', 'MR2024001', 'محمد عبدالله الأحمد', 'محمد', 'الأحمد', '1985-03-15', 'male', '+966501234574', 'patient1@example.com',
 '{"street": "شارع الملك فهد", "city": "الرياض", "district": "النخيل", "postalCode": "12345", "country": "السعودية"}',
 '{"name": "فاطمة الأحمد", "relationship": "زوجة", "phone": "+966501234580", "email": "fatima@example.com"}',
 'تأمين تكافل', 'TKF2024001', '2025-12-31', 'O+', '{"الأسبرين", "البنسلين"}', '{"السكري", "ارتفاع ضغط الدم"}', '{"ميتفورمين 500 مج", "لوسارتان 50 مج"}', true, NOW(), '550e8400-e29b-41d4-a716-446655440000'),

('660e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440008', 'MR2024002', 'نورا سعد المطيري', 'نورا', 'المطيري', '1990-07-22', 'female', '+966501234575', 'patient2@example.com',
 '{"street": "شارع العليا", "city": "الرياض", "district": "العليا", "postalCode": "12346", "country": "السعودية"}',
 '{"name": "سعد المطيري", "relationship": "أب", "phone": "+966501234581", "email": "saad@example.com"}',
 'تأمين بوبا العربية', 'BPA2024002', '2025-06-30', 'A+', '{"المكسرات"}', '{"الربو"}', '{"فنتولين بخاخ"}', true, NOW(), '550e8400-e29b-41d4-a716-446655440000'),

('660e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440009', 'MR2024003', 'عبدالرحمن خالد الحربي', 'عبدالرحمن', 'الحربي', '1978-11-08', 'male', '+966501234576', 'patient3@example.com',
 '{"street": "شارع التحلية", "city": "جدة", "district": "التحلية", "postalCode": "21432", "country": "السعودية"}',
 '{"name": "خالد الحربي", "relationship": "أخ", "phone": "+966501234582", "email": "khalid@example.com"}',
 'تأمين الأهلي', 'AHL2024003', '2025-09-15', 'B+', '{}', '{"أمراض القلب"}', '{"أتورفاستاتين 20 مج", "أسبيرين 81 مج"}', true, NOW(), '550e8400-e29b-41d4-a716-446655440000'),

('660e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440007', 'MR2024004', 'فهد محمد القحطاني', 'فهد', 'القحطاني', '1992-05-12', 'male', '+966501234577', 'fahad@example.com',
 '{"street": "شارع الأمير محمد", "city": "الدمام", "district": "الخبر", "postalCode": "31952", "country": "السعودية"}',
 '{"name": "محمد القحطاني", "relationship": "أب", "phone": "+966501234583", "email": "mohammed@example.com"}',
 'تأمين سابك', 'SAB2024004', '2025-03-20', 'AB+', '{"البيض"}', '{}', '{}', false, NULL, '550e8400-e29b-41d4-a716-446655440000'),

('660e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440008', 'MR2024005', 'ريم عبدالعزيز الشمري', 'ريم', 'الشمري', '1988-12-03', 'female', '+966501234578', 'reem@example.com',
 '{"street": "شارع الملك عبدالعزيز", "city": "الرياض", "district": "الملز", "postalCode": "12347", "country": "السعودية"}',
 '{"name": "عبدالعزيز الشمري", "relationship": "زوج", "phone": "+966501234584", "email": "abdulaziz@example.com"}',
 'تأمين الراجحي', 'RAJ2024005', '2025-08-10', 'O-', '{"المأكولات البحرية"}', '{"فقر الدم"}', '{"حديد 325 مج"}', true, NOW(), '550e8400-e29b-41d4-a716-446655440000')
ON CONFLICT (id) DO NOTHING;

-- Insert doctors
INSERT INTO doctors (id, user_id, license_number, full_name, first_name, last_name, speciality, sub_specialities, qualifications, experience_years, phone, email, address, schedule, consultation_fee, is_available, rating, total_reviews, created_by) VALUES
('770e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440004', 'DOC12345', 'د. أحمد محمد العتيبي', 'أحمد', 'العتيبي', 'طب عام', '{"طب الأسرة", "الطب الباطني"}', '{"بكالوريوس الطب والجراحة", "دبلوم طب الأسرة", "زمالة الطب الباطني"}', 8, '+966501234571', 'dr.ahmed@healthcare.com',
 '{"street": "شارع الملك فهد", "city": "الرياض", "district": "النخيل", "postalCode": "12345", "country": "السعودية"}',
 '{"0": {"isWorking": false, "startTime": "09:00", "endTime": "17:00"}, "1": {"isWorking": true, "startTime": "09:00", "endTime": "17:00"}, "2": {"isWorking": true, "startTime": "09:00", "endTime": "17:00"}, "3": {"isWorking": true, "startTime": "09:00", "endTime": "17:00"}, "4": {"isWorking": true, "startTime": "09:00", "endTime": "17:00"}, "5": {"isWorking": true, "startTime": "09:00", "endTime": "17:00"}, "6": {"isWorking": false, "startTime": "09:00", "endTime": "17:00"}}',
 200.00, true, 4.8, 156, '550e8400-e29b-41d4-a716-446655440000'),

('770e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440005', 'DOC12346', 'د. سارة عبدالرحمن الغامدي', 'سارة', 'الغامدي', 'أمراض القلب', '{"قسطرة القلب", "أمراض القلب التداخلية"}', '{"بكالوريوس الطب والجراحة", "زمالة أمراض القلب", "دبلوم القسطرة التداخلية"}', 12, '+966501234572', 'dr.sara@healthcare.com',
 '{"street": "شارع العليا", "city": "الرياض", "district": "العليا", "postalCode": "12346", "country": "السعودية"}',
 '{"0": {"isWorking": false, "startTime": "08:00", "endTime": "16:00"}, "1": {"isWorking": true, "startTime": "08:00", "endTime": "16:00"}, "2": {"isWorking": true, "startTime": "08:00", "endTime": "16:00"}, "3": {"isWorking": true, "startTime": "08:00", "endTime": "16:00"}, "4": {"isWorking": true, "startTime": "08:00", "endTime": "16:00"}, "5": {"isWorking": true, "startTime": "08:00", "endTime": "16:00"}, "6": {"isWorking": false, "startTime": "08:00", "endTime": "16:00"}}',
 350.00, true, 4.9, 89, '550e8400-e29b-41d4-a716-446655440000'),

('770e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440006', 'DOC12347', 'د. خالد سعد الدوسري', 'خالد', 'الدوسري', 'طب الأطفال', '{"حديثي الولادة", "أمراض الأطفال العصبية"}', '{"بكالوريوس الطب والجراحة", "زمالة طب الأطفال", "دبلوم حديثي الولادة"}', 6, '+966501234573', 'dr.khalid@healthcare.com',
 '{"street": "شارع التحلية", "city": "جدة", "district": "التحلية", "postalCode": "21432", "country": "السعودية"}',
 '{"0": {"isWorking": false, "startTime": "10:00", "endTime": "18:00"}, "1": {"isWorking": true, "startTime": "10:00", "endTime": "18:00"}, "2": {"isWorking": true, "startTime": "10:00", "endTime": "18:00"}, "3": {"isWorking": true, "startTime": "10:00", "endTime": "18:00"}, "4": {"isWorking": true, "startTime": "10:00", "endTime": "18:00"}, "5": {"isWorking": true, "startTime": "10:00", "endTime": "18:00"}, "6": {"isWorking": false, "startTime": "10:00", "endTime": "18:00"}}',
 250.00, true, 4.7, 203, '550e8400-e29b-41d4-a716-446655440000'),

('770e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440004', 'DOC12348', 'د. فاطمة أحمد الزهراني', 'فاطمة', 'الزهراني', 'أمراض النساء والولادة', '{"أمراض النساء", "الولادة الطبيعية", "الولادة القيصرية"}', '{"بكالوريوس الطب والجراحة", "زمالة أمراض النساء والولادة", "دبلوم الموجات فوق الصوتية"}', 10, '+966501234579', 'dr.fatima@healthcare.com',
 '{"street": "شارع الأمير محمد", "city": "الدمام", "district": "الخبر", "postalCode": "31952", "country": "السعودية"}',
 '{"0": {"isWorking": false, "startTime": "09:00", "endTime": "17:00"}, "1": {"isWorking": true, "startTime": "09:00", "endTime": "17:00"}, "2": {"isWorking": true, "startTime": "09:00", "endTime": "17:00"}, "3": {"isWorking": true, "startTime": "09:00", "endTime": "17:00"}, "4": {"isWorking": true, "startTime": "09:00", "endTime": "17:00"}, "5": {"isWorking": true, "startTime": "09:00", "endTime": "17:00"}, "6": {"isWorking": false, "startTime": "09:00", "endTime": "17:00"}}',
 300.00, true, 4.6, 134, '550e8400-e29b-41d4-a716-446655440000'),

('770e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440005', 'DOC12349', 'د. عبدالله محمد العتيبي', 'عبدالله', 'العتيبي', 'جراحة عامة', '{"جراحة المناظير", "جراحة السمنة"}', '{"بكالوريوس الطب والجراحة", "زمالة الجراحة العامة", "دبلوم جراحة المناظير"}', 15, '+966501234580', 'dr.abdullah@healthcare.com',
 '{"street": "شارع الملك عبدالعزيز", "city": "الرياض", "district": "الملز", "postalCode": "12347", "country": "السعودية"}',
 '{"0": {"isWorking": false, "startTime": "08:00", "endTime": "16:00"}, "1": {"isWorking": true, "startTime": "08:00", "endTime": "16:00"}, "2": {"isWorking": true, "startTime": "08:00", "endTime": "16:00"}, "3": {"isWorking": true, "startTime": "08:00", "endTime": "16:00"}, "4": {"isWorking": true, "startTime": "08:00", "endTime": "16:00"}, "5": {"isWorking": true, "startTime": "08:00", "endTime": "16:00"}, "6": {"isWorking": false, "startTime": "08:00", "endTime": "16:00"}}',
 500.00, true, 4.9, 67, '550e8400-e29b-41d4-a716-446655440000')
ON CONFLICT (id) DO NOTHING;

-- Insert staff
INSERT INTO staff (id, user_id, employee_id, full_name, first_name, last_name, department, position, phone, email, address, hire_date, salary, is_active, created_by) VALUES
('880e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440002', 'EMP001', 'سارة محمد القحطاني', 'سارة', 'القحطاني', 'الاستقبال', 'موظفة استقبال', '+966501234569', 'staff1@healthcare.com',
 '{"street": "شارع الملك فهد", "city": "الرياض", "district": "النخيل", "postalCode": "12345", "country": "السعودية"}',
 '2023-01-15', 8000.00, true, '550e8400-e29b-41d4-a716-446655440000'),

('880e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440003', 'EMP002', 'خالد عبدالله الشمري', 'خالد', 'الشمري', 'المالية', 'موظف مالي', '+966501234570', 'staff2@healthcare.com',
 '{"street": "شارع العليا", "city": "الرياض", "district": "العليا", "postalCode": "12346", "country": "السعودية"}',
 '2023-03-01', 9000.00, true, '550e8400-e29b-41d4-a716-446655440000'),

('880e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440002', 'EMP003', 'نورا أحمد المطيري', 'نورا', 'المطيري', 'التمريض', 'ممرضة', '+966501234581', 'nurse1@healthcare.com',
 '{"street": "شارع التحلية", "city": "جدة", "district": "التحلية", "postalCode": "21432", "country": "السعودية"}',
 '2023-02-10', 7500.00, true, '550e8400-e29b-41d4-a716-446655440000'),

('880e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440003', 'EMP004', 'فهد محمد الدوسري', 'فهد', 'الدوسري', 'المختبر', 'فني مختبر', '+966501234582', 'lab1@healthcare.com',
 '{"street": "شارع الأمير محمد", "city": "الدمام", "district": "الخبر", "postalCode": "31952", "country": "السعودية"}',
 '2023-04-15', 8500.00, true, '550e8400-e29b-41d4-a716-446655440000')
ON CONFLICT (id) DO NOTHING;

SELECT 'Patients and doctors seed data inserted successfully!' as status;