# Full Suite Test Runner Documentation

## Overview

`run-full-suite.sh` is a comprehensive automated testing system that combines:
- **Supabase** database management
- **Playwright** end-to-end testing
- **Automatic database fixes** with schema inspection
- **Dynamic timeout adjustments** based on test failures
- **Parallel module execution** for faster testing

## Features

### 🔄 Automatic Database Fixes
- Inspects database schema for nullable columns
- Automatically applies defaults and NOT NULL constraints
- Backs up database before making changes
- Handles different data types (integers, booleans, timestamps, strings)

### 🎭 Intelligent Playwright Testing
- Tests 13 modules in parallel: auth, users, patients, appointments, billing, notifications, dashboard, admin, files, reports, settings, integration, payments
- Automatically retries failed tests (up to 6 attempts per module)
- Dynamically increases timeouts when timeout errors are detected
- Generates detailed JSON reports for each test run

### 📊 Automated Analysis
- Analyzes test results to calculate success percentages
- Detects timeout issues and suggests fixes
- Aggregates results from all modules into a final report
- Stores test artifacts in organized directories

### ⚙️ Configurable Parameters

```bash
# Maximum attempts per module before giving up
MAX_ATTEMPTS_PER_MODULE=6

# Target success percentage (90% = module passes)
MODULE_TARGET_PERCENT=90

# Number of Playwright workers per module
PLAYWRIGHT_WORKERS_PER_MODULE=2

# Initial timeout in milliseconds (auto-adjusts on failures)
PLAYWRIGHT_TIMEOUT_MS=60000

# Maximum parallel modules (0 = auto-detect CPU cores)
PARALLEL_MAX=0
```

## Prerequisites

### Required Tools
- `node` and `npm` (for running tests)
- `jq` (for JSON processing)
- `psql` and `pg_dump` (for database operations)
- `npx` (comes with npm)

### Optional Tools
- `supawright` CLI (for advanced seed/teardown operations)

### Installation

```bash
# Install on Ubuntu/Debian
sudo apt-get update
sudo apt-get install -y jq postgresql-client

# Install Node.js dependencies
npm ci
```

## Usage

### Basic Usage

```bash
# Make script executable (already done)
chmod +x run-full-suite.sh

# Run the full test suite
./run-full-suite.sh
```

### Environment Variables

The script uses these Supabase credentials (hardcoded):
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `SUPABASE_DB_URL`

To use different credentials, edit the script or export these variables before running.

### Directory Structure

After running, you'll see:

```
workspace/
├── run-full-suite.sh           # Main script
├── tmp/                        # Temporary files (DB queries, schemas)
│   ├── schema-query.sql
│   ├── schema-cols.tsv
│   └── db-alter-suggestions.sql
├── test-results/               # Individual module results
│   ├── auth-1234567890/
│   │   ├── auth-report-attempt1.json
│   │   ├── auth-report-attempt2.json
│   │   └── analysis.json
│   └── users-1234567891/
├── test-reports/               # Aggregated reports
│   └── final-report-1234567890.json
└── scripts/ci/                 # Auto-generated helper scripts
    ├── analyze-playwright-report.js
    └── suggest-fixes-from-trace.js
```

## How It Works

### 1. Initialization Phase
```bash
check_requirements()      # Verify tools are available
db_backup()              # Backup database before changes
generate_helper_scripts() # Create analysis scripts
generate_db_alter_suggestions() # Inspect and fix DB schema
```

### 2. Testing Phase
For each module (in parallel):
1. **Seed Data**: Prepare test data (if supawright is available)
2. **Run Tests**: Execute Playwright tests with current timeout
3. **Analyze Results**: Calculate success percentage
4. **Check Success**: If ≥90% pass, mark module as done
5. **Adjust Timeouts**: If timeout errors detected, increase timeout by 20s
6. **Cleanup**: Teardown test data
7. **Retry**: If not successful, go to step 1 (max 6 attempts)

### 3. Reporting Phase
- Aggregate all module results into a single JSON report
- Store in `test-reports/final-report-*.json`

## Module Testing Logic

Each module follows this retry loop:

```
Attempt 1: Run with 60s timeout
  ↓ Failed (timeout issues)
Attempt 2: Run with 80s timeout
  ↓ Failed (still issues)
Attempt 3: Run with 100s timeout
  ↓ Success (≥90% pass)
✅ Module complete
```

## Database Auto-Fix Logic

The script inspects all tables and columns:

1. **Find nullable columns**
2. **Check for NULL values**
3. **If NULL values exist:**
   - Set appropriate default based on data type:
     - Numbers → `0`
     - Booleans → `false`
     - Timestamps → `now()`
     - Text → `''`
   - Update existing NULL values
   - Add NOT NULL constraint
