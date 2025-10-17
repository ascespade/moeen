-- create users and roles
CREATE TABLE IF NOT EXISTS users (id serial primary key, email text unique, password_hash text, role text, meta jsonb, created_at timestamptz default now());
CREATE TABLE IF NOT EXISTS roles (role text primary key, description text);
INSERT INTO roles (role, description) VALUES ('patient',''),('doctor',''),('staff',''),('supervisor',''),('admin','') ON CONFLICT DO NOTHING;
