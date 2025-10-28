import { _createClient } from '@supabase/supabase-js';
// Real Supabase Integration for Hemam Center
import type { Database } from '@/types/supabase';

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-anon-key';
const supabaseServiceKey =
  process.env.SUPABASE_SERVICE_ROLE || 'placeholder-service-key';

// Client for client-side operations
export const __supabase = createClient(supabaseUrl, supabaseAnonKey);

// Admin client for server-side operations
export const __supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

// Use a relaxed admin alias to mitigate strict generics during development
const admin: unknown = supabaseAdmin as any;

// Real Database Manager with actual Supabase queries
export class RealSupabaseManager {
  // User Management
  async createUser(_userData: {
    national_id?: string;
    name: string;
    name_en?: string;
    age?: number;
    gender?: 'male' | 'female';
    phone: string;
    email?: string;
    role: 'admin' | 'doctor' | 'therapist' | 'patient' | 'family_member';
    address?: string;
    city?: string;
    emergency_contact?: string;
    emergency_contact_relation?: string;
    insurance_provider?: string;
    insurance_number?: string;
    medical_history?: string[];
    current_conditions?: string[];
    medications?: string[];
    allergies?: string[];
  }) {
    const { data, error } = await admin
      .from('users')
      .insert([userData])
      .select()
      .single();

    if (error) throw new Error(`Failed to create user: ${error.message}`);
    return data;
  }

