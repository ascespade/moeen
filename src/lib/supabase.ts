import { createClient } from "@supabase/supabase-js";

// Supabase Integration for Hemam Center

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE!;

// Client for client-side operations
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Admin client for server-side operations
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

// Database Types
export interface Patient {
  id: string;
  national_id: string;
  name: string;
  name_en?: string;
  age: number;
  gender: "male" | "female";
  phone: string;
  email?: string;
  emergency_contact: string;
  emergency_contact_relation: string;
  address: string;
  city: string;
  insurance_provider?: string;
  insurance_number?: string;
  medical_history: string[];
  current_conditions: string[];
  medications: string[];
  allergies: string[];
  created_at: string;
  updated_at: string;
  status: "active" | "inactive" | "suspended";
}

export interface Doctor {
  id: string;
  national_id: string;
  name: string;
  name_en?: string;
  specialty: string;
  license_number: string;
  phone: string;
  email: string;
  qualifications: string[];
  experience_years: number;
  created_at: string;
  status: "active" | "inactive";
}

export interface Appointment {
  id: string;
  patient_id: string;
  doctor_id: string;
  appointment_date: string;
  appointment_time: string;
  type: "assessment" | "treatment" | "follow_up" | "consultation";
  status:
    | "scheduled"
    | "confirmed"
    | "in_progress"
    | "completed"
    | "cancelled"
    | "no_show";
  notes?: string;
  insurance_covered: boolean;
  insurance_approval_number?: string;
  created_at: string;
  updated_at: string;
}

export interface Session {
  id: string;
  patient_id: string;
  doctor_id: string;
  session_date: string;
  session_time: string;
  type: "assessment" | "treatment" | "follow_up";
  notes: string;
  exercises: any[];
  completed: boolean;
  insurance_claim_number?: string;
  created_at: string;
}

export interface InsuranceClaim {
  id: string;
  patient_id: string;
  appointment_id?: string;
  session_id?: string;
  insurance_provider: string;
  claim_number: string;
  amount: number;
  status: "pending" | "approved" | "rejected" | "under_review";
  submitted_at: string;
  processed_at?: string;
  rejection_reason?: string;
}

// Supabase Database Manager
export class SupabaseDatabaseManager {
  // Patient Management
  async createPatient(
    patientData: Omit<Patient, "id" | "created_at" | "updated_at">,
  ) {
    const { data, error } = await supabaseAdmin
      .from("patients")
      .insert([patientData])
      .select()
      .single();

    if (error) throw new Error(`Failed to create patient: ${error.message}`);
    return data;
  }

  async getPatient(patientId: string) {
    const { data, error } = await supabaseAdmin
      .from("patients")
      .select("*")
      .eq("id", patientId)
      .single();

    if (error) throw new Error(`Failed to get patient: ${error.message}`);
    return data;
  }

  async getPatientByNationalId(nationalId: string) {
    const { data, error } = await supabaseAdmin
      .from("patients")
      .select("*")
      .eq("national_id", nationalId)
      .single();

    if (error)
      throw new Error(`Failed to get patient by national ID: ${error.message}`);
    return data;
  }

  async updatePatient(patientId: string, updates: Partial<Patient>) {
    const { data, error } = await supabaseAdmin
      .from("patients")
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq("id", patientId)
      .select()
      .single();

    if (error) throw new Error(`Failed to update patient: ${error.message}`);
    return data;
  }

  async searchPatients(searchTerm: string) {
    const { data, error } = await supabaseAdmin
      .from("patients")
      .select("*")
      .or(
        `name.ilike.%${searchTerm}%,national_id.ilike.%${searchTerm}%,phone.ilike.%${searchTerm}%`,
      )
      .order("created_at", { ascending: false });

    if (error) throw new Error(`Failed to search patients: ${error.message}`);
    return data;
  }

  // Doctor Management
  async createDoctor(doctorData: Omit<Doctor, "id" | "created_at">) {
    const { data, error } = await supabaseAdmin
      .from("doctors")
      .insert([doctorData])
      .select()
      .single();

    if (error) throw new Error(`Failed to create doctor: ${error.message}`);
    return data;
  }

  async getDoctor(doctorId: string) {
    const { data, error } = await supabaseAdmin
      .from("doctors")
      .select("*")
      .eq("id", doctorId)
      .single();

    if (error) throw new Error(`Failed to get doctor: ${error.message}`);
    return data;
  }

  async getDoctorsBySpecialty(specialty: string) {
    const { data, error } = await supabaseAdmin
      .from("doctors")
      .select("*")
      .eq("specialty", specialty)
      .eq("status", "active");

    if (error)
      throw new Error(`Failed to get doctors by specialty: ${error.message}`);
    return data;
  }

