
/**
 * 🔒 Authentication & Authorization System
 * Central export for all auth-related functionality
 */

// Core authorization
    ,
    ,
    ,
    ,
    ,
} from "./authorize";

// RBAC constants
export const ROLES = {
  ADMIN: 'admin' as const,
  SUPERVISOR: 'supervisor' as const,
  STAFF: 'staff' as const,
  DOCTOR: 'doctor' as const,
  PATIENT: 'patient' as const,
  GUARDIAN: 'guardian' as const,
};

export const PERMISSIONS = {
  CREATE_USER: 'create_user',
  READ_USER: 'read_user',
  UPDATE_USER: 'update_user',
  DELETE_USER: 'delete_user',
  CREATE_PATIENT: 'create_patient',
  READ_PATIENT: 'read_patient',
  UPDATE_PATIENT: 'update_patient',
  DELETE_PATIENT: 'delete_patient',
  CREATE_APPOINTMENT: 'create_appointment',
  READ_APPOINTMENT: 'read_appointment',
  UPDATE_APPOINTMENT: 'update_appointment',
  DELETE_APPOINTMENT: 'delete_appointment',
};

export type Role = typeof ROLES[keyof typeof ROLES];
export type Permission = typeof PERMISSIONS[keyof typeof PERMISSIONS];
