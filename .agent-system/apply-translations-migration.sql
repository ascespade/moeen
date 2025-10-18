-- Create languages table
CREATE TABLE IF NOT EXISTS languages (
  code TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  is_default BOOLEAN DEFAULT false,
  direction TEXT DEFAULT 'rtl',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create translations table
CREATE TABLE IF NOT EXISTS translations (
  id SERIAL PRIMARY KEY,
  lang_code TEXT REFERENCES languages(code) ON DELETE CASCADE,
  key TEXT NOT NULL,
  value TEXT NOT NULL,
  namespace TEXT DEFAULT 'common',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(lang_code, key, namespace)
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_translations_lookup ON translations(lang_code, namespace, key);

-- Insert default languages
INSERT INTO languages (code, name, is_default, direction) VALUES
  ('ar', 'العربية', true, 'rtl'),
  ('en', 'English', false, 'ltr')
ON CONFLICT (code) DO NOTHING;

COMMENT ON TABLE translations IS 'Multi-language translations for the application';
COMMENT ON COLUMN translations.namespace IS 'Translation namespace (e.g. common, auth, dashboard)';
