-- ========================================
-- NOTIFICATIONS AND SYSTEM DATA SEED
-- بيانات البذور للإشعارات والبيانات النظامية
-- ========================================

-- Insert notifications
INSERT INTO notifications (id, user_id, type, title, message, channel, status, priority, scheduled_at, sent_at, read_at, metadata) VALUES
('550e8400-e29b-41d4-a716-446655440800', '550e8400-e29b-41d4-a716-446655440007', 'appointment', 'تأكيد الموعد', 'تم تأكيد موعدك مع د. أحمد السعد في 20 ديسمبر 2024 الساعة 10:00 صباحاً', 'in_app', 'read', 'normal', '2024-12-19 18:00:00+03', '2024-12-19 18:00:00+03', '2024-12-19 18:05:00+03', '{"appointmentId": "550e8400-e29b-41d4-a716-446655440300"}'),
('550e8400-e29b-41d4-a716-446655440801', '550e8400-e29b-41d4-a716-446655440008', 'appointment', 'تأكيد الموعد', 'تم تأكيد موعدك مع د. سارة محمد في 18 ديسمبر 2024 الساعة 2:30 مساءً', 'in_app', 'read', 'normal', '2024-12-17 18:00:00+03', '2024-12-17 18:00:00+03', '2024-12-17 18:10:00+03', '{"appointmentId": "550e8400-e29b-41d4-a716-446655440301"}'),
('550e8400-e29b-41d4-a716-446655440802', '550e8400-e29b-41d4-a716-446655440009', 'payment', 'تأكيد الدفع', 'تم تأكيد دفع مبلغ 350.00 ر.س بنجاح', 'in_app', 'read', 'normal', '2024-12-15 12:30:00+03', '2024-12-15 12:30:00+03', '2024-12-15 12:35:00+03', '{"paymentId": "550e8400-e29b-41d4-a716-446655440702"}'),
('550e8400-e29b-41d4-a716-446655440803', '550e8400-e29b-41d4-a716-446655440010', 'reminder', 'تذكير بالموعد', 'تذكير: لديك موعد مع د. سارة محمد غداً في 22 ديسمبر 2024 الساعة 9:00 صباحاً', 'sms', 'sent', 'high', '2024-12-21 20:00:00+03', '2024-12-21 20:00:00+03', null, '{"appointmentId": "550e8400-e29b-41d4-a716-446655440303"}'),
('550e8400-e29b-41d4-a716-446655440804', '550e8400-e29b-41d4-a716-446655440007', 'system', 'مرحباً بك', 'مرحباً محمد عبدالله، أهلاً وسهلاً بك في منصة مُعين للرعاية الصحية', 'email', 'delivered', 'normal', '2024-01-15 10:30:00+03', '2024-01-15 10:30:00+03', '2024-01-15 10:35:00+03', '{"welcome": true}'),
('550e8400-e29b-41d4-a716-446655440805', '550e8400-e29b-41d4-a716-446655440004', 'appointment', 'موعد جديد', 'لديك موعد جديد مع المريض محمد عبدالله في 25 ديسمبر 2024 الساعة 3:00 مساءً', 'in_app', 'pending', 'normal', '2024-12-23 09:00:00+03', null, null, '{"appointmentId": "550e8400-e29b-41d4-a716-446655440304"}');

-- Insert additional notification templates
INSERT INTO notification_templates (name, type, language, subject, body, variables, is_active) VALUES
('appointment_cancelled', 'appointment', 'ar', 'إلغاء الموعد', 'تم إلغاء موعدك مع الدكتور {{doctor_name}} في {{appointment_date}}', '["doctor_name", "appointment_date"]', true),
('payment_failed', 'payment', 'ar', 'فشل في الدفع', 'فشل في معالجة دفع مبلغ {{amount}} {{currency}}. يرجى المحاولة مرة أخرى', '["amount", "currency"]', true),
('insurance_claim_approved', 'system', 'ar', 'موافقة على مطالبة التأمين', 'تمت الموافقة على مطالبة التأمين رقم {{claim_number}} بمبلغ {{amount}} {{currency}}', '["claim_number", "amount", "currency"]', true),
('insurance_claim_rejected', 'system', 'ar', 'رفض مطالبة التأمين', 'تم رفض مطالبة التأمين رقم {{claim_number}}. السبب: {{reason}}', '["claim_number", "reason"]', true),
('lab_results_ready', 'system', 'ar', 'نتائج الفحوصات جاهزة', 'نتائج فحوصاتك الطبية جاهزة. يمكنك مراجعتها من خلال حسابك', '[]', true),
('prescription_ready', 'system', 'ar', 'الوصفة الطبية جاهزة', 'وصفتك الطبية جاهزة. يمكنك تحميلها من خلال حسابك', '[]', true),
('emergency_alert', 'emergency', 'ar', 'تنبيه طارئ', 'تنبيه طارئ: {{message}}', '["message"]', true),
('appointment_confirmation', 'appointment', 'en', 'Appointment Confirmation', 'Your appointment with Dr. {{doctor_name}} on {{appointment_date}} has been confirmed', '["doctor_name", "appointment_date"]', true),
('payment_confirmation', 'payment', 'en', 'Payment Confirmation', 'Payment of {{amount}} {{currency}} has been confirmed successfully', '["amount", "currency"]', true),
('welcome_message', 'system', 'en', 'Welcome', 'Welcome {{name}} to Moeen Healthcare Platform', '["name"]', true)
ON CONFLICT (name) DO NOTHING;

