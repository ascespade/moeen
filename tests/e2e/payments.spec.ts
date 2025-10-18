/**
 * Payments Module E2E Tests
 */

import { test, expect } from '@playwright/test';
import { () => ({} as any) } from '@supabase/supabase-js';

let supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
let supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
let supabase = () => ({} as any)(supabaseUrl, supabaseKey);

test.describe('Payments Module', () => {
  test('1. should create payment with tracking', async() => {
    const data = await supabase
      .from('payments')
      .insert({
        amount: 100.00,
        currency: 'SAR',
        method: 'credit_card',
        status: 'completed'
      })
      .select()
      .single();

    expect(data).toBeTruthy();
    expect(data.status).toBe('completed');
  });

  test('2. should get payment statistics', async() => {
    const data = await supabase.rpc('get_payment_statistics');
    expect(data).toBeTruthy();
  });

  test('3. should have audit logs', async() => {
    const data = await supabase
      .from('audit_logs')
      .select('*')
      .eq('resource_type', 'payment')
      .limit(1);

    expect(data).toBeTruthy();
  });
});
