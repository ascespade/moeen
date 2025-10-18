# Ultimate E2E Self-Healing Runner

A comprehensive autonomous pipeline that generates exhaustive Playwright+Supawright scenarios, runs them, fixes code/DB until all tests pass, and produces final 0/0 errors+warnings report.

## 🚀 Features

- **Autonomous Test Generation**: Automatically generates comprehensive Playwright and Supawright tests for all modules
- **Self-Healing**: Automatically applies fixes for code quality, database issues, and test failures
- **Comprehensive Reporting**: Generates detailed reports in multiple formats (JSON, Markdown, HTML, CSV, JUnit XML)
- **PR Management**: Automatically creates pull requests with fixes and improvements
- **Database Integration**: Works with Supabase for database testing and fixes
- **AI-Powered**: Uses OpenAI/Cursor LLM for intelligent test generation and fixes

## 📋 Requirements

### Environment Variables
```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
OPENAI_API_KEY=your_openai_api_key  # or CURSOR_API_KEY
GITHUB_TOKEN=your_github_token  # optional, for PR creation
```

### System Requirements
- Node.js 18+
- npm
- Git
- Playwright browsers (installed automatically)

## 🛠️ Installation

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Install Playwright browsers**:
   ```bash
   npx playwright install
   ```

3. **Set up environment variables**:
   ```bash
   cp env.example .env
   # Edit .env with your actual values
   ```

## 🚀 Usage

### Quick Start
```bash
./run_e2e_healer.sh
```

### Manual Execution
```bash
# Run the main orchestrator
node scripts/ai_orchestrator.mjs

# Or run individual components
node scripts/ai_test_generator.mjs      # Generate tests
node scripts/ai_automated_fixer.mjs     # Apply fixes
node scripts/ai_report_generator.mjs    # Generate reports
node scripts/ai_pr_manager.mjs          # Manage PRs
```

### NPM Scripts
```bash
npm run self-heal          # Run the complete E2E healer
npm run generate-tests     # Generate test scenarios
npm run apply-fixes        # Apply automated fixes
npm run generate-reports   # Generate comprehensive reports
```

## 📁 Project Structure

```
├── scripts/
│   ├── ai_orchestrator.mjs        # Main orchestrator
│   ├── ai_full_e2e_healer.mjs     # Core E2E healer
│   ├── ai_test_generator.mjs      # Test generation
│   ├── ai_automated_fixer.mjs     # Automated fixes
│   ├── ai_report_generator.mjs    # Report generation
│   └── ai_pr_manager.mjs          # PR management
├── tests/
│   ├── generated/
│   │   ├── playwright/            # Generated Playwright tests
│   │   ├── supawright/           # Generated Supawright tests
│   │   ├── integration/          # Integration tests
│   │   └── edge-cases/           # Edge case tests
│   ├── base/                     # Base test templates
│   └── regression/               # Regression tests
├── reports/
│   ├── ai_validation_report.json # Main JSON report
│   ├── final_summary.md          # Markdown summary
│   ├── execution.log             # Execution log
│   ├── test-report.html          # HTML report
│   ├── test-results.csv          # CSV export
│   ├── test-results.xml          # JUnit XML
│   └── backups/                  # Backup files
├── dashboard/
│   └── logs/
│       └── logs.json             # Dashboard logs
└── ci_memory.sqlite              # Memory database
```

## 🔧 Configuration

### Main Configuration
The system can be configured by modifying the `CONFIG` object in `scripts/ai_orchestrator.mjs`:

