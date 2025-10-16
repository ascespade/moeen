/**
 * Database utility functions using Supabase
 * Helper functions for common database operations
 */

import { _Database } from "@/types/supabase";

import { _getServiceSupabase } from "./supabaseClient";

type Tables = Database["public"]["Tables"];

export class DatabaseUtils {
  private supabase;

  constructor() {
    this.supabase = getServiceSupabase();
  }

  // Generic CRUD operations
  async createRecord<T extends keyof Tables>(
    table: T,
    data: Tables[T]["Insert"],
  ): Promise<Tables[T]["Row"]> {
    const { data: result, error } = await this.supabase
      .from(table)
      .insert([data])
      .select()
      .single();

    if (error) throw new Error(`Failed to create ${table}: ${error.message}`);
    return result;
  }

  async getRecord<T extends keyof Tables>(
    table: T,
    id: string,
  ): Promise<Tables[T]["Row"]> {
    const { data, error } = await this.supabase
      .from(table)
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw new Error(`Failed to get ${table}: ${error.message}`);
    return data;
  }

  async updateRecord<T extends keyof Tables>(
    table: T,
    id: string,
    updates: Tables[T]["Update"],
  ): Promise<Tables[T]["Row"]> {
    const { data, error } = await this.supabase
      .from(table)
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single();

    if (error) throw new Error(`Failed to update ${table}: ${error.message}`);
    return data;
  }

  async deleteRecord<T extends keyof Tables>(
    table: T,
    id: string,
  ): Promise<void> {
    const { error } = await this.supabase.from(table).delete().eq("id", id);

    if (error) throw new Error(`Failed to delete ${table}: ${error.message}`);
  }

  // Search and filter operations
  async searchRecords<T extends keyof Tables>(
    table: T,
    filters: Record<string, any> = {},
    options: {
      limit?: number;
      offset?: number;
      orderBy?: string;
      orderDirection?: "asc" | "desc";
    } = {},
  ): Promise<Tables[T]["Row"][]> {
    let query = this.supabase.from(table).select("*");

    // Apply filters
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (Array.isArray(value)) {
          query = query.in(key, value);
        } else if (typeof value === "string" && value.includes("%")) {
          query = query.ilike(key, value);
        } else {
          query = query.eq(key, value);
        }
      }
    });

    // Apply ordering
    if (options.orderBy) {
      query = query.order(options.orderBy, {
        ascending: options.orderDirection !== "desc",
      });
    }

    // Apply pagination
    if (options.limit) {
      query = query.limit(options.limit);
    }

    if (options.offset) {
      query = query.range(
        options.offset,
        options.offset + (options.limit || 10) - 1,
      );
    }

    const { data, error } = await query;

    if (error) throw new Error(`Failed to search ${table}: ${error.message}`);
    return data || [];
  }

  // Count records
  async countRecords<T extends keyof Tables>(
    table: T,
    filters: Record<string, any> = {},
  ): Promise<number> {
    let query = this.supabase
      .from(table)
      .select("*", { count: "exact", head: true });

    // Apply filters
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (Array.isArray(value)) {
          query = query.in(key, value);
        } else if (typeof value === "string" && value.includes("%")) {
          query = query.ilike(key, value);
        } else {
          query = query.eq(key, value);
        }
      }
    });

    const { count, error } = await query;

    if (error) throw new Error(`Failed to count ${table}: ${error.message}`);
    return count || 0;
  }

  // Batch operations
  async createBatch<T extends keyof Tables>(
    table: T,
    records: Tables[T]["Insert"][],
  ): Promise<Tables[T]["Row"][]> {
    const { data, error } = await this.supabase
      .from(table)
      .insert(records)
      .select();

    if (error)
      throw new Error(`Failed to create batch ${table}: ${error.message}`);
    return data || [];
  }

  async updateBatch<T extends keyof Tables>(
    table: T,
    updates: Array<{ id: string; data: Tables[T]["Update"] }>,
  ): Promise<Tables[T]["Row"][]> {
    const results: Tables[T]["Row"][] = [];

    for (const update of updates) {
      const __result = await this.updateRecord(table, update.id, update.data);
      results.push(result);
    }

    return results;
  }

  // Transaction-like operations
  async executeTransaction<T>(
    operations: Array<() => Promise<T>>,
  ): Promise<T[]> {
    const results: T[] = [];

    try {
      for (const operation of operations) {
        const __result = await operation();
        results.push(result);
      }
      return results;
    } catch (error) {
      // In a real transaction, you would rollback here
      throw new Error(`Transaction failed: ${error}`);
    }
  }

  // Audit logging
  async logAuditEvent(_event: {
    user_id?: string;
    action: string;
    table_name: string;
    record_id: string;
    old_values?: unknown;
    new_values?: unknown;
    ip_address?: string;
    user_agent?: string;
  }): Promise<void> {
    const { error } = await this.supabase.from("audit_logs").insert([
      {
        ...event,
        created_at: new Date().toISOString(),
      },
    ]);

    if (error) {
      // // console.error("Failed to log audit event:", error);
      // Don't throw error for audit logging failures
    }
  }

  // Data validation helpers
  validateEmail(_email: string): boolean {
    const __emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  validatePhone(_phone: string): boolean {
    const __phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    return phoneRegex.test(phone.replace(/\s/g, ""));
  }

  validateUUID(_uuid: string): boolean {
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(uuid);
  }

  // Data sanitization
  sanitizeString(_input: string): string {
    return input.trim().replace(/[<>]/g, "");
  }

  sanitizeObject<T extends Record<string, any>>(_obj: T): T {
    const __sanitized = { ...obj };

    Object.keys(sanitized).forEach((key) => {
      if (typeof sanitized[key] === "string") {
        sanitized[key] = this.sanitizeString(sanitized[key]);
      }
    });

    return sanitized;
  }

  // Date utilities
  formatDate(_date: Date | string): string {
    const __d = typeof date === "string" ? new Date(date) : date;
    return d.toISOString().split("T")[0];
  }

  formatDateTime(_date: Date | string): string {
    const __d = typeof date === "string" ? new Date(date) : date;
    return d.toISOString();
  }

  addDays(_date: Date | string, days: number): string {
    const __d = typeof date === "string" ? new Date(date) : date;
    d.setDate(d.getDate() + days);
    return d.toISOString();
  }

  // Pagination helpers
  calculatePagination(_page: number, limit: number) {
    const __offset = (page - 1) * limit;
    return { offset, limit };
  }

  calculateTotalPages(_total: number, limit: number): number {
    return Math.ceil(total / limit);
  }

  // Error handling
  handleDatabaseError(_error: unknown): string {
    if (error.code === "23505") {
      return "Record already exists";
    }
    if (error.code === "23503") {
      return "Referenced record not found";
    }
    if (error.code === "23502") {
      return "Required field is missing";
    }
    if (error.code === "42501") {
      return "Insufficient permissions";
    }
    return error.message || "Database operation failed";
  }
}

// Export default instance
export const __dbUtils = new DatabaseUtils();
export default dbUtils;
