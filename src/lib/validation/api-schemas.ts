/**
 * Comprehensive API Validation Schemas using Zod
 * For all API routes and data validation
 * 
 * Usage:
 * import { chatbotFlowSchema } from '@/lib/validation/api-schemas';
 * const validated = chatbotFlowSchema.parse(data);
 */

import { z } from 'zod';

// ================================================================
// COMMON SCHEMAS
// ================================================================

export const paginationSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10),
  sort: z.string().optional(),
  order: z.enum(['asc', 'desc']).optional(),
});

export const publicIdSchema = z.string().regex(/^[a-z]{3}_[a-zA-Z0-9]+$/);

export const uuidSchema = z.string().uuid();

export const emailSchema = z.string().email();

export const phoneSchema = z.string().regex(/^(05|5)\d{8}$/, {
  message: 'رقم الجوال يجب أن يبدأ بـ 05 ويحتوي على 10 أرقام',
});

export const urlSchema = z.string().url();

export const dateSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/);

export const timeSchema = z.string().regex(/^\d{2}:\d{2}(:\d{2})?$/);

// ================================================================
// HEALTHCARE SCHEMAS
// ================================================================

// Patient Schemas
export const patientCreateSchema = z.object({
  name: z.string().min(2).max(100),
  age: z.number().int().positive().max(150),
  phone: phoneSchema,
  email: emailSchema.optional(),
  emergency_contact: phoneSchema.optional(),
  medical_history: z.array(z.string()).default([]),
  date_of_birth: dateSchema.optional(),
  gender: z.enum(['male', 'female']).optional(),
  address: z.string().max(500).optional(),
  insurance_provider: z.string().max(100).optional(),
  insurance_number: z.string().max(50).optional(),
});

export const patientUpdateSchema = patientCreateSchema.partial();

export const patientSearchSchema = z.object({
  query: z.string().min(1),
  filters: z
    .object({
      status: z.enum(['active', 'inactive']).optional(),
      hasInsurance: z.boolean().optional(),
      ageMin: z.number().optional(),
      ageMax: z.number().optional(),
    })
    .optional(),
});

// Appointment Schemas
export const appointmentCreateSchema = z.object({
  patient_id: uuidSchema,
  doctor_id: uuidSchema,
  appointment_date: dateSchema,
  appointment_time: timeSchema,
  type: z.enum(['assessment', 'treatment', 'follow_up', 'consultation']),
  status: z
    .enum(['scheduled', 'confirmed', 'completed', 'cancelled'])
    .default('scheduled'),
  notes: z.string().max(1000).optional(),
  duration_minutes: z.number().int().positive().default(30),
  insurance_covered: z.boolean().default(false),
});

export const appointmentUpdateSchema = appointmentCreateSchema
  .partial()
  .extend({
    id: uuidSchema,
  });

export const appointmentConflictCheckSchema = z.object({
  doctor_id: uuidSchema,
  appointment_date: dateSchema,
  appointment_time: timeSchema,
  duration_minutes: z.number().int().positive(),
  exclude_appointment_id: uuidSchema.optional(),
});

// Session Schemas
export const sessionCreateSchema = z.object({
  patient_id: uuidSchema,
  doctor_id: uuidSchema,
  appointment_id: uuidSchema.optional(),
  session_date: dateSchema,
  session_time: timeSchema,
  type: z.enum(['assessment', 'treatment', 'follow_up']),
  notes: z.string().max(5000).optional(),
  diagnosis: z.string().max(2000).optional(),
  treatment_plan: z.string().max(2000).optional(),
  prescription: z.string().max(2000).optional(),
  exercises: z.array(z.any()).optional(),
  completed: z.boolean().default(false),
});

export const sessionUpdateSchema = sessionCreateSchema.partial();

// Insurance Claims
export const insuranceClaimCreateSchema = z.object({
  patient_id: uuidSchema,
  appointment_id: uuidSchema.optional(),
  session_id: uuidSchema.optional(),
  insurance_provider: z.string().min(2).max(100),
  claim_number: z.string().min(3).max(50),
  amount: z.number().positive(),
  status: z
    .enum(['pending', 'approved', 'rejected', 'under_review'])
    .default('pending'),
  submission_date: dateSchema,
  attachments: z.array(urlSchema).optional(),
});

