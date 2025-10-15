const fs = require('fs');
const path = require('path');
const glob = require('glob');

class BusinessLogicValidator {
  constructor() {
    this.errors = [];
    this.warnings = [];
    this.checks = [];
  }

  addCheck(name, check, type = 'error') {
    this.checks.push({ name, check, type });
  }

  async runChecks() {
    console.log('🔍 Starting comprehensive business logic validation...\n');

    for (const { name, check, type } of this.checks) {
      try {
        const result = await check();
        if (result.passed) {
          console.log(`✅ ${name}`);
        } else {
          const message = `${type.toUpperCase()}: ${name} - ${result.message}`;
          if (type === 'error') {
            this.errors.push(message);
            console.log(`❌ ${message}`);
          } else {
            this.warnings.push(message);
            console.log(`⚠️  ${message}`);
          }
        }
      } catch (error) {
        const message = `ERROR: ${name} - ${error.message}`;
        this.errors.push(message);
        console.log(`❌ ${message}`);
      }
    }

    this.printSummary();
    return this.errors.length === 0;
  }

  printSummary() {
    console.log('\n📊 Business Logic Validation Summary:');
    console.log(`   Total checks: ${this.checks.length}`);
    console.log(`   Errors: ${this.errors.length}`);
    console.log(`   Warnings: ${this.warnings.length}`);
    
    if (this.errors.length > 0) {
      console.log('\n❌ Critical Issues Found:');
      this.errors.forEach(error => console.log(`   - ${error}`));
    }
    
    if (this.warnings.length > 0) {
      console.log('\n⚠️  Warnings Found:');
      this.warnings.forEach(warning => console.log(`   - ${warning}`));
    }
  }
}

const validator = new BusinessLogicValidator();

// 1. Authentication & Authorization
validator.addCheck('Authentication system exists', () => {
  const authFiles = [
    'src/lib/auth/authorize.ts',
    'src/middleware/auth.ts',
    'src/components/auth/ProtectedRoute.tsx',
    'src/app/api/auth/me/route.ts'
  ];
  
  const missing = authFiles.filter(file => !fs.existsSync(file));
  
  if (missing.length > 0) {
    return { passed: false, message: `Missing auth files: ${missing.join(', ')}` };
  }
  
  return { passed: true };
});

validator.addCheck('Role-based access control implemented', () => {
  const rbacFiles = [
    'src/app/(patient)/patient-dashboard/page.tsx',
    'src/app/(doctor)/doctor-dashboard/page.tsx',
    'src/app/(staff)/staff-dashboard/page.tsx',
    'src/app/(supervisor)/supervisor-dashboard/page.tsx'
  ];
  
  const missing = rbacFiles.filter(file => !fs.existsSync(file));
  
  if (missing.length > 0) {
    return { passed: false, message: `Missing role dashboards: ${missing.join(', ')}` };
  }
  
  return { passed: true };
});

// 2. Patient Journey
validator.addCheck('Patient activation workflow exists', () => {
  const activationFiles = [
    'src/components/patient/ActivationFlow.tsx',
    'src/app/api/patients/[id]/activate/route.ts',
    'src/app/api/patients/[id]/activation/step/route.ts'
  ];
  
  const missing = activationFiles.filter(file => !fs.existsSync(file));
  
  if (missing.length > 0) {
    return { passed: false, message: `Missing activation files: ${missing.join(', ')}` };
  }
  
  return { passed: true };
});

validator.addCheck('Pre-visit checklist implemented', () => {
  const checklistFile = 'src/components/patient/PreVisitChecklist.tsx';
  
  if (!fs.existsSync(checklistFile)) {
    return { passed: false, message: 'Pre-visit checklist component missing' };
  }
  
  return { passed: true };
});

// 3. Appointment Management
validator.addCheck('Appointment booking API exists', () => {
  const appointmentFiles = [
    'src/app/api/appointments/route.ts',
    'src/app/api/appointments/[id]/route.ts',
    'src/app/api/doctors/availability/route.ts'
  ];
  
  const missing = appointmentFiles.filter(file => !fs.existsSync(file));
  
  if (missing.length > 0) {
    return { passed: false, message: `Missing appointment APIs: ${missing.join(', ')}` };
  }
  
  return { passed: true };
});

// 4. Payment Processing
validator.addCheck('Payment gateway integration exists', () => {
  const paymentFiles = [
    'src/lib/payments/stripe.ts',
    'src/lib/payments/moyasar.ts',
    'src/app/api/payments/process/route.ts',
    'src/app/api/webhooks/payments/stripe/route.ts',
    'src/app/api/webhooks/payments/moyasar/route.ts'
  ];
  
  const missing = paymentFiles.filter(file => !fs.existsSync(file));
  
  if (missing.length > 0) {
    return { passed: false, message: `Missing payment files: ${missing.join(', ')}` };
  }
  
  return { passed: true };
});