  // Appointment Management
  async createAppointment(
    appointmentData: Omit<Appointment, "id" | "created_at" | "updated_at">,
  ) {
    const { data, error } = await supabaseAdmin
      .from("appointments")
      .insert([appointmentData])
      .select()
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
    } = {},
  ) {
    let query = supabaseAdmin.from("appointments").select(`
      *,
      patients!appointments_patient_id_fkey(name, phone),
      doctors!appointments_doctor_id_fkey(name, specialty)
    `);

    if (filters.patientId) query = query.eq("patient_id", filters.patientId);
    if (filters.doctorId) query = query.eq("doctor_id", filters.doctorId);
    if (filters.date) query = query.eq("appointment_date", filters.date);
    if (filters.status) query = query.eq("status", filters.status);

    const { data, error } = await query.order("appointment_date", {
      ascending: true,
    });

    if (error) throw new Error(`Failed to get appointments: ${error.message}`);
    return data;
  }

  async updateAppointment(
    appointmentId: string,
    updates: Partial<Appointment>,
  ) {
    const { data, error } = await supabaseAdmin
      .from("appointments")
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq("id", appointmentId)
      .select()
      .single();

    if (error)
      throw new Error(`Failed to update appointment: ${error.message}`);
    return data;
  }

  // Session Management
  async createSession(sessionData: Omit<Session, "id" | "created_at">) {
    const { data, error } = await supabaseAdmin
      .from("sessions")
      .insert([sessionData])
      .select()
      .single();

    if (error) throw new Error(`Failed to create session: ${error.message}`);
    return data;
  }

  async getSessions(patientId: string) {
    const { data, error } = await supabaseAdmin
      .from("sessions")
      .select(
        `
        *,
        doctors!sessions_doctor_id_fkey(name, specialty)
      `,
      )
      .eq("patient_id", patientId)
      .order("session_date", { ascending: false });

    if (error) throw new Error(`Failed to get sessions: ${error.message}`);
    return data;
  }

  // Insurance Claims
  async createInsuranceClaim(
    claimData: Omit<InsuranceClaim, "id" | "submitted_at">,
  ) {
    const { data, error } = await supabaseAdmin
      .from("insurance_claims")
      .insert([
        {
          ...claimData,
          submitted_at: new Date().toISOString(),
        },
      ])
      .select()
      .single();

    if (error)
      throw new Error(`Failed to create insurance claim: ${error.message}`);
    return data;
  }

  async getInsuranceClaims(patientId: string) {
    const { data, error } = await supabaseAdmin
      .from("insurance_claims")
      .select("*")
      .eq("patient_id", patientId)
      .order("submitted_at", { ascending: false });

    if (error)
      throw new Error(`Failed to get insurance claims: ${error.message}`);
    return data;
  }

  async updateInsuranceClaim(
    claimId: string,
    updates: Partial<InsuranceClaim>,
  ) {
    const { data, error } = await supabaseAdmin
      .from("insurance_claims")
      .update(updates)
      .eq("id", claimId)
      .select()
      .single();

    if (error)
      throw new Error(`Failed to update insurance claim: ${error.message}`);
    return data;
  }

  // Analytics
  async getPatientStats() {
    const { data, error } = await supabaseAdmin
      .from("patients")
      .select("id, created_at, status");

    if (error) throw new Error(`Failed to get patient stats: ${error.message}`);

    const total = data.length;
    const active = data.filter((p) => p.status === "active").length;
    const newLast30Days = data.filter((p) => {
      const createdAt = new Date(p.created_at);
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      return createdAt >= thirtyDaysAgo;
    }).length;

    return { total, active, newLast30Days };
  }

  async getAppointmentStats() {
    const { data, error } = await supabaseAdmin
      .from("appointments")
      .select("status, appointment_date, created_at");

    if (error)
      throw new Error(`Failed to get appointment stats: ${error.message}`);

    const total = data.length;
    const completed = data.filter((a) => a.status === "completed").length;
    const cancelled = data.filter((a) => a.status === "cancelled").length;
    const upcoming = data.filter((a) => {
      const appointmentDate = new Date(a.appointment_date);
      return appointmentDate >= new Date() && a.status === "scheduled";
    }).length;

    return { total, completed, cancelled, upcoming };
  }

  // Health Check
  async healthCheck() {
    try {
      const { data: _d, error } = await supabaseAdmin
        .from("patients")
        .select("id")
        .limit(1);

      if (error) throw error;

      return {
        status: "healthy",
        connected: true,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      const err = error as Error;
      return {
        status: "unhealthy",
        connected: false,
        error: err.message,
        timestamp: new Date().toISOString(),
      };
    }
  }
}

export const db = new SupabaseDatabaseManager();
