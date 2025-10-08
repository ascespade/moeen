import { NextRequest, NextResponse } from 'next/server';
import { EHRSystem } from '@/lib/integration-system';
import { WhatsAppIntegration } from '@/lib/whatsapp-integration';

const ehr = new EHRSystem();
const whatsapp = new WhatsAppIntegration();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const search = searchParams.get('search') || '';

    // In a real implementation, this would query the database
    // For now, return mock data
    const patients = [
      {
        id: '1',
        name: 'أحمد محمد',
        age: 25,
        contactInfo: {
          phone: '+966501234567',
          email: 'ahmed@example.com'
        },
        lastVisit: new Date('2024-01-15'),
        nextAppointment: new Date('2024-01-20')
      },
      {
        id: '2',
        name: 'فاطمة علي',
        age: 30,
        contactInfo: {
          phone: '+966501234568',
          email: 'fatima@example.com'
        },
        lastVisit: new Date('2024-01-10'),
        nextAppointment: new Date('2024-01-18')
      }
    ];

    // Filter by search term if provided
    const filteredPatients = search 
      ? patients.filter(p => p.name.includes(search) || p.contactInfo.phone.includes(search))
      : patients;

    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedPatients = filteredPatients.slice(startIndex, endIndex);

    return NextResponse.json({
      success: true,
      data: paginatedPatients,
      pagination: {
        page,
        limit,
        total: filteredPatients.length,
        totalPages: Math.ceil(filteredPatients.length / limit)
      }
    });

  } catch (error) {
    console.error('Get patients error:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Internal server error',
        code: 'INTERNAL_ERROR' 
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, age, phone, email, medicalHistory, familyMembers } = body;

    if (!name || !age || !phone) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Name, age, and phone are required',
          code: 'MISSING_REQUIRED_FIELDS' 
        },
        { status: 400 }
      );
    }

    // Create patient record
    const patientData = {
      name,
      age,
      contactInfo: {
        phone,
        email
      },
      medicalHistory: medicalHistory || [],
      currentTreatment: {
        doctor: '',
        sessions: [],
        goals: []
      },
      familyMembers: familyMembers || [],
      lastVisit: new Date()
    };

    const patientId = ehr.createPatient(patientData);

    // Add WhatsApp contact
    whatsapp.addContact({
      phone,
      name,
      isPatient: true,
      isFamilyMember: false,
      patientId,
      lastInteraction: new Date(),
      preferredLanguage: 'ar'
    });

    return NextResponse.json({
      success: true,
      data: {
        id: patientId,
        message: 'Patient created successfully'
      }
    });

  } catch (error) {
    console.error('Create patient error:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Internal server error',
        code: 'INTERNAL_ERROR' 
      },
      { status: 500 }
    );
  }
}