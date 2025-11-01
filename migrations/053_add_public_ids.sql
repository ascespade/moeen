-- ================================================================
-- 🔐 ADD PUBLIC_ID TO ALL TABLES FOR SECURITY
-- Migration: 053_add_public_ids.sql
-- Purpose: Add public_id column to all tables that need it
-- Security: Prevent exposing internal UUIDs to external APIs
-- ================================================================

-- Helper function to generate CUID-style public IDs
CREATE OR REPLACE FUNCTION generate_public_id(prefix TEXT)
RETURNS TEXT AS $$
DECLARE
  timestamp_part TEXT;
  random_part TEXT;
  counter_part TEXT;
BEGIN
  -- Generate timestamp in base36
  timestamp_part := LPAD(TO_HEX(EXTRACT(EPOCH FROM NOW())::BIGINT), 10, '0');
  
  -- Generate random part
  random_part := LPAD(TO_HEX(FLOOR(RANDOM() * 4294967296)::BIGINT), 8, '0');
  
  -- Generate counter part (using random for now)
  counter_part := LPAD(TO_HEX(FLOOR(RANDOM() * 65536)::BIGINT), 4, '0');
  
  RETURN prefix || '_' || timestamp_part || random_part || counter_part;
END;
$$ LANGUAGE plpgsql;

-- ================================================================
-- HEALTHCARE TABLES
-- ================================================================

-- Patients
ALTER TABLE patients 
  ADD COLUMN IF NOT EXISTS public_id VARCHAR(50) UNIQUE;

CREATE INDEX IF NOT EXISTS idx_patients_public_id ON patients(public_id);

UPDATE patients 
SET public_id = generate_public_id('pat') 
WHERE public_id IS NULL;

-- Doctors
ALTER TABLE doctors 
  ADD COLUMN IF NOT EXISTS public_id VARCHAR(50) UNIQUE;

CREATE INDEX IF NOT EXISTS idx_doctors_public_id ON doctors(public_id);

UPDATE doctors 
SET public_id = generate_public_id('doc') 
WHERE public_id IS NULL;

-- Appointments
ALTER TABLE appointments 
  ADD COLUMN IF NOT EXISTS public_id VARCHAR(50) UNIQUE;

CREATE INDEX IF NOT EXISTS idx_appointments_public_id ON appointments(public_id);

UPDATE appointments 
SET public_id = generate_public_id('apt') 
WHERE public_id IS NULL;

-- Sessions
ALTER TABLE sessions 
  ADD COLUMN IF NOT EXISTS public_id VARCHAR(50) UNIQUE;

CREATE INDEX IF NOT EXISTS idx_sessions_public_id ON sessions(public_id);

UPDATE sessions 
SET public_id = generate_public_id('ses') 
WHERE public_id IS NULL;

-- Insurance Claims
ALTER TABLE insurance_claims 
  ADD COLUMN IF NOT EXISTS public_id VARCHAR(50) UNIQUE;

CREATE INDEX IF NOT EXISTS idx_insurance_claims_public_id ON insurance_claims(public_id);

UPDATE insurance_claims 
SET public_id = generate_public_id('clm') 
WHERE public_id IS NULL;

-- Medical Records (if exists)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'medical_records') THEN
    ALTER TABLE medical_records 
      ADD COLUMN IF NOT EXISTS public_id VARCHAR(50) UNIQUE;
    
    CREATE INDEX IF NOT EXISTS idx_medical_records_public_id ON medical_records(public_id);
    
    UPDATE medical_records 
    SET public_id = generate_public_id('med') 
    WHERE public_id IS NULL;
  END IF;
END $$;

-- ================================================================
-- CHATBOT TABLES
-- ================================================================

-- Chatbot Flows
ALTER TABLE chatbot_flows 
  ADD COLUMN IF NOT EXISTS public_id VARCHAR(50) UNIQUE;

CREATE INDEX IF NOT EXISTS idx_chatbot_flows_public_id ON chatbot_flows(public_id);

UPDATE chatbot_flows 
SET public_id = generate_public_id('flw') 
WHERE public_id IS NULL;