```javascript
const CONFIG = {
  runId: `run-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
  maxRetries: 3,
  retryDelay: 5000, // 5 seconds
  timeout: 300000,  // 5 minutes
  logLevel: 'info'
};
```

### Test Generation
Configure test generation in `scripts/ai_test_generator.mjs`:
- Module detection patterns
- Test template customization
- Coverage requirements

### Automated Fixes
Configure fixes in `scripts/ai_automated_fixer.mjs`:
- ESLint rules
- Prettier configuration
- Database fix patterns
- TypeScript fixes

## 📊 Reports

The system generates comprehensive reports in multiple formats:

### JSON Report (`reports/ai_validation_report.json`)
```json
{
  "runId": "run-1234567890-abc123",
  "summary": {
    "totalTests": 150,
    "passedTests": 145,
    "failedTests": 5,
    "totalErrors": 2,
    "totalWarnings": 3,
    "overallStatus": "ISSUES"
  },
  "testResults": [...],
  "errors": [...],
  "warnings": [...],
  "fixes": [...],
  "recommendations": [...]
}
```

### HTML Report (`reports/test-report.html`)
- Interactive dashboard
- Visual test results
- Error and warning details
- Fix history

### Markdown Summary (`reports/final_summary.md`)
- Human-readable summary
- Test results overview
- Recommendations
- System information

## 🔄 Workflow

1. **Initialization**: Check environment, create directories, initialize logging
2. **Test Generation**: Generate comprehensive Playwright and Supawright tests
3. **Automated Fixes**: Apply ESLint, Prettier, TypeScript, and database fixes
4. **Test Execution**: Run all generated tests
5. **Report Generation**: Create comprehensive reports in multiple formats
6. **PR Creation**: Create pull request with fixes (if changes detected)
7. **Final Summary**: Display results and exit with appropriate status

## 🛡️ Safety Features

- **Backup System**: Creates backups before making changes
- **Rollback Support**: Can revert changes if needed
- **Retry Logic**: Retries failed operations with exponential backoff
- **Error Handling**: Comprehensive error handling and logging
- **Graceful Shutdown**: Handles SIGINT and SIGTERM signals

## 🔍 Monitoring

### Execution Log
All activities are logged to `reports/execution.log`:
```json
{
  "timestamp": "2024-01-01T00:00:00.000Z",
  "level": "info",
  "message": "Test generation started",
  "runId": "run-1234567890-abc123"
}
```

### Dashboard
View real-time status at `dashboard/index.html` (if served):
```bash
npm run dashboard
```

### Memory Database
SQLite database (`ci_memory.sqlite`) tracks:
- Test run history
- Fix applications
- Performance metrics
- Error patterns

## 🚨 Troubleshooting

### Common Issues

1. **Playwright browsers not installed**:
   ```bash
   npx playwright install
   ```

2. **Missing environment variables**:
   ```bash
   export NEXT_PUBLIC_SUPABASE_URL=your_url
   export SUPABASE_SERVICE_ROLE_KEY=your_key
   ```

3. **Git not configured**:
   ```bash
   git config --global user.name "ai-bot"
   git config --global user.email "ai-bot@users.noreply.github.com"
   ```

4. **Permission issues**:
   ```bash
   chmod +x scripts/*.mjs
   chmod +x run_e2e_healer.sh
   ```

### Debug Mode
Run with debug logging:
```bash
DEBUG=true node scripts/ai_orchestrator.mjs
```

### Verbose Output
Enable verbose output:
```bash
VERBOSE=true node scripts/ai_orchestrator.mjs
```

## 📈 Performance

- **Parallel Execution**: Tests run in parallel (up to 4 workers)
- **Incremental Testing**: Only runs tests for changed modules
- **Caching**: Caches test results and fixes
- **Memory Management**: Efficient memory usage with cleanup

## 🔒 Security

- **Environment Isolation**: Uses separate schemas for database testing
- **Safe Fixes**: Only applies safe, reversible fixes
- **Audit Trail**: Complete audit trail of all changes
- **Rollback Support**: Can revert any applied changes

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details

## 🆘 Support

For issues and questions:
1. Check the troubleshooting section
2. Review the execution logs
3. Check the generated reports
4. Create an issue with detailed information

---

**Generated by Ultimate E2E Self-Healing Runner**
*Making testing autonomous and self-healing*