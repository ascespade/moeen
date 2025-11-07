/**
 * Comprehensive Playwright & Supabase Tests
 * ???????? ????? ???????? Playwright ? Supabase
 */

import { test, expect } from '@playwright/test';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const baseURL = process.env.BASE_URL || 'http://localhost:3000';

const supabase = createClient(supabaseUrl, supabaseKey);

test.describe('Comprehensive System Tests', () => {
  // Test 1: Supabase Connection
  test('? Supabase Connection Test', async () => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('count')
        .limit(1);
      expect(error).toBeNull();
      console.log('? Test 1: Supabase Connection - PASSED');
    } catch (error) {
      console.log('? Test 1: Supabase Connection - FAILED');
      throw error;
    }
  });

  // Test 2: Database Tables Exist
  test('? Database Tables Exist', async () => {
    const requiredTables = [
      'users',
      'patients',
      'doctors',
      'appointments',
      'insurance_claims',
    ];
    const results: string[] = [];

    for (const table of requiredTables) {
      try {
        const { error } = await supabase.from(table).select('*').limit(1);
        if (error) {
          results.push(`? ${table}: ${error.message}`);
        } else {
          results.push(`? ${table}: EXISTS`);
        }
      } catch (error) {
        results.push(`? ${table}: ERROR`);
      }
    }

    console.log('Test 2 Results:', results.join('\n'));
    const failed = results.filter(r => r.startsWith('?'));
    expect(failed.length).toBe(0);
  });

  // Test 3: API Health Check
  test('? API Health Check', async ({ request }) => {
    try {
      const response = await request.get(`${baseURL}/api/health`);
      expect(response.status()).toBe(200);
      const data = await response.json();
      expect(data.status).toBe('ok');
      console.log('? Test 3: API Health Check - PASSED');
    } catch (error) {
      console.log('? Test 3: API Health Check - FAILED');
      throw error;
    }
  });

  // Test 4: Homepage Loads
  test('? Homepage Loads', async ({ page }) => {
    try {
      await page.goto(baseURL);
      await page.waitForLoadState('networkidle');
      expect(page.url()).toContain(baseURL);
      console.log('? Test 4: Homepage Loads - PASSED');
    } catch (error) {
      console.log('? Test 4: Homepage Loads - FAILED');
      throw error;
    }
  });

  // Test 5: Login Page Accessibility
  test('? Login Page Accessibility', async ({ page }) => {
    try {
      await page.goto(`${baseURL}/login`);
      await page.waitForLoadState('networkidle');

      // Check for form elements
      const emailInput = page.locator(
        'input[type="email"], input[name="email"]'
      );
      const passwordInput = page.locator(
        'input[type="password"], input[name="password"]'
      );
      const submitButton = page.locator(
        'button[type="submit"], button:has-text("????? ??????")'
      );

      await expect(emailInput).toBeVisible();
      await expect(passwordInput).toBeVisible();
      await expect(submitButton).toBeVisible();

      console.log('? Test 5: Login Page Accessibility - PASSED');
    } catch (error) {
      console.log('? Test 5: Login Page Accessibility - FAILED');
      throw error;
    }
  });

  // Test 6: API Routes Authentication
  test('? API Routes Authentication', async ({ request }) => {
    const protectedRoutes = [
      '/api/patients',
      '/api/appointments',
      '/api/doctors',
    ];

    const results: string[] = [];

    for (const route of protectedRoutes) {
      try {
        const response = await request.get(`${baseURL}${route}`);
        // Should return 401 or 403 for unauthorized
        const status = response.status();
        if (status === 401 || status === 403) {
          results.push(`? ${route}: Properly protected (${status})`);
        } else {
          results.push(`?? ${route}: Unexpected status (${status})`);
        }
      } catch (error) {
        results.push(`? ${route}: ERROR`);
      }
    }

    console.log('Test 6 Results:', results.join('\n'));
    const failed = results.filter(r => r.startsWith('?'));
    expect(failed.length).toBe(0);
  });

  // Test 7: Database Queries Performance
  test('? Database Queries Performance', async () => {
    const queries = [
      {
        name: 'Users Count',
        query: () =>
          supabase.from('users').select('*', { count: 'exact', head: true }),
      },
      {
        name: 'Patients Count',
        query: () =>
          supabase.from('patients').select('*', { count: 'exact', head: true }),
      },
      {
        name: 'Appointments Count',
        query: () =>
          supabase
            .from('appointments')
            .select('*', { count: 'exact', head: true }),
      },
    ];

    const results: string[] = [];

    for (const { name, query } of queries) {
      try {
        const start = Date.now();
        const { error } = await query();
        const duration = Date.now() - start;

        if (error) {
          results.push(`? ${name}: ${error.message}`);
        } else if (duration > 5000) {
          results.push(`?? ${name}: Slow (${duration}ms)`);
        } else {
          results.push(`? ${name}: Fast (${duration}ms)`);
        }
      } catch (error) {
        results.push(`? ${name}: ERROR`);
      }
    }

    console.log('Test 7 Results:', results.join('\n'));
    const failed = results.filter(r => r.startsWith('?'));
    expect(failed.length).toBe(0);
  });

  // Test 8: Page Load Performance
  test('? Page Load Performance', async ({ page }) => {
    const pages = ['/', '/login', '/about'];
    const results: string[] = [];

    for (const path of pages) {
      try {
        const start = Date.now();
        await page.goto(`${baseURL}${path}`);
        await page.waitForLoadState('networkidle');
        const duration = Date.now() - start;

        if (duration > 10000) {
          results.push(`?? ${path}: Slow (${duration}ms)`);
        } else {
          results.push(`? ${path}: Fast (${duration}ms)`);
        }
      } catch (error) {
        results.push(`? ${path}: ERROR`);
      }
    }

    console.log('Test 8 Results:', results.join('\n'));
    const failed = results.filter(r => r.startsWith('?'));
    expect(failed.length).toBe(0);
  });

  // Test 9: Accessibility Basics
  test('? Accessibility Basics', async ({ page }) => {
    try {
      await page.goto(baseURL);
      await page.waitForLoadState('networkidle');

      // Check for basic accessibility
      const hasTitle = await page.title();
      expect(hasTitle).toBeTruthy();

      const buttons = await page.locator('button').count();
      const buttonsWithAria = await page.locator('button[aria-label]').count();

      console.log(`? Test 9: Accessibility Basics - PASSED`);
      console.log(
        `   Total buttons: ${buttons}, With aria-label: ${buttonsWithAria}`
      );
    } catch (error) {
      console.log('? Test 9: Accessibility Basics - FAILED');
      throw error;
    }
  });

  // Test 10: Error Handling
  test('? Error Handling', async ({ request }) => {
    try {
      // Test 404
      const notFound = await request.get(`${baseURL}/api/nonexistent`);
      expect([404, 405]).toContain(notFound.status());

      // Test invalid method
      const invalidMethod = await request.post(`${baseURL}/api/health`);
      expect([405, 500]).toContain(invalidMethod.status());

      console.log('? Test 10: Error Handling - PASSED');
    } catch (error) {
      console.log('? Test 10: Error Handling - FAILED');
      throw error;
    }
  });
});
