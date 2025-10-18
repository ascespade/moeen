require('dotenv').config({ path: '.env.local' });
const spawn = require('child_process');

// Set environment variables
process.env.NEXT_PUBLIC_SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
process.env.SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

// console.log('✅ Environment loaded');
// console.log('📦 Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL ? 'Set' : 'Missing');
// console.log('🔑 Service Key:', process.env.SUPABASE_SERVICE_ROLE_KEY ? 'Set' : 'Missing');

// Run Playwright tests
let testProcess = spawn('npx', [
  'playwright', 'test',
  'tests/e2e/appointments.spec.ts',
  '--reporter=list',
  '--workers=1'
], {
  stdio: 'inherit',
  env: process.env
});

testProcess.on('close', (code) => {
  // console.log(`\n🏁 Tests finished with code ${code}`
  process.exit(code);
});
