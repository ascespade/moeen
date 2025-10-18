// Database type definitions
// These types match the database schema defined in the migrations

export interface UserPreferences {
  id: string;
  user_id: string;
  theme: 'light' | 'dark' | 'system';
  language: 'ar' | 'en';
  timezone: string;
  notifications_enabled: boolean;
  sidebar_collapsed: boolean;
  dashboard_layout: 'grid' | 'list';
  created_at: string;
  updated_at: string;
}

export interface Translation {
  id: string;
  locale: string;
  namespace: string;
  key: string;
  value: string;
  created_at: string;
  updated_at: string;
}

export interface User {
  id: string;
  email: string;
  password_hash?: string;
  full_name?: string;
  role: 'admin' | 'doctor' | 'user';
  avatar_url?: string;
  phone?: string;
  is_active: boolean;
  last_login_at?: string;
  created_at: string;
  updated_at: string;
}

export interface Profile {
  id: string;
  bio?: string;
  specialization?: string;
  license_number?: string;
  clinic_name?: string;
  address?: string;
  created_at: string;
  updated_at: string;
}

export interface Patient {
  id: string;
  public_id: string;
  name: string;
  age: number;
  phone: string;
  email?: string;
  emergency_contact?: string;
  medical_history: string[];
  created_at: string;
  updated_at: string;
}

export interface Doctor {
  id: string;
  public_id: string;
  name: string;
  specialty: string;
  phone?: string;
  email?: string;
  created_at: string;
  updated_at: string;
}

export interface Appointment {
  id: string;
  public_id: string;
  patient_id: string;
  doctor_id: string;
  appointment_date: string;
  appointment_time: string;
  type: string;
  status: 'scheduled' | 'confirmed' | 'completed' | 'cancelled';
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface Session {
  id: string;
  public_id: string;
  patient_id: string;
  doctor_id: string;
  session_date: string;
  session_time: string;
  type: string;
  notes?: string;
  exercises?: any; // JSONB
  completed: boolean;
  created_at: string;
  updated_at: string;
}

export interface InsuranceClaim {
  id: string;
  public_id: string;
  patient_id: string;
  claim_number: string;
  insurance_company: string;
  amount: number;
  status: 'submitted' | 'approved' | 'rejected' | 'pending';
  submitted_at: string;
  processed_at?: string;
  created_at: string;
  updated_at: string;
}

// Chatbot related types
export interface ChatbotFlow {
  id: string;
  public_id: string;
  name: string;
  description?: string;
  owner_id: string;
  status: 'draft' | 'active' | 'paused' | 'archived';
  created_at: string;
  updated_at: string;
}

export interface ChatbotNode {
  id: string;
  public_id: string;
  flow_id: string;
  type: 'start' | 'message' | 'question' | 'condition' | 'action' | 'end';
  name: string;
  content?: any; // JSONB
  position_x: number;
  position_y: number;
  created_at: string;
  updated_at: string;
}

export interface ChatbotEdge {
  id: string;
  public_id: string;
  flow_id: string;
  from_node_id: string;
  to_node_id: string;
  condition?: any; // JSONB
  created_at: string;
  updated_at: string;
}

// CRM related types
export interface CRMLead {
  id: string;
  public_id: string;
  name: string;
  email?: string;
  phone?: string;
  company?: string;
  source: string;
  status:
    | 'new'
    | 'contacted'
    | 'qualified'
    | 'proposal'
    | 'negotiation'
    | 'closed_won'
    | 'closed_lost';
  stage: string;
  owner_id: string;
  created_at: string;
  updated_at: string;
}

export interface CRMDeal {
  id: string;
  public_id: string;
  name: string;
  lead_id?: string;
  value: number;
  currency: string;
  stage:
    | 'prospecting'
    | 'qualification'
    | 'proposal'
    | 'negotiation'
    | 'closed_won'
    | 'closed_lost';
  probability: number;
  close_date?: string;
  owner_id: string;
  created_at: string;
  updated_at: string;
}

export interface CRMActivity {
  id: string;
  public_id: string;
  type: 'call' | 'email' | 'meeting' | 'task' | 'note';
  subject: string;
  description?: string;
  lead_id?: string;
  deal_id?: string;
  owner_id: string;
  due_date?: string;
  completed: boolean;
  created_at: string;
  updated_at: string;
}

// System types
export interface Notification {
  id: string;
  public_id: string;
  user_id: string;
  type: 'info' | 'warning' | 'error' | 'success';
  title: string;
  message: string;
  read: boolean;
  data?: any; // JSONB
  created_at: string;
  updated_at: string;
}

export interface InternalMessage {
  id: string;
  public_id: string;
  sender_id: string;
  recipient_id: string;
  subject: string;
  content: string;
  read: boolean;
  created_at: string;
  updated_at: string;
}

export interface AuditLog {
  id: string;
  public_id: string;
  user_id?: string;
  action: string;
  resource_type: string;
  resource_id: string;
  old_values?: any; // JSONB
  new_values?: any; // JSONB
  ip_address?: string;
  user_agent?: string;
  created_at: string;
}

export interface Setting {
  id: string;
  key: string;
  value: any; // JSONB
  description?: string;
  category: string;
  created_at: string;
  updated_at: string;
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T = any> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    total_pages: number;
  };
}

export interface UserPreferencesResponse {
  theme: string;
  language: string;
  timezone: string;
  notifications_enabled: boolean;
}

export interface TranslationResponse {
  locale: string;
  ns: string;
  messages: Record<string, string>;
  source: 'database' | 'fallback';
}
