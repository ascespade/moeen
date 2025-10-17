import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { authorize } from '@/lib/auth/authorize';
import { validateData, appointmentSchema } from '@/lib/validation/schemas';
import { getClientInfo } from '@/lib/utils/request-helpers';

export async function GET(request: NextRequest) {
  const startTime = Date.now();
  
  try {
    const { user, error: authError } = await authorize(request);
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const { ipAddress, userAgent } = getClientInfo(request);

    const { searchParams } = new URL(request.url);
    const patientId = searchParams.get('patientId');
    const doctorId = searchParams.get('doctorId');
    const date = searchParams.get('date');
    const status = searchParams.get('status');

    const supabase = await createClient();

    let query = supabase
      .from('appointments')
      .select(`
        id,
        public_id,
        patient_id,
        doctor_id,
        scheduled_at,
        status,
        payment_status,
        created_at,
        patients!inner(id, full_name, phone),
        doctors!inner(id, speciality)
      `)
      .order('scheduled_at', { ascending: true });

    // Apply filters
    if (patientId) query = query.eq('patient_id', patientId);
    if (doctorId) query = query.eq('doctor_id', doctorId);
    if (date) query = query.gte('scheduled_at', `${date}T00:00:00`).lt('scheduled_at', `${date}T23:59:59`);
    if (status) query = query.eq('status', status);

    // Role-based filtering
    if (user.role === 'patient') {
      query = query.eq('patients.user_id', user.id);
    } else if (user.role === 'doctor') {
      query = query.eq('doctors.user_id', user.id);
    }

    const { data: appointments, error: appointmentsError } = await query;

    if (appointmentsError) {
      // Log error
      await supabase.from('audit_logs').insert({
        action: 'appointments_fetch_failed',
        user_id: user.id,
        resource_type: 'appointment',
        ip_address: ipAddress,
        user_agent: userAgent,
        status: 'failed',
        severity: 'error',
        error_message: appointmentsError.message,
        duration_ms: Date.now() - startTime
      });
      
      return NextResponse.json({ error: 'Failed to fetch appointments' }, { status: 500 });
    }

    // Log successful fetch
    await supabase.from('audit_logs').insert({
      action: 'appointments_fetched',
      user_id: user.id,
      resource_type: 'appointment',
      ip_address: ipAddress,
      user_agent: userAgent,
      status: 'success',
      severity: 'info',
      metadata: {
        count: appointments?.length || 0,
        filters: { patientId, doctorId, date, status }
      },
      duration_ms: Date.now() - startTime
    });

    return NextResponse.json({ appointments: appointments || [] });

  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const startTime = Date.now();
  
  try {
    const { user, error: authError } = await authorize(request);
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const validation = validateData(appointmentSchema, body);

    if (!validation.success) {
      return NextResponse.json({ 
        error: 'Validation failed', 
        details: validation.errors 
      }, { status: 400 });
    }

    const { patientId, doctorId, scheduledAt, type = 'consultation' } = validation.data;

    const supabase = await createClient();

    // Check if patient exists and user has permission
    const { data: patient, error: patientError } = await supabase
      .from('patients')
      .select('id, user_id, full_name')
      .eq('id', patientId)
      .single();

    if (patientError || !patient) {
      return NextResponse.json({ error: 'Patient not found' }, { status: 404 });
    }

    // Check permissions
    if (user.role === 'patient' && patient.user_id !== user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // Check if doctor exists
    const { data: doctor, error: doctorError } = await supabase
      .from('doctors')
      .select('id, speciality')
      .eq('id', doctorId)
      .single();

    if (doctorError || !doctor) {
      return NextResponse.json({ error: 'Doctor not found' }, { status: 404 });
    }

    // Check for appointment conflicts
    const { data: conflicts, error: conflictError } = await supabase
      .from('appointments')
      .select('id')
      .eq('doctor_id', doctorId)
      .eq('scheduled_at', scheduledAt)
      .in('status', ['pending', 'confirmed', 'in_progress']);

    if (conflictError) {
      return NextResponse.json({ error: 'Failed to check conflicts' }, { status: 500 });
    }

    if (conflicts && conflicts.length > 0) {
      return NextResponse.json({ 
        error: 'Doctor has a conflicting appointment at this time' 
      }, { status: 409 });
    }

    // Create appointment with tracking
    const { data: appointment, error: appointmentError } = await supabase
      .from('appointments')
      .insert({
        patient_id: patientId,
        doctor_id: doctorId,
        scheduled_at: scheduledAt,
        status: 'pending',
        payment_status: 'unpaid',
        booking_source: 'web',
        type: type || 'consultation',
        created_by: user.id,
        last_activity_at: new Date().toISOString()
      })
      .select(`
        id,
        public_id,
        patient_id,
        doctor_id,
        scheduled_at,
        status,
        payment_status,
        patients!inner(full_name),
        doctors!inner(speciality)
      `)
      .single();

    if (appointmentError) {
      return NextResponse.json({ error: 'Failed to create appointment' }, { status: 500 });
    }

    // Log appointment creation with full tracking
    await supabase
      .from('audit_logs')
      .insert({
        action: 'appointment_created',
        user_id: user.id,
        resource_type: 'appointment',
        resource_id: appointment.id,
        ip_address: ipAddress,
        user_agent: userAgent,
        status: 'success',
        severity: 'info',
        metadata: {
          patient_id: patientId,
          doctor_id: doctorId,
          scheduled_at: scheduledAt,
          patient_name: patient.full_name,
          booking_source: 'web',
          type: type || 'consultation'
        },
        duration_ms: Date.now() - startTime
      });

    return NextResponse.json({
      success: true,
      appointment: {
        id: appointment.id,
        publicId: appointment.public_id,
        patientName: appointment.patients.full_name,
        doctorSpeciality: appointment.doctors.speciality,
        scheduledAt: appointment.scheduled_at,
        status: appointment.status,
        paymentStatus: appointment.payment_status
      }
    });

  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}