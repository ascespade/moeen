#!/usr/bin/env node

/**
 * AI Report Generator
 * Generates comprehensive reports and artifacts for the E2E self-healing system
 */

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const WORKSPACE_ROOT = path.resolve(__dirname, '..');

// Initialize Supabase
let supabase = null;

/**
 * Initialize the report generator
 */
async function initialize() {
  console.log('📊 Initializing AI Report Generator...');

  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey =
      process.env.SUPABASE_SERVICE_ROLE_KEY ||
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (supabaseUrl && supabaseKey) {
      supabase = createClient(supabaseUrl, supabaseKey);
      console.log('✅ Supabase client initialized');
    }

    console.log('✅ Report generator initialized');
    return true;
  } catch (error) {
    console.error('❌ Report generator initialization failed:', error);
    return false;
  }
}

/**
 * Generate comprehensive report
 */
async function generateComprehensiveReport(
  runId,
  testResults,
  fixes,
  errors,
  warnings
) {
  console.log('📊 Generating comprehensive report...');

  try {
    const startTime = Date.now();

    // Generate JSON report
    const jsonReport = await generateJSONReport(
      runId,
      testResults,
      fixes,
      errors,
      warnings
    );

    // Generate Markdown summary
    const markdownSummary = await generateMarkdownSummary(
      runId,
      testResults,
      fixes,
      errors,
      warnings
    );

    // Generate execution log
    const executionLog = await generateExecutionLog(
      runId,
      testResults,
      fixes,
      errors,
      warnings
    );

    // Generate dashboard logs
    const dashboardLogs = await generateDashboardLogs(
      runId,
      testResults,
      fixes,
      errors,
      warnings
    );

    // Generate HTML report
    const htmlReport = await generateHTMLReport(
      runId,
      testResults,
      fixes,
      errors,
      warnings
    );

    // Generate CSV export
    const csvExport = await generateCSVExport(
      runId,
      testResults,
      fixes,
      errors,
      warnings
    );

    // Generate JUnit XML
    const junitXML = await generateJUnitXML(
      runId,
      testResults,
      fixes,
      errors,
      warnings
    );

    // Update memory database
    await updateMemoryDatabase(runId, testResults, fixes, errors, warnings);

    const endTime = Date.now();
    const duration = endTime - startTime;

    console.log(`✅ Report generation complete (${duration}ms)`);

    return {
      jsonReport,
      markdownSummary,
      executionLog,
      dashboardLogs,
      htmlReport,
      csvExport,
      junitXML,
    };
  } catch (error) {
    console.error('❌ Report generation failed:', error);
    return null;
  }
}

/**
 * Generate JSON report
 */
async function generateJSONReport(runId, testResults, fixes, errors, warnings) {
  const report = {
    runId,
    timestamp: new Date().toISOString(),
    summary: {
      totalTests: testResults.length,
      passedTests: testResults.filter(t => t.status === 'passed').length,
      failedTests: testResults.filter(t => t.status === 'failed').length,
      skippedTests: testResults.filter(t => t.status === 'skipped').length,
      totalErrors: errors.length,
      totalWarnings: warnings.length,
      totalFixes: fixes.length,
      overallStatus:
        errors.length === 0 && warnings.length === 0 ? 'OK' : 'ISSUES',
    },
    testResults: testResults.map(result => ({
      name: result.title || result.name,
      status: result.status,
      duration: result.duration || 0,
      file: result.file || result.spec,
      error: result.error || null,
      retryCount: result.retryCount || 0,
    })),
    errors: errors.map(error => ({
      message: error.message || error,
      type: error.type || 'error',
      file: error.file || null,
      line: error.line || null,
      timestamp: error.timestamp || Date.now(),
    })),
    warnings: warnings.map(warning => ({
      message: warning.message || warning,
      type: warning.type || 'warning',
      file: warning.file || null,
      line: warning.line || null,
      timestamp: warning.timestamp || Date.now(),
    })),
    fixes: fixes.map(fix => ({
      type: fix.type || 'unknown',
      description: fix.description || 'No description',
      success: fix.success !== undefined ? fix.success : true,
      timestamp: fix.timestamp || Date.now(),
      file: fix.file || null,
    })),
    recommendations: generateRecommendations(
      testResults,
      fixes,
      errors,
      warnings
    ),
    metadata: {
      nodeVersion: process.version,
      platform: process.platform,
      architecture: process.arch,
      memoryUsage: process.memoryUsage(),
      uptime: process.uptime(),
    },
  };

  const reportPath = path.join(
    WORKSPACE_ROOT,
    'reports',
    'ai_validation_report.json'
  );
  await fs.writeFile(reportPath, JSON.stringify(report, null, 2));

  console.log('✅ JSON report generated');
  return report;
}

