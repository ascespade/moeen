
/**
 * Core Types - الأنواع الأساسية للنظام
 * Centralized type definitions for the entire application
 */

// Base Entity Types
  id: string;
  createdAt: Date;
  updatedAt: Date;
  createdBy?: string;
  updatedBy?: string;
}

// User & Authentication Types
  email: string;
  role: UserRole;
  isActive: boolean;
  lastLoginAt?: Date;
  profile: UserProfile;
  preferences: UserPreferences;
}

  firstName: string;
  lastName: string;
  phone?: string;
  avatar?: string;
  dateOfBirth?: Date;
  gender?: 'male' | 'female' | 'other';
  address?: Address;
}

  language: 'ar' | 'en';
  theme: 'light' | 'dark' | 'system';
  notifications: NotificationSettings;
  privacy: PrivacySettings;
}


// Patient Types
  userId: string;
  medicalRecordNumber: string;
  insuranceProvider?: string;
  insuranceNumber?: string;
  emergencyContact: EmergencyContact;
  medicalHistory: MedicalHistory[];
  isActivated: boolean;
  activationDate?: Date;
}

  name: string;
  relationship: string;
  phone: string;
  email?: string;
}

  id: string;
  condition: string;
  diagnosis: string;
  treatment: string;
  date: Date;
  doctor: string;
  attachments: string[];
}

// Doctor Types
  userId: string;
  speciality: string;
  licenseNumber: string;
  experience: number;
  education: Education[];
  schedule: DoctorSchedule;
  rating: number;
  isAvailable: boolean;
}

  degree: string;
  institution: string;
  year: number;
  specialization?: string;
}

  workingDays: number[];
  workingHours: TimeRange;
  breaks: TimeRange[];
  vacationDays: Date[];
}

  start: string; // HH:MM format
  end: string;   // HH:MM format
}

// Appointment Types
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


// Payment Types
  appointmentId: string;
  amount: number;
  currency: string;
  method: PaymentMethod;
  status: PaymentStatus;
  transactionId?: string;
  gatewayResponse?: any;
  refundAmount?: number;
  refundReason?: string;
}


// Insurance Types
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


// Notification Types
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  isRead: boolean;
  readAt?: Date;
  priority: NotificationPriority;
  channels: NotificationChannel[];
  metadata?: any;
}


// System Types
  key: string;
  value: any;
  category: string;
  description?: string;
  isPublic: boolean;
}

  action: string;
  resourceType: string;
  resourceId: string;
  userId: string;
  metadata: any;
  ipAddress?: string;
  userAgent?: string;
}

// API Response Types
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  pagination?: PaginationInfo;
}

  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

// Form Types
  name: string;
  label: string;
  type: 'text' | 'email' | 'password' | 'number' | 'date' | 'select' | 'textarea' | 'checkbox' | 'radio';
  required: boolean;
  placeholder?: string;
  options?: SelectOption[];
  validation?: ValidationRule[];
}

  value: string;
  label: string;
  disabled?: boolean;
}

  type: 'required' | 'email' | 'min' | 'max' | 'pattern';
  value?: any;
  message: string;
}

// UI Types
  name: string;
  colors: ColorPalette;
  typography: Typography;
  spacing: Spacing;
  borderRadius: BorderRadius;
}

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

  fontFamily: string;
  fontSize: {
    xs: string;
    sm: string;
    base: string;
    lg: string;
    xl: string;
    '2xl': string;
    '3xl': string;
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

  xs: string;
  sm: string;
  md: string;
  lg: string;
  xl: string;
  '2xl': string;
}

  sm: string;
  md: string;
  lg: string;
  full: string;
}

// Utility Types

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

  id: string;
  medications: Medication[];
  instructions: string;
  validUntil: Date;
  doctorId: string;
}

  name: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions: string;
}

  email: boolean;
  sms: boolean;
  push: boolean;
  inApp: boolean;
}

  profileVisibility: 'public' | 'private' | 'contacts_only';
  dataSharing: boolean;
  marketingEmails: boolean;
}

// Exports
export interface BaseEntity {
export interface User extends BaseEntity {
export interface UserProfile {
export interface UserPreferences {
export type UserRole = 'patient' | 'doctor' | 'staff' | 'supervisor' | 'admin';
export interface Patient extends BaseEntity {
export interface EmergencyContact {
export interface MedicalHistory {
export interface Doctor extends BaseEntity {
export interface Education {
export interface DoctorSchedule {
export interface TimeRange {
export interface Appointment extends BaseEntity {
export type AppointmentType = 'consultation' | 'follow_up' | 'emergency' | 'routine_checkup';
export type AppointmentStatus = 'scheduled' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled' | 'no_show';
export type PaymentStatus = 'pending' | 'paid' | 'partial' | 'refunded' | 'cancelled';
export interface Payment extends BaseEntity {
export type PaymentMethod = 'cash' | 'card' | 'bank_transfer' | 'insurance' | 'wallet';
export interface InsuranceClaim extends BaseEntity {
export type ClaimStatus = 'draft' | 'submitted' | 'under_review' | 'approved' | 'rejected' | 'cancelled';
export interface Notification extends BaseEntity {
export type NotificationType = 'appointment_reminder' | 'payment_confirmation' | 'insurance_update' | 'system_alert';
export type NotificationPriority = 'low' | 'medium' | 'high' | 'urgent';
export type NotificationChannel = 'email' | 'sms' | 'push' | 'in_app';
export interface SystemConfig extends BaseEntity {
export interface AuditLog extends BaseEntity {
export interface ApiResponse<T = any> {
export interface PaginationInfo {
export interface FormField {
export interface SelectOption {
export interface ValidationRule {
export interface Theme {
export interface ColorPalette {
export interface Typography {
export interface Spacing {
export interface BorderRadius {
export type Status = 'idle' | 'loading' | 'success' | 'error';
export type SortOrder = 'asc' | 'desc';
export type SortField<T> = keyof T;
export interface Address {
export interface Prescription {
export interface Medication {
export interface NotificationSettings {
export interface PrivacySettings {