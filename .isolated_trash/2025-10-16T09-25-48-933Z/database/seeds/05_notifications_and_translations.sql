-- ========================================
-- NOTIFICATIONS AND TRANSLATIONS SEED DATA
-- بيانات الإشعارات والترجمات
-- ========================================

-- Insert notifications
INSERT INTO notifications (id, user_id, type, title, message, channel, status, priority, scheduled_at, sent_at, read_at, metadata, created_by) VALUES
('hh0e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440007', 'appointment', 'تأكيد الموعد', 'تم تأكيد موعدك مع د. أحمد العتيبي في 15 يناير 2024 الساعة 10:00 صباحاً', 'email', 'sent', 'normal', '2024-01-14 18:00:00+03', '2024-01-14 18:05:00+03', NULL, '{"appointment_id": "990e8400-e29b-41d4-a716-446655440001", "doctor_name": "د. أحمد العتيبي"}', '550e8400-e29b-41d4-a716-446655440000'),

('hh0e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440008', 'appointment', 'تأكيد الموعد', 'تم تأكيد موعدك مع د. سارة الغامدي في 16 يناير 2024 الساعة 2:00 مساءً', 'email', 'sent', 'normal', '2024-01-15 18:00:00+03', '2024-01-15 18:05:00+03', '2024-01-15 20:30:00+03', '{"appointment_id": "990e8400-e29b-41d4-a716-446655440002", "doctor_name": "د. سارة الغامدي"}', '550e8400-e29b-41d4-a716-446655440000'),

('hh0e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440009', 'appointment', 'تأكيد الموعد', 'تم تأكيد موعدك مع د. خالد الدوسري في 17 يناير 2024 الساعة 11:00 صباحاً', 'sms', 'sent', 'normal', '2024-01-16 18:00:00+03', '2024-01-16 18:05:00+03', NULL, '{"appointment_id": "990e8400-e29b-41d4-a716-446655440003", "doctor_name": "د. خالد الدوسري"}', '550e8400-e29b-41d4-a716-446655440000'),

('hh0e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440007', 'payment', 'تأكيد الدفع', 'تم استلام دفعتك بقيمة 200.00 ريال سعودي بنجاح', 'email', 'sent', 'normal', '2024-01-15 10:30:00+03', '2024-01-15 10:35:00+03', '2024-01-15 12:00:00+03', '{"payment_id": "ee0e8400-e29b-41d4-a716-446655440001", "amount": 200.00, "currency": "SAR"}', '550e8400-e29b-41d4-a716-446655440000'),

('hh0e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440008', 'payment', 'تأكيد الدفع', 'تم استلام دفعتك بقيمة 350.00 ريال سعودي بنجاح', 'email', 'sent', 'normal', '2024-01-16 14:30:00+03', '2024-01-16 14:35:00+03', NULL, '{"payment_id": "ee0e8400-e29b-41d4-a716-446655440002", "amount": 350.00, "currency": "SAR"}', '550e8400-e29b-41d4-a716-446655440000'),

('hh0e8400-e29b-41d4-a716-446655440006', '550e8400-e29b-41d4-a716-446655440007', 'reminder', 'تذكير بالموعد', 'تذكير: موعدك مع د. أحمد العتيبي غداً في 15 يناير 2024 الساعة 10:00 صباحاً', 'sms', 'sent', 'normal', '2024-01-14 20:00:00+03', '2024-01-14 20:05:00+03', NULL, '{"appointment_id": "990e8400-e29b-41d4-a716-446655440001", "doctor_name": "د. أحمد العتيبي"}', '550e8400-e29b-41d4-a716-446655440000'),

('hh0e8400-e29b-41d4-a716-446655440007', '550e8400-e29b-41d4-a716-446655440008', 'reminder', 'تذكير بالموعد', 'تذكير: موعدك مع د. سارة الغامدي غداً في 16 يناير 2024 الساعة 2:00 مساءً', 'push', 'sent', 'normal', '2024-01-15 20:00:00+03', '2024-01-15 20:05:00+03', '2024-01-15 21:00:00+03', '{"appointment_id": "990e8400-e29b-41d4-a716-446655440002", "doctor_name": "د. سارة الغامدي"}', '550e8400-e29b-41d4-a716-446655440000'),