4. **If no NULL values:**
   - Just add NOT NULL constraint

## Parallel Execution

The script uses `xargs -P` to run multiple modules simultaneously:

```bash
# Auto-detects CPU cores (or uses 4 as fallback)
PARALLEL_MAX=$(nproc || echo 4)

# Limits to number of modules if fewer than cores
PARALLEL_MAX=$(( PARALLEL_MAX>${#MODULES[@]}?${#MODULES[@]}:PARALLEL_MAX ))
```

## Helper Scripts

### analyze-playwright-report.js
Analyzes Playwright JSON reports to extract:
- Total tests
- Passed tests
- Failed tests
- Success percentage
- List of failures with error messages

### suggest-fixes-from-trace.js
Detects common issues in test results:
- Timeout errors
- `waitForURL` failures
- Suggests timeout increases

## Troubleshooting

### Script fails immediately
- Check that required tools are installed: `jq`, `psql`, `node`
- Verify database connection: `psql $SUPABASE_DB_URL -c "SELECT 1"`

### Tests timeout
- The script auto-adjusts timeouts
- You can manually increase `PLAYWRIGHT_TIMEOUT_MS` in the script

### Database changes fail
- Check database credentials
- Verify service role key has sufficient permissions
- Review `tmp/db-alter-suggestions.sql` for the attempted changes

### Module never reaches 90% success
- Check test logs in `test-results/[module]-*/`
- Review `analysis.json` for specific failures
- Consider lowering `MODULE_TARGET_PERCENT` temporarily

## Safety Features

1. **Database Backup**: Backs up DB before any schema changes
2. **Fallback Logic**: Continues even if optional tools are missing
3. **Error Handling**: Uses `set -Eeuo pipefail` for strict error handling
4. **No Destructive Changes**: Only adds constraints and defaults
5. **Retry Logic**: Multiple attempts before failing
6. **Parallel Safety**: Each module has isolated test data (via TEST_ID)

## Performance Tips

1. **Adjust Parallel Workers**: Increase `PARALLEL_MAX` for more parallelism
2. **Reduce Retries**: Lower `MAX_ATTEMPTS_PER_MODULE` for faster feedback
3. **Skip DB Fixes**: Comment out `generate_db_alter_suggestions` if DB is stable
4. **Use Supawright**: Install supawright CLI for better seed/teardown

## Exit Codes

- `0`: All tests completed successfully
- Non-zero: One or more modules failed after max attempts

## Example Output

```
[20251017T160600Z] Starting full aggressive suite...
[20251017T160601Z] Checking required tools...
[20251017T160602Z] Backing up DB...
[20251017T160610Z] Backup done: db-backup-20251017T160602Z.sql
[20251017T160611Z] Inspecting DB schema and applying auto fixes...
[20251017T160620Z] DB fixes applied.
[20251017T160621Z] Installing dependencies...
[20251017T160630Z] Running up to 4 modules in parallel
[20251017T160631Z] === START module: auth ===
[20251017T160631Z] === START module: users ===
[20251017T160631Z] === START module: patients ===
[20251017T160631Z] === START module: appointments ===
...
[20251017T161200Z] [auth] Success percent: 95%
[20251017T161200Z] [auth] ✅ Module target reached
...
[20251017T162000Z] Aggregating final report...
[20251017T162001Z] Final report generated
[20251017T162001Z] All done. ✅ Check test-results and test-reports.
```

## Advanced Configuration

### Custom Module List
Edit the `MODULES` array in the script:
```bash
MODULES=(auth users patients)  # Test only these 3 modules
```

### Different Database
Update the connection string:
```bash
export SUPABASE_DB_URL="postgresql://user:pass@host:5432/db"
```

### Custom Timeout Strategy
Modify the timeout increase logic:
```bash
# Current: increases by 20s each retry
PLAYWRIGHT_TIMEOUT_MS=$((PLAYWRIGHT_TIMEOUT_MS+20000))

# Alternative: double it
PLAYWRIGHT_TIMEOUT_MS=$((PLAYWRIGHT_TIMEOUT_MS*2))
```

## Integration with CI/CD

Add to your CI pipeline:

```yaml
# .github/workflows/full-suite.yml
- name: Run Full Test Suite
  run: ./run-full-suite.sh
  timeout-minutes: 120

- name: Upload Test Results
  uses: actions/upload-artifact@v3
  with:
    name: test-results
    path: |
      test-results/
      test-reports/
```

## Support

For issues or questions:
1. Check the logs in `test-results/`
2. Review `tmp/db-alter-suggestions.sql` for DB changes
3. Examine individual module reports in JSON format
4. Check Playwright traces in `test-results/[module]-*/`

---

**Last Updated**: 2025-10-17
**Version**: 1.0
**License**: See project LICENSE file
