-- ========================================
-- ROLES AND USERS SEED DATA
-- بيانات البذور للأدوار والمستخدمين
-- ========================================

-- Insert additional roles with detailed permissions
INSERT INTO roles (role, name, description, permissions) VALUES
('nurse', 'Nurse', 'Nursing staff with patient care access', '["view_patients", "update_vital_signs", "assist_doctors", "patient_monitoring"]'),
('receptionist', 'Receptionist', 'Front desk staff with appointment management', '["manage_appointments", "patient_registration", "payment_processing", "phone_support"]'),
('pharmacist', 'Pharmacist', 'Pharmacy staff with medication management', '["view_prescriptions", "dispense_medications", "medication_counseling", "inventory_management"]'),
('lab_technician', 'Lab Technician', 'Laboratory staff with test management', '["process_lab_tests", "upload_results", "quality_control", "equipment_maintenance"]'),
('radiologist', 'Radiologist', 'Medical imaging specialist', '["interpret_imaging", "create_reports", "consult_doctors", "quality_assurance"]')
ON CONFLICT (role) DO NOTHING;

-- Insert admin user
INSERT INTO users (id, email, password_hash, role, is_active, is_verified, profile, preferences) VALUES
('550e8400-e29b-41d4-a716-446655440000', 'admin@moeen.com', '$2b$10$rQZ8K9vL2mN3pO4qR5sT6uV7wX8yZ9aA0bB1cC2dD3eE4fF5gG6hH7iI8jJ9kK0lL1mM2nN3oO4pP5qQ6rR7sS8tT9uU0vV1wW2xX3yY4zZ5', 'admin', true, true, 
'{"fullName": "مدير النظام", "phone": "+966501234567", "department": "IT", "employeeId": "ADM001"}',
'{"theme": "light", "language": "ar", "notifications": {"email": true, "sms": true, "push": true}}');

-- Insert supervisor user
INSERT INTO users (id, email, password_hash, role, is_active, is_verified, profile, preferences) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'supervisor@moeen.com', '$2b$10$rQZ8K9vL2mN3pO4qR5sT6uV7wX8yZ9aA0bB1cC2dD3eE4fF5gG6hH7iI8jJ9kK0lL1mM2nN3oO4pP5qQ6rR7sS8tT9uU0vV1wW2xX3yY4zZ5', 'supervisor', true, true,
'{"fullName": "مشرف العمليات", "phone": "+966501234568", "department": "Operations", "employeeId": "SUP001"}',
'{"theme": "light", "language": "ar", "notifications": {"email": true, "sms": false, "push": true}}');

-- Insert staff users
INSERT INTO users (id, email, password_hash, role, is_active, is_verified, profile, preferences) VALUES
('550e8400-e29b-41d4-a716-446655440002', 'staff1@moeen.com', '$2b$10$rQZ8K9vL2mN3pO4qR5sT6uV7wX8yZ9aA0bB1cC2dD3eE4fF5gG6hH7iI8jJ9kK0lL1mM2nN3oO4pP5qQ6rR7sS8tT9uU0vV1wW2xX3yY4zZ5', 'staff', true, true,
'{"fullName": "أحمد محمد", "phone": "+966501234569", "department": "Reception", "employeeId": "STF001"}',
'{"theme": "light", "language": "ar", "notifications": {"email": true, "sms": true, "push": true}}'),
('550e8400-e29b-41d4-a716-446655440003', 'staff2@moeen.com', '$2b$10$rQZ8K9vL2mN3pO4qR5sT6uV7wX8yZ9aA0bB1cC2dD3eE4fF5gG6hH7iI8jJ9kK0lL1mM2nN3oO4pP5qQ6rR7sS8tT9uU0vV1wW2xX3yY4zZ5', 'staff', true, true,
'{"fullName": "فاطمة علي", "phone": "+966501234570", "department": "Billing", "employeeId": "STF002"}',
'{"theme": "dark", "language": "ar", "notifications": {"email": true, "sms": false, "push": true}}');

