-- Migration: Create Chatbot System Tables
-- Date: 2025-10-15
-- Description: Creates tables for chatbot intents, flows, conversations, and messages

-- Create chatbot_intents table
CREATE TABLE IF NOT EXISTS chatbot_intents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  public_id VARCHAR(255) UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  keywords TEXT[] DEFAULT '{}',
  response_template TEXT,
  action_type TEXT,
  priority INTEGER DEFAULT 1,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create chatbot_flows table
CREATE TABLE IF NOT EXISTS chatbot_flows (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  public_id VARCHAR(255) UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'inactive')),
  flow_data JSONB DEFAULT '{}',
  created_by UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create chatbot_conversations table
CREATE TABLE IF NOT EXISTS chatbot_conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  public_id VARCHAR(255) UNIQUE NOT NULL,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
  current_flow TEXT,
  current_step TEXT,
  context_data JSONB DEFAULT '{}',
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'abandoned')),
  started_at TIMESTAMP DEFAULT NOW(),
  last_activity TIMESTAMP DEFAULT NOW(),
  ended_at TIMESTAMP
);

-- Create chatbot_messages table
CREATE TABLE IF NOT EXISTS chatbot_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  public_id VARCHAR(255) UNIQUE NOT NULL,
  conversation_id UUID REFERENCES chatbot_conversations(id) ON DELETE CASCADE,
  message_type TEXT NOT NULL CHECK (message_type IN ('user', 'bot', 'system')),
  content TEXT NOT NULL,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create scheduled_reminders table
CREATE TABLE IF NOT EXISTS scheduled_reminders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  public_id VARCHAR(255) UNIQUE NOT NULL,
  appointment_id UUID REFERENCES appointments(id) ON DELETE CASCADE,
  reminder_type TEXT NOT NULL CHECK (reminder_type IN ('appointment', 'payment', 'follow_up', 'custom')),
  scheduled_for TIMESTAMP NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'failed', 'cancelled')),
  message_content TEXT,
  channels TEXT[] DEFAULT '{}',
  created_by UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  sent_at TIMESTAMP
);

-- Enable RLS on all tables
ALTER TABLE chatbot_intents ENABLE ROW LEVEL SECURITY;
ALTER TABLE chatbot_flows ENABLE ROW LEVEL SECURITY;
ALTER TABLE chatbot_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE chatbot_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE scheduled_reminders ENABLE ROW LEVEL SECURITY;

-- RLS policies for chatbot_intents (admin only)
CREATE POLICY "Admins can manage intents" ON chatbot_intents
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role = 'admin'
    )
  );

-- RLS policies for chatbot_flows (admin only)
CREATE POLICY "Admins can manage flows" ON chatbot_flows
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role = 'admin'
    )
  );

-- RLS policies for chatbot_conversations
CREATE POLICY "Users can view own conversations" ON chatbot_conversations
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create conversations" ON chatbot_conversations
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own conversations" ON chatbot_conversations
  FOR UPDATE USING (auth.uid() = user_id);

-- RLS policies for chatbot_messages
CREATE POLICY "Users can view messages in own conversations" ON chatbot_messages
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM chatbot_conversations 
      WHERE chatbot_conversations.id = chatbot_messages.conversation_id 
      AND chatbot_conversations.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create messages in own conversations" ON chatbot_messages
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM chatbot_conversations 
      WHERE chatbot_conversations.id = chatbot_messages.conversation_id 
      AND chatbot_conversations.user_id = auth.uid()
    )
  );

-- RLS policies for scheduled_reminders
CREATE POLICY "Users can view own reminders" ON scheduled_reminders
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM appointments 
      JOIN patients ON appointments.patient_id = patients.id
      WHERE appointments.id = scheduled_reminders.appointment_id 
      AND patients.user_id = auth.uid()
    )
  );

