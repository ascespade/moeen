-- ================================================================
-- 🤖 CHATBOT TRIGGERS & FUNCTIONS
-- ================================================================

-- Update trigger
CREATE OR REPLACE FUNCTION update_chatbot_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  NEW.last_activity_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_chatbot_conversations ON chatbot_conversations;
CREATE TRIGGER trigger_update_chatbot_conversations
  BEFORE UPDATE ON chatbot_conversations
  FOR EACH ROW EXECUTE FUNCTION update_chatbot_updated_at();

-- Statistics function
CREATE OR REPLACE FUNCTION get_chatbot_statistics(
  p_start_date TIMESTAMPTZ DEFAULT NOW() - INTERVAL '30 days',
  p_end_date TIMESTAMPTZ DEFAULT NOW()
)
RETURNS TABLE(
  total_conversations INTEGER,
  resolved_count INTEGER,
  average_satisfaction NUMERIC,
  average_resolution_time NUMERIC,
  total_messages INTEGER
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    COUNT(DISTINCT cc.id)::INTEGER,
    COUNT(*) FILTER (WHERE cc.resolved = TRUE)::INTEGER,
    AVG(cc.satisfaction_score),
    AVG(cc.resolution_time),
    COUNT(cm.id)::INTEGER
  FROM chatbot_conversations cc
  LEFT JOIN chatbot_messages cm ON cm.conversation_id = cc.id
  WHERE cc.created_at BETWEEN p_start_date AND p_end_date;
END;
$$ LANGUAGE plpgsql;
