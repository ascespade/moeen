-- Migration: Fix translations table constraints and indexes
-- Priority: CRITICAL
-- Date: 2025-11-01
-- Description: Adds missing namespace column, unique constraints, and indexes to translations table

-- Add missing namespace column
ALTER TABLE translations ADD COLUMN IF NOT EXISTS namespace VARCHAR(100) DEFAULT 'common';

-- Add unique constraint to prevent duplicates
-- This ensures no duplicate translations for the same language, namespace, and key
ALTER TABLE translations ADD CONSTRAINT translations_lang_key_unique UNIQUE(lang_code, namespace, key);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_translations_lang_code ON translations(lang_code);
CREATE INDEX IF NOT EXISTS idx_translations_lang_ns_key ON translations(lang_code, namespace, key);

-- Fix foreign key cascade behavior
-- Ensures translations are deleted when the referenced language is deleted
ALTER TABLE translations DROP CONSTRAINT IF EXISTS translations_lang_code_fkey;
ALTER TABLE translations ADD CONSTRAINT translations_lang_code_fkey 
    FOREIGN KEY (lang_code) REFERENCES languages(code) ON DELETE CASCADE;

-- Add comment for documentation
COMMENT ON COLUMN translations.namespace IS 'Namespace for organizing translations (e.g., common, auth, dashboard)';
COMMENT ON CONSTRAINT translations_lang_key_unique ON translations IS 'Prevents duplicate translations for the same language, namespace, and key';