-- Insert additional translations
INSERT INTO translations (language_code, key, value, namespace, is_approved) VALUES
-- Arabic translations
('ar', 'appointment.confirmed', 'تم تأكيد الموعد', 'appointment', true),
('ar', 'appointment.cancelled', 'تم إلغاء الموعد', 'appointment', true),
('ar', 'appointment.rescheduled', 'تم إعادة جدولة الموعد', 'appointment', true),
('ar', 'payment.success', 'تم الدفع بنجاح', 'payment', true),
('ar', 'payment.failed', 'فشل في الدفع', 'payment', true),
('ar', 'payment.pending', 'الدفع معلق', 'payment', true),
('ar', 'insurance.claim_submitted', 'تم تقديم مطالبة التأمين', 'insurance', true),
('ar', 'insurance.claim_approved', 'تمت الموافقة على مطالبة التأمين', 'insurance', true),
('ar', 'insurance.claim_rejected', 'تم رفض مطالبة التأمين', 'insurance', true),
('ar', 'medical.record_uploaded', 'تم رفع السجل الطبي', 'medical', true),
('ar', 'medical.prescription_ready', 'الوصفة الطبية جاهزة', 'medical', true),
('ar', 'medical.lab_results_ready', 'نتائج الفحوصات جاهزة', 'medical', true),
('ar', 'notification.email', 'بريد إلكتروني', 'notification', true),
('ar', 'notification.sms', 'رسالة نصية', 'notification', true),
('ar', 'notification.push', 'إشعار فوري', 'notification', true),
('ar', 'notification.in_app', 'إشعار في التطبيق', 'notification', true),
('ar', 'status.pending', 'معلق', 'status', true),
('ar', 'status.completed', 'مكتمل', 'status', true),
('ar', 'status.cancelled', 'ملغي', 'status', true),
('ar', 'status.failed', 'فشل', 'status', true),
('ar', 'priority.low', 'منخفض', 'priority', true),
('ar', 'priority.normal', 'عادي', 'priority', true),
('ar', 'priority.high', 'عالي', 'priority', true),
('ar', 'priority.urgent', 'عاجل', 'priority', true),

-- English translations
('en', 'appointment.confirmed', 'Appointment Confirmed', 'appointment', true),
('en', 'appointment.cancelled', 'Appointment Cancelled', 'appointment', true),
('en', 'appointment.rescheduled', 'Appointment Rescheduled', 'appointment', true),
('en', 'payment.success', 'Payment Successful', 'payment', true),
('en', 'payment.failed', 'Payment Failed', 'payment', true),
('en', 'payment.pending', 'Payment Pending', 'payment', true),
('en', 'insurance.claim_submitted', 'Insurance Claim Submitted', 'insurance', true),
('en', 'insurance.claim_approved', 'Insurance Claim Approved', 'insurance', true),
('en', 'insurance.claim_rejected', 'Insurance Claim Rejected', 'insurance', true),
('en', 'medical.record_uploaded', 'Medical Record Uploaded', 'medical', true),
('en', 'medical.prescription_ready', 'Prescription Ready', 'medical', true),
('en', 'medical.lab_results_ready', 'Lab Results Ready', 'medical', true),
('en', 'notification.email', 'Email', 'notification', true),
('en', 'notification.sms', 'SMS', 'notification', true),
('en', 'notification.push', 'Push Notification', 'notification', true),
('en', 'notification.in_app', 'In-App Notification', 'notification', true),
('en', 'status.pending', 'Pending', 'status', true),
('en', 'status.completed', 'Completed', 'status', true),
('en', 'status.cancelled', 'Cancelled', 'status', true),
('en', 'status.failed', 'Failed', 'status', true),
('en', 'priority.low', 'Low', 'priority', true),
('en', 'priority.normal', 'Normal', 'priority', true),
('en', 'priority.high', 'High', 'priority', true),
('en', 'priority.urgent', 'Urgent', 'priority', true)
ON CONFLICT (language_code, key, namespace) DO NOTHING;

