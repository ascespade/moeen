/**
 * Validation Schemas for Database Operations
 * Uses Zod for runtime validation of database entities
 */

import { z } from "zod";

/**
 * Base schemas for common fields
 */
const BaseEntitySchema = z.object({
  id: z.string().uuid().optional(),
  public_id: z.string().regex(/^[a-z]+_[a-z0-9]{25}$/),
  created_at: z.string().datetime().optional(),
  updated_at: z.string().datetime().optional(),
});

const UserReferenceSchema = z.object({
  user_id: z.string().uuid(),
});

/**
 * Healthcare Entity Schemas
 */
export const PatientSchema = BaseEntitySchema.extend({
  name: z.string().min(1).max(255),
  email: z.string().email().optional(),
  phone: z
    .string()
    .regex(/^(\+966|966|0)?[5-9][0-9]{8}$/)
    .optional(),
  date_of_birth: z.string().date().optional(),
  gender: z.enum(["male", "female", "other"]).optional(),
  address: z.string().optional(),
  status: z.enum(["active", "inactive", "blocked"]).default("active"),
});

export const DoctorSchema = BaseEntitySchema.extend({
  name: z.string().min(1).max(255),
  email: z.string().email(),
  phone: z.string().regex(/^(\+966|966|0)?[5-9][0-9]{8}$/),
  specialty: z.string().min(1).max(255),
});

export const AppointmentSchema = BaseEntitySchema.extend({
  patient_id: z.string().uuid(),
  doctor_id: z.string().uuid(),
  appointment_date: z.string().date(),
  appointment_time: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
  duration_minutes: z.number().int().min(15).max(480).default(30),
  status: z
    .enum(["scheduled", "confirmed", "completed", "cancelled", "no_show"])
    .default("scheduled"),
  type: z.enum(["consultation", "follow_up", "emergency"]).optional(),
  notes: z.string().optional(),
});

export const SessionSchema = BaseEntitySchema.extend({
  appointment_id: z.string().uuid(),
  doctor_id: z.string().uuid(),
  patient_id: z.string().uuid(),
  session_date: z.string().date(),
  start_time: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
  end_time: z
    .string()
    .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .optional(),
  diagnosis: z.string().optional(),
  treatment_plan: z.string().optional(),
  prescription: z.string().optional(),
  notes: z.string().optional(),
  status: z.enum(["pending", "in_progress", "completed"]).default("pending"),
});

export const InsuranceClaimSchema = BaseEntitySchema.extend({
  patient_id: z.string().uuid(),
  appointment_id: z.string().uuid().optional(),
  claim_number: z.string().min(1).max(100),
  amount: z.number().positive(),
  status: z
    .enum(["pending", "approved", "rejected", "processing"])
    .default("pending"),
  submission_date: z.string().date(),
  approval_date: z.string().date().optional(),
  rejection_reason: z.string().optional(),
  attachments: z.array(z.string().url()).optional(),
});

/**
 * Chatbot Entity Schemas
 */
export const ChatbotFlowSchema = BaseEntitySchema.extend({
  name: z.string().min(1).max(255),
  description: z.string().optional(),
  status: z.enum(["draft", "published", "archived"]).default("draft"),
  version: z.number().int().positive().default(1),
  created_by: z.string().uuid(),
  published_at: z.string().datetime().optional(),
});

export const ChatbotNodeSchema = BaseEntitySchema.extend({
  flow_id: z.string().uuid(),
  node_type: z.enum(["start", "message", "condition", "action", "end"]),
  name: z.string().min(1).max(255),
  config: z.record(z.any()), // JSONB field
  position_x: z.number().int().default(0),
  position_y: z.number().int().default(0),
});

export const ChatbotEdgeSchema = BaseEntitySchema.extend({
  flow_id: z.string().uuid(),
  source_node_id: z.string().uuid(),
  target_node_id: z.string().uuid(),
  condition: z.record(z.any()).optional(), // JSONB field
});

export const ChatbotTemplateSchema = BaseEntitySchema.extend({
  name: z.string().min(1).max(255),
  category: z
    .enum(["greeting", "appointment", "information", "support"])
    .optional(),
  language: z.enum(["ar", "en"]).default("ar"),
  content: z.string().min(1),
  variables: z.record(z.any()).optional(), // JSONB field
  is_approved: z.boolean().default(false),
  created_by: z.string().uuid(),
  approved_by: z.string().uuid().optional(),
});

