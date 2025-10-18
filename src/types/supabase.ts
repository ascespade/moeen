// Generated Supabase types for Hemam Center
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          national_id: string | null;
          name: string;
          name_en: string | null;
          age: number | null;
          gender: string | null;
          phone: string;
          email: string | null;
          role: 'admin' | 'doctor' | 'therapist' | 'patient' | 'family_member';
          avatar_url: string | null;
          address: string | null;
          city: string | null;
          emergency_contact: string | null;
          emergency_contact_relation: string | null;
          insurance_provider: string | null;
          insurance_number: string | null;
          medical_history: string[] | null;
          current_conditions: string[] | null;
          medications: string[] | null;
          allergies: string[] | null;
          preferred_language: string | null;
          timezone: string | null;
          is_active: boolean | null;
          last_login: string | null;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          id: string;
          national_id?: string | null;
          name: string;
          name_en?: string | null;
          age?: number | null;
          gender?: string | null;
          phone: string;
          email?: string | null;
          role?: 'admin' | 'doctor' | 'therapist' | 'patient' | 'family_member';
          avatar_url?: string | null;
          address?: string | null;
          city?: string | null;
          emergency_contact?: string | null;
          emergency_contact_relation?: string | null;
          insurance_provider?: string | null;
          insurance_number?: string | null;
          medical_history?: string[] | null;
          current_conditions?: string[] | null;
          medications?: string[] | null;
          allergies?: string[] | null;
          preferred_language?: string | null;
          timezone?: string | null;
          is_active?: boolean | null;
          last_login?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: {
          id?: string;
          national_id?: string | null;
          name?: string;
          name_en?: string | null;
          age?: number | null;
          gender?: string | null;
          phone?: string;
          email?: string | null;
          role?: 'admin' | 'doctor' | 'therapist' | 'patient' | 'family_member';
          avatar_url?: string | null;
          address?: string | null;
          city?: string | null;
          emergency_contact?: string | null;
          emergency_contact_relation?: string | null;
          insurance_provider?: string | null;
          insurance_number?: string | null;
          medical_history?: string[] | null;
          current_conditions?: string[] | null;
          medications?: string[] | null;
          allergies?: string[] | null;
          preferred_language?: string | null;
          timezone?: string | null;
          is_active?: boolean | null;
          last_login?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
      };
      doctors: {
        Row: {
          id: string;
          license_number: string;
          specialty: string;
          qualifications: string[] | null;
          experience_years: number | null;
          consultation_fee: number | null;
          is_available: boolean | null;
          working_hours: Json | null;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          id: string;
          license_number: string;
          specialty: string;
          qualifications?: string[] | null;
          experience_years?: number | null;
          consultation_fee?: number | null;
          is_available?: boolean | null;
          working_hours?: Json | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: {
          id?: string;
          license_number?: string;
          specialty?: string;
          qualifications?: string[] | null;
          experience_years?: number | null;
          consultation_fee?: number | null;
          is_available?: boolean | null;
          working_hours?: Json | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
      };
      patients: {
        Row: {
          id: string;
          guardian_name: string | null;
          guardian_relation: string | null;
          guardian_phone: string | null;
          medical_conditions: string[] | null;
          treatment_goals: string[] | null;
          assigned_doctor_id: string | null;
          assigned_therapist_id: string | null;
          admission_date: string | null;
          discharge_date: string | null;
          status: string | null;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          id: string;
          guardian_name?: string | null;
          guardian_relation?: string | null;
          guardian_phone?: string | null;
          medical_conditions?: string[] | null;
          treatment_goals?: string[] | null;
          assigned_doctor_id?: string | null;
          assigned_therapist_id?: string | null;
          admission_date?: string | null;
          discharge_date?: string | null;
          status?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: {
          id?: string;
          guardian_name?: string | null;
          guardian_relation?: string | null;
          guardian_phone?: string | null;
          medical_conditions?: string[] | null;
          treatment_goals?: string[] | null;
          assigned_doctor_id?: string | null;
          assigned_therapist_id?: string | null;
          admission_date?: string | null;
          discharge_date?: string | null;
          status?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
      };
      family_members: {
        Row: {
          id: string;
          patient_id: string;
          name: string;
          relationship: string;
          phone: string;
          email: string | null;
          is_primary_contact: boolean | null;
          notifications_enabled: boolean | null;
          created_at: string | null;
        };
        Insert: {
          id?: string;
          patient_id: string;
          name: string;
          relationship: string;
          phone: string;
          email?: string | null;
          is_primary_contact?: boolean | null;
          notifications_enabled?: boolean | null;
          created_at?: string | null;
        };
        Update: {
          id?: string;
          patient_id?: string;
          name?: string;
          relationship?: string;
          phone?: string;
          email?: string | null;
          is_primary_contact?: boolean | null;
          notifications_enabled?: boolean | null;
          created_at?: string | null;
        };
      };
      appointments: {
        Row: {
          id: string;
          patient_id: string;
          doctor_id: string;
          appointment_date: string;
          appointment_time: string;
          duration_minutes: number | null;
          type: 'assessment' | 'treatment' | 'follow_up' | 'consultation';
          status:
            | 'scheduled'
            | 'confirmed'
            | 'in_progress'
            | 'completed'
            | 'cancelled'
            | 'no_show'
            | null;
          notes: string | null;
          insurance_covered: boolean | null;
          insurance_approval_number: string | null;
          created_by: string | null;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          id?: string;
          patient_id: string;
          doctor_id: string;
          appointment_date: string;
          appointment_time: string;
          duration_minutes?: number | null;
          type: 'assessment' | 'treatment' | 'follow_up' | 'consultation';
          status?:
            | 'scheduled'
            | 'confirmed'
            | 'in_progress'
            | 'completed'
            | 'cancelled'
            | 'no_show'
            | null;
          notes?: string | null;
          insurance_covered?: boolean | null;
          insurance_approval_number?: string | null;
          created_by?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: {
          id?: string;
          patient_id?: string;
          doctor_id?: string;
          appointment_date?: string;
          appointment_time?: string;
          duration_minutes?: number | null;
          type?: 'assessment' | 'treatment' | 'follow_up' | 'consultation';
          status?:
            | 'scheduled'
            | 'confirmed'
            | 'in_progress'
            | 'completed'
            | 'cancelled'
            | 'no_show'
            | null;
          notes?: string | null;
          insurance_covered?: boolean | null;
          insurance_approval_number?: string | null;
          created_by?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
      };
      sessions: {
        Row: {
          id: string;
          patient_id: string;
          doctor_id: string;
          appointment_id: string | null;
          session_date: string;
          session_time: string;
          duration_minutes: number | null;
          type: 'assessment' | 'treatment' | 'follow_up' | 'consultation';
          notes: string | null;
          exercises: Json | null;
          completed: boolean | null;
          insurance_claim_number: string | null;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          id?: string;
          patient_id: string;
          doctor_id: string;
          appointment_id?: string | null;
          session_date: string;
          session_time: string;
          duration_minutes?: number | null;
          type: 'assessment' | 'treatment' | 'follow_up' | 'consultation';
          notes?: string | null;
          exercises?: Json | null;
          completed?: boolean | null;
          insurance_claim_number?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: {
          id?: string;
          patient_id?: string;
          doctor_id?: string;
          appointment_id?: string | null;
          session_date?: string;
          session_time?: string;
          duration_minutes?: number | null;
          type?: 'assessment' | 'treatment' | 'follow_up' | 'consultation';
          notes?: string | null;
          exercises?: Json | null;
          completed?: boolean | null;
          insurance_claim_number?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
      };
      conversations: {
        Row: {
          id: string;
          patient_id: string;
          session_id: string | null;
          message_type:
            | 'text'
            | 'template'
            | 'image'
            | 'document'
            | 'audio'
            | 'video';
          content: string;
          response: string | null;
          sentiment: string | null;
          crisis_level: 'normal' | 'urgent' | 'crisis' | null;
          metadata: Json | null;
          created_at: string | null;
        };
        Insert: {
          id?: string;
          patient_id: string;
          session_id?: string | null;
          message_type:
            | 'text'
            | 'template'
            | 'image'
            | 'document'
            | 'audio'
            | 'video';
          content: string;
          response?: string | null;
          sentiment?: string | null;
          crisis_level?: 'normal' | 'urgent' | 'crisis' | null;
          metadata?: Json | null;
          created_at?: string | null;
        };
        Update: {
          id?: string;
          patient_id?: string;
          session_id?: string | null;
          message_type?:
            | 'text'
            | 'template'
            | 'image'
            | 'document'
            | 'audio'
            | 'video';
          content?: string;
          response?: string | null;
          sentiment?: string | null;
          crisis_level?: 'normal' | 'urgent' | 'crisis' | null;
          metadata?: Json | null;
          created_at?: string | null;
        };
      };
      message_templates: {
        Row: {
          id: string;
          name: string;
          category: string;
          content: string;
          variables: string[] | null;
          language: string | null;
          approved: boolean | null;
          created_by: string | null;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          id?: string;
          name: string;
          category: string;
          content: string;
          variables?: string[] | null;
          language?: string | null;
          approved?: boolean | null;
          created_by?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: {
          id?: string;
          name?: string;
          category?: string;
          content?: string;
          variables?: string[] | null;
          language?: string | null;
          approved?: boolean | null;
          created_by?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
      };
      notifications: {
        Row: {
          id: string;
          user_id: string;
          type: string;
          priority: 'low' | 'medium' | 'high' | 'critical' | null;
          title: string;
          message: string;
          data: Json | null;
          is_read: boolean | null;
          sent_at: string | null;
          created_at: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          type: string;
          priority?: 'low' | 'medium' | 'high' | 'critical' | null;
          title: string;
          message: string;
          data?: Json | null;
          is_read?: boolean | null;
          sent_at?: string | null;
          created_at?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          type?: string;
          priority?: 'low' | 'medium' | 'high' | 'critical' | null;
          title?: string;
          message?: string;
          data?: Json | null;
          is_read?: boolean | null;
          sent_at?: string | null;
          created_at?: string | null;
        };
      };
      insurance_claims: {
        Row: {
          id: string;
          patient_id: string;
          appointment_id: string | null;
          session_id: string | null;
          insurance_provider: string;
          claim_number: string;
          service_code: string | null;
          diagnosis_code: string | null;
          amount: number;
          status: string | null;
          submitted_at: string | null;
          processed_at: string | null;
          rejection_reason: string | null;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          id?: string;
          patient_id: string;
          appointment_id?: string | null;
          session_id?: string | null;
          insurance_provider: string;
          claim_number: string;
          service_code?: string | null;
          diagnosis_code?: string | null;
          amount: number;
          status?: string | null;
          submitted_at?: string | null;
          processed_at?: string | null;
          rejection_reason?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: {
          id?: string;
          patient_id?: string;
          appointment_id?: string | null;
          session_id?: string | null;
          insurance_provider?: string;
          claim_number?: string;
          service_code?: string | null;
          diagnosis_code?: string | null;
          amount?: number;
          status?: string | null;
          submitted_at?: string | null;
          processed_at?: string | null;
          rejection_reason?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
      };
      center_settings: {
        Row: {
          id: string;
          key: string;
          value: Json;
          description: string | null;
          updated_by: string | null;
          updated_at: string | null;
        };
        Insert: {
          id?: string;
          key: string;
          value: Json;
          description?: string | null;
          updated_by?: string | null;
          updated_at?: string | null;
        };
        Update: {
          id?: string;
          key?: string;
          value?: Json;
          description?: string | null;
          updated_by?: string | null;
          updated_at?: string | null;
        };
      };
      audit_logs: {
        Row: {
          id: string;
          user_id: string | null;
          action: string;
          table_name: string | null;
          record_id: string | null;
          old_values: Json | null;
          new_values: Json | null;
          ip_address: string | null;
          user_agent: string | null;
          created_at: string | null;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          action: string;
          table_name?: string | null;
          record_id?: string | null;
          old_values?: Json | null;
          new_values?: Json | null;
          ip_address?: string | null;
          user_agent?: string | null;
          created_at?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string | null;
          action?: string;
          table_name?: string | null;
          record_id?: string | null;
          old_values?: Json | null;
          new_values?: Json | null;
          ip_address?: string | null;
          user_agent?: string | null;
          created_at?: string | null;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      user_role: 'admin' | 'doctor' | 'therapist' | 'patient' | 'family_member';
      appointment_status:
        | 'scheduled'
        | 'confirmed'
        | 'in_progress'
        | 'completed'
        | 'cancelled'
        | 'no_show';
      session_type: 'assessment' | 'treatment' | 'follow_up' | 'consultation';
      message_type:
        | 'text'
        | 'template'
        | 'image'
        | 'document'
        | 'audio'
        | 'video';
      crisis_level: 'normal' | 'urgent' | 'crisis';
      notification_priority: 'low' | 'medium' | 'high' | 'critical';
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}