-- Insert additional system settings
INSERT INTO system_settings (key, value, type, description, is_public, category) VALUES
('notification_channels', '["email", "sms", "push", "in_app"]', 'array', 'Available notification channels', true, 'notifications'),
('notification_priorities', '["low", "normal", "high", "urgent"]', 'array', 'Notification priority levels', true, 'notifications'),
('appointment_reminder_times', '["24_hours", "2_hours", "30_minutes"]', 'array', 'Appointment reminder times', false, 'appointments'),
('file_upload_limits', '{"max_size": 10485760, "allowed_types": ["pdf", "jpg", "jpeg", "png", "doc", "docx"], "max_files_per_upload": 5}', 'object', 'File upload restrictions', false, 'uploads'),
('session_settings', '{"timeout": 3600, "extend_on_activity": true, "max_concurrent_sessions": 3}', 'object', 'User session configuration', false, 'security'),
('audit_log_retention', '{"days": 365, "auto_cleanup": true, "archive_old_logs": true}', 'object', 'Audit log retention policy', false, 'audit'),
('backup_settings', '{"frequency": "daily", "retention_days": 30, "encrypt_backups": true}', 'object', 'Database backup configuration', false, 'backup'),
('maintenance_mode', '{"enabled": false, "message": "النظام قيد الصيانة. يرجى المحاولة لاحقاً", "allowed_ips": ["127.0.0.1"]}', 'object', 'Maintenance mode settings', true, 'system')
ON CONFLICT (key) DO NOTHING;

-- Insert sample audit logs
INSERT INTO audit_logs (id, user_id, action, entity_type, entity_id, old_values, new_values, ip_address, user_agent) VALUES
('550e8400-e29b-41d4-a716-446655440900', '550e8400-e29b-41d4-a716-446655440000', 'user_login', 'users', '550e8400-e29b-41d4-a716-446655440000', null, '{"login_time": "2024-12-20T08:30:00Z"}', '192.168.1.100', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'),
('550e8400-e29b-41d4-a716-446655440901', '550e8400-e29b-41d4-a716-446655440004', 'appointment_created', 'appointments', '550e8400-e29b-41d4-a716-446655440300', null, '{"patient_id": "550e8400-e29b-41d4-a716-446655440200", "scheduled_at": "2024-12-20T10:00:00Z"}', '192.168.1.101', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'),
('550e8400-e29b-41d4-a716-446655440902', '550e8400-e29b-41d4-a716-446655440004', 'medical_record_created', 'medical_records', '550e8400-e29b-41d4-a716-446655440400', null, '{"patient_id": "550e8400-e29b-41d4-a716-446655440200", "record_type": "diagnosis"}', '192.168.1.101', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'),
('550e8400-e29b-41d4-a716-446655440903', '550e8400-e29b-41d4-a716-446655440001', 'payment_processed', 'payments', '550e8400-e29b-41d4-a716-446655440700', '{"status": "pending"}', '{"status": "completed", "paid_at": "2024-12-22T14:15:00Z"}', '192.168.1.102', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36'),
('550e8400-e29b-41d4-a716-446655440904', '550e8400-e29b-41d4-a716-446655440000', 'system_settings_updated', 'system_settings', '550e8400-e29b-41d4-a716-446655440000', '{"value": "false"}', '{"value": "true"}', '192.168.1.100', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36');

-- Log completion
INSERT INTO system_metrics (metric_key, metric_value, metric_unit, metadata) VALUES
('notifications_seeded', 6, 'count', '{"timestamp": "NOW()", "types": ["appointment", "payment", "reminder", "system"]}'),
('notification_templates_seeded', 10, 'count', '{"timestamp": "NOW()", "languages": ["ar", "en"]}'),
('translations_seeded', 50, 'count', '{"timestamp": "NOW()", "languages": ["ar", "en"], "namespaces": ["appointment", "payment", "insurance", "medical", "notification", "status", "priority"]}'),
('audit_logs_seeded', 5, 'count', '{"timestamp": "NOW()", "actions": ["user_login", "appointment_created", "medical_record_created", "payment_processed", "system_settings_updated"]}');