const fs = require('fs');
const path = require('path');

const testFiles = [
  'tests/e2e/auth.spec.ts',
  'tests/e2e/admin.spec.ts',
  'tests/e2e/appointments.spec.ts',
  'tests/e2e/automation.spec.ts',
  'tests/e2e/chatbot.spec.ts',
  'tests/e2e/dashboard.spec.ts',
  'tests/e2e/login-full-test.spec.ts',
  'tests/e2e/medical-records.spec.ts',
  'tests/e2e/payments.spec.ts',
  'tests/e2e/remaining-modules.spec.ts',
  'tests/e2e/supabase-integration.spec.ts',
  'tests/e2e/system-health.spec.ts',
  'tests/e2e/module-01-authentication.spec.ts',
  'tests/e2e/module-02-users.spec.ts',
  'tests/e2e/module-03-patients.spec.ts',
  'tests/e2e/module-04-appointments.spec.ts',
  'tests/e2e/module-05-medical-records.spec.ts',
  'tests/e2e/module-06-billing.spec.ts',
  'tests/e2e/module-07-notifications.spec.ts',
  'tests/e2e/module-08-reports.spec.ts',
  'tests/e2e/module-09-settings.spec.ts',
  'tests/e2e/module-10-files.spec.ts',
  'tests/e2e/module-11-dashboard.spec.ts',
  'tests/e2e/module-12-admin.spec.ts',
  'tests/e2e/module-13-integration.spec.ts',
  'tests/e2e/comprehensive/api-endpoints.spec.ts',
  'tests/e2e/comprehensive/database-crud.spec.ts',
  'tests/e2e/comprehensive/pages-complete.spec.ts',
  'tests/e2e/deep-01-database.spec.ts',
  'tests/e2e/deep-02-database-fixed.spec.ts',
  'tests/e2e/deep-03-all-fixed.spec.ts',
  'tests/e2e/deep-04-final-working.spec.ts',
  'tests/e2e/deep-05-fully-working.spec.ts',
  'tests/e2e/massive-1000-tests.spec.ts',
];

let totalTests = 0;
const report = {};

testFiles.forEach(file => {
  if (fs.existsSync(file)) {
    const content = fs.readFileSync(file, 'utf8');
    const testMatches = content.match(/test\(/g) || [];
    const testCount = testMatches.length;
    totalTests += testCount;

    const fileName = path.basename(file);
    report[fileName] = testCount;
    console.log(`✅ ${fileName.padEnd(50)} ${testCount} اختبارات`);
  }
});

console.log('\n' + '='.repeat(70));
console.log(`إجمالي الاختبارات الفعلية: ${totalTests}`);
console.log('='.repeat(70));