export const insuranceClaimUpdateSchema = insuranceClaimCreateSchema
  .partial()
  .extend({
    processed_at: dateSchema.optional(),
    rejection_reason: z.string().max(500).optional(),
  });

// ================================================================
// CHATBOT SCHEMAS
// ================================================================

// Chatbot Flow Schemas
export const chatbotFlowCreateSchema = z.object({
  name: z.string().min(2).max(100),
  description: z.string().max(500).optional(),
  status: z.enum(['draft', 'active', 'paused', 'archived']).default('draft'),
  created_by: uuidSchema,
  version: z.number().int().positive().default(1),
});

export const chatbotFlowUpdateSchema = chatbotFlowCreateSchema
  .partial()
  .extend({
    id: uuidSchema,
    published_at: z.string().datetime().optional(),
  });

// Chatbot Node Schemas
export const chatbotNodeCreateSchema = z.object({
  flow_id: uuidSchema,
  type: z.enum(['start', 'message', 'question', 'condition', 'action', 'end']),
  name: z.string().min(1).max(100),
  content: z.record(z.any()).optional(),
  config: z.record(z.any()).optional(),
  position_x: z.number().default(0),
  position_y: z.number().default(0),
});

export const chatbotNodeUpdateSchema = chatbotNodeCreateSchema
  .partial()
  .extend({
    id: uuidSchema,
  });

// Chatbot Template Schemas
export const chatbotTemplateCreateSchema = z.object({
  name: z.string().min(2).max(100),
  category: z.enum(['greeting', 'appointment', 'information', 'support']),
  language: z.enum(['ar', 'en']).default('ar'),
  content: z.string().min(1).max(5000),
  variables: z.array(z.string()).optional(),
  is_approved: z.boolean().default(false),
  created_by: uuidSchema,
});

export const chatbotTemplateUpdateSchema = chatbotTemplateCreateSchema
  .partial()
  .extend({
    id: uuidSchema,
    approved_by: uuidSchema.optional(),
  });

// Chatbot Integration Schemas
export const chatbotIntegrationCreateSchema = z.object({
  provider: z.enum(['whatsapp', 'web', 'telegram', 'facebook']),
  name: z.string().min(2).max(100),
  config: z.record(z.any()),
  status: z.enum(['active', 'inactive', 'error']).default('inactive'),
  webhook_url: urlSchema.optional(),
  webhook_secret: z.string().min(10).optional(),
  created_by: uuidSchema,
});

export const chatbotIntegrationUpdateSchema = chatbotIntegrationCreateSchema
  .partial()
  .extend({
    id: uuidSchema,
    last_health_check: z.string().datetime().optional(),
    health_status: z.enum(['healthy', 'unhealthy', 'unknown']).optional(),
  });

// Conversation Schema
export const conversationCreateSchema = z.object({
  integration_id: uuidSchema,
  patient_id: uuidSchema.optional(),
  external_id: z.string().optional(),
  channel: z.enum(['whatsapp', 'web', 'telegram', 'facebook']),
  status: z.enum(['active', 'closed', 'archived']).default('active'),
  metadata: z.record(z.any()).optional(),
});

export const conversationUpdateSchema = conversationCreateSchema
  .partial()
  .extend({
    id: uuidSchema,
    ended_at: z.string().datetime().optional(),
  });

// Message Schema
export const messageCreateSchema = z.object({
  conversation_id: uuidSchema,
  sender_type: z.enum(['user', 'bot', 'system']),
  content: z.string().min(1).max(10000),
  message_type: z.enum(['text', 'image', 'file', 'button']).default('text'),
  metadata: z.record(z.any()).optional(),
});

// ================================================================
// CRM SCHEMAS
// ================================================================

// CRM Lead Schemas
export const crmLeadCreateSchema = z.object({
  name: z.string().min(2).max(100),
  email: emailSchema.optional(),
  phone: phoneSchema.optional(),
  company: z.string().max(100).optional(),
  source: z.enum([
    'website',
    'referral',
    'social',
    'cold_call',
    'event',
    'other',
  ]),
  status: z
    .enum([
      'new',
      'contacted',
      'qualified',
      'proposal',
      'negotiation',
      'closed_won',
      'closed_lost',
    ])
    .default('new'),
  stage: z.string().max(50).optional(),
  score: z.number().int().min(0).max(100).default(0),
  notes: z.string().max(2000).optional(),
  owner_id: uuidSchema,
});

