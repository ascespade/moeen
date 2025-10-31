# 🤖 Moeen Background Agent Setup Guide

This guide explains how to use the automated background agent system for continuous monitoring, testing, and auto-fixing.

## 📋 Overview

The Moeen Background Agent system provides:
- ✅ Continuous code quality monitoring
- ✅ Automated security scanning
- ✅ Test coverage tracking
- ✅ Auto-fixing of common issues
- ✅ CI/CD integration with GitHub Actions

## 🚀 Quick Start

### 1. Configuration

The agent is configured via `.meneen-agent.json`. Key settings:

```json
{
  "enabled": true,
  "interval": 300000,  // 5 minutes
  "autoFix": {
    "enabled": true,
    "level": "safe"
  }
}
```

### 2. Run Agent Locally

```bash
# Run all agent tasks once
npm run test:agent

# Run in watch mode (continuous)
npm run test:agent:watch
```

### 3. CI/CD Integration

The GitHub Actions workflow (`.github/workflows/ci-security-tests.yml`) automatically runs:
- Linting and auto-fixes
- Security scans
- Type checking
- Full test suite
- API security tests

**Trigger**: Runs on push, PR, daily at 2 AM UTC, or manual dispatch

## 📁 Files Created

### Core Files
- `.meneen-agent.json` - Agent configuration
- `.github/workflows/ci-security-tests.yml` - CI/CD pipeline
- `scripts/replace-console.js` - Console.log replacement script
- `scripts/run-agent-tasks.mjs` - Agent task runner

### Test Files
- `tests/api/permissions.spec.ts` - Role-based access control tests
- `tests/api/workflows.spec.ts` - Business logic and workflow tests

### Database
- `migrations/2025-10-31-add-constraints.sql` - Database constraints

### Reports
- `.cursor-agent-reports/` - Agent execution reports (JSON format)

## 🔧 Available Tasks

The agent runs these tasks automatically:

### 1. Code Analysis (Every 5 minutes)
- Scan TypeScript errors
- Scan ESLint errors
- Detect duplicate code
- Analyze performance issues

### 2. Error Detection (Every 10 minutes)
- Check API security
- Detect unprotected routes
- Find type errors
- Scan security vulnerabilities

### 3. Test Coverage (Hourly)
- Run test coverage
- Identify untested files
- Suggest test cases
- Generate test templates

### 4. Performance Optimization (Every 6 hours)
- Analyze bundle size
- Detect memory leaks
- Optimize database queries
- Suggest performance improvements

### 5. Security Scan (Every 12 hours)
- Scan API endpoints
- Check authentication middleware
- Validate input sanitization
- Detect sensitive data exposure

### 6. Code Quality (Every 15 minutes)
- Remove console.logs
- Fix linting errors
- Remove TODO comments
- Cleanup temporary files

## 📊 Reports

Reports are saved to `.cursor-agent-reports/report-YYYY-MM-DD.json`:

```json
{
  "timestamp": "2025-10-31T12:00:00Z",
  "tasks": [...],
  "summary": {
    "total": 6,
    "completed": 6,
    "failed": 0
  }
}
```

## 🛠️ Manual Scripts

### Replace Console.log Statements

```bash
node scripts/replace-console.js
```

This script:
- Scans `src/**/*.{ts,tsx,js,jsx}`
- Replaces `console.log/info/warn/error/debug` with `logger.*`
- Automatically adds logger imports where needed

### Run Database Migration

```bash
# Apply constraints migration to your Supabase database
psql -h [host] -U [user] -d [database] -f migrations/2025-10-31-add-constraints.sql
```

Or use Supabase CLI:
```bash
supabase db push
```

## ✅ Test Suites

### Run All Tests
```bash
npm test
```

### Run Specific Test Suites
```bash
# Security tests
npx playwright test tests/api/production-security-routes.spec.ts

# Permissions tests
npx playwright test tests/api/permissions.spec.ts

# Workflow tests
npx playwright test tests/api/workflows.spec.ts
```

## 🔒 Security Features

The agent automatically checks for:
- ✅ Unprotected API routes (missing `requireAuth()`)
- ✅ Direct `process.env` usage (should use `env` config)
- ✅ Console.log statements (should use `logger`)
- ✅ Missing error handling
- ✅ Type safety issues

## 📝 Configuration Options

### Enable/Disable Tasks

Edit `.meneen-agent.json`:

```json
{
  "tasks": [
    {
      "name": "code-analysis",
      "enabled": false,  // Disable this task
      ...
    }
  ]
}
```

### Adjust Auto-Fix Level

```json
{
  "autoFix": {
    "level": "safe",  // Options: "safe", "moderate", "aggressive"
    "autoCommit": false,  // Set to true for automatic commits
    "requireReview": true
  }
}
```

### Change Report Location

```json
{
  "reports": {
    "location": ".cursor-agent-reports",
    "format": "json",
    "dailySummary": true
  }
}
```

## 🚨 Troubleshooting

### Agent Not Running
- Check `.meneen-agent.json` has `"enabled": true`
- Verify Node.js version >= 20
- Check file permissions on scripts

### Tests Failing
- Ensure dev server is running: `npm run dev`
- Check environment variables in `.env.local`
- Verify Playwright browsers installed: `npx playwright install`

### CI/CD Not Triggering
- Check workflow file is in `.github/workflows/`
- Verify branch names match workflow triggers
- Check GitHub Actions permissions

## 📚 Additional Resources

- See `PROJECT_LOG.md` for automated changes history
- Check `.cursor-agent-reports/` for detailed execution logs
- Review GitHub Actions logs for CI/CD issues

## 🔄 Continuous Improvement

The agent system is designed to:
1. **Detect** issues automatically
2. **Report** findings clearly
3. **Fix** safely where possible
4. **Track** improvements over time

All agent activities are logged in `PROJECT_LOG.md` for transparency.

---

**Last Updated**: 2025-10-31
**Version**: 1.0.0
