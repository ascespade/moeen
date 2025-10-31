import { NextRequest, NextResponse } from 'next/server';
import { realDB } from '@/lib/supabase-real';
import { requireAuth } from '@/lib/auth/authorize';
import { PermissionManager } from '@/lib/permissions';
import { z } from 'zod';

const doctorSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  phone: z.string().min(1, 'Phone is required'),
  email: z.string().email().optional(),
  license_number: z.string().min(1, 'License number is required'),
  specialty: z.string().min(1, 'Specialty is required'),
  qualifications: z.array(z.string()).optional(),
  experience_years: z.number().optional(),
  consultation_fee: z.number().optional(),
  is_available: z.boolean().optional(),
  working_hours: z.any().optional(),
});

export async function GET(request: NextRequest) {
  try {
    // Security: Require authentication for accessing doctors data
    const authResult = await requireAuth(['admin', 'supervisor', 'staff', 'doctor', 'patient'])(request);
    if (!authResult.authorized || !authResult.user) {
      return NextResponse.json(
        { error: 'Unauthorized - Authentication required' },
        { status: 401 }
      );
    }

    // Check permissions using unified permission system
    const userPermissions = PermissionManager.getUserPermissions(
      authResult.user.role,
      authResult.user.meta?.permissions || []
    );

    if (!PermissionManager.canAccess(userPermissions, 'doctors', 'view')) {
      return NextResponse.json(
        { error: 'Forbidden - Insufficient permissions' },
        { status: 403 }
      );
    }
    const { searchParams } = new URL(request.url);
    const specialty = searchParams.get('specialty') || '';
    const searchTerm = searchParams.get('search') || '';
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    let doctors;
    if (specialty) {
      doctors = await realDB.getDoctorsBySpecialty(specialty);
    } else {
      doctors = await realDB.searchUsers(searchTerm, 'doctor');
    }

    // Apply pagination
    const paginatedDoctors = doctors.slice(offset, offset + limit);

    return NextResponse.json({
      success: true,
      data: paginatedDoctors,
      pagination: {
        total: doctors.length,
        limit,
        offset,
        hasMore: offset + limit < doctors.length,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch doctors' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validation = doctorSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: validation.error.issues },
        { status: 400 }
      );
    }

    const doctorData = {
      ...validation.data,
      role: 'doctor' as const,
      national_id: body.national_id,
      name_en: body.name_en,
      age: body.age,
      gender: body.gender,
      address: body.address,
      city: body.city,
      emergency_contact: body.emergency_contact,
      emergency_contact_phone: body.emergency_contact_phone,
    };

    const doctor = await realDB.createUser(doctorData);

    // Create doctor record
    const doctorRecord = await realDB.createDoctor({
      id: doctor.id,
      license_number: validation.data.license_number,
      specialty: validation.data.specialty,
      qualifications: validation.data.qualifications,
      experience_years: validation.data.experience_years,
      consultation_fee: validation.data.consultation_fee,
      is_available: validation.data.is_available ?? true,
      working_hours: validation.data.working_hours,
    });

    return NextResponse.json({
      success: true,
      data: { ...doctor, doctorRecord },
      message: 'Doctor created successfully',
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create doctor' },
      { status: 500 }
    );
  }
}