export const crmLeadUpdateSchema = crmLeadCreateSchema.partial().extend({
  id: uuidSchema,
  conversion_probability: z.number().min(0).max(1).optional(),
  estimated_value: z.number().positive().optional(),
});

// CRM Deal Schemas
export const crmDealCreateSchema = z.object({
  name: z.string().min(2).max(100),
  description: z.string().max(1000).optional(),
  lead_id: uuidSchema.optional(),
  value: z.number().positive(),
  currency: z.string().length(3).default('SAR'),
  stage: z
    .enum([
      'prospecting',
      'qualification',
      'proposal',
      'negotiation',
      'closed_won',
      'closed_lost',
    ])
    .default('prospecting'),
  probability: z.number().int().min(0).max(100).default(0),
  expected_close_date: dateSchema.optional(),
  owner_id: uuidSchema,
  contact_id: uuidSchema.optional(),
});

export const crmDealUpdateSchema = crmDealCreateSchema.partial().extend({
  id: uuidSchema,
  actual_close_date: dateSchema.optional(),
});

// CRM Activity Schemas
export const crmActivityCreateSchema = z.object({
  type: z.enum(['call', 'email', 'meeting', 'task', 'note']),
  subject: z.string().min(2).max(200),
  description: z.string().max(2000).optional(),
  lead_id: uuidSchema.optional(),
  deal_id: uuidSchema.optional(),
  contact_id: uuidSchema.optional(),
  owner_id: uuidSchema,
  due_date: dateSchema.optional(),
  due_time: timeSchema.optional(),
  status: z.enum(['pending', 'completed', 'cancelled']).default('pending'),
  priority: z.enum(['low', 'medium', 'high']).default('medium'),
});

export const crmActivityUpdateSchema = crmActivityCreateSchema
  .partial()
  .extend({
    id: uuidSchema,
    completed_at: z.string().datetime().optional(),
  });

// ================================================================
// SYSTEM SCHEMAS
// ================================================================

// Notification Schemas
export const notificationCreateSchema = z.object({
  user_id: uuidSchema,
  type: z.enum(['info', 'success', 'warning', 'error']).default('info'),
  title: z.string().min(1).max(200),
  message: z.string().min(1).max(1000),
  action_url: urlSchema.optional(),
  metadata: z.record(z.any()).optional(),
});

export const notificationUpdateSchema = z.object({
  id: uuidSchema,
  is_read: z.boolean(),
});

// Setting Schemas
export const settingCreateSchema = z.object({
  key: z.string().min(1).max(100),
  value: z.any(),
  description: z.string().max(500).optional(),
  category: z
    .enum(['general', 'api', 'integrations', 'notifications', 'security'])
    .default('general'),
  is_public: z.boolean().default(false),
});

export const settingUpdateSchema = settingCreateSchema.partial().extend({
  key: z.string().min(1).max(100),
  updated_by: uuidSchema.optional(),
});

// User Schemas
export const userCreateSchema = z.object({
  email: emailSchema,
  password: z.string().min(8).max(100),
  full_name: z.string().min(2).max(100),
  role: z
    .enum([
      'admin',
      'doctor',
      'patient',
      'staff',
      'supervisor',
      'manager',
      'nurse',
      'agent',
      'demo',
    ])
    .default('patient'),
  phone: phoneSchema.optional(),
  avatar_url: urlSchema.optional(),
});

export const userUpdateSchema = userCreateSchema
  .partial()
  .omit({ password: true })
  .extend({
    id: uuidSchema,
  });

export const userLoginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1),
});

export const userPasswordResetSchema = z.object({
  email: emailSchema,
});

export const userPasswordChangeSchema = z.object({
  current_password: z.string().min(1),
  new_password: z.string().min(8).max(100),
  confirm_password: z.string().min(8).max(100),
}).refine((data) => data.new_password === data.confirm_password, {
  message: 'كلمات المرور غير متطابقة',
  path: ['confirm_password'],
});

// ================================================================
// WHATSAPP BUSINESS API SCHEMAS
// ================================================================

