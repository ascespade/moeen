# Monitor Agent System for moeen Project

## Overview

The Monitor Agent is an autonomous system that continuously monitors the moeen project's health, tracks agent activity, collects metrics, and generates comprehensive reports with learning insights.

## 📁 Directory Structure

```
monitor/
├── reports/          # Monitoring reports (JSON)
├── learning/         # Learning data and insights (JSON)
├── agents/          # Agent status files
├── metrics/         # Collected metrics data
└── README.md        # This file
```

## 🚀 Quick Start

### Run Once (Single Monitoring Cycle)
```bash
npm run monitor:agent
```

### Run Continuously (Every 5 minutes)
```bash
npm run monitor:agent:continuous
```

### Run with Verbose Logging
```bash
npm run monitor:agent:verbose
```

### Custom Interval (e.g., every 10 minutes)
```bash
node scripts/monitor-agent.mjs --interval=10
```

## 📊 Generated Reports

### Monitor Reports (`monitor/reports/`)

Generated every monitoring cycle, contains:

- **Project Health**: Overall status, health score, quality gates
- **Codebase Metrics**: Files, LOC, components, pages, API routes
- **Git Activity**: Branches, commits, recent changes, activity trends
- **Module Status**: All project modules with their health status
- **Agent Activity**: Background agent status and self-healing stats
- **Recommendations**: Prioritized action items
- **Trends**: Development velocity, quality trends

Example: `moeen-2025-11-01T01-15-37Z.json`

### Learning Data (`monitor/learning/`)

Generated alongside reports, contains:

- **Architecture Patterns**: Framework, patterns, best practices
- **Learned Insights**: Development practices, common issues, solutions
- **Module Insights**: High activity areas, stable modules, attention needed
- **Technical Debt**: Identified and addressed debt items
- **Performance Indicators**: Quality, velocity, collaboration metrics
- **Agent Recommendations**: Guidance for future agent actions
- **Knowledge Base**: Critical files, directories, patterns

Example: `moeen-2025-11-01T01-15-37Z.json`

## 🤖 Agent Status

The monitor agent maintains its status in:
- `/workspace/logs/agent-status.json`

Status includes:
- Current monitoring mode
- Last update timestamp
- Health score
- Next scheduled run

## 📈 Health Score Calculation

The health score (0-100) is calculated based on:

- ✅ **Code Quality**: Clean type checks, no lint errors
- ✅ **Git Hygiene**: Minimal uncommitted changes
- ✅ **Test Coverage**: Adequate test files
- ✅ **Recent Activity**: Active development (bonus points)

Score Interpretation:
- **90-100**: Excellent - Production ready
- **80-89**: Good - Minor improvements needed
- **60-79**: Fair - Attention required
- **0-59**: Needs Attention - Immediate action required

## 🔍 What Gets Monitored

### Code Metrics
- Total TypeScript files
- Lines of code
- Components count
- Pages count
- API routes count
- Test files count

### Git Activity
- Total branches
- Current branch
- Uncommitted changes
- Recent commits (last 7 days)
- Commit history and authors

### Module Health
- All 10 project modules
- Module status (active/inactive)
- Features per module
- API endpoints per module

### Agent Activity
- Background agent configuration
- Self-healing strategies
- Recent agent actions
- Auto-fix status

## 📋 Report Format

All reports are in JSON format with the following structure:

```json
{
  "project": { ... },
  "timestamp": "ISO-8601",
  "monitoring_cycle": 1,
  "project_health": {
    "overall_status": "healthy|fair|needs_attention",
    "health_score": 0-100,
    "quality_gates": { ... }
  },
  "codebase_metrics": { ... },
  "git_activity": { ... },
  "modules_status": { ... },
  "agent_activity": { ... },
  "recommendations": {
    "priority_high": [],
    "priority_medium": [],
    "priority_low": []
  }
}
```

## 🎯 Use Cases

### 1. Development Monitoring
Run continuously during development to track:
- Code changes and their impact
- Module health over time
- Development velocity trends

### 2. Pre-Deployment Checks
Run once before deployment to ensure:
- All quality gates pass
- No critical issues
- Health score is acceptable

### 3. CI/CD Integration
Integrate into CI/CD pipeline:
```bash
npm run monitor:agent --once
```

Check health score and fail if below threshold.

### 4. Learning System Feed
Use generated learning data to:
- Train AI agents on project patterns
- Improve future recommendations
- Build knowledge base

## 🔄 Monitoring Cycle

Each cycle performs:

1. **Collect Metrics**: Gather all project metrics
2. **Read Agent Config**: Load background agent configuration
3. **Analyze Modules**: Check all module health
4. **Generate Report**: Create comprehensive report
5. **Calculate Health Score**: Evaluate overall health
6. **Save Reports**: Store reports and learning data
7. **Update Status**: Update agent status file

Duration: ~5-10 seconds per cycle

## 🛠️ Configuration

Edit `scripts/monitor-agent.mjs` to customize:

```javascript
const CONFIG = {
  projectName: 'moeen',
  monitoringVersion: '2.0.0',
  interval: 5, // minutes
  verbose: false,
  runOnce: false,
};
```

## 📊 Dashboard Integration

Reports can be consumed by:

1. **Admin Dashboard**: Display real-time project health
2. **CI/CD Systems**: Automated quality checks
3. **Learning Systems**: Train AI agents
4. **Reporting Tools**: Generate insights and trends

## 🔐 Access Control

- Reports are stored locally (not committed to git)
- Add `monitor/` to `.gitignore` if sensitive
- Secure API endpoints that expose report data

## 🐛 Troubleshooting

### Script won't run
```bash
chmod +x /workspace/scripts/monitor-agent.mjs
node scripts/monitor-agent.mjs --once --verbose
```

### No metrics collected
Ensure you're in the project root directory and git is available.

### Reports not saving
Check write permissions on `monitor/` directory:
```bash
mkdir -p monitor/{reports,learning,agents,metrics}
```

## 📚 Related Documentation

- `/workspace/cursor_background_agent.json` - Agent configuration
- `/workspace/package.json` - Project scripts
- `/workspace/docs/` - Project documentation

## 🤝 Contributing

To improve the monitoring system:

1. Add new metrics in `collectMetrics()`
2. Enhance health score calculation
3. Add new report sections
4. Improve learning insights

## 📝 License

Same as project license (MIT)

---

**Monitor Agent v2.0.0** | Last Updated: 2025-11-01
