-- ================================================================
-- MIGRATION 055: ADD MISSING FOREIGN KEY ON AUDIT_LOGS
-- ================================================================
-- Date: 2025-11-01
-- Purpose: Add foreign key constraint on audit_logs.user_id
--          to maintain referential integrity
-- ================================================================

-- Add foreign key constraint on audit_logs.user_id
-- Use ON DELETE SET NULL because we want to keep audit logs even if user is deleted
-- (for compliance and audit trail purposes)

DO $$
BEGIN
    -- First, check if the column exists
    IF EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'audit_logs' AND column_name = 'user_id'
    ) THEN
        -- Drop existing constraint if exists
        IF EXISTS (
            SELECT 1 FROM pg_constraint
            WHERE conname = 'fk_audit_logs_user_id'
        ) THEN
            ALTER TABLE audit_logs DROP CONSTRAINT fk_audit_logs_user_id;
            RAISE NOTICE 'Dropped existing audit_logs user_id foreign key';
        END IF;
        
        -- Add new foreign key constraint with SET NULL
        ALTER TABLE audit_logs 
        ADD CONSTRAINT fk_audit_logs_user_id 
        FOREIGN KEY (user_id) 
        REFERENCES users(id) 
        ON DELETE SET NULL;
        
        RAISE NOTICE 'Added foreign key constraint on audit_logs.user_id';
    ELSE
        RAISE NOTICE 'Column audit_logs.user_id does not exist, skipping';
    END IF;
END $$;

-- Add index on user_id if it doesn't exist (for better FK performance)
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_audit_logs_user_id 
ON audit_logs(user_id);

COMMENT ON CONSTRAINT fk_audit_logs_user_id ON audit_logs IS 
'Foreign key to users table. Uses ON DELETE SET NULL to preserve audit logs when user is deleted.';