('hh0e8400-e29b-41d4-a716-446655440008', '550e8400-e29b-41d4-a716-446655440007', 'system', 'مرحباً بك', 'مرحباً محمد، أهلاً وسهلاً بك في نظام الرعاية الصحية', 'email', 'sent', 'normal', '2024-01-10 09:00:00+03', '2024-01-10 09:05:00+03', '2024-01-10 10:00:00+03', '{"user_name": "محمد عبدالله الأحمد"}', '550e8400-e29b-41d4-a716-446655440000'),

('hh0e8400-e29b-41d4-a716-446655440009', '550e8400-e29b-41d4-a716-446655440007', 'appointment', 'تذكير بالموعد القادم', 'تذكير: موعدك مع د. أحمد العتيبي في 18 يناير 2024 الساعة 9:00 صباحاً', 'email', 'pending', 'normal', '2024-01-17 20:00:00+03', NULL, NULL, '{"appointment_id": "990e8400-e29b-41d4-a716-446655440004", "doctor_name": "د. أحمد العتيبي"}', '550e8400-e29b-41d4-a716-446655440000'),

('hh0e8400-e29b-41d4-a716-446655440010', '550e8400-e29b-41d4-a716-446655440007', 'emergency', 'تنبيه طبي', 'يرجى مراجعة الطبيب فوراً في حالة ظهور أي من الأعراض التالية: صداع شديد، دوخة، ضيق في التنفس', 'sms', 'sent', 'urgent', '2024-01-15 11:00:00+03', '2024-01-15 11:05:00+03', NULL, '{"patient_name": "محمد عبدالله الأحمد", "symptoms": ["صداع شديد", "دوخة", "ضيق في التنفس"]}', '550e8400-e29b-41d4-a716-446655440000')
ON CONFLICT (id) DO NOTHING;

-- Insert additional notification templates
INSERT INTO notification_templates (name, type, channel, language, subject, content, variables) VALUES
('appointment_cancellation', 'appointment', 'email', 'ar', 'إلغاء الموعد', 'تم إلغاء موعدك مع {{doctor_name}} في {{appointment_date}}', '["doctor_name", "appointment_date", "cancellation_reason"]'),

('appointment_reschedule', 'appointment', 'sms', 'ar', 'إعادة جدولة الموعد', 'تم إعادة جدولة موعدك مع {{doctor_name}} إلى {{new_date}} في {{new_time}}', '["doctor_name", "new_date", "new_time", "old_date", "old_time"]'),

('payment_failed', 'payment', 'email', 'ar', 'فشل في الدفع', 'فشل في معالجة دفعتك بقيمة {{amount}} {{currency}}. يرجى المحاولة مرة أخرى', '["amount", "currency", "failure_reason"]'),

('insurance_claim_approved', 'system', 'email', 'ar', 'موافقة على مطالبة التأمين', 'تمت الموافقة على مطالبة التأمين رقم {{claim_number}} بقيمة {{approved_amount}} {{currency}}', '["claim_number", "approved_amount", "currency", "provider"]'),

('insurance_claim_rejected', 'system', 'email', 'ar', 'رفض مطالبة التأمين', 'تم رفض مطالبة التأمين رقم {{claim_number}}. السبب: {{rejection_reason}}', '["claim_number", "rejection_reason", "provider"]'),

('lab_results_ready', 'system', 'push', 'ar', 'نتائج الفحوصات جاهزة', 'نتائج فحوصاتك الطبية جاهزة. يرجى مراجعة حسابك أو زيارة العيادة', '["lab_type", "result_date"]'),

('prescription_ready', 'system', 'sms', 'ar', 'الوصفة الطبية جاهزة', 'وصفتك الطبية جاهزة للاستلام من الصيدلية', '["prescription_number", "pharmacy_name"]'),

