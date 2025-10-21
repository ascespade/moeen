import { NextRequest, NextResponse } from 'next/server';
import { realDB } from '@/lib/supabase-real';
import { z } from 'zod';

const patientSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  phone: z.string().min(1, 'Phone is required'),
  email: z.string().email().optional(),
  date_of_birth: z.string().optional(),
  gender: z.enum(['male', 'female']).optional(),
  address: z.string().optional(),
  emergency_contact: z.string().optional(),
  emergency_contact_phone: z.string().optional(),
  medical_history: z.array(z.string()).optional(),
  allergies: z.array(z.string()).optional(),
  medications: z.array(z.string()).optional(),
  insurance_provider: z.string().optional(),
  insurance_number: z.string().optional(),
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const searchTerm = searchParams.get('search') || '';
    const role = searchParams.get('role') || 'patient';
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    const patients = await realDB.searchUsers(searchTerm, role);

    // Apply pagination
    const paginatedPatients = patients.slice(offset, offset + limit);

    return NextResponse.json({
      success: true,
      data: paginatedPatients,
      pagination: {
        total: patients.length,
        limit,
        offset,
        hasMore: offset + limit < patients.length,
      },
    });
  } catch (error) {
    console.error('Error fetching patients:', error);
    return NextResponse.json(
      { error: 'Failed to fetch patients' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validation = patientSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: validation.error.issues },
        { status: 400 }
      );
    }

    const patientData = {
      ...validation.data,
      role: 'patient' as const,
      national_id: body.national_id,
      name_en: body.name_en,
      age: body.age,
      city: body.city,
      emergency_contact_relation: body.emergency_contact_relation,
      current_conditions: body.current_conditions,
    };

    const patient = await realDB.createUser(patientData);

    // Create patient record
    const patientRecord = await realDB.createPatient({
      id: patient.id,
      guardian_name: body.guardian_name,
      guardian_relation: body.guardian_relation,
      guardian_phone: body.guardian_phone,
      medical_conditions: body.medical_conditions,
      treatment_goals: body.treatment_goals,
      assigned_doctor_id: body.assigned_doctor_id,
      assigned_therapist_id: body.assigned_therapist_id,
      admission_date: new Date().toISOString(),
      status: 'active',
    });

    return NextResponse.json({
      success: true,
      data: { ...patient, patientRecord },
      message: 'Patient created successfully',
    });
  } catch (error) {
    console.error('Error creating patient:', error);
    return NextResponse.json(
      { error: 'Failed to create patient' },
      { status: 500 }
    );
  }
}
