/**
 * Medical Records Module E2E Tests
 */

import { test, expect } from '@playwright/test';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

test.describe('Medical Records Module', () => {
  let testPatientId: number;

  test.describe('1. Patient Management', () => {
    test('1.1 should create patient with tracking', async ({ request }) => {
      const { data: patient } = await supabase
        .from('patients')
        .insert({
          full_name: 'Test Patient Medical',
          dob: '1990-01-01',
          phone: '0500000001',
          risk_level: 'low',
          health_score: 100
        })
        .select()
        .single();

      expect(patient).toBeTruthy();
      expect(patient.health_score).toBe(100);
      expect(patient.risk_level).toBe('low');
      testPatientId = patient.id;
    });

    test('1.2 should have tracking columns', async () => {
      const { data } = await supabase
        .from('patients')
        .select('*')
        .eq('id', testPatientId)
        .single();

      expect(data.created_at).toBeTruthy();
      expect(data.last_activity_at).toBeTruthy();
    });

    test('1.3 should calculate health score', async () => {
      const { data, error } = await supabase.rpc('calculate_health_score', {
        p_patient_id: testPatientId
      });

      expect(error).toBeNull();
      expect(data).toBeGreaterThan(0);
    });
  });

  test.describe('2. HIPAA Compliance', () => {
    test('2.1 should log patient access', async () => {
      const testUserId = 'test-user-id';
      
      await supabase.rpc('log_patient_access', {
        p_patient_id: testPatientId,
        p_accessed_by: testUserId,
        p_access_reason: 'Medical review',
        p_ip_address: '127.0.0.1'
      });

      const { data } = await supabase
        .from('patients')
        .select('access_log, last_accessed_by')
        .eq('id', testPatientId)
        .single();

      expect(data.access_log).toBeTruthy();
      expect(data.last_accessed_by).toBe(testUserId);
    });

    test('2.2 should have audit log for access', async () => {
      const { data } = await supabase
        .from('audit_logs')
        .select('*')
        .eq('action', 'patient_record_accessed')
        .eq('resource_id', testPatientId.toString())
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      expect(data).toBeTruthy();
      expect(data.ip_address).toBeTruthy();
    });
  });

  test.describe('3. Health Dashboard', () => {
    test('3.1 should query patient health dashboard', async () => {
      const { data } = await supabase
        .from('patient_health_dashboard')
        .select('*')
        .eq('id', testPatientId)
        .single();

      expect(data).toBeTruthy();
      expect(data.health_score).toBeDefined();
      expect(data.risk_level).toBeDefined();
    });
  });

  test.describe('4. Statistics', () => {
    test('4.1 should get patient statistics', async () => {
      const { data } = await supabase.rpc('get_patient_statistics');

      expect(data).toBeTruthy();
      expect(data[0].total_patients).toBeGreaterThan(0);
    });
  });
});