/**
 * Generate Markdown summary
 */
async function generateMarkdownSummary(
  runId,
  testResults,
  fixes,
  errors,
  warnings
) {
  const passedTests = testResults.filter(t => t.status === 'passed').length;
  const failedTests = testResults.filter(t => t.status === 'failed').length;
  const skippedTests = testResults.filter(t => t.status === 'skipped').length;
  const overallStatus =
    errors.length === 0 && warnings.length === 0 ? 'OK' : 'ISSUES';

  const summary = `# E2E Self-Healing Test Report

## Run Information
- **Run ID**: ${runId}
- **Timestamp**: ${new Date().toISOString()}
- **Overall Status**: ${overallStatus}

## Summary
- **Total Tests**: ${testResults.length}
- **Passed Tests**: ${passedTests}
- **Failed Tests**: ${failedTests}
- **Skipped Tests**: ${skippedTests}
- **Errors**: ${errors.length}
- **Warnings**: ${warnings.length}
- **Fixes Applied**: ${fixes.length}

## Test Results
${testResults.map(result => `- **${result.title || result.name}**: ${result.status}`).join('\n')}

## Errors
${errors.length > 0 ? errors.map(error => `- ${error.message || error}`).join('\n') : 'No errors found'}

## Warnings
${warnings.length > 0 ? warnings.map(warning => `- ${warning.message || warning}`).join('\n') : 'No warnings found'}

## Fixes Applied
${fixes.length > 0 ? fixes.map(fix => `- **${fix.type}**: ${fix.description}`).join('\n') : 'No fixes applied'}

## Recommendations
${generateRecommendations(testResults, fixes, errors, warnings)
  .map(rec => `- ${rec}`)
  .join('\n')}

## System Information
- **Node Version**: ${process.version}
- **Platform**: ${process.platform}
- **Architecture**: ${process.arch}
- **Memory Usage**: ${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)}MB
- **Uptime**: ${Math.round(process.uptime())}s

---
*Generated by Ultimate E2E Self-Healing Runner*
`;

  const summaryPath = path.join(WORKSPACE_ROOT, 'reports', 'final_summary.md');
  await fs.writeFile(summaryPath, summary);

  console.log('✅ Markdown summary generated');
  return summary;
}

/**
 * Generate execution log
 */
async function generateExecutionLog(
  runId,
  testResults,
  fixes,
  errors,
  warnings
) {
  const log = `E2E Self-Healing Test Execution Log
========================================

Run ID: ${runId}
Timestamp: ${new Date().toISOString()}

Test Summary:
- Total Tests: ${testResults.length}
- Passed Tests: ${testResults.filter(t => t.status === 'passed').length}
- Failed Tests: ${testResults.filter(t => t.status === 'failed').length}
- Skipped Tests: ${testResults.filter(t => t.status === 'skipped').length}

Detailed Results:
${JSON.stringify(testResults, null, 2)}

Errors:
${errors.map(error => error.message || error).join('\n')}

Warnings:
${warnings.map(warning => warning.message || warning).join('\n')}

Fixes Applied:
${fixes.map(fix => `${fix.type}: ${fix.description}`).join('\n')}

System Information:
- Node Version: ${process.version}
- Platform: ${process.platform}
- Architecture: ${process.arch}
- Memory Usage: ${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)}MB
- Uptime: ${Math.round(process.uptime())}s
`;

  const logPath = path.join(WORKSPACE_ROOT, 'reports', 'execution.log');
  await fs.writeFile(logPath, log);

  console.log('✅ Execution log generated');
  return log;
}

/**
 * Generate dashboard logs
 */
