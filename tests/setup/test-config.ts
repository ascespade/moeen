/**
 * Test Configuration
 * Phase 3: Comprehensive Test Suite Setup
 */

export const testConfig = {
  // API Configuration
  apiBaseURL: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3001',
  
  // Database Configuration
  database: {
    url: process.env.TEST_DATABASE_URL || process.env.SUPABASE_URL,
    key: process.env.TEST_DATABASE_KEY || process.env.SUPABASE_ANON_KEY,
  },
  
  // Test Users
  testUsers: {
    admin: {
      email: process.env.TEST_ADMIN_EMAIL || 'admin@test.com',
      password: process.env.TEST_ADMIN_PASSWORD || 'Test@1234',
    },
    doctor: {
      email: process.env.TEST_DOCTOR_EMAIL || 'doctor@test.com',
      password: process.env.TEST_DOCTOR_PASSWORD || 'Test@1234',
    },
    patient: {
      email: process.env.TEST_PATIENT_EMAIL || 'patient@test.com',
      password: process.env.TEST_PATIENT_PASSWORD || 'Test@1234',
    },
  },
  
  // Timeouts
  timeouts: {
    api: 10000, // 10 seconds
    database: 5000, // 5 seconds
    e2e: 30000, // 30 seconds
  },
  
  // Test Data
  testData: {
    patient: {
      name: 'Test Patient',
      email: 'testpatient@example.com',
      phone: '+966501234567',
      date_of_birth: '1990-01-01',
    },
    doctor: {
      name: 'Test Doctor',
      email: 'testdoctor@example.com',
      phone: '+966501234568',
      license_number: 'DOC123456',
      specialty: 'General Medicine',
    },
  },
};
