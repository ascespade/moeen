-- ================================================================
-- MIGRATION 054: FIX CASCADE DELETES TO PREVENT DATA LOSS
-- ================================================================
-- Date: 2025-11-01
-- Purpose: Change ON DELETE CASCADE to RESTRICT on critical foreign keys
--          to prevent accidental data loss
-- Risk: HIGH - Protects against unintended deletion of appointments and records
-- ================================================================

-- IMPORTANT: This migration changes delete behavior
-- After this migration, deleting a patient or doctor will fail if they have
-- associated appointments. You must explicitly handle cleanup.

-- Fix appointments -> patients foreign key
-- Change CASCADE to RESTRICT to prevent accidental deletion of appointments
DO $$
BEGIN
    -- Drop existing constraint if exists
    IF EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'appointments_patient_id_fkey'
    ) THEN
        ALTER TABLE appointments DROP CONSTRAINT appointments_patient_id_fkey;
    END IF;
    
    -- Add new constraint with RESTRICT
    ALTER TABLE appointments 
    ADD CONSTRAINT appointments_patient_id_fkey 
    FOREIGN KEY (patient_id) 
    REFERENCES patients(id) 
    ON DELETE RESTRICT;
    
    RAISE NOTICE 'Fixed appointments -> patients foreign key constraint';
END $$;

-- Fix appointments -> doctors foreign key
-- Change CASCADE to RESTRICT to prevent accidental deletion of appointments
DO $$
BEGIN
    -- Drop existing constraint if exists
    IF EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'appointments_doctor_id_fkey'
    ) THEN
        ALTER TABLE appointments DROP CONSTRAINT appointments_doctor_id_fkey;
    END IF;
    
    -- Add new constraint with RESTRICT
    ALTER TABLE appointments 
    ADD CONSTRAINT appointments_doctor_id_fkey 
    FOREIGN KEY (doctor_id) 
    REFERENCES doctors(id) 
    ON DELETE RESTRICT;
    
    RAISE NOTICE 'Fixed appointments -> doctors foreign key constraint';
END $$;

-- Fix medical_records -> patients foreign key (if exists)
-- Change CASCADE to RESTRICT to prevent accidental deletion of medical records
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.tables 
        WHERE table_name = 'medical_records'
    ) THEN
        -- Drop existing constraint if exists
        IF EXISTS (
            SELECT 1 FROM pg_constraint 
            WHERE conname = 'medical_records_patient_id_fkey'
        ) THEN
            ALTER TABLE medical_records DROP CONSTRAINT medical_records_patient_id_fkey;
        END IF;
        
        -- Add new constraint with RESTRICT
        ALTER TABLE medical_records 
        ADD CONSTRAINT medical_records_patient_id_fkey 
        FOREIGN KEY (patient_id) 
        REFERENCES patients(id) 
        ON DELETE RESTRICT;
        
        RAISE NOTICE 'Fixed medical_records -> patients foreign key constraint';
    END IF;
END $$;

-- Fix insurance_claims -> patients foreign key (if exists)
-- Change CASCADE to RESTRICT to prevent accidental deletion of insurance claims
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.tables 
        WHERE table_name = 'insurance_claims'
    ) THEN
        -- Drop existing constraint if exists
        IF EXISTS (
            SELECT 1 FROM pg_constraint 
            WHERE conname = 'insurance_claims_patient_id_fkey'
        ) THEN
            ALTER TABLE insurance_claims DROP CONSTRAINT insurance_claims_patient_id_fkey;
        END IF;
        
        -- Add new constraint with RESTRICT
        ALTER TABLE insurance_claims 
        ADD CONSTRAINT insurance_claims_patient_id_fkey 
        FOREIGN KEY (patient_id) 
        REFERENCES patients(id) 
        ON DELETE RESTRICT;
        
        RAISE NOTICE 'Fixed insurance_claims -> patients foreign key constraint';
    END IF;
END $$;

-- Create a helper function to safely delete patients
-- This function will check for related records before deletion
CREATE OR REPLACE FUNCTION safe_delete_patient(p_patient_id INTEGER)
RETURNS JSONB AS $$
DECLARE
    v_appointment_count INTEGER;
    v_medical_record_count INTEGER;
    v_insurance_claim_count INTEGER;
    v_result JSONB;
BEGIN
    -- Check for related appointments
    SELECT COUNT(*) INTO v_appointment_count
    FROM appointments
    WHERE patient_id = p_patient_id;
    
    -- Check for related medical records
    SELECT COUNT(*) INTO v_medical_record_count
    FROM medical_records
    WHERE patient_id = p_patient_id;
    
    -- Check for related insurance claims
    SELECT COUNT(*) INTO v_insurance_claim_count
    FROM insurance_claims
    WHERE patient_id = p_patient_id;
    
    -- If patient has no related records, allow deletion
    IF v_appointment_count = 0 AND v_medical_record_count = 0 AND v_insurance_claim_count = 0 THEN
        DELETE FROM patients WHERE id = p_patient_id;
        v_result := jsonb_build_object(
            'success', true,
            'message', 'Patient deleted successfully'
        );
    ELSE
        -- Return error with details
        v_result := jsonb_build_object(
            'success', false,
            'message', 'Cannot delete patient with related records',
            'details', jsonb_build_object(
                'appointments', v_appointment_count,
                'medical_records', v_medical_record_count,
                'insurance_claims', v_insurance_claim_count
            )
        );
    END IF;
    
    RETURN v_result;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION safe_delete_patient IS 'Safely delete patient after checking for related records. Returns JSON with success status and details.';

-- Create similar function for doctors
CREATE OR REPLACE FUNCTION safe_delete_doctor(p_doctor_id INTEGER)
RETURNS JSONB AS $$
DECLARE
    v_appointment_count INTEGER;
    v_session_count INTEGER;
    v_result JSONB;
BEGIN
    -- Check for related appointments
    SELECT COUNT(*) INTO v_appointment_count
    FROM appointments
    WHERE doctor_id = p_doctor_id;
    
    -- Check for related sessions
    SELECT COUNT(*) INTO v_session_count
    FROM sessions
    WHERE doctor_id = p_doctor_id;
    
    -- If doctor has no related records, allow deletion
    IF v_appointment_count = 0 AND v_session_count = 0 THEN
        DELETE FROM doctors WHERE id = p_doctor_id;
        v_result := jsonb_build_object(
            'success', true,
            'message', 'Doctor deleted successfully'
        );
    ELSE
        -- Return error with details
        v_result := jsonb_build_object(
            'success', false,
            'message', 'Cannot delete doctor with related records',
            'details', jsonb_build_object(
                'appointments', v_appointment_count,
                'sessions', v_session_count
            )
        );
    END IF;
    
    RETURN v_result;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION safe_delete_doctor IS 'Safely delete doctor after checking for related records. Returns JSON with success status and details.';
