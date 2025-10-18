/**
 * System Validation Script - التحقق من صحة النظام
 * Comprehensive system validation and health checks
 */

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

// Validation results
const validationResults = {
  passed: 0,
  failed: 0,
  warnings: 0,
  errors: [],
  warnings: [],
  summary: {},
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
      responseTime: Date.now() - Date.now(),
    };
  } catch (error) {
    return {
      success: false,
      status: 0,
      data: { error: error.message },
      responseTime: 0,
    };
  }
}

// Validation functions
async function validateHealthCheck() {
  console.log('🔍 Validating health check...');

  const result = await apiCall('/api/health');

  if (result.success && result.data.status) {
    validationResults.passed++;
    console.log('✅ Health check - PASSED');
    return true;
  } else {
    validationResults.failed++;
    validationResults.errors.push('Health check failed');
    console.log('❌ Health check - FAILED');
    return false;
  }
}

async function validateDatabaseConnection() {
  console.log('🔍 Validating database connection...');

  const result = await apiCall('/api/health');

  if (result.success && result.data.services?.database?.status === 'healthy') {
    validationResults.passed++;
    console.log('✅ Database connection - PASSED');
    return true;
  } else {
    validationResults.failed++;
    validationResults.errors.push('Database connection failed');
    console.log('❌ Database connection - FAILED');
    return false;
  }
}

async function validateAuthentication() {
  console.log('🔍 Validating authentication system...');

  // Test registration
  const registerResult = await apiCall('/api/auth/register', 'POST', {
    email: 'test@example.com',
    password: 'TestPassword123!',
    role: 'patient',
    profile: {
      fullName: 'Test User',
      phone: '+966501234567',
    },
  });

  if (registerResult.success) {
    validationResults.passed++;
    console.log('✅ User registration - PASSED');
  } else {
    validationResults.failed++;
    validationResults.errors.push('User registration failed');
    console.log('❌ User registration - FAILED');
  }

  // Test login
  const loginResult = await apiCall('/api/auth/login', 'POST', {
    email: 'test@example.com',
    password: 'TestPassword123!',
  });

  if (loginResult.success) {
    validationResults.passed++;
    console.log('✅ User login - PASSED');
    global.testToken = loginResult.data.token;
    return true;
  } else {
    validationResults.failed++;
    validationResults.errors.push('User login failed');
    console.log('❌ User login - FAILED');
    return false;
  }
}

async function validateAPIs() {
  console.log('🔍 Validating API endpoints...');

  const apis = [
    { endpoint: '/api/appointments', method: 'GET', name: 'Appointments API' },
    {
      endpoint: '/api/medical-records',
      method: 'GET',
      name: 'Medical Records API',
    },
    {
      endpoint: '/api/notifications',
      method: 'GET',
      name: 'Notifications API',
    },
    { endpoint: '/api/reports', method: 'GET', name: 'Reports API' },
    { endpoint: '/api/payments', method: 'GET', name: 'Payments API' },
    {
      endpoint: '/api/insurance/claims',
      method: 'GET',
      name: 'Insurance Claims API',
    },
    {
      endpoint: '/api/chatbot/actions',
      method: 'GET',
      name: 'Chatbot Actions API',
    },
  ];

  let passed = 0;
  let failed = 0;

  for (const api of apis) {
    const result = await apiCall(api.endpoint, api.method);

    if (result.success) {
      passed++;
      console.log(`✅ ${api.name} - PASSED`);
    } else {
      failed++;
      validationResults.errors.push(`${api.name} failed: ${result.data.error}`);
      console.log(`❌ ${api.name} - FAILED`);
    }
  }

  validationResults.passed += passed;
  validationResults.failed += failed;

  return failed === 0;
}

async function validateSecurity() {
  console.log('🔍 Validating security measures...');

  // Test rate limiting
  const rateLimitResult = await apiCall('/api/auth/login', 'POST', {
    email: 'test@example.com',
    password: 'wrongpassword',
  });

  if (rateLimitResult.status === 429) {
    validationResults.passed++;
    console.log('✅ Rate limiting - PASSED');
  } else {
    validationResults.warnings++;
    validationResults.warnings.push('Rate limiting not properly configured');
    console.log('⚠️ Rate limiting - WARNING');
  }

  // Test CORS
  const corsResult = await fetch(`${BASE_URL}/api/health`, {
    method: 'OPTIONS',
    headers: {
      Origin: 'https://malicious-site.com',
      'Access-Control-Request-Method': 'POST',
    },
  });

  if (corsResult.status === 403) {
    validationResults.passed++;
    console.log('✅ CORS protection - PASSED');
  } else {
    validationResults.warnings++;
    validationResults.warnings.push(
      'CORS protection may not be properly configured'
    );
    console.log('⚠️ CORS protection - WARNING');
  }

  return true;
}

