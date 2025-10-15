-- Performance Optimization Migration
-- Created: 2025-10-15
-- Description: Add performance indexes and optimize database schema

-- Create performance indexes for users table
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_status ON users(status);

-- Create performance indexes for patients table
CREATE INDEX IF NOT EXISTS idx_patients_customer_id ON patients(customer_id);
CREATE INDEX IF NOT EXISTS idx_patients_public_id ON patients(public_id);
CREATE INDEX IF NOT EXISTS idx_patients_email ON patients(email);

-- Create composite indexes for appointments
CREATE INDEX IF NOT EXISTS idx_appointments_patient_date ON appointments(patient_id, appointment_date);
CREATE INDEX IF NOT EXISTS idx_appointments_doctor_date ON appointments(doctor_id, appointment_date);
CREATE INDEX IF NOT EXISTS idx_appointments_status ON appointments(status);
CREATE INDEX IF NOT EXISTS idx_appointments_date_status ON appointments(appointment_date, status);

-- Create indexes for chatbot tables
CREATE INDEX IF NOT EXISTS idx_chatbot_conversations_whatsapp ON chatbot_conversations(whatsapp_number);
CREATE INDEX IF NOT EXISTS idx_chatbot_conversations_state ON chatbot_conversations(conversation_state);
CREATE INDEX IF NOT EXISTS idx_chatbot_conversations_created ON chatbot_conversations(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_chatbot_messages_conversation_created ON chatbot_messages(conversation_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_chatbot_messages_sender ON chatbot_messages(sender_type);
CREATE INDEX IF NOT EXISTS idx_chatbot_intents_active ON chatbot_intents(is_active) WHERE is_active = true;

-- Create indexes for conversations table
CREATE INDEX IF NOT EXISTS idx_conversations_status_assigned ON conversations(status, assigned_to);
CREATE INDEX IF NOT EXISTS idx_conversations_channel ON conversations(channel);
CREATE INDEX IF NOT EXISTS idx_conversations_customer ON conversations(customer_id);
CREATE INDEX IF NOT EXISTS idx_conversations_created ON conversations(created_at DESC);

-- Create indexes for messages table
CREATE INDEX IF NOT EXISTS idx_messages_conversation_created ON messages(conversation_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_messages_sender ON messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_status ON messages(message_status);

-- Create indexes for CRM tables
CREATE INDEX IF NOT EXISTS idx_crm_leads_owner ON crm_leads(owner_id);
CREATE INDEX IF NOT EXISTS idx_crm_leads_status ON crm_leads(status);
CREATE INDEX IF NOT EXISTS idx_crm_deals_owner ON crm_deals(owner_id);
CREATE INDEX IF NOT EXISTS idx_crm_deals_stage ON crm_deals(stage);
CREATE INDEX IF NOT EXISTS idx_crm_activities_owner_status ON crm_activities(owner_id, status);

-- Create indexes for sessions table
CREATE INDEX IF NOT EXISTS idx_sessions_patient ON sessions(patient_id);
CREATE INDEX IF NOT EXISTS idx_sessions_doctor ON sessions(doctor_id);
CREATE INDEX IF NOT EXISTS idx_sessions_date ON sessions(session_date);

-- Create indexes for insurance claims
CREATE INDEX IF NOT EXISTS idx_insurance_claims_patient ON insurance_claims(patient_id);
CREATE INDEX IF NOT EXISTS idx_insurance_claims_status ON insurance_claims(status);

-- Create indexes for doctors table
CREATE INDEX IF NOT EXISTS idx_doctors_user_id ON doctors(user_id);
CREATE INDEX IF NOT EXISTS idx_doctors_specialization ON doctors(specialization);

-- Add trigger for automatic timestamp updates
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply triggers to tables with updated_at columns
DO $$
DECLARE
    t text;
BEGIN
    FOR t IN 
        SELECT tablename FROM pg_tables 
        WHERE schemaname = 'public' 
        AND tablename IN ('users', 'patients', 'doctors', 'appointments', 'sessions', 
                         'chatbot_conversations', 'conversations', 'crm_leads', 
                         'crm_deals', 'crm_activities', 'settings')
    LOOP
        EXECUTE format('DROP TRIGGER IF EXISTS update_%s_updated_at ON %I', t, t);
        EXECUTE format('CREATE TRIGGER update_%s_updated_at 
                        BEFORE UPDATE ON %I 
                        FOR EACH ROW 
                        EXECUTE FUNCTION update_updated_at_column()', t, t);
    END LOOP;
END;
$$;

-- Create database views for common queries
CREATE OR REPLACE VIEW v_active_appointments AS
SELECT 
    a.id,
    a.appointment_date,
    a.appointment_time,
    a.status,
    p.first_name || ' ' || p.last_name AS patient_name,
    p.phone AS patient_phone,
    d.first_name || ' ' || d.last_name AS doctor_name,
    d.specialization
FROM appointments a
JOIN patients p ON a.patient_id = p.id
JOIN doctors d ON a.doctor_id = d.id
WHERE a.status IN ('scheduled', 'confirmed')
AND a.appointment_date >= CURRENT_DATE
ORDER BY a.appointment_date, a.appointment_time;

CREATE OR REPLACE VIEW v_recent_conversations AS
SELECT 
    c.id,
    c.customer_name,
    c.customer_phone,
    c.status,
    c.channel,
    c.created_at,
    u.name AS assigned_to_name,
    (SELECT COUNT(*) FROM messages m WHERE m.conversation_id = c.id AND m.message_status = 'sent') AS unread_count
FROM conversations c
LEFT JOIN users u ON c.assigned_to = u.id
WHERE c.status IN ('active', 'pending')
ORDER BY c.created_at DESC
LIMIT 100;

-- Optimize RLS policies for better performance
-- Add comments for documentation
COMMENT ON INDEX idx_appointments_patient_date IS 'Composite index for patient appointment lookups';
COMMENT ON INDEX idx_conversations_status_assigned IS 'Composite index for conversation filtering and assignment';
COMMENT ON INDEX idx_messages_conversation_created IS 'Optimized for message history queries';

-- Log completion
INSERT INTO audit_logs (public_id, action, table_name, new_values) VALUES
('aud_perf_indexes_' || TO_CHAR(NOW(), 'YYYYMMDD'), 'performance_optimization', 'multiple_tables', 
 jsonb_build_object('status', 'completed', 'timestamp', NOW(), 'indexes_created', 30))
ON CONFLICT DO NOTHING;

SELECT 'Performance optimization migration completed successfully' as result;
