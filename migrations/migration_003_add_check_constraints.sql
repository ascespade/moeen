-- Migration: Add data validation constraints
-- Priority: MEDIUM
-- Date: 2025-11-01
-- Description: Adds check constraints to ensure data integrity at database level

-- ========================================
-- APPOINTMENT VALIDATIONS
-- ========================================

-- Ensure appointments are not scheduled in the past
ALTER TABLE appointments ADD CONSTRAINT appointments_future_date 
    CHECK (appointment_date >= CURRENT_DATE);

-- Ensure appointment time is valid (business hours: 8 AM - 8 PM)
ALTER TABLE appointments ADD CONSTRAINT appointments_valid_time 
    CHECK (appointment_time >= '08:00:00' AND appointment_time <= '20:00:00');

-- Ensure duration is positive and reasonable (max 8 hours)
ALTER TABLE appointments ADD CONSTRAINT appointments_duration_range 
    CHECK (duration > 0 AND duration <= 480);

-- ========================================
-- PATIENT VALIDATIONS
-- ========================================

-- Ensure date of birth is not in the future and is reasonable
ALTER TABLE patients ADD CONSTRAINT patients_dob_check 
    CHECK (date_of_birth <= CURRENT_DATE AND date_of_birth >= '1900-01-01');

-- Ensure patient age is reasonable (calculated from DOB)
ALTER TABLE patients ADD CONSTRAINT patients_age_reasonable 
    CHECK (date_of_birth IS NULL OR EXTRACT(YEAR FROM age(date_of_birth)) BETWEEN 0 AND 150);

-- ========================================
-- SESSION VALIDATIONS
-- ========================================

-- Ensure session date is not in the future
ALTER TABLE sessions ADD CONSTRAINT sessions_date_check 
    CHECK (session_date <= CURRENT_DATE);

-- Ensure session duration is positive and reasonable
ALTER TABLE sessions ADD CONSTRAINT sessions_duration_check 
    CHECK (duration IS NULL OR (duration > 0 AND duration <= 480));

-- ========================================
-- PAYMENT VALIDATIONS
-- ========================================

-- Ensure payment amount is positive
ALTER TABLE payments ADD CONSTRAINT payments_amount_positive 
    CHECK (amount > 0);

-- ========================================
-- INSURANCE CLAIM VALIDATIONS
-- ========================================

-- Ensure claim amount is positive
ALTER TABLE insurance_claims ADD CONSTRAINT insurance_claims_amount_positive 
    CHECK (amount > 0);

-- Ensure submitted date is not in the future
ALTER TABLE insurance_claims ADD CONSTRAINT insurance_claims_submitted_date 
    CHECK (submitted_date IS NULL OR submitted_date <= CURRENT_DATE);

-- Ensure processed date is after or equal to submitted date
ALTER TABLE insurance_claims ADD CONSTRAINT insurance_claims_processed_after_submitted 
    CHECK (processed_date IS NULL OR submitted_date IS NULL OR processed_date >= submitted_date);

-- ========================================
-- USER VALIDATIONS
-- ========================================

-- Ensure email format is valid (basic check)
ALTER TABLE users ADD CONSTRAINT users_email_format 
    CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$');

-- Ensure phone format is valid (Saudi format or international)
ALTER TABLE patients ADD CONSTRAINT patients_phone_format 
    CHECK (phone IS NULL OR phone ~ '^\+?[0-9]{10,15}$');

ALTER TABLE users ADD CONSTRAINT users_phone_format 
    CHECK (phone IS NULL OR phone ~ '^\+?[0-9]{10,15}$');

-- Add comments for documentation
COMMENT ON CONSTRAINT appointments_future_date ON appointments IS 'Prevents scheduling appointments in the past';
COMMENT ON CONSTRAINT patients_dob_check ON patients IS 'Ensures date of birth is valid and reasonable';
COMMENT ON CONSTRAINT payments_amount_positive ON payments IS 'Ensures payment amount is always positive';
