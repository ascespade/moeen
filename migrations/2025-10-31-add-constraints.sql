-- ============================================================
-- Migration: Add Database Constraints & Data Integrity
-- Date: 2025-10-31
-- Description: Adds constraints to prevent duplicate users, 
--              enforce required fields, and add audit triggers
-- ============================================================

-- Prevent duplicate users by email
-- Note: This assumes email is the unique identifier
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'users_email_unique'
    ) THEN
        ALTER TABLE public.users
            ADD CONSTRAINT users_email_unique UNIQUE (email);
        RAISE NOTICE 'Added users_email_unique constraint';
    ELSE
        RAISE NOTICE 'Constraint users_email_unique already exists';
    END IF;
END $$;

-- Enforce not nulls for critical fields (safe - only if column allows)
DO $$
BEGIN
    -- Only alter if column doesn't already have NOT NULL constraint
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'users' 
        AND column_name = 'email'
        AND is_nullable = 'YES'
    ) THEN
        ALTER TABLE public.users
            ALTER COLUMN email SET NOT NULL;
        RAISE NOTICE 'Set email to NOT NULL';
    END IF;

    -- Role should not be null (if role_id column exists)
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'users' 
        AND column_name = 'role'
        AND is_nullable = 'YES'
    ) THEN
        -- Set default role if needed
        UPDATE public.users SET role = 'patient' WHERE role IS NULL;
        ALTER TABLE public.users
            ALTER COLUMN role SET NOT NULL,
            ALTER COLUMN role SET DEFAULT 'patient';
        RAISE NOTICE 'Set role to NOT NULL with default';
    END IF;
END $$;

-- Create unique index for appointments to avoid overlapping slots
-- This prevents double-booking of the same doctor at the same time
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_indexes 
        WHERE indexname = 'appointments_doctor_time_unique'
    ) THEN
        CREATE UNIQUE INDEX appointments_doctor_time_unique 
        ON public.appointments (doctor_id, appointment_date, appointment_time)
        WHERE status = 'scheduled' OR status = 'confirmed';
        RAISE NOTICE 'Created appointments_doctor_time_unique index';
    ELSE
        RAISE NOTICE 'Index appointments_doctor_time_unique already exists';
    END IF;
EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'Could not create appointments index: %', SQLERRM;
END $$;

-- Audit: Add triggers for data hygiene
-- Function to automatically set updated_at timestamp
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to users table
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_trigger 
        WHERE tgname = 'trg_set_updated_at_users'
    ) THEN
        CREATE TRIGGER trg_set_updated_at_users
        BEFORE UPDATE ON public.users
        FOR EACH ROW 
        EXECUTE FUNCTION set_updated_at();
        RAISE NOTICE 'Created trigger trg_set_updated_at_users';
    ELSE
        RAISE NOTICE 'Trigger trg_set_updated_at_users already exists';
    END IF;
END $$;

-- Apply trigger to patients table (if exists)
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'patients'
    ) THEN
        IF NOT EXISTS (
            SELECT 1 FROM pg_trigger 
            WHERE tgname = 'trg_set_updated_at_patients'
        ) THEN
            CREATE TRIGGER trg_set_updated_at_patients
            BEFORE UPDATE ON public.patients
            FOR EACH ROW 
            EXECUTE FUNCTION set_updated_at();
            RAISE NOTICE 'Created trigger trg_set_updated_at_patients';
        END IF;
    END IF;
END $$;

-- Apply trigger to doctors table (if exists)
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'doctors'
    ) THEN
        IF NOT EXISTS (
            SELECT 1 FROM pg_trigger 
            WHERE tgname = 'trg_set_updated_at_doctors'
        ) THEN
            CREATE TRIGGER trg_set_updated_at_doctors
            BEFORE UPDATE ON public.doctors
            FOR EACH ROW 
            EXECUTE FUNCTION set_updated_at();
            RAISE NOTICE 'Created trigger trg_set_updated_at_doctors';
        END IF;
    END IF;
END $$;

-- Apply trigger to appointments table (if exists)
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'appointments'
    ) THEN
        IF NOT EXISTS (
            SELECT 1 FROM pg_trigger 
            WHERE tgname = 'trg_set_updated_at_appointments'
        ) THEN
            CREATE TRIGGER trg_set_updated_at_appointments
            BEFORE UPDATE ON public.appointments
            FOR EACH ROW 
            EXECUTE FUNCTION set_updated_at();
            RAISE NOTICE 'Created trigger trg_set_updated_at_appointments';
        END IF;
    END IF;
END $$;

-- Add index for faster lookups on users.email (if not exists)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_indexes 
        WHERE indexname = 'idx_users_email'
    ) THEN
        CREATE INDEX idx_users_email ON public.users(email);
        RAISE NOTICE 'Created index idx_users_email';
    END IF;
END $$;

-- Add index for faster lookups on users.role (if not exists)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_indexes 
        WHERE indexname = 'idx_users_role'
    ) THEN
        CREATE INDEX idx_users_role ON public.users(role);
        RAISE NOTICE 'Created index idx_users_role';
    END IF;
END $$;

-- Add index for appointments lookups (if appointments table exists)
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'appointments'
    ) THEN
        IF NOT EXISTS (
            SELECT 1 FROM pg_indexes 
            WHERE indexname = 'idx_appointments_doctor_date'
        ) THEN
            CREATE INDEX idx_appointments_doctor_date 
            ON public.appointments(doctor_id, appointment_date);
            RAISE NOTICE 'Created index idx_appointments_doctor_date';
        END IF;

        IF NOT EXISTS (
            SELECT 1 FROM pg_indexes 
            WHERE indexname = 'idx_appointments_patient_date'
        ) THEN
            CREATE INDEX idx_appointments_patient_date 
            ON public.appointments(patient_id, appointment_date);
            RAISE NOTICE 'Created index idx_appointments_patient_date';
        END IF;
    END IF;
END $$;

-- Summary
SELECT 
    'Migration completed successfully' AS status,
    NOW() AS completed_at;
