/**
 * Audit Logger - HIPAA/GDPR Compliance
 * نظام تسجيل العمليات للأمان والامتثال
 *
 * This module provides comprehensive audit logging for:
 * - HIPAA compliance (PHI access tracking)
 * - GDPR compliance (data access logs)
 * - Security event tracking
 * - User activity monitoring
 */

import { createClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';
import { headers } from 'next/headers';

export enum AuditAction {
  // Authentication
  LOGIN = 'login',
  LOGOUT = 'logout',
  LOGIN_FAILED = 'login_failed',
  PASSWORD_RESET = 'password_reset',
  PASSWORD_CHANGED = 'password_changed',

  // CRUD Operations
  CREATE = 'create',
  READ = 'read',
  UPDATE = 'update',
  DELETE = 'delete',

  // Patient Operations (PHI Access)
  PATIENT_CREATED = 'patient_created',
  PATIENT_VIEWED = 'patient_viewed',
  PATIENT_UPDATED = 'patient_updated',
  PATIENT_DELETED = 'patient_deleted',
  PATIENT_SEARCHED = 'patient_searched',

  // Medical Records (PHI Access)
  MEDICAL_RECORD_CREATED = 'medical_record_created',
  MEDICAL_RECORD_VIEWED = 'medical_record_viewed',
  MEDICAL_RECORD_UPDATED = 'medical_record_updated',
  MEDICAL_RECORD_DELETED = 'medical_record_deleted',

  // Appointments
  APPOINTMENT_CREATED = 'appointment_created',
  APPOINTMENT_VIEWED = 'appointment_viewed',
  APPOINTMENT_UPDATED = 'appointment_updated',
  APPOINTMENT_CANCELLED = 'appointment_cancelled',

  // Permissions & Authorization
  PERMISSION_GRANTED = 'permission_granted',
  PERMISSION_REVOKED = 'permission_revoked',
  ROLE_CHANGED = 'role_changed',

  // Security Events
  UNAUTHORIZED_ACCESS = 'unauthorized_access',
  RATE_LIMIT_EXCEEDED = 'rate_limit_exceeded',
  SUSPICIOUS_ACTIVITY = 'suspicious_activity',

  // Data Export/Deletion (GDPR)
  DATA_EXPORTED = 'data_exported',
  DATA_DELETED = 'data_deleted',

  // Configuration Changes
  SETTINGS_UPDATED = 'settings_updated',
  SYSTEM_CONFIG_CHANGED = 'system_config_changed',
}

export interface AuditLogEntry {
  action: AuditAction;
  table_name: string;
  record_id?: number | string;
  old_values?: Record<string, any>;
  new_values?: Record<string, any>;
  user_id?: number | string;
  ip_address?: string;
  user_agent?: string;
  metadata?: Record<string, any>;
}

export class AuditLogger {
  /**
   * Log an audit event
   */
  static async log(entry: AuditLogEntry): Promise<void> {
    try {
      const supabase = await createClient();

      // Get user from session
      const {
        data: { session },
      } = await supabase.auth.getSession();
      const userId = session?.user?.id;

      // Get IP address and user agent from headers
      const headersList = await headers();
      const ipAddress =
        headersList.get('x-forwarded-for') ||
        headersList.get('x-real-ip') ||
        'unknown';
      const userAgent = headersList.get('user-agent') || 'unknown';

      // Prepare audit log data
      const auditData = {
        action: entry.action,
        table_name: entry.table_name,
        record_id: entry.record_id || null,
        old_values: entry.old_values ? entry.old_values : null,
        new_values: entry.new_values ? entry.new_values : null,
        user_id: userId || entry.user_id || null,
        ip_address: entry.ip_address || ipAddress,
        user_agent: entry.user_agent || userAgent,
        metadata: entry.metadata || null,
      };

      // Insert into audit_logs table
      const { error } = await supabase.from('audit_logs').insert(auditData);

      if (error) {
        console.error('Audit log error:', error);
        // Don't throw - audit logging failures shouldn't break the application
      }
    } catch (error) {
      console.error('Failed to create audit log:', error);
      // Silently fail - audit logging should not break the application
    }
  }

  /**
   * Log authentication events
   */
  static async logAuth(
    action: AuditAction.LOGIN | AuditAction.LOGOUT | AuditAction.LOGIN_FAILED,
    userId?: string,
    metadata?: Record<string, any>
  ): Promise<void> {
    await this.log({
      action,
      table_name: 'users',
      user_id: userId,
      metadata: {
        ...metadata,
        timestamp: new Date().toISOString(),
      },
    });
  }

  /**
   * Log PHI (Protected Health Information) access
   * Required for HIPAA compliance
   */
  static async logPHIAccess(
    action: AuditAction,
    tableName: 'patients' | 'medical_records' | 'appointments',
    recordId: number | string,
    metadata?: Record<string, any>
  ): Promise<void> {
    await this.log({
      action,
      table_name: tableName,
      record_id: recordId,
      metadata: {
        ...metadata,
        phi_access: true,
        timestamp: new Date().toISOString(),
      },
    });
  }

  /**
   * Log data access (for GDPR compliance)
   */
  static async logDataAccess(
    tableName: string,
    recordId: number | string,
    action: 'read' | 'export' | 'delete',
    metadata?: Record<string, any>
  ): Promise<void> {
    const auditAction =
      action === 'read'
        ? AuditAction.READ
        : action === 'export'
          ? AuditAction.DATA_EXPORTED
          : AuditAction.DATA_DELETED;

    await this.log({
      action: auditAction,
      table_name: tableName,
      record_id: recordId,
      metadata: {
        ...metadata,
        gdpr_access: true,
        timestamp: new Date().toISOString(),
      },
    });
  }

  /**
   * Log security events
   */
  static async logSecurityEvent(
    action:
      | AuditAction.UNAUTHORIZED_ACCESS
      | AuditAction.RATE_LIMIT_EXCEEDED
      | AuditAction.SUSPICIOUS_ACTIVITY,
    metadata?: Record<string, any>
  ): Promise<void> {
    await this.log({
      action,
      table_name: 'security_events',
      metadata: {
        ...metadata,
        security_event: true,
        severity: 'high',
        timestamp: new Date().toISOString(),
      },
    });
  }

  /**
   * Log permission changes
   */
  static async logPermissionChange(
    action:
      | AuditAction.PERMISSION_GRANTED
      | AuditAction.PERMISSION_REVOKED
      | AuditAction.ROLE_CHANGED,
    targetUserId: number | string,
    oldValue: any,
    newValue: any,
    metadata?: Record<string, any>
  ): Promise<void> {
    await this.log({
      action,
      table_name: 'users',
      record_id: targetUserId,
      old_values: { permission: oldValue },
      new_values: { permission: newValue },
      metadata: {
        ...metadata,
        permission_change: true,
        timestamp: new Date().toISOString(),
      },
    });
  }
}

/**
 * Helper function for quick audit logging in API routes
 */
export async function auditLog(
  action: AuditAction,
  tableName: string,
  options?: {
    recordId?: number | string;
    oldValues?: Record<string, any>;
    newValues?: Record<string, any>;
    metadata?: Record<string, any>;
  }
): Promise<void> {
  await AuditLogger.log({
    action,
    table_name: tableName,
    record_id: options?.recordId,
    old_values: options?.oldValues,
    new_values: options?.newValues,
    metadata: options?.metadata,
  });
}
