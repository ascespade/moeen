-- ================================================================
-- FIX: ip_address Trigger Issue
-- Run this in Supabase SQL Editor
-- ================================================================

-- Step 1: Find all triggers related to ip_address
SELECT 
  t.trigger_name,
  t.event_object_table as table_name,
  t.action_statement,
  t.action_timing,
  t.event_manipulation
FROM information_schema.triggers t
WHERE 
  t.action_statement LIKE '%ip_address%'
  OR t.trigger_name LIKE '%ip%';

-- Step 2: Fix the trigger function (if exists)
CREATE OR REPLACE FUNCTION public.set_ip_address_from_request()
RETURNS TRIGGER AS $$
DECLARE
  request_ip text;
BEGIN
  -- Safely get IP from request
  BEGIN
    request_ip := current_setting('request.headers', true);
    
    IF request_ip IS NOT NULL THEN
      -- Try to extract IP from JSON headers
      BEGIN
        NEW.ip_address := CAST(
          COALESCE(
            request_ip::json->>'x-forwarded-for',
            request_ip::json->>'x-real-ip',
            '0.0.0.0'
          ) AS inet
        );
      EXCEPTION WHEN OTHERS THEN
        -- If anything fails, set to default
        NEW.ip_address := '0.0.0.0'::inet;
      END;
    ELSE
      NEW.ip_address := '0.0.0.0'::inet;
    END IF;
  EXCEPTION WHEN OTHERS THEN
    -- If request.headers not available, use default
    NEW.ip_address := '0.0.0.0'::inet;
  END;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Step 3: Alternative - Make ip_address nullable (easier)
ALTER TABLE patients ALTER COLUMN ip_address DROP NOT NULL;
ALTER TABLE patients ALTER COLUMN ip_address SET DEFAULT NULL;

-- Step 4: Alternative - Remove trigger entirely (if not needed)
-- Uncomment if you want to remove the trigger:
-- DROP TRIGGER IF EXISTS set_ip_address_trigger ON patients;
-- DROP TRIGGER IF EXISTS set_ip_on_insert ON patients;
-- DROP TRIGGER IF EXISTS set_ip_on_update ON patients;

-- Step 5: Test the fix
-- Try inserting a patient
INSERT INTO patients (first_name, last_name, email, phone, date_of_birth, gender)
VALUES ('Test', 'Patient', 'test@example.com', '+966501234567', '1990-01-01', 'male')
RETURNING id, first_name, last_name, ip_address;

-- Clean up test
DELETE FROM patients WHERE email = 'test@example.com';

-- ================================================================
-- VERIFICATION QUERIES
-- ================================================================

-- Check if ip_address columns exist
SELECT 
  table_name, 
  column_name, 
  data_type, 
  is_nullable,
  column_default
FROM information_schema.columns
WHERE column_name = 'ip_address'
ORDER BY table_name;

-- Check current nullable status
SELECT 
  table_name,
  column_name,
  is_nullable as nullable,
  column_default as default_value
FROM information_schema.columns
WHERE column_name LIKE '%ip%'
ORDER BY table_name, ordinal_position;

-- ================================================================
-- RECOMMENDED FIX (Choose ONE):
-- ================================================================

-- OPTION A: Make ip_address nullable (RECOMMENDED - EASIEST)
ALTER TABLE patients ALTER COLUMN ip_address DROP NOT NULL;
ALTER TABLE patients ALTER COLUMN ip_address SET DEFAULT NULL;

-- OPTION B: Fix the trigger to handle NULL properly
-- (Run the CREATE OR REPLACE FUNCTION above, then)
-- ALTER FUNCTION set_ip_address_from_request() OWNER TO postgres;

-- OPTION C: Remove trigger entirely if not needed
-- DROP TRIGGER IF EXISTS set_ip_address_trigger ON patients CASCADE;
-- DROP FUNCTION IF EXISTS set_ip_address_from_request() CASCADE;

-- ================================================================
-- After applying fix, verify:
-- ================================================================

-- Test insert
INSERT INTO patients (first_name, last_name, email, phone, date_of_birth, gender)
VALUES ('Verification', 'Test', 'verify@test.com', '+966501234567', '1990-01-01', 'male')
RETURNING *;

-- Should succeed now!

-- Cleanup
DELETE FROM patients WHERE email = 'verify@test.com';

-- ================================================================
-- STATUS: Ready to execute
-- RECOMMENDATION: Run OPTION A (simplest and safest)
-- ================================================================
