/**
 * API Testing Script - اختبار واجهات برمجة التطبيقات
 * Test all APIs and ensure proper error handling and validation
 */

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

// Test data
const testData = {
  patient: {
    email: 'test.patient@example.com',
    password: 'TestPassword123!',
    role: 'patient',
    profile: {
      fullName: 'Test Patient',
      phone: '+966501234567',
      dateOfBirth: '1990-01-01',
    },
  },
  doctor: {
    email: 'test.doctor@example.com',
    password: 'TestPassword123!',
    role: 'doctor',
    profile: {
      fullName: 'Test Doctor',
      phone: '+966501234568',
      speciality: 'General Practice',
    },
  },
  appointment: {
    patientId: '',
    doctorId: '',
    scheduledAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    type: 'consultation',
    notes: 'Test appointment',
  },
};

// Test results
const testResults = {
  passed: 0,
  failed: 0,
  errors: [],
};

// Helper function to make API calls
async function apiCall(endpoint, method = 'GET', data = null, headers = {}) {
  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
      body: data ? JSON.stringify(data) : undefined,
    });

    const result = await response.json();
    return {
      success: response.ok,
      status: response.status,
      data: result,
    };
  } catch (error) {
    return {
      success: false,
      status: 0,
      data: { error: error.message },
    };
  }
}

// Test function
async function runTest(testName, testFunction) {
  console.log(`\n🧪 Running test: ${testName}`);
  try {
    const result = await testFunction();
    if (result.success) {
      console.log(`✅ ${testName} - PASSED`);
      testResults.passed++;
    } else {
      console.log(`❌ ${testName} - FAILED: ${result.error}`);
      testResults.failed++;
      testResults.errors.push({ test: testName, error: result.error });
    }
  } catch (error) {
    console.log(`❌ ${testName} - ERROR: ${error.message}`);
    testResults.failed++;
    testResults.errors.push({ test: testName, error: error.message });
  }
}

// Individual test functions
async function testHealthCheck() {
  const result = await apiCall('/api/health');
  return {
    success: result.success && result.data.status === 'ok',
    error: result.success ? null : result.data.error,
  };
}

async function testUserRegistration() {
  const result = await apiCall('/api/auth/register', 'POST', testData.patient);
  return {
    success: result.success,
    error: result.success ? null : result.data.error,
  };
}

async function testUserLogin() {
  const result = await apiCall('/api/auth/login', 'POST', {
    email: testData.patient.email,
    password: testData.patient.password,
  });
  
  if (result.success) {
    // Store token for other tests
    global.testToken = result.data.token;
  }
  
  return {
    success: result.success,
    error: result.success ? null : result.data.error,
  };
}

async function testAppointmentBooking() {
  if (!global.testToken) {
    return { success: false, error: 'No auth token available' };
  }

  const result = await apiCall('/api/appointments/book', 'POST', testData.appointment, {
    Authorization: `Bearer ${global.testToken}`,
  });
  
  if (result.success) {
    testData.appointment.id = result.data.data.id;
  }
  
  return {
    success: result.success,
    error: result.success ? null : result.data.error,
  };
}

async function testAppointmentAvailability() {
  const result = await apiCall('/api/appointments/availability?doctorId=test&date=2024-01-01&duration=30');
  return {
    success: result.success,
    error: result.success ? null : result.data.error,
  };
}

