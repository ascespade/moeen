-- ================================================================
-- MIGRATION 053: ADD MISSING INDEXES FOR PERFORMANCE
-- ================================================================
-- Date: 2025-11-01
-- Purpose: Add critical missing indexes identified by DBA Integrity Agent
-- Estimated Impact: 60-80% performance improvement on affected queries
-- ================================================================

-- Add index on appointments.status (frequently filtered)
-- Used in: appointment list queries, status-based filtering
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_appointments_status 
ON appointments(status);

-- Add composite index on appointments(doctor_id, scheduled_at)
-- Used in: doctor availability queries, appointment scheduling conflict checks
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_appointments_doctor_schedule 
ON appointments(doctor_id, scheduled_at);

-- Add index on audit_logs.created_at with DESC order
-- Used in: time-based audit log retrieval, recent activity queries
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_audit_logs_created_at 
ON audit_logs(created_at DESC);

-- Add index on audit_logs.action
-- Used in: filtering audit logs by action type
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_audit_logs_action 
ON audit_logs(action);

-- Add partial index on notifications(user_id, is_read) for unread notifications
-- Used in: fetching unread notifications per user (very common query)
-- Partial index only includes unread notifications for better performance
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_notifications_user_unread 
ON notifications(user_id, is_read) 
WHERE is_read = false;

-- Add index on patients.phone
-- Used in: patient lookup by phone number
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_patients_phone 
ON patients(phone);

-- Add index on insurance_claims.status
-- Used in: filtering insurance claims by status
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_insurance_claims_status 
ON insurance_claims(status);

-- Add composite index on medical_records(patient_id, created_at)
-- Used in: fetching patient medical history sorted by date
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_medical_records_patient_date 
ON medical_records(patient_id, created_at DESC);

-- Add index on appointments(patient_id, scheduled_at)
-- Used in: patient appointment history queries
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_appointments_patient_schedule 
ON appointments(patient_id, scheduled_at);

-- Add index on sessions(appointment_id)
-- Used in: finding sessions related to appointments
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_sessions_appointment 
ON sessions(appointment_id);

-- Add index on messages(conversation_id, sent_at)
-- Used in: retrieving conversation messages in chronological order
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_messages_conversation_time 
ON messages(conversation_id, sent_at DESC);

COMMENT ON INDEX idx_appointments_status IS 'Improves performance for appointment status filtering';
COMMENT ON INDEX idx_appointments_doctor_schedule IS 'Composite index for doctor availability and conflict checking';
COMMENT ON INDEX idx_audit_logs_created_at IS 'Improves performance for time-based audit log queries';
COMMENT ON INDEX idx_notifications_user_unread IS 'Partial index for unread notifications per user';

-- Analyze tables after index creation
ANALYZE appointments;
ANALYZE audit_logs;
ANALYZE notifications;
ANALYZE patients;
ANALYZE insurance_claims;
ANALYZE medical_records;
ANALYZE sessions;
ANALYZE messages;
