import DOMPurify from "isomorphic-dompurify";
import { z } from "zod";
// Sanitization helpers
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ["b", "i", "em", "strong", "p", "br"],
    ALLOWED_ATTR: [],
  });
}
  return text
    .replace(/[<>]/g, "") // Remove potential HTML tags
    .trim()
    .slice(0, 1000); // Limit length
}
// Enhanced validation schemas
  patient: z.object({
    full_name: z
      .string()
      .min(2, "Name must be at least 2 characters")
      .max(100, "Name must be less than 100 characters")
      .transform(sanitizeText),
    email: z
      .string()
      .email("Invalid email format")
      .optional()
      .transform((email) => (email ? email.toLowerCase().trim() : undefined)),
    phone: z
      .string()
      .regex(/^[\+]?[1-9][\d]{0,15}$/, "Invalid phone number format")
      .min(10, "Phone number must be at least 10 digits"),
    date_of_birth: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format")
      .refine((date) => {
        const birthDate = new Date(date);
        const today = new Date();
        const age = today.getFullYear() - birthDate.getFullYear();
        return age >= 0 && age <= 150;
      }, "Invalid birth date"),
    gender: z.enum(["male", "female", "other"]).optional(),
    address: z
      .string()
      .max(500, "Address must be less than 500 characters")
      .optional()
      .transform((addr) => (addr ? sanitizeText(addr) : undefined)),
    medical_history: z
      .string()
      .max(2000, "Medical history must be less than 2000 characters")
      .optional()
      .transform((history) => (history ? sanitizeHtml(history) : undefined)),
    allergies: z
      .string()
      .max(1000, "Allergies must be less than 1000 characters")
      .optional()
      .transform((allergies) =>
        allergies ? sanitizeText(allergies) : undefined,
      ),
  }),
  appointment: z.object({
    patient_id: z.string().uuid("Invalid patient ID"),
    doctor_id: z.string().uuid("Invalid doctor ID"),
    appointment_date: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format")
      .refine((date) => {
        const appointmentDate = new Date(date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return appointmentDate >= today;
      }, "Appointment date cannot be in the past"),
    appointment_time: z
      .string()
      .regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid time format"),
    duration_minutes: z
      .number()
      .int("Duration must be an integer")
      .min(15, "Minimum appointment duration is 15 minutes")
      .max(480, "Maximum appointment duration is 8 hours"),
    type: z.enum(["consultation", "follow_up", "emergency"]).optional(),
    notes: z
      .string()
      .max(1000, "Notes must be less than 1000 characters")
      .optional()
      .transform((notes) => (notes ? sanitizeText(notes) : undefined)),
  }),
  user: z.object({
    email: z
      .string()
      .email("Invalid email format")
      .transform((email) => email.toLowerCase().trim()),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(128, "Password must be less than 128 characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
        "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
      ),
    full_name: z
      .string()
      .min(2, "Name must be at least 2 characters")
      .max(100, "Name must be less than 100 characters")
      .transform(sanitizeText),
    role: z.enum(["admin", "doctor", "therapist", "patient", "family_member"]),
  }),
  // CSRF token validation
  csrf: z.object({
    token: z.string().min(1, "CSRF token is required"),
  }),
};
// Validation middleware
  return async (request: Request): Promise<T> => {
    try {
      const body = await request.json();
      return schema.parse(body);
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new Error(
          `Validation error: ${error.issues.map((e) => e.message).join(", ")}`,
        );
      }
      throw error;
    }
  };
}
// CSRF protection
  return (
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15)
  );
}
  token: string,
  sessionToken: string,
): boolean {
  return token === sessionToken && token.length > 0;
}
// Exports
export function sanitizeHtml(html: string): string {
export function sanitizeText(text: string): string {
export const validationSchemas = {
export function validateRequest<T>(schema: z.ZodSchema<T>) {
export function generateCSRFToken(): string {
export function validateCSRFToken(
export default validationSchemas;