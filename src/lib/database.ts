/**
 * Database utilities using Supabase
 * Centralized database operations for the healthcare system
 */

import { _Database } from "@/types/supabase";

import { _getServiceSupabase, getServerSupabase } from "./supabaseClient";

type Tables = Database["public"]["Tables"];
type Users = Tables["users"]["Row"];
type Patients = Tables["patients"]["Row"];
type Doctors = Tables["doctors"]["Row"];
type Appointments = Tables["appointments"]["Row"];
type Sessions = Tables["sessions"]["Row"];
type InsuranceClaims = Tables["insurance_claims"]["Row"];

export class DatabaseManager {
  private supabase;

  constructor(useService = false) {
    this.supabase = useService ? getServiceSupabase() : getServerSupabase();
  }

  // User Management
  async createUser(_userData: Omit<Users, "id" | "created_at" | "updated_at">) {
    const { data, error } = await this.supabase
      .from("users")
      .insert([userData])
      .select()
      .single();

    if (error) throw new Error(`Failed to create user: ${error.message}`);
    return data;
  }

  async getUser(_userId: string) {
    const { data, error } = await this.supabase
      .from("users")
      .select("*")
      .eq("id", userId)
      .single();

    if (error) throw new Error(`Failed to get user: ${error.message}`);
    return data;
  }

  async getUserByEmail(_email: string) {
    const { data, error } = await this.supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .single();

    if (error) throw new Error(`Failed to get user by email: ${error.message}`);
    return data;
  }

  async updateUser(_userId: string, updates: Partial<Users>) {
    const { data, error } = await this.supabase
      .from("users")
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq("id", userId)
      .select()
      .single();

    if (error) throw new Error(`Failed to update user: ${error.message}`);
    return data;
  }

  // Patient Management
  async createPatient(
    patientData: Omit<Patients, "id" | "created_at" | "updated_at">,
  ) {
    const { data, error } = await this.supabase
      .from("patients")
      .insert([patientData])
      .select()
      .single();

    if (error) throw new Error(`Failed to create patient: ${error.message}`);
    return data;
  }

  async getPatient(_patientId: string) {
    const { data, error } = await this.supabase
      .from("patients")
      .select("*")
      .eq("id", patientId)
      .single();

    if (error) throw new Error(`Failed to get patient: ${error.message}`);
    return data;
  }

  async getPatients(
    filters: {
      assigned_doctor_id?: string;
      status?: string;
      limit?: number;
      offset?: number;
    } = {},
  ) {
    let query = this.supabase
      .from("patients")
      .select("*")
      .order("created_at", { ascending: false });

    if (filters.assigned_doctor_id) {
      query = query.eq("assigned_doctor_id", filters.assigned_doctor_id);
    }

    if (filters.status) {
      query = query.eq("status", filters.status);
    }

    if (filters.limit) {
      query = query.limit(filters.limit);
    }

    if (filters.offset) {
      query = query.range(
        filters.offset,
        filters.offset + (filters.limit || 10) - 1,
      );
    }

    const { data, error } = await query;

    if (error) throw new Error(`Failed to get patients: ${error.message}`);
    return data;
  }

  async updatePatient(_patientId: string, updates: Partial<Patients>) {
    const { data, error } = await this.supabase
      .from("patients")
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq("id", patientId)
      .select()
      .single();

    if (error) throw new Error(`Failed to update patient: ${error.message}`);
    return data;
  }

  // Doctor Management
  async createDoctor(
    doctorData: Omit<Doctors, "id" | "created_at" | "updated_at">,
  ) {
    const { data, error } = await this.supabase
      .from("doctors")
      .insert([doctorData])
      .select()
      .single();

    if (error) throw new Error(`Failed to create doctor: ${error.message}`);
    return data;
  }

  async getDoctor(_doctorId: string) {
    const { data, error } = await this.supabase
      .from("doctors")
      .select("*")
      .eq("id", doctorId)
      .single();

    if (error) throw new Error(`Failed to get doctor: ${error.message}`);
    return data;
  }

  async getDoctors(
    filters: {
      specialty?: string;
      is_available?: boolean;
      limit?: number;
      offset?: number;
    } = {},
  ) {
    let query = this.supabase
      .from("doctors")
      .select("*")
      .order("created_at", { ascending: false });

    if (filters.specialty) {
      query = query.eq("specialty", filters.specialty);
    }

    if (filters.is_available !== undefined) {
      query = query.eq("is_available", filters.is_available);
    }

    if (filters.limit) {
      query = query.limit(filters.limit);
    }

    if (filters.offset) {
      query = query.range(
        filters.offset,
        filters.offset + (filters.limit || 10) - 1,
      );
    }

    const { data, error } = await query;

    if (error) throw new Error(`Failed to get doctors: ${error.message}`);
    return data;
  }

  // Appointment Management
  async createAppointment(
    appointmentData: Omit<Appointments, "id" | "created_at" | "updated_at">,
  ) {
    const { data, error } = await this.supabase
      .from("appointments")
      .insert([appointmentData])
      .select()
      .single();

    if (error)
      throw new Error(`Failed to create appointment: ${error.message}`);
    return data;
  }

  async getAppointment(_appointmentId: string) {
    const { data, error } = await this.supabase
      .from("appointments")
      .select(
        `
        *,
        patients!appointments_patient_id_fkey(*),
        doctors!appointments_doctor_id_fkey(*)
      `,
      )
      .eq("id", appointmentId)
      .single();

    if (error) throw new Error(`Failed to get appointment: ${error.message}`);
    return data;
  }

