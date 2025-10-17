-- patients, doctors, appointments
CREATE TABLE IF NOT EXISTS patients (id serial primary key, user_id int references users(id), full_name text, dob date, phone text, insurance_provider text, insurance_number text, activated boolean default false, created_at timestamptz default now());
CREATE TABLE IF NOT EXISTS doctors (id serial primary key, user_id int references users(id), speciality text, schedule jsonb, created_at timestamptz default now());
CREATE TABLE IF NOT EXISTS appointments (id serial primary key, patient_id int references patients(id), doctor_id int references doctors(id), scheduled_at timestamptz, status text default 'pending', payment_status text default 'unpaid', created_at timestamptz default now());
