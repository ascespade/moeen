# CI Self-Healing System Usage Guide

## Overview

The CI Self-Healing System automatically detects, analyzes, and fixes common CI/CD workflow issues using machine learning and AI integration.

## Features

- **Automatic Error Detection**: Identifies workflow failures and errors
- **Intelligent Analysis**: Uses pattern recognition to understand error types
- **Self-Learning**: Builds knowledge base from past errors and fixes
- **AI Integration**: Uses Cursor Background Agent for advanced fixes
- **Performance Optimization**: Continuously improves workflow performance

## Workflows

### 1. Ultimate CI Self-Healing Agent

- **File**: `.github/workflows/ultimate-ci-self-healing.yml`
- **Triggers**: Push, PR, Schedule (every 2 hours), Manual dispatch
- **Purpose**: Main self-healing workflow that runs tests and fixes issues

### 2. CI Assistant Error Resolver

- **File**: `.github/workflows/ci-assistant.yml`
- **Triggers**: When Ultimate CI Self-Healing Agent fails
- **Purpose**: Specialized error resolver for workflow-specific issues

## Commands

### NPM Scripts

```bash
# Generate learning report
npm run ci:learn

# Fix workflow issues
npm run ci:heal

# Validate workflows
npm run ci:validate

# Test workflows
npm run ci:test
```

### Direct Script Usage

```bash
# Initialize learning database
node scripts/ci-learning-db.js init

# Generate learning report
node scripts/ci-learning-db.js report

# Analyze workflow error
node scripts/ci-self-healing-manager.js analyze <workflow> <error>

# Fix workflow error
node scripts/ci-self-healing-manager.js fix <workflow> <error>

# Validate all workflows
node scripts/validate-workflows.js

# Test all workflows
node scripts/test-workflows.js comprehensive
```

## Learning Database

The system uses SQLite to store:

- Error patterns and solutions
- Performance metrics
- Learning insights
- Fix history

Database file: `ci_memory.sqlite`

## Configuration

### Environment Variables

- `CURSOR_API_KEY`: API key for Cursor Background Agent
- `CI_LEARNING_DB_PATH`: Path to learning database
- `CI_MAX_RETRIES`: Maximum retry attempts
- `CI_CONFIDENCE_THRESHOLD`: Minimum confidence for auto-fixes

### Workflow Parameters

- `mode`: auto, first-run, incremental, emergency, maintenance, cleanup, full-test, rapid-commits
- `scope`: full, frontend, backend, database, tests, security, performance
- `force-full-test`: true/false

## Monitoring

### Reports

- Workflow validation reports: `reports/workflow-validation-report.json`
- Test reports: `reports/workflow-test-report.json`
- Learning reports: `reports/ci-learning-report.json`

### Dashboard

- Real-time status: `dashboard/logs.json`
- Performance metrics: `dashboard/metrics.json`

## Troubleshooting

### Common Issues

1. **Workflow syntax errors**
   - Run: `npm run ci:validate`
   - Check YAML indentation and structure

2. **Learning database issues**
   - Run: `node scripts/ci-learning-db.js init`
   - Check file permissions

3. **Cursor Agent connection issues**
   - Verify `CURSOR_API_KEY` is set correctly
   - Check network connectivity

4. **Test failures**
   - Run: `npm run ci:test`
   - Check workflow dependencies

### Debug Mode

Enable debug logging by setting:

```bash
export CI_DEBUG=true
```

## Best Practices

1. **Regular Monitoring**: Check reports regularly for insights
2. **Incremental Learning**: Let the system learn from each run
3. **Manual Review**: Review auto-fixes before deployment
4. **Performance Tracking**: Monitor performance metrics
5. **Error Prevention**: Use insights to prevent recurring issues

## Support

For issues or questions:

1. Check the reports in `reports/` directory
2. Review the learning database insights
3. Check GitHub Actions logs
4. Review workflow validation results
