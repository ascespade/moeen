-- Migration: Create Patients, Doctors, and Appointments System
-- Date: 2025-10-15
-- Description: Creates healthcare-specific tables for patients, doctors, and appointments

-- Create patients table
CREATE TABLE IF NOT EXISTS patients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  public_id VARCHAR(255) UNIQUE NOT NULL,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  dob DATE,
  phone TEXT,
  insurance_provider TEXT,
  insurance_number TEXT,
  activated BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create doctors table
CREATE TABLE IF NOT EXISTS doctors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  public_id VARCHAR(255) UNIQUE NOT NULL,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  speciality TEXT,
  schedule JSONB DEFAULT '{}',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create appointments table
CREATE TABLE IF NOT EXISTS appointments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  public_id VARCHAR(255) UNIQUE NOT NULL,
  patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
  doctor_id UUID REFERENCES doctors(id) ON DELETE CASCADE,
  scheduled_at TIMESTAMP,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'in_progress', 'completed', 'cancelled', 'no_show')),
  payment_status TEXT DEFAULT 'unpaid' CHECK (payment_status IN ('unpaid', 'paid', 'pending', 'refunded')),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Enable RLS on all tables
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE doctors ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;

-- RLS policies for patients
CREATE POLICY "Patients can view own data" ON patients
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Doctors can view assigned patients" ON patients
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM appointments 
      WHERE appointments.patient_id = patients.id 
      AND appointments.doctor_id IN (
        SELECT id FROM doctors WHERE user_id = auth.uid()
      )
    )
  );

CREATE POLICY "Staff can view all patients" ON patients
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role IN ('staff', 'supervisor', 'admin')
    )
  );

-- RLS policies for doctors
CREATE POLICY "Doctors can view own profile" ON doctors
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Staff can view all doctors" ON doctors
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role IN ('staff', 'supervisor', 'admin')
    )
  );

-- RLS policies for appointments
CREATE POLICY "Patients can view own appointments" ON appointments
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM patients 
      WHERE patients.id = appointments.patient_id 
      AND patients.user_id = auth.uid()
    )
  );

CREATE POLICY "Doctors can view assigned appointments" ON appointments
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM doctors 
      WHERE doctors.id = appointments.doctor_id 
      AND doctors.user_id = auth.uid()
    )
  );

CREATE POLICY "Staff can view all appointments" ON appointments
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role IN ('staff', 'supervisor', 'admin')
    )
  );

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_patients_user_id ON patients(user_id);
CREATE INDEX IF NOT EXISTS idx_patients_public_id ON patients(public_id);
CREATE INDEX IF NOT EXISTS idx_patients_activated ON patients(activated);
CREATE INDEX IF NOT EXISTS idx_patients_created_at ON patients(created_at);

CREATE INDEX IF NOT EXISTS idx_doctors_user_id ON doctors(user_id);
CREATE INDEX IF NOT EXISTS idx_doctors_public_id ON doctors(public_id);
CREATE INDEX IF NOT EXISTS idx_doctors_speciality ON doctors(speciality);

CREATE INDEX IF NOT EXISTS idx_appointments_patient_id ON appointments(patient_id);
CREATE INDEX IF NOT EXISTS idx_appointments_doctor_id ON appointments(doctor_id);
CREATE INDEX IF NOT EXISTS idx_appointments_scheduled_at ON appointments(scheduled_at);
CREATE INDEX IF NOT EXISTS idx_appointments_status ON appointments(status);
CREATE INDEX IF NOT EXISTS idx_appointments_payment_status ON appointments(payment_status);

-- Add comments
COMMENT ON TABLE patients IS 'Patient records with personal and insurance information';
COMMENT ON TABLE doctors IS 'Doctor profiles with speciality and schedule information';
COMMENT ON TABLE appointments IS 'Appointment bookings linking patients and doctors';
COMMENT ON COLUMN patients.activated IS 'Whether patient file is activated after first visit';
COMMENT ON COLUMN appointments.payment_status IS 'Payment status for the appointment';
