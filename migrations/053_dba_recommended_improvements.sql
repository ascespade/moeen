-- ================================================================
-- 📊 DBA INTEGRITY AGENT - RECOMMENDED IMPROVEMENTS
-- ================================================================
-- Generated: 2025-11-01
-- Based on: DBA Integrity Agent Report
-- Priority: HIGH and MEDIUM improvements
-- ================================================================

-- ============================================================
-- HIGH PRIORITY: Add Missing Indexes
-- ============================================================
-- These indexes will significantly improve query performance
-- on frequently accessed columns

-- Index for insurance claim number lookups
-- Estimated Impact: 15-25% improvement on claim searches
CREATE INDEX IF NOT EXISTS idx_insurance_claims_claim_number 
ON insurance_claims(claim_number);

-- Index for doctor license verification
-- Estimated Impact: 5-10% improvement on doctor verification
CREATE INDEX IF NOT EXISTS idx_doctors_license_number 
ON doctors(license_number);

-- ============================================================
-- MEDIUM PRIORITY: Add Unique Constraints (Optional)
-- ============================================================
-- Only apply if business logic requires these to be unique

-- Uncomment if claim numbers should be globally unique
-- DO $$ BEGIN
--   ALTER TABLE insurance_claims 
--   ADD CONSTRAINT insurance_claims_claim_number_unique 
--   UNIQUE(claim_number);
-- EXCEPTION
--   WHEN duplicate_object THEN NULL;
-- END $$;

-- Uncomment if license numbers should be unique
-- DO $$ BEGIN
--   ALTER TABLE doctors 
--   ADD CONSTRAINT doctors_license_number_unique 
--   UNIQUE(license_number);
-- EXCEPTION
--   WHEN duplicate_object THEN NULL;
-- END $$;

-- ============================================================
-- MEDIUM PRIORITY: Explicit Foreign Key Actions
-- ============================================================
-- Add explicit ON DELETE and ON UPDATE clauses for clarity
-- Note: This requires dropping and recreating the constraints

-- Example for appointments -> patients
-- DO $$ BEGIN
--   -- Drop existing constraint
--   ALTER TABLE appointments 
--   DROP CONSTRAINT IF EXISTS appointments_patient_id_fkey;
--   
--   -- Add with explicit CASCADE
--   ALTER TABLE appointments 
--   ADD CONSTRAINT appointments_patient_id_fkey
--     FOREIGN KEY (patient_id) 
--     REFERENCES patients(id)
--     ON DELETE CASCADE
--     ON UPDATE CASCADE;
-- EXCEPTION
--   WHEN others THEN NULL;
-- END $$;

-- Example for appointments -> doctors
-- DO $$ BEGIN
--   ALTER TABLE appointments 
--   DROP CONSTRAINT IF EXISTS appointments_doctor_id_fkey;
--   
--   ALTER TABLE appointments 
--   ADD CONSTRAINT appointments_doctor_id_fkey
--     FOREIGN KEY (doctor_id) 
--     REFERENCES doctors(id)
--     ON DELETE CASCADE
--     ON UPDATE CASCADE;
-- EXCEPTION
--   WHEN others THEN NULL;
-- END $$;

-- Example for insurance_claims -> appointments (SET NULL on delete)
-- DO $$ BEGIN
--   ALTER TABLE insurance_claims 
--   DROP CONSTRAINT IF EXISTS insurance_claims_appointment_id_fkey;
--   
--   ALTER TABLE insurance_claims 
--   ADD CONSTRAINT insurance_claims_appointment_id_fkey
--     FOREIGN KEY (appointment_id) 
--     REFERENCES appointments(id)
--     ON DELETE SET NULL
--     ON UPDATE CASCADE;
-- EXCEPTION
--   WHEN others THEN NULL;
-- END $$;

-- ============================================================
-- LOW PRIORITY: Performance Monitoring
-- ============================================================
-- Enable pg_stat_statements for query performance monitoring
-- Uncomment to enable (requires superuser privileges)

-- CREATE EXTENSION IF NOT EXISTS pg_stat_statements;

-- View to check slow queries (run manually when needed)
-- SELECT 
--   query,
--   calls,
--   total_exec_time,
--   mean_exec_time,
--   max_exec_time
-- FROM pg_stat_statements
-- WHERE mean_exec_time > 100 -- queries taking more than 100ms
-- ORDER BY mean_exec_time DESC
-- LIMIT 20;

-- ============================================================
-- VERIFICATION QUERIES
-- ============================================================
-- Run these queries after applying the migration to verify success

-- 1. Verify new indexes were created
-- SELECT 
--   schemaname,
--   tablename,
--   indexname,
--   indexdef
-- FROM pg_indexes
-- WHERE indexname IN (
--   'idx_insurance_claims_claim_number',
--   'idx_doctors_license_number'
-- );

-- 2. Check index usage (run after some production traffic)
-- SELECT 
--   schemaname,
--   tablename,
--   indexname,
--   idx_scan as index_scans,
--   idx_tup_read as tuples_read,
--   idx_tup_fetch as tuples_fetched
-- FROM pg_stat_user_indexes
-- WHERE indexname IN (
--   'idx_insurance_claims_claim_number',
--   'idx_doctors_license_number'
-- );

-- 3. Check for orphaned records (data integrity)
-- SELECT COUNT(*) as orphaned_appointments
-- FROM appointments a 
-- LEFT JOIN patients p ON a.patient_id = p.id 
-- WHERE p.id IS NULL;

-- 4. Check for duplicate records (should return 0)
-- SELECT email, COUNT(*) as duplicate_count
-- FROM users 
-- GROUP BY email 
-- HAVING COUNT(*) > 1;

-- ============================================================
-- ROLLBACK PROCEDURE (if needed)
-- ============================================================
-- To rollback these changes:

-- DROP INDEX IF EXISTS idx_insurance_claims_claim_number;
-- DROP INDEX IF EXISTS idx_doctors_license_number;

-- ALTER TABLE insurance_claims DROP CONSTRAINT IF EXISTS insurance_claims_claim_number_unique;
-- ALTER TABLE doctors DROP CONSTRAINT IF EXISTS doctors_license_number_unique;

-- ============================================================
-- NOTES AND RECOMMENDATIONS
-- ============================================================
-- 
-- 1. TESTING:
--    - Test in staging environment first
--    - Run EXPLAIN ANALYZE on affected queries before and after
--    - Monitor query performance for at least 24 hours
--
-- 2. DEPLOYMENT:
--    - Schedule during low-traffic period
--    - Monitor database CPU and memory during index creation
--    - Large tables may take time to index (use CONCURRENTLY option)
--
-- 3. MONITORING:
--    - Track query performance metrics
--    - Monitor index usage statistics
--    - Watch for any application errors
--
-- 4. APPLICATION CHANGES:
--    - Review and refactor SELECT * queries to use specific columns
--    - Add LIMIT clauses to all list queries (recommended: 50-100)
--    - Ensure CUID generation consistency across all inserts
--
-- 5. DOCUMENTATION:
--    - Update database schema documentation
--    - Document foreign key cascade behavior
--    - Update query optimization guidelines
--
-- ================================================================
-- END OF MIGRATION
-- ================================================================

-- Add comments to tables for documentation
COMMENT ON INDEX idx_insurance_claims_claim_number IS 
'Performance index for insurance claim number lookups. Added by DBA Integrity Agent - 2025-11-01';

COMMENT ON INDEX idx_doctors_license_number IS 
'Performance index for doctor license verification. Added by DBA Integrity Agent - 2025-11-01';
