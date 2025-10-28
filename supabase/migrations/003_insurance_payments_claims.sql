-- insurance and payments
CREATE TABLE IF NOT EXISTS insurance_claims (id serial primary key, patient_id int references patients(id), appointment_id int references appointments(id), provider text, claim_status text default 'draft', claim_payload jsonb, created_at timestamptz default now());
CREATE TABLE IF NOT EXISTS payments (id serial primary key, appointment_id int references appointments(id), amount numeric, currency text, method text, status text default 'pending', meta jsonb, created_at timestamptz default now());
