# 🔄 How to Use Continuous Fix Workflow

## Overview

I've created a continuous fix workflow that will:
- ✅ Run all tests from `tests/modules` recursively
- 🔄 Loop until all tests pass
- 🔍 Analyze errors comprehensively
- 📊 Create detailed reports
- 🛡️ Stop after maximum attempts to prevent infinite loops

## Files Created

1. **`.github/workflows/cursor-continuous-fix.yml`** - Main workflow
2. **`.github/workflows/cursor-manual-workflow-enhanced.yml`** - Enhanced version with better error handling
3. **`.github/workflows/ENHANCED-WORKFLOW-GUIDE.md`** - Usage guide

## How to Trigger the Workflow

### Option 1: Via GitHub Web UI (Recommended)

1. Go to https://github.com/ascespade/moeen/actions
2. Click on **"🔄 Cursor Continuous Fix & Enhance Loop"**
3. Click **"Run workflow"** button
4. Optionally adjust:
   - **Maximum attempts**: (default: 5)
   - **Stop on success**: (default: true)
5. Click **"Run workflow"**

### Option 2: Via GitHub CLI (if installed)

```bash
# Install GitHub CLI first if not installed
# Windows: Download from https://cli.github.com/

# Run the continuous fix workflow
gh workflow run "cursor-continuous-fix.yml" \
  --ref main \
  -f max_attempts="10" \
  -f stop_on_success="true"
```

### Option 3: Direct URL (Quick Trigger)

Visit this URL to trigger the workflow:
```
https://github.com/ascespade/moeen/actions/workflows/cursor-continuous-f랐.yml
```

Then click "Run workflow"

## What the Workflow Does

### Phase 1: Continuous Loop (Max 5 attempts by default)

1. **Run Tests**: Executes `npx playwright test tests/modules` recursively
2. **Analyze Errors**: Comprehensive analysis using regex patterns for:
   - Timeout errors
   - Element not found
   - Visibility issues
   - API/network errors
   - Assertion failures
   - Module errors
   - Syntax errors
   - Type errors

3. **Generate Fix Suggestions**: Creates detailed JSON report with specific fixes
4. **Wait & Retry**: Waits 2 seconds and runs tests again

### Phase 2: Create PR with Results

- Creates a new branch: `fix/continuous-{run_id}`
- Uploads all test logs as artifacts
- Creates a PR with:
  - Analysis report
  - Total attempts
  - Fix suggestions
  - Links to workflow run

### Phase 3: Upload Artifacts

All test logs and analysis reports are saved for 30 days:
- Test attempt logs
- Fix analysis reports
- Error summaries

## Example Output

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔄 Attempt 1 of 5
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🧪 Step 1: Running Playwright tests from tests/modules (recursive)...
❌ Tests failed. Analyzing errors...
🔍 Step 2: Analyzing errors and generating fixes...
📊 Found 3 error categories
💡 Recommended Fixes:
  1. timeout: Add explicit waits
  2. notFound: Add data-testid attributes
  3. visibility: Wait for element visibility before interaction

... continues until all tests pass or max attempts reached ...
```

## Configuration

### Maximum Workshop Attempts

Default: **5 attempts**

You can increase this when triggering:
- For simple fixes: 5 attempts (default)
- For complex issues: 10-15 attempts
- For debugging: 20+ attempts

**Warning**: Each attempt takes 2-5 minutes, so 20 attempts = 40-100 minutes!

### Stop on Success

If enabled (default: true), the workflow stops immediately when all tests pass.

## Test Target

The workflow specifically runs:
```bash
npx playwright test tests/modules --reporter=list
```

This runs all tests in the `tests/modules` directory recursively.

## Troubleshooting

### Workflow Not Appearing
- Make sure you pushed the workflow file to `main` branch
- Refresh the GitHub Actions page
- Check: `.github/workflows/cursor-continuous-fix.yml` exists

### Tests Keep Failing
- Review the analysis report in the PR
- Check the test logs in artifacts
- Manually review the specific failing tests
- May need manual intervention for complex issues

### Infinite Loop Risk
- The workflow has a maximum attempts limit
- Default is 5 attempts
- Each attempt waits 2 seconds before retry
- Automatic timeout after max attempts

## Next Steps

1. **Trigger the workflow** using one of the methods above
2. **Monitor the workflow run** in GitHub Actions
3. **Review the PR** that gets created
4. **Check the artifacts** for detailed logs
5. **Merge the PR** if fixes look good

## Important Notes

⚠️ **The workflow does NOT actually fix code automatically**
- It only analyzes errors and creates suggestions
- You need to review and apply fixes manually
- For automatic fixes, you would need Cursor API integration

✅ **What it DOES do**:
- Run tests repeatedly
- Analyze errors comprehensively
- Generate detailed reports
- Create PRs with findings
- Upload all logs as artifacts

## Manual Fix After Analysis

Once you have the analysis report:
1. Review the suggested fixes
2. Apply fixes to the relevant files
3. Run tests locally to verify
4. Commit and push fixes
5. Re-run workflow to verify all tests pass

---

**Ready to run?** Go to the Actions tab and trigger it! 🚀
