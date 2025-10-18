import { z } from "zod";

import { REGEX_PATTERNS } from "../constants";
import { ValidationError } from "../errors";

/**
 * Core Validation - التحقق من البيانات الأساسي
 * Centralized validation system
 */

// Base Validation Schemas
export const baseSchemas = {
  id: z.string().uuid("معرف غير صحيح"),
  email: z.string().email("البريد الإلكتروني غير صحيح"),
  phone: z.string().regex(REGEX_PATTERNS.PHONE, "رقم الهاتف غير صحيح"),
  password: z.string().min(8, "كلمة المرور يجب أن تكون 8 أحرف على الأقل"),
  date: z.string().datetime("تاريخ غير صحيح"),
  positiveNumber: z.number().positive("يجب أن يكون الرقم موجب"),
  nonEmptyString: z.string().min(1, "النص لا يمكن أن يكون فارغاً"),
  url: z.string().url("رابط غير صحيح"),
  medicalRecordNumber: z
    .string()
    .regex(REGEX_PATTERNS.MEDICAL_RECORD, "رقم الملف الطبي غير صحيح"),
  licenseNumber: z
    .string()
    .regex(REGEX_PATTERNS.LICENSE_NUMBER, "رقم الترخيص غير صحيح"),
} as const;

// User Validation Schemas
export const userSchemas = {
  create: z.object({
    email: baseSchemas.email,
    password: baseSchemas.password,
    role: z.enum(["patient", "doctor", "staff", "supervisor", "admin"]),
    profile: z.object({
      firstName: baseSchemas.nonEmptyString,
      lastName: baseSchemas.nonEmptyString,
      phone: baseSchemas.phone.optional(),
      dateOfBirth: baseSchemas.date.optional(),
      gender: z.enum(["male", "female", "other"]).optional(),
    }),
  }),

  update: z.object({
    email: baseSchemas.email.optional(),
    profile: z
      .object({
        firstName: baseSchemas.nonEmptyString.optional(),
        lastName: baseSchemas.nonEmptyString.optional(),
        phone: baseSchemas.phone.optional(),
        dateOfBirth: baseSchemas.date.optional(),
        gender: z.enum(["male", "female", "other"]).optional(),
      })
      .optional(),
    preferences: z
      .object({
        language: z.enum(["ar", "en"]).optional(),
        theme: z.enum(["light", "dark", "system"]).optional(),
      })
      .optional(),
  }),

  login: z.object({
    email: baseSchemas.email,
    password: z.string().min(1, "كلمة المرور مطلوبة"),
  }),
} as const;

// Patient Validation Schemas
export const patientSchemas = {
  create: z.object({
    userId: baseSchemas.id,
    medicalRecordNumber: baseSchemas.medicalRecordNumber,
    insuranceProvider: z.string().optional(),
    insuranceNumber: z.string().optional(),
    emergencyContact: z.object({
      name: baseSchemas.nonEmptyString,
      relationship: baseSchemas.nonEmptyString,
      phone: baseSchemas.phone,
      email: baseSchemas.email.optional(),
    }),
  }),

  update: z.object({
    medicalRecordNumber: baseSchemas.medicalRecordNumber.optional(),
    insuranceProvider: z.string().optional(),
    insuranceNumber: z.string().optional(),
    emergencyContact: z
      .object({
        name: baseSchemas.nonEmptyString.optional(),
        relationship: baseSchemas.nonEmptyString.optional(),
        phone: baseSchemas.phone.optional(),
        email: baseSchemas.email.optional(),
      })
      .optional(),
  }),

  activate: z.object({
    isActivated: z.boolean(),
    activationNotes: z.string().optional(),
  }),
} as const;

