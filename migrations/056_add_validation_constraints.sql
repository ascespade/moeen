-- ================================================================
-- MIGRATION 056: ADD DATA VALIDATION CONSTRAINTS
-- ================================================================
-- Date: 2025-11-01
-- Purpose: Add CHECK constraints to validate data integrity
-- ================================================================

-- Add CHECK constraint to ensure date_of_birth is in the past
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'patients' AND column_name = 'date_of_birth'
    ) THEN
        -- Drop existing constraint if exists
        IF EXISTS (
            SELECT 1 FROM pg_constraint
            WHERE conname = 'chk_patients_dob'
        ) THEN
            ALTER TABLE patients DROP CONSTRAINT chk_patients_dob;
        END IF;
        
        -- Add new constraint
        ALTER TABLE patients 
        ADD CONSTRAINT chk_patients_dob 
        CHECK (date_of_birth < CURRENT_DATE);
        
        RAISE NOTICE 'Added date_of_birth validation constraint on patients table';
    END IF;
END $$;

-- Add CHECK constraint to ensure scheduled_at is in the future (with some grace period)
-- Allow appointments scheduled in the last hour to account for processing time
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'appointments' AND column_name = 'scheduled_at'
    ) THEN
        -- Drop existing constraint if exists
        IF EXISTS (
            SELECT 1 FROM pg_constraint
            WHERE conname = 'chk_appointments_future'
        ) THEN
            ALTER TABLE appointments DROP CONSTRAINT chk_appointments_future;
        END IF;
        
        -- Add new constraint with 1 hour grace period
        ALTER TABLE appointments 
        ADD CONSTRAINT chk_appointments_future 
        CHECK (scheduled_at >= NOW() - INTERVAL '1 hour');
        
        RAISE NOTICE 'Added scheduled_at validation constraint on appointments table';
    END IF;
END $$;

-- Add CHECK constraint to ensure phone numbers have valid format (if column exists)
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'patients' AND column_name = 'phone'
    ) THEN
        -- Drop existing constraint if exists
        IF EXISTS (
            SELECT 1 FROM pg_constraint
            WHERE conname = 'chk_patients_phone_format'
        ) THEN
            ALTER TABLE patients DROP CONSTRAINT chk_patients_phone_format;
        END IF;
        
        -- Add constraint to validate phone format (Saudi format or international)
        -- Accepts: +966XXXXXXXXX, 05XXXXXXXX, or +XXXXXXXXXXXX
        ALTER TABLE patients 
        ADD CONSTRAINT chk_patients_phone_format 
        CHECK (
            phone IS NULL OR 
            phone ~ '^(\+966|05)[0-9]{8,9}$' OR 
            phone ~ '^\+[0-9]{10,15}$'
        );
        
        RAISE NOTICE 'Added phone format validation constraint on patients table';
    END IF;
END $$;

-- Add CHECK constraint to ensure email has valid format
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'patients' AND column_name = 'email'
    ) THEN
        -- Drop existing constraint if exists
        IF EXISTS (
            SELECT 1 FROM pg_constraint
            WHERE conname = 'chk_patients_email_format'
        ) THEN
            ALTER TABLE patients DROP CONSTRAINT chk_patients_email_format;
        END IF;
        
        -- Add constraint to validate email format
        ALTER TABLE patients 
        ADD CONSTRAINT chk_patients_email_format 
        CHECK (
            email IS NULL OR 
            email ~ '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'
        );
        
        RAISE NOTICE 'Added email format validation constraint on patients table';
    END IF;
END $$;

-- Add CHECK constraint on users table for email format
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'users' AND column_name = 'email'
    ) THEN
        -- Drop existing constraint if exists
        IF EXISTS (
            SELECT 1 FROM pg_constraint
            WHERE conname = 'chk_users_email_format'
        ) THEN
            ALTER TABLE users DROP CONSTRAINT chk_users_email_format;
        END IF;
        
        -- Add constraint to validate email format
        ALTER TABLE users 
        ADD CONSTRAINT chk_users_email_format 
        CHECK (
            email ~ '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'
        );
        
        RAISE NOTICE 'Added email format validation constraint on users table';
    END IF;
END $$;

-- Add CHECK constraint to ensure payment amounts are positive
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.tables
        WHERE table_name = 'payments'
    ) THEN
        -- Drop existing constraint if exists
        IF EXISTS (
            SELECT 1 FROM pg_constraint
            WHERE conname = 'chk_payments_amount_positive'
        ) THEN
            ALTER TABLE payments DROP CONSTRAINT chk_payments_amount_positive;
        END IF;
        
        -- Add constraint to ensure amounts are positive
        ALTER TABLE payments 
        ADD CONSTRAINT chk_payments_amount_positive 
        CHECK (amount > 0);
        
        RAISE NOTICE 'Added amount validation constraint on payments table';
    END IF;
END $$;

-- Add CHECK constraint to ensure insurance claim amounts are positive
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.tables
        WHERE table_name = 'insurance_claims'
    ) THEN
        IF EXISTS (
            SELECT 1 FROM information_schema.columns
            WHERE table_name = 'insurance_claims' AND column_name = 'amount'
        ) THEN
            -- Drop existing constraint if exists
            IF EXISTS (
                SELECT 1 FROM pg_constraint
                WHERE conname = 'chk_insurance_claims_amount_positive'
            ) THEN
                ALTER TABLE insurance_claims DROP CONSTRAINT chk_insurance_claims_amount_positive;
            END IF;
            
            -- Add constraint to ensure amounts are positive
            ALTER TABLE insurance_claims 
            ADD CONSTRAINT chk_insurance_claims_amount_positive 
            CHECK (amount > 0);
            
            RAISE NOTICE 'Added amount validation constraint on insurance_claims table';
        END IF;
    END IF;
END $$;

COMMENT ON CONSTRAINT chk_patients_dob ON patients IS 
'Ensures date of birth is in the past';

COMMENT ON CONSTRAINT chk_appointments_future ON appointments IS 
'Ensures appointments are not scheduled too far in the past (1 hour grace period)';

COMMENT ON CONSTRAINT chk_patients_phone_format ON patients IS 
'Validates phone number format (Saudi or international format)';

COMMENT ON CONSTRAINT chk_patients_email_format ON patients IS 
'Validates email format using regex';
