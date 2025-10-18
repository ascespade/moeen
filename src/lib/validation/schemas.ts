import { z } from "zod";

// User validation schemas
export const userSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  role: z.enum(["patient", "doctor", "staff", "supervisor", "admin"]),
  meta: z.record(z.string(), z.any()).optional(),
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(1, "Password is required"),
  rememberMe: z.boolean().optional(),
});

// Patient validation schemas
export const patientSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  dob: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format (YYYY-MM-DD)"),
  phone: z.string().regex(/^\+?[1-9]\d{1,14}$/, "Invalid phone number format"),
  insuranceProvider: z.string().optional(),
  insuranceNumber: z.string().optional(),
  meta: z.record(z.string(), z.any()).optional(),
});

export const patientUpdateSchema = patientSchema.partial();

// Doctor validation schemas
export const doctorSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  speciality: z.string().min(2, "Speciality must be at least 2 characters"),
  schedule: z.record(z.string(), z.any()).optional(),
  meta: z.record(z.string(), z.any()).optional(),
});

// Appointment validation schemas
export const appointmentSchema = z.object({
  patientId: z.string().uuid("Invalid patient ID format"),
  doctorId: z.string().uuid("Invalid doctor ID format"),
  scheduledAt: z.string().datetime("Invalid datetime format"),
  type: z.string().default("consultation"),
  status: z
    .enum([
      "pending",
      "confirmed",
      "in_progress",
      "completed",
      "cancelled",
      "no_show",
    ])
    .optional(),
  paymentStatus: z.enum(["unpaid", "paid", "pending", "refunded"]).optional(),
});

export const appointmentUpdateSchema = appointmentSchema.partial();

// Payment validation schemas
export const paymentSchema = z.object({
  appointmentId: z.string().uuid("Invalid appointment ID format"),
  amount: z.number().positive("Amount must be positive"),
  currency: z.string().length(3, "Currency must be 3 characters").optional(),
  method: z.enum(["cash", "card", "bank_transfer", "insurance"]),
  status: z.enum(["pending", "completed", "failed", "refunded"]).optional(),
  meta: z.record(z.string(), z.any()).optional(),
});

// Insurance claim validation schemas
export const insuranceClaimSchema = z.object({
  patientId: z.string().uuid("Invalid patient ID format"),
  appointmentId: z.string().uuid("Invalid appointment ID format"),
  provider: z.string().min(2, "Provider must be at least 2 characters"),
  amount: z.number().positive("Amount must be positive"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  diagnosis: z.string().optional(),
  treatment: z.string().optional(),
});

export const claimUpdateSchema = z.object({
  status: z
    .enum(["draft", "submitted", "approved", "rejected", "under_review"])
    .optional(),
  claimPayload: z.record(z.string(), z.any()).optional(),
});

// Translation validation schemas
export const translationSchema = z.object({
  langCode: z.string().length(2, "Language code must be 2 characters"),
  key: z.string().min(1, "Translation key is required"),
  value: z.string().min(1, "Translation value is required"),
});

// Report validation schemas
export const reportSchema = z.object({
  type: z.string().min(2, "Report type must be at least 2 characters"),
  payload: z.record(z.string(), z.any()).optional(),
  generatedAt: z.string().datetime().optional(),
});

// API response validation schemas
export const apiResponseSchema = z.object({
  success: z.boolean(),
  data: z.any().optional(),
  error: z.string().optional(),
  message: z.string().optional(),
});

// Pagination validation schemas
export const paginationSchema = z.object({
  page: z.number().int().positive().optional(),
  limit: z.number().int().positive().max(100).optional(),
  sortBy: z.string().optional(),
  sortOrder: z.enum(["asc", "desc"]).optional(),
});

// Search validation schemas
export const searchSchema = z.object({
  query: z.string().min(1, "Search query is required"),
  filters: z.record(z.string(), z.any()).optional(),
  pagination: paginationSchema.optional(),
});

// File upload validation schemas
export const fileUploadSchema = z.object({
  filename: z.string().min(1, "Filename is required"),
  mimetype: z.string().min(1, "MIME type is required"),
  size: z
    .number()
    .positive("File size must be positive")
    .max(10 * 1024 * 1024, "File size must be less than 10MB"),
  buffer: z.instanceof(Buffer),
});

// Medical record validation schemas
export const medicalRecordSchema = z.object({
  patientId: z.string().uuid(),
  recordType: z.enum([
    "diagnosis",
    "treatment",
    "prescription",
    "lab_result",
    "xray",
    "note",
    "other",
  ]),
  title: z.string().min(1).max(255),
  content: z.string().optional(),
  attachments: z.array(z.string()).optional(),
});

// Appointment update validation schemas (using partial schema from above)

// Notification validation schemas
export const notificationSchema = z.object({
  type: z.enum([
    "appointment_confirmation",
    "payment_confirmation",
    "appointment_reminder",
    "insurance_claim_update",
  ]),
  patientId: z.string().uuid(),
  appointmentId: z.string().uuid().optional(),
  channels: z.array(z.enum(["email", "sms", "both"])).default(["email"]),
  notificationData: z.record(z.string(), z.any()).optional(),
  customMessage: z.string().optional(),
});

// Validation helper functions
export function validateData<T>(
  schema: z.ZodSchema<T>,
  data: unknown,
): { success: true; data: T } | { success: false; errors: string[] } {
  try {
    const validatedData = schema.parse(data);
    return { success: true, data: validatedData };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        errors: error.issues.map(
          (err) => `${err.path.join(".")}: ${err.message}`,
        ),
      };
    }
    return {
      success: false,
      errors: ["Validation failed"],
    };
  }
}

export function validateQueryParams<T>(
  schema: z.ZodSchema<T>,
  searchParams: URLSearchParams,
): { success: true; data: T } | { success: false; errors: string[] } {
  const params: Record<string, any> = {};

  for (const [key, value] of searchParams.entries()) {
    // Try to parse as number
    if (!isNaN(Number(value))) {
      params[key] = Number(value);
    } else if (value === "true" || value === "false") {
      params[key] = value === "true";
    } else {
      params[key] = value;
    }
  }

  return validateData(schema, params);
}
