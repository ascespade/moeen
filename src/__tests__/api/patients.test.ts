import { NextRequest } from "next/server";

import { GET, POST } from "@/app/api/patients/route";
import { realDB } from "@/lib/supabase-real";
import { whatsappAPI } from "@/lib/whatsapp-business-api";

// Comprehensive API Tests for Patients

// Mock dependencies
jest.mock("@/lib/supabase-real");
jest.mock("@/lib/whatsapp-business-api");

const mockRealDB = realDB as jest.Mocked<typeof realDB>;
const mockWhatsappAPI = whatsappAPI as jest.Mocked<typeof whatsappAPI>;

describe("/api/patients", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("GET /api/patients", () => {
    it("should return patients with pagination", async () => {
      const mockPatients = [
        {
          id: "1",
          name: "أحمد محمد",
          age: 25,
          phone: "+966501234567",
          email: "ahmed@example.com",
          role: "patient",
        },
        {
          id: "2",
          name: "فاطمة علي",
          age: 30,
          phone: "+966501234568",
          email: "fatima@example.com",
          role: "patient",
        },
      ];

      const mockPatientDetails = [
        {
          id: "1",
          name: "أحمد محمد",
          age: 25,
          phone: "+966501234567",
          email: "ahmed@example.com",
          status: "active",
        },
      ];

      const mockAppointments = [
        {
          id: "1",
          appointment_date: "2024-01-20",
          appointment_time: "10:00",
        },
      ];

      mockRealDB.searchUsers.mockResolvedValue(mockPatients);
      mockRealDB.getPatient.mockResolvedValue(mockPatientDetails[0]);
      mockRealDB.getAppointments.mockResolvedValue(mockAppointments);

      const request = new NextRequest(
        "http://localhost:3000/api/patients?page=1&limit=20&search=أحمد",
      );
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.data).toHaveLength(2);
      expect(data.pagination).toEqual({
        page: 1,
        limit: 20,
        total: 2,
        totalPages: 1,
      });
    });

    it("should handle search functionality", async () => {
      const mockPatients = [
        {
          id: "1",
          name: "أحمد محمد",
          age: 25,
          phone: "+966501234567",
          email: "ahmed@example.com",
          role: "patient",
        },
      ];

      mockRealDB.searchUsers.mockResolvedValue(mockPatients);
      mockRealDB.getPatient.mockResolvedValue({
        id: "1",
        status: "active",
      });
      mockRealDB.getAppointments.mockResolvedValue([]);

      const request = new NextRequest(
        "http://localhost:3000/api/patients?search=أحمد",
      );
      const response = await GET(request);

      expect(mockRealDB.searchUsers).toHaveBeenCalledWith("أحمد", "patient");
      expect(response.status).toBe(200);
    });

    it("should handle database errors", async () => {
      mockRealDB.searchUsers.mockRejectedValue(
        new Error("Database connection failed"),
      );

      const request = new NextRequest("http://localhost:3000/api/patients");
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.success).toBe(false);
      expect(data.error).toBe("Internal server error");
    });
  });

  describe("POST /api/patients", () => {
    it("should create a new patient successfully", async () => {
      const patientData = {
        name: "أحمد محمد",
        age: 25,
        phone: "+966501234567",
        email: "ahmed@example.com",
        national_id: "1234567890",
        gender: "male",
        address: "جدة",
        city: "جدة",
        emergency_contact: "+966501234569",
        emergency_contact_relation: "أخ",
        insurance_provider: "التعاونية",
        insurance_number: "INS123456",
        medical_history: ["سكري"],
        current_conditions: ["ضغط"],
        medications: ["إنسولين"],
        allergies: ["البنسلين"],
        guardian_name: "محمد أحمد",
        guardian_relation: "والد",
        guardian_phone: "+966501234570",
        medical_conditions: ["سكري"],
        treatment_goals: ["تحسين السيطرة على السكري"],
        assigned_doctor_id: "doctor-1",
      };

      const mockUser = {
        id: "user-1",
        name: "أحمد محمد",
        phone: "+966501234567",
      };

      const mockPatient = {
        id: "user-1",
        status: "active",
      };

      mockRealDB.createUser.mockResolvedValue(mockUser);
      mockRealDB.createPatient.mockResolvedValue(mockPatient);
      mockWhatsappAPI.sendTextMessage.mockResolvedValue({ success: true });

      const request = new NextRequest("http://localhost:3000/api/patients", {
        method: "POST",
        body: JSON.stringify(patientData),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.data.id).toBe("user-1");
      expect(data.data.whatsappSent).toBe(true);
      expect(mockRealDB.createUser).toHaveBeenCalledWith(
        expect.objectContaining({
          name: "أحمد محمد",
          age: 25,
          phone: "+966501234567",
          role: "patient",
        }),
      );
      expect(mockRealDB.createPatient).toHaveBeenCalledWith(
        expect.objectContaining({
          id: "user-1",
          status: "active",
        }),
      );
      expect(mockWhatsappAPI.sendTextMessage).toHaveBeenCalledWith(
        "+966501234567",
        expect.stringContaining("مرحباً أحمد محمد"),
      );
    });

    it("should validate required fields", async () => {
      const invalidData = {
        name: "أحمد محمد",
        // Missing age and phone
        email: "ahmed@example.com",
      };

      const request = new NextRequest("http://localhost:3000/api/patients", {
        method: "POST",
        body: JSON.stringify(invalidData),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.error).toBe("Name, age, and phone are required");
    });

    it("should handle WhatsApp API failures gracefully", async () => {
      const patientData = {
        name: "أحمد محمد",
        age: 25,
        phone: "+966501234567",
      };

      const mockUser = {
        id: "user-1",
        name: "أحمد محمد",
        phone: "+966501234567",
      };

      const mockPatient = {
        id: "user-1",
        status: "active",
      };

      mockRealDB.createUser.mockResolvedValue(mockUser);
      mockRealDB.createPatient.mockResolvedValue(mockPatient);
      mockWhatsappAPI.sendTextMessage.mockRejectedValue(
        new Error("WhatsApp API failed"),
      );

      const request = new NextRequest("http://localhost:3000/api/patients", {
        method: "POST",
        body: JSON.stringify(patientData),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.data.whatsappSent).toBe(true); // Should still be true even if WhatsApp fails
    });

    it("should handle database creation errors", async () => {
      const patientData = {
        name: "أحمد محمد",
        age: 25,
        phone: "+966501234567",
      };

      mockRealDB.createUser.mockRejectedValue(new Error("Database error"));

      const request = new NextRequest("http://localhost:3000/api/patients", {
        method: "POST",
        body: JSON.stringify(patientData),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.success).toBe(false);
      expect(data.error).toBe("Internal server error");
    });
  });
});
