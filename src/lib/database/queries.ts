import { createClient } from '@/lib/supabase/server';
// import type { Database } from '@/types/supabase';

// type Tables = Database['public']['Tables'];'];

/**
 * Unified database query helpers for healthcare system
 * All pages use this instead of mock data
 */

// ============================================
// Insurance Claims Queries
// ============================================
export async function getInsuranceClaims(filters?: {
  status?: string;
  patient_id?: string;
  limit?: number;
}) {
  const supabase = await createClient();
  
  let query = supabase
    .from('insurance_claims')
    .select('*, patients(first_name, last_name, public_id)')
    .order('created_at', { ascending: false });

  if (filters?.status) {
    query = query.eq('status', filters.status);
  }

  if (filters?.patient_id) {
    query = query.eq('patient_id', filters.patient_id);
  }

  if (filters?.limit) {
    query = query.limit(filters.limit);
  }

  const { data, error } = await query;

  if (error) throw error;

  return data?.map(claim => ({
    id: claim.id,
    publicId: claim.public_id,
    patientId: claim.patient_id,
    patientName: claim.patients ? `${claim.patients.first_name} ${claim.patients.last_name}` : 'Unknown',
    claimNumber: claim.claim_number,
    insuranceProvider: claim.insurance_provider,
    claimAmount: claim.claim_amount,
    approvedAmount: claim.approved_amount,
    status: claim.status,
    submittedDate: claim.submitted_date,
    processedDate: claim.processed_date,
    notes: claim.notes,
    metadata: claim.metadata,
    createdAt: claim.created_at,
    updatedAt: claim.updated_at,
  })) || [];
}

// ============================================
// Approvals Queries
// ============================================
export async function getApprovals(filters?: {
  status?: string;
  request_type?: string;
  limit?: number;
}) {
  const supabase = await createClient();
  
  let query = supabase
    .from('approvals')
    .select('*, patients(first_name, last_name, public_id)')
    .order('created_at', { ascending: false });

  if (filters?.status && filters.status !== 'all') {
    query = query.eq('status', filters.status);
  }

  if (filters?.request_type && filters.request_type !== 'all') {
    query = query.eq('request_type', filters.request_type);
  }

  if (filters?.limit) {
    query = query.limit(filters.limit);
  }

  const { data, error } = await query;

  if (error) throw error;

  return data?.map(approval => ({
    id: approval.id,
    publicId: approval.public_id,
    patientName: approval.patients ? 
      `${approval.patients.first_name} ${approval.patients.last_name}` : 'Unknown',
    patientId: approval.patient_id,
    requestType: approval.request_type,
    requestTitle: approval.request_title,
    description: approval.description,
    requestedBy: approval.requested_by,
    requestedDate: approval.requested_date,
    status: approval.status,
    approvedBy: approval.approved_by,
    approvedDate: approval.approved_date,
    rejectionReason: approval.rejection_reason,
    priority: approval.priority,
    estimatedCost: approval.estimated_cost,
    insuranceCoverage: approval.insurance_coverage,
    patientContribution: approval.patient_contribution,
    isBlocked: approval.is_blocked,
    blockReason: approval.block_reason,
    hasOutstandingBalance: approval.has_outstanding_balance,
    outstandingAmount: approval.outstanding_amount,
    attachments: approval.attachments as string[] || [],
    notes: approval.notes,
    createdAt: approval.created_at,
  })) || [];
}

// ============================================
// Family Support Queries
// ============================================
export async function getFamilyMembers(patientId: string) {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('family_members')
    .select('*')
    .eq('patient_id', patientId)
    .order('created_at', { ascending: false });

  if (error) throw error;

  return data?.map(member => ({
    id: member.id,
    publicId: member.public_id,
    patientId: member.patient_id,
    name: member.name,
    relationship: member.relationship,
    phone: member.phone,
    email: member.email,
    isPrimaryContact: member.is_primary_contact,
    notes: member.notes,
    createdAt: member.created_at,
    updatedAt: member.updated_at,
  })) || [];
}

