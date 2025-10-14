/**
 * Database Utilities for CUID and Query Management
 * Provides helper functions for database operations with CUID support
 */

import { generatePublicId, cuidEntity } from '@/lib/cuid';

/**
 * Database helper functions for CUID generation and management
 */
export class DatabaseUtils {
  /**
   * Generate public_id for a specific entity type
   */
  static generateEntityId(entityType: keyof typeof cuidEntity): string {
    return cuidEntity[entityType]('');
  }

  /**
   * Generate public_id for multiple entities
   */
  static generateMultipleEntityIds(
    entityType: keyof typeof cuidEntity,
    count: number
  ): string[] {
    return Array.from({ length: count }, () => cuidEntity[entityType](''));
  }

  /**
   * Validate if a string is a valid public_id format
   */
  static isValidPublicId(id: string): boolean {
    return /^[a-z]+_[a-z0-9]{25}$/.test(id);
  }

  /**
   * Extract entity type from public_id
   */
  static extractEntityType(publicId: string): string | null {
    const match = publicId.match(/^([a-z]+)_/);
    return match ? match[1] : null;
  }

  /**
   * Create database insert data with auto-generated public_id
   */
  static createInsertData<T extends Record<string, any>>(
    entityType: keyof typeof cuidEntity,
    data: Omit<T, 'id' | 'public_id'>
  ): T {
    return {
      ...data,
      public_id: cuidEntity[entityType](''),
    } as unknown as T;
  }

  /**
   * Create multiple insert records with auto-generated public_ids
   */
  static createMultipleInsertData<T extends Record<string, any>>(
    entityType: keyof typeof cuidEntity,
    dataArray: Array<Omit<T, 'id' | 'public_id'>>
  ): T[] {
    return dataArray.map(data => this.createInsertData(entityType, data));
  }
}

/**
 * Query builder helpers for common database operations
 */
export class QueryBuilder {
  /**
   * Build WHERE clause for public_id lookup
   */
  static wherePublicId(publicId: string): { public_id: string } {
    return { public_id: publicId };
  }

  /**
   * Build WHERE clause for multiple public_ids
   */
  static wherePublicIds(publicIds: string[]): { public_id: { in: string[] } } {
    return { public_id: { in: publicIds } };
  }

  /**
   * Build pagination parameters
   */
  static paginate(page: number = 1, limit: number = 20): {
    offset: number;
    limit: number;
  } {
    return {
      offset: (page - 1) * limit,
      limit,
    };
  }

  /**
   * Build sorting parameters
   */
  static sortBy(field: string, direction: 'asc' | 'desc' = 'desc'): {
    orderBy: { [key: string]: 'asc' | 'desc' };
  } {
    return {
      orderBy: { [field]: direction },
    };
  }
}

/**
 * Entity-specific database operations
 */
export class EntityOperations {
  /**
   * Patient operations
   */
  static patients = {
    create: (data: any) => DatabaseUtils.createInsertData('patient', data),
    createMultiple: (dataArray: any[]) =>
      DatabaseUtils.createMultipleInsertData('patient', dataArray),
    findByPublicId: (publicId: string) => QueryBuilder.wherePublicId(publicId),
  };

  /**
   * Appointment operations
   */
  static appointments = {
    create: (data: any) => DatabaseUtils.createInsertData('appointment', data),
    createMultiple: (dataArray: any[]) =>
      DatabaseUtils.createMultipleInsertData('appointment', dataArray),
    findByPublicId: (publicId: string) => QueryBuilder.wherePublicId(publicId),
  };

  /**
   * Session operations
   */
  static sessions = {
    create: (data: any) => DatabaseUtils.createInsertData('session', data),
    createMultiple: (dataArray: any[]) =>
      DatabaseUtils.createMultipleInsertData('session', dataArray),
    findByPublicId: (publicId: string) => QueryBuilder.wherePublicId(publicId),
  };

  /**
   * Chatbot flow operations
   */
  static chatbotFlows = {
    create: (data: any) => DatabaseUtils.createInsertData('flow', data),
    createMultiple: (dataArray: any[]) =>
      DatabaseUtils.createMultipleInsertData('flow', dataArray),
    findByPublicId: (publicId: string) => QueryBuilder.wherePublicId(publicId),
  };

  /**
   * CRM lead operations
   */
  static crmLeads = {
    create: (data: any) => DatabaseUtils.createInsertData('lead', data),
    createMultiple: (dataArray: any[]) =>
      DatabaseUtils.createMultipleInsertData('lead', dataArray),
    findByPublicId: (publicId: string) => QueryBuilder.wherePublicId(publicId),
  };

  /**
   * CRM deal operations
   */
  static crmDeals = {
    create: (data: any) => DatabaseUtils.createInsertData('deal', data),
    createMultiple: (dataArray: any[]) =>
      DatabaseUtils.createMultipleInsertData('deal', dataArray),
    findByPublicId: (publicId: string) => QueryBuilder.wherePublicId(publicId),
  };
}

/**
 * Database validation helpers
 */
export class DatabaseValidation {
  /**
   * Validate required fields for entity creation
   */
  static validateRequiredFields<T extends Record<string, any>>(
    data: T,
    requiredFields: (keyof T)[]
  ): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    for (const field of requiredFields) {
      if (!data[field] || (typeof data[field] === 'string' && data[field].trim() === '')) {
        errors.push(`Field '${String(field)}' is required`);
      }
    }
    
    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Validate public_id format
   */
  static validatePublicId(publicId: string): boolean {
    return DatabaseUtils.isValidPublicId(publicId);
  }

  /**
   * Validate email format
   */
  static validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Validate phone number format (Saudi format)
   */
  static validatePhone(phone: string): boolean {
    const phoneRegex = /^(\+966|966|0)?[5-9][0-9]{8}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
  }
}

/**
 * Database migration helpers
 */
export class MigrationHelpers {
  /**
   * Generate backfill data for existing records
   */
  static generateBackfillData(
    entityType: keyof typeof cuidEntity,
    existingRecords: Array<{ id: string }>
  ): Array<{ id: string; public_id: string }> {
    return existingRecords.map(record => ({
      id: record.id,
      public_id: cuidEntity[entityType](''),
    }));
  }

  /**
   * Create migration log entry
   */
  static createMigrationLog(
    migrationName: string,
    status: 'started' | 'completed' | 'failed',
    details?: any
  ) {
    return {
      migration: migrationName,
      status,
      timestamp: new Date().toISOString(),
      details,
    };
  }
}

export default DatabaseUtils;
