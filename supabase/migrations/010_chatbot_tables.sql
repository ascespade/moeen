-- Migration: Create Chatbot System Tables
-- Date: 2024-01-15
-- Description: Creates complete chatbot subsystem with flows, nodes, edges, templates, integrations, conversations, and messages

-- chatbot_flows
CREATE TABLE IF NOT EXISTS chatbot_flows (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  public_id VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  status VARCHAR(50) DEFAULT 'draft', -- 'draft', 'published', 'archived'
  version INTEGER DEFAULT 1,
  created_by UUID REFERENCES users(id),
  published_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- chatbot_nodes
CREATE TABLE IF NOT EXISTS chatbot_nodes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  public_id VARCHAR(255) UNIQUE NOT NULL,
  flow_id UUID REFERENCES chatbot_flows(id) ON DELETE CASCADE,
  node_type VARCHAR(50) NOT NULL, -- 'start', 'message', 'condition', 'action', 'end'
  name VARCHAR(255) NOT NULL,
  config JSONB NOT NULL, -- Node configuration (messages, conditions, etc.)
  position_x INTEGER DEFAULT 0,
  position_y INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- chatbot_edges
CREATE TABLE IF NOT EXISTS chatbot_edges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  public_id VARCHAR(255) UNIQUE NOT NULL,
  flow_id UUID REFERENCES chatbot_flows(id) ON DELETE CASCADE,
  source_node_id UUID REFERENCES chatbot_nodes(id) ON DELETE CASCADE,
  target_node_id UUID REFERENCES chatbot_nodes(id) ON DELETE CASCADE,
  condition JSONB, -- Edge condition logic
  created_at TIMESTAMP DEFAULT NOW()
);

-- chatbot_templates
CREATE TABLE IF NOT EXISTS chatbot_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  public_id VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  category VARCHAR(100), -- 'greeting', 'appointment', 'information', 'support'
  language VARCHAR(10) DEFAULT 'ar',
  content TEXT NOT NULL,
  variables JSONB, -- Template variables
  is_approved BOOLEAN DEFAULT false,
  created_by UUID REFERENCES users(id),
  approved_by UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- chatbot_integrations
CREATE TABLE IF NOT EXISTS chatbot_integrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  public_id VARCHAR(255) UNIQUE NOT NULL,
  provider VARCHAR(50) NOT NULL, -- 'whatsapp', 'web', 'telegram', 'facebook'
  name VARCHAR(255) NOT NULL,
  config JSONB NOT NULL, -- Provider-specific configuration
  status VARCHAR(50) DEFAULT 'inactive', -- 'active', 'inactive', 'error'
  webhook_url VARCHAR(500),
  webhook_secret VARCHAR(255),
  last_health_check TIMESTAMP,
  health_status VARCHAR(50) DEFAULT 'unknown', -- 'healthy', 'unhealthy', 'unknown'
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- conversations
CREATE TABLE IF NOT EXISTS conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  public_id VARCHAR(255) UNIQUE NOT NULL,
  integration_id UUID REFERENCES chatbot_integrations(id),
  patient_id UUID REFERENCES patients(id),
  external_id VARCHAR(255), -- External conversation ID (WhatsApp, etc.)
  status VARCHAR(50) DEFAULT 'active', -- 'active', 'closed', 'archived'
  channel VARCHAR(50) NOT NULL, -- 'whatsapp', 'web', 'telegram'
  started_at TIMESTAMP DEFAULT NOW(),
  ended_at TIMESTAMP,
  metadata JSONB, -- Additional conversation data
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- messages
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  public_id VARCHAR(255) UNIQUE NOT NULL,
  conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
  sender_type VARCHAR(50) NOT NULL, -- 'user', 'bot', 'system'
  content TEXT NOT NULL,
  message_type VARCHAR(50) DEFAULT 'text', -- 'text', 'image', 'file', 'button'
  metadata JSONB, -- Additional message data
  sent_at TIMESTAMP DEFAULT NOW(),
  read_at TIMESTAMP
);

-- Add comments for documentation
COMMENT ON TABLE chatbot_flows IS 'Chatbot conversation flows and workflows';
COMMENT ON TABLE chatbot_nodes IS 'Individual nodes within chatbot flows';
COMMENT ON TABLE chatbot_edges IS 'Connections between chatbot nodes';
COMMENT ON TABLE chatbot_templates IS 'Reusable message templates for chatbot';
COMMENT ON TABLE chatbot_integrations IS 'External platform integrations for chatbot';
COMMENT ON TABLE conversations IS 'Individual chatbot conversations';
COMMENT ON TABLE messages IS 'Messages within chatbot conversations';