('follow_up_reminder', 'appointment', 'email', 'ar', 'تذكير بالمتابعة', 'تذكير: موعد متابعتك مع {{doctor_name}} في {{follow_up_date}}', '["doctor_name", "follow_up_date", "appointment_type"]'),

('welcome_new_patient', 'system', 'email', 'ar', 'مرحباً بك في عائلتنا الطبية', 'مرحباً {{patient_name}}، أهلاً وسهلاً بك في عائلتنا الطبية. نحن هنا لرعايتك', '["patient_name", "clinic_name"]'),

('emergency_contact', 'emergency', 'sms', 'ar', 'اتصال طوارئ', 'هذا تنبيه طوارئ من {{clinic_name}}. يرجى الاتصال فوراً', '["clinic_name", "contact_number", "emergency_type"]')
ON CONFLICT (name) DO NOTHING;

-- Insert comprehensive translations
INSERT INTO translations (language_code, key, value, context, is_verified, verified_by, verified_at) VALUES
-- Common translations
('ar', 'common.welcome', 'مرحباً', 'general', true, '550e8400-e29b-41d4-a716-446655440000', NOW()),
('ar', 'common.hello', 'أهلاً وسهلاً', 'general', true, '550e8400-e29b-41d4-a716-446655440000', NOW()),
('ar', 'common.goodbye', 'وداعاً', 'general', true, '550e8400-e29b-41d4-a716-446655440000', NOW()),
('ar', 'common.yes', 'نعم', 'general', true, '550e8400-e29b-41d4-a716-446655440000', NOW()),
('ar', 'common.no', 'لا', 'general', true, '550e8400-e29b-41d4-a716-446655440000', NOW()),
('ar', 'common.save', 'حفظ', 'general', true, '550e8400-e29b-41d4-a716-446655440000', NOW()),
('ar', 'common.cancel', 'إلغاء', 'general', true, '550e8400-e29b-41d4-a716-446655440000', NOW()),
('ar', 'common.edit', 'تعديل', 'general', true, '550e8400-e29b-41d4-a716-446655440000', NOW()),
('ar', 'common.delete', 'حذف', 'general', true, '550e8400-e29b-41d4-a716-446655440000', NOW()),
('ar', 'common.search', 'بحث', 'general', true, '550e8400-e29b-41d4-a716-446655440000', NOW()),
('ar', 'common.loading', 'جاري التحميل...', 'general', true, '550e8400-e29b-41d4-a716-446655440000', NOW()),
('ar', 'common.error', 'حدث خطأ', 'general', true, '550e8400-e29b-41d4-a716-446655440000', NOW()),
('ar', 'common.success', 'تم بنجاح', 'general', true, '550e8400-e29b-41d4-a716-446655440000', NOW()),
('ar', 'common.confirm', 'تأكيد', 'general', true, '550e8400-e29b-41d4-a716-446655440000', NOW()),
('ar', 'common.close', 'إغلاق', 'general', true, '550e8400-e29b-41d4-a716-446655440000', NOW()),

-- Dashboard translations
('ar', 'dashboard.title', 'لوحة التحكم', 'dashboard', true, '550e8400-e29b-41d4-a716-446655440000', NOW()),
('ar', 'dashboard.overview', 'نظرة عامة', 'dashboard', true, '550e8400-e29b-41d4-a716-446655440000', NOW()),
('ar', 'dashboard.metrics', 'المقاييس', 'dashboard', true, '550e8400-e29b-41d4-a716-446655440000', NOW()),
('ar', 'dashboard.statistics', 'الإحصائيات', 'dashboard', true, '550e8400-e29b-41d4-a716-446655440000', NOW()),
('ar', 'dashboard.reports', 'التقارير', 'dashboard', true, '550e8400-e29b-41d4-a716-446655440000', NOW()),

