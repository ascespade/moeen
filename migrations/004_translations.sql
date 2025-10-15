-- translations
CREATE TABLE IF NOT EXISTS languages (
  id serial primary key, 
  code text unique, 
  name text, 
  is_default boolean default false, 
  direction text default 'rtl'
);

CREATE TABLE IF NOT EXISTS translations (
  id serial primary key, 
  lang_code text references languages(code), 
  key text, 
  value text, 
  created_at timestamptz default now()
);

-- Insert default languages
INSERT INTO languages (code, name, is_default, direction) VALUES 
  ('ar', 'العربية', true, 'rtl'),
  ('en', 'English', false, 'ltr')
ON CONFLICT (code) DO NOTHING;