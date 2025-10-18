-- Update translations table to use string ID instead of bigint
-- This allows CUID to work properly

-- First, drop the existing table if it exists
DROP TABLE IF EXISTS public.translations CASCADE;

-- Create the new table with string ID
CREATE TABLE public.translations (
  id TEXT PRIMARY KEY,
  locale TEXT NOT NULL CHECK (locale IN ('ar','en')),
  namespace TEXT NOT NULL DEFAULT 'common',
  key TEXT NOT NULL,
  value TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(locale, namespace, key)
);

-- Enable RLS
ALTER TABLE public.translations ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Allow read to anon" ON public.translations
  FOR SELECT USING (true);

CREATE POLICY "Service write" ON public.translations
  FOR ALL USING (auth.role() = 'service_role') WITH CHECK (auth.role() = 'service_role');

-- Create indexes for better performance
CREATE INDEX idx_translations_locale ON public.translations(locale);
CREATE INDEX idx_translations_namespace ON public.translations(namespace);
CREATE INDEX idx_translations_key ON public.translations(key);
CREATE INDEX idx_translations_locale_namespace ON public.translations(locale, namespace);