-- Theme translations
('ar', 'theme.light', 'الوضع المضيء', 'theme', true, '550e8400-e29b-41d4-a716-446655440000', NOW()),
('ar', 'theme.dark', 'الوضع المظلم', 'theme', true, '550e8400-e29b-41d4-a716-446655440000', NOW()),
('ar', 'theme.system', 'النظام', 'theme', true, '550e8400-e29b-41d4-a716-446655440000', NOW()),

-- Language translations
('ar', 'language.arabic', 'العربية', 'language', true, '550e8400-e29b-41d4-a716-446655440000', NOW()),
('ar', 'language.english', 'الإنجليزية', 'language', true, '550e8400-e29b-41d4-a716-446655440000', NOW()),

-- Role translations
('ar', 'patient.title', 'المريض', 'role', true, '550e8400-e29b-41d4-a716-446655440000', NOW()),
('ar', 'doctor.title', 'الطبيب', 'role', true, '550e8400-e29b-41d4-a716-446655440000', NOW()),
('ar', 'staff.title', 'الموظف', 'role', true, '550e8400-e29b-41d4-a716-446655440000', NOW()),
('ar', 'admin.title', 'المدير', 'role', true, '550e8400-e29b-41d4-a716-446655440000', NOW()),
('ar', 'supervisor.title', 'المشرف', 'role', true, '550e8400-e29b-41d4-a716-446655440000', NOW()),

-- Appointment translations
('ar', 'appointment.title', 'الموعد', 'appointment', true, '550e8400-e29b-41d4-a716-446655440000', NOW()),
('ar', 'appointment.book', 'حجز موعد', 'appointment', true, '550e8400-e29b-41d4-a716-446655440000', NOW()),
('ar', 'appointment.cancel', 'إلغاء موعد', 'appointment', true, '550e8400-e29b-41d4-a716-446655440000', NOW()),
('ar', 'appointment.reschedule', 'إعادة جدولة', 'appointment', true, '550e8400-e29b-41d4-a716-446655440000', NOW()),
('ar', 'appointment.confirm', 'تأكيد الموعد', 'appointment', true, '550e8400-e29b-41d4-a716-446655440000', NOW()),
('ar', 'appointment.pending', 'في الانتظار', 'appointment', true, '550e8400-e29b-41d4-a716-446655440000', NOW()),
('ar', 'appointment.confirmed', 'مؤكد', 'appointment', true, '550e8400-e29b-41d4-a716-446655440000', NOW()),
('ar', 'appointment.completed', 'مكتمل', 'appointment', true, '550e8400-e29b-41d4-a716-446655440000', NOW()),
('ar', 'appointment.cancelled', 'ملغي', 'appointment', true, '550e8400-e29b-41d4-a716-446655440000', NOW()),

-- Payment translations
('ar', 'payment.title', 'الدفع', 'payment', true, '550e8400-e29b-41d4-a716-446655440000', NOW()),
('ar', 'payment.amount', 'المبلغ', 'payment', true, '550e8400-e29b-41d4-a716-446655440000', NOW()),
('ar', 'payment.method', 'طريقة الدفع', 'payment', true, '550e8400-e29b-41d4-a716-446655440000', NOW()),
('ar', 'payment.cash', 'نقداً', 'payment', true, '550e8400-e29b-41d4-a716-446655440000', NOW()),
('ar', 'payment.card', 'بطاقة ائتمان', 'payment', true, '550e8400-e29b-41d4-a716-446655440000', NOW()),
('ar', 'payment.insurance', 'تأمين', 'payment', true, '550e8400-e29b-41d4-a716-446655440000', NOW()),
('ar', 'payment.bank_transfer', 'تحويل بنكي', 'payment', true, '550e8400-e29b-41d4-a716-446655440000', NOW()),
('ar', 'payment.paid', 'مدفوع', 'payment', true, '550e8400-e29b-41d4-a716-446655440000', NOW()),
('ar', 'payment.unpaid', 'غير مدفوع', 'payment', true, '550e8400-e29b-41d4-a716-446655440000', NOW()),

