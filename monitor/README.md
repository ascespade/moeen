# 🤖 Moeen Monitor Agent

**Advanced Project Monitoring & Learning System**

The Moeen Monitor Agent is a comprehensive, autonomous monitoring system that tracks agent activities, project health, and learns from patterns to provide actionable insights.

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Architecture](#architecture)
- [Installation](#installation)
- [Usage](#usage)
- [Reports & Dashboard](#reports--dashboard)
- [Learning System](#learning-system)
- [Configuration](#configuration)
- [Troubleshooting](#troubleshooting)

---

## 🎯 Overview

The Moeen Monitor Agent is designed to:

1. **Monitor Agents** - Track all agents assigned to the project
2. **Project Health** - Collect comprehensive health metrics
3. **Pattern Analysis** - Learn from project patterns
4. **Generate Reports** - Create detailed HTML and JSON reports
5. **Central Dashboard** - Maintain a real-time status dashboard
6. **Continuous Operation** - Run automatically every 5 minutes

---

## ✨ Features

### 🔍 Monitoring Capabilities

- **Agent Discovery** - Automatically detects and monitors all active agents
- **Health Metrics** - Tracks build, tests, linting, types, security, and more
- **Git Integration** - Monitors repository status and commits
- **Dependency Tracking** - Checks for outdated packages and vulnerabilities
- **File Analysis** - Analyzes project structure and file counts
- **Database Status** - Monitors migrations and configuration

### 📊 Reporting

- **JSON Reports** - Structured data for programmatic access
- **HTML Reports** - Beautiful, interactive visual reports
- **Dashboard** - Real-time status dashboard with history
- **Learning Data** - AI-ready insights and recommendations

### 🧠 Learning System

- **Pattern Recognition** - Identifies recurring issues
- **Health Scoring** - Calculates overall project health (0-100)
- **Recommendations** - Provides actionable suggestions
- **Severity Classification** - Prioritizes issues (critical, high, medium, low)

---

## 🏗️ Architecture

```
monitor/
├── moeen-monitor-agent.mjs    # Main monitoring agent
├── start-monitor.sh            # Start continuous monitoring
├── stop-monitor.sh             # Stop monitoring
├── status-monitor.sh           # Check monitor status
├── README.md                   # This file
├── reports/                    # Generated reports
│   ├── moeen-{timestamp}.json
│   └── moeen-{timestamp}.html
├── learning/                   # Learning data
│   └── moeen-{timestamp}.json
├── agents/                     # Agent status files
└── dashboard.json              # Central dashboard

logs/
└── monitor-agent.log           # Continuous monitoring logs
```

### Components

1. **AgentMonitor** - Discovers and tracks agents
2. **ProjectHealthMonitor** - Collects health metrics
3. **LearningSystem** - Analyzes patterns and generates insights
4. **ReportGenerator** - Creates JSON and HTML reports
5. **DashboardUpdater** - Maintains central dashboard

---

## 🚀 Installation

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Git
- Unix-like environment (Linux, macOS, WSL)

### Setup

1. **Install dependencies** (already done if you've run npm install)

2. **Make scripts executable:**
```bash
chmod +x monitor/*.sh
```

3. **Verify installation:**
```bash
npm run monitor:moeen:status
```

---

## 💻 Usage

### Quick Start

#### Run Once (Single Cycle)
```bash
npm run monitor:moeen
```

#### Start Continuous Monitoring
```bash
npm run monitor:moeen:start
# or
./monitor/start-monitor.sh
```

#### Check Status
```bash
npm run monitor:moeen:status
# or
./monitor/status-monitor.sh
```

#### Stop Monitoring
```bash
npm run monitor:moeen:stop
# or
./monitor/stop-monitor.sh
```

#### View Logs
```bash
tail -f logs/monitor-agent.log
```

### Advanced Usage

#### Run Continuous Monitoring Directly
```bash
node monitor/moeen-monitor-agent.mjs continuous
```

#### Custom Interval (Not yet implemented, but you can modify CONFIG.monitorInterval)
Edit `moeen-monitor-agent.mjs` and change:
```javascript
monitorInterval: 5 * 60 * 1000, // 5 minutes
```

---

## 📊 Reports & Dashboard

### Generated Reports

Every monitoring cycle generates three outputs:

#### 1. JSON Report
- **Location:** `monitor/reports/moeen-{timestamp}.json`
- **Contains:** Complete monitoring data
- **Use:** Programmatic access, data analysis

#### 2. HTML Report
- **Location:** `monitor/reports/moeen-{timestamp}.html`
- **Contains:** Beautiful visual report with:
  - Health score and status
  - Active agents
  - Health metrics (build, tests, linting, types, security)
  - Insights and recommendations
  - Project statistics
- **Use:** Human-readable status overview

#### 3. Learning Data
- **Location:** `monitor/learning/moeen-{timestamp}.json`
- **Contains:** AI-ready insights and patterns
- **Use:** Machine learning, trend analysis

### Central Dashboard

- **Location:** `monitor/dashboard.json`
- **Updated:** Every monitoring cycle
- **Contains:**
  - Current health score
  - Active agents count
  - Latest metrics
  - Critical alerts
  - History (last 20 entries)

#### Dashboard Structure
```json
{
  "lastUpdate": "2025-11-01T01:23:22.871Z",
  "project": "moeen",
  "status": "excellent",
  "score": 100,
  "alerts": [],
  "agents": {
    "total": 1,
    "active": 1
  },
  "metrics": {
    "build": "healthy",
    "tests": { "passed": 0, "failed": 0, "total": 0 },
    "types": 0,
    "linting": 0,
    "security": 0
  },
  "learning": { ... },
  "history": [ ... ]
}
```

---

## 🧠 Learning System

### Health Scoring Algorithm

The health score (0-100) is calculated as:

```
Base Score: 100
- Build not healthy: -15
- Each failed test: -5
- Each type error: -2
- Each linting error: -1
- Each security vulnerability: -10

Final Score: max(0, min(100, calculated_score))
```

### Health Status Classification

| Score | Status | Meaning |
|-------|--------|---------|
| 90-100 | Excellent | All systems optimal |
| 75-89 | Good | Minor issues, generally healthy |
| 60-74 | Fair | Some attention needed |
| 40-59 | Poor | Significant issues present |
| 0-39 | Critical | Immediate action required |

### Pattern Recognition

The learning system identifies:

1. **Build Issues** - Frequent build failures
2. **Test Failures** - Failing test suites
3. **Type Errors** - TypeScript compilation errors
4. **Linting Issues** - Code quality problems
5. **Security Vulnerabilities** - Dependency vulnerabilities
6. **Git Changes** - Uncommitted modifications
7. **Outdated Dependencies** - Packages needing updates
8. **Inactive Agents** - Agents that may be idle

### Recommendations

Each insight includes:
- **Type** - Category of issue
- **Severity** - Critical, high, medium, low
- **Pattern** - Description of what was detected
- **Recommendation** - Suggested action
- **Action** - Command to run

---

## ⚙️ Configuration

### Project Configuration

Edit `monitor/moeen-monitor-agent.mjs`:

```javascript
const CONFIG = {
  projectName: 'moeen',
  projectPath: projectRoot,
  frameworkVersion: '2.0.0',
  monitorInterval: 5 * 60 * 1000, // 5 minutes
  paths: {
    agents: path.join(projectRoot, 'monitor', 'agents'),
    logs: path.join(projectRoot, 'logs'),
    reports: path.join(projectRoot, 'monitor', 'reports'),
    learning: path.join(projectRoot, 'monitor', 'learning'),
    dashboard: path.join(projectRoot, 'monitor', 'dashboard.json'),
  },
};
```

### Customization Options

1. **Change Monitoring Interval:**
   - Modify `monitorInterval` in CONFIG
   - Default: 5 minutes (300,000 ms)

2. **Add Custom Metrics:**
   - Extend `ProjectHealthMonitor` class
   - Add new methods for custom checks

3. **Modify Health Scoring:**
   - Edit `LearningSystem.calculateHealthScore()`
   - Adjust penalty values

4. **Customize Reports:**
   - Edit `ReportGenerator.generateHTMLReport()`
   - Modify CSS and structure

---

## 🐛 Troubleshooting

### Common Issues

#### Monitor won't start
```bash
# Check if already running
npm run monitor:moeen:status

# Remove stale PID file
rm -f monitor/.monitor.pid

# Try starting again
npm run monitor:moeen:start
```

#### Monitor crashes immediately
```bash
# Check logs
tail -50 logs/monitor-agent.log

# Check for errors
node monitor/moeen-monitor-agent.mjs once
```

#### Reports not generating
```bash
# Check permissions
ls -la monitor/reports/

# Ensure directories exist
mkdir -p monitor/reports monitor/learning monitor/agents logs

# Run once to test
npm run monitor:moeen
```

#### High CPU usage
```bash
# Check monitor process
ps aux | grep moeen-monitor-agent

# Consider increasing interval
# Edit CONFIG.monitorInterval in moeen-monitor-agent.mjs
```

### Debug Mode

Run with verbose output:
```bash
NODE_DEBUG=* node monitor/moeen-monitor-agent.mjs once
```

### Log Levels

- **INFO** - Normal operations
- **SUCCESS** - Successful operations
- **WARN** - Warnings, non-critical issues
- **ERROR** - Errors that need attention
- **DEBUG** - Detailed debugging information

---

## 📈 Monitoring Best Practices

### 1. Regular Monitoring
- Run continuous monitoring in production
- Check dashboard daily
- Review HTML reports weekly

### 2. Act on Insights
- Address critical issues immediately
- Plan fixes for high-severity issues
- Schedule maintenance for medium/low issues

### 3. Maintain Clean State
- Commit changes regularly
- Keep dependencies updated
- Fix linting errors promptly
- Maintain test coverage

### 4. Review Learning Data
- Analyze patterns monthly
- Identify recurring issues
- Implement preventive measures

---

## 🎯 Integration with CI/CD

### GitHub Actions Example

```yaml
name: Monitor Project Health

on:
  schedule:
    - cron: '0 */6 * * *'  # Every 6 hours
  workflow_dispatch:

jobs:
  monitor:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run monitor:moeen
      - uses: actions/upload-artifact@v3
        with:
          name: monitoring-reports
          path: monitor/reports/
```

---

## 📊 Example Output

### Console Output (Single Cycle)

```
================================================================================
📊 MONITORING SUMMARY
================================================================================
Project: moeen
Health Score: 100/100 (EXCELLENT)
Active Agents: 1/1
Total Insights: 0
Critical Issues: 0

Health Metrics:
  - Build: healthy
  - Tests: 0 passed, 0 failed
  - TypeScript: 0 errors
  - Linting: 0 errors, 0 warnings
  - Security: 0 vulnerabilities

Next check: 11/1/2025, 1:28:22 AM
================================================================================
```

### Status Check Output

```
═══════════════════════════════════════════════════════════════
          🤖 MOEEN MONITOR AGENT STATUS
═══════════════════════════════════════════════════════════════

✅ Status: RUNNING
PID: 12345
Uptime: 01:23:45
CPU: 0.5%
Memory: 1.2%

───────────────────────────────────────────────────────────────
📊 Dashboard Status:
  Last Update: 2025-11-01T01:23:22.871Z
  Health Status: excellent
  Health Score: 100/100
  Active Agents: 1/1

───────────────────────────────────────────────────────────────
📝 Reports:
  Total Reports: 5
  HTML Reports: 5
  Latest: moeen-1761960202857.html

───────────────────────────────────────────────────────────────
📋 Log File:
  Path: /workspace/logs/monitor-agent.log
  Size: 24K
  Lines: 450
```

---

## 🔗 Related Documentation

- [Project Architecture](../docs/ARCHITECTURE.md)
- [Developer Guide](../docs/DEVELOPER_GUIDE.md)
- [Quality Audit Guide](../docs/quality-audit-guide.md)
- [CI/CD Workflows](../docs/WORKFLOWS.md)

---

## 🤝 Contributing

To add new monitoring features:

1. Extend appropriate class (AgentMonitor, ProjectHealthMonitor, etc.)
2. Add tests if applicable
3. Update this README
4. Submit pull request

---

## 📝 License

MIT License - See [LICENSE](../LICENSE) file

---

## 🆘 Support

- **Issues:** Create a GitHub issue
- **Questions:** Check [DEVELOPER_GUIDE.md](../docs/DEVELOPER_GUIDE.md)
- **Email:** Support team contact

---

## 🎉 Current Status

| Metric | Status |
|--------|--------|
| Health Score | 100/100 ✅ |
| Active Agents | 1/1 ✅ |
| Build | Healthy ✅ |
| Tests | Passing ✅ |
| TypeScript | Clean ✅ |
| Linting | Clean ✅ |
| Security | Secure ✅ |
| Dependencies | Up to date ✅ |

**Last Update:** 2025-11-01

---

**Made with ❤️ by the Moeen Team**

*Autonomous Monitoring for Modern Projects*
