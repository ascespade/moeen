# Critical Modules Tests - README

## Overview

Comprehensive Playwright tests for 4 critical modules:
- **EMR (Medical Records)** - Records, lab results, imaging reports
- **Finance** - Payments, insurance claims, billing
- **Admin** - User management, audit logs, reports
- **Settings** - Theme switcher, language, RTL/LTR, system cleaning

## Test Files Created

### 1. `tests/e2e/critical-modules.spec.ts`
**E2E Tests** - Basic navigation and visibility tests
- EMR page navigation and record display
- Payments page display
- Insurance claims navigation
- User management page
- Audit logs display
- Reports dashboard
- Theme switcher
- Language switcher
- RTL/LTR support
- Visual regression screenshots

### 2. `tests/e2e/critical-modules-functional.spec.ts`
**Functional Tests** - Interactive feature tests
- Create new medical record
- Filter and search records
- Process payments
- View payment details
- Create insurance claims
- Create new users
- Filter users by role
- Export audit logs
- Generate reports
- Change language
- Toggle RTL/LTR
- Clear cache/data

### 3. `tests/e2e/visual-regression.spec.ts`
**Visual Regression Tests** - UI consistency checks
- EMR module layout
- Payments module layout
- Admin users module layout
- Settings module layout
- Light mode theme
- Dark mode theme
- RTL layout

## How to Run Tests

### Prerequisites
1. Start the development server:
```bash
npm run dev
```

2. Ensure Supabase is running and connected

### Run All Critical Tests
```bash
npm run test tests/e2e/critical-modules*.spec.ts
```

### Run Specific Test Files
```bash
# E2E Tests
npm run test tests/e2e/critical-modules.spec.ts

# Functional Tests
npm run test tests/e2e/critical-modules-functional.spec.ts

# Visual Regression Tests
npm run test tests/e2e/visual-regression.spec.ts
```

### Run with UI (Interactive)
```bash
npm run test tests/e2e/critical-modules.spec.ts --headed
```

### Run with Debug
```bash
npx playwright test tests/e2e/critical-modules.spec.ts --debug
```

## Test Coverage

### EMR Module ✅
- [x] Page navigation
- [x] Record list display
- [x] Add new record button
- [x] Record details display
- [x] Search and filter
- [x] Create new record form

### Finance Module ✅
- [x] Payments page display
- [x] Payment status badges
- [x] Process payment
- [x] View payment details
- [x] Insurance claims navigation
- [x] Claims list display
- [x] Create insurance claim

### Admin Module ✅
- [x] Users page navigation
- [x] Users table display
- [x] User filters
- [x] Create new user
- [x] Filter by role
- [x] Audit logs navigation
- [x] Export audit logs
- [x] Reports navigation
- [x] Generate reports

### Settings Module ✅
- [x] Theme toggle button
- [x] Switch light/dark mode
- [x] Language switcher
- [x] RTL/LTR support
- [x] Clear cache/data

## Fixes Applied

### ✅ Fixed Errors
1. Typo in visual-regression.spec.ts line 75: `thereon` → `expect`
2. Typo in run-critical-tests.js line 15: fixed path `ห้อง` → `/`

### Configuration
- Base URL: `http://localhost:3001`
- Timeout: 60 seconds
- Action timeout: 30 seconds
- Retries: 1 (CI: 2)
- Screenshots: on failure
- Videos: on failure
- Trace: on first retry

## Test Reports

After running tests, view reports:
```bash
npx playwright show-report
```

Reports include:
- HTML report with screenshots and videos
- JSON results
- JUnit XML format

## Next Steps

1. Start dev server: `npm run dev`
2. Run tests: `npm run test tests/e2e/critical-modules*.spec.ts`
3. Review test results
4. Fix any failing tests
5. Update baseline screenshots if UI changed intentionally

## Notes

- Tests use soft assertions where appropriate to continue testing even if some conditions fail
- Screenshots are taken with tolerance for minor visual differences
- Tests are designed to be flexible and handle nano configured databases
- All tests include proper waiting strategies to handle async operations

## Contact

For questions or issues with these tests, refer to the main project documentation.

