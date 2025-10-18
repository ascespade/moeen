module.exports = {
  // Supawright configuration for database testing
  testDir: './tests/database',
  outputDir: './supawright-report',
  timeout: 30000,
  retries: 2,
  workers: 2,
  use: {
    // Database connection settings
    database: {
      url: process.env.DATABASE_URL || 'postgresql://localhost:5432/moeen_test',
      schema: 'public'
    }
  },
  projects: [
    {
      name: 'database-tests',
      testMatch: '**/*.database.test.js'
    }
  ]
};