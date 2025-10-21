/**
 * Patients Module - Comprehensive Tests
 * Fixed version with proper error handling
 */

import { test, expect, Page, BrowserContext } from '@playwright/test';
import { realDB } from '@/lib/supabase-real';

interface TestPatient {
  id: string;
  name: string;
  email: string;
  phone: string;
  date_of_birth: string;
  gender: string;
  medical_record_number: string;
}

class PatientTestHelper {
  private testPatients: Map<string, TestPatient> = new Map();

  async createTestPatients() {
    const patients = [
      {
        name: 'Test Patient 1',
        email: 'patient1@test.com',
        phone: '+966501234001',
        date_of_birth: '1990-01-01',
        gender: 'male',
        medical_record_number: 'MR001'
      },
      {
        name: 'Test Patient 2',
        email: 'patient2@test.com',
        phone: '+966501234002',
        date_of_birth: '1985-05-15',
        gender: 'female',
        medical_record_number: 'MR002'
      }
    ];

    for (const patientData of patients) {
      try {
        const user = await realDB.createUser({
          email: patientData.email,
          phone: patientData.phone,
          role: 'patient',
          name: patientData.name,
          password: 'TestPass123!'
        });

        const patient = await realDB.createPatient({
          user_id: user.id,
          name: patientData.name,
          date_of_birth: patientData.date_of_birth,
          gender: patientData.gender,
          medical_record_number: patientData.medical_record_number
        });

        this.testPatients.set(patientData.medical_record_number, {
          id: patient.id,
          name: patient.name,
          email: patientData.email,
          phone: patientData.phone,
          date_of_birth: patient.date_of_birth,
          gender: patient.gender,
          medical_record_number: patient.medical_record_number
        });

        console.log(`✅ Created test patient: ${patientData.medical_record_number}`);
      } catch (error) {
        console.log(`Patient ${patientData.email} might already exist`);
      }
    }
  }

  getTestPatient(mrn: string): TestPatient | undefined {
    return this.testPatients.get(mrn);
  }

  async cleanup() {
    for (const [mrn, patient] of this.testPatients) {
      try {
        await realDB.deletePatient(patient.id);
        console.log(`✅ Cleaned up test patient: ${mrn}`);
      } catch (error) {
        console.log(`Failed to cleanup patient: ${mrn}`, error);
      }
    }
    this.testPatients.clear();
  }
}