// Doctor Validation Schemas
export const doctorSchemas = {
  create: z.object({
    userId: baseSchemas.id,
    speciality: baseSchemas.nonEmptyString,
    licenseNumber: baseSchemas.licenseNumber,
    experience: baseSchemas.positiveNumber,
    education: z.array(
      z.object({
        degree: baseSchemas.nonEmptyString,
        institution: baseSchemas.nonEmptyString,
        year: z.number().int().min(1900).max(new Date().getFullYear()),
        specialization: z.string().optional(),
      }),
    ),
    schedule: z.object({
      workingDays: z.array(z.number().int().min(0).max(6)),
      workingHours: z.object({
        start: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
        end: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
      }),
      breaks: z
        .array(
          z.object({
            start: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
            end: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
          }),
        )
        .optional(),
    }),
  }),

  update: z.object({
    speciality: baseSchemas.nonEmptyString.optional(),
    licenseNumber: baseSchemas.licenseNumber.optional(),
    experience: baseSchemas.positiveNumber.optional(),
    education: z
      .array(
        z.object({
          degree: baseSchemas.nonEmptyString,
          institution: baseSchemas.nonEmptyString,
          year: z.number().int().min(1900).max(new Date().getFullYear()),
          specialization: z.string().optional(),
        }),
      )
      .optional(),
    schedule: z
      .object({
        workingDays: z.array(z.number().int().min(0).max(6)).optional(),
        workingHours: z
          .object({
            start: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
            end: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
          })
          .optional(),
        breaks: z
          .array(
            z.object({
              start: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
              end: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
            }),
          )
          .optional(),
      })
      .optional(),
  }),
} as const;

// Appointment Validation Schemas
export const appointmentSchemas = {
  create: z.object({
    patientId: baseSchemas.id,
    doctorId: baseSchemas.id,
    scheduledAt: baseSchemas.date,
    duration: z.number().int().min(15).max(240), // 15 minutes to 4 hours
    type: z.enum(["consultation", "follow_up", "emergency", "routine_checkup"]),
    notes: z.string().optional(),
  }),

  update: z.object({
    scheduledAt: baseSchemas.date.optional(),
    duration: z.number().int().min(15).max(240).optional(),
    type: z
      .enum(["consultation", "follow_up", "emergency", "routine_checkup"])
      .optional(),
    status: z
      .enum([
        "scheduled",
        "confirmed",
        "in_progress",
        "completed",
        "cancelled",
        "no_show",
      ])
      .optional(),
    notes: z.string().optional(),
    diagnosis: z.string().optional(),
    followUpRequired: z.boolean().optional(),
    followUpDate: baseSchemas.date.optional(),
  }),

  query: z.object({
    patientId: baseSchemas.id.optional(),
    doctorId: baseSchemas.id.optional(),
    status: z
      .enum([
        "scheduled",
        "confirmed",
        "in_progress",
        "completed",
        "cancelled",
        "no_show",
      ])
      .optional(),
    date: baseSchemas.date.optional(),
    page: z.number().int().min(1).optional(),
    limit: z.number().int().min(1).max(100).optional(),
  }),
} as const;

// Payment Validation Schemas
export const paymentSchemas = {
  create: z.object({
    appointmentId: baseSchemas.id,
    amount: baseSchemas.positiveNumber,
    currency: z.string().length(3).default("SAR"),
    method: z.enum(["cash", "card", "bank_transfer", "insurance", "wallet"]),
    metadata: z.record(z.string(), z.any()).optional(),
  }),

  update: z.object({
    status: z
      .enum(["pending", "paid", "partial", "refunded", "cancelled"])
      .optional(),
    refundAmount: baseSchemas.positiveNumber.optional(),
    refundReason: z.string().optional(),
  }),

  process: z.object({
    paymentId: baseSchemas.id,
    gateway: z.enum(["stripe", "moyasar"]),
    gatewayData: z.record(z.string(), z.any()),
  }),
} as const;

// Insurance Validation Schemas
export const insuranceSchemas = {
  create: z.object({
    patientId: baseSchemas.id,
    appointmentId: baseSchemas.id,
    provider: z.enum(["SEHA", "SHOON", "TATMAN"]),
    amount: baseSchemas.positiveNumber,
    description: z.string().min(10, "الوصف يجب أن يكون 10 أحرف على الأقل"),
    diagnosis: z.string().optional(),
    treatment: z.string().optional(),
    documents: z.array(z.string()).optional(),
  }),

  update: z.object({
    status: z
      .enum([
        "draft",
        "submitted",
        "under_review",
        "approved",
        "rejected",
        "cancelled",
      ])
      .optional(),
    rejectionReason: z.string().optional(),
    documents: z.array(z.string()).optional(),
  }),

  submit: z.object({
    claimId: baseSchemas.id,
    providerData: z.record(z.string(), z.any()),
  }),
} as const;

// File Upload Validation Schemas
export const fileUploadSchemas = {
  upload: z.object({
    file: z.any(), // File object
    type: z.enum(["medical_record", "insurance_claim", "profile", "other"]),
    patientId: baseSchemas.id.optional(),
    metadata: z.record(z.string(), z.any()).optional(),
  }),

  query: z.object({
    patientId: baseSchemas.id.optional(),
    type: z
      .enum(["medical_record", "insurance_claim", "profile", "other"])
      .optional(),
    page: z.number().int().min(1).optional(),
    limit: z.number().int().min(1).max(100).optional(),
  }),
} as const;