-- Insert doctor users
INSERT INTO users (id, email, password_hash, role, is_active, is_verified, profile, preferences) VALUES
('550e8400-e29b-41d4-a716-446655440004', 'dr.ahmed@moeen.com', '$2b$10$rQZ8K9vL2mN3pO4qR5sT6uV7wX8yZ9aA0bB1cC2dD3eE4fF5gG6hH7iI8jJ9kK0lL1mM2nN3oO4pP5qQ6rR7sS8tT9uU0vV1wW2xX3yY4zZ5', 'doctor', true, true,
'{"fullName": "د. أحمد السعد", "phone": "+966501234571", "speciality": "Internal Medicine", "employeeId": "DOC001"}',
'{"theme": "light", "language": "ar", "notifications": {"email": true, "sms": true, "push": true}}'),
('550e8400-e29b-41d4-a716-446655440005', 'dr.sara@moeen.com', '$2b$10$rQZ8K9vL2mN3pO4qR5sT6uV7wX8yZ9aA0bB1cC2dD3eE4fF5gG6hH7iI8jJ9kK0lL1mM2nN3oO4pP5qQ6rR7sS8tT9uU0vV1wW2xX3yY4zZ5', 'doctor', true, true,
'{"fullName": "د. سارة محمد", "phone": "+966501234572", "speciality": "Pediatrics", "employeeId": "DOC002"}',
'{"theme": "light", "language": "ar", "notifications": {"email": true, "sms": false, "push": true}}'),
('550e8400-e29b-41d4-a716-446655440006', 'dr.khalid@moeen.com', '$2b$10$rQZ8K9vL2mN3pO4qR5sT6uV7wX8yZ9aA0bB1cC2dD3eE4fF5gG6hH7iI8jJ9kK0lL1mM2nN3oO4pP5qQ6rR7sS8tT9uU0vV1wW2xX3yY4zZ5', 'doctor', true, true,
'{"fullName": "د. خالد العتيبي", "phone": "+966501234573", "speciality": "Cardiology", "employeeId": "DOC003"}',
'{"theme": "dark", "language": "ar", "notifications": {"email": true, "sms": true, "push": true}}');

-- Insert patient users
INSERT INTO users (id, email, password_hash, role, is_active, is_verified, profile, preferences) VALUES
('550e8400-e29b-41d4-a716-446655440007', 'patient1@example.com', '$2b$10$rQZ8K9vL2mN3pO4qR5sT6uV7wX8yZ9aA0bB1cC2dD3eE4fF5gG6hH7iI8jJ9kK0lL1mM2nN3oO4pP5qQ6rR7sS8tT9uU0vV1wW2xX3yY4zZ5', 'patient', true, true,
'{"fullName": "محمد عبدالله", "phone": "+966501234574", "dateOfBirth": "1985-03-15"}',
'{"theme": "light", "language": "ar", "notifications": {"email": true, "sms": true, "push": true}}'),
('550e8400-e29b-41d4-a716-446655440008', 'patient2@example.com', '$2b$10$rQZ8K9vL2mN3pO4qR5sT6uV7wX8yZ9aA0bB1cC2dD3eE4fF5gG6hH7iI8jJ9kK0lL1mM2nN3oO4pP5qQ6rR7sS8tT9uU0vV1wW2xX3yY4zZ5', 'patient', true, true,
'{"fullName": "نورا أحمد", "phone": "+966501234575", "dateOfBirth": "1990-07-22"}',
'{"theme": "light", "language": "ar", "notifications": {"email": true, "sms": false, "push": true}}'),
('550e8400-e29b-41d4-a716-446655440009', 'patient3@example.com', '$2b$10$rQZ8K9vL2mN3pO4qR5sT6uV7wX8yZ9aA0bB1cC2dD3eE4fF5gG6hH7iI8jJ9kK0lL1mM2nN3oO4pP5qQ6rR7sS8tT9uU0vV1wW2xX3yY4zZ5', 'patient', true, true,
'{"fullName": "عبدالرحمن سالم", "phone": "+966501234576", "dateOfBirth": "1978-11-08"}',
'{"theme": "dark", "language": "ar", "notifications": {"email": true, "sms": true, "push": true}}'),
('550e8400-e29b-41d4-a716-446655440010', 'patient4@example.com', '$2b$10$rQZ8K9vL2mN3pO4qR5sT6uV7wX8yZ9aA0bB1cC2dD3eE4fF5gG6hH7iI8jJ9kK0lL1mM2nN3oO4pP5qQ6rR7sS8tT9uU0vV1wW2xX3yY4zZ5', 'patient', true, true,
'{"fullName": "فاطمة محمد", "phone": "+966501234577", "dateOfBirth": "1995-01-30"}',
'{"theme": "light", "language": "ar", "notifications": {"email": true, "sms": true, "push": true}}');

-- Log completion
INSERT INTO system_metrics (metric_key, metric_value, metric_unit, metadata) VALUES
('users_seeded', 10, 'count', '{"timestamp": "NOW()", "roles": ["admin", "supervisor", "staff", "doctor", "patient"]}');