  async getUser(_userId: string) {
    const { data, error } = await admin
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) throw new Error(`Failed to get user: ${error.message}`);
    return data;
  }

  async getUserByPhone(_phone: string) {
    const { data, error } = await admin
      .from('users')
      .select('*')
      .eq('phone', phone)
      .single();

    if (error) throw new Error(`Failed to get user by phone: ${error.message}`);
    return data;
  }

  async updateUser(_userId: string, updates: unknown) {
    const { data, error } = await admin
      .from('users')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', userId)
      .select()
      .single();

    if (error) throw new Error(`Failed to update user: ${error.message}`);
    return data;
  }

  async searchUsers(_searchTerm: string, role?: string) {
    let query = supabaseAdmin
      .from('users')
      .select('*')
      .or(
        `name.ilike.%${searchTerm}%,national_id.ilike.%${searchTerm}%,phone.ilike.%${searchTerm}%`
      )
      .order('created_at', { ascending: false });

    if (role) {
      query = query.eq('role', role);
    }

    const { data, error } = await query;

    if (error) throw new Error(`Failed to search users: ${error.message}`);
    return data;
  }

  // Doctor Management
  async createDoctor(_doctorData: {
    id: string;
    license_number: string;
    specialty: string;
    qualifications?: string[];
    experience_years?: number;
    consultation_fee?: number;
    is_available?: boolean;
    working_hours?: unknown;
  }) {
    const { data, error } = await admin
      .from('doctors')
      .insert([doctorData])
      .select()
      .single();

    if (error) throw new Error(`Failed to create doctor: ${error.message}`);
    return data;
  }

  async getDoctor(_doctorId: string) {
    const { data, error } = await admin
      .from('doctors')
      .select(
        `
        *,
        users!doctors_id_fkey(*)
      `
      )
      .eq('id', doctorId)
      .single();

    if (error) throw new Error(`Failed to get doctor: ${error.message}`);
    return data;
  }

  async getDoctorsBySpecialty(_specialty: string) {
    const { data, error } = await admin
      .from('doctors')
      .select(
        `
        *,
        users!doctors_id_fkey(*)
      `
      )
      .eq('specialty', specialty)
      .eq('is_available', true);

    if (error)
      throw new Error(`Failed to get doctors by specialty: ${error.message}`);
    return data;
  }

  // Patient Management
  async createPatient(_patientData: {
    id: string;
    guardian_name?: string;
    guardian_relation?: string;
    guardian_phone?: string;
    medical_conditions?: string[];
    treatment_goals?: string[];
    assigned_doctor_id?: string;
    assigned_therapist_id?: string;
    admission_date?: string;
    status?: string;
  }) {
    const { data, error } = await admin
      .from('patients')
      .insert([patientData])
      .select()
      .single();

    if (error) throw new Error(`Failed to create patient: ${error.message}`);
    return data;
  }

  async getPatient(_patientId: string) {
    const { data, error } = await supabaseAdmin
      .from('patients')
      .select(
        `
        *,
        users!patients_id_fkey(*),
        doctors!patients_assigned_doctor_id_fkey(*),
        family_members(*)
      `
      )
      .eq('id', patientId)
      .single();

    if (error) throw new Error(`Failed to get patient: ${error.message}`);
    return data;
  }

  async getPatientsByDoctor(_doctorId: string) {
    const { data, error } = await supabaseAdmin
      .from('patients')
      .select(
        `
        *,
        users!patients_id_fkey(*)
      `
      )
      .eq('assigned_doctor_id', doctorId);

    if (error)
      throw new Error(`Failed to get patients by doctor: ${error.message}`);
    return data;
  }

  // Appointment Management
  async createAppointment(_appointmentData: {
    patient_id: string;
    doctor_id: string;
    appointment_date: string;
    appointment_time: string;
    duration_minutes?: number;
    type: 'assessment' | 'treatment' | 'follow_up' | 'consultation';
    notes?: string;
    insurance_covered?: boolean;
    insurance_approval_number?: string;
    created_by: string;
  }) {
    const { data, error } = await admin
      .from('appointments')
      .insert([appointmentData])
      .select(
        `
        *,
        patients!appointments_patient_id_fkey(
          *,
          users!patients_id_fkey(*)
        ),
        doctors!appointments_doctor_id_fkey(
          *,
          users!doctors_id_fkey(*)
        )
      `
      )
      .single();

    if (error)
      throw new Error(`Failed to create appointment: ${error.message}`);
    return data;
  }

  async getAppointments(
    filters: {
      patientId?: string;
      doctorId?: string;
      date?: string;
      status?: string;
      limit?: number;
      offset?: number;
    } = {}
  ) {
    let query = admin.from('appointments').select(`
        *,
        patients!appointments_patient_id_fkey(
          *,
          users!patients_id_fkey(*)
        ),
        doctors!appointments_doctor_id_fkey(
          *,
          users!doctors_id_fkey(*)
        )
      `);

    if (filters.patientId) query = query.eq('patient_id', filters.patientId);
    if (filters.doctorId) query = query.eq('doctor_id', filters.doctorId);
    if (filters.date) query = query.eq('appointment_date', filters.date);
    if (filters.status) query = query.eq('status', filters.status);

    query = query.order('appointment_date', { ascending: true });

    if (filters.limit) query = query.limit(filters.limit);
    if (filters.offset)
      query = query.range(
        filters.offset,
        filters.offset + (filters.limit || 10) - 1
      );

    const { data, error } = await query;

    if (error) throw new Error(`Failed to get appointments: ${error.message}`);
    return data;
  }

  async updateAppointment(_appointmentId: string, updates: unknown) {
    const { data, error } = await admin
      .from('appointments')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', appointmentId)
      .select()
      .single();

    if (error)
      throw new Error(`Failed to update appointment: ${error.message}`);
    return data;
  }

  // Session Management
  async createSession(_sessionData: {
    patient_id: string;
    doctor_id: string;
    appointment_id?: string;
    session_date: string;
    session_time: string;
    duration_minutes?: number;
    type: 'assessment' | 'treatment' | 'follow_up' | 'consultation';
    notes?: string;
    exercises?: unknown;
    insurance_claim_number?: string;
  }) {
    const { data, error } = await admin
      .from('sessions')
      .insert([sessionData])
      .select(
        `
        *,
        patients!sessions_patient_id_fkey(
          *,
          users!patients_id_fkey(*)
        ),
        doctors!sessions_doctor_id_fkey(
          *,
          users!doctors_id_fkey(*)
        )
      `
      )
      .single();

    if (error) throw new Error(`Failed to create session: ${error.message}`);
    return data;
  }

  async getSessions(_patientId: string, limit?: number) {
    let query = admin
      .from('sessions')
      .select(
        `
        *,
        doctors!sessions_doctor_id_fkey(
          *,
          users!doctors_id_fkey(*)
        )
      `
      )
      .eq('patient_id', patientId)
      .order('session_date', { ascending: false });

    if (limit) query = query.limit(limit);

    const { data, error } = await query;

    if (error) throw new Error(`Failed to get sessions: ${error.message}`);
    return data;
  }

  async updateSession(_sessionId: string, updates: unknown) {
    const { data, error } = await admin
      .from('sessions')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', sessionId)
      .select()
      .single();

    if (error) throw new Error(`Failed to update session: ${error.message}`);
    return data;
  }

  // Conversation Management
  async logConversation(_conversationData: {
    patient_id: string;
    session_id?: string;
    message_type:
      | 'text'
      | 'template'
      | 'image'
      | 'document'
      | 'audio'
      | 'video';
    content: string;
    response?: string;
    sentiment?: string;
    crisis_level?: 'normal' | 'urgent' | 'crisis';
    metadata?: unknown;
  }) {
    const { data, error } = await admin
      .from('conversations')
      .insert([conversationData])
      .select()
      .single();

    if (error) throw new Error(`Failed to log conversation: ${error.message}`);
    return data;
  }

  async getConversations(_patientId: string, limit?: number) {
    let query = admin
      .from('conversations')
      .select('*')
      .eq('patient_id', patientId)
      .order('created_at', { ascending: false });

    if (limit) query = query.limit(limit);

    const { data, error } = await query;

    if (error) throw new Error(`Failed to get conversations: ${error.message}`);
    return data;
  }

  // Insurance Claims
  async createInsuranceClaim(_claimData: {
    patient_id: string;
    appointment_id?: string;
    session_id?: string;
    insurance_provider: string;
    claim_number: string;
    service_code?: string;
    diagnosis_code?: string;
    amount: number;
    status?: string;
  }) {
    const { data, error } = await admin
      .from('insurance_claims')
      .insert([claimData])
      .select()
      .single();

    if (error)
      throw new Error(`Failed to create insurance claim: ${error.message}`);
    return data;
  }

  async getInsuranceClaims(_patientId: string) {
    const { data, error } = await admin
      .from('insurance_claims')
      .select('*')
      .eq('patient_id', patientId)
      .order('submitted_at', { ascending: false });

    if (error)
      throw new Error(`Failed to get insurance claims: ${error.message}`);
    return data;
  }

  async updateInsuranceClaim(_claimId: string, updates: unknown) {
    const { data, error } = await admin
      .from('insurance_claims')
      .update(updates)
      .eq('id', claimId)
      .select()
      .single();

    if (error)
      throw new Error(`Failed to update insurance claim: ${error.message}`);
    return data;
  }

  // Notifications
  async createNotification(_notificationData: {
    user_id: string;
    type: string;
    priority?: 'low' | 'medium' | 'high' | 'critical';
    title: string;
    message: string;
    data?: unknown;
  }) {
    const { data, error } = await admin
      .from('notifications')
      .insert([notificationData])
      .select()
      .single();

    if (error)
      throw new Error(`Failed to create notification: ${error.message}`);
    return data;
  }

  async getNotifications(_userId: string, unreadOnly?: boolean) {
    let query = admin
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (unreadOnly) query = query.eq('is_read', false);

    const { data, error } = await query;

    if (error) throw new Error(`Failed to get notifications: ${error.message}`);
    return data;
  }

  async markNotificationAsRead(_notificationId: string) {
    const { data, error } = await admin
      .from('notifications')
      .update({ is_read: true })
      .eq('id', notificationId)
      .select()
      .single();

    if (error)
      throw new Error(`Failed to mark notification as read: ${error.message}`);
    return data;
  }

  // Analytics
  async getPatientStats() {
    const { data, error } = await admin
      .from('users')
      .select('id, created_at, role')
      .eq('role', 'patient');

    if (error) throw new Error(`Failed to get patient stats: ${error.message}`);

    const __total = (data as any[]).length;
    const __active = (data as any[]).filter(
      (_p: unknown) => p.created_at
    ).length;
    const __newLast30Days = (data as any[]).filter((_p: unknown) => {
      const __createdAt = new Date(p.created_at as string);
      const __thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      return createdAt >= thirtyDaysAgo;
    }).length;

    return { total, active, newLast30Days };
  }

  async getAppointmentStats() {
    const { data, error } = await admin
      .from('appointments')
      .select('status, appointment_date, created_at');

    if (error)
      throw new Error(`Failed to get appointment stats: ${error.message}`);

    const __total = (data as any[]).length;
    const __completed = (data as any[]).filter(
      (_a: unknown) => a.status === 'completed'
    ).length;
    const __cancelled = (data as any[]).filter(
      (_a: unknown) => a.status === 'cancelled'
    ).length;
    const __upcoming = (data as any[]).filter((_a: unknown) => {
      const __appointmentDate = new Date(a.appointment_date as string);
      return appointmentDate >= new Date() && a.status === 'scheduled';
    }).length;

    return { total, completed, cancelled, upcoming };
  }

  async getConversationStats() {
    const { data, error } = await admin
      .from('conversations')
      .select('crisis_level, created_at');

    if (error)
      throw new Error(`Failed to get conversation stats: ${error.message}`);

    const __total = (data as any[]).length;
    const __crisis = (data as any[]).filter(
      (_c: unknown) => c.crisis_level === 'crisis'
    ).length;
    const __recent = (data as any[]).filter((_c: unknown) => {
      const __createdAt = new Date(c.created_at as string);
      const __sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      return createdAt >= sevenDaysAgo;
    }).length;

    return { total, crisis, recent };
  }

  // Health Check
  async healthCheck() {
    try {
      const { data: _d, error } = await admin
        .from('users')
        .select('id')
        .limit(1);

      if (error) throw error;

      return {
        status: 'healthy',
        connected: true,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      const __err = error as Error;
      return {
        status: 'unhealthy',
        connected: false,
        error: err.message,
        timestamp: new Date().toISOString(),
      };
    }
  }

  // Audit Logging
  async logAudit(_auditData: {
    user_id?: string;
    action: string;
    table_name?: string;
    record_id?: string;
    old_values?: unknown;
    new_values?: unknown;
    ip_address?: string;
    user_agent?: string;
  }) {
    const { data, error } = await admin
      .from('audit_logs')
      .insert([auditData])
      .select()
      .single();

    if (error) {
      return null;
    }
    return data;
  }
}

export const __realDB = new RealSupabaseManager();
