/**
 * Core Types - الأنواع الأساسية للنظام
 * Centralized type definitions for the entire application
 */

// Base Entity Types
export interface BaseEntity {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  createdBy?: string;
  updatedBy?: string;
}

// User & Authentication Types
export interface User extends BaseEntity {
  email: string;
  role: UserRole;
  isActive: boolean;
  lastLoginAt?: Date;
  profile: UserProfile;
  preferences: UserPreferences;
}

export interface UserProfile {
  firstName: string;
  lastName: string;
  phone?: string;
  avatar?: string;
  dateOfBirth?: Date;
  gender?: "male" | "female" | "other";
  address?: Address;
}

export interface UserPreferences {
  language: "ar" | "en";
  theme: "light" | "dark" | "system";
  notifications: NotificationSettings;
  privacy: PrivacySettings;
}

export type UserRole = "patient" | "doctor" | "staff" | "supervisor" | "admin";

// Patient Types
export interface Patient extends BaseEntity {
  userId: string;
  medicalRecordNumber: string;
  insuranceProvider?: string;
  insuranceNumber?: string;
  emergencyContact: EmergencyContact;
  medicalHistory: MedicalHistory[];
  isActivated: boolean;
  activationDate?: Date;
}

export interface EmergencyContact {
  name: string;
  relationship: string;
  phone: string;
  email?: string;
}

export interface MedicalHistory {
  id: string;
  condition: string;
  diagnosis: string;
  treatment: string;
  date: Date;
  doctor: string;
  attachments: string[];
}

// Doctor Types
export interface Doctor extends BaseEntity {
  userId: string;
  speciality: string;
  licenseNumber: string;
  experience: number;
  education: Education[];
  schedule: DoctorSchedule;
  rating: number;
  isAvailable: boolean;
}

export interface Education {
  degree: string;
  institution: string;
  year: number;
  specialization?: string;
}

export interface DoctorSchedule {
  workingDays: number[];
  workingHours: TimeRange;
  breaks: TimeRange[];
  vacationDays: Date[];
}

export interface TimeRange {
  start: string; // HH:MM format
  end: string; // HH:MM format
}

// Appointment Types
export interface Appointment extends BaseEntity {
  patientId: string;
  doctorId: string;
  scheduledAt: Date;
  duration: number; // in minutes
  type: AppointmentType;
  status: AppointmentStatus;
  paymentStatus: PaymentStatus;
  notes?: string;
  diagnosis?: string;
  prescription?: Prescription;
  followUpRequired: boolean;
  followUpDate?: Date;
}

export type AppointmentType =
  | "consultation"
  | "follow_up"
  | "emergency"
  | "routine_checkup";
export type AppointmentStatus =
  | "scheduled"
  | "confirmed"
  | "in_progress"
  | "completed"
  | "cancelled"
  | "no_show";
export type PaymentStatus =
  | "pending"
  | "paid"
  | "partial"
  | "refunded"
  | "cancelled";

// Payment Types
export interface Payment extends BaseEntity {
  appointmentId: string;
  amount: number;
  currency: string;
  method: PaymentMethod;
  status: PaymentStatus;
  transactionId?: string;
  gatewayResponse?: unknown;
  refundAmount?: number;
  refundReason?: string;
}

export type PaymentMethod =
  | "cash"
  | "card"
  | "bank_transfer"
  | "insurance"
  | "wallet";

// Insurance Types
export interface InsuranceClaim extends BaseEntity {
  patientId: string;
  appointmentId: string;
  provider: string;
  claimNumber: string;
  amount: number;
  status: ClaimStatus;
  submittedAt?: Date;
  approvedAt?: Date;
  rejectedAt?: Date;
  rejectionReason?: string;
  documents: string[];
}

export type ClaimStatus =
  | "draft"
  | "submitted"
  | "under_review"
  | "approved"
  | "rejected"
  | "cancelled";

// Notification Types
export interface Notification extends BaseEntity {
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  isRead: boolean;
  readAt?: Date;
  priority: NotificationPriority;
  channels: NotificationChannel[];
  metadata?: unknown;
}

export type NotificationType =
  | "appointment_reminder"
  | "payment_confirmation"
  | "insurance_update"
  | "system_alert";
export type NotificationPriority = "low" | "medium" | "high" | "urgent";
export type NotificationChannel = "email" | "sms" | "push" | "in_app";

// System Types
export interface SystemConfig extends BaseEntity {
  key: string;
  value: unknown;
  category: string;
  description?: string;
  isPublic: boolean;
}

export interface AuditLog extends BaseEntity {
  action: string;
  resourceType: string;
  resourceId: string;
  userId: string;
  metadata: unknown;
  ipAddress?: string;
  userAgent?: string;
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  pagination?: PaginationInfo;
}

export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

// Form Types
export interface FormField {
  name: string;
  label: string;
  type:
    | "text"
    | "email"
    | "password"
    | "number"
    | "date"
    | "select"
    | "textarea"
    | "checkbox"
    | "radio";
  required: boolean;
  placeholder?: string;
  options?: SelectOption[];
  validation?: ValidationRule[];
}

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface ValidationRule {
  type: "required" | "email" | "min" | "max" | "pattern";
  value?: unknown;
  message: string;
}

// UI Types
export interface Theme {
  name: string;
  colors: ColorPalette;
  typography: Typography;
  spacing: Spacing;
  borderRadius: BorderRadius;
}

export interface ColorPalette {
  primary: string;
  secondary: string;
  success: string;
  warning: string;
  error: string;
  info: string;
  background: string;
  surface: string;
  text: string;
  textSecondary: string;
  border: string;
}

export interface Typography {
  fontFamily: string;
  fontSize: {
    xs: string;
    sm: string;
    base: string;
    lg: string;
    xl: string;
    "2xl": string;
    "3xl": string;
  };
  fontWeight: {
    normal: number;
    medium: number;
    semibold: number;
    bold: number;
  };
  lineHeight: {
    tight: number;
    normal: number;
    relaxed: number;
  };
}

export interface Spacing {
  xs: string;
  sm: string;
  md: string;
  lg: string;
  xl: string;
  "2xl": string;
}

export interface BorderRadius {
  sm: string;
  md: string;
  lg: string;
  full: string;
}

// Utility Types
export type Status = "idle" | "loading" | "success" | "error";
export type SortOrder = "asc" | "desc";
export type SortField<T> = keyof T;

export interface Address {
  street: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

export interface Prescription {
  id: string;
  medications: Medication[];
  instructions: string;
  validUntil: Date;
  doctorId: string;
}

export interface Medication {
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions: string;
}

export interface NotificationSettings {
  email: boolean;
  sms: boolean;
  push: boolean;
  inApp: boolean;
}

export interface PrivacySettings {
  profileVisibility: "public" | "private" | "contacts_only";
  dataSharing: boolean;
  marketingEmails: boolean;
}