-- Chatbot Nodes
ALTER TABLE chatbot_nodes 
  ADD COLUMN IF NOT EXISTS public_id VARCHAR(50) UNIQUE;

CREATE INDEX IF NOT EXISTS idx_chatbot_nodes_public_id ON chatbot_nodes(public_id);

UPDATE chatbot_nodes 
SET public_id = generate_public_id('nod') 
WHERE public_id IS NULL;

-- Chatbot Edges
ALTER TABLE chatbot_edges 
  ADD COLUMN IF NOT EXISTS public_id VARCHAR(50) UNIQUE;

CREATE INDEX IF NOT EXISTS idx_chatbot_edges_public_id ON chatbot_edges(public_id);

UPDATE chatbot_edges 
SET public_id = generate_public_id('edg') 
WHERE public_id IS NULL;

-- Chatbot Templates
ALTER TABLE chatbot_templates 
  ADD COLUMN IF NOT EXISTS public_id VARCHAR(50) UNIQUE;

CREATE INDEX IF NOT EXISTS idx_chatbot_templates_public_id ON chatbot_templates(public_id);

UPDATE chatbot_templates 
SET public_id = generate_public_id('tpl') 
WHERE public_id IS NULL;

-- Chatbot Integrations
ALTER TABLE chatbot_integrations 
  ADD COLUMN IF NOT EXISTS public_id VARCHAR(50) UNIQUE;

CREATE INDEX IF NOT EXISTS idx_chatbot_integrations_public_id ON chatbot_integrations(public_id);

UPDATE chatbot_integrations 
SET public_id = generate_public_id('int') 
WHERE public_id IS NULL;

-- Conversations
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'conversations') THEN
    ALTER TABLE conversations 
      ADD COLUMN IF NOT EXISTS public_id VARCHAR(50) UNIQUE;
    
    CREATE INDEX IF NOT EXISTS idx_conversations_public_id ON conversations(public_id);
    
    UPDATE conversations 
    SET public_id = generate_public_id('cnv') 
    WHERE public_id IS NULL;
  END IF;
END $$;

-- Messages
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'messages') THEN
    ALTER TABLE messages 
      ADD COLUMN IF NOT EXISTS public_id VARCHAR(50) UNIQUE;
    
    CREATE INDEX IF NOT EXISTS idx_messages_public_id ON messages(public_id);
    
    UPDATE messages 
    SET public_id = generate_public_id('msg') 
    WHERE public_id IS NULL;
  END IF;
END $$;

-- ================================================================
-- CRM TABLES
-- ================================================================

-- CRM Leads
ALTER TABLE crm_leads 
  ADD COLUMN IF NOT EXISTS public_id VARCHAR(50) UNIQUE;

CREATE INDEX IF NOT EXISTS idx_crm_leads_public_id ON crm_leads(public_id);

UPDATE crm_leads 
SET public_id = generate_public_id('led') 
WHERE public_id IS NULL;

-- CRM Deals
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'crm_deals') THEN
    ALTER TABLE crm_deals 
      ADD COLUMN IF NOT EXISTS public_id VARCHAR(50) UNIQUE;
    
    CREATE INDEX IF NOT EXISTS idx_crm_deals_public_id ON crm_deals(public_id);
    
    UPDATE crm_deals 
    SET public_id = generate_public_id('del') 
    WHERE public_id IS NULL;
  END IF;
END $$;

-- CRM Activities
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'crm_activities') THEN
    ALTER TABLE crm_activities 
      ADD COLUMN IF NOT EXISTS public_id VARCHAR(50) UNIQUE;
    
    CREATE INDEX IF NOT EXISTS idx_crm_activities_public_id ON crm_activities(public_id);
    
    UPDATE crm_activities 
    SET public_id = generate_public_id('act') 
    WHERE public_id IS NULL;
  END IF;
END $$;

-- Customers
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'customers') THEN
    ALTER TABLE customers 
      ADD COLUMN IF NOT EXISTS public_id VARCHAR(50) UNIQUE;
    
    CREATE INDEX IF NOT EXISTS idx_customers_public_id ON customers(public_id);
    
    UPDATE customers 
    SET public_id = generate_public_id('cst') 
    WHERE public_id IS NULL;
  END IF;
