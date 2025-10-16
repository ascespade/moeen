/**
 * Validation schemas using Zod
 */

import { _z } from "zod";

// User schemas
export const __userSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  phone: z.string().optional(),
  role: z.enum(["admin", "doctor", "nurse", "patient"]),
  isActive: z.boolean().default(true),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const __createUserSchema = userSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const __updateUserSchema = createUserSchema.partial();

// Appointment schemas
export const __appointmentSchema = z.object({
  id: z.string().uuid(),
  patientId: z.string().uuid(),
  doctorId: z.string().uuid(),
  date: z.date(),
  time: z.string(),
  duration: z.number().min(15).max(480), // 15 minutes to 8 hours
  status: z.enum([
    "scheduled",
    "confirmed",
    "in_progress",
    "completed",
    "cancelled",
  ]),
  notes: z.string().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const __createAppointmentSchema = appointmentSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const __updateAppointmentSchema = createAppointmentSchema.partial();

// Patient schemas
export const __patientSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  dateOfBirth: z.date(),
  gender: z.enum(["male", "female"]),
  bloodType: z
    .enum(["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"])
    .optional(),
  emergencyContact: z.string().optional(),
  medicalHistory: z.string().optional(),
  allergies: z.array(z.string()).default([]),
  medications: z.array(z.string()).default([]),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const __createPatientSchema = patientSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const __updatePatientSchema = createPatientSchema.partial();

// Medical record schemas
export const __medicalRecordSchema = z.object({
  id: z.string().uuid(),
  patientId: z.string().uuid(),
  doctorId: z.string().uuid(),
  diagnosis: z.string(),
  treatment: z.string(),
  notes: z.string().optional(),
  attachments: z.array(z.string()).default([]),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const __createMedicalRecordSchema = medicalRecordSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const __updateMedicalRecordSchema = createMedicalRecordSchema.partial();

// Prescription schemas
export const __prescriptionSchema = z.object({
  id: z.string().uuid(),
  patientId: z.string().uuid(),
  doctorId: z.string().uuid(),
  medications: z.array(
    z.object({
      name: z.string(),
      dosage: z.string(),
      frequency: z.string(),
      duration: z.string(),
      instructions: z.string().optional(),
    }),
  ),
  notes: z.string().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const __createPrescriptionSchema = prescriptionSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const __updatePrescriptionSchema = createPrescriptionSchema.partial();

// Common validation schemas
export const __paginationSchema = z.object({
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(10),
  sortBy: z.string().optional(),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
});

export const __searchSchema = z.object({
  query: z.string().min(1),
  filters: z.record(z.any()).optional(),
});

export const __dateRangeSchema = z.object({
  startDate: z.date(),
  endDate: z.date(),
});

// API response schemas
export const __apiResponseSchema = z.object({
  success: z.boolean(),
  data: z.any().optional(),
  error: z.string().optional(),
  message: z.string().optional(),
});

export const __errorResponseSchema = z.object({
  success: z.literal(false),
  error: z.string(),
  message: z.string().optional(),
  details: z.any().optional(),
});