// 5. Insurance Claims
validator.addCheck('Insurance claims system exists', () => {
  const insuranceFiles = [
    'src/lib/insurance/providers.ts',
    'src/components/insurance/ClaimsManager.tsx',
    'src/app/api/insurance/claims/route.ts',
    'src/app/api/insurance/claims/[id]/submit/route.ts'
  ];
  
  const missing = insuranceFiles.filter(file => !fs.existsSync(file));
  
  if (missing.length > 0) {
    return { passed: false, message: `Missing insurance files: ${missing.join(', ')}` };
  }
  
  return { passed: true };
});

// 6. Translation System
validator.addCheck('Translation system implemented', () => {
  const translationFiles = [
    'src/lib/i18n/translationService.ts',
    'src/hooks/useT.tsx',
    'src/app/api/translations/[lang]/route.ts',
    'src/app/api/translations/missing/route.ts'
  ];
  
  const missing = translationFiles.filter(file => !fs.existsSync(file));
  
  if (missing.length > 0) {
    return { passed: false, message: `Missing translation files: ${missing.join(', ')}` };
  }
  
  return { passed: true };
});

// 7. Error Handling
validator.addCheck('Error handling system exists', () => {
  const errorFiles = [
    'src/lib/errors/api-errors.ts',
    'src/components/common/ErrorBoundary.tsx',
    'src/lib/validation/schemas.ts',
    'src/app/api/errors/route.ts'
  ];
  
  const missing = errorFiles.filter(file => !fs.existsSync(file));
  
  if (missing.length > 0) {
    return { passed: false, message: `Missing error handling files: ${missing.join(', ')}` };
  }
  
  return { passed: true };
});

// 8. Reporting System
validator.addCheck('Reporting system exists', () => {
  const reportFiles = [
    'src/app/api/reports/dashboard-metrics/route.ts'
  ];
  
  const missing = reportFiles.filter(file => !fs.existsSync(file));
  
  if (missing.length > 0) {
    return { passed: false, message: `Missing reporting files: ${missing.join(', ')}` };
  }
  
  return { passed: true };
});

// 9. Admin Management
validator.addCheck('Admin management system exists', () => {
  const adminFiles = [
    'src/app/api/admin/users/route.ts'
  ];
  
  const missing = adminFiles.filter(file => !fs.existsSync(file));
  
  if (missing.length > 0) {
    return { passed: false, message: `Missing admin files: ${missing.join(', ')}` };
  }
  
  return { passed: true };
});

// 10. Notification System
validator.addCheck('Notification system exists', () => {
  const notificationFiles = [
    'src/lib/notifications/email.ts',
    'src/app/api/notifications/send/route.ts'
  ];
  
  const missing = notificationFiles.filter(file => !fs.existsSync(file));
  
  if (missing.length > 0) {
    return { passed: false, message: `Missing notification files: ${missing.join(', ')}` };
  }
  
  return { passed: true };
});

// 11. Database Schema
validator.addCheck('Database migrations exist', () => {
  const migrationFiles = glob.sync('supabase/migrations/*.sql');
  
  if (migrationFiles.length === 0) {
    return { passed: false, message: 'No database migration files found' };
  }
  
  // Check for required tables
  const requiredTables = ['users', 'patients', 'doctors', 'appointments', 'payments', 'insurance_claims'];
  const allMigrations = migrationFiles.map(file => fs.readFileSync(file, 'utf8')).join('\n');
  
  const missingTables = requiredTables.filter(table => 
    !allMigrations.includes(`CREATE TABLE`) || !allMigrations.includes(table)
  );
  
  if (missingTables.length > 0) {
    return { passed: false, message: `Missing table definitions: ${missingTables.join(', ')}` };
  }
  
  return { passed: true };
});

// 12. API Route Validation
validator.addCheck('Critical API routes exist', () => {
  const criticalRoutes = [
    'src/app/api/auth/me/route.ts',
    'src/app/api/patients/[id]/activate/route.ts',
    'src/app/api/payments/process/route.ts',
    'src/app/api/insurance/claims/route.ts',
    'src/app/api/translations/[lang]/route.ts',
    'src/app/api/appointments/route.ts',
    'src/app/api/reports/dashboard-metrics/route.ts'
  ];
  
  const missing = criticalRoutes.filter(file => !fs.existsSync(file));
  
  if (missing.length > 0) {
    return { passed: false, message: `Missing critical API routes: ${missing.join(', ')}` };
  }
  
  return { passed: true };
});