export const whatsappMessageSchema = z.object({
  to: phoneSchema,
  type: z.enum(['text', 'image', 'document', 'template']),
  text: z
    .object({
      body: z.string().max(4096),
    })
    .optional(),
  image: z
    .object({
      link: urlSchema.optional(),
      id: z.string().optional(),
      caption: z.string().max(200).optional(),
    })
    .optional(),
  template: z
    .object({
      name: z.string(),
      language: z.object({
        code: z.string().default('ar'),
      }),
      components: z.array(z.any()).optional(),
    })
    .optional(),
});

export const whatsappWebhookSchema = z.object({
  object: z.literal('whatsapp_business_account'),
  entry: z.array(
    z.object({
      id: z.string(),
      changes: z.array(
        z.object({
          value: z.object({
            messaging_product: z.literal('whatsapp'),
            metadata: z.any(),
            contacts: z.array(z.any()).optional(),
            messages: z.array(z.any()).optional(),
            statuses: z.array(z.any()).optional(),
          }),
          field: z.literal('messages'),
        })
      ),
    })
  ),
});

// ================================================================
// ANALYTICS SCHEMAS
// ================================================================

export const analyticsQuerySchema = z.object({
  metric: z.enum([
    'appointments',
    'patients',
    'revenue',
    'sessions',
    'claims',
    'conversations',
  ]),
  start_date: dateSchema,
  end_date: dateSchema,
  group_by: z.enum(['day', 'week', 'month']).optional(),
  filters: z.record(z.any()).optional(),
});

// ================================================================
// HELPER FUNCTIONS
// ================================================================

/**
 * Validate data against a schema and return parsed result
 * @throws ZodError if validation fails
 */
export function validateSchema<T>(schema: z.ZodSchema<T>, data: unknown): T {
  return schema.parse(data);
}

/**
 * Validate data and return success/error object
 */
export function safeValidateSchema<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): { success: true; data: T } | { success: false; errors: z.ZodError } {
  const result = schema.safeParse(data);
  if (result.success) {
    return { success: true, data: result.data };
  } else {
    return { success: false, errors: result.error };
  }
}

/**
 * Format Zod errors for API responses
 */
export function formatZodErrors(error: z.ZodError): Record<string, string[]> {
  const formatted: Record<string, string[]> = {};
  
  error.errors.forEach((err) => {
    const path = err.path.join('.');
    if (!formatted[path]) {
      formatted[path] = [];
    }
    formatted[path].push(err.message);
  });
  
  return formatted;
}

// ================================================================
// TYPE EXPORTS
// ================================================================

export type PatientCreateInput = z.infer<typeof patientCreateSchema>;
export type PatientUpdateInput = z.infer<typeof patientUpdateSchema>;
export type AppointmentCreateInput = z.infer<typeof appointmentCreateSchema>;
export type AppointmentUpdateInput = z.infer<typeof appointmentUpdateSchema>;
export type SessionCreateInput = z.infer<typeof sessionCreateSchema>;
export type SessionUpdateInput = z.infer<typeof sessionUpdateSchema>;
export type InsuranceClaimCreateInput = z.infer<
  typeof insuranceClaimCreateSchema
>;
export type InsuranceClaimUpdateInput = z.infer<
  typeof insuranceClaimUpdateSchema
>;
export type ChatbotFlowCreateInput = z.infer<typeof chatbotFlowCreateSchema>;
export type ChatbotFlowUpdateInput = z.infer<typeof chatbotFlowUpdateSchema>;
export type ChatbotNodeCreateInput = z.infer<typeof chatbotNodeCreateSchema>;
export type ChatbotTemplateCreateInput = z.infer<
  typeof chatbotTemplateCreateSchema
>;
export type CRMLeadCreateInput = z.infer<typeof crmLeadCreateSchema>;
export type CRMLeadUpdateInput = z.infer<typeof crmLeadUpdateSchema>;
export type CRMDealCreateInput = z.infer<typeof crmDealCreateSchema>;
export type CRMDealUpdateInput = z.infer<typeof crmDealUpdateSchema>;
export type CRMActivityCreateInput = z.infer<typeof crmActivityCreateSchema>;
export type NotificationCreateInput = z.infer<typeof notificationCreateSchema>;
export type UserCreateInput = z.infer<typeof userCreateSchema>;
export type UserUpdateInput = z.infer<typeof userUpdateSchema>;
export type UserLoginInput = z.infer<typeof userLoginSchema>;