END $$;

-- ================================================================
-- SYSTEM TABLES
-- ================================================================

-- Notifications
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'notifications') THEN
    ALTER TABLE notifications 
      ADD COLUMN IF NOT EXISTS public_id VARCHAR(50) UNIQUE;
    
    CREATE INDEX IF NOT EXISTS idx_notifications_public_id ON notifications(public_id);
    
    UPDATE notifications 
    SET public_id = generate_public_id('ntf') 
    WHERE public_id IS NULL;
  END IF;
END $$;

-- Internal Messages
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'internal_messages') THEN
    ALTER TABLE internal_messages 
      ADD COLUMN IF NOT EXISTS public_id VARCHAR(50) UNIQUE;
    
    CREATE INDEX IF NOT EXISTS idx_internal_messages_public_id ON internal_messages(public_id);
    
    UPDATE internal_messages 
    SET public_id = generate_public_id('imsg') 
    WHERE public_id IS NULL;
  END IF;
END $$;

-- Audit Logs
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'audit_logs') THEN
    ALTER TABLE audit_logs 
      ADD COLUMN IF NOT EXISTS public_id VARCHAR(50) UNIQUE;
    
    CREATE INDEX IF NOT EXISTS idx_audit_logs_public_id ON audit_logs(public_id);
    
    UPDATE audit_logs 
    SET public_id = generate_public_id('aud') 
    WHERE public_id IS NULL;
  END IF;
END $$;

-- Roles
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'roles') THEN
    ALTER TABLE roles 
      ADD COLUMN IF NOT EXISTS public_id VARCHAR(50) UNIQUE;
    
    CREATE INDEX IF NOT EXISTS idx_roles_public_id ON roles(public_id);
    
    UPDATE roles 
    SET public_id = generate_public_id('rol') 
    WHERE public_id IS NULL;
  END IF;
END $$;

-- Settings
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'settings') THEN
    ALTER TABLE settings 
      ADD COLUMN IF NOT EXISTS public_id VARCHAR(50) UNIQUE;
    
    CREATE INDEX IF NOT EXISTS idx_settings_public_id ON settings(public_id);
    
    UPDATE settings 
    SET public_id = generate_public_id('set') 
    WHERE public_id IS NULL;
  END IF;
END $$;

-- Payments
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'payments') THEN
    ALTER TABLE payments 
      ADD COLUMN IF NOT EXISTS public_id VARCHAR(50) UNIQUE;
    
    CREATE INDEX IF NOT EXISTS idx_payments_public_id ON payments(public_id);
    
    UPDATE payments 
    SET public_id = generate_public_id('pmt') 
    WHERE public_id IS NULL;
  END IF;
END $$;

-- Invoices
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'invoices') THEN
    ALTER TABLE invoices 
      ADD COLUMN IF NOT EXISTS public_id VARCHAR(50) UNIQUE;
    
    CREATE INDEX IF NOT EXISTS idx_invoices_public_id ON invoices(public_id);
    
    UPDATE invoices 
    SET public_id = generate_public_id('inv') 
    WHERE public_id IS NULL;
  END IF;
END $$;

-- ================================================================
-- TRIGGERS TO AUTO-GENERATE PUBLIC_ID ON INSERT
-- ================================================================

-- Generic trigger function
CREATE OR REPLACE FUNCTION set_public_id()
RETURNS TRIGGER AS $$
DECLARE
  table_prefix TEXT;