async function testMedicalRecordsUpload() {
  if (!global.testToken) {
    return { success: false, error: 'No auth token available' };
  }

  const formData = new FormData();
  formData.append('file', new Blob(['test content'], { type: 'text/plain' }), 'test.txt');
  formData.append('metadata', JSON.stringify({
    patientId: 'test-patient-id',
    recordType: 'note',
    title: 'Test Record',
    description: 'Test medical record',
  }));

  const result = await fetch(`${BASE_URL}/api/medical-records/upload`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${global.testToken}`,
    },
    body: formData,
  });

  return {
    success: result.ok,
    error: result.ok ? null : 'Upload failed',
  };
}

async function testNotificationScheduling() {
  if (!global.testToken) {
    return { success: false, error: 'No auth token available' };
  }

  const result = await apiCall('/api/notifications/schedule', 'POST', {
    type: 'appointment_confirmation',
    recipientId: 'test-recipient-id',
    recipientType: 'patient',
    channels: ['email'],
    templateData: {
      appointmentId: testData.appointment.id,
      date: testData.appointment.scheduledAt,
    },
  }, {
    Authorization: `Bearer ${global.testToken}`,
  });

  return {
    success: result.success,
    error: result.success ? null : result.data.error,
  };
}

async function testReportGeneration() {
  if (!global.testToken) {
    return { success: false, error: 'No auth token available' };
  }

  const result = await apiCall('/api/reports/generate', 'POST', {
    type: 'dashboard_metrics',
    dateRange: {
      startDate: '2024-01-01',
      endDate: '2024-01-31',
    },
    format: 'json',
  }, {
    Authorization: `Bearer ${global.testToken}`,
  });

  return {
    success: result.success,
    error: result.success ? null : result.data.error,
  };
}

async function testAdminUserManagement() {
  if (!global.testToken) {
    return { success: false, error: 'No auth token available' };
  }

  const result = await apiCall('/api/admin/users', 'GET', null, {
    Authorization: `Bearer ${global.testToken}`,
  });

  return {
    success: result.success,
    error: result.success ? null : result.data.error,
  };
}

async function testPaymentProcessing() {
  if (!global.testToken) {
    return { success: false, error: 'No auth token available' };
  }

  const result = await apiCall('/api/payments/process', 'POST', {
    appointmentId: testData.appointment.id,
    amount: 100,
    currency: 'SAR',
    method: 'cash',
    description: 'Test payment',
  }, {
    Authorization: `Bearer ${global.testToken}`,
  });

  return {
    success: result.success,
    error: result.success ? null : result.data.error,
  };
}

async function testInsuranceClaims() {
  if (!global.testToken) {
    return { success: false, error: 'No auth token available' };
  }

  const result = await apiCall('/api/insurance/claims', 'POST', {
    appointmentId: testData.appointment.id,
    provider: 'tawuniya',
    policyNumber: 'POL123456',
    memberId: 'MEM123456',
    claimAmount: 100,
    diagnosis: 'Test diagnosis',
    treatment: 'Test treatment',
  }, {
    Authorization: `Bearer ${global.testToken}`,
  });

  return {
    success: result.success,
    error: result.success ? null : result.data.error,
  };
}

async function testPatientJourney() {
  if (!global.testToken) {
    return { success: false, error: 'No auth token available' };
  }

  const result = await apiCall('/api/patients/journey', 'POST', {
    action: 'activate',
    patientId: 'test-patient-id',
    activationReason: 'First visit',
    notes: 'Test activation',
  }, {
    Authorization: `Bearer ${global.testToken}`,
  });

  return {
    success: result.success,
    error: result.success ? null : result.data.error,
  };
}

async function testChatbotActions() {
  if (!global.testToken) {
    return { success: false, error: 'No auth token available' };
  }

  const result = await apiCall('/api/chatbot/actions', 'POST', {
    action: 'get_patient_info',
    parameters: {
      patientId: 'test-patient-id',
    },
    userId: 'test-user-id',
  }, {
    Authorization: `Bearer ${global.testToken}`,
  });

  return {
    success: result.success,
    error: result.success ? null : result.data.error,
  };
}

// Main test runner
async function runAllTests() {
  console.log('🚀 Starting API Tests...\n');

  // Core functionality tests
  await runTest('Health Check', testHealthCheck);
  await runTest('User Registration', testUserRegistration);
  await runTest('User Login', testUserLogin);
  
  // Business logic tests
  await runTest('Appointment Booking', testAppointmentBooking);
  await runTest('Appointment Availability', testAppointmentAvailability);
  await runTest('Medical Records Upload', testMedicalRecordsUpload);
  await runTest('Notification Scheduling', testNotificationScheduling);
  await runTest('Report Generation', testReportGeneration);
  await runTest('Admin User Management', testAdminUserManagement);
  await runTest('Payment Processing', testPaymentProcessing);
  await runTest('Insurance Claims', testInsuranceClaims);
  await runTest('Patient Journey', testPatientJourney);
  await runTest('Chatbot Actions', testChatbotActions);

  // Print results
  console.log('\n📊 Test Results Summary:');
  console.log(`✅ Passed: ${testResults.passed}`);
  console.log(`❌ Failed: ${testResults.failed}`);
  console.log(`📈 Success Rate: ${((testResults.passed / (testResults.passed + testResults.failed)) * 100).toFixed(1)}%`);

  if (testResults.errors.length > 0) {
    console.log('\n❌ Failed Tests:');
    testResults.errors.forEach(error => {
      console.log(`  - ${error.test}: ${error.error}`);
    });
  }

  console.log('\n🎉 API testing completed!');
}

// Run tests
runAllTests().catch(console.error);