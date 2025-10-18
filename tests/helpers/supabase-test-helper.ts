/**
 * Supabase Test Helper - مساعد اختبارات Supabase
 * Provides utilities for testing with Supabase database integration
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Missing Supabase environment variables');
}

// Create Supabase client with service role key for testing
export const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

export interface TestUser {
  id: string;
  email: string;
  name: string;
  role: string;
  status: string;
  created_at: string;
}

export interface TestPatient {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  created_at: string;
}

export class SupabaseTestHelper {
  private testUsers: TestUser[] = [];
  private testPatients: TestPatient[] = [];

  /**
   * Create a test user in the database
   */
  async createTestUser(userData: {
    email: string;
    name: string;
    password?: string;
    role?: string;
    status?: string;
  }): Promise<TestUser> {
    // First create user in auth.users using Supabase Auth
    const { data: authData, error: authError } =
      await supabase.auth.admin.createUser({
        email: userData.email,
        password: userData.password || 'TestPassword123!',
        email_confirm: true,
        user_metadata: {
          name: userData.name,
          role: userData.role || 'agent',
        },
      });

    if (authError) {
      throw new Error(`Failed to create auth user: ${authError.message}`);
    }

    // Then create user in users table
    const { data, error } = await supabase
      .from('users')
      .insert({
        id: authData.user.id,
        email: userData.email,
        name: userData.name,
        role: userData.role || 'agent',
        status: userData.status || 'active',
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create test user: ${error.message}`);
    }

    const testUser: TestUser = {
      id: data.id,
      email: data.email,
      name: data.name,
      role: data.role,
      status: data.status,
      created_at: data.created_at,
    };

    this.testUsers.push(testUser);
    return testUser;
  }

  /**
   * Create a test patient in the database
   */
  async createTestPatient(patientData: {
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
  }): Promise<TestPatient> {
    const { data, error } = await supabase
      .from('patients')
      .insert({
        first_name: patientData.first_name,
        last_name: patientData.last_name,
        email: patientData.email,
        phone: patientData.phone,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create test patient: ${error.message}`);
    }

    const testPatient: TestPatient = {
      id: data.id,
      first_name: data.first_name,
      last_name: data.last_name,
      email: data.email,
      phone: data.phone,
      created_at: data.created_at,
    };

    this.testPatients.push(testPatient);
    return testPatient;
  }

  /**
   * Get user by email
   */
  async getUserByEmail(email: string): Promise<TestUser | null> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null; // User not found
      }
      throw new Error(`Failed to get user: ${error.message}`);
    }

    return {
      id: data.id,
      email: data.email,
      name: data.name,
      role: data.role,
      status: data.status,
      created_at: data.created_at,
    };
  }

  /**
   * Get patient by email
   */
  async getPatientByEmail(email: string): Promise<TestPatient | null> {
    const { data, error } = await supabase
      .from('patients')
      .select('*')
      .eq('email', email)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null; // Patient not found
      }
      throw new Error(`Failed to get patient: ${error.message}`);
    }

    return {
      id: data.id,
      first_name: data.first_name,
      last_name: data.last_name,
      email: data.email,
      phone: data.phone,
      created_at: data.created_at,
    };
  }

  /**
   * Update user status
   */
  async updateUserStatus(userId: string, status: string): Promise<void> {
    const { error } = await supabase
      .from('users')
      .update({
        status,
        updated_at: new Date().toISOString(),
      })
      .eq('id', userId);

    if (error) {
      throw new Error(`Failed to update user status: ${error.message}`);
    }
  }

  /**
   * Create audit log entry
   */
  async createAuditLog(logData: {
    user_id?: string;
    action: string;
    resource_type?: string;
    resource_id?: string;
    old_values?: any;
    new_values?: any;
    ip_address?: string;
    user_agent?: string;
  }): Promise<void> {
    const { error } = await supabase.from('audit_logs').insert({
      user_id: logData.user_id,
      action: logData.action,
      resource_type: logData.resource_type,
      resource_id: logData.resource_id,
      old_values: logData.old_values,
      new_values: logData.new_values,
      ip_address: logData.ip_address,
      user_agent: logData.user_agent,
      created_at: new Date().toISOString(),
    });

    if (error) {
      throw new Error(`Failed to create audit log: ${error.message}`);
    }
  }

  /**
   * Get audit logs for a user
   */
  async getAuditLogs(userId: string, limit: number = 10): Promise<any[]> {
    const { data, error } = await supabase
      .from('audit_logs')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      throw new Error(`Failed to get audit logs: ${error.message}`);
    }

    return data || [];
  }

  /**
   * Clean up all test data
   */
  async cleanup(): Promise<void> {
    // Clean up test users
    for (const user of this.testUsers) {
      try {
        await supabase.from('users').delete().eq('id', user.id);
      } catch (error) {
        console.warn(`Failed to cleanup user ${user.id}:`, error);
      }
    }

    // Clean up test patients
    for (const patient of this.testPatients) {
      try {
        await supabase.from('patients').delete().eq('id', patient.id);
      } catch (error) {
        console.warn(`Failed to cleanup patient ${patient.id}:`, error);
      }
    }

    // Clear arrays
    this.testUsers = [];
    this.testPatients = [];
  }

  /**
   * Get database statistics
   */
  async getDatabaseStats(): Promise<{
    totalUsers: number;
    totalPatients: number;
    totalAuditLogs: number;
    recentUsers: number;
  }> {
    const [usersResult, patientsResult, auditLogsResult] = await Promise.all([
      supabase.from('users').select('id', { count: 'exact' }),
      supabase.from('patients').select('id', { count: 'exact' }),
      supabase.from('audit_logs').select('id', { count: 'exact' }),
    ]);

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentUsersResult = await supabase
      .from('users')
      .select('id', { count: 'exact' })
      .gte('created_at', thirtyDaysAgo.toISOString());

    return {
      totalUsers: usersResult.count || 0,
      totalPatients: patientsResult.count || 0,
      totalAuditLogs: auditLogsResult.count || 0,
      recentUsers: recentUsersResult.count || 0,
    };
  }

  /**
   * Clear rate limiting cache (for testing purposes)
   */
  async clearRateLimit(): Promise<void> {
    try {
      // Call the clear rate limit API
      const response = await fetch(
        'http://localhost:3001/api/test/clear-rate-limit',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.ok) {
        console.log('Rate limiting cache cleared for testing');
      } else {
        console.warn('Failed to clear rate limiting cache via API');
      }
    } catch (error) {
      console.warn('Failed to clear rate limiting cache:', error);
    }
  }
}

export const testHelper = new SupabaseTestHelper();