-- Insurance translations
('ar', 'insurance.title', 'التأمين', 'insurance', true, '550e8400-e29b-41d4-a716-446655440000', NOW()),
('ar', 'insurance.provider', 'مقدم التأمين', 'insurance', true, '550e8400-e29b-41d4-a716-446655440000', NOW()),
('ar', 'insurance.number', 'رقم التأمين', 'insurance', true, '550e8400-e29b-41d4-a716-446655440000', NOW()),
('ar', 'insurance.claim', 'مطالبة التأمين', 'insurance', true, '550e8400-e29b-41d4-a716-446655440000', NOW()),
('ar', 'insurance.approved', 'موافق عليه', 'insurance', true, '550e8400-e29b-41d4-a716-446655440000', NOW()),
('ar', 'insurance.rejected', 'مرفوض', 'insurance', true, '550e8400-e29b-41d4-a716-446655440000', NOW()),
('ar', 'insurance.pending', 'في الانتظار', 'insurance', true, '550e8400-e29b-41d4-a716-446655440000', NOW()),

-- Medical record translations
('ar', 'medical_record.title', 'السجل الطبي', 'medical_record', true, '550e8400-e29b-41d4-a716-446655440000', NOW()),
('ar', 'medical_record.consultation', 'استشارة طبية', 'medical_record', true, '550e8400-e29b-41d4-a716-446655440000', NOW()),
('ar', 'medical_record.prescription', 'وصفة طبية', 'medical_record', true, '550e8400-e29b-41d4-a716-446655440000', NOW()),
('ar', 'medical_record.lab_result', 'نتائج المختبر', 'medical_record', true, '550e8400-e29b-41d4-a716-446655440000', NOW()),
('ar', 'medical_record.imaging', 'التصوير الطبي', 'medical_record', true, '550e8400-e29b-41d4-a716-446655440000', NOW()),
('ar', 'medical_record.vaccination', 'التطعيم', 'medical_record', true, '550e8400-e29b-41d4-a716-446655440000', NOW()),

-- Notification translations
('ar', 'notification.title', 'الإشعار', 'notification', true, '550e8400-e29b-41d4-a716-446655440000', NOW()),
('ar', 'notification.appointment', 'موعد', 'notification', true, '550e8400-e29b-41d4-a716-446655440000', NOW()),
('ar', 'notification.payment', 'دفع', 'notification', true, '550e8400-e29b-41d4-a716-446655440000', NOW()),
('ar', 'notification.reminder', 'تذكير', 'notification', true, '550e8400-e29b-41d4-a716-446655440000', NOW()),
('ar', 'notification.system', 'نظام', 'notification', true, '550e8400-e29b-41d4-a716-446655440000', NOW()),
('ar', 'notification.emergency', 'طوارئ', 'notification', true, '550e8400-e29b-41d4-a716-446655440000', NOW()),

-- English translations
('en', 'common.welcome', 'Welcome', 'general', true, '550e8400-e29b-41d4-a716-446655440000', NOW()),
('en', 'common.hello', 'Hello', 'general', true, '550e8400-e29b-41d4-a716-446655440000', NOW()),
('en', 'common.goodbye', 'Goodbye', 'general', true, '550e8400-e29b-41d4-a716-446655440000', NOW()),
('en', 'common.yes', 'Yes', 'general', true, '550e8400-e29b-41d4-a716-446655440000', NOW()),
('en', 'common.no', 'No', 'general', true, '550e8400-e29b-41d4-a716-446655440000', NOW()),
('en', 'common.save', 'Save', 'general', true, '550e8400-e29b-41d4-a716-446655440000', NOW()),
('en', 'common.cancel', 'Cancel', 'general', true, '550e8400-e29b-41d4-a716-446655440000', NOW()),
('en', 'common.edit', 'Edit', 'general', true, '550e8400-e29b-41d4-a716-446655440000', NOW()),
('en', 'common.delete', 'Delete', 'general', true, '550e8400-e29b-41d4-a716-446655440000', NOW()),
('en', 'common.search', 'Search', 'general', true, '550e8400-e29b-41d4-a716-446655440000', NOW()),
('en', 'common.loading', 'Loading...', 'general', true, '550e8400-e29b-41d4-a716-446655440000', NOW()),
('en', 'common.error', 'An error occurred', 'general', true, '550e8400-e29b-41d4-a716-446655440000', NOW()),
('en', 'common.success', 'Success', 'general', true, '550e8400-e29b-41d4-a716-446655440000', NOW()),
('en', 'common.confirm', 'Confirm', 'general', true, '550e8400-e29b-41d4-a716-446655440000', NOW()),
('en', 'common.close', 'Close', 'general', true, '550e8400-e29b-41d4-a716-446655440000', NOW()),

