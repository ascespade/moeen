-- create users and roles
CREATE TABLE IF NOT EXISTS users (
  id serial primary key, 
  email text unique, 
  password_hash text, 
  role text, 
  meta jsonb, 
  created_at timestamptz default now()
);

CREATE TABLE IF NOT EXISTS roles (
  role text primary key, 
  description text
);

INSERT INTO roles (role, description) VALUES 
  ('patient','Patient role with access to personal dashboard and appointment booking'),
  ('doctor','Doctor role with access to patient records and appointment management'),
  ('staff','Staff role with access to patient registration and payment processing'),
  ('supervisor','Supervisor role with access to staff management and reports'),
  ('admin','Admin role with full system access and configuration')
ON CONFLICT DO NOTHING;