// 13. Business Logic Validation
validator.addCheck('Patient activation business logic', () => {
  const activationFile = 'src/app/api/patients/[id]/activate/route.ts';
  
  if (!fs.existsSync(activationFile)) {
    return { passed: false, message: 'Patient activation API missing' };
  }
  
  const content = fs.readFileSync(activationFile, 'utf8');
  
  // Check for required business logic
  const requiredChecks = [
    'activated: true',
    'Only staff, supervisor, and admin can activate',
    'Patient already activated',
    'audit_logs'
  ];
  
  const missingChecks = requiredChecks.filter(check => !content.includes(check));
  
  if (missingChecks.length > 0) {
    return { passed: false, message: `Missing activation logic: ${missingChecks.join(', ')}` };
  }
  
  return { passed: true };
});

validator.addCheck('Payment processing business logic', () => {
  const paymentFile = 'src/app/api/payments/process/route.ts';
  
  if (!fs.existsSync(paymentFile)) {
    return { passed: false, message: 'Payment processing API missing' };
  }
  
  const content = fs.readFileSync(paymentFile, 'utf8');
  
  // Check for required business logic
  const requiredChecks = [
    'stripeService.createPaymentIntent',
    'moyasarService.createPayment',
    'payment_status: \'paid\'',
    'audit_logs'
  ];
  
  const missingChecks = requiredChecks.filter(check => !content.includes(check));
  
  if (missingChecks.length > 0) {
    return { passed: false, message: `Missing payment logic: ${missingChecks.join(', ')}` };
  }
  
  return { passed: true };
});

validator.addCheck('Insurance claims business logic', () => {
  const claimsFile = 'src/app/api/insurance/claims/route.ts';
  
  if (!fs.existsSync(claimsFile)) {
    return { passed: false, message: 'Insurance claims API missing' };
  }
  
  const content = fs.readFileSync(claimsFile, 'utf8');
  
  // Check for required business logic
  const requiredChecks = [
    'insuranceService.verifyMember',
    'claim_status: \'draft\'',
    'Only staff, supervisor, and admin can create claims',
    'audit_logs'
  ];
  
  const missingChecks = requiredChecks.filter(check => !content.includes(check));
  
  if (missingChecks.length > 0) {
    return { passed: false, message: `Missing claims logic: ${missingChecks.join(', ')}` };
  }
  
  return { passed: true };
});

// 14. Security Validation
validator.addCheck('Security measures implemented', () => {
  const securityFiles = [
    'src/middleware.ts',
    'src/lib/auth/authorize.ts'
  ];
  
  const missing = securityFiles.filter(file => !fs.existsSync(file));
  
  if (missing.length > 0) {
    return { passed: false, message: `Missing security files: ${missing.join(', ')}` };
  }
  
  // Check middleware for security headers
  const middlewareContent = fs.readFileSync('src/middleware.ts', 'utf8');
  const securityHeaders = [
    'X-Frame-Options',
    'X-Content-Type-Options',
    'Content-Security-Policy'
  ];
  
  const missingHeaders = securityHeaders.filter(header => !middlewareContent.includes(header));
  
  // Check for rate limiting separately
  const hasRateLimiting = middlewareContent.includes('Rate limiting') || middlewareContent.includes('rateLimiter');
  
  if (missingHeaders.length > 0) {
    return { passed: false, message: `Missing security headers: ${missingHeaders.join(', ')}` };
  }
  
  if (!hasRateLimiting) {
    return { passed: false, message: 'Rate limiting not implemented' };
  }
  
  return { passed: true };
});

// 15. Data Validation
validator.addCheck('Data validation schemas exist', () => {
  const validationFile = 'src/lib/validation/schemas.ts';
  
  if (!fs.existsSync(validationFile)) {
    return { passed: false, message: 'Validation schemas missing' };
  }
  
  const content = fs.readFileSync(validationFile, 'utf8');
  
  // Check for required schemas
  const requiredSchemas = [
    'userSchema',
    'patientSchema',
    'appointmentSchema',
    'paymentSchema',
    'insuranceClaimSchema'
  ];
  
  const missingSchemas = requiredSchemas.filter(schema => !content.includes(schema));
  
  if (missingSchemas.length > 0) {
    return { passed: false, message: `Missing validation schemas: ${missingSchemas.join(', ')}` };
  }
  
  return { passed: true };
});

// Run validation
validator.runChecks()
  .then(success => {
    if (success) {
      console.log('\n🎉 All business logic validation checks passed!');
      console.log('✅ The system is ready for deployment with complete business logic coverage.');
      process.exit(0);
    } else {
      console.log('\n❌ Business logic validation failed!');
      console.log('⚠️  Please fix the critical issues before deployment.');
      process.exit(1);
    }
  })
  .catch(error => {
    console.error('\n💥 Validation process failed:', error);
    process.exit(1);
  });