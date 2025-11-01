-- Migration: Add missing indexes for performance
-- Priority: HIGH
-- Date: 2025-11-01
-- Description: Adds indexes on foreign keys and commonly queried columns

-- ========================================
-- FOREIGN KEY INDEXES
-- ========================================
-- These indexes dramatically improve JOIN performance

-- Appointments table
CREATE INDEX IF NOT EXISTS idx_appointments_patient_id ON appointments(patient_id);
CREATE INDEX IF NOT EXISTS idx_appointments_doctor_id ON appointments(doctor_id);

-- Sessions table
CREATE INDEX IF NOT EXISTS idx_sessions_patient_id ON sessions(patient_id);
CREATE INDEX IF NOT EXISTS idx_sessions_doctor_id ON sessions(doctor_id);

-- Insurance claims table
CREATE INDEX IF NOT EXISTS idx_insurance_claims_patient_id ON insurance_claims(patient_id);
CREATE INDEX IF NOT EXISTS idx_insurance_claims_appointment_id ON insurance_claims(appointment_id);

-- Payments table
CREATE INDEX IF NOT EXISTS idx_payments_appointment_id ON payments(appointment_id) WHERE appointment_id IS NOT NULL;

-- ========================================
-- COMPOSITE INDEXES FOR COMMON QUERIES
-- ========================================
-- These indexes optimize frequently used query patterns

-- Get appointments by doctor and date
CREATE INDEX IF NOT EXISTS idx_appointments_date_doctor ON appointments(appointment_date, doctor_id);

-- Get appointments by patient and date
CREATE INDEX IF NOT EXISTS idx_appointments_date_patient ON appointments(appointment_date, patient_id);

-- Get appointments by status and date (for dashboards)
CREATE INDEX IF NOT EXISTS idx_appointments_status_date ON appointments(status, appointment_date);

-- Get sessions by date and doctor (for doctor schedule)
CREATE INDEX IF NOT EXISTS idx_sessions_date_doctor ON sessions(session_date, doctor_id);

-- ========================================
-- LOOKUP INDEXES
-- ========================================
-- These indexes speed up common lookup operations

-- Patient lookups
CREATE INDEX IF NOT EXISTS idx_patients_email ON patients(email);
CREATE INDEX IF NOT EXISTS idx_patients_phone ON patients(phone);

-- User lookups
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- Doctor lookups
CREATE INDEX IF NOT EXISTS idx_doctors_specialization ON doctors(specialization) WHERE specialization IS NOT NULL;

-- ========================================
-- PARTIAL INDEXES
-- ========================================
-- These indexes only index relevant subset of data

-- Only index active appointments
CREATE INDEX IF NOT EXISTS idx_appointments_active ON appointments(appointment_date, doctor_id) 
    WHERE status IN ('scheduled', 'confirmed');

-- Only index pending payments
CREATE INDEX IF NOT EXISTS idx_payments_pending ON payments(created_at) 
    WHERE status = 'pending';

-- Only index active insurance claims
CREATE INDEX IF NOT EXISTS idx_insurance_claims_active ON insurance_claims(created_at, status) 
    WHERE status IN ('pending', 'processing');

-- Add comments for documentation
COMMENT ON INDEX idx_appointments_date_doctor IS 'Optimizes queries for doctor schedules';
COMMENT ON INDEX idx_appointments_status_date IS 'Optimizes dashboard queries for appointment status';
COMMENT ON INDEX idx_appointments_active IS 'Partial index for active appointments only';
