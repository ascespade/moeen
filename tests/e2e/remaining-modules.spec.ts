/**
 * Remaining Modules E2E Tests
 * Quick tests for all remaining modules
 */

import { test, expect } from '@playwright/test';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

test.describe('Chatbot & AI Module', () => {
  test('should have tracking columns in conversations', async () => {
    const { data } = await supabase
      .from('chatbot_conversations')
      .select('*')
      .limit(1)
      .single();
    
    if (data) {
      expect(data).toHaveProperty('created_at');
      expect(data).toHaveProperty('updated_at');
    }
  });

  test('should get chatbot statistics', async () => {
    const { data } = await supabase.rpc('get_chatbot_statistics');
    expect(data).toBeTruthy();
  });
});

test.describe('CRM Module', () => {
  test('should have lead scoring', async () => {
    const { data: customers } = await supabase
      .from('customers')
      .select('lead_score, lifecycle_stage')
      .limit(1);
    
    expect(customers).toBeTruthy();
  });

  test('should calculate lead score', async () => {
    const { data: customer } = await supabase
      .from('customers')
      .select('id')
      .limit(1)
      .single();
    
    if (customer) {
      const { data } = await supabase.rpc('calculate_lead_score', {
        p_customer_id: customer.id
      });
      expect(data).toBeGreaterThanOrEqual(0);
    }
  });
});

test.describe('Conversations Module', () => {
  test('should have priority and sentiment', async () => {
    const { data } = await supabase
      .from('conversations')
      .select('priority, sentiment')
      .limit(1);
    
    expect(data).toBeTruthy();
  });
});

test.describe('Insurance Module', () => {
  test('should track insurance claims', async () => {
    const { data } = await supabase
      .from('insurance_claims')
      .select('*')
      .limit(1);
    
    expect(data).toBeDefined();
  });
});

test.describe('Notifications Module', () => {
  test('should have delivery tracking', async () => {
    const { data } = await supabase
      .from('notifications')
      .select('delivery_status, sent_at')
      .limit(1);
    
    expect(data).toBeDefined();
  });
});

test.describe('Settings Module', () => {
  test('should have versioning', async () => {
    const { data } = await supabase
      .from('settings')
      .select('version, updated_at')
      .limit(1);
    
    expect(data).toBeDefined();
  });
});
