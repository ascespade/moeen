#!/usr/bin/env node

/**
 * 🎯 Live Dashboard for CI/CD Monitoring
 *
 * This script creates a real-time dashboard that monitors:
 * - Master Workflow progress
 * - Assistant Workflow activities
 * - Current job status
 * - Logs and metrics
 * - Success/failure rates
 * - Performance statistics
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

class LiveDashboard {
  constructor() {
    this.dashboardData = {
      timestamp: new Date().toISOString(),
      masterWorkflow: {
        status: 'unknown',
        currentJob: 'none',
        progress: 0,
        logs: [],
        metrics: {
          totalJobs: 0,
          completedJobs: 0,
          failedJobs: 0,
          successRate: 0,
        },
      },
      assistantWorkflow: {
        status: 'idle',
        currentAction: 'none',
        fixesApplied: 0,
        retryCount: 0,
        logs: [],
      },
      overall: {
        status: 'initializing',
        startTime: new Date().toISOString(),
        duration: 0,
        qualityScore: 0,
        totalFixes: 0,
      },
    };

    this.dashboardPath = path.join(__dirname, '../dashboard');
    this.ensureDashboardDir();
  }

  ensureDashboardDir() {
    if (!fs.existsSync(this.dashboardPath)) {
      fs.mkdirSync(this.dashboardPath, { recursive: true });
    }
  }

  async fetchGitHubWorkflowStatus() {
    try {
      const token = process.env.GITHUB_TOKEN;
      const repo = process.env.GITHUB_REPOSITORY || 'ascespade/moeen';

      const options = {
        hostname: 'api.github.com',
        path: `/repos/${repo}/actions/runs?per_page=10`,
        headers: {
          Authorization: `token ${token}`,
          'User-Agent': 'Live-Dashboard',
          Accept: 'application/vnd.github.v3+json',
        },
      };

      return new Promise((resolve, reject) => {
        const req = https.request(options, res => {
          let data = '';
          res.on('data', chunk => (data += chunk));
          res.on('end', () => {
            try {
              const runs = JSON.parse(data);
              resolve(runs.workflow_runs || []);
            } catch (error) {
              reject(error);
            }
          });
        });

        req.on('error', reject);
        req.end();
      });
    } catch (error) {
      console.error('❌ Error fetching GitHub workflow status:', error.message);
      return [];
    }
  }

  async updateMasterWorkflowStatus() {
    try {
      const runs = await this.fetchGitHubWorkflowStatus();
      const masterRun = runs.find(
        run =>
          run.name ===
          '🚀 Ultimate AI CI Workflow - Complete Self-Healing System'
      );

      if (masterRun) {
        this.dashboardData.masterWorkflow.status = masterRun.status;
        this.dashboardData.masterWorkflow.progress =
          this.calculateProgress(masterRun);
        this.dashboardData.masterWorkflow.currentJob =
          this.getCurrentJob(masterRun);
        this.dashboardData.masterWorkflow.metrics = this.calculateMetrics(runs);

        // Add recent logs
        this.addLog(
          'master',
          `Workflow ${masterRun.status}: ${masterRun.conclusion || 'running'}`
        );
      }
    } catch (error) {
      console.error('❌ Error updating master workflow status:', error.message);
    }
  }

  async updateAssistantWorkflowStatus() {
    try {
      const runs = await this.fetchGitHubWorkflowStatus();
      const assistantRun = runs.find(run =>
        run.name.includes('CI Assistant Simple')
      );

      if (assistantRun) {
        this.dashboardData.assistantWorkflow.status = assistantRun.status;
        this.dashboardData.assistantWorkflow.currentAction =
          this.getCurrentAction(assistantRun);

        // Add recent logs
        this.addLog(
          'assistant',
          `Assistant ${assistantRun.status}: ${assistantRun.conclusion || 'running'}`
        );
      }
    } catch (error) {
      console.error(
        '❌ Error updating assistant workflow status:',
        error.message
      );
    }
  }

  calculateProgress(run) {
    // Simulate progress based on workflow status
    const statusMap = {
      queued: 10,
      in_progress: 50,
      completed: 100,
    };
    return statusMap[run.status] || 0;
  }

  getCurrentJob(run) {
    // This would need to be enhanced with actual job status from GitHub API
    const statusMap = {
      queued: 'Waiting to start',
      in_progress: 'Running jobs...',
      completed:
        run.conclusion === 'success'
          ? 'All jobs completed'
          : 'Workflow finished',
    };
    return statusMap[run.status] || 'Unknown';
  }

  getCurrentAction(run) {
    const statusMap = {
      queued: 'Waiting for master failure',
      in_progress: 'Analyzing and fixing issues',
      completed:
        run.conclusion === 'success'
          ? 'Fixes applied successfully'
          : 'Assistant finished',
    };
    return statusMap[run.status] || 'Unknown';
  }

  calculateMetrics(runs) {
    const masterRuns = runs.filter(
      run =>
        run.name === '🚀 Ultimate AI CI Workflow - Complete Self-Healing System'
    );

    const totalJobs = masterRuns.length;
    const completedJobs = masterRuns.filter(
      run => run.status === 'completed'
    ).length;
    const failedJobs = masterRuns.filter(
      run => run.conclusion === 'failure'
    ).length;
    const successRate =
      totalJobs > 0
        ? (((completedJobs - failedJobs) / totalJobs) * 100).toFixed(1)
        : 0;

    return {
      totalJobs,
      completedJobs,
      failedJobs,
      successRate: parseFloat(successRate),
    };
  }

  addLog(type, message) {
    const logEntry = {
      timestamp: new Date().toISOString(),
      type,
      message,
    };

    if (type === 'master') {
      this.dashboardData.masterWorkflow.logs.unshift(logEntry);
      // Keep only last 50 logs
      this.dashboardData.masterWorkflow.logs =
        this.dashboardData.masterWorkflow.logs.slice(0, 50);
    } else if (type === 'assistant') {
      this.dashboardData.assistantWorkflow.logs.unshift(logEntry);
      // Keep only last 50 logs
      this.dashboardData.assistantWorkflow.logs =
        this.dashboardData.assistantWorkflow.logs.slice(0, 50);
    }
  }

  updateOverallStatus() {
    const masterStatus = this.dashboardData.masterWorkflow.status;
    const assistantStatus = this.dashboardData.assistantWorkflow.status;

    if (
      masterStatus === 'completed' &&
      this.dashboardData.masterWorkflow.metrics.successRate === 100
    ) {
      this.dashboardData.overall.status = 'success';
    } else if (
      masterStatus === 'completed' &&
      this.dashboardData.masterWorkflow.metrics.successRate < 100
    ) {
      this.dashboardData.overall.status = 'partial_success';
    } else if (assistantStatus === 'in_progress') {
      this.dashboardData.overall.status = 'fixing';
    } else if (masterStatus === 'in_progress') {
      this.dashboardData.overall.status = 'running';
    } else {
      this.dashboardData.overall.status = 'idle';
    }

    // Calculate duration
    const startTime = new Date(this.dashboardData.overall.startTime);
    const now = new Date();
    this.dashboardData.overall.duration = Math.floor((now - startTime) / 1000);

    // Calculate quality score
    this.dashboardData.overall.qualityScore =
      this.dashboardData.masterWorkflow.metrics.successRate;

    // Count total fixes
    this.dashboardData.overall.totalFixes =
      this.dashboardData.assistantWorkflow.fixesApplied;
  }

  generateHTML() {
    const statusColors = {
      success: '#10B981',
      partial_success: '#F59E0B',
      fixing: '#3B82F6',
      running: '#8B5CF6',
      idle: '#6B7280',
      error: '#EF4444',
    };

    const statusIcons = {
      success: '✅',
      partial_success: '⚠️',
      fixing: '🔧',
      running: '🚀',
      idle: '⏸️',
      error: '❌',
    };

    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>🎯 Live CI/CD Dashboard</title>
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
            max-width: 1400px;
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
        
        .dashboard-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
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
        
        .progress-bar {
            width: 100%;
            height: 20px;
            background: #e5e7eb;
            border-radius: 10px;
            overflow: hidden;
            margin: 15px 0;
        }
        
        .progress-fill {
            height: 100%;
            background: linear-gradient(90deg, #10B981, #34D399);
            transition: width 0.3s ease;
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
        
        .logs-container {
            max-height: 300px;
            overflow-y: auto;
            background: #1f2937;
            border-radius: 10px;
            padding: 15px;
            margin-top: 15px;
        }
        
        .log-entry {
            color: #d1d5db;
            font-family: 'Courier New', monospace;
            font-size: 0.9rem;
            margin-bottom: 8px;
            padding: 5px 0;
            border-bottom: 1px solid #374151;
        }
        
        .log-timestamp {
            color: #9ca3af;
            font-size: 0.8rem;
        }
        
        .log-message {
            margin-left: 10px;
        }
        
        .overall-status {
            text-align: center;
            background: white;
            border-radius: 15px;
            padding: 30px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.1);
        }
        
        .overall-icon {
            font-size: 4rem;
            margin-bottom: 20px;
        }
        
        .overall-title {
            font-size: 2rem;
            font-weight: bold;
            margin-bottom: 10px;
        }
        
        .overall-description {
            font-size: 1.2rem;
            color: #6b7280;
            margin-bottom: 20px;
        }
        
        .refresh-info {
            text-align: center;
            color: white;
            margin-top: 20px;
            opacity: 0.8;
        }
        
        .auto-refresh {
            background: rgba(255,255,255,0.1);
            padding: 10px 20px;
            border-radius: 20px;
            display: inline-block;
        }
    </style>
    <script>
        // Auto-refresh every 10 seconds
        setInterval(() => {
            location.reload();
        }, 10000);
    </script>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🎯 Live CI/CD Dashboard</h1>
            <p>Real-time monitoring of Master and Assistant workflows</p>
        </div>
        
        <div class="overall-status">
            <div class="overall-icon">${statusIcons[this.dashboardData.overall.status] || '⏸️'}</div>
            <div class="overall-title" style="color: ${statusColors[this.dashboardData.overall.status] || '#6B7280'}">
                ${this.dashboardData.overall.status.toUpperCase().replace('_', ' ')}
            </div>
            <div class="overall-description">
                Duration: ${this.formatDuration(this.dashboardData.overall.duration)} | 
                Quality Score: ${this.dashboardData.overall.qualityScore}% | 
                Total Fixes: ${this.dashboardData.overall.totalFixes}
            </div>
        </div>
        
        <div class="dashboard-grid">
            <div class="card">
                <div class="card-header">
                    <span>🚀</span>
                    <div class="card-title">Master Workflow</div>
                </div>
                
                <div class="status-badge" style="background: ${statusColors[this.dashboardData.masterWorkflow.status] || '#6B7280'}20; color: ${statusColors[this.dashboardData.masterWorkflow.status] || '#6B7280'};">
                    ${this.dashboardData.masterWorkflow.status.toUpperCase()}
                </div>
                
                <div style="margin: 15px 0;">
                    <strong>Current Job:</strong> ${this.dashboardData.masterWorkflow.currentJob}
                </div>
                
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${this.dashboardData.masterWorkflow.progress}%"></div>
                </div>
                
                <div class="metrics-grid">
                    <div class="metric">
                        <div class="metric-value">${this.dashboardData.masterWorkflow.metrics.totalJobs}</div>
                        <div class="metric-label">Total Jobs</div>
                    </div>
                    <div class="metric">
                        <div class="metric-value">${this.dashboardData.masterWorkflow.metrics.completedJobs}</div>
                        <div class="metric-label">Completed</div>
                    </div>
                    <div class="metric">
                        <div class="metric-value">${this.dashboardData.masterWorkflow.metrics.failedJobs}</div>
                        <div class="metric-label">Failed</div>
                    </div>
                    <div class="metric">
                        <div class="metric-value">${this.dashboardData.masterWorkflow.metrics.successRate}%</div>
                        <div class="metric-label">Success Rate</div>
                    </div>
                </div>
                
                <div class="logs-container">
                    <h4 style="color: white; margin-bottom: 15px;">Recent Logs</h4>
                    ${this.dashboardData.masterWorkflow.logs
                      .map(
                        log => `
                        <div class="log-entry">
                            <span class="log-timestamp">[${new Date(log.timestamp).toLocaleTimeString()}]</span>
                            <span class="log-message">${log.message}</span>
                        </div>
                    `
                      )
                      .join('')}
                </div>
            </div>
            
            <div class="card">
                <div class="card-header">
                    <span>🤖</span>
                    <div class="card-title">Assistant Workflow</div>
                </div>
                
                <div class="status-badge" style="background: ${statusColors[this.dashboardData.assistantWorkflow.status] || '#6B7280'}20; color: ${statusColors[this.dashboardData.assistantWorkflow.status] || '#6B7280'};">
                    ${this.dashboardData.assistantWorkflow.status.toUpperCase()}
                </div>
                
                <div style="margin: 15px 0;">
                    <strong>Current Action:</strong> ${this.dashboardData.assistantWorkflow.currentAction}
                </div>
                
                <div class="metrics-grid">
                    <div class="metric">
                        <div class="metric-value">${this.dashboardData.assistantWorkflow.fixesApplied}</div>
                        <div class="metric-label">Fixes Applied</div>
                    </div>
                    <div class="metric">
                        <div class="metric-value">${this.dashboardData.assistantWorkflow.retryCount}</div>
                        <div class="metric-label">Retry Count</div>
                    </div>
                </div>
                
                <div class="logs-container">
                    <h4 style="color: white; margin-bottom: 15px;">Recent Logs</h4>
                    ${this.dashboardData.assistantWorkflow.logs
                      .map(
                        log => `
                        <div class="log-entry">
                            <span class="log-timestamp">[${new Date(log.timestamp).toLocaleTimeString()}]</span>
                            <span class="log-message">${log.message}</span>
                        </div>
                    `
                      )
                      .join('')}
                </div>
            </div>
        </div>
        
        <div class="refresh-info">
            <div class="auto-refresh">
                🔄 Auto-refreshing every 10 seconds | Last updated: ${new Date().toLocaleString()}
            </div>
        </div>
    </div>
</body>
</html>`;
  }

  formatDuration(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours}h ${minutes}m ${secs}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${secs}s`;
    } else {
      return `${secs}s`;
    }
  }

  async updateDashboard() {
    try {
      console.log('🔄 Updating live dashboard...');

      // Update workflow statuses
      await this.updateMasterWorkflowStatus();
      await this.updateAssistantWorkflowStatus();

      // Update overall status
      this.updateOverallStatus();

      // Update timestamp
      this.dashboardData.timestamp = new Date().toISOString();

      // Generate and save HTML
      const html = this.generateHTML();
      const htmlPath = path.join(this.dashboardPath, 'index.html');
      fs.writeFileSync(htmlPath, html);

      // Save JSON data for API access
      const jsonPath = path.join(this.dashboardPath, 'data.json');
      fs.writeFileSync(jsonPath, JSON.stringify(this.dashboardData, null, 2));

      console.log('✅ Dashboard updated successfully');
      console.log(`📊 Dashboard available at: ${htmlPath}`);
    } catch (error) {
      console.error('❌ Error updating dashboard:', error.message);
    }
  }

  async start() {
    console.log('🎯 Starting Live Dashboard...');

    // Initial update
    await this.updateDashboard();

    // Update every 10 seconds
    setInterval(async () => {
      await this.updateDashboard();
    }, 10000);

    console.log('✅ Live Dashboard started successfully');
    console.log('🔄 Dashboard will update every 10 seconds');
  }
}

// Run if called directly
if (require.main === module) {
  const dashboard = new LiveDashboard();
  dashboard.start().catch(console.error);
}

module.exports = LiveDashboard;
