# 🧠 Smart Git Integration & Optimization Agent

An autonomous background agent that intelligently merges all Git branches, resolves conflicts, optimizes the codebase, and produces a unified, stable version automatically every 6 hours.

## 🚀 Features

- **Smart Branch Merging**: Automatically identifies and merges all unmerged branches
- **Intelligent Conflict Resolution**: Uses smart rules to resolve merge conflicts automatically
- **Code Optimization**: Runs static analysis, removes dead code, and optimizes performance
- **Comprehensive Logging**: Detailed logs with rotation and multiple log levels
- **Automated Testing**: Runs tests and validates the merged code
- **Markdown Reports**: Generates detailed reports of all operations
- **Safety Features**: Backup creation, conflict limits, and dry-run capabilities

## 📁 Files Structure

```
/workspace/
├── smart-git-agent.js          # Main agent script
├── smart-git-scheduler.sh      # Scheduler and service management
├── smart-git-config.json       # Configuration file
├── install-cron.sh             # Cron job installer
├── SMART_GIT_AGENT_README.md   # This documentation
└── logs/                       # Log files directory
    ├── auto_merge.log          # Main agent logs
    ├── scheduler.log           # Scheduler logs
    └── cron.log                # Cron execution logs
```

## 🛠️ Installation

### Option 1: Cron Job (Recommended)

```bash
# Install as cron job (runs every 6 hours)
./install-cron.sh

# Test the agent immediately
./smart-git-scheduler.sh run
```

### Option 2: Systemd Service (Linux)

```bash
# Install as systemd service
sudo ./smart-git-scheduler.sh install

# Start the service
sudo systemctl start smart-git-agent

# Enable auto-start on boot
sudo systemctl enable smart-git-agent

# Check status
sudo systemctl status smart-git-agent
```

### Option 3: Manual Execution

```bash
# Run once
./smart-git-scheduler.sh run

# Run in background
./smart-git-scheduler.sh start

# Stop background process
./smart-git-scheduler.sh stop
```

## ⚙️ Configuration

Edit `smart-git-config.json` to customize:

- **Schedule**: Change the 6-hour interval
- **Git Settings**: Configure branch names and merge strategies
- **Optimization Tasks**: Enable/disable specific optimizations
- **Safety Settings**: Configure backup and conflict limits
- **Logging**: Adjust log levels and rotation

## 🔧 Usage

### Basic Commands

```bash
# Run agent once
./smart-git-scheduler.sh run

# Start agent in background
./smart-git-scheduler.sh start

# Stop running agent
./smart-git-scheduler.sh stop

# Check agent status
./smart-git-scheduler.sh status

# Run health check
./smart-git-scheduler.sh health
```

### Service Management (Systemd)

```bash
# Start service
sudo systemctl start smart-git-agent

# Stop service
sudo systemctl stop smart-git-agent

# Restart service
sudo systemctl restart smart-git-agent

# View logs
sudo journalctl -u smart-git-agent -f

# Check status
sudo systemctl status smart-git-agent
```

## 📊 How It Works

### 1. Branch Analysis

- Fetches all remote branches
- Identifies branches with unmerged commits
- Excludes protected branches (main, develop, etc.)

### 2. Smart Merging

- Creates temporary `auto-merge-main` branch
- Attempts to merge each unmerged branch
- Uses intelligent conflict resolution rules:
  - Prefer newer logic unless breaking
  - Preserve documentation and comments
  - Keep import statements from both sides
  - Prefer main branch for critical files

### 3. Code Optimization

- Runs static analysis and fixes syntax issues
- Removes unused imports and dead code
- Updates dependencies and fixes vulnerabilities
- Formats code consistently
- Performs TypeScript type checking

### 4. Testing & Validation

- Runs all available test suites
- Validates the merged code
- Reports test results

### 5. Final Branch Creation

- Creates `final-optimized-version` branch
- Pushes to remote repository
- Generates comprehensive report

## 📝 Conflict Resolution Rules

The agent uses smart rules to resolve merge conflicts:

1. **Prefer newer logic** unless it contains breaking changes
2. **Preserve documentation** and comments from both sides
3. **Keep import statements** when possible
4. **Prefer main branch** for critical files (package.json, config files)
5. **Add TODO markers** for uncertain cases

## 📈 Reports

The agent generates detailed Markdown reports in `reports/smart-integration-report.md`:

- Summary of merged branches
- Number of conflicts resolved
- Optimizations applied
- Build/test status
- Next steps and recommendations

## 🔍 Logging

Comprehensive logging with multiple levels:

- **INFO**: General operations and progress
- **WARN**: Non-critical issues and warnings
- **ERROR**: Failures and critical issues
- **SUCCESS**: Successful operations

Log files are automatically rotated to prevent disk space issues.

## 🛡️ Safety Features

- **Backup Creation**: Creates backups before major operations
- **Conflict Limits**: Skips branches with too many conflicts
- **Dry Run Mode**: Test mode without making changes
- **Human Review**: Optional human review for critical merges
- **Lock Files**: Prevents multiple instances from running

## 🚨 Troubleshooting

### Common Issues

1. **Agent won't start**

   ```bash
   # Check if already running
   ./smart-git-scheduler.sh status

   # Check logs
   tail -f logs/scheduler.log
   ```

2. **Merge conflicts too complex**
   - Check `smart-git-config.json` for conflict limits
   - Review logs for specific conflict details
   - Consider manual resolution for complex cases

3. **Tests failing**
   - Check test logs in the main agent log
   - Verify test dependencies are installed
   - Review test configuration

4. **Disk space issues**
   - Check log rotation settings
   - Clean up old log files
   - Increase available disk space

### Debug Mode

```bash
# Run with verbose logging
LOG_LEVEL=debug ./smart-git-scheduler.sh run

# Check specific log files
tail -f logs/auto_merge.log
tail -f logs/scheduler.log
```

## 🔄 Uninstallation

### Remove Cron Job

```bash
crontab -e
# Delete the line containing "smart-git-scheduler"
```

### Remove Systemd Service

```bash
sudo ./smart-git-scheduler.sh uninstall
```

### Clean Up Files

```bash
rm -f smart-git-agent.js
rm -f smart-git-scheduler.sh
rm -f smart-git-config.json
rm -f install-cron.sh
rm -rf logs/
rm -rf reports/
```

## 📋 Requirements

- Node.js (for running the agent script)
- Git (for repository operations)
- npm/yarn (for dependency management)
- Linux/Unix system (for cron/systemd)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For issues and questions:

1. Check the logs first
2. Review this documentation
3. Check the configuration file
4. Create an issue with detailed information

---

_Generated by Smart Git Integration Agent v1.0.0_