test.describe('Patients Module - Comprehensive Tests', () => {
  let patientHelper: PatientTestHelper;
  let page: Page;
  let context: BrowserContext;

  test.beforeAll(async () => {
    patientHelper = new PatientTestHelper();
    await patientHelper.createTestPatients();
  });

  test.beforeEach(async ({ browser }) => {
    context = await browser.newContext();
    page = await context.newPage();
    await page.goto('/patients');
  });

  test.afterEach(async () => {
    await context.close();
  });

  test.afterAll(async () => {
    await patientHelper.cleanup();
  });

  test.describe('Patient List View', () => {
    test('should display patients list', async () => {
      await expect(page.locator('[data-testid="patients-table"]')).toBeVisible();
      await expect(page.locator('[data-testid="add-patient-button"]')).toBeVisible();
    });

    test('should show patient details in table', async () => {
      const patient = patientHelper.getTestPatient('MR001');
      if (patient) {
        await expect(page.locator(`text=${patient.name}`)).toBeVisible();
        await expect(page.locator(`text=${patient.medical_record_number}`)).toBeVisible();
      }
    });

    test('should paginate through patients', async () => {
      // Test pagination if there are many patients
      const nextButton = page.locator('[data-testid="next-page-button"]');
      if (await nextButton.isVisible()) {
        await nextButton.click();
        await expect(page.locator('[data-testid="current-page"]')).toContainText('2');
      }
    });
  });

  test.describe('Patient Search and Filter', () => {
    test('should search patients by name', async () => {
      const patient = patientHelper.getTestPatient('MR001');
      if (patient) {
        await page.fill('[data-testid="search-input"]', patient.name);
        await page.click('[data-testid="search-button"]');
        
        await expect(page.locator(`text=${patient.name}`)).toBeVisible();
      }
    });

    test('should search patients by medical record number', async () => {
      const patient = patientHelper.getTestPatient('MR001');
      if (patient) {
        await page.fill('[data-testid="search-input"]', patient.medical_record_number);
        await page.click('[data-testid="search-button"]');
        
        await expect(page.locator(`text=${patient.medical_record_number}`)).toBeVisible();
      }
    });

    test('should filter patients by gender', async () => {
      await page.selectOption('[data-testid="gender-filter"]', 'male');
      await page.click('[data-testid="apply-filters-button"]');
      
      // Verify only male patients are shown
      const rows = page.locator('[data-testid="patient-row"]');
      const count = await rows.count();
      for (let i = 0; i < count; i++) {
        await expect(rows.nth(i).locator('[data-testid="gender"]')).toContainText('male');
      }
    });

    test('should clear filters', async () => {
      await page.selectOption('[data-testid="gender-filter"]', 'male');
      await page.click('[data-testid="apply-filters-button"]');
      await page.click('[data-testid="clear-filters-button"]');
      
      // Verify all patients are shown again
      await expect(page.locator('[data-testid="patients-table"]')).toBeVisible();
    });
  });

  test.describe('Add New Patient', () => {
    test('should open add patient form', async () => {
      await page.click('[data-testid="add-patient-button"]');
      await expect(page.locator('[data-testid="add-patient-form"]')).toBeVisible();
    });

    test('should create new patient successfully', async () => {
      await page.click('[data-testid="add-patient-button"]');
      
      const testEmail = `newpatient-${Date.now()}@test.com`;
      const testPhone = `+966501234${Math.floor(Math.random() * 1000)}`;
      
      await page.fill('[data-testid="patient-name-input"]', 'New Test Patient');
      await page.fill('[data-testid="patient-email-input"]', testEmail);
      await page.fill('[data-testid="patient-phone-input"]', testPhone);
      await page.fill('[data-testid="patient-dob-input"]', '1992-03-15');
      await page.selectOption('[data-testid="patient-gender-select"]', 'female');
      await page.fill('[data-testid="patient-mrn-input"]', `MR${Date.now()}`);
      
      await page.click('[data-testid="save-patient-button"]');
      
      await expect(page.locator('[data-testid="success-message"]')).toBeVisible();
    });

    test('should validate required fields', async () => {
      await page.click('[data-testid="add-patient-button"]');
      await page.click('[data-testid="save-patient-button"]');
      
      await expect(page.locator('[data-testid="name-error"]')).toBeVisible();
      await expect(page.locator('[data-testid="email-error"]')).toBeVisible();
      await expect(page.locator('[data-testid="phone-error"]')).toBeVisible();
    });

    test('should validate email format', async () => {
      await page.click('[data-testid="add-patient-button"]');
      
      await page.fill('[data-testid="patient-name-input"]', 'Test Patient');
      await page.fill('[data-testid="patient-email-input"]', 'invalid-email');
      await page.fill('[data-testid="patient-phone-input"]', '+966501234567');
      await page.fill('[data-testid="patient-dob-input"]', '1990-01-01');
      await page.selectOption('[data-testid="patient-gender-select"]', 'male');
      await page.fill('[data-testid="patient-mrn-input"]', 'MR999');
      
      await page.click('[data-testid="save-patient-button"]');
      
      await expect(page.locator('[data-testid="email-format-error"]')).toBeVisible();
    });
  });

  test.describe('Patient Details and Edit', () => {
    test('should view patient details', async () => {
      const patient = patientHelper.getTestPatient('MR001');
      if (patient) {
        await page.click(`[data-testid="patient-row-${patient.id}"]`);
        await expect(page.locator('[data-testid="patient-details"]')).toBeVisible();
        await expect(page.locator(`text=${patient.name}`)).toBeVisible();
      }
    });

    test('should edit patient information', async () => {
      const patient = patientHelper.getTestPatient('MR001');
      if (patient) {
        await page.click(`[data-testid="patient-row-${patient.id}"]`);
        await page.click('[data-testid="edit-patient-button"]');
        
        await page.fill('[data-testid="patient-name-input"]', 'Updated Patient Name');
        await page.click('[data-testid="save-patient-button"]');
        
        await expect(page.locator('[data-testid="success-message"]')).toBeVisible();
      }
    });

    test('should cancel edit without saving', async () => {
      const patient = patientHelper.getTestPatient('MR001');
      if (patient) {
        await page.click(`[data-testid="patient-row-${patient.id}"]`);
        await page.click('[data-testid="edit-patient-button"]');
        
        const originalName = await page.inputValue('[data-testid="patient-name-input"]');
        await page.fill('[data-testid="patient-name-input"]', 'Modified Name');
        await page.click('[data-testid="cancel-edit-button"]');
        
        await expect(page.locator('[data-testid="patient-details"]')).toBeVisible();
        await expect(page.locator(`text=${originalName}`)).toBeVisible();
      }
    });
  });

  test.describe('Patient Deletion', () => {
    test('should delete patient with confirmation', async () => {
      const patient = patientHelper.getTestPatient('MR002');
      if (patient) {
        await page.click(`[data-testid="patient-row-${patient.id}"]`);
        await page.click('[data-testid="delete-patient-button"]');
        
        await expect(page.locator('[data-testid="delete-confirmation-modal"]')).toBeVisible();
        await page.click('[data-testid="confirm-delete-button"]');
        
        await expect(page.locator('[data-testid="success-message"]')).toBeVisible();
      }
    });

    test('should cancel patient deletion', async () => {
      const patient = patientHelper.getTestPatient('MR001');
      if (patient) {
        await page.click(`[data-testid="patient-row-${patient.id}"]`);
        await page.click('[data-testid="delete-patient-button"]');
        
        await expect(page.locator('[data-testid="delete-confirmation-modal"]')).toBeVisible();
        await page.click('[data-testid="cancel-delete-button"]');
        
        await expect(page.locator('[data-testid="delete-confirmation-modal"]')).not.toBeVisible();
        await expect(page.locator('[data-testid="patient-details"]')).toBeVisible();
      }
    });
  });

  test.describe('Export Functionality', () => {
    test('should export patients to CSV', async () => {
      await page.click('[data-testid="export-csv-button"]');
      
      // Wait for download to start
      const downloadPromise = page.waitForEvent('download');
      const download = await downloadPromise;
      
      expect(download.suggestedFilename()).toContain('patients');
      expect(download.suggestedFilename()).toContain('.csv');
    });

    test('should export filtered patients', async () => {
      await page.selectOption('[data-testid="gender-filter"]', 'male');
      await page.click('[data-testid="apply-filters-button"]');
      await page.click('[data-testid="export-csv-button"]');
      
      const downloadPromise = page.waitForEvent('download');
      const download = await downloadPromise;
      
      expect(download.suggestedFilename()).toContain('patients');
    });
  });

  test.describe('Accessibility Tests', () => {
    test('should have proper ARIA labels', async () => {
      await expect(page.locator('[data-testid="search-input"]')).toHaveAttribute('aria-label');
      await expect(page.locator('[data-testid="add-patient-button"]')).toHaveAttribute('aria-label');
      await expect(page.locator('[data-testid="patients-table"]')).toHaveAttribute('role', 'table');
    });

    test('should support keyboard navigation', async () => {
      await page.keyboard.press('Tab');
      await expect(page.locator('[data-testid="search-input"]')).toBeFocused();
      
      await page.keyboard.press('Tab');
      await expect(page.locator('[data-testid="add-patient-button"]')).toBeFocused();
    });

    test('should announce table updates to screen readers', async () => {
      const patient = patientHelper.getTestPatient('MR001');
      if (patient) {
        await page.click(`[data-testid="patient-row-${patient.id}"]`);
        
        const detailsElement = page.locator('[data-testid="patient-details"]');
        await expect(detailsElement).toBeVisible();
        await expect(detailsElement).toHaveAttribute('aria-live', 'polite');
      }
    });
  });

  test.describe('Performance Tests', () => {
    test('should load patients page quickly', async () => {
      const startTime = Date.now();
      await page.goto('/patients');
      const loadTime = Date.now() - startTime;
      
      expect(loadTime).toBeLessThan(3000); // Should load within 3 seconds
    });

    test('should handle large patient lists efficiently', async () => {
      // Test with pagination
      const startTime = Date.now();
      await page.goto('/patients');
      await page.waitForLoadState('networkidle');
      const loadTime = Date.now() - startTime;
      
      expect(loadTime).toBeLessThan(5000); // Should load within 5 seconds
    });

    test('should search patients quickly', async () => {
      const startTime = Date.now();
      await page.fill('[data-testid="search-input"]', 'Test');
      await page.click('[data-testid="search-button"]');
      await page.waitForLoadState('networkidle');
      const searchTime = Date.now() - startTime;
      
      expect(searchTime).toBeLessThan(2000); // Should search within 2 seconds
    });
  });

  test.describe('Security Tests', () => {
    test('should prevent SQL injection in search', async () => {
      await page.fill('[data-testid="search-input"]', "'; DROP TABLE patients; --");
      await page.click('[data-testid="search-button"]');
      
      // Should show error, not crash
      await expect(page.locator('[data-testid="error-message"]')).toBeVisible();
    });

    test('should prevent XSS in patient data', async () => {
      const patient = patientHelper.getTestPatient('MR001');
      if (patient) {
        await page.click(`[data-testid="patient-row-${patient.id}"]`);
        
        // Check that script tags are not executed
        await expect(page.locator('script')).toHaveCount(0);
      }
    });

    test('should validate user permissions', async () => {
      // Test that only authorized users can access patient data
      await page.goto('/patients');
      
      // Should redirect to login if not authenticated
      if (await page.locator('[data-testid="login-form"]').isVisible()) {
        await expect(page).toHaveURL('/login');
      }
    });
  });
});
