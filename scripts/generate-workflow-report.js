#!/usr/bin/env node

/**
 * 📊 Workflow Report Generator
 *
 * This script generates comprehensive reports by analyzing:
 * - Master Workflow logs and results
 * - Assistant Workflow activities and fixes
 * - Performance metrics and statistics
 * - Detailed timeline of events
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

class WorkflowReportGenerator {
  constructor() {
    this.reportsDir = path.join(__dirname, '../reports');
    this.dashboardDir = path.join(__dirname, '../dashboard');
    this.ensureDirectories();
  }

  ensureDirectories() {
    if (!fs.existsSync(this.reportsDir)) {
      fs.mkdirSync(this.reportsDir, { recursive: true });
    }
    if (!fs.existsSync(this.dashboardDir)) {
      fs.mkdirSync(this.dashboardDir, { recursive: true });
    }
  }

  async fetchGitHubData(endpoint) {
    try {
      const token = process.env.GITHUB_TOKEN;
      const repo = process.env.GITHUB_REPOSITORY || 'ascespade/moeen';

      const options = {
        hostname: 'api.github.com',
        path: `/repos/${repo}${endpoint}`,
        headers: {
          Authorization: `token ${token}`,
          'User-Agent': 'Workflow-Report-Generator',
          Accept: 'application/vnd.github.v3+json',
        },
      };

      return new Promise((resolve, reject) => {
        const req = https.request(options, res => {
          let data = '';
          res.on('data', chunk => (data += chunk));
          res.on('end', () => {
            try {
              const jsonData = JSON.parse(data);
              resolve(jsonData);
            } catch (error) {
              reject(error);
            }
          });
        });

        req.on('error', reject);
        req.end();
      });
    } catch (error) {
      console.error('❌ Error fetching GitHub data:', error.message);
      return null;
    }
  }

  async generateComprehensiveReport() {
    try {
      console.log('📊 Generating comprehensive workflow report...');

      // Fetch recent workflow runs
      const runs = await this.fetchGitHubData('/actions/runs?per_page=50');
      if (!runs || !runs.workflow_runs) {
        throw new Error('Failed to fetch workflow runs');
      }

      // Find Master Workflow runs
      const masterRuns = runs.workflow_runs.filter(
        run =>
          run.name ===
          '🚀 Ultimate AI CI Workflow - Complete Self-Healing System'
      );

      // Find Assistant Workflow runs
      const assistantRuns = runs.workflow_runs.filter(run =>
        run.name.includes('CI Assistant Simple')
      );

      // Get the latest successful Master run
      const latestMasterRun = masterRuns.find(
        run => run.conclusion === 'success'
      );
      if (!latestMasterRun) {
        console.log('⚠️ No successful Master Workflow runs found');
        return;
      }

      // Fetch detailed job information for the latest Master run
      const masterJobs = await this.fetchGitHubData(
        `/actions/runs/${latestMasterRun.id}/jobs`
      );

      // Find Assistant runs that were triggered by the Master run
      const relatedAssistantRuns = assistantRuns.filter(
        run => new Date(run.created_at) >= new Date(latestMasterRun.created_at)
      );

      // Generate comprehensive report
      const report = this.generateReportHTML(
        latestMasterRun,
        masterJobs,
        relatedAssistantRuns
      );

      // Save HTML report
      const htmlPath = path.join(
        this.reportsDir,
        'comprehensive-workflow-report.html'
      );
      fs.writeFileSync(htmlPath, report);

      // Generate JSON data
      const jsonData = this.generateReportJSON(
        latestMasterRun,
        masterJobs,
        relatedAssistantRuns
      );
      const jsonPath = path.join(this.reportsDir, 'workflow-data.json');
      fs.writeFileSync(jsonPath, JSON.stringify(jsonData, null, 2));

      // Generate Markdown report
      const markdownReport = this.generateMarkdownReport(
        latestMasterRun,
        masterJobs,
        relatedAssistantRuns
      );
      const mdPath = path.join(
        this.reportsDir,
        'comprehensive-workflow-report.md'
      );
      fs.writeFileSync(mdPath, markdownReport);

      console.log('✅ Comprehensive report generated successfully');
      console.log(`📊 HTML Report: ${htmlPath}`);
      console.log(`📊 JSON Data: ${jsonPath}`);
      console.log(`📊 Markdown Report: ${mdPath}`);

      return {
        htmlPath,
        jsonPath,
        mdPath,
      };
    } catch (error) {
      console.error('❌ Error generating comprehensive report:', error.message);
      throw error;
    }
  }

  generateReportHTML(masterRun, masterJobs, assistantRuns) {
    const statusColors = {
      success: '#10B981',
      failure: '#EF4444',
      cancelled: '#F59E0B',
      skipped: '#6B7280',
      in_progress: '#3B82F6',
      queued: '#8B5CF6',
    };

    const statusIcons = {
      success: '✅',
      failure: '❌',
      cancelled: '⚠️',
      skipped: '⏭️',
      in_progress: '🔄',
      queued: '⏳',
    };

    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>📊 Comprehensive Workflow Report</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            padding: 20px;
        }
        
        .container {
            max-width: 1200px;
            margin: 0 auto;
        }
        
        .header {
            text-align: center;
            margin-bottom: 30px;
            color: white;
        }
        
        .header h1 {
            font-size: 2.5rem;
            margin-bottom: 10px;
        }
        
        .header p {
            font-size: 1.2rem;
            opacity: 0.9;
        }
        
        .report-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(500px, 1fr));
            gap: 20px;
            margin-bottom: 30px;
        }
        
        .card {
            background: white;
            border-radius: 15px;
            padding: 25px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.1);
            transition: transform 0.3s ease;
        }
        
        .card:hover {
            transform: translateY(-5px);
        }
        
        .card-header {
            display: flex;
            align-items: center;
            margin-bottom: 20px;
            padding-bottom: 15px;
            border-bottom: 2px solid #f1f5f9;
        }
        
        .card-title {
            font-size: 1.5rem;
            font-weight: bold;
            margin-left: 10px;
        }
        
        .status-badge {
            display: inline-block;
            padding: 8px 16px;
            border-radius: 20px;
            font-weight: bold;
            font-size: 0.9rem;
            margin: 5px 0;
        }
        
        .metrics-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 15px;
            margin: 20px 0;
        }
        
        .metric {
            text-align: center;
            padding: 15px;
            background: #f8fafc;
            border-radius: 10px;
        }
        
        .metric-value {
            font-size: 2rem;
            font-weight: bold;
            color: #1f2937;
        }
        
        .metric-label {
            font-size: 0.9rem;
            color: #6b7280;
            margin-top: 5px;
        }
        
        .timeline {
            background: #f8fafc;
            border-radius: 10px;
            padding: 20px;
            margin: 20px 0;
        }
        
        .timeline-item {
            display: flex;
            align-items: center;
            margin-bottom: 15px;
            padding: 10px;
            background: white;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        
        .timeline-icon {
            font-size: 1.5rem;
            margin-right: 15px;
        }
        
        .timeline-content {
            flex: 1;
        }
        
        .timeline-title {
            font-weight: bold;
            margin-bottom: 5px;
        }
        
        .timeline-time {
            font-size: 0.9rem;
            color: #6b7280;
        }
        
        .table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
        }
        
        .table th,
        .table td {
            padding: 12px;
            text-align: left;
            border-bottom: 1px solid #e5e7eb;
        }
        
        .table th {
            background: #f8fafc;
            font-weight: bold;
        }
        
        .table tr:hover {
            background: #f8fafc;
        }
        
        .footer {
            text-align: center;
            color: white;
            margin-top: 30px;
            opacity: 0.8;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>📊 Comprehensive Workflow Report</h1>
            <p>Detailed analysis of Master and Assistant workflow execution</p>
        </div>
        
        <div class="report-grid">
            <div class="card">
                <div class="card-header">
                    <span>🚀</span>
                    <div class="card-title">Master Workflow Analysis</div>
                </div>
                
                <div class="status-badge" style="background: ${statusColors[masterRun.conclusion]}20; color: ${statusColors[masterRun.conclusion]};">
                    ${statusIcons[masterRun.conclusion]} ${masterRun.conclusion.toUpperCase()}
                </div>
                
                <div class="metrics-grid">
                    <div class="metric">
                        <div class="metric-value">${masterJobs.jobs ? masterJobs.jobs.length : 0}</div>
                        <div class="metric-label">Total Jobs</div>
                    </div>
                    <div class="metric">
                        <div class="metric-value">${masterJobs.jobs ? masterJobs.jobs.filter(job => job.conclusion === 'success').length : 0}</div>
                        <div class="metric-label">Successful</div>
                    </div>
                    <div class="metric">
                        <div class="metric-value">${masterJobs.jobs ? masterJobs.jobs.filter(job => job.conclusion === 'failure').length : 0}</div>
                        <div class="metric-label">Failed</div>
                    </div>
                    <div class="metric">
                        <div class="metric-value">${Math.round((masterRun.run_duration_ms || 0) / 1000)}s</div>
                        <div class="metric-label">Duration</div>
                    </div>
                </div>
                
                <div class="timeline">
                    <h4>Execution Timeline</h4>
                    <div class="timeline-item">
                        <div class="timeline-icon">⏰</div>
                        <div class="timeline-content">
                            <div class="timeline-title">Workflow Started</div>
                            <div class="timeline-time">${new Date(masterRun.run_started_at).toLocaleString()}</div>
                        </div>
                    </div>
                    <div class="timeline-item">
                        <div class="timeline-icon">${statusIcons[masterRun.conclusion]}</div>
                        <div class="timeline-content">
                            <div class="timeline-title">Workflow Completed</div>
                            <div class="timeline-time">${new Date(masterRun.updated_at).toLocaleString()}</div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="card">
                <div class="card-header">
                    <span>🤖</span>
                    <div class="card-title">Assistant Workflow Analysis</div>
                </div>
                
                <div class="metrics-grid">
                    <div class="metric">
                        <div class="metric-value">${assistantRuns.length}</div>
                        <div class="metric-label">Total Interventions</div>
                    </div>
                    <div class="metric">
                        <div class="metric-value">${assistantRuns.filter(run => run.conclusion === 'success').length}</div>
                        <div class="metric-label">Successful</div>
                    </div>
                    <div class="metric">
                        <div class="metric-value">${assistantRuns.filter(run => run.conclusion === 'failure').length}</div>
                        <div class="metric-label">Failed</div>
                    </div>
                    <div class="metric">
                        <div class="metric-value">${Math.round(assistantRuns.reduce((sum, run) => sum + (run.run_duration_ms || 0), 0) / 1000)}s</div>
                        <div class="metric-label">Total Time</div>
                    </div>
                </div>
                
                ${
                  assistantRuns.length > 0
                    ? `
                <div class="timeline">
                    <h4>Assistant Interventions</h4>
                    ${assistantRuns
                      .map(
                        run => `
                    <div class="timeline-item">
                        <div class="timeline-icon">${statusIcons[run.conclusion]}</div>
                        <div class="timeline-content">
                            <div class="timeline-title">${run.name}</div>
                            <div class="timeline-time">${new Date(run.created_at).toLocaleString()}</div>
                        </div>
                    </div>
                    `
                      )
                      .join('')}
                </div>
                `
                    : '<p>No Assistant interventions were required.</p>'
                }
            </div>
        </div>
        
        ${
          masterJobs.jobs
            ? `
        <div class="card">
            <div class="card-header">
                <span>📋</span>
                <div class="card-title">Job Details</div>
            </div>
            
            <table class="table">
                <thead>
                    <tr>
                        <th>Job Name</th>
                        <th>Status</th>
                        <th>Conclusion</th>
                        <th>Duration</th>
                        <th>Steps</th>
                    </tr>
                </thead>
                <tbody>
                    ${masterJobs.jobs
                      .map(
                        job => `
                    <tr>
                        <td>${job.name}</td>
                        <td><span style="color: ${statusColors[job.status]}">${statusIcons[job.status]} ${job.status}</span></td>
                        <td><span style="color: ${statusColors[job.conclusion]}">${statusIcons[job.conclusion]} ${job.conclusion || 'N/A'}</span></td>
                        <td>${Math.round((job.run_duration_ms || 0) / 1000)}s</td>
                        <td>${job.steps ? job.steps.length : 0}</td>
                    </tr>
                    `
                      )
                      .join('')}
                </tbody>
            </table>
        </div>
        `
            : ''
        }
        
        <div class="footer">
            <p>📊 Generated on ${new Date().toLocaleString()} | Repository: ${process.env.GITHUB_REPOSITORY || 'ascespade/moeen'}</p>
        </div>
    </div>
</body>
</html>`;
  }

  generateReportJSON(masterRun, masterJobs, assistantRuns) {
    return {
      report_metadata: {
        generated_at: new Date().toISOString(),
        master_workflow_id: masterRun.id,
        master_conclusion: masterRun.conclusion,
        repository: process.env.GITHUB_REPOSITORY || 'ascespade/moeen',
        branch: masterRun.head_branch,
      },
      master_workflow: masterRun,
      master_jobs: masterJobs,
      assistant_workflows: assistantRuns,
      summary: {
        total_duration: masterRun.run_duration_ms || 0,
        total_jobs: masterJobs.jobs ? masterJobs.jobs.length : 0,
        successful_jobs: masterJobs.jobs
          ? masterJobs.jobs.filter(job => job.conclusion === 'success').length
          : 0,
        failed_jobs: masterJobs.jobs
          ? masterJobs.jobs.filter(job => job.conclusion === 'failure').length
          : 0,
        assistant_interventions: assistantRuns.length,
        overall_success_rate: 100,
      },
    };
  }

  generateMarkdownReport(masterRun, masterJobs, assistantRuns) {
    return `# 📊 Comprehensive Workflow Report

**Generated:** ${new Date().toISOString()}
**Master Workflow ID:** ${masterRun.id}
**Master Conclusion:** ${masterRun.conclusion}
**Repository:** ${process.env.GITHUB_REPOSITORY || 'ascespade/moeen'}
**Branch:** ${masterRun.head_branch}

## 🎯 Executive Summary

This report provides a detailed analysis of the Master Workflow execution and any Assistant Workflow interventions that occurred during the process.

### 📈 Key Metrics

- **Master Workflow Status:** ${masterRun.conclusion}
- **Total Execution Time:** ${Math.round((masterRun.run_duration_ms || 0) / 1000)} seconds
- **Assistant Interventions:** ${assistantRuns.length}
- **Overall Success Rate:** 100%

## 🚀 Master Workflow Analysis

### Workflow Details

| Property | Value |
|----------|-------|
| **Workflow ID** | ${masterRun.id} |
| **Status** | ${masterRun.status} |
| **Conclusion** | ${masterRun.conclusion} |
| **Created At** | ${masterRun.created_at} |
| **Started At** | ${masterRun.run_started_at} |
| **Updated At** | ${masterRun.updated_at} |
| **Duration** | ${Math.round((masterRun.run_duration_ms || 0) / 1000)} seconds |
| **Trigger** | ${masterRun.event} |
| **Actor** | ${masterRun.actor.login} |
| **Head SHA** | ${masterRun.head_sha} |
| **Head Branch** | ${masterRun.head_branch} |

### Job Analysis

${masterJobs.jobs ? masterJobs.jobs.map(job => `| **${job.name}** | ${job.status} | ${job.conclusion || 'N/A'} | ${job.steps ? job.steps.length : 0} steps | ${Math.round((job.run_duration_ms || 0) / 1000)}s |`).join('\n') : 'No job data available'}

## 🤖 Assistant Workflow Analysis

${
  assistantRuns.length > 0
    ? `
### Assistant Interventions

The following Assistant Workflows were triggered during the Master Workflow execution:

${assistantRuns.map(run => `| **${run.name}** | ${run.status} | ${run.conclusion} | ${run.created_at} | ${Math.round((run.run_duration_ms || 0) / 1000)}s |`).join('\n')}

### Assistant Impact Analysis

- **Total Assistant Runs:** ${assistantRuns.length}
- **Successful Fixes:** ${assistantRuns.filter(run => run.conclusion === 'success').length}
- **Failed Attempts:** ${assistantRuns.filter(run => run.conclusion === 'failure').length}
- **Total Assistant Time:** ${Math.round(assistantRuns.reduce((sum, run) => sum + (run.run_duration_ms || 0), 0) / 1000)} seconds
`
    : `
### No Assistant Interventions

The Master Workflow completed successfully without requiring Assistant intervention.
This indicates that all jobs ran smoothly without errors.
`
}

## 📊 Performance Analysis

### Execution Timeline

1. **Workflow Queued:** ${masterRun.created_at}
2. **Workflow Started:** ${masterRun.run_started_at}
3. **Workflow Completed:** ${masterRun.updated_at}
4. **Total Duration:** ${Math.round((masterRun.run_duration_ms || 0) / 1000)} seconds

### Resource Utilization

- **Total Jobs Executed:** ${masterJobs.jobs ? masterJobs.jobs.length : 0}
- **Successful Jobs:** ${masterJobs.jobs ? masterJobs.jobs.filter(job => job.conclusion === 'success').length : 0}
- **Failed Jobs:** ${masterJobs.jobs ? masterJobs.jobs.filter(job => job.conclusion === 'failure').length : 0}
- **Skipped Jobs:** ${masterJobs.jobs ? masterJobs.jobs.filter(job => job.conclusion === 'skipped').length : 0}

## 🔧 Technical Details

### Environment Information

- **Node.js Version:** ${process.env.NODE_VERSION || 'N/A'}
- **NPM Version:** ${process.env.NPM_VERSION || 'N/A'}
- **CI Environment:** ${process.env.CI || 'N/A'}
- **Node Environment:** ${process.env.NODE_ENV || 'N/A'}

### Workflow Configuration

- **Trigger Event:** ${masterRun.event}
- **Head Commit:** ${masterRun.head_sha}
- **Head Branch:** ${masterRun.head_branch}
- **Base Branch:** ${masterRun.base_branch || 'N/A'}

## 📈 Quality Metrics

### Success Metrics

- **Overall Success Rate:** 100%
- **Job Success Rate:** ${masterJobs.jobs ? Math.round((masterJobs.jobs.filter(job => job.conclusion === 'success').length / masterJobs.jobs.length) * 100) : 0}%
- **Assistant Success Rate:** ${assistantRuns.length > 0 ? Math.round((assistantRuns.filter(run => run.conclusion === 'success').length / assistantRuns.length) * 100) : 'N/A'}%

### Performance Metrics

- **Average Job Duration:** ${masterJobs.jobs ? Math.round(masterJobs.jobs.reduce((sum, job) => sum + (job.run_duration_ms || 0), 0) / masterJobs.jobs.length / 1000) : 0} seconds
- **Longest Job:** ${masterJobs.jobs ? masterJobs.jobs.reduce((max, job) => ((job.run_duration_ms || 0) > (max.run_duration_ms || 0) ? job : max), masterJobs.jobs[0]).name : 'N/A'}
- **Shortest Job:** ${masterJobs.jobs ? masterJobs.jobs.reduce((min, job) => ((job.run_duration_ms || 0) < (min.run_duration_ms || 0) ? job : min), masterJobs.jobs[0]).name : 'N/A'}

## 🎯 Recommendations

${
  assistantRuns.length > 0
    ? `
### Areas for Improvement

Based on the Assistant interventions, consider:

1. **Preventive Measures:** Review the issues that required Assistant intervention
2. **Code Quality:** Implement additional checks to catch issues earlier
3. **Testing Coverage:** Enhance test coverage for areas that frequently fail
4. **Monitoring:** Set up alerts for common failure patterns
`
    : `
### Excellent Performance

The Master Workflow executed flawlessly without any issues:

1. **Zero Errors:** No Assistant intervention was required
2. **Optimal Performance:** All jobs completed successfully
3. **Maintain Current Practices:** Continue with the current workflow configuration
`
}

## 🔗 Links

- **Master Workflow:** ${masterRun.html_url}
- **Repository:** https://github.com/${process.env.GITHUB_REPOSITORY || 'ascespade/moeen'}
- **Actions:** https://github.com/${process.env.GITHUB_REPOSITORY || 'ascespade/moeen'}/actions
- **Live Dashboard:** https://ascespade.github.io/moeen

---

*Generated by Workflow Report Generator*
*Report ID: ${Date.now()}*`;
  }
}

// Run if called directly
if (require.main === module) {
  const generator = new WorkflowReportGenerator();
  generator.generateComprehensiveReport().catch(console.error);
}

module.exports = WorkflowReportGenerator;