export const ChatbotIntegrationSchema = BaseEntitySchema.extend({
  provider: z.enum(["whatsapp", "web", "telegram", "facebook"]),
  name: z.string().min(1).max(255),
  config: z.record(z.any()), // JSONB field
  status: z.enum(["active", "inactive", "error"]).default("inactive"),
  webhook_url: z.string().url().optional(),
  webhook_secret: z.string().optional(),
  last_health_check: z.string().datetime().optional(),
  health_status: z.enum(["healthy", "unhealthy", "unknown"]).default("unknown"),
  created_by: z.string().uuid(),
});

export const ConversationSchema = BaseEntitySchema.extend({
  integration_id: z.string().uuid().optional(),
  patient_id: z.string().uuid().optional(),
  external_id: z.string().optional(),
  status: z.enum(["active", "closed", "archived"]).default("active"),
  channel: z.enum(["whatsapp", "web", "telegram"]),
  started_at: z.string().datetime(),
  ended_at: z.string().datetime().optional(),
  metadata: z.record(z.any()).optional(), // JSONB field
});

export const MessageSchema = BaseEntitySchema.extend({
  conversation_id: z.string().uuid(),
  sender_type: z.enum(["user", "bot", "system"]),
  content: z.string().min(1),
  message_type: z.enum(["text", "image", "file", "button"]).default("text"),
  metadata: z.record(z.any()).optional(), // JSONB field
  sent_at: z.string().datetime(),
  read_at: z.string().datetime().optional(),
});

/**
 * CRM Entity Schemas
 */
export const CrmLeadSchema = BaseEntitySchema.extend({
  name: z.string().min(1).max(255),
  email: z.string().email().optional(),
  phone: z
    .string()
    .regex(/^(\+966|966|0)?[5-9][0-9]{8}$/)
    .optional(),
  company: z.string().optional(),
  source: z.enum(["website", "referral", "social", "cold_call"]).optional(),
  status: z
    .enum(["new", "contacted", "qualified", "unqualified", "converted"])
    .default("new"),
  score: z.number().int().min(0).max(100).default(0),
  notes: z.string().optional(),
  owner_id: z.string().uuid(),
  assigned_at: z.string().datetime(),
});

export const CrmDealSchema = BaseEntitySchema.extend({
  title: z.string().min(1).max(255),
  description: z.string().optional(),
  value: z.number().positive().optional(),
  currency: z.string().length(3).default("SAR"),
  stage: z
    .enum([
      "prospecting",
      "qualification",
      "proposal",
      "negotiation",
      "closed_won",
      "closed_lost",
    ])
    .default("prospecting"),
  probability: z.number().int().min(0).max(100).default(0),
  expected_close_date: z.string().date().optional(),
  actual_close_date: z.string().date().optional(),
  owner_id: z.string().uuid(),
  contact_id: z.string().uuid().optional(),
  lead_id: z.string().uuid().optional(),
});

export const CrmActivitySchema = BaseEntitySchema.extend({
  type: z.enum(["call", "email", "meeting", "task", "note"]),
  subject: z.string().min(1).max(255),
  description: z.string().optional(),
  due_date: z.string().date().optional(),
  due_time: z
    .string()
    .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .optional(),
  status: z.enum(["pending", "completed", "cancelled"]).default("pending"),
  priority: z.enum(["low", "medium", "high"]).default("medium"),
  owner_id: z.string().uuid(),
  contact_id: z.string().uuid().optional(),
  deal_id: z.string().uuid().optional(),
  completed_at: z.string().datetime().optional(),
});

/**
 * System Entity Schemas
 */
export const NotificationSchema = BaseEntitySchema.extend({
  user_id: z.string().uuid(),
  title: z.string().min(1).max(255),
  message: z.string().min(1),
  type: z.enum(["info", "success", "warning", "error"]).default("info"),
  is_read: z.boolean().default(false),
  action_url: z.string().url().optional(),
  metadata: z.record(z.any()).optional(), // JSONB field
  read_at: z.string().datetime().optional(),
});