('en', 'dashboard.title', 'Dashboard', 'dashboard', true, '550e8400-e29b-41d4-a716-446655440000', NOW()),
('en', 'dashboard.overview', 'Overview', 'dashboard', true, '550e8400-e29b-41d4-a716-446655440000', NOW()),
('en', 'dashboard.metrics', 'Metrics', 'dashboard', true, '550e8400-e29b-41d4-a716-446655440000', NOW()),
('en', 'dashboard.statistics', 'Statistics', 'dashboard', true, '550e8400-e29b-41d4-a716-446655440000', NOW()),
('en', 'dashboard.reports', 'Reports', 'dashboard', true, '550e8400-e29b-41d4-a716-446655440000', NOW()),

('en', 'theme.light', 'Light Mode', 'theme', true, '550e8400-e29b-41d4-a716-446655440000', NOW()),
('en', 'theme.dark', 'Dark Mode', 'theme', true, '550e8400-e29b-41d4-a716-446655440000', NOW()),
('en', 'theme.system', 'System', 'theme', true, '550e8400-e29b-41d4-a716-446655440000', NOW()),

('en', 'language.arabic', 'Arabic', 'language', true, '550e8400-e29b-41d4-a716-446655440000', NOW()),
('en', 'language.english', 'English', 'language', true, '550e8400-e29b-41d4-a716-446655440000', NOW()),

('en', 'patient.title', 'Patient', 'role', true, '550e8400-e29b-41d4-a716-446655440000', NOW()),
('en', 'doctor.title', 'Doctor', 'role', true, '550e8400-e29b-41d4-a716-446655440000', NOW()),
('en', 'staff.title', 'Staff', 'role', true, '550e8400-e29b-41d4-a716-446655440000', NOW()),
('en', 'admin.title', 'Admin', 'role', true, '550e8400-e29b-41d4-a716-446655440000', NOW()),
('en', 'supervisor.title', 'Supervisor', 'role', true, '550e8400-e29b-41d4-a716-446655440000', NOW()),

('en', 'appointment.title', 'Appointment', 'appointment', true, '550e8400-e29b-41d4-a716-446655440000', NOW()),
('en', 'appointment.book', 'Book Appointment', 'appointment', true, '550e8400-e29b-41d4-a716-446655440000', NOW()),
('en', 'appointment.cancel', 'Cancel Appointment', 'appointment', true, '550e8400-e29b-41d4-a716-446655440000', NOW()),
('en', 'appointment.reschedule', 'Reschedule', 'appointment', true, '550e8400-e29b-41d4-a716-446655440000', NOW()),
('en', 'appointment.confirm', 'Confirm Appointment', 'appointment', true, '550e8400-e29b-41d4-a716-446655440000', NOW()),
('en', 'appointment.pending', 'Pending', 'appointment', true, '550e8400-e29b-41d4-a716-446655440000', NOW()),
('en', 'appointment.confirmed', 'Confirmed', 'appointment', true, '550e8400-e29b-41d4-a716-446655440000', NOW()),
('en', 'appointment.completed', 'Completed', 'appointment', true, '550e8400-e29b-41d4-a716-446655440000', NOW()),
('en', 'appointment.cancelled', 'Cancelled', 'appointment', true, '550e8400-e29b-41d4-a716-446655440000', NOW()),

