-- Migration: Create Chatbot System Tables
-- ????? ????? ???? ????? ??? "????"

-- Chatbot Configuration Table
-- ???? ??????? ????? ???
CREATE TABLE IF NOT EXISTS chatbot_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL DEFAULT '????',
  personality_type VARCHAR(50) NOT NULL DEFAULT 'professional_friendly',
  tone VARCHAR(50) NOT NULL DEFAULT 'warm_caring',
  language VARCHAR(10) NOT NULL DEFAULT 'ar',
  response_style TEXT,
  max_context_length INTEGER DEFAULT 4096,
  temperature DECIMAL(3,2) DEFAULT 0.7,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Chatbot Prompts Table
-- ???? ?????????? ????????
CREATE TABLE IF NOT EXISTS chatbot_prompts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category VARCHAR(100) NOT NULL,
  scenario VARCHAR(200) NOT NULL,
  system_prompt TEXT NOT NULL,
  user_prompt_template TEXT,
  context_required TEXT[],
  response_format JSONB,
  priority INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Chatbot Knowledge Base
-- ????? ???????? ????????
CREATE TABLE IF NOT EXISTS chatbot_knowledge_base (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category VARCHAR(100) NOT NULL,
  title VARCHAR(200) NOT NULL,
  content TEXT NOT NULL,
  keywords TEXT[],
  related_topics TEXT[],
  source VARCHAR(200),
  language VARCHAR(10) DEFAULT 'ar',
  relevance_score DECIMAL(5,2) DEFAULT 1.0,
  usage_count INTEGER DEFAULT 0,
  last_used TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Chatbot Conversations
-- ??????? ????? ???
CREATE TABLE IF NOT EXISTS chatbot_conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  user_type VARCHAR(50),
  session_id VARCHAR(255) NOT NULL,
  status VARCHAR(50) DEFAULT 'active',
  context JSONB,
  metadata JSONB,
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_message_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  ended_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Chatbot Messages
-- ????? ????? ???
CREATE TABLE IF NOT EXISTS chatbot_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID REFERENCES chatbot_conversations(id) ON DELETE CASCADE,
  role VARCHAR(20) NOT NULL, -- 'user' | 'assistant' | 'system'
  content TEXT NOT NULL,
  intent VARCHAR(100),
  entities JSONB,
  confidence DECIMAL(5,2),
  context_used JSONB,
  response_time_ms INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Chatbot Learning Data
-- ?????? ??????
CREATE TABLE IF NOT EXISTS chatbot_learning (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID REFERENCES chatbot_conversations(id),
  message_id UUID REFERENCES chatbot_messages(id),
  user_feedback VARCHAR(20), -- 'positive' | 'negative' | 'neutral'
  correction TEXT,
  pattern_detected TEXT,
  improvement_suggestion TEXT,
  learned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Chatbot Appointment Flows
-- ?????? ??? ????????
CREATE TABLE IF NOT EXISTS chatbot_appointment_flows (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  flow_name VARCHAR(200) NOT NULL,
  flow_type VARCHAR(50) NOT NULL, -- 'booking' | 'reschedule' | 'cancel' | 'reminder'
  steps JSONB NOT NULL,
  validation_rules JSONB,
  success_criteria JSONB,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Chatbot Scheduled Tasks
-- ?????? ????????
CREATE TABLE IF NOT EXISTS chatbot_scheduled_tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_type VARCHAR(100) NOT NULL, -- 'reminder' | 'followup' | 'checkin'
  user_id UUID REFERENCES users(id),
  appointment_id UUID,
  scheduled_for TIMESTAMP WITH TIME ZONE NOT NULL,
  message_template TEXT,
  status VARCHAR(50) DEFAULT 'pending',
  sent_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_chatbot_conversations_user ON chatbot_conversations(user_id);
CREATE INDEX IF NOT EXISTS idx_chatbot_conversations_session ON chatbot_conversations(session_id);
CREATE INDEX IF NOT EXISTS idx_chatbot_messages_conversation ON chatbot_messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_chatbot_knowledge_category ON chatbot_knowledge_base(category);
CREATE INDEX IF NOT EXISTS idx_chatbot_knowledge_keywords ON chatbot_knowledge_base USING GIN(keywords);
CREATE INDEX IF NOT EXISTS idx_chatbot_scheduled_tasks_scheduled ON chatbot_scheduled_tasks(scheduled_for) WHERE status = 'pending';

-- Insert default chatbot configuration
INSERT INTO chatbot_config (name, personality_type, tone, language, response_style)
VALUES (
  '????',
  'professional_friendly',
  'warm_caring',
  'ar',
  '??? ????? ????? ??? ???? ?? ???? ?????. ????? ?????? ????? ??????? ????? ??? ??? ???????? ?? ??? ????? ?????? ????? ??????. ?????? ??? ????? ????? ?????? ?????? ????????.'
)
ON CONFLICT DO NOTHING;