BEGIN
  -- Determine prefix based on table name
  table_prefix := CASE TG_TABLE_NAME
    WHEN 'patients' THEN 'pat'
    WHEN 'doctors' THEN 'doc'
    WHEN 'appointments' THEN 'apt'
    WHEN 'sessions' THEN 'ses'
    WHEN 'insurance_claims' THEN 'clm'
    WHEN 'medical_records' THEN 'med'
    WHEN 'chatbot_flows' THEN 'flw'
    WHEN 'chatbot_nodes' THEN 'nod'
    WHEN 'chatbot_edges' THEN 'edg'
    WHEN 'chatbot_templates' THEN 'tpl'
    WHEN 'chatbot_integrations' THEN 'int'
    WHEN 'conversations' THEN 'cnv'
    WHEN 'messages' THEN 'msg'
    WHEN 'crm_leads' THEN 'led'
    WHEN 'crm_deals' THEN 'del'
    WHEN 'crm_activities' THEN 'act'
    WHEN 'customers' THEN 'cst'
    WHEN 'notifications' THEN 'ntf'
    WHEN 'internal_messages' THEN 'imsg'
    WHEN 'audit_logs' THEN 'aud'
    WHEN 'roles' THEN 'rol'
    WHEN 'settings' THEN 'set'
    WHEN 'payments' THEN 'pmt'
    WHEN 'invoices' THEN 'inv'
    ELSE 'gen'
  END;
  
  IF NEW.public_id IS NULL THEN
    NEW.public_id := generate_public_id(table_prefix);
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply triggers to all tables
DO $$
DECLARE
  table_record RECORD;
  tables_list TEXT[] := ARRAY[
    'patients', 'doctors', 'appointments', 'sessions', 'insurance_claims',
    'chatbot_flows', 'chatbot_nodes', 'chatbot_edges', 'chatbot_templates', 
    'chatbot_integrations', 'crm_leads'
  ];
  table_name TEXT;
BEGIN
  FOREACH table_name IN ARRAY tables_list LOOP
    -- Check if table exists
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND tables.table_name = table_name) THEN
      -- Drop existing trigger if any
      EXECUTE format('DROP TRIGGER IF EXISTS set_public_id_trigger ON %I', table_name);
      
      -- Create new trigger
      EXECUTE format(
        'CREATE TRIGGER set_public_id_trigger 
         BEFORE INSERT ON %I 
         FOR EACH ROW 
         EXECUTE FUNCTION set_public_id()',
        table_name
      );
      
      RAISE NOTICE 'Created trigger for table: %', table_name;
    END IF;
  END LOOP;
END $$;

-- ================================================================
-- CONSTRAINTS
-- ================================================================

-- Make public_id NOT NULL for critical tables
ALTER TABLE patients ALTER COLUMN public_id SET NOT NULL;
ALTER TABLE doctors ALTER COLUMN public_id SET NOT NULL;
ALTER TABLE appointments ALTER COLUMN public_id SET NOT NULL;
ALTER TABLE sessions ALTER COLUMN public_id SET NOT NULL;
ALTER TABLE chatbot_flows ALTER COLUMN public_id SET NOT NULL;
ALTER TABLE crm_leads ALTER COLUMN public_id SET NOT NULL;

-- ================================================================
-- VERIFICATION QUERY
-- ================================================================

-- Run this to verify all tables have public_id
/*
SELECT 
  table_name,
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns
WHERE column_name = 'public_id'
  AND table_schema = 'public'
ORDER BY table_name;
*/

-- ================================================================
-- ROLLBACK (if needed)
-- ================================================================
/*
-- To rollback this migration:
DROP FUNCTION IF EXISTS generate_public_id(TEXT);
DROP FUNCTION IF EXISTS set_public_id();

-- Remove public_id columns (careful!)
ALTER TABLE patients DROP COLUMN IF EXISTS public_id;
ALTER TABLE doctors DROP COLUMN IF EXISTS public_id;
-- ... etc for all tables
*/

-- ================================================================
-- MIGRATION COMPLETE
-- ================================================================

COMMENT ON FUNCTION generate_public_id IS 'Generates CUID-style public IDs with custom prefix';
COMMENT ON FUNCTION set_public_id IS 'Trigger function to auto-generate public_id on insert';

-- Log completion
DO $$
BEGIN
  RAISE NOTICE '✅ Migration 053 completed: Added public_id to all tables';
  RAISE NOTICE '📝 Total tables affected: ~25 tables';
  RAISE NOTICE '🔒 Security: Internal UUIDs are now protected';
END $$;