('en', 'payment.title', 'Payment', 'payment', true, '550e8400-e29b-41d4-a716-446655440000', NOW()),
('en', 'payment.amount', 'Amount', 'payment', true, '550e8400-e29b-41d4-a716-446655440000', NOW()),
('en', 'payment.method', 'Payment Method', 'payment', true, '550e8400-e29b-41d4-a716-446655440000', NOW()),
('en', 'payment.cash', 'Cash', 'payment', true, '550e8400-e29b-41d4-a716-446655440000', NOW()),
('en', 'payment.card', 'Credit Card', 'payment', true, '550e8400-e29b-41d4-a716-446655440000', NOW()),
('en', 'payment.insurance', 'Insurance', 'payment', true, '550e8400-e29b-41d4-a716-446655440000', NOW()),
('en', 'payment.bank_transfer', 'Bank Transfer', 'payment', true, '550e8400-e29b-41d4-a716-446655440000', NOW()),
('en', 'payment.paid', 'Paid', 'payment', true, '550e8400-e29b-41d4-a716-446655440000', NOW()),
('en', 'payment.unpaid', 'Unpaid', 'payment', true, '550e8400-e29b-41d4-a716-446655440000', NOW()),

('en', 'insurance.title', 'Insurance', 'insurance', true, '550e8400-e29b-41d4-a716-446655440000', NOW()),
('en', 'insurance.provider', 'Insurance Provider', 'insurance', true, '550e8400-e29b-41d4-a716-446655440000', NOW()),
('en', 'insurance.number', 'Insurance Number', 'insurance', true, '550e8400-e29b-41d4-a716-446655440000', NOW()),
('en', 'insurance.claim', 'Insurance Claim', 'insurance', true, '550e8400-e29b-41d4-a716-446655440000', NOW()),
('en', 'insurance.approved', 'Approved', 'insurance', true, '550e8400-e29b-41d4-a716-446655440000', NOW()),
('en', 'insurance.rejected', 'Rejected', 'insurance', true, '550e8400-e29b-41d4-a716-446655440000', NOW()),
('en', 'insurance.pending', 'Pending', 'insurance', true, '550e8400-e29b-41d4-a716-446655440000', NOW()),

('en', 'medical_record.title', 'Medical Record', 'medical_record', true, '550e8400-e29b-41d4-a716-446655440000', NOW()),
('en', 'medical_record.consultation', 'Consultation', 'medical_record', true, '550e8400-e29b-41d4-a716-446655440000', NOW()),
('en', 'medical_record.prescription', 'Prescription', 'medical_record', true, '550e8400-e29b-41d4-a716-446655440000', NOW()),
('en', 'medical_record.lab_result', 'Lab Result', 'medical_record', true, '550e8400-e29b-41d4-a716-446655440000', NOW()),
('en', 'medical_record.imaging', 'Medical Imaging', 'medical_record', true, '550e8400-e29b-41d4-a716-446655440000', NOW()),
('en', 'medical_record.vaccination', 'Vaccination', 'medical_record', true, '550e8400-e29b-41d4-a716-446655440000', NOW()),

('en', 'notification.title', 'Notification', 'notification', true, '550e8400-e29b-41d4-a716-446655440000', NOW()),
('en', 'notification.appointment', 'Appointment', 'notification', true, '550e8400-e29b-41d4-a716-446655440000', NOW()),
('en', 'notification.payment', 'Payment', 'notification', true, '550e8400-e29b-41d4-a716-446655440000', NOW()),
('en', 'notification.reminder', 'Reminder', 'notification', true, '550e8400-e29b-41d4-a716-446655440000', NOW()),
('en', 'notification.system', 'System', 'notification', true, '550e8400-e29b-41d4-a716-446655440000', NOW()),
('en', 'notification.emergency', 'Emergency', 'notification', true, '550e8400-e29b-41d4-a716-446655440000', NOW())
ON CONFLICT (language_code, key) DO NOTHING;

SELECT 'Notifications and translations seed data inserted successfully!' as status;