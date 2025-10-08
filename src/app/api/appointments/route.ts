import { NextRequest, NextResponse } from 'next/server';
import { EHRSystem } from '@/lib/integration-system';
import { CalendarAPI } from '@/lib/integration-system';
import { WhatsAppIntegration } from '@/lib/whatsapp-integration';

const ehr = new EHRSystem();
const calendar = new CalendarAPI();
const whatsapp = new WhatsAppIntegration();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const doctorId = searchParams.get('doctorId');
    const date = searchParams.get('date');
    const patientId = searchParams.get('patientId');

    if (doctorId && date) {
      // Get available slots for a specific doctor and date
      const availableSlots = calendar.getAvailableTimeSlots(doctorId, new Date(date));
      
      return NextResponse.json({
        success: true,
        data: {
          doctorId,
          date,
          availableSlots
        }
      });
    }

    if (patientId) {
      // Get appointments for a specific patient
      const patient = ehr.getPatient(patientId);
      if (!patient) {
        return NextResponse.json(
          { 
            success: false, 
            error: 'Patient not found',
            code: 'PATIENT_NOT_FOUND' 
          },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        data: {
          patientId,
          nextAppointment: patient.nextAppointment,
          lastVisit: patient.lastVisit
        }
      });
    }

    // Return mock appointments data
    const appointments = [
      {
        id: '1',
        patientId: '1',
        patientName: 'أحمد محمد',
        doctorId: '1',
        doctorName: 'د. سارة أحمد',
        date: '2024-01-20',
        time: '10:00',
        type: 'treatment',
        status: 'confirmed'
      },
      {
        id: '2',
        patientId: '2',
        patientName: 'فاطمة علي',
        doctorId: '2',
        doctorName: 'د. محمد السعيد',
        date: '2024-01-18',
        time: '14:00',
        type: 'assessment',
        status: 'pending'
      }
    ];

    return NextResponse.json({
      success: true,
      data: appointments
    });

  } catch (error) {
    console.error('Get appointments error:', error);
    
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
    const { patientId, doctorId, date, time, type = 'treatment' } = body;

    if (!patientId || !doctorId || !date || !time) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Patient ID, doctor ID, date, and time are required',
          code: 'MISSING_REQUIRED_FIELDS' 
        },
        { status: 400 }
      );
    }

    // Book appointment
    const success = ehr.bookAppointment(patientId, doctorId, new Date(date), time);
    
    if (!success) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Failed to book appointment - slot may not be available',
          code: 'APPOINTMENT_BOOKING_FAILED' 
        },
        { status: 400 }
      );
    }

    // Get patient info for WhatsApp notification
    const patient = ehr.getPatient(patientId);
    if (patient && patient.contactInfo.phone) {
      // Send appointment confirmation
      await whatsapp.sendTemplateMessage(
        'appointment_confirmation',
        patient.contactInfo.phone,
        {
          name: patient.name,
          date: new Date(date).toLocaleDateString('ar-SA'),
          time: time
        }
      );

      // Schedule reminder
      const reminderTime = new Date(new Date(date).getTime() - 24 * 60 * 60 * 1000);
      await whatsapp.sendAppointmentReminder(patient.contactInfo.phone, time);
    }

    return NextResponse.json({
      success: true,
      data: {
        appointmentId: `apt_${Date.now()}`,
        message: 'Appointment booked successfully',
        confirmationSent: !!patient?.contactInfo.phone
      }
    });

  } catch (error) {
    console.error('Book appointment error:', error);
    
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

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { appointmentId, newDate, newTime, reason } = body;

    if (!appointmentId || !newDate || !newTime) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Appointment ID, new date, and new time are required',
          code: 'MISSING_REQUIRED_FIELDS' 
        },
        { status: 400 }
      );
    }

    // In a real implementation, this would update the appointment in the database
    // For now, return success
    return NextResponse.json({
      success: true,
      data: {
        message: 'Appointment rescheduled successfully',
        newDate,
        newTime,
        reason
      }
    });

  } catch (error) {
    console.error('Reschedule appointment error:', error);
    
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

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const appointmentId = searchParams.get('appointmentId');
    const reason = searchParams.get('reason') || 'No reason provided';

    if (!appointmentId) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Appointment ID is required',
          code: 'MISSING_REQUIRED_FIELDS' 
        },
        { status: 400 }
      );
    }

    // In a real implementation, this would cancel the appointment in the database
    // For now, return success
    return NextResponse.json({
      success: true,
      data: {
        message: 'Appointment cancelled successfully',
        appointmentId,
        reason
      }
    });

  } catch (error) {
    console.error('Cancel appointment error:', error);
    
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