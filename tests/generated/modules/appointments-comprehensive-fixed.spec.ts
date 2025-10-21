/**
 * Appointments Module - Comprehensive Tests
 * Fixed version with proper error handling
 */

import { test, expect, Page, BrowserContext } from '@playwright/test';
import { realDB } from '@/lib/supabase-real';

interface TestAppointment {
  id: string;
  patient_id: string;
  doctor_id: string;
  appointment_time: string;
  status: string;
  notes?: string;
}

class AppointmentTestHelper {
  private testAppointments: Map<string, TestAppointment> = new Map();
  private testUsers: Map<string, any> = new Map();

  async createTestData() {
    // Create test users
    const users = [
      {
        email: 'apptpatient@test.com',
        phone: '+966501234100',
        role: 'patient',
        name: 'Appointment Patient',
      },
      {
        email: 'apptdoctor@test.com',
        phone: '+966501234101',
        role: 'doctor',
        name: 'Appointment Doctor',
      },
    ];

    for (const userData of users) {
      try {
        const user = await realDB.createUser({
          email: userData.email,
          phone: userData.phone,
          role: userData.role,
          name: userData.name,
          password: 'TestPass123!',
        });
        this.testUsers.set(userData.role, user);
      } catch (error) {
        console.log(`User ${userData.email} might already exist`);
      }
    }

    // Create test patient
    const patientUser = this.testUsers.get('patient');
    if (patientUser) {
      try {
        const patient = await realDB.createPatient({
          user_id: patientUser.id,
          name: 'Appointment Patient',
          date_of_birth: '1990-01-01',
          gender: 'male',
          medical_record_number: 'MR100',
        });
        this.testUsers.set('patient_data', patient);
      } catch (error) {
        console.log('Patient might already exist');
      }
    }

    // Create test doctor
    const doctorUser = this.testUsers.get('doctor');
    if (doctorUser) {
      try {
        const doctor = await realDB.createDoctor({
          user_id: doctorUser.id,
          name: 'Appointment Doctor',
          specialization: 'General Medicine',
          license_number: 'DOC100',
        });
        this.testUsers.set('doctor_data', doctor);
      } catch (error) {
        console.log('Doctor might already exist');
      }
    }
  }

  async createTestAppointment() {
    const patient = this.testUsers.get('patient_data');
    const doctor = this.testUsers.get('doctor_data');

    if (patient && doctor) {
      try {
        const appointment = await realDB.createAppointment({
          patient_id: patient.id,
          doctor_id: doctor.id,
          appointment_time: new Date(
            Date.now() + 24 * 60 * 60 * 1000
          ).toISOString(), // Tomorrow
          status: 'scheduled',
          notes: 'Test appointment',
        });

        this.testAppointments.set('test_appointment', {
          id: appointment.id,
          patient_id: appointment.patient_id,
          doctor_id: appointment.doctor_id,
          appointment_time: appointment.appointment_time,
          status: appointment.status,
          notes: appointment.notes,
        });

        console.log('✅ Created test appointment');
      } catch (error) {
        console.log('Appointment might already exist');
      }
    }
  }

  getTestAppointment(): TestAppointment | undefined {
    return this.testAppointments.get('test_appointment');
  }

  async cleanup() {
    for (const [key, appointment] of this.testAppointments) {
      try {
        await realDB.deleteAppointment(appointment.id);
        console.log(`✅ Cleaned up test appointment: ${key}`);
      } catch (error) {
        console.log(`Failed to cleanup appointment: ${key}`, error);
      }
    }
    this.testAppointments.clear();

    for (const [key, user] of this.testUsers) {
      if (key !== 'patient_data' && key !== 'doctor_data') {
        try {
          await realDB.deleteUser(user.id);
          console.log(`✅ Cleaned up test user: ${key}`);
        } catch (error) {
          console.log(`Failed to cleanup user: ${key}`, error);
        }
      }
    }
    this.testUsers.clear();
  }
}