  async getAppointments(
    filters: {
      patient_id?: string;
      doctor_id?: string;
      status?: string;
      date_from?: string;
      date_to?: string;
      limit?: number;
      offset?: number;
    } = {},
  ) {
    let query = this.supabase
      .from("appointments")
      .select(
        `
        *,
        patients!appointments_patient_id_fkey(*),
        doctors!appointments_doctor_id_fkey(*)
      `,
      )
      .order("appointment_date", { ascending: true });

    if (filters.patient_id) {
      query = query.eq("patient_id", filters.patient_id);
    }

    if (filters.doctor_id) {
      query = query.eq("doctor_id", filters.doctor_id);
    }

    if (filters.status) {
      query = query.eq("status", filters.status);
    }

    if (filters.date_from) {
      query = query.gte("appointment_date", filters.date_from);
    }

    if (filters.date_to) {
      query = query.lte("appointment_date", filters.date_to);
    }

    if (filters.limit) {
      query = query.limit(filters.limit);
    }

    if (filters.offset) {
      query = query.range(
        filters.offset,
        filters.offset + (filters.limit || 10) - 1,
      );
    }

    const { data, error } = await query;

    if (error) throw new Error(`Failed to get appointments: ${error.message}`);
    return data;
  }

  async updateAppointment(
    appointmentId: string,
    updates: Partial<Appointments>,
  ) {
    const { data, error } = await this.supabase
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
  async createSession(
    sessionData: Omit<Sessions, "id" | "created_at" | "updated_at">,
  ) {
    const { data, error } = await this.supabase
      .from("sessions")
      .insert([sessionData])
      .select()
      .single();

    if (error) throw new Error(`Failed to create session: ${error.message}`);
    return data;
  }

  async getSessions(
    filters: {
      patient_id?: string;
      doctor_id?: string;
      appointment_id?: string;
      completed?: boolean;
      limit?: number;
      offset?: number;
    } = {},
  ) {
    let query = this.supabase
      .from("sessions")
      .select(
        `
        *,
        patients!sessions_patient_id_fkey(*),
        doctors!sessions_doctor_id_fkey(*)
      `,
      )
      .order("session_date", { ascending: false });

    if (filters.patient_id) {
      query = query.eq("patient_id", filters.patient_id);
    }

    if (filters.doctor_id) {
      query = query.eq("doctor_id", filters.doctor_id);
    }

    if (filters.appointment_id) {
      query = query.eq("appointment_id", filters.appointment_id);
    }

    if (filters.completed !== undefined) {
      query = query.eq("completed", filters.completed);
    }

    if (filters.limit) {
      query = query.limit(filters.limit);
    }

    if (filters.offset) {
      query = query.range(
        filters.offset,
        filters.offset + (filters.limit || 10) - 1,
      );
    }

    const { data, error } = await query;

    if (error) throw new Error(`Failed to get sessions: ${error.message}`);
    return data;
  }

  // Insurance Claims
  async createInsuranceClaim(
    claimData: Omit<InsuranceClaims, "id" | "created_at" | "updated_at">,
  ) {
    const { data, error } = await this.supabase
      .from("insurance_claims")
      .insert([claimData])
      .select()
      .single();

    if (error)
      throw new Error(`Failed to create insurance claim: ${error.message}`);
    return data;
  }

  async getInsuranceClaims(
    filters: {
      patient_id?: string;
      status?: string;
      limit?: number;
      offset?: number;
    } = {},
  ) {
    let query = this.supabase
      .from("insurance_claims")
      .select("*")
      .order("created_at", { ascending: false });

    if (filters.patient_id) {
      query = query.eq("patient_id", filters.patient_id);
    }

    if (filters.status) {
      query = query.eq("status", filters.status);
    }

    if (filters.limit) {
      query = query.limit(filters.limit);
    }

    if (filters.offset) {
      query = query.range(
        filters.offset,
        filters.offset + (filters.limit || 10) - 1,
      );
    }

    const { data, error } = await query;

    if (error)
      throw new Error(`Failed to get insurance claims: ${error.message}`);
    return data;
  }

  // Analytics and Statistics
  async getPatientStats() {
    const { data, error } = await this.supabase
      .from("patients")
      .select("id, created_at, status");

    if (error) throw new Error(`Failed to get patient stats: ${error.message}`);

    const __total = data.length;
    const __active = data.filter((p) => p.status === "active").length;
    const __newLast30Days = data.filter((p) => {
      const __createdAt = new Date(p.created_at);
      const __thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      return createdAt >= thirtyDaysAgo;
    }).length;

    return { total, active, newLast30Days };
  }

  async getAppointmentStats() {
    const { data, error } = await this.supabase
      .from("appointments")
      .select("status, appointment_date, created_at");

    if (error)
      throw new Error(`Failed to get appointment stats: ${error.message}`);

    const __total = data.length;
    const __completed = data.filter((a) => a.status === "completed").length;
    const __cancelled = data.filter((a) => a.status === "cancelled").length;
    const __upcoming = data.filter((a) => {
      const __appointmentDate = new Date(a.appointment_date);
      return appointmentDate >= new Date() && a.status === "scheduled";
    }).length;

    return { total, completed, cancelled, upcoming };
  }

  // Health Check
  async healthCheck() {
    try {
      const { data, error } = await this.supabase
        .from("users")
        .select("id")
        .limit(1);

      if (error) throw error;

      return {
        status: "healthy",
        connected: true,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      const __err = error as Error;
      return {
        status: "unhealthy",
        connected: false,
        error: err.message,
        timestamp: new Date().toISOString(),
      };
    }
  }
}

// Export default instance
export const __db = new DatabaseManager(true); // Use service client by default
export default db;
