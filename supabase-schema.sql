-- Muayin Assistant Database Schema
-- مركز الهمم - نظام مُعين الذكي

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create custom types
CREATE TYPE user_role AS ENUM ('admin', 'manager', 'agent', 'demo');
CREATE TYPE conversation_status AS ENUM ('active', 'pending', 'resolved', 'archived');
CREATE TYPE message_type AS ENUM ('text', 'image', 'audio', 'video', 'file', 'system');
CREATE TYPE flow_status AS ENUM ('active', 'inactive', 'draft');

-- Users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    role user_role NOT NULL DEFAULT 'agent',
    phone VARCHAR(20),
    avatar_url TEXT,
    is_active BOOLEAN DEFAULT true,
    last_login TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Roles table (for future role-based permissions)
CREATE TABLE roles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    permissions JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Conversations table
CREATE TABLE conversations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    customer_name VARCHAR(255),
    customer_phone VARCHAR(20),
    customer_email VARCHAR(255),
    channel VARCHAR(50) NOT NULL, -- whatsapp, telegram, facebook, instagram
    status conversation_status DEFAULT 'active',
    priority INTEGER DEFAULT 1, -- 1=low, 2=medium, 3=high, 4=urgent
    tags TEXT[],
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    resolved_at TIMESTAMP WITH TIME ZONE
);

-- Messages table
CREATE TABLE messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
    sender_id UUID REFERENCES users(id),
    sender_type VARCHAR(20) NOT NULL, -- 'user', 'customer', 'system', 'ai'
    message_type message_type DEFAULT 'text',
    content TEXT NOT NULL,
    media_url TEXT,
    metadata JSONB DEFAULT '{}',
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- AI Flows table (for automated responses)
CREATE TABLE flows (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    trigger_keywords TEXT[],
    trigger_conditions JSONB DEFAULT '{}',
    response_template TEXT NOT NULL,
    status flow_status DEFAULT 'draft',
    priority INTEGER DEFAULT 1,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Reviews table
CREATE TABLE reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    feedback TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Analytics table
CREATE TABLE analytics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    metric_name VARCHAR(100) NOT NULL,
    metric_value NUMERIC NOT NULL,
    dimensions JSONB DEFAULT '{}',
    recorded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_conversations_user_id ON conversations(user_id);
CREATE INDEX idx_conversations_status ON conversations(status);
CREATE INDEX idx_conversations_channel ON conversations(channel);
CREATE INDEX idx_messages_conversation_id ON messages(conversation_id);
CREATE INDEX idx_messages_created_at ON messages(created_at);
CREATE INDEX idx_flows_status ON flows(status);
CREATE INDEX idx_flows_trigger_keywords ON flows USING GIN(trigger_keywords);

-- Row Level Security (RLS) policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE flows ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users
CREATE POLICY "Users can view their own data" ON users
    FOR SELECT USING (auth.uid()::text = id::text);

CREATE POLICY "Admins can view all users" ON users
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE id::text = auth.uid()::text 
            AND role = 'admin'
        )
    );

-- RLS Policies for conversations
CREATE POLICY "Users can view their own conversations" ON conversations
    FOR SELECT USING (user_id::text = auth.uid()::text);

CREATE POLICY "Admins can view all conversations" ON conversations
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE id::text = auth.uid()::text 
            AND role = 'admin'
        )
    );

-- RLS Policies for messages
CREATE POLICY "Users can view messages from their conversations" ON messages
    FOR SELECT USING (
        conversation_id IN (
            SELECT id FROM conversations 
            WHERE user_id::text = auth.uid()::text
        )
    );

-- RLS Policies for flows
CREATE POLICY "All authenticated users can view active flows" ON flows
    FOR SELECT USING (status = 'active');

CREATE POLICY "Admins can manage flows" ON flows
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE id::text = auth.uid()::text 
            AND role = 'admin'
        )
    );

-- Functions for automatic timestamp updates
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for automatic timestamp updates
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_conversations_updated_at BEFORE UPDATE ON conversations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_flows_updated_at BEFORE UPDATE ON flows
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert default roles
INSERT INTO roles (name, description, permissions) VALUES
('admin', 'مدير النظام', '{"all": true}'),
('manager', 'مدير الفريق', '{"conversations": true, "reports": true, "users": true}'),
('agent', 'وكيل خدمة العملاء', '{"conversations": true, "messages": true}'),
('demo', 'مستخدم تجريبي', '{"view": true}');

