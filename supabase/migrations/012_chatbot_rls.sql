-- Migration: Create Chatbot System RLS Policies
-- Date: 2024-01-15
-- Description: Row Level Security policies for chatbot tables

-- Enable RLS on chatbot tables
ALTER TABLE chatbot_flows ENABLE ROW LEVEL SECURITY;
ALTER TABLE chatbot_nodes ENABLE ROW LEVEL SECURITY;
ALTER TABLE chatbot_edges ENABLE ROW LEVEL SECURITY;
ALTER TABLE chatbot_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE chatbot_integrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Chatbot flows policies
CREATE POLICY "Users can view published flows" ON chatbot_flows
  FOR SELECT USING (status = 'published');

CREATE POLICY "Users can manage their own flows" ON chatbot_flows
  FOR ALL USING (created_by = auth.uid());

CREATE POLICY "Admins can manage all flows" ON chatbot_flows
  FOR ALL USING (EXISTS (
    SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
  ));

-- Chatbot nodes policies
CREATE POLICY "Users can view nodes of accessible flows" ON chatbot_nodes
  FOR SELECT USING (flow_id IN (
    SELECT id FROM chatbot_flows WHERE 
      status = 'published' OR 
      created_by = auth.uid() OR
      EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
  ));

CREATE POLICY "Users can manage nodes of their flows" ON chatbot_nodes
  FOR ALL USING (flow_id IN (
    SELECT id FROM chatbot_flows WHERE created_by = auth.uid()
  ));

CREATE POLICY "Admins can manage all nodes" ON chatbot_nodes
  FOR ALL USING (EXISTS (
    SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
  ));

-- Chatbot edges policies
CREATE POLICY "Users can view edges of accessible flows" ON chatbot_edges
  FOR SELECT USING (flow_id IN (
    SELECT id FROM chatbot_flows WHERE 
      status = 'published' OR 
      created_by = auth.uid() OR
      EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
  ));

CREATE POLICY "Users can manage edges of their flows" ON chatbot_edges
  FOR ALL USING (flow_id IN (
    SELECT id FROM chatbot_flows WHERE created_by = auth.uid()
  ));

CREATE POLICY "Admins can manage all edges" ON chatbot_edges
  FOR ALL USING (EXISTS (
    SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
  ));

-- Chatbot templates policies
CREATE POLICY "Users can view approved templates" ON chatbot_templates
  FOR SELECT USING (is_approved = true);

CREATE POLICY "Users can manage their own templates" ON chatbot_templates
  FOR ALL USING (created_by = auth.uid());

CREATE POLICY "Admins can manage all templates" ON chatbot_templates
  FOR ALL USING (EXISTS (
    SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
  ));

-- Chatbot integrations policies
CREATE POLICY "Users can view active integrations" ON chatbot_integrations
  FOR SELECT USING (status = 'active');

CREATE POLICY "Users can manage their own integrations" ON chatbot_integrations
  FOR ALL USING (created_by = auth.uid());

CREATE POLICY "Admins can manage all integrations" ON chatbot_integrations
  FOR ALL USING (EXISTS (
    SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
  ));

-- Conversations policies
CREATE POLICY "Users can view their own conversations" ON conversations
  FOR SELECT USING (patient_id IN (
    SELECT id FROM patients WHERE id IN (
      SELECT patient_id FROM appointments WHERE doctor_id IN (
        SELECT id FROM doctors WHERE user_id = auth.uid()
      )
    )
  ));

CREATE POLICY "Admins can view all conversations" ON conversations
  FOR SELECT USING (EXISTS (
    SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
  ));

CREATE POLICY "System can manage conversations" ON conversations
  FOR ALL USING (true); -- Allow system/bot operations

-- Messages policies
CREATE POLICY "Users can view messages of their conversations" ON messages
  FOR SELECT USING (conversation_id IN (
    SELECT id FROM conversations WHERE patient_id IN (
      SELECT id FROM patients WHERE id IN (
        SELECT patient_id FROM appointments WHERE doctor_id IN (
          SELECT id FROM doctors WHERE user_id = auth.uid()
        )
      )
    )
  ));

CREATE POLICY "Admins can view all messages" ON messages
  FOR SELECT USING (EXISTS (
    SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
  ));

CREATE POLICY "System can manage messages" ON messages
  FOR ALL USING (true); -- Allow system/bot operations