CREATE POLICY "Staff can manage all reminders" ON scheduled_reminders
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role IN ('staff', 'supervisor', 'admin')
    )
  );

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_chatbot_intents_name ON chatbot_intents(name);
CREATE INDEX IF NOT EXISTS idx_chatbot_intents_action_type ON chatbot_intents(action_type);
CREATE INDEX IF NOT EXISTS idx_chatbot_intents_is_active ON chatbot_intents(is_active);

CREATE INDEX IF NOT EXISTS idx_chatbot_flows_status ON chatbot_flows(status);
CREATE INDEX IF NOT EXISTS idx_chatbot_flows_created_by ON chatbot_flows(created_by);

CREATE INDEX IF NOT EXISTS idx_chatbot_conversations_user_id ON chatbot_conversations(user_id);
CREATE INDEX IF NOT EXISTS idx_chatbot_conversations_patient_id ON chatbot_conversations(patient_id);
CREATE INDEX IF NOT EXISTS idx_chatbot_conversations_status ON chatbot_conversations(status);
CREATE INDEX IF NOT EXISTS idx_chatbot_conversations_last_activity ON chatbot_conversations(last_activity);

CREATE INDEX IF NOT EXISTS idx_chatbot_messages_conversation_id ON chatbot_messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_chatbot_messages_message_type ON chatbot_messages(message_type);
CREATE INDEX IF NOT EXISTS idx_chatbot_messages_created_at ON chatbot_messages(created_at);

CREATE INDEX IF NOT EXISTS idx_scheduled_reminders_appointment_id ON scheduled_reminders(appointment_id);
CREATE INDEX IF NOT EXISTS idx_scheduled_reminders_scheduled_for ON scheduled_reminders(scheduled_for);
CREATE INDEX IF NOT EXISTS idx_scheduled_reminders_status ON scheduled_reminders(status);

-- Insert default intents
INSERT INTO chatbot_intents (public_id, name, description, keywords, response_template, action_type, priority) VALUES
('INTENT-001', 'حجز موعد', 'نية حجز المواعيد', ARRAY['موعد', 'حجز', 'تحديد', 'appointment', 'book'], 'أريد حجز موعد مع طبيب', 'create_appointment', 1),
('INTENT-002', 'استفسار الدفع', 'نية استفسارات الدفع', ARRAY['دفع', 'فاتورة', 'payment', 'bill'], 'أريد معرفة تفاصيل الدفع', 'payment_info', 2),
('INTENT-003', 'استفسار التأمين', 'نية استفسارات التأمين', ARRAY['تأمين', 'مطالبة', 'insurance', 'claim'], 'أريد معرفة حالة مطالبة التأمين', 'insurance_info', 2),
('INTENT-004', 'تذكير', 'نية إعداد التذكيرات', ARRAY['تذكير', 'reminder', 'تذكيرني'], 'أريد تذكير بالموعد', 'send_reminder', 3),
('INTENT-005', 'استفسار عام', 'نية الاستفسارات العامة', ARRAY['معلومات', 'سؤال', 'help', 'info'], 'أريد مساعدة', 'general_info', 4),
('INTENT-006', 'تحية', 'نية التحية', ARRAY['مرحبا', 'أهلا', 'hello', 'hi'], 'مرحبا', 'greeting', 5)
ON CONFLICT (public_id) DO NOTHING;

-- Add comments
COMMENT ON TABLE chatbot_intents IS 'Chatbot intent recognition patterns and responses';
COMMENT ON TABLE chatbot_flows IS 'Conversation flows and step-by-step interactions';
COMMENT ON TABLE chatbot_conversations IS 'User conversation sessions with the chatbot';
COMMENT ON TABLE chatbot_messages IS 'Individual messages within conversations';
COMMENT ON TABLE scheduled_reminders IS 'Scheduled reminder notifications';
COMMENT ON COLUMN chatbot_flows.flow_data IS 'JSON structure defining conversation steps and logic';
COMMENT ON COLUMN chatbot_conversations.context_data IS 'Conversation context and collected data';
COMMENT ON COLUMN chatbot_messages.metadata IS 'Message metadata including actions and entities';