-- Insert demo users
INSERT INTO users (email, password_hash, name, role, phone, is_active) VALUES
('admin@alhemamcenter.com', crypt('admin123', gen_salt('bf')), 'مدير النظام', 'admin', '+966501234567', true),
('manager@alhemamcenter.com', crypt('manager123', gen_salt('bf')), 'مدير الفريق', 'manager', '+966501234568', true),
('agent@alhemamcenter.com', crypt('agent123', gen_salt('bf')), 'وكيل خدمة العملاء', 'agent', '+966501234569', true),
('demo@alhemamcenter.com', crypt('demo123', gen_salt('bf')), 'مستخدم تجريبي', 'demo', '+966501234570', true);

-- Insert sample conversations
INSERT INTO conversations (user_id, customer_name, customer_phone, customer_email, channel, status, priority, tags) VALUES
(
    (SELECT id FROM users WHERE email = 'agent@alhemamcenter.com'),
    'أحمد محمد',
    '+966501111111',
    'ahmed@example.com',
    'whatsapp',
    'active',
    2,
    ARRAY['new_customer', 'inquiry']
),
(
    (SELECT id FROM users WHERE email = 'agent@alhemamcenter.com'),
    'فاطمة علي',
    '+966501111112',
    'fatima@example.com',
    'telegram',
    'pending',
    1,
    ARRAY['follow_up']
),
(
    (SELECT id FROM users WHERE email = 'agent@alhemamcenter.com'),
    'محمد السعيد',
    '+966501111113',
    'mohammed@example.com',
    'facebook',
    'resolved',
    3,
    ARRAY['urgent', 'complaint']
);

-- Insert sample messages
INSERT INTO messages (conversation_id, sender_id, sender_type, message_type, content) VALUES
(
    (SELECT id FROM conversations WHERE customer_name = 'أحمد محمد'),
    (SELECT id FROM users WHERE email = 'agent@alhemamcenter.com'),
    'user',
    'text',
    'مرحباً أحمد، كيف يمكنني مساعدتك اليوم؟'
),
(
    (SELECT id FROM conversations WHERE customer_name = 'أحمد محمد'),
    NULL,
    'customer',
    'text',
    'أريد معرفة المزيد عن خدمات مركز الهمم'
),
(
    (SELECT id FROM conversations WHERE customer_name = 'فاطمة علي'),
    (SELECT id FROM users WHERE email = 'agent@alhemamcenter.com'),
    'user',
    'text',
    'شكراً لك فاطمة، سنتواصل معك قريباً'
);

-- Insert sample flows
INSERT INTO flows (name, description, trigger_keywords, response_template, status, created_by) VALUES
(
    'ترحيب عام',
    'ترحيب تلقائي للعملاء الجدد',
    ARRAY['مرحبا', 'السلام', 'أهلا', 'hello', 'hi'],
    'مرحباً بك في مركز الهمم! كيف يمكنني مساعدتك اليوم؟',
    'active',
    (SELECT id FROM users WHERE email = 'admin@alhemamcenter.com')
),
(
    'معلومات الخدمات',
    'معلومات عن خدمات المركز',
    ARRAY['خدمات', 'معلومات', 'services', 'info'],
    'نحن نقدم خدمات متعددة تشمل الاستشارات النفسية والاجتماعية. هل تريد معرفة المزيد عن خدمة معينة؟',
    'active',
    (SELECT id FROM users WHERE email = 'admin@alhemamcenter.com')
);

-- Insert sample analytics
INSERT INTO analytics (metric_name, metric_value, dimensions) VALUES
('total_conversations', 3, '{"period": "today"}'),
('active_conversations', 1, '{"period": "today"}'),
('resolved_conversations', 1, '{"period": "today"}'),
('average_response_time', 2.5, '{"period": "today", "unit": "minutes"}');

-- Create views for common queries
CREATE VIEW conversation_summary AS
SELECT 
    c.id,
    c.customer_name,
    c.customer_phone,
    c.channel,
    c.status,
    c.priority,
    c.created_at,
    u.name as agent_name,
    COUNT(m.id) as message_count,
    MAX(m.created_at) as last_message_at
FROM conversations c
LEFT JOIN users u ON c.user_id = u.id
LEFT JOIN messages m ON c.id = m.conversation_id
GROUP BY c.id, c.customer_name, c.customer_phone, c.channel, c.status, c.priority, c.created_at, u.name;

CREATE VIEW user_stats AS
SELECT 
    u.id,
    u.name,
    u.email,
    u.role,
    COUNT(c.id) as total_conversations,
    COUNT(CASE WHEN c.status = 'active' THEN 1 END) as active_conversations,
    COUNT(CASE WHEN c.status = 'resolved' THEN 1 END) as resolved_conversations,
    u.last_login
FROM users u
LEFT JOIN conversations c ON u.id = c.user_id
GROUP BY u.id, u.name, u.email, u.role, u.last_login;

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO anon, authenticated;