// Notification Validation Schemas
export const notificationSchemas = {
  send: z.object({
    userId: baseSchemas.id,
    type: z.enum([
      "appointment_reminder",
      "payment_confirmation",
      "insurance_update",
      "system_alert",
    ]),
    title: baseSchemas.nonEmptyString,
    message: baseSchemas.nonEmptyString,
    channels: z.array(z.enum(["email", "sms", "push", "in_app"])),
    priority: z.enum(["low", "medium", "high", "urgent"]).optional(),
    metadata: z.record(z.string(), z.any()).optional(),
  }),

  query: z.object({
    userId: baseSchemas.id.optional(),
    type: z
      .enum([
        "appointment_reminder",
        "payment_confirmation",
        "insurance_update",
        "system_alert",
      ])
      .optional(),
    isRead: z.boolean().optional(),
    page: z.number().int().min(1).optional(),
    limit: z.number().int().min(1).max(100).optional(),
  }),
} as const;

// Validation Helper Functions
export class ValidationHelper {
  public static validate<T>(
    schema: z.ZodSchema<T>,
    data: unknown,
    context?: Record<string, any>,
  ): { success: true; data: T } | { success: false; error: ValidationError } {
    try {
      const validatedData = schema.parse(data);
      return { success: true, data: validatedData };
    } catch (error) {
      if (error instanceof z.ZodError) {
        const validationError = new ValidationError(
          error.issues
            .map((err) => `${err.path.join(".")}: ${err.message}`)
            .join(", "),
          undefined,
          context,
        );
        return { success: false, error: validationError };
      throw error;
    }

  public static async validateAsync<T>(
    schema: z.ZodSchema<T>,
    data: unknown,
    context?: Record<string, any>,
  ): Promise<
    { success: true; data: T } | { success: false; error: ValidationError }
  > {
    try {
      const result = await schema.parseAsync(data);
      return { success: true, data: result };
    } catch (error) {
      if (error instanceof z.ZodError) {
        const validationError = new ValidationError(
          error.issues
            .map((err) => `${err.path.join(".")}: ${err.message}`)
            .join(", "),
          undefined,
          context,
        );
        return { success: false, error: validationError };
      return {
        success: false,
        error: new ValidationError("Unknown validation error"),
      };
    }

  public static validateQueryParams<T>(
    schema: z.ZodSchema<T>,
    searchParams: URLSearchParams,
    context?: Record<string, any>,
  ): { success: true; data: T } | { success: false; error: ValidationError } {
    const params: Record<string, any> = {};

    for (const [key, value] of searchParams.entries()) {
      // Try to parse as number
      if (!isNaN(Number(value))) {
        params[key] = Number(value);
      // Try to parse as boolean
      else if (value === "true" || value === "false") {
        params[key] = value === "true";
      // Keep as string
      else {
        params[key] = value;
      }

    return this.validate(schema, params, context);

  public static validateRequestBody<T>(
    schema: z.ZodSchema<T>,
    body: unknown,
    context?: Record<string, any>,
  ): { success: true; data: T } | { success: false; error: ValidationError } {
    return this.validate(schema, body, context);
  }

// Middleware for API Routes
export const validateRequest = <T>(
  schema: z.ZodSchema<T>,
  context?: Record<string, any>,
) => {
  return (req: any, res: any, next: any) => {
    const validation = ValidationHelper.validateRequestBody(
      schema,
      req.body,
      context,
    );

    if (!validation.success) {
      return res.status(validation.error.statusCode).json({
        success: false,
        error: validation.error.toJSON(),
      });

    req.validatedData = validation.data;
    next();
  };
};

export const validateQuery = <T>(
  schema: z.ZodSchema<T>,
  context?: Record<string, any>,
) => {
  return (req: any, res: any, next: any) => {
    const searchParams = new URLSearchParams(req.url.split("?")[1] || "");
    const validation = ValidationHelper.validateQueryParams(
      schema,
      searchParams,
      context,
    );

    if (!validation.success) {
      return res.status(validation.error.statusCode).json({
        success: false,
        error: validation.error.toJSON(),
      });

    req.validatedQuery = validation.data;
    next();
  };
};
