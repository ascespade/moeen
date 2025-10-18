// supawright.config.js
export default {
  // Supabase configuration
  supabase: {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL,
    serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  },
  
  // Test configuration
  test: {
    // Test directory
    testDir: './tests/generated/supawright',
    
    // Test timeout
    timeout: 30000,
    
    // Retry configuration
    retries: process.env.CI ? 2 : 1,
    
    // Workers
    workers: process.env.CI ? 1 : 4,
    
    // Reporter configuration
    reporter: [
      ['list'],
      ['json', { outputFile: 'test-results/supawright-results.json' }],
      ['junit', { outputFile: 'test-results/supawright-results.xml' }],
    ],
  },
  
  // Database configuration
  database: {
    // Use temporary schema for testing
    schema: 'ai_test_schema',
    
    // Cleanup after tests
    cleanup: true,
    
    // Backup before tests
    backup: true,
  },
  
  // API configuration
  api: {
    // Base URL for API tests
    baseURL: process.env.BASE_URL || 'http://localhost:3000',
    
    // Timeout for API calls
    timeout: 10000,
    
    // Retry configuration
    retries: 3,
  },
  
  // Security configuration
  security: {
    // Test authentication
    testAuth: true,
    
    // Test authorization
    testAuthz: true,
    
    // Test data isolation
    dataIsolation: true,
  },
  
  // Performance configuration
  performance: {
    // Test response times
    testResponseTimes: true,
    
    // Test concurrent operations
    testConcurrency: true,
    
    // Test database performance
    testDbPerformance: true,
  },
};