async function generateDashboardLogs(
  runId,
  testResults,
  fixes,
  errors,
  warnings
) {
  const dashboardData = {
    runId,
    timestamp: new Date().toISOString(),
    summary: {
      totalTests: testResults.length,
      passedTests: testResults.filter(t => t.status === 'passed').length,
      failedTests: testResults.filter(t => t.status === 'failed').length,
      skippedTests: testResults.filter(t => t.status === 'skipped').length,
      totalErrors: errors.length,
      totalWarnings: warnings.length,
      totalFixes: fixes.length,
      overallStatus:
        errors.length === 0 && warnings.length === 0 ? 'OK' : 'ISSUES',
    },
    testResults: testResults.map(result => ({
      name: result.title || result.name,
      status: result.status,
      duration: result.duration || 0,
      file: result.file || result.spec,
      error: result.error || null,
    })),
    errors: errors.map(error => ({
      message: error.message || error,
      type: error.type || 'error',
      timestamp: error.timestamp || Date.now(),
    })),
    warnings: warnings.map(warning => ({
      message: warning.message || warning,
      type: warning.type || 'warning',
      timestamp: warning.timestamp || Date.now(),
    })),
    fixes: fixes.map(fix => ({
      type: fix.type || 'unknown',
      description: fix.description || 'No description',
      success: fix.success !== undefined ? fix.success : true,
      timestamp: fix.timestamp || Date.now(),
    })),
  };

  const dashboardPath = path.join(
    WORKSPACE_ROOT,
    'dashboard',
    'logs',
    'logs.json'
  );
  await fs.writeFile(dashboardPath, JSON.stringify(dashboardData, null, 2));

  console.log('✅ Dashboard logs generated');
  return dashboardData;
}

/**
 * Generate HTML report
 */
async function generateHTMLReport(runId, testResults, fixes, errors, warnings) {
  const passedTests = testResults.filter(t => t.status === 'passed').length;
  const failedTests = testResults.filter(t => t.status === 'failed').length;
  const skippedTests = testResults.filter(t => t.status === 'skipped').length;
  const overallStatus =
    errors.length === 0 && warnings.length === 0 ? 'OK' : 'ISSUES';

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>E2E Self-Healing Test Report - ${runId}</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background-color: #f5f5f5; }
        .container { max-width: 1200px; margin: 0 auto; background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .header { text-align: center; margin-bottom: 30px; }
        .status { display: inline-block; padding: 8px 16px; border-radius: 4px; font-weight: bold; }
        .status.ok { background-color: #d4edda; color: #155724; }
        .status.issues { background-color: #f8d7da; color: #721c24; }
        .summary { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin-bottom: 30px; }
        .summary-card { background: #f8f9fa; padding: 20px; border-radius: 8px; text-align: center; }
        .summary-card h3 { margin: 0 0 10px 0; color: #495057; }
        .summary-card .number { font-size: 2em; font-weight: bold; color: #007bff; }
        .section { margin-bottom: 30px; }
        .section h2 { color: #495057; border-bottom: 2px solid #007bff; padding-bottom: 10px; }
        .test-result { padding: 10px; margin: 5px 0; border-radius: 4px; }
        .test-result.passed { background-color: #d4edda; border-left: 4px solid #28a745; }
        .test-result.failed { background-color: #f8d7da; border-left: 4px solid #dc3545; }
        .test-result.skipped { background-color: #fff3cd; border-left: 4px solid #ffc107; }
        .error { background-color: #f8d7da; padding: 10px; margin: 5px 0; border-radius: 4px; border-left: 4px solid #dc3545; }
        .warning { background-color: #fff3cd; padding: 10px; margin: 5px 0; border-radius: 4px; border-left: 4px solid #ffc107; }
        .fix { background-color: #d1ecf1; padding: 10px; margin: 5px 0; border-radius: 4px; border-left: 4px solid #17a2b8; }
        .recommendation { background-color: #e2e3e5; padding: 10px; margin: 5px 0; border-radius: 4px; border-left: 4px solid #6c757d; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>E2E Self-Healing Test Report</h1>
            <p><strong>Run ID:</strong> ${runId}</p>
            <p><strong>Timestamp:</strong> ${new Date().toISOString()}</p>
            <span class="status ${overallStatus.toLowerCase()}">${overallStatus}</span>
        </div>
        
        <div class="summary">
            <div class="summary-card">
                <h3>Total Tests</h3>
                <div class="number">${testResults.length}</div>
            </div>
            <div class="summary-card">
                <h3>Passed</h3>
                <div class="number" style="color: #28a745;">${passedTests}</div>
            </div>
            <div class="summary-card">
                <h3>Failed</h3>
                <div class="number" style="color: #dc3545;">${failedTests}</div>
            </div>
            <div class="summary-card">
                <h3>Skipped</h3>
                <div class="number" style="color: #ffc107;">${skippedTests}</div>
            </div>
            <div class="summary-card">
                <h3>Errors</h3>
                <div class="number" style="color: #dc3545;">${errors.length}</div>
            </div>
            <div class="summary-card">
                <h3>Warnings</h3>
                <div class="number" style="color: #ffc107;">${warnings.length}</div>
            </div>
            <div class="summary-card">
                <h3>Fixes</h3>
                <div class="number" style="color: #17a2b8;">${fixes.length}</div>
            </div>
        </div>
        
        <div class="section">
            <h2>Test Results</h2>
            ${testResults
              .map(
                result => `
                <div class="test-result ${result.status}">
                    <strong>${result.title || result.name}</strong>
                    <span style="float: right;">${result.status.toUpperCase()}</span>
                    ${result.error ? `<br><small>Error: ${result.error}</small>` : ''}
                </div>
            `
              )
              .join('')}
        </div>
        
        ${
          errors.length > 0
            ? `
        <div class="section">
            <h2>Errors</h2>
            ${errors
              .map(
                error => `
                <div class="error">
                    <strong>${error.type || 'Error'}:</strong> ${error.message || error}
                </div>
            `
              )
              .join('')}
        </div>
        `
            : ''
        }
        
        ${
          warnings.length > 0
            ? `
        <div class="section">
            <h2>Warnings</h2>
            ${warnings
              .map(
                warning => `
                <div class="warning">
                    <strong>${warning.type || 'Warning'}:</strong> ${warning.message || warning}
                </div>
            `
              )
              .join('')}
        </div>
        `
            : ''
        }
        
        ${
          fixes.length > 0
            ? `
        <div class="section">
            <h2>Fixes Applied</h2>
            ${fixes
              .map(
                fix => `
                <div class="fix">
                    <strong>${fix.type}:</strong> ${fix.description}
                </div>
            `
              )
              .join('')}
        </div>
        `
            : ''
        }
        
        <div class="section">
            <h2>Recommendations</h2>
            ${generateRecommendations(testResults, fixes, errors, warnings)
              .map(
                rec => `
                <div class="recommendation">${rec}</div>
            `
              )
              .join('')}
        </div>
    </div>
</body>
</html>`;

  const htmlPath = path.join(WORKSPACE_ROOT, 'reports', 'test-report.html');
  await fs.writeFile(htmlPath, html);

  console.log('✅ HTML report generated');
  return html;
}

/**
 * Generate CSV export
 */
async function generateCSVExport(runId, testResults, fixes, errors, warnings) {
  const csv = `Run ID,Test Name,Status,Duration,File,Error
${testResults
  .map(
    result =>
      `${runId},"${result.title || result.name}",${result.status},${result.duration || 0},"${result.file || result.spec}","${result.error || ''}"`
  )
  .join('\n')}

Errors:
Type,Message,File,Line,Timestamp
${errors
  .map(
    error =>
      `${error.type || 'error'},"${error.message || error}","${error.file || ''}",${error.line || ''},${error.timestamp || Date.now()}`
  )
  .join('\n')}

Warnings:
Type,Message,File,Line,Timestamp
${warnings
  .map(
    warning =>
      `${warning.type || 'warning'},"${warning.message || warning}","${warning.file || ''}",${warning.line || ''},${warning.timestamp || Date.now()}`
  )
  .join('\n')}

Fixes:
Type,Description,Success,File,Timestamp
${fixes
  .map(
    fix =>
      `${fix.type || 'unknown'},"${fix.description || 'No description'}",${fix.success !== undefined ? fix.success : true},"${fix.file || ''}",${fix.timestamp || Date.now()}`
  )
  .join('\n')}`;

  const csvPath = path.join(WORKSPACE_ROOT, 'reports', 'test-results.csv');
  await fs.writeFile(csvPath, csv);

  console.log('✅ CSV export generated');
  return csv;
}

/**
 * Generate JUnit XML
 */
async function generateJUnitXML(runId, testResults, fixes, errors, warnings) {
  const passedTests = testResults.filter(t => t.status === 'passed').length;
  const failedTests = testResults.filter(t => t.status === 'failed').length;
  const skippedTests = testResults.filter(t => t.status === 'skipped').length;
  const totalTests = testResults.length;

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<testsuites name="E2E Self-Healing Tests" tests="${totalTests}" failures="${failedTests}" skipped="${skippedTests}" time="0">
  <testsuite name="E2E Tests" tests="${totalTests}" failures="${failedTests}" skipped="${skippedTests}" time="0" timestamp="${new Date().toISOString()}">
    ${testResults
      .map(
        result => `
      <testcase name="${result.title || result.name}" classname="${result.file || result.spec}" time="${result.duration || 0}">
        ${result.status === 'skipped' ? '<skipped/>' : ''}
        ${result.status === 'failed' ? `<failure message="${result.error || 'Test failed'}">${result.error || 'Test failed'}</failure>` : ''}
      </testcase>
    `
      )
      .join('')}
  </testsuite>
</testsuites>`;

  const xmlPath = path.join(WORKSPACE_ROOT, 'reports', 'test-results.xml');
  await fs.writeFile(xmlPath, xml);

  console.log('✅ JUnit XML generated');
  return xml;
}

/**
 * Update memory database
 */
async function updateMemoryDatabase(
  runId,
  testResults,
  fixes,
  errors,
  warnings
) {
  if (!supabase) {
    console.log('⚠️ Supabase not available, skipping database update');
    return;
  }

  try {
    // Insert test run record
    const { data: runData, error: runError } = await supabase
      .from('test_runs')
      .insert({
        run_id: runId,
        start_time: new Date().toISOString(),
        end_time: new Date().toISOString(),
        status: errors.length === 0 && warnings.length === 0 ? 'OK' : 'ISSUES',
        total_tests: testResults.length,
        passed_tests: testResults.filter(t => t.status === 'passed').length,
        failed_tests: testResults.filter(t => t.status === 'failed').length,
        fixed_tests: fixes.length,
        errors_count: errors.length,
        warnings_count: warnings.length,
      })
      .select();

    if (runError) {
      console.log('⚠️ Failed to insert test run record:', runError.message);
    } else {
      console.log('✅ Test run record inserted');
    }

    // Insert test results
    for (const result of testResults) {
      const { error: resultError } = await supabase
        .from('test_results')
        .insert({
          run_id: runId,
          test_name: result.title || result.name,
          status: result.status,
          error_message: result.error || null,
          retry_count: result.retryCount || 0,
          timestamp: new Date().toISOString(),
        });

      if (resultError) {
        console.log('⚠️ Failed to insert test result:', resultError.message);
      }
    }

    // Insert fixes
    for (const fix of fixes) {
      const { error: fixError } = await supabase.from('fixes_applied').insert({
        run_id: runId,
        test_name: fix.testName || null,
        fix_type: fix.type || 'unknown',
        fix_description: fix.description || 'No description',
        success: fix.success !== undefined ? fix.success : true,
        timestamp: new Date().toISOString(),
      });

      if (fixError) {
        console.log('⚠️ Failed to insert fix record:', fixError.message);
      }
    }

    console.log('✅ Memory database updated');
  } catch (error) {
    console.log('⚠️ Database update failed:', error.message);
  }
}

/**
 * Generate recommendations
 */
function generateRecommendations(testResults, fixes, errors, warnings) {
  const recommendations = [];

  if (errors.length > 0) {
    recommendations.push('Address critical errors before deployment');
  }

  if (warnings.length > 0) {
    recommendations.push('Review and resolve warnings for better code quality');
  }

  if (testResults.filter(t => t.status === 'failed').length > 0) {
    recommendations.push('Investigate and fix failing tests');
  }

  if (fixes.length > 0) {
    recommendations.push(
      'Review automated fixes and ensure they meet requirements'
    );
  }

  if (testResults.length === 0) {
    recommendations.push('No tests were executed - check test configuration');
  }

  if (
    testResults.filter(t => t.status === 'skipped').length >
    testResults.length * 0.5
  ) {
    recommendations.push(
      'High number of skipped tests - investigate test environment setup'
    );
  }

  return recommendations;
}

// Run the report generator
if (import.meta.url === `file://${process.argv[1]}`) {
  (async () => {
    const initialized = await initialize();
    if (initialized) {
      // Example usage
      const runId = `run-${Date.now()}`;
      const testResults = [];
      const fixes = [];
      const errors = [];
      const warnings = [];

      await generateComprehensiveReport(
        runId,
        testResults,
        fixes,
        errors,
        warnings
      );
    }
  })().catch(console.error);
}

export {
  generateComprehensiveReport,
  generateJSONReport,
  generateMarkdownSummary,
  generateHTMLReport,
};
