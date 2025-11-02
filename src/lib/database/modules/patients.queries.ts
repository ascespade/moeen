/**
 * Patients Module Database Queries
 * استعلامات قاعدة البيانات لوحدة المرضى
 * 
 * Centralized, optimized queries for patients module
 * All queries use real database - NO MOCK DATA
 */

import { SupabaseClient } from '@supabase/supabase-js'
import { executeQuery } from '../client'

export interface Patient {
  id: string
  user_id?: string
  first_name: string
  last_name: string
  full_name?: string
  email?: string
  phone?: string
  date_of_birth?: string
  gender?: string
  address?: string
  emergency_contact_name?: string
  emergency_contact_phone?: string
  medical_history?: string
  allergies?: string
  insurance_provider?: string
  insurance_number?: string
  status: string
  created_at?: string
  updated_at?: string
}

/**
 * Get patient by ID
 */
export async function getPatientById(
  supabase: SupabaseClient,
  patientId: string
): Promise<Patient | null> {
  return executeQuery(async () => {
    const { data, error } = await supabase
      .from('patients')
      .select('*')
      .eq('id', patientId)
      .single()

    if (error) throw error
    return data as Patient
  }).then(result => result.data || null)
}

/**
 * Search patients with filters
 */
export async function searchPatients(
  supabase: SupabaseClient,
  options: {
    searchTerm?: string
    status?: string
    limit?: number
    offset?: number
  }
): Promise<{ patients: Patient[]; total: number }> {
  const { searchTerm = '', status, limit = 50, offset = 0 } = options

  return executeQuery(async () => {
    let query = supabase
      .from('patients')
      .select('*', { count: 'exact' })

    // Apply search filter
    if (searchTerm) {
      query = query.or(
        `first_name.ilike.%${searchTerm}%,last_name.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%,phone.ilike.%${searchTerm}%`
      )
    }

    // Apply status filter
    if (status) {
      query = query.eq('status', status)
    }

    // Apply pagination (Supabase uses inclusive range)
    query = query
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    const { data, error, count } = await query

    if (error) throw error
    return {
      patients: (data || []) as Patient[],
      total: count || 0,
    }
  }).then(result => result.data || { patients: [], total: 0 })
}

/**
 * Create new patient
 */
export async function createPatient(
  supabase: SupabaseClient,
  patientData: Omit<Patient, 'id' | 'created_at' | 'updated_at'>
): Promise<Patient> {
  return executeQuery(async () => {
    const { data, error } = await supabase
      .from('patients')
      .insert([{
        ...patientData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }])
      .select()
      .single()

    if (error) throw error
    return data as Patient
  }).then(result => {
    if (!result.data) throw new Error('Failed to create patient')
    return result.data
  })
}

/**
 * Update patient
 */
export async function updatePatient(
  supabase: SupabaseClient,
  patientId: string,
  updates: Partial<Patient>
): Promise<Patient> {
  return executeQuery(async () => {
    const { data, error } = await supabase
      .from('patients')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', patientId)
      .select()
      .single()

    if (error) throw error
    return data as Patient
  }).then(result => {
    if (!result.data) throw new Error('Failed to update patient')
    return result.data
  })
}
