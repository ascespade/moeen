-- Initial Database Schema for Hemam Center
-- This migration creates all necessary tables for the production system

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create custom types
CREATE TYPE user_role AS ENUM ('admin', 'doctor', 'therapist', 'patient', 'family_member');
CREATE TYPE appointment_status AS ENUM ('scheduled', 'confirmed', 'in_progress', 'completed', 'cancelled', 'no_show');
CREATE TYPE session_type AS ENUM ('assessment', 'treatment', 'follow_up', 'consultation');
CREATE TYPE message_type AS ENUM ('text', 'template', 'image', 'document', 'audio', 'video');
CREATE TYPE crisis_level AS ENUM ('normal', 'urgent', 'crisis');
CREATE TYPE notification_priority AS ENUM ('low', 'medium', 'high', 'critical');

-- Users table (extends Supabase auth.users)
CREATE TABLE public.users (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    national_id VARCHAR(10) UNIQUE,
    name VARCHAR(255) NOT NULL,
    name_en VARCHAR(255),
    age INTEGER,
    gender VARCHAR(10) CHECK (gender IN ('male', 'female')),
    phone VARCHAR(20) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE,
    role user_role NOT NULL DEFAULT 'patient',
    avatar_url TEXT,
    address TEXT,
    city VARCHAR(100),
    emergency_contact VARCHAR(20),
    emergency_contact_relation VARCHAR(100),
    insurance_provider VARCHAR(100),
    insurance_number VARCHAR(50),
    medical_history TEXT[],
    current_conditions TEXT[],
    medications TEXT[],
    allergies TEXT[],
    preferred_language VARCHAR(5) DEFAULT 'ar',
    timezone VARCHAR(50) DEFAULT 'Asia/Riyadh',
    is_active BOOLEAN DEFAULT true,
    last_login TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Doctors table
CREATE TABLE public.doctors (
    id UUID REFERENCES public.users(id) ON DELETE CASCADE PRIMARY KEY,
    license_number VARCHAR(50) UNIQUE NOT NULL,
    specialty VARCHAR(255) NOT NULL,
    qualifications TEXT[],
    experience_years INTEGER DEFAULT 0,
    consultation_fee DECIMAL(10,2),
    is_available BOOLEAN DEFAULT true,
    working_hours JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Patients table
CREATE TABLE public.patients (
    id UUID REFERENCES public.users(id) ON DELETE CASCADE PRIMARY KEY,
    guardian_name VARCHAR(255),
    guardian_relation VARCHAR(100),
    guardian_phone VARCHAR(20),
    medical_conditions TEXT[],
    treatment_goals TEXT[],
    assigned_doctor_id UUID REFERENCES public.doctors(id),
    assigned_therapist_id UUID REFERENCES public.users(id),
    admission_date DATE,
    discharge_date DATE,
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Family members table
CREATE TABLE public.family_members (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    patient_id UUID REFERENCES public.patients(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    relationship VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(255),
    is_primary_contact BOOLEAN DEFAULT false,
    notifications_enabled BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Appointments table
CREATE TABLE public.appointments (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    patient_id UUID REFERENCES public.patients(id) ON DELETE CASCADE,
    doctor_id UUID REFERENCES public.doctors(id) ON DELETE CASCADE,
    appointment_date DATE NOT NULL,
    appointment_time TIME NOT NULL,
    duration_minutes INTEGER DEFAULT 60,
    type session_type NOT NULL,
    status appointment_status DEFAULT 'scheduled',
    notes TEXT,
    insurance_covered BOOLEAN DEFAULT false,
    insurance_approval_number VARCHAR(100),
    created_by UUID REFERENCES public.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Sessions table
CREATE TABLE public.sessions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    patient_id UUID REFERENCES public.patients(id) ON DELETE CASCADE,
    doctor_id UUID REFERENCES public.doctors(id) ON DELETE CASCADE,
    appointment_id UUID REFERENCES public.appointments(id),
    session_date DATE NOT NULL,
    session_time TIME NOT NULL,
    duration_minutes INTEGER DEFAULT 60,
    type session_type NOT NULL,
    notes TEXT,
    exercises JSONB,
    completed BOOLEAN DEFAULT false,
    insurance_claim_number VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Conversations table
CREATE TABLE public.conversations (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    patient_id UUID REFERENCES public.patients(id) ON DELETE CASCADE,
    session_id VARCHAR(255),
    message_type message_type NOT NULL,
    content TEXT NOT NULL,
    response TEXT,
    sentiment VARCHAR(50),
    crisis_level crisis_level DEFAULT 'normal',
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Message templates table
CREATE TABLE public.message_templates (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL,
    category VARCHAR(100) NOT NULL,
    content TEXT NOT NULL,
    variables TEXT[],
    language VARCHAR(5) DEFAULT 'ar',
    approved BOOLEAN DEFAULT false,
    created_by UUID REFERENCES public.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Notifications table
CREATE TABLE public.notifications (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL,
    priority notification_priority DEFAULT 'medium',
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    data JSONB,
    is_read BOOLEAN DEFAULT false,
    sent_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insurance claims table
CREATE TABLE public.insurance_claims (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    patient_id UUID REFERENCES public.patients(id) ON DELETE CASCADE,
    appointment_id UUID REFERENCES public.appointments(id),
    session_id UUID REFERENCES public.sessions(id),
    insurance_provider VARCHAR(100) NOT NULL,
    claim_number VARCHAR(100) UNIQUE NOT NULL,
    service_code VARCHAR(50),
    diagnosis_code VARCHAR(50),
    amount DECIMAL(10,2) NOT NULL,
    status VARCHAR(50) DEFAULT 'pending',
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    processed_at TIMESTAMP WITH TIME ZONE,
    rejection_reason TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Center settings table
CREATE TABLE public.center_settings (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    key VARCHAR(100) UNIQUE NOT NULL,
    value JSONB NOT NULL,
    description TEXT,
    updated_by UUID REFERENCES public.users(id),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Audit log table
CREATE TABLE public.audit_logs (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id),
    action VARCHAR(100) NOT NULL,
    table_name VARCHAR(100),
    record_id UUID,
    old_values JSONB,
    new_values JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_users_phone ON public.users(phone);
CREATE INDEX idx_users_email ON public.users(email);
CREATE INDEX idx_users_role ON public.users(role);
CREATE INDEX idx_patients_doctor ON public.patients(assigned_doctor_id);
CREATE INDEX idx_appointments_date ON public.appointments(appointment_date);
CREATE INDEX idx_appointments_patient ON public.appointments(patient_id);
CREATE INDEX idx_appointments_doctor ON public.appointments(doctor_id);
CREATE INDEX idx_appointments_status ON public.appointments(status);
CREATE INDEX idx_sessions_patient ON public.sessions(patient_id);
CREATE INDEX idx_sessions_doctor ON public.sessions(doctor_id);
CREATE INDEX idx_sessions_date ON public.sessions(session_date);
CREATE INDEX idx_conversations_patient ON public.conversations(patient_id);
CREATE INDEX idx_conversations_crisis ON public.conversations(crisis_level);
CREATE INDEX idx_notifications_user ON public.notifications(user_id);
CREATE INDEX idx_notifications_read ON public.notifications(is_read);
CREATE INDEX idx_insurance_claims_patient ON public.insurance_claims(patient_id);
CREATE INDEX idx_insurance_claims_status ON public.insurance_claims(status);
CREATE INDEX idx_audit_logs_user ON public.audit_logs(user_id);
CREATE INDEX idx_audit_logs_action ON public.audit_logs(action);
CREATE INDEX idx_audit_logs_created ON public.audit_logs(created_at);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_doctors_updated_at BEFORE UPDATE ON public.doctors FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_patients_updated_at BEFORE UPDATE ON public.patients FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_appointments_updated_at BEFORE UPDATE ON public.appointments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_sessions_updated_at BEFORE UPDATE ON public.sessions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_message_templates_updated_at BEFORE UPDATE ON public.message_templates FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_insurance_claims_updated_at BEFORE UPDATE ON public.insurance_claims FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create RLS (Row Level Security) policies
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.doctors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.family_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.insurance_claims ENABLE ROW LEVEL SECURITY;

-- Users can read their own data
CREATE POLICY "Users can read own data" ON public.users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own data" ON public.users FOR UPDATE USING (auth.uid() = id);

-- Doctors can read their patients
CREATE POLICY "Doctors can read their patients" ON public.patients FOR SELECT USING (
    assigned_doctor_id = auth.uid() OR 
    EXISTS (
        SELECT 1 FROM public.appointments 
        WHERE patient_id = patients.id AND doctor_id = auth.uid()
    )
);

-- Patients can read their own data
CREATE POLICY "Patients can read own data" ON public.patients FOR SELECT USING (id = auth.uid());

-- Family members can read their patient's data
CREATE POLICY "Family members can read patient data" ON public.patients FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM public.family_members 
        WHERE patient_id = patients.id AND phone = (
            SELECT phone FROM public.users WHERE id = auth.uid()
        )
    )
);

-- Appointments policies
CREATE POLICY "Users can read their appointments" ON public.appointments FOR SELECT USING (
    patient_id = auth.uid() OR doctor_id = auth.uid()
);

CREATE POLICY "Doctors can manage appointments" ON public.appointments FOR ALL USING (
    doctor_id = auth.uid() OR 
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
);

-- Sessions policies
CREATE POLICY "Users can read their sessions" ON public.sessions FOR SELECT USING (
    patient_id = auth.uid() OR doctor_id = auth.uid()
);

CREATE POLICY "Doctors can manage sessions" ON public.sessions FOR ALL USING (
    doctor_id = auth.uid() OR 
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
);

-- Conversations policies
CREATE POLICY "Users can read their conversations" ON public.conversations FOR SELECT USING (
    patient_id = auth.uid() OR 
    EXISTS (
        SELECT 1 FROM public.patients 
        WHERE id = conversations.patient_id AND assigned_doctor_id = auth.uid()
    )
);

-- Notifications policies
CREATE POLICY "Users can read their notifications" ON public.notifications FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can update their notifications" ON public.notifications FOR UPDATE USING (user_id = auth.uid());

-- Insurance claims policies
CREATE POLICY "Users can read their insurance claims" ON public.insurance_claims FOR SELECT USING (
    patient_id = auth.uid() OR 
    EXISTS (
        SELECT 1 FROM public.patients 
        WHERE id = insurance_claims.patient_id AND assigned_doctor_id = auth.uid()
    )
);

-- Insert default center settings
INSERT INTO public.center_settings (key, value, description) VALUES
('center_name', '"مركز الهمم"', 'اسم المركز'),
('center_phone', '"+966501234567"', 'رقم هاتف المركز'),
('center_email', '"info@alhemam.sa"', 'بريد المركز الإلكتروني'),
('center_address', '{"city": "جدة", "district": "حي الصفا", "street": "شارع الأمير محمد بن عبدالعزيز"}', 'عنوان المركز'),
('working_hours', '{"start": "08:00", "end": "20:00", "days": ["sunday", "monday", "tuesday", "wednesday", "thursday"]}', 'ساعات العمل'),
('emergency_contacts', '["997", "911", "+966501234567"]', 'أرقام الطوارئ'),
('whatsapp_number', '"+966501234567"', 'رقم واتساب المركز'),
('insurance_providers', '["التعاونية", "بوبا العربية", "ميدغلف", "أكسا"]', 'شركات التأمين المتعاقدة');

-- Insert default message templates
INSERT INTO public.message_templates (name, category, content, variables, language, approved) VALUES
('appointment_confirmation', 'appointment', 'مرحباً {{name}}، تم تأكيد موعدك في مركز الهمم بتاريخ {{date}} في الساعة {{time}}. ننتظرك!', '["name", "date", "time"]', 'ar', true),
('appointment_reminder', 'reminder', 'تذكير: لديك موعد غداً في مركز الهمم في الساعة {{time}}. نتمنى لك يوم سعيد!', '["time"]', 'ar', true),
('daily_motivation', 'motivational', 'صباح الخير {{name}}! نتمنى لك يوماً مليئاً بالهمة والإنجاز. تذكر أن كل خطوة هي تقدم نحو هدفك. فريق مركز الهمم معك دائماً!', '["name"]', 'ar', true),
('milestone_celebration', 'motivational', 'تهانينا الحارة {{name}}! لقد أكملت بنجاح {{milestone}}. نحن في مركز الهمم فخورون جداً بإصرارك وهمتك العالية. إلى الأمام دائماً!', '["name", "milestone"]', 'ar', true),
('exercise_reminder', 'educational', 'يا {{name}}، اليوم لديك تمرين {{exercise}} في خطتك. هل أنت مستعد؟ يمكنك الرد بـ: 👍 نعم، أتممته | 💬 أحتاج مساعدة | ⏰ سأقوم به لاحقاً', '["name", "exercise"]', 'ar', true),
('crisis_support', 'crisis', 'أرى أنك قد تحتاج لمساعدة عاجلة. يرجى الاتصال فوراً بالرقم 997 أو 911. نحن هنا لمساعدتك في هذه اللحظة الصعبة.', '[]', 'ar', true);