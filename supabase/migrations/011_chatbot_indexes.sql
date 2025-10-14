-- Migration: Create Chatbot System Indexes
-- Date: 2024-01-15
-- Description: Performance indexes for chatbot tables

-- Chatbot flows indexes
CREATE INDEX IF NOT EXISTS idx_chatbot_flows_status ON chatbot_flows(status);
CREATE INDEX IF NOT EXISTS idx_chatbot_flows_created_by ON chatbot_flows(created_by);
CREATE INDEX IF NOT EXISTS idx_chatbot_flows_public_id ON chatbot_flows(public_id);

-- Chatbot nodes indexes
CREATE INDEX IF NOT EXISTS idx_chatbot_nodes_flow_id ON chatbot_nodes(flow_id);
CREATE INDEX IF NOT EXISTS idx_chatbot_nodes_type ON chatbot_nodes(node_type);
CREATE INDEX IF NOT EXISTS idx_chatbot_nodes_public_id ON chatbot_nodes(public_id);

-- Chatbot edges indexes
CREATE INDEX IF NOT EXISTS idx_chatbot_edges_flow_id ON chatbot_edges(flow_id);
CREATE INDEX IF NOT EXISTS idx_chatbot_edges_source ON chatbot_edges(source_node_id);
CREATE INDEX IF NOT EXISTS idx_chatbot_edges_target ON chatbot_edges(target_node_id);
CREATE INDEX IF NOT EXISTS idx_chatbot_edges_public_id ON chatbot_edges(public_id);

-- Chatbot templates indexes
CREATE INDEX IF NOT EXISTS idx_chatbot_templates_category ON chatbot_templates(category);
CREATE INDEX IF NOT EXISTS idx_chatbot_templates_language ON chatbot_templates(language);
CREATE INDEX IF NOT EXISTS idx_chatbot_templates_approved ON chatbot_templates(is_approved);
CREATE INDEX IF NOT EXISTS idx_chatbot_templates_public_id ON chatbot_templates(public_id);

-- Chatbot integrations indexes
CREATE INDEX IF NOT EXISTS idx_chatbot_integrations_provider ON chatbot_integrations(provider);
CREATE INDEX IF NOT EXISTS idx_chatbot_integrations_status ON chatbot_integrations(status);
CREATE INDEX IF NOT EXISTS idx_chatbot_integrations_health ON chatbot_integrations(health_status);
CREATE INDEX IF NOT EXISTS idx_chatbot_integrations_public_id ON chatbot_integrations(public_id);

-- Conversations indexes
CREATE INDEX IF NOT EXISTS idx_conversations_integration ON conversations(integration_id);
CREATE INDEX IF NOT EXISTS idx_conversations_patient ON conversations(patient_id);
CREATE INDEX IF NOT EXISTS idx_conversations_status ON conversations(status);
CREATE INDEX IF NOT EXISTS idx_conversations_channel ON conversations(channel);
CREATE INDEX IF NOT EXISTS idx_conversations_external_id ON conversations(external_id);
CREATE INDEX IF NOT EXISTS idx_conversations_public_id ON conversations(public_id);

-- Messages indexes
CREATE INDEX IF NOT EXISTS idx_messages_conversation ON messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_messages_sender_type ON messages(sender_type);
CREATE INDEX IF NOT EXISTS idx_messages_type ON messages(message_type);
CREATE INDEX IF NOT EXISTS idx_messages_sent_at ON messages(sent_at);
CREATE INDEX IF NOT EXISTS idx_messages_public_id ON messages(public_id);

-- Composite indexes for common queries
CREATE INDEX IF NOT EXISTS idx_conversations_patient_status ON conversations(patient_id, status);
CREATE INDEX IF NOT EXISTS idx_messages_conversation_sent ON messages(conversation_id, sent_at);
CREATE INDEX IF NOT EXISTS idx_chatbot_flows_created_status ON chatbot_flows(created_by, status);