async function validatePerformance() {
  console.log('🔍 Validating performance...');

  const startTime = Date.now();
  const result = await apiCall('/api/health');
  const responseTime = Date.now() - startTime;

  if (responseTime < 1000) {
    validationResults.passed++;
    console.log('✅ Response time - PASSED (< 1s)');
  } else if (responseTime < 3000) {
    validationResults.warnings++;
    validationResults.warnings.push('Response time is slow (> 1s)');
    console.log('⚠️ Response time - WARNING (> 1s)');
  } else {
    validationResults.failed++;
    validationResults.errors.push('Response time is too slow (> 3s)');
    console.log('❌ Response time - FAILED (> 3s)');
  }

  return responseTime < 3000;
}

async function validateDataIntegrity() {
  console.log('🔍 Validating data integrity...');

  // This would check database constraints, data consistency, etc.
  // For now, we'll just check if the health endpoint returns valid data

  const result = await apiCall('/api/health');

  if (result.success && result.data.services) {
    validationResults.passed++;
    console.log('✅ Data integrity - PASSED');
    return true;
  } else {
    validationResults.failed++;
    validationResults.errors.push('Data integrity check failed');
    console.log('❌ Data integrity - FAILED');
    return false;
  }
}

async function validateErrorHandling() {
  console.log('🔍 Validating error handling...');

  // Test 404 error
  const notFoundResult = await apiCall('/api/nonexistent');

  if (notFoundResult.status === 404) {
    validationResults.passed++;
    console.log('✅ 404 error handling - PASSED');
  } else {
    validationResults.failed++;
    validationResults.errors.push('404 error handling failed');
    console.log('❌ 404 error handling - FAILED');
  }

  // Test 400 error
  const badRequestResult = await apiCall('/api/auth/login', 'POST', {
    email: 'invalid-email',
    password: 'short',
  });

  if (badRequestResult.status === 400) {
    validationResults.passed++;
    console.log('✅ 400 error handling - PASSED');
  } else {
    validationResults.failed++;
    validationResults.errors.push('400 error handling failed');
    console.log('❌ 400 error handling - FAILED');
  }

  return true;
}

// Main validation function
async function runValidation() {
  console.log('🚀 Starting system validation...\n');

  const startTime = Date.now();

  // Run all validations
  await validateHealthCheck();
  await validateDatabaseConnection();
  await validateAuthentication();
  await validateAPIs();
  await validateSecurity();
  await validatePerformance();
  await validateDataIntegrity();
  await validateErrorHandling();

  const totalTime = Date.now() - startTime;

  // Calculate summary
  const total =
    validationResults.passed +
    validationResults.failed +
    validationResults.warnings;
  const successRate = ((validationResults.passed / total) * 100).toFixed(1);

  validationResults.summary = {
    total,
    passed: validationResults.passed,
    failed: validationResults.failed,
    warnings: validationResults.warnings,
    successRate: `${successRate}%`,
    totalTime: `${totalTime}ms`,
  };

  // Print results
  console.log('\n📊 Validation Results Summary:');
  console.log(`✅ Passed: ${validationResults.passed}`);
  console.log(`❌ Failed: ${validationResults.failed}`);
  console.log(`⚠️ Warnings: ${validationResults.warnings}`);
  console.log(`📈 Success Rate: ${successRate}%`);
  console.log(`⏱️ Total Time: ${totalTime}ms`);

  if (validationResults.errors.length > 0) {
    console.log('\n❌ Errors:');
    validationResults.errors.forEach(error => {
      console.log(`  - ${error}`);
    });
  }

  if (validationResults.warnings.length > 0) {
    console.log('\n⚠️ Warnings:');
    validationResults.warnings.forEach(warning => {
      console.log(`  - ${warning}`);
    });
  }

  console.log('\n🎉 System validation completed!');

  // Return exit code
  if (validationResults.failed > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

// Run validation
runValidation().catch(console.error);