export const InternalMessageSchema = BaseEntitySchema.extend({
  sender_id: z.string().uuid(),
  recipient_id: z.string().uuid(),
  subject: z.string().optional(),
  content: z.string().min(1),
  is_read: z.boolean().default(false),
  parent_message_id: z.string().uuid().optional(),
  read_at: z.string().datetime().optional(),
});

export const AuditLogSchema = BaseEntitySchema.extend({
  user_id: z.string().uuid().optional(),
  action: z.string().min(1).max(100),
  table_name: z.string().min(1).max(100),
  record_id: z.string().uuid().optional(),
  old_values: z.record(z.any()).optional(), // JSONB field
  new_values: z.record(z.any()).optional(), // JSONB field
  ip_address: z.string().ip().optional(),
  user_agent: z.string().optional(),
});

export const RoleSchema = BaseEntitySchema.extend({
  name: z.string().min(1).max(100),
  description: z.string().optional(),
  permissions: z.array(z.string()), // Array of permission strings
  is_system: z.boolean().default(false),
});

export const UserRoleSchema = BaseEntitySchema.extend({
  user_id: z.string().uuid(),
  role_id: z.string().uuid(),
  assigned_by: z.string().uuid().optional(),
  assigned_at: z.string().datetime(),
});

export const SettingSchema = BaseEntitySchema.extend({
  key: z.string().min(1).max(255),
  value: z.record(z.any()), // JSONB field
  description: z.string().optional(),
  category: z
    .enum(["general", "api", "integrations", "notifications"])
    .default("general"),
  is_public: z.boolean().default(false),
  updated_by: z.string().uuid().optional(),
});

/**
 * User Preferences Schema
 */
export const UserPreferencesSchema = BaseEntitySchema.extend({
  user_id: z.string().uuid(),
  theme: z.enum(["light", "dark", "system"]).default("light"),
  language: z.enum(["ar", "en"]).default("ar"),
  timezone: z.string().default("Asia/Riyadh"),
  notifications_enabled: z.boolean().default(true),
  sidebar_collapsed: z.boolean().default(false),
  dashboard_layout: z.enum(["grid", "list"]).default("grid"),
});

/**
 * Translation Schema
 */
export const TranslationSchema = BaseEntitySchema.extend({
  locale: z.enum(["ar", "en"]),
  namespace: z.string().min(1).max(100),
  key: z.string().min(1).max(255),
  value: z.string().min(1),
});

/**
 * Validation helper functions
 */
export const ValidationHelpers = {
  /**
   * Validate entity data against schema
   */
  validateEntity<T>(
    schema: z.ZodSchema<T>,
    data: unknown,
  ): { success: boolean; data?: T; errors?: string[] } {
    try {
      const validatedData = schema.parse(data);
      return { success: true, data: validatedData };
    } catch (error) {
      if (error instanceof z.ZodError) {
        return {
          success: false,
          errors: error.errors.map(
            (err) => `${err.path.join(".")}: ${err.message}`,
          ),
        };
      }
      return { success: false, errors: ["Unknown validation error"] };
    }
  },

  /**
   * Validate multiple entities
   */
  validateMultipleEntities<T>(
    schema: z.ZodSchema<T>,
    dataArray: unknown[],
  ): {
    success: boolean;
    validData: T[];
    errors: Array<{ index: number; errors: string[] }>;
  } {
    const validData: T[] = [];
    const errors: Array<{ index: number; errors: string[] }> = [];

    dataArray.forEach((data, index) => {
      const result = this.validateEntity(schema, data);
      if (result.success && result.data) {
        validData.push(result.data);
      } else if (result.errors) {
        errors.push({ index, errors: result.errors });
      }
    });

    return {
      success: errors.length === 0,
      validData,
      errors,
    };
  },

  /**
   * Validate public_id format
   */
  validatePublicId(publicId: string): boolean {
    return /^[a-z]+_[a-z0-9]{25}$/.test(publicId);
  },

  /**
   * Validate email format
   */
  validateEmail(email: string): boolean {
    return z.string().email().safeParse(email).success;
  },

  /**
   * Validate phone number (Saudi format)
   */
  validatePhone(phone: string): boolean {
    return /^(\+966|966|0)?[5-9][0-9]{8}$/.test(phone.replace(/\s/g, ""));
  },
};

export default ValidationHelpers;
