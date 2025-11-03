-- Database Schema Summary
-- Extracted at: 2025-11-03T16:05:14.140Z

-- Table: ai_models
CREATE TABLE IF NOT EXISTS ai_models (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  name varchar(100) NOT NULL,
  model_type ai_model NOT NULL,
  api_key text,
  api_url text,
  configuration jsonb DEFAULT '{}'::jsonb,
  is_active bool DEFAULT true,
  usage_count int4 DEFAULT 0,
  last_used timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Table: ai_training_data
CREATE TABLE IF NOT EXISTS ai_training_data (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  input_text text NOT NULL,
  expected_output text NOT NULL,
  category varchar(100),
  tags _text,
  confidence_score numeric,
  is_verified bool DEFAULT false,
  verified_by uuid,
  verified_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Table: analytics
CREATE TABLE IF NOT EXISTS analytics (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  metric_name varchar(100) NOT NULL,
  metric_type metric_type NOT NULL,
  metric_value numeric NOT NULL,
  dimensions jsonb DEFAULT '{}'::jsonb,
  recorded_at timestamptz DEFAULT now(),
  period_start timestamptz,
  period_end timestamptz,
  user_id uuid,
  conversation_id uuid,
  created_by uuid,
  metadata jsonb DEFAULT '{}'::jsonb,
  updated_at timestamptz DEFAULT now()
);

-- Table: appointments
CREATE TABLE IF NOT EXISTS appointments (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  patient_id uuid,
  doctor_id uuid,
  appointment_date date NOT NULL,
  appointment_time time NOT NULL,
  duration int4 DEFAULT 30,
  status varchar(50) DEFAULT 'scheduled'::character varying,
  notes text,
  created_at timestamp DEFAULT now(),
  updated_at timestamp DEFAULT now(),
  public_id varchar(255),
  created_by uuid,
  updated_by uuid,
  last_activity_at timestamptz DEFAULT now(),
  status_reason text,
  priority int4 DEFAULT 3,
  reminder_sent bool DEFAULT false,
  reminder_sent_at timestamptz,
  follow_up_required bool DEFAULT false,
  follow_up_date timestamptz,
  internal_notes text,
  tags _text,
  metadata jsonb DEFAULT '{}'::jsonb,
  duration_minutes int4 DEFAULT 60,
  type varchar(50) DEFAULT 'consultation'::character varying,
  confirmation_code varchar(20)
);

-- Table: approvals
CREATE TABLE IF NOT EXISTS approvals (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  public_id varchar DEFAULT ((('APR-'::text || to_char(now(), 'YYYYMMDD'::text)) || '-'::text) || "substring"(md5((random())::text), 1, 8)),
  patient_id uuid,
  request_type varchar NOT NULL,
  request_title varchar NOT NULL,
  description text,
  requested_by varchar,
  requested_date timestamptz NOT NULL DEFAULT now(),
  status varchar NOT NULL DEFAULT 'pending'::character varying,
  approved_by uuid,
  approved_date timestamptz,
  rejection_reason text,
  priority varchar NOT NULL DEFAULT 'medium'::character varying,
  estimated_cost numeric DEFAULT 0,
  insurance_coverage numeric DEFAULT 0,
  patient_contribution numeric DEFAULT 0,
  is_blocked bool DEFAULT false,
  block_reason text,
  has_outstanding_balance bool DEFAULT false,
  outstanding_amount numeric DEFAULT 0,
  attachments jsonb DEFAULT '[]'::jsonb,
  notes text,
  created_by uuid,
  updated_by uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  last_activity_at timestamptz NOT NULL DEFAULT now(),
  metadata jsonb DEFAULT '{}'::jsonb
);

-- Table: audit_logs
CREATE TABLE IF NOT EXISTS audit_logs (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  user_id uuid,
  action varchar(100) NOT NULL,
  resource_type varchar(100),
  resource_id uuid,
  old_values jsonb,
  new_values jsonb,
  ip_address inet,
  user_agent text,
  created_at timestamptz NOT NULL DEFAULT now(),
  severity varchar(20) NOT NULL DEFAULT 'info'::character varying,
  status varchar(20) NOT NULL DEFAULT 'success'::character varying,
  error_message text,
  request_id varchar(255),
  session_id varchar(255),
  duration_ms int4,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  geo_location jsonb,
  device_type varchar(50),
  browser varchar(100),
  os varchar(100)
);

-- Table: center_info
CREATE TABLE IF NOT EXISTS center_info (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  name varchar(255) NOT NULL,
  name_en varchar(255),
  description text,
  description_en text,
  logo_url text,
  address text,
  city varchar(100),
  country varchar(100) DEFAULT 'Saudi Arabia'::character varying,
  postal_code varchar(20),
  phone varchar(20),
  email varchar(255),
  website varchar(255),
  emergency_phone varchar(20),
  admin_phone varchar(20),
  working_hours jsonb DEFAULT '{}'::jsonb,
  social_media jsonb DEFAULT '{}'::jsonb,
  services jsonb DEFAULT '[]'::jsonb,
  specialties jsonb DEFAULT '[]'::jsonb,
  is_active bool DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Table: channels
CREATE TABLE IF NOT EXISTS channels (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  name varchar(255) NOT NULL,
  type varchar(50) NOT NULL,
  status varchar(20) DEFAULT 'active'::character varying,
  config jsonb NOT NULL,
  webhook_url text,
  is_primary bool DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Table: chatbot_appointments
CREATE TABLE IF NOT EXISTS chatbot_appointments (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  conversation_id uuid NOT NULL,
  patient_name varchar(255) NOT NULL,
  patient_phone varchar(20) NOT NULL,
  appointment_date date NOT NULL,
  appointment_time time NOT NULL,
  service_type varchar(100) NOT NULL,
  doctor_id uuid,
  status varchar(20) DEFAULT 'pending'::character varying,
  confirmation_code varchar(10),
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Table: chatbot_configs
CREATE TABLE IF NOT EXISTS chatbot_configs (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  name varchar(255) NOT NULL,
  whatsapp_api_url text NOT NULL,
  whatsapp_token text NOT NULL,
  webhook_url text,
  is_active bool DEFAULT true,
  ai_model varchar(50) DEFAULT 'gemini_pro'::character varying,
  language varchar(10) DEFAULT 'ar'::character varying,
  timezone varchar(50) DEFAULT 'Asia/Riyadh'::character varying,
  business_hours jsonb DEFAULT '{"end": "17:00", "days": [1, 2, 3, 4, 5], "start": "08:00"}'::jsonb,
  auto_reply_enabled bool DEFAULT true,
  auto_reply_message text DEFAULT 'مرحباً بك في مركز الهمم! سأقوم بالرد عليك قريباً.'::text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Table: chatbot_conversations
CREATE TABLE IF NOT EXISTS chatbot_conversations (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  whatsapp_number varchar(20) NOT NULL,
  customer_name varchar(255),
  current_intent_id uuid,
  conversation_state varchar(50) DEFAULT 'active'::character varying,
  context_data jsonb DEFAULT '{}'::jsonb,
  last_message_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  created_by uuid,
  updated_by uuid,
  last_activity_at timestamptz DEFAULT now(),
  sentiment_score numeric,
  satisfaction_score int4,
  resolved bool DEFAULT false,
  resolution_time int4,
  metadata jsonb DEFAULT '{}'::jsonb
);

-- Table: chatbot_edges
CREATE TABLE IF NOT EXISTS chatbot_edges (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  public_id varchar(255) NOT NULL,
  flow_id uuid,
  source_node_id uuid,
  target_node_id uuid,
  condition jsonb,
  created_at timestamp DEFAULT now()
);

-- Table: chatbot_flows
CREATE TABLE IF NOT EXISTS chatbot_flows (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  public_id varchar(255) NOT NULL,
  name varchar(255) NOT NULL,
  description text,
  status varchar(50) DEFAULT 'draft'::character varying,
  version int4 DEFAULT 1,
  created_by uuid,
  published_at timestamp,
  created_at timestamp DEFAULT now(),
  updated_at timestamp DEFAULT now()
);

-- Table: chatbot_integrations
CREATE TABLE IF NOT EXISTS chatbot_integrations (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  public_id varchar(255) NOT NULL,
  provider varchar(50) NOT NULL,
  name varchar(255) NOT NULL,
  config jsonb NOT NULL,
  status varchar(50) DEFAULT 'inactive'::character varying,
  webhook_url varchar(500),
  webhook_secret varchar(255),
  last_health_check timestamp,
  health_status varchar(50) DEFAULT 'unknown'::character varying,
  created_by uuid,
  created_at timestamp DEFAULT now(),
  updated_at timestamp DEFAULT now()
);

-- Table: chatbot_intents
CREATE TABLE IF NOT EXISTS chatbot_intents (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  name varchar(255) NOT NULL,
  description text,
  keywords _text NOT NULL,
  response_template text NOT NULL,
  action_type varchar(50) NOT NULL,
  is_active bool DEFAULT true,
  priority int4 DEFAULT 1,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Table: chatbot_messages
CREATE TABLE IF NOT EXISTS chatbot_messages (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  conversation_id uuid NOT NULL,
  whatsapp_message_id varchar(255),
  sender_type varchar(20) NOT NULL,
  message_text text NOT NULL,
  message_type varchar(20) DEFAULT 'text'::character varying,
  media_url text,
  intent_id uuid,
  confidence_score numeric,
  is_handled bool DEFAULT false,
  created_at timestamptz DEFAULT now(),
  created_by uuid,
  response_time_ms int4,
  metadata jsonb DEFAULT '{}'::jsonb,
  updated_at timestamptz DEFAULT now()
);

-- Table: chatbot_nodes
CREATE TABLE IF NOT EXISTS chatbot_nodes (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  public_id varchar(255) NOT NULL,
  flow_id uuid,
  node_type varchar(50) NOT NULL,
  name varchar(255) NOT NULL,
  config jsonb NOT NULL,
  position_x int4 DEFAULT 0,
  position_y int4 DEFAULT 0,
  created_at timestamp DEFAULT now(),
  updated_at timestamp DEFAULT now()
);

-- Table: chatbot_reminders
CREATE TABLE IF NOT EXISTS chatbot_reminders (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  conversation_id uuid NOT NULL,
  appointment_id uuid,
  reminder_type varchar(50) NOT NULL,
  message text NOT NULL,
  scheduled_time timestamptz NOT NULL,
  status varchar(20) DEFAULT 'pending'::character varying,
  sent_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Table: chatbot_templates
CREATE TABLE IF NOT EXISTS chatbot_templates (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  public_id varchar(255) NOT NULL,
  name varchar(255) NOT NULL,
  category varchar(100),
  language varchar(10) DEFAULT 'ar'::character varying,
  content text NOT NULL,
  variables jsonb,
  is_approved bool DEFAULT false,
  created_by uuid,
  approved_by uuid,
  created_at timestamp DEFAULT now(),
  updated_at timestamp DEFAULT now()
);

-- Table: contact_forms
CREATE TABLE IF NOT EXISTS contact_forms (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  name varchar(255) NOT NULL,
  email varchar(255) NOT NULL,
  phone varchar(50),
  subject varchar(255),
  message text NOT NULL,
  status varchar(50) DEFAULT 'new'::character varying,
  ip_address inet,
  user_agent text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Table: conversations
CREATE TABLE IF NOT EXISTS conversations (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  user_id uuid,
  customer_id uuid,
  customer_name varchar(255),
  customer_phone varchar(20),
  customer_email varchar(255),
  customer_whatsapp varchar(20),
  channel channel_type NOT NULL,
  status conversation_status DEFAULT 'active'::conversation_status,
  priority conversation_priority DEFAULT 'medium'::conversation_priority,
  tags _text,
  category varchar(100),
  subject varchar(500),
  description text,
  assigned_to uuid,
  assigned_at timestamptz,
  resolved_at timestamptz,
  closed_at timestamptz,
  satisfaction_rating int4,
  satisfaction_feedback text,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  created_by uuid,
  updated_by uuid,
  last_activity_at timestamptz DEFAULT now(),
  sentiment varchar(20) DEFAULT 'neutral'::character varying,
  response_time_avg int4
);

-- Table: crm_activities
CREATE TABLE IF NOT EXISTS crm_activities (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  public_id varchar(255) NOT NULL,
  type varchar(50) NOT NULL,
  subject varchar(255) NOT NULL,
  description text,
  due_date date,
  due_time time,
  status varchar(50) DEFAULT 'pending'::character varying,
  priority varchar(20) DEFAULT 'medium'::character varying,
  owner_id uuid,
  contact_id uuid,
  deal_id uuid,
  completed_at timestamp,
  created_at timestamp DEFAULT now(),
  updated_at timestamp DEFAULT now()
);

-- Table: crm_contact_activities
CREATE TABLE IF NOT EXISTS crm_contact_activities (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  public_id varchar(255) NOT NULL DEFAULT ((('cac_'::text || to_char(now(), 'YYYYMMDD'::text)) || '_'::text) || "substring"(md5((random())::text), 1, 8)),
  contact_id uuid,
  activity_type varchar(20),
  subject varchar(255),
  description text,
  activity_date timestamptz DEFAULT now(),
  created_by uuid,
  created_at timestamptz DEFAULT now()
);

-- Table: crm_contacts
CREATE TABLE IF NOT EXISTS crm_contacts (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  public_id varchar(255) NOT NULL DEFAULT ((('cnt_'::text || to_char(now(), 'YYYYMMDD'::text)) || '_'::text) || "substring"(md5((random())::text), 1, 8)),
  first_name varchar(100) NOT NULL,
  last_name varchar(100) NOT NULL,
  email varchar(255),
  phone varchar(50),
  company varchar(255),
  position varchar(100),
  status varchar(20) DEFAULT 'lead'::character varying,
  source varchar(50),
  notes text,
  tags jsonb DEFAULT '[]'::jsonb,
  address jsonb,
  social_media jsonb,
  last_contact_at timestamptz,
  next_follow_up_at timestamptz,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_by uuid,
  updated_by uuid,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Table: crm_deals
CREATE TABLE IF NOT EXISTS crm_deals (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  public_id varchar(255) NOT NULL,
  title varchar(255) NOT NULL,
  description text,
  value numeric,
  currency varchar(10) DEFAULT 'SAR'::character varying,
  stage varchar(50) DEFAULT 'prospecting'::character varying,
  probability int4 DEFAULT 0,
  expected_close_date date,
  actual_close_date date,
  owner_id uuid,
  contact_id uuid,
  lead_id uuid,
  created_at timestamp DEFAULT now(),
  updated_at timestamp DEFAULT now()
);

-- Table: crm_leads
CREATE TABLE IF NOT EXISTS crm_leads (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  public_id varchar(255) NOT NULL,
  name varchar(255) NOT NULL,
  email varchar(255),
  phone varchar(50),
  company varchar(255),
  source varchar(100),
  status varchar(50) DEFAULT 'new'::character varying,
  score int4 DEFAULT 0,
  notes text,
  owner_id uuid,
  assigned_at timestamp DEFAULT now(),
  created_at timestamp DEFAULT now(),
  updated_at timestamp DEFAULT now(),
  created_by uuid,
  assigned_to uuid,
  lead_source varchar(100),
  conversion_probability numeric,
  estimated_value numeric,
  metadata jsonb DEFAULT '{}'::jsonb
);

-- Table: customer_interactions
CREATE TABLE IF NOT EXISTS customer_interactions (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  customer_id uuid,
  conversation_id uuid,
  interaction_type varchar(50) NOT NULL,
  sentiment varchar(20),
  sentiment_score numeric,
  keywords _text,
  summary text,
  created_at timestamptz DEFAULT now()
);

-- Table: customers
CREATE TABLE IF NOT EXISTS customers (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  name varchar(255) NOT NULL,
  phone varchar(20),
  email varchar(255),
  whatsapp varchar(20),
  date_of_birth date,
  gender varchar(10),
  nationality varchar(100),
  city varchar(100),
  address text,
  preferred_language varchar(10) DEFAULT 'ar'::character varying,
  preferred_channel channel_type DEFAULT 'whatsapp'::channel_type,
  customer_type varchar(50) DEFAULT 'individual'::character varying,
  organization_name varchar(255),
  notes text,
  tags _text,
  is_active bool DEFAULT true,
  last_contact_at timestamptz,
  total_conversations int4 DEFAULT 0,
  total_messages int4 DEFAULT 0,
  satisfaction_avg numeric,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  created_by uuid,
  updated_by uuid,
  last_activity_at timestamptz DEFAULT now(),
  lead_score int4 DEFAULT 0,
  lifecycle_stage varchar(50) DEFAULT 'lead'::character varying,
  last_contact_date timestamptz,
  next_follow_up timestamptz
);

-- Table: doctors
CREATE TABLE IF NOT EXISTS doctors (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid,
  first_name varchar(255) NOT NULL,
  last_name varchar(255) NOT NULL,
  specialization varchar(255),
  license_number varchar(100),
  phone varchar(50),
  email varchar(255),
  consultation_fee numeric,
  is_active bool DEFAULT true,
  created_at timestamp DEFAULT now(),
  updated_at timestamp DEFAULT now(),
  public_id varchar(255),
  created_by uuid,
  updated_by uuid,
  last_activity_at timestamptz DEFAULT now(),
  experience_years int4,
  availability_schedule jsonb DEFAULT '{}'::jsonb,
  working_hours jsonb DEFAULT '{}'::jsonb,
  languages _text,
  qualifications _text,
  bio text,
  rating numeric DEFAULT 0,
  total_reviews int4 DEFAULT 0,
  tags _text,
  metadata jsonb DEFAULT '{}'::jsonb
);

-- Table: emergency_contacts
CREATE TABLE IF NOT EXISTS emergency_contacts (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  name varchar(100) NOT NULL,
  phone varchar(20) NOT NULL,
  type varchar(50) NOT NULL,
  priority int4 DEFAULT 1,
  is_available_24_7 bool DEFAULT false,
  working_hours jsonb DEFAULT '{}'::jsonb,
  notes text,
  is_active bool DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Table: family_members
CREATE TABLE IF NOT EXISTS family_members (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  public_id varchar(255) NOT NULL DEFAULT ((('fmb_'::text || to_char(now(), 'YYYYMMDD'::text)) || '_'::text) || "substring"(md5((random())::text), 1, 8)),
  patient_id uuid,
  name varchar(255) NOT NULL,
  relationship varchar(50),
  phone varchar(50),
  email varchar(255),
  is_primary_contact bool DEFAULT false,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Table: faqs
CREATE TABLE IF NOT EXISTS faqs (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  question_key varchar(500) NOT NULL,
  answer_key text NOT NULL,
  category varchar(100),
  order_index int4 DEFAULT 0,
  is_active bool DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Table: flows
CREATE TABLE IF NOT EXISTS flows (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  name varchar(255) NOT NULL,
  description text,
  trigger_type automation_trigger NOT NULL,
  trigger_keywords _text,
  trigger_conditions jsonb DEFAULT '{}'::jsonb,
  response_template text NOT NULL,
  ai_model ai_model DEFAULT 'gemini_pro'::ai_model,
  status flow_status DEFAULT 'draft'::flow_status,
  priority int4 DEFAULT 1,
  is_active bool DEFAULT true,
  execution_count int4 DEFAULT 0,
  success_count int4 DEFAULT 0,
  failure_count int4 DEFAULT 0,
  last_executed timestamptz,
  created_by uuid,
  updated_by uuid,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Table: gallery_images
CREATE TABLE IF NOT EXISTS gallery_images (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  title varchar(255),
  description text,
  image_url varchar(1000) NOT NULL,
  thumbnail_url varchar(1000),
  category varchar(100),
  tags _text,
  order_index int4 DEFAULT 0,
  is_active bool DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Table: hero_slides
CREATE TABLE IF NOT EXISTS hero_slides (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  title_key varchar(255) NOT NULL,
  subtitle_key varchar(255),
  description_key varchar(255),
  image_url varchar(1000),
  cta_text_key varchar(255),
  cta_link varchar(500),
  order_index int4 DEFAULT 0,
  is_active bool DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Table: insurance_claims
CREATE TABLE IF NOT EXISTS insurance_claims (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  patient_id uuid,
  appointment_id uuid,
  claim_number varchar(100),
  insurance_provider varchar(255),
  claim_amount numeric,
  approved_amount numeric,
  status varchar(50) DEFAULT 'pending'::character varying,
  submitted_date date,
  processed_date date,
  notes text,
  created_at timestamp DEFAULT now(),
  updated_at timestamp DEFAULT now(),
  public_id varchar(255),
  created_by uuid,
  updated_by uuid,
  approved_by uuid,
  approved_at timestamptz,
  rejection_reason text,
  metadata jsonb DEFAULT '{}'::jsonb
);

-- Table: integration_configs
CREATE TABLE IF NOT EXISTS integration_configs (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  public_id varchar(255) NOT NULL DEFAULT ((('int_'::text || to_char(now(), 'YYYYMMDD'::text)) || '_'::text) || "substring"(md5((random())::text), 1, 8)),
  integration_type varchar(50) NOT NULL,
  name varchar(255) NOT NULL,
  description text,
  config jsonb NOT NULL DEFAULT '{}'::jsonb,
  status varchar(20) DEFAULT 'inactive'::character varying,
  is_enabled bool DEFAULT false,
  last_test_at timestamptz,
  last_test_status varchar(20),
  last_test_message text,
  health_score int4 DEFAULT 0,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_by uuid,
  updated_by uuid,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Table: integration_test_logs
CREATE TABLE IF NOT EXISTS integration_test_logs (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  public_id varchar(255) NOT NULL DEFAULT ((('itl_'::text || to_char(now(), 'YYYYMMDD'::text)) || '_'::text) || "substring"(md5((random())::text), 1, 8)),
  integration_config_id uuid,
  integration_type varchar(50) NOT NULL,
  test_type varchar(50) NOT NULL,
  status varchar(20) NOT NULL,
  request_data jsonb,
  response_data jsonb,
  error_message text,
  duration_ms int4,
  tested_by uuid,
  created_at timestamptz DEFAULT now()
);

-- Table: internal_messages
CREATE TABLE IF NOT EXISTS internal_messages (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  public_id varchar(255) NOT NULL,
  sender_id uuid,
  recipient_id uuid,
  subject varchar(255),
  content text NOT NULL,
  is_read bool DEFAULT false,
  parent_message_id uuid,
  created_at timestamp DEFAULT now(),
  read_at timestamp
);

-- Table: languages
CREATE TABLE IF NOT EXISTS languages (
  code text NOT NULL,
  name text NOT NULL,
  is_default bool DEFAULT false,
  direction text DEFAULT 'rtl'::text,
  created_at timestamptz DEFAULT now()
);

-- Table: medical_files
CREATE TABLE IF NOT EXISTS medical_files (
  id int4 NOT NULL DEFAULT nextval('medical_files_id_seq'::regclass),
  medical_record_id int4,
  file_name text NOT NULL,
  file_path text NOT NULL,
  file_type varchar(50),
  file_size int8,
  mime_type varchar(100),
  uploaded_by uuid,
  is_encrypted bool DEFAULT false,
  access_level varchar(20) DEFAULT 'private'::character varying,
  created_at timestamptz DEFAULT now()
);

-- Table: medical_records
CREATE TABLE IF NOT EXISTS medical_records (
  id int4 NOT NULL DEFAULT nextval('medical_records_id_seq'::regclass),
  patient_id uuid,
  doctor_id uuid,
  appointment_id uuid,
  record_type varchar(50) NOT NULL,
  title text NOT NULL,
  description text,
  diagnosis text,
  treatment_plan text,
  medications _text,
  vital_signs jsonb,
  lab_results jsonb,
  imaging_results jsonb,
  follow_up_required bool DEFAULT false,
  follow_up_date timestamptz,
  created_by uuid,
  updated_by uuid,
  last_activity_at timestamptz DEFAULT now(),
  is_confidential bool DEFAULT false,
  health_score int4 DEFAULT 0,
  tags _text,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Table: message_attachments
CREATE TABLE IF NOT EXISTS message_attachments (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  message_id uuid,
  file_name varchar(255) NOT NULL,
  file_url text NOT NULL,
  file_type varchar(50),
  file_size int4,
  mime_type varchar(100),
  is_processed bool DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Table: messages
CREATE TABLE IF NOT EXISTS messages (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  conversation_id uuid,
  sender_id uuid,
  sender_type varchar(20) NOT NULL,
  sender_name varchar(255),
  message_type message_type DEFAULT 'text'::message_type,
  direction message_direction DEFAULT 'inbound'::message_direction,
  content text NOT NULL,
  media_url text,
  media_type varchar(50),
  media_size int4,
  message_status message_status DEFAULT 'sent'::message_status,
  external_id varchar(255),
  reply_to uuid,
  is_ai_generated bool DEFAULT false,
  ai_model ai_model,
  ai_confidence numeric,
  processing_time int4,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  delivered_at timestamptz,
  read_at timestamptz,
  created_by uuid,
  updated_at timestamptz DEFAULT now()
);

-- Table: navigation_items
CREATE TABLE IF NOT EXISTS navigation_items (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  label_key varchar(255) NOT NULL,
  href varchar(500) NOT NULL,
  icon varchar(100),
  order_index int4 DEFAULT 0,
  parent_id uuid,
  roles _text DEFAULT '{}'::text[],
  badge_key varchar(255),
  is_active bool DEFAULT true,
  is_external bool DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Table: notifications
CREATE TABLE IF NOT EXISTS notifications (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  user_id uuid,
  title varchar(255) NOT NULL,
  message text NOT NULL,
  type varchar(50) DEFAULT 'info'::character varying,
  is_read bool DEFAULT false,
  read_at timestamptz,
  action_url text,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  created_by uuid,
  scheduled_for timestamptz,
  sent_at timestamptz,
  delivery_status varchar(50) DEFAULT 'pending'::character varying,
  retry_count int4 DEFAULT 0,
  updated_at timestamptz DEFAULT now()
);

-- Table: page_sections
CREATE TABLE IF NOT EXISTS page_sections (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  page varchar(100) NOT NULL,
  section_key varchar(100) NOT NULL,
  title_key varchar(255),
  content_key text,
  image_url varchar(1000),
  order_index int4 DEFAULT 0,
  is_active bool DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Table: patient_uuid
CREATE TABLE IF NOT EXISTS patient_uuid (
  id uuid
);

-- Table: patient_visits
CREATE TABLE IF NOT EXISTS patient_visits (
  id int4 NOT NULL DEFAULT nextval('patient_visits_id_seq'::regclass),
  patient_id uuid,
  doctor_id uuid,
  appointment_id uuid,
  visit_date timestamptz NOT NULL,
  visit_type varchar(50),
  chief_complaint text,
  symptoms _text,
  diagnosis text,
  treatment text,
  prescription _text,
  next_visit_date timestamptz,
  created_by uuid,
  updated_by uuid,
  last_activity_at timestamptz DEFAULT now(),
  notes text,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Table: patients
CREATE TABLE IF NOT EXISTS patients (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  first_name varchar(255) NOT NULL,
  last_name varchar(255) NOT NULL,
  email varchar(255),
  phone varchar(50),
  date_of_birth date,
  gender varchar(20),
  address text,
  emergency_contact_name varchar(255),
  emergency_contact_phone varchar(50),
  medical_history text,
  allergies text,
  created_at timestamp DEFAULT now(),
  updated_at timestamp DEFAULT now(),
  public_id varchar(255),
  customer_id uuid,
  created_by uuid,
  updated_by uuid,
  last_activity_at timestamptz DEFAULT now(),
  emergency_contact_relation text,
  insurance_provider text,
  insurance_number text,
  medications _text,
  blood_type varchar(5),
  height_cm int4,
  weight_kg numeric,
  preferred_language varchar(10) DEFAULT 'ar'::character varying,
  communication_preferences jsonb DEFAULT '{}'::jsonb,
  tags _text,
  metadata jsonb DEFAULT '{}'::jsonb,
  user_id uuid
);

-- Table: payment_methods
CREATE TABLE IF NOT EXISTS payment_methods (
  id int4 NOT NULL DEFAULT nextval('payment_methods_id_seq'::regclass),
  patient_id uuid,
  method_type varchar(50) NOT NULL,
  provider varchar(50),
  account_number text,
  expiry_date date,
  is_default bool DEFAULT false,
  is_active bool DEFAULT true,
  created_by uuid,
  updated_by uuid,
  last_activity_at timestamptz DEFAULT now(),
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Table: payment_transactions
CREATE TABLE IF NOT EXISTS payment_transactions (
  id int4 NOT NULL DEFAULT nextval('payment_transactions_id_seq'::regclass),
  payment_id int4,
  transaction_type varchar(50) NOT NULL,
  amount numeric NOT NULL,
  status varchar(50) NOT NULL,
  gateway_transaction_id text,
  gateway_response jsonb,
  processed_at timestamptz,
  created_by uuid,
  updated_by uuid,
  last_activity_at timestamptz DEFAULT now(),
  notes text,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Table: payments
CREATE TABLE IF NOT EXISTS payments (
  id int4 NOT NULL DEFAULT nextval('payments_id_seq'::regclass),
  patient_id uuid,
  appointment_id uuid,
  amount numeric NOT NULL,
  status varchar(50) NOT NULL DEFAULT 'pending'::character varying,
  payment_date timestamptz DEFAULT now(),
  created_by uuid,
  updated_by uuid,
  last_activity_at timestamptz DEFAULT now(),
  payment_method varchar(50),
  transaction_id text,
  gateway_response jsonb,
  refund_amount numeric DEFAULT 0,
  refund_reason text,
  refunded_at timestamptz,
  refunded_by uuid,
  notes text,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  currency varchar(3) DEFAULT 'SAR'::character varying
);

-- Table: permissions
CREATE TABLE IF NOT EXISTS permissions (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  code varchar NOT NULL,
  name varchar NOT NULL,
  description text,
  category varchar,
  is_active bool DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Table: priority_levels
CREATE TABLE IF NOT EXISTS priority_levels (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  code varchar NOT NULL,
  name_ar varchar NOT NULL,
  name_en varchar NOT NULL,
  color varchar,
  order_index int4 DEFAULT 0,
  is_active bool DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Table: progress_assessments
CREATE TABLE IF NOT EXISTS progress_assessments (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  public_id varchar(255) NOT NULL DEFAULT ((('pas_'::text || to_char(now(), 'YYYYMMDD'::text)) || '_'::text) || "substring"(md5((random())::text), 1, 8)),
  patient_id uuid,
  assessment_type varchar(100),
  assessment_date date NOT NULL,
  score int4,
  notes text,
  assessor_id uuid,
  created_at timestamptz DEFAULT now()
);

-- Table: progress_goals
CREATE TABLE IF NOT EXISTS progress_goals (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  public_id varchar(255) NOT NULL DEFAULT ((('pgl_'::text || to_char(now(), 'YYYYMMDD'::text)) || '_'::text) || "substring"(md5((random())::text), 1, 8)),
  patient_id uuid,
  goal_title varchar(255) NOT NULL,
  description text,
  target_date date,
  progress_percentage int4 DEFAULT 0,
  status varchar(20) DEFAULT 'active'::character varying,
  created_by uuid,
  updated_by uuid,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Table: progress_reports
CREATE TABLE IF NOT EXISTS progress_reports (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  public_id varchar(255) NOT NULL DEFAULT ((('prp_'::text || to_char(now(), 'YYYYMMDD'::text)) || '_'::text) || "substring"(md5((random())::text), 1, 8)),
  patient_id uuid,
  report_title varchar(255) NOT NULL,
  report_date date NOT NULL,
  summary text,
  details jsonb DEFAULT '{}'::jsonb,
  created_by uuid,
  created_at timestamptz DEFAULT now()
);

-- Table: relationship_types
CREATE TABLE IF NOT EXISTS relationship_types (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  code varchar NOT NULL,
  name_ar varchar NOT NULL,
  name_en varchar NOT NULL,
  is_active bool DEFAULT true,
  order_index int4 DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Table: report_data
CREATE TABLE IF NOT EXISTS report_data (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  report_id uuid,
  data jsonb NOT NULL,
  generated_at timestamptz DEFAULT now(),
  generated_by uuid
);

-- Table: reports
CREATE TABLE IF NOT EXISTS reports (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  name varchar(255) NOT NULL,
  description text,
  report_type varchar(100) NOT NULL,
  parameters jsonb DEFAULT '{}'::jsonb,
  query_sql text,
  is_scheduled bool DEFAULT false,
  schedule_cron varchar(100),
  last_generated timestamptz,
  next_generation timestamptz,
  is_active bool DEFAULT true,
  created_by uuid,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Table: request_types
CREATE TABLE IF NOT EXISTS request_types (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  code varchar NOT NULL,
  name_ar varchar NOT NULL,
  name_en varchar NOT NULL,
  description text,
  icon varchar,
  color varchar,
  is_active bool DEFAULT true,
  order_index int4 DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Table: resources
CREATE TABLE IF NOT EXISTS resources (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  public_id varchar(255) NOT NULL DEFAULT ((('res_'::text || to_char(now(), 'YYYYMMDD'::text)) || '_'::text) || "substring"(md5((random())::text), 1, 8)),
  resource_title varchar(255) NOT NULL,
  resource_type varchar(50),
  description text,
  url text,
  file_path text,
  category varchar(100),
  tags jsonb DEFAULT '[]'::jsonb,
  is_public bool DEFAULT false,
  created_by uuid,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Table: reviews
CREATE TABLE IF NOT EXISTS reviews (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  conversation_id uuid,
  customer_id uuid,
  rating int4,
  feedback text,
  categories jsonb DEFAULT '{}'::jsonb,
  is_public bool DEFAULT false,
  is_verified bool DEFAULT false,
  verified_by uuid,
  verified_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Table: role_permissions
CREATE TABLE IF NOT EXISTS role_permissions (
  role_id uuid NOT NULL,
  permission_id uuid NOT NULL,
  is_active bool DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Table: roles
CREATE TABLE IF NOT EXISTS roles (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  name varchar(100) NOT NULL,
  display_name varchar(255) NOT NULL,
  description text,
  permissions jsonb DEFAULT '{}'::jsonb,
  is_system_role bool DEFAULT false,
  is_active bool DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Table: services
CREATE TABLE IF NOT EXISTS services (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  title_key varchar(255) NOT NULL,
  description_key varchar(255) NOT NULL,
  icon varchar(100),
  color varchar(50) DEFAULT 'text-blue-600'::character varying,
  bg_color varchar(50) DEFAULT 'bg-blue-50'::character varying,
  order_index int4 DEFAULT 0,
  is_active bool DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Table: session_statuses
CREATE TABLE IF NOT EXISTS session_statuses (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  code varchar NOT NULL,
  name_ar varchar NOT NULL,
  name_en varchar NOT NULL,
  color varchar,
  is_active bool DEFAULT true,
  order_index int4 DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Table: sessions
CREATE TABLE IF NOT EXISTS sessions (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  appointment_id uuid,
  patient_id uuid,
  doctor_id uuid,
  session_date date NOT NULL,
  session_time time NOT NULL,
  duration int4 DEFAULT 30,
  status varchar(50) DEFAULT 'scheduled'::character varying,
  diagnosis text,
  treatment_plan text,
  notes text,
  created_at timestamp DEFAULT now(),
  updated_at timestamp DEFAULT now(),
  public_id varchar(255),
  duration_minutes int4 DEFAULT 60,
  type varchar(50) DEFAULT 'therapy'::character varying,
  goals_achieved _text,
  next_session_goals _text
);

-- Table: settings
CREATE TABLE IF NOT EXISTS settings (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  public_id varchar(255) NOT NULL,
  key varchar(255) NOT NULL,
  value jsonb NOT NULL,
  description text,
  category varchar(100) DEFAULT 'general'::character varying,
  is_public bool DEFAULT false,
  updated_by uuid,
  created_at timestamp DEFAULT now(),
  updated_at timestamp DEFAULT now(),
  created_by uuid,
  last_modified_at timestamptz DEFAULT now(),
  version int4 DEFAULT 1,
  metadata jsonb DEFAULT '{}'::jsonb
);

-- Table: site_settings
CREATE TABLE IF NOT EXISTS site_settings (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  key varchar(255) NOT NULL,
  value jsonb NOT NULL,
  description text,
  category varchar(100) DEFAULT 'general'::character varying,
  is_public bool DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  updated_by uuid
);

-- Table: staff
CREATE TABLE IF NOT EXISTS staff (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  public_id varchar(20) NOT NULL,
  external_id varchar(50),
  user_id uuid,
  first_name varchar(100) NOT NULL,
  last_name varchar(100) NOT NULL,
  middle_name varchar(100),
  full_name varchar(200),
  email varchar(255) NOT NULL,
  phone varchar(20) NOT NULL,
  mobile varchar(20),
  whatsapp varchar(20),
  position varchar(100) NOT NULL,
  department varchar(100) NOT NULL,
  employee_id varchar(50) NOT NULL,
  hire_date date NOT NULL,
  salary numeric,
  work_hours_per_week int4 DEFAULT 40,
  address text,
  city varchar(100),
  region varchar(100),
  postal_code varchar(10),
  country varchar(50) DEFAULT 'Saudi Arabia'::character varying,
  status varchar(20) DEFAULT 'active'::character varying,
  is_active bool NOT NULL DEFAULT true,
  is_verified bool NOT NULL DEFAULT false,
  is_deleted bool NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  deleted_at timestamptz,
  last_login_at timestamptz,
  last_activity_at timestamptz NOT NULL DEFAULT now(),
  created_by uuid,
  updated_by uuid,
  deleted_by uuid,
  version int4 NOT NULL DEFAULT 1,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  tags _text DEFAULT '{}'::text[],
  search_vector tsvector
);

-- Table: support_sessions
CREATE TABLE IF NOT EXISTS support_sessions (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  public_id varchar(255) NOT NULL DEFAULT ((('sps_'::text || to_char(now(), 'YYYYMMDD'::text)) || '_'::text) || "substring"(md5((random())::text), 1, 8)),
  patient_id uuid,
  session_title varchar(255) NOT NULL,
  session_date date NOT NULL,
  session_time time,
  duration_minutes int4,
  session_type varchar(50),
  facilitator_id uuid,
  notes text,
  created_at timestamptz DEFAULT now()
);

-- Table: system_settings
CREATE TABLE IF NOT EXISTS system_settings (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  key varchar(255) NOT NULL,
  value text,
  data_type varchar(50) DEFAULT 'string'::character varying,
  description text,
  category varchar(100),
  is_public bool DEFAULT false,
  updated_by uuid,
  updated_at timestamptz DEFAULT now(),
  type varchar(50) DEFAULT 'string'::character varying,
  is_encrypted bool DEFAULT false,
  validation_rules jsonb DEFAULT '{}'::jsonb
);

-- Table: team_members
CREATE TABLE IF NOT EXISTS team_members (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  name varchar(255) NOT NULL,
  position_key varchar(255) NOT NULL,
  bio_key text,
  avatar_url varchar(1000),
  email varchar(255),
  phone varchar(50),
  social_links jsonb DEFAULT '{}'::jsonb,
  order_index int4 DEFAULT 0,
  is_active bool DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Table: testimonials
CREATE TABLE IF NOT EXISTS testimonials (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  name varchar(255) NOT NULL,
  position varchar(255),
  content_key varchar(500) NOT NULL,
  avatar_url varchar(1000),
  rating int4 DEFAULT 5,
  order_index int4 DEFAULT 0,
  is_active bool DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Table: therapist_uuid
CREATE TABLE IF NOT EXISTS therapist_uuid (
  id uuid
);

-- Table: therapy_goals
CREATE TABLE IF NOT EXISTS therapy_goals (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  therapy_session_id uuid,
  goal_title varchar NOT NULL,
  description text,
  target_date date,
  progress_percentage int4 DEFAULT 0,
  status varchar NOT NULL DEFAULT 'active'::character varying,
  created_by uuid,
  updated_by uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Table: therapy_sessions
CREATE TABLE IF NOT EXISTS therapy_sessions (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  public_id varchar DEFAULT ((('THR-'::text || to_char(now(), 'YYYYMMDD'::text)) || '-'::text) || "substring"(md5((random())::text), 1, 8)),
  patient_id uuid,
  therapist_id uuid,
  session_date date NOT NULL,
  session_time time NOT NULL,
  duration int4 NOT NULL DEFAULT 60,
  therapy_type varchar NOT NULL,
  status varchar NOT NULL DEFAULT 'scheduled'::character varying,
  goals _text,
  activities _text,
  progress_notes text,
  next_session_goals _text,
  created_by uuid,
  updated_by uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  last_activity_at timestamptz NOT NULL DEFAULT now(),
  metadata jsonb DEFAULT '{}'::jsonb
);

-- Table: therapy_types
CREATE TABLE IF NOT EXISTS therapy_types (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  code varchar NOT NULL,
  name_ar varchar NOT NULL,
  name_en varchar NOT NULL,
  description text,
  icon varchar,
  duration_minutes int4 DEFAULT 60,
  is_active bool DEFAULT true,
  order_index int4 DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Table: training_programs
CREATE TABLE IF NOT EXISTS training_programs (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  public_id varchar(255) NOT NULL DEFAULT ((('trp_'::text || to_char(now(), 'YYYYMMDD'::text)) || '_'::text) || "substring"(md5((random())::text), 1, 8)),
  program_name varchar(255) NOT NULL,
  description text,
  duration_weeks int4,
  difficulty_level varchar(20),
  program_type varchar(50),
  content jsonb DEFAULT '{}'::jsonb,
  is_active bool DEFAULT true,
  created_by uuid,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Table: training_progress
CREATE TABLE IF NOT EXISTS training_progress (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  public_id varchar(255) NOT NULL DEFAULT ((('tpr_'::text || to_char(now(), 'YYYYMMDD'::text)) || '_'::text) || "substring"(md5((random())::text), 1, 8)),
  patient_id uuid,
  program_id uuid,
  start_date date NOT NULL,
  completion_percentage int4 DEFAULT 0,
  status varchar(20) DEFAULT 'in_progress'::character varying,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Table: translations
CREATE TABLE IF NOT EXISTS translations (
  id int8 NOT NULL DEFAULT nextval('translations_id_seq'::regclass),
  locale text NOT NULL,
  namespace text NOT NULL DEFAULT 'common'::text,
  key text NOT NULL,
  value text NOT NULL,
  created_by uuid,
  approved_by uuid,
  approved_at timestamptz,
  metadata jsonb DEFAULT '{}'::jsonb,
  updated_at timestamptz DEFAULT now(),
  context text,
  is_active bool DEFAULT true
);

-- Table: user_permissions
CREATE TABLE IF NOT EXISTS user_permissions (
  user_id uuid NOT NULL,
  permission_id uuid NOT NULL,
  is_active bool DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Table: user_preferences
CREATE TABLE IF NOT EXISTS user_preferences (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid,
  theme varchar(20) DEFAULT 'light'::character varying,
  language varchar(10) DEFAULT 'ar'::character varying,
  timezone varchar(50) DEFAULT 'Asia/Riyadh'::character varying,
  notifications_enabled bool DEFAULT true,
  sidebar_collapsed bool DEFAULT false,
  dashboard_layout jsonb DEFAULT '{}'::jsonb,
  created_at timestamp DEFAULT now(),
  updated_at timestamp DEFAULT now()
);

-- Table: user_roles
CREATE TABLE IF NOT EXISTS user_roles (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  user_id uuid,
  role_id uuid,
  assigned_by uuid,
  assigned_at timestamptz DEFAULT now(),
  expires_at timestamptz,
  is_active bool DEFAULT true
);

-- Table: user_uuid
CREATE TABLE IF NOT EXISTS user_uuid (
  id uuid
);

-- Table: users
CREATE TABLE IF NOT EXISTS users (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  email varchar(255) NOT NULL,
  password_hash varchar(255),
  name varchar(255) NOT NULL,
  role user_role NOT NULL DEFAULT 'agent'::user_role,
  status user_status NOT NULL DEFAULT 'active'::user_status,
  phone varchar(20),
  avatar_url text,
  timezone varchar(50) DEFAULT 'Asia/Riyadh'::character varying,
  language varchar(10) DEFAULT 'ar'::character varying,
  is_active bool NOT NULL DEFAULT true,
  last_login timestamptz,
  login_count int4 NOT NULL DEFAULT 0,
  failed_login_attempts int4 NOT NULL DEFAULT 0,
  locked_until timestamptz,
  preferences jsonb NOT NULL DEFAULT '{}'::jsonb,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  created_by uuid,
  updated_by uuid,
  last_password_change timestamptz DEFAULT now(),
  email_verified_at timestamptz,
  last_ip_address inet,
  last_user_agent text,
  last_activity_at timestamptz DEFAULT now(),
  total_sessions int4 DEFAULT 0,
  password_reset_token text,
  password_reset_expires timestamptz,
  email_verification_token text,
  email_verification_expires timestamptz,
  two_factor_enabled bool DEFAULT false,
  two_factor_secret text,
  backup_codes jsonb DEFAULT '[]'::jsonb
);

-- Table: whatsapp_configs
CREATE TABLE IF NOT EXISTS whatsapp_configs (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  business_account_id varchar(255) NOT NULL,
  phone_number varchar(20) NOT NULL,
  access_token text NOT NULL,
  webhook_verify_token varchar(255),
  webhook_url text,
  is_active bool DEFAULT true,
  message_count int4 DEFAULT 0,
  last_message_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Table: whatsapp_templates
CREATE TABLE IF NOT EXISTS whatsapp_templates (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  template_id varchar(255) NOT NULL,
  name varchar(255) NOT NULL,
  category varchar(100),
  language varchar(10) DEFAULT 'ar'::character varying,
  status varchar(50) DEFAULT 'pending'::character varying,
  components jsonb DEFAULT '[]'::jsonb,
  usage_count int4 DEFAULT 0,
  is_active bool DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

