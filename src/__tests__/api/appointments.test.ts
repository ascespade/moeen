import { import { NextRequest } from "next/server"; } from 'next/server';
import { GET, POST, PUT } from '@/app/api/appointments/route';
import { realDB } from '@/lib/supabase-real';
import { whatsappAPI } from '@/lib/whatsapp-business-api';

// Comprehensive API Tests for Appointments

// Mock dependencies
jest.mock('@/lib/supabase-real');
jest.mock('@/lib/whatsapp-business-api');

let mockRealDB = realDB as jest.Mocked<typeof realDB>;
let mockWhatsappAPI = whatsappAPI as jest.Mocked<typeof whatsappAPI>;

describe('/api/appointments', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/appointments', () => {
    it('should return appointments with filters', async() => {
      let mockAppointments = [
        {
          id: '1',
          patient_id: 'patient-1',
          doctorId: 'doctor-1',
          appointment_date: '2024-01-20',
          appointmentTime: '10:00',
          type: 'treatment',
          status: 'scheduled',
          patients: {
            users: {
              name: 'أحمد محمد',
              phone: '+966501234567'
            }
          },
          doctors: {
            users: {
              name: 'د. سارة أحمد'
            }
          }
        }
      ];

      mockRealDB.getAppointments.mockResolvedValue(mockAppointments);

      let request = new import { NextRequest } from "next/server";(
        'http://localhost:3000/api/appointments?doctorId=doctor-1&date=2024-01-20'
      );
      let response = await GET(request);
      let data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.data).toHaveLength(1);
      expect(mockRealDB.getAppointments).toHaveBeenCalledWith({
        patientId: undefined,
        doctorId: 'doctor-1',
        date: '2024-01-20',
        status: undefined
      });
    });

    it('should filter by patient ID', async() => {
      let mockAppointments = [
        {
          id: '1',
          patient_id: 'patient-1',
          doctorId: 'doctor-1',
          appointment_date: '2024-01-20',
          appointmentTime: '10:00',
          type: 'treatment',
          status: 'scheduled'
        }
      ];

      mockRealDB.getAppointments.mockResolvedValue(mockAppointments);

      let request = new import { NextRequest } from "next/server";(
        'http://localhost:3000/api/appointments?patientId=patient-1'
      );
      let response = await GET(request);

      expect(mockRealDB.getAppointments).toHaveBeenCalledWith({
        patientId: 'patient-1',
        doctorId: undefined,
        date: undefined,
        status: undefined
      });
      expect(response.status).toBe(200);
    });

    it('should filter by status', async() => {
      let mockAppointments = [
        {
          id: '1',
          patient_id: 'patient-1',
          doctorId: 'doctor-1',
          appointment_date: '2024-01-20',
          appointmentTime: '10:00',
          type: 'treatment',
          status: 'completed'
        }
      ];

      mockRealDB.getAppointments.mockResolvedValue(mockAppointments);

      let request = new import { NextRequest } from "next/server";(
        'http://localhost:3000/api/appointments?status=completed'
      );
      let response = await GET(request);

      expect(mockRealDB.getAppointments).toHaveBeenCalledWith({
        patientId: undefined,
        doctorId: undefined,
        date: undefined,
        status: 'completed'
      });
      expect(response.status).toBe(200);
    });

    it('should handle database errors', async() => {
      mockRealDB.getAppointments.mockRejectedValue(
        new Error('Database connection failed')
      );

      let request = new import { NextRequest } from "next/server";('http://localhost:3000/api/appointments');
      let response = await GET(request);
      let data = await response.json();

      expect(response.status).toBe(500);
      expect(data.success).toBe(false);
      expect(data.error).toBe('Internal server error');
    });
  });

  describe('POST /api/appointments', () => {
    it('should create a new appointment successfully', async() => {
      let appointmentData = {
        patientId: 'patient-1',
        doctorId: 'doctor-1',
        appointment_date: '2024-01-20',
        appointmentTime: '10:00',
        duration_minutes: 60,
        type: 'treatment',
        notes: 'موعد علاج طبيعي',
        insurance_covered: true,
        insurance_approval_number: 'INS123456',
        created_by: 'admin-1'
      };

      let mockAppointment = {
        id: 'appointment-1',
        patient_id: 'patient-1',
        doctorId: 'doctor-1',
        appointment_date: '2024-01-20',
        appointmentTime: '10:00',
        type: 'treatment',
        status: 'scheduled'
      };

      let mockPatient = {
        id: 'patient-1',
        users: {
          name: 'أحمد محمد',
          phone: '+966501234567'
        }
      };

      mockRealDB.createAppointment.mockResolvedValue(mockAppointment);
      mockRealDB.getPatient.mockResolvedValue(mockPatient);
      mockWhatsappAPI.sendTemplateMessage.mockResolvedValue({ success: true });

      let request = new import { NextRequest } from "next/server";(
        'http://localhost:3000/api/appointments',
        {
          method: 'POST',
          body: JSON.stringify(appointmentData),
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      let response = await POST(request);
      let data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.data.appointmentId).toBe('appointment-1');
      expect(data.data.confirmationSent).toBe(true);
      expect(mockRealDB.createAppointment).toHaveBeenCalledWith(
        expect.objectContaining({
          patient_id: 'patient-1',
          doctorId: 'doctor-1',
          appointment_date: '2024-01-20',
          appointmentTime: '10:00',
          type: 'treatment'
        })
      );
      expect(mockWhatsappAPI.sendTemplateMessage).toHaveBeenCalledWith(
        '+966501234567',
        'appointment_confirmation',
        'ar',
        expect.any(Array)
      );
    });

    it('should validate required fields', async() => {
      let invalidData = {
        patientId: 'patient-1',
        // Missing doctorId, date, and time
        type: 'treatment'
      };

      let request = new import { NextRequest } from "next/server";(
        'http://localhost:3000/api/appointments',
        {
          method: 'POST',
          body: JSON.stringify(invalidData),
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      let response = await POST(request);
      let data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.error).toBe(
        'Patient ID, doctor ID, date, and time are required'
      );
    });

    it('should handle WhatsApp API failures gracefully', async() => {
      let appointmentData = {
        patientId: 'patient-1',
        doctorId: 'doctor-1',
        appointment_date: '2024-01-20',
        appointmentTime: '10:00'
      };

      let mockAppointment = {
        id: 'appointment-1',
        patient_id: 'patient-1',
        doctorId: 'doctor-1'
      };

      let mockPatient = {
        id: 'patient-1',
        users: {
          name: 'أحمد محمد',
          phone: '+966501234567'
        }
      };

      mockRealDB.createAppointment.mockResolvedValue(mockAppointment);
      mockRealDB.getPatient.mockResolvedValue(mockPatient);
      mockWhatsappAPI.sendTemplateMessage.mockRejectedValue(
        new Error('WhatsApp API failed')
      );

      let request = new import { NextRequest } from "next/server";(
        'http://localhost:3000/api/appointments',
        {
          method: 'POST',
          body: JSON.stringify(appointmentData),
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      let response = await POST(request);
      let data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.data.confirmationSent).toBe(true); // Should still be true even if WhatsApp fails
    });

    it('should handle database creation errors', async() => {
      let appointmentData = {
        patientId: 'patient-1',
        doctorId: 'doctor-1',
        appointment_date: '2024-01-20',
        appointmentTime: '10:00'
      };

      mockRealDB.createAppointment.mockRejectedValue(
        new Error('Database error')
      );

      let request = new import { NextRequest } from "next/server";(
        'http://localhost:3000/api/appointments',
        {
          method: 'POST',
          body: JSON.stringify(appointmentData),
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      let response = await POST(request);
      let data = await response.json();

      expect(response.status).toBe(500);
      expect(data.success).toBe(false);
      expect(data.error).toBe('Internal server error');
    });
  });

  describe('PUT /api/appointments', () => {
    it('should update an appointment successfully', async() => {
      let updateData = {
        appointmentId: 'appointment-1',
        newDate: '2024-01-21',
        newTime: '11:00',
        reason: 'تغيير في الجدول'
      };

      let mockUpdatedAppointment = {
        id: 'appointment-1',
        appointment_date: '2024-01-21',
        appointmentTime: '11:00',
        status: 'scheduled'
      };

      mockRealDB.updateAppointment.mockResolvedValue(mockUpdatedAppointment);

      let request = new import { NextRequest } from "next/server";(
        'http://localhost:3000/api/appointments',
        {
          method: 'PUT',
          body: JSON.stringify(updateData),
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      let response = await PUT(request);
      let data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(mockRealDB.updateAppointment).toHaveBeenCalledWith(
        'appointment-1',
        expect.objectContaining({
          appointment_date: '2024-01-21',
          appointmentTime: '11:00'
        })
      );
    });

    it('should handle appointment not found', async() => {
      let updateData = {
        appointmentId: 'nonexistent',
        newDate: '2024-01-21',
        newTime: '11:00'
      };

      mockRealDB.updateAppointment.mockRejectedValue(
        new Error('Appointment not found')
      );

      let request = new import { NextRequest } from "next/server";(
        'http://localhost:3000/api/appointments',
        {
          method: 'PUT',
          body: JSON.stringify(updateData),
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      let response = await PUT(request);
      let data = await response.json();

      expect(response.status).toBe(500);
      expect(data.success).toBe(false);
      expect(data.error).toBe('Internal server error');
    });
  });
});