export async function getSupportSessions(patientId?: string, limit?: number) {
  const supabase = await createClient();
  
  let query = supabase
    .from('support_sessions')
    .select('*, patients(first_name, last_name), users(name)')
    .order('session_date', { ascending: false })
    .order('session_time', { ascending: false });

  if (patientId) {
    query = query.eq('patient_id', patientId);
  }

  if (limit) {
    query = query.limit(limit);
  }

  const { data, error } = await query;

  if (error) throw error;

  return data?.map(session => ({
    id: session.id,
    publicId: session.public_id,
    patientId: session.patient_id,
    patientName: session.patients ? 
      `${session.patients.first_name} ${session.patients.last_name}` : 'Unknown',
    sessionTitle: session.session_title,
    sessionDate: session.session_date,
    sessionTime: session.session_time,
    durationMinutes: session.duration_minutes,
    sessionType: session.session_type,
    facilitatorId: session.facilitator_id,
    facilitatorName: session.users?.name,
    notes: session.notes,
    createdAt: session.created_at,
  })) || [];
}

// ============================================
// Therapy Queries
// ============================================
export async function getTherapySessions(filters?: {
  patient_id?: string;
  therapist_id?: string;
  status?: string;
  limit?: number;
}) {
  const supabase = await createClient();
  
  let query = supabase
    .from('therapy_sessions')
    .select('*, patients(first_name, last_name), users(name)')
    .order('session_date', { ascending: false });

  if (filters?.patient_id) {
    query = query.eq('patient_id', filters.patient_id);
  }

  if (filters?.therapist_id) {
    query = query.eq('therapist_id', filters.therapist_id);
  }

  if (filters?.status) {
    query = query.eq('status', filters.status);
  }

  if (filters?.limit) {
    query = query.limit(filters.limit);
  }

  const { data, error } = await query;

  if (error) throw error;

  return data?.map(session => ({
    id: session.id,
    publicId: session.public_id,
    patientId: session.patient_id,
    patientName: session.patients ? 
      `${session.patients.first_name} ${session.patients.last_name}` : 'Unknown',
    therapistId: session.therapist_id,
    therapistName: session.users?.name,
    sessionDate: session.session_date,
    sessionTime: session.session_time,
    duration: session.duration,
    therapyType: session.therapy_type,
    status: session.status,
    goals: session.goals || [],
    activities: session.activities || [],
    progressNotes: session.progress_notes,
    nextSessionGoals: session.next_session_goals || [],
    createdAt: session.created_at,
    updatedAt: session.updated_at,
  })) || [];
}

export async function getTherapyGoals(sessionId?: string, patientId?: string) {
  const supabase = await createClient();
  
  let query = supabase
    .from('therapy_goals')
    .select('*, therapy_sessions(patient_id)')
    .order('created_at', { ascending: false });

  if (sessionId) {
    query = query.eq('therapy_session_id', sessionId);
  }

  if (patientId) {
    // Note: Need to join through therapy_sessions to filter by patient
    // This is a simplified version
  }

  const { data, error } = await query;

  if (error) throw error;

  return data?.map(goal => ({
    id: goal.id,
    therapySessionId: goal.therapy_session_id,
    goalTitle: goal.goal_title,
    description: goal.description,
    targetDate: goal.target_date,
    progressPercentage: goal.progress_percentage,
    status: goal.status,
    createdAt: goal.created_at,
    updatedAt: goal.updated_at,
  })) || [];
}

// ============================================
// Lookup Tables Queries
// ============================================
export async function getRequestTypes() {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('request_types')
    .select('*')
    .eq('is_active', true)
    .order('order_index');

  if (error) throw error;
  return data || [];
}

export async function getPriorityLevels() {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('priority_levels')
    .select('*')
    .eq('is_active', true)
    .order('order_index');

  if (error) throw error;
  return data || [];
}

export async function getTherapyTypes() {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('therapy_types')
    .select('*')
    .eq('is_active', true)
    .order('order_index');

  if (error) throw error;
  return data || [];
}

export async function getRelationshipTypes() {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('relationship_types')
    .select('*')
    .eq('is_active', true)
    .order('order_index');

  if (error) throw error;
  return data || [];
}

export async function getSessionStatuses() {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('session_statuses')
    .select('*')
    .eq('is_active', true)
    .order('order_index');

  if (error) throw error;
  return data || [];
}

// ============================================
// Statistics Queries
// ============================================
export async function getDashboardStatistics() {
  const supabase = await createClient();
  
  // Get counts
  const [patients, appointments, payments, claims] = await Promise.all([
    supabase.from('patients').select('id', { count: 'exact', head: true }),
    supabase.from('appointments').select('id', { count: 'exact', head: true }),
    supabase.from('payments').select('id', { count: 'exact', head: true }),
    supabase.from('insurance_claims').select('id', { count: 'exact', head: true }),
  ]);

  return {
    totalPatients: patients.count || 0,
    totalAppointments: appointments.count || 0,
    totalPayments: payments.count || 0,
    totalClaims: claims.count || 0,
  };
}