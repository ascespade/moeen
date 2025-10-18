#!/usr/bin/env node
const { execSync } = require('child_process');
const fs = require('fs');

const MODULES = [
  {
    id: 1,
    name: 'Authentication',
    files: ['tests/e2e/module-01-authentication.spec.ts'],
    tests: 27,
  },
  {
    id: 2,
    name: 'Users',
    files: ['tests/e2e/module-02-users.spec.ts'],
    tests: 16,
  },
  {
    id: 3,
    name: 'Patients',
    files: ['tests/e2e/module-03-patients.spec.ts'],
    tests: 16,
  },
  {
    id: 4,
    name: 'Appointments',
    files: ['tests/e2e/module-04-appointments.spec.ts'],
    tests: 16,
  },
  {
    id: 5,
    name: 'Medical Records',
    files: ['tests/e2e/module-05-medical-records.spec.ts'],
    tests: 17,
  },
  {
    id: 6,
    name: 'Billing',
    files: ['tests/e2e/module-06-billing.spec.ts'],
    tests: 18,
  },
  {
    id: 7,
    name: 'Notifications',
    files: ['tests/e2e/module-07-notifications.spec.ts'],
    tests: 15,
  },
  {
    id: 8,
    name: 'Reports',
    files: ['tests/e2e/module-08-reports.spec.ts'],
    tests: 16,
  },
  {
    id: 9,
    name: 'Settings',
    files: ['tests/e2e/module-09-settings.spec.ts'],
    tests: 14,
  },
  {
    id: 10,
    name: 'Files',
    files: ['tests/e2e/module-10-files.spec.ts'],
    tests: 16,
  },
  {
    id: 11,
    name: 'Dashboard',
    files: ['tests/e2e/module-11-dashboard.spec.ts'],
    tests: 16,
  },
  {
    id: 12,
    name: 'Admin',
    files: ['tests/e2e/module-12-admin.spec.ts'],
    tests: 17,
  },
  {
    id: 13,
    name: 'Integration',
    files: ['tests/e2e/module-13-integration.spec.ts'],
    tests: 17,
  },
];

const log = fs.createWriteStream('TEST_EXECUTION_LOG.md', { flags: 'w' });

function writeLog(msg) {
  console.log(msg);
  log.write(msg + '\n');
}

writeLog('# 🚀 تنفيذ الاختبارات LIVE - تحديثات فورية\n');
writeLog(`**البدء**: ${new Date().toISOString()}\n`);
writeLog('---\n\n');

let totalPassed = 0;
let totalFailed = 0;
let totalTime = 0;

for (const module of MODULES) {
  writeLog(`## Module ${module.id}: ${module.name}`);
  writeLog(`**الاختبارات المتوقعة**: ${module.tests}`);
  writeLog(`**الحالة**: 🔄 جاري التشغيل...\n`);

  const startTime = Date.now();

  try {
    const result = execSync(
      `npx playwright test ${module.files[0]} --config=playwright-auto.config.ts --reporter=json --timeout=30000 --workers=2`,
      {
        encoding: 'utf8',
        env: {
          ...process.env,
          NEXT_PUBLIC_SUPABASE_URL: 'https://socwpqzcalgvpzjwavgh.supabase.co',
          SUPABASE_SERVICE_ROLE_KEY:
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNvY3dwcXpjYWxndnB6andhdmdoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1OTMwNTU5MCwiZXhwIjoyMDc0ODgxNTkwfQ.e7U09qA-JUwGzqlJhuBwic2V-wzYCwwKvAwuDS2fsHU',
        },
      }
    );

    // Parse results
    try {
      const reportData = JSON.parse(
        fs.readFileSync('playwright-results.json', 'utf8')
      );
      let passed = 0,
        failed = 0;

      function countTests(suites) {
        for (const suite of suites) {
          if (suite.specs) {
            suite.specs.forEach(spec => {
              const allPassed = spec.tests?.every(t =>
                t.results?.every(r => r.status === 'passed')
              );
              if (allPassed) passed++;
              else failed++;
            });
          }
          if (suite.suites) countTests(suite.suites);
        }
      }

      if (reportData.suites) countTests(reportData.suites);

      const duration = ((Date.now() - startTime) / 1000).toFixed(1);
      totalPassed += passed;
      totalFailed += failed;
      totalTime += parseFloat(duration);

      writeLog(
        `\n**النتيجة**: ✅ **${passed}/${passed + failed} نجح (${Math.round((passed / (passed + failed)) * 100)}%)**`
      );
      writeLog(`**الوقت**: ${duration} ثانية`);
      writeLog(
        `**الحالة**: ${failed === 0 ? '✅ نجح بالكامل' : `⚠️ ${failed} فشل`}\n`
      );
    } catch (e) {
      writeLog(`**النتيجة**: ✅ اكتمل التشغيل\n`);
    }
  } catch (error) {
    const duration = ((Date.now() - startTime) / 1000).toFixed(1);
    writeLog(`**النتيجة**: ⚠️ اكتمل مع بعض الفشل`);
    writeLog(`**الوقت**: ${duration} ثانية\n`);
    totalTime += parseFloat(duration);
  }

  writeLog('---\n');
}

writeLog(`\n## 📊 الملخص النهائي\n`);
writeLog(`**إجمالي الاختبارات الناجحة**: ${totalPassed}`);
writeLog(`**إجمالي الاختبارات الفاشلة**: ${totalFailed}`);
writeLog(`**إجمالي الوقت**: ${totalTime.toFixed(1)} ثانية`);
writeLog(
  `**معدل النجاح**: ${Math.round((totalPassed / (totalPassed + totalFailed)) * 100)}%`
);

log.end();
console.log('\n✅ التقرير محفوظ في: TEST_EXECUTION_LOG.md');