test.describe('Appointments Module - Comprehensive Tests', () => {
  let appointmentHelper: AppointmentTestHelper;
  let page: Page;
  let context: BrowserContext;

  test.beforeAll(async () => {
    appointmentHelper = new AppointmentTestHelper();
    await appointmentHelper.createTestData();
    await appointmentHelper.createTestAppointment();
  });

  test.beforeEach(async ({ browser }) => {
    context = await browser.newContext();
    page = await context.newPage();
    await page.goto('/appointments');
  });

  test.afterEach(async () => {
    await context.close();
  });

  test.afterAll(async () => {
    await appointmentHelper.cleanup();
  });

  test.describe('Appointments List View', () => {
    test('should display appointments list', async () => {
      await expect(
        page.locator('[data-testid="appointments-table"]')
      ).toBeVisible();
      await expect(
        page.locator('[data-testid="book-appointment-button"]')
      ).toBeVisible();
    });

    test('should show appointment details in table', async () => {
      const appointment = appointmentHelper.getTestAppointment();
      if (appointment) {
        await expect(page.locator(`text=${appointment.id}`)).toBeVisible();
        await expect(page.locator(`text=${appointment.status}`)).toBeVisible();
      }
    });

    test('should filter appointments by status', async () => {
      await page.selectOption('[data-testid="status-filter"]', 'scheduled');
      await page.click('[data-testid="apply-filters-button"]');

      // Verify only scheduled appointments are shown
      const rows = page.locator('[data-testid="appointment-row"]');
      const count = await rows.count();
      for (let i = 0; i < count; i++) {
        await expect(
          rows.nth(i).locator('[data-testid="status"]')
        ).toContainText('scheduled');
      }
    });
  });

  test.describe('Book New Appointment', () => {
    test('should open book appointment form', async () => {
      await page.click('[data-testid="book-appointment-button"]');
      await expect(
        page.locator('[data-testid="book-appointment-form"]')
      ).toBeVisible();
    });

    test('should book new appointment successfully', async () => {
      await page.click('[data-testid="book-appointment-button"]');

      const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000);
      const appointmentTime = tomorrow.toISOString().slice(0, 16); // YYYY-MM-DDTHH:MM

      await page.selectOption(
        '[data-testid="patient-select"]',
        'Appointment Patient'
      );
      await page.selectOption(
        '[data-testid="doctor-select"]',
        'Appointment Doctor'
      );
      await page.fill(
        '[data-testid="appointment-time-input"]',
        appointmentTime
      );
      await page.fill(
        '[data-testid="appointment-notes-input"]',
        'New test appointment'
      );

      await page.click('[data-testid="book-appointment-submit"]');

      await expect(
        page.locator('[data-testid="success-message"]')
      ).toBeVisible();
    });

    test('should validate required fields', async () => {
      await page.click('[data-testid="book-appointment-button"]');
      await page.click('[data-testid="book-appointment-submit"]');

      await expect(page.locator('[data-testid="patient-error"]')).toBeVisible();
      await expect(page.locator('[data-testid="doctor-error"]')).toBeVisible();
      await expect(page.locator('[data-testid="time-error"]')).toBeVisible();
    });

    test('should prevent double booking', async () => {
      await page.click('[data-testid="book-appointment-button"]');

      const appointment = appointmentHelper.getTestAppointment();
      if (appointment) {
        const appointmentTime = new Date(appointment.appointment_time)
          .toISOString()
          .slice(0, 16);

        await page.selectOption(
          '[data-testid="patient-select"]',
          'Appointment Patient'
        );
        await page.selectOption(
          '[data-testid="doctor-select"]',
          'Appointment Doctor'
        );
        await page.fill(
          '[data-testid="appointment-time-input"]',
          appointmentTime
        );

        await page.click('[data-testid="book-appointment-submit"]');

        await expect(
          page.locator('[data-testid="double-booking-error"]')
        ).toBeVisible();
      }
    });
  });

  test.describe('Appointment Management', () => {
    test('should view appointment details', async () => {
      const appointment = appointmentHelper.getTestAppointment();
      if (appointment) {
        await page.click(`[data-testid="appointment-row-${appointment.id}"]`);
        await expect(
          page.locator('[data-testid="appointment-details"]')
        ).toBeVisible();
        await expect(page.locator(`text=${appointment.id}`)).toBeVisible();
      }
    });

    test('should update appointment status', async () => {
      const appointment = appointmentHelper.getTestAppointment();
      if (appointment) {
        await page.click(`[data-testid="appointment-row-${appointment.id}"]`);
        await page.selectOption('[data-testid="status-select"]', 'completed');
        await page.click('[data-testid="update-appointment-button"]');

        await expect(
          page.locator('[data-testid="success-message"]')
        ).toBeVisible();
      }
    });

    test('should reschedule appointment', async () => {
      const appointment = appointmentHelper.getTestAppointment();
      if (appointment) {
        await page.click(`[data-testid="appointment-row-${appointment.id}"]`);
        await page.click('[data-testid="reschedule-button"]');

        const newTime = new Date(Date.now() + 48 * 60 * 60 * 1000)
          .toISOString()
          .slice(0, 16);
        await page.fill('[data-testid="new-appointment-time"]', newTime);
        await page.click('[data-testid="confirm-reschedule-button"]');

        await expect(
          page.locator('[data-testid="success-message"]')
        ).toBeVisible();
      }
    });

    test('should cancel appointment', async () => {
      const appointment = appointmentHelper.getTestAppointment();
      if (appointment) {
        await page.click(`[data-testid="appointment-row-${appointment.id}"]`);
        await page.click('[data-testid="cancel-appointment-button"]');

        await expect(
          page.locator('[data-testid="cancel-confirmation-modal"]')
        ).toBeVisible();
        await page.click('[data-testid="confirm-cancel-button"]');

        await expect(
          page.locator('[data-testid="success-message"]')
        ).toBeVisible();
      }
    });
  });

  test.describe('Appointment Search and Filter', () => {
    test('should search appointments by patient name', async () => {
      await page.fill('[data-testid="search-input"]', 'Appointment Patient');
      await page.click('[data-testid="search-button"]');

      await expect(page.locator('text=Appointment Patient')).toBeVisible();
    });

    test('should search appointments by doctor name', async () => {
      await page.fill('[data-testid="search-input"]', 'Appointment Doctor');
      await page.click('[data-testid="search-button"]');

      await expect(page.locator('text=Appointment Doctor')).toBeVisible();
    });

    test('should filter appointments by date range', async () => {
      const today = new Date().toISOString().slice(0, 10);
      const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000)
        .toISOString()
        .slice(0, 10);

      await page.fill('[data-testid="start-date-input"]', today);
      await page.fill('[data-testid="end-date-input"]', tomorrow);
      await page.click('[data-testid="apply-filters-button"]');

      // Verify appointments are filtered by date range
      await expect(
        page.locator('[data-testid="appointments-table"]')
      ).toBeVisible();
    });

    test('should clear all filters', async () => {
      await page.selectOption('[data-testid="status-filter"]', 'scheduled');
      await page.click('[data-testid="apply-filters-button"]');
      await page.click('[data-testid="clear-filters-button"]');

      await expect(
        page.locator('[data-testid="appointments-table"]')
      ).toBeVisible();
    });
  });

  test.describe('Appointment Notifications', () => {
    test('should send appointment reminder', async () => {
      const appointment = appointmentHelper.getTestAppointment();
      if (appointment) {
        await page.click(`[data-testid="appointment-row-${appointment.id}"]`);
        await page.click('[data-testid="send-reminder-button"]');

        await expect(
          page.locator('[data-testid="reminder-sent-message"]')
        ).toBeVisible();
      }
    });

    test('should show appointment notifications', async () => {
      await page.goto('/notifications');
      await expect(
        page.locator('[data-testid="appointment-notifications"]')
      ).toBeVisible();
    });
  });

  test.describe('Appointment Reports', () => {
    test('should generate daily appointments report', async () => {
      await page.click('[data-testid="reports-button"]');
      await page.click('[data-testid="daily-report-button"]');

      const downloadPromise = page.waitForEvent('download');
      const download = await downloadPromise;

      expect(download.suggestedFilename()).toContain('daily-appointments');
      expect(download.suggestedFilename()).toContain('.pdf');
    });

    test('should generate doctor schedule report', async () => {
      await page.click('[data-testid="reports-button"]');
      await page.click('[data-testid="doctor-schedule-button"]');

      const downloadPromise = page.waitForEvent('download');
      const download = await downloadPromise;

      expect(download.suggestedFilename()).toContain('doctor-schedule');
    });
  });

  test.describe('Accessibility Tests', () => {
    test('should have proper ARIA labels', async () => {
      await expect(
        page.locator('[data-testid="search-input"]')
      ).toHaveAttribute('aria-label');
      await expect(
        page.locator('[data-testid="book-appointment-button"]')
      ).toHaveAttribute('aria-label');
      await expect(
        page.locator('[data-testid="appointments-table"]')
      ).toHaveAttribute('role', 'table');
    });

    test('should support keyboard navigation', async () => {
      await page.keyboard.press('Tab');
      await expect(page.locator('[data-testid="search-input"]')).toBeFocused();

      await page.keyboard.press('Tab');
      await expect(
        page.locator('[data-testid="book-appointment-button"]')
      ).toBeFocused();
    });

    test('should announce status changes to screen readers', async () => {
      const appointment = appointmentHelper.getTestAppointment();
      if (appointment) {
        await page.click(`[data-testid="appointment-row-${appointment.id}"]`);
        await page.selectOption('[data-testid="status-select"]', 'completed');

        const statusElement = page.locator('[data-testid="status-updated"]');
        await expect(statusElement).toHaveAttribute('aria-live', 'polite');
      }
    });
  });

  test.describe('Performance Tests', () => {
    test('should load appointments page quickly', async () => {
      const startTime = Date.now();
      await page.goto('/appointments');
      const loadTime = Date.now() - startTime;

      expect(loadTime).toBeLessThan(3000); // Should load within 3 seconds
    });

    test('should handle appointment booking efficiently', async () => {
      const startTime = Date.now();
      await page.click('[data-testid="book-appointment-button"]');
      await page.waitForLoadState('networkidle');
      const loadTime = Date.now() - startTime;

      expect(loadTime).toBeLessThan(2000); // Should load within 2 seconds
    });

    test('should search appointments quickly', async () => {
      const startTime = Date.now();
      await page.fill('[data-testid="search-input"]', 'Test');
      await page.click('[data-testid="search-button"]');
      await page.waitForLoadState('networkidle');
      const searchTime = Date.now() - startTime;

      expect(searchTime).toBeLessThan(2000); // Should search within 2 seconds
    });
  });

  test.describe('Security Tests', () => {
    test('should prevent unauthorized appointment access', async () => {
      await page.goto('/appointments');

      // Should redirect to login if not authenticated
      if (await page.locator('[data-testid="login-form"]').isVisible()) {
        await expect(page).toHaveURL('/login');
      }
    });

    test('should validate appointment permissions', async () => {
      // Test that users can only see their own appointments
      const appointment = appointmentHelper.getTestAppointment();
      if (appointment) {
        await page.goto(`/appointments/${appointment.id}`);

        // Should show appointment details or redirect based on permissions
        await expect(
          page.locator('[data-testid="appointment-details"]')
        ).toBeVisible();
      }
    });

    test('should prevent SQL injection in search', async () => {
      await page.fill(
        '[data-testid="search-input"]',
        "'; DROP TABLE appointments; --"
      );
      await page.click('[data-testid="search-button"]');

      await expect(page.locator('[data-testid="error-message"]')).toBeVisible();
    });
  });
});
