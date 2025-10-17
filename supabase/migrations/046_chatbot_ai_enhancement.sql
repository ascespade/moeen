-- ================================================================
-- 🤖 CHATBOT & AI MODULE ENHANCEMENT
-- ================================================================

-- Enhance chatbot_conversations
ALTER TABLE chatbot_conversations
  ADD COLUMN IF NOT EXISTS created_by UUID,
  ADD COLUMN IF NOT EXISTS updated_by UUID,
  ADD COLUMN IF NOT EXISTS last_activity_at TIMESTAMPTZ DEFAULT NOW(),
  ADD COLUMN IF NOT EXISTS sentiment_score NUMERIC(3,2),
  ADD COLUMN IF NOT EXISTS satisfaction_score INTEGER,
  ADD COLUMN IF NOT EXISTS resolved BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS resolution_time INTEGER,
  ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- Enhance chatbot_messages
ALTER TABLE chatbot_messages
  ADD COLUMN IF NOT EXISTS created_by UUID,
  ADD COLUMN IF NOT EXISTS confidence_score NUMERIC(3,2),
  ADD COLUMN IF NOT EXISTS response_time_ms INTEGER,
  ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- Indexes
CREATE INDEX IF NOT EXISTS idx_chatbot_conversations_sentiment ON chatbot_conversations(sentiment_score);
CREATE INDEX IF NOT EXISTS idx_chatbot_conversations_resolved ON chatbot_conversations(resolved);
CREATE INDEX IF NOT EXISTS idx_chatbot_messages_confidence ON chatbot_messages(confidence_score);
CREATE INDEX IF NOT EXISTS idx_chatbot_messages_created_at ON chatbot_messages(created_at DESC);

-- Constraints
ALTER TABLE chatbot_conversations ADD CONSTRAINT chatbot_sentiment_check 
CHECK (sentiment_score >= -1 AND sentiment_score <= 1);

ALTER TABLE chatbot_conversations ADD CONSTRAINT chatbot_satisfaction_check 
CHECK (satisfaction_score >= 1 AND satisfaction_score <= 5);
