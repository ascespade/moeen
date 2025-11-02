/**
 * Doctors Module Database Queries
 * استعلامات قاعدة البيانات لوحدة الأطباء
 * 
 * Centralized, optimized queries for doctors module
 * All queries use real database - NO MOCK DATA
 */

import { SupabaseClient } from '@supabase/supabase-js'
import { executeQuery } from '../client'

export interface Doctor {
  id: string
  user_id?: string
  first_name: string
  last_name: string
  full_name?: string
  specialization?: string
  specialty?: string
  license_number?: string
  phone?: string
  email?: string
  consultation_fee?: number
  available_days?: any
  available_hours?: any
  is_available?: boolean
  status: string
  created_at?: string
  updated_at?: string
}

/**
 * Get doctor by ID
 */
export async function getDoctorById(
  supabase: SupabaseClient,
  doctorId: string
): Promise<Doctor | null> {
  return executeQuery(async () => {
    const { data, error } = await supabase
      .from('doctors')
      .select('*')
      .eq('id', doctorId)
      .single()

    if (error) throw error
    return data as Doctor
  }).then(result => result.data || null)
}

/**
 * Search doctors with filters
 */
export async function searchDoctors(
  supabase: SupabaseClient,
  options: {
    searchTerm?: string
    specialty?: string
    isAvailable?: boolean
    limit?: number
    offset?: number
  }
): Promise<{ doctors: Doctor[]; total: number }> {
  const { searchTerm = '', specialty, isAvailable, limit = 50, offset = 0 } = options

  return executeQuery(async () => {
    let query = supabase
      .from('doctors')
      .select('*', { count: 'exact' })

    // Apply search filter
    if (searchTerm) {
      query = query.or(
        `first_name.ilike.%${searchTerm}%,last_name.ilike.%${searchTerm}%,specialization.ilike.%${searchTerm}%,specialty.ilike.%${searchTerm}%`
      )
    }

    // Apply specialty filter
    if (specialty) {
      query = query.or(`specialization.eq.${specialty},specialty.eq.${specialty}`)
    }

    // Apply availability filter
    if (isAvailable !== undefined) {
      query = query.eq('is_available', isAvailable)
    }

    // Apply pagination
    query = query
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    const { data, error, count } = await query

    if (error) throw error
    return {
      doctors: (data || []) as Doctor[],
      total: count || 0,
    }
  }).then(result => result.data || { doctors: [], total: 0 })
}

/**
 * Get doctors by specialty
 */
export async function getDoctorsBySpecialty(
  supabase: SupabaseClient,
  specialty: string
): Promise<Doctor[]> {
  return executeQuery(async () => {
    const { data, error } = await supabase
      .from('doctors')
      .select('*')
      .or(`specialization.eq.${specialty},specialty.eq.${specialty}`)
      .eq('is_available', true)
      .eq('status', 'active')

    if (error) throw error
    return (data || []) as Doctor[]
  }).then(result => result.data || [])
}

/**
 * Create new doctor
 */
export async function createDoctor(
  supabase: SupabaseClient,
  doctorData: Omit<Doctor, 'id' | 'created_at' | 'updated_at'>
): Promise<Doctor> {
  return executeQuery(async () => {
    const { data, error } = await supabase
      .from('doctors')
      .insert([{
        ...doctorData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }])
      .select()
      .single()

    if (error) throw error
    return data as Doctor
  }).then(result => {
    if (!result.data) throw new Error('Failed to create doctor')
    return result.data
  })
}

/**
 * Update doctor
 */
export async function updateDoctor(
  supabase: SupabaseClient,
  doctorId: string,
  updates: Partial<Doctor>
): Promise<Doctor> {
  return executeQuery(async () => {
    const { data, error } = await supabase
      .from('doctors')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', doctorId)
      .select()
      .single()

    if (error) throw error
    return data as Doctor
  }).then(result => {
    if (!result.data) throw new Error('Failed to update doctor')
    return result.data
  })
}
