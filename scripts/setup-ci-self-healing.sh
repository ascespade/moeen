#!/bin/bash

# CI Self-Healing Setup Script
# Sets up the complete CI self-healing system with learning capabilities

set -e

echo "🚀 Setting up CI Self-Healing System with Learning Capabilities"
echo "=============================================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    print_error "package.json not found. Please run this script from the project root."
    exit 1
fi

print_status "Setting up CI Self-Healing System..."

# 1. Install required dependencies
print_status "Installing required dependencies..."
npm install sqlite3 js-yaml

# 2. Create necessary directories
print_status "Creating necessary directories..."
mkdir -p reports learning logs analysis dashboard

# 3. Initialize learning database
print_status "Initializing learning database..."
node scripts/ci-learning-db.js init

# 4. Validate workflows
print_status "Validating GitHub Actions workflows..."
if node scripts/validate-workflows.js; then
    print_success "All workflows are valid"
else
    print_warning "Some workflows have issues - check the report"
fi

# 5. Test workflows (if act is available)
print_status "Testing workflows..."
if command -v act &> /dev/null; then
    if node scripts/test-workflows.js all; then
        print_success "All workflow tests passed"
    else
        print_warning "Some workflow tests failed - check the report"
    fi
else
    print_warning "act not available - install with: https://github.com/nektos/act"
fi

# 6. Set up environment variables
print_status "Setting up environment variables..."
if [ ! -f ".env" ]; then
    cat > .env << EOF
# CI Self-Healing Configuration
CURSOR_API_KEY=your_cursor_api_key_here
CI_LEARNING_DB_PATH=ci_memory.sqlite
CI_MAX_RETRIES=3
CI_CONFIDENCE_THRESHOLD=0.7
EOF
    print_warning "Created .env file - please update CURSOR_API_KEY"
else
    print_success ".env file already exists"
fi

# 7. Create GitHub secrets documentation
print_status "Creating GitHub secrets documentation..."
cat > docs/github-secrets.md << 'EOF'
# GitHub Secrets Required for CI Self-Healing

## Required Secrets

### CURSOR_API_KEY
- **Description**: API key for Cursor Background Agent integration
- **Required**: Yes (for advanced AI-powered fixes)
- **Format**: String
- **How to get**: Contact Cursor support or use local learning mode

## Optional Secrets

### GITHUB_TOKEN
- **Description**: GitHub token for repository access
- **Required**: No (uses default GITHUB_TOKEN)
- **Format**: String
- **Default**: Automatically provided by GitHub Actions

## Setting Secrets

1. Go to your repository on GitHub
2. Click on "Settings" tab
3. Click on "Secrets and variables" → "Actions"
4. Click "New repository secret"
5. Add each secret with the appropriate value

## Local Development

For local development, create a `.env` file in the project root:

```bash
CURSOR_API_KEY=your_api_key_here
CI_LEARNING_DB_PATH=ci_memory.sqlite
CI_MAX_RETRIES=3
CI_CONFIDENCE_THRESHOLD=0.7
```
EOF

print_success "Created GitHub secrets documentation"

# 8. Create usage documentation
print_status "Creating usage documentation..."
cat > docs/ci-self-healing-usage.md << 'EOF'
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
EOF

print_success "Created usage documentation"

# 9. Create a quick start guide
print_status "Creating quick start guide..."
cat > QUICK_START.md << 'EOF'
# CI Self-Healing System - Quick Start

## 🚀 Quick Setup

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Initialize the system**:
   ```bash
   ./scripts/setup-ci-self-healing.sh
   ```

3. **Set up GitHub secrets** (optional):
   - Go to repository Settings → Secrets and variables → Actions
   - Add `CURSOR_API_KEY` if you have one

4. **Test the system**:
   ```bash
   npm run ci:test
   ```

## 🧪 Test Commands

```bash
# Validate workflows
npm run ci:validate

# Test workflows
npm run ci:test

# Generate learning report
npm run ci:learn

# Fix workflow issues
npm run ci:heal
```

## 📊 Monitor Progress

- Check `reports/` directory for detailed reports
- View `dashboard/logs.json` for real-time status
- Run `npm run ci:learn` for learning insights

## 🔧 Manual Triggers

You can manually trigger workflows:
1. Go to Actions tab in GitHub
2. Select "Ultimate CI Self-Healing Agent"
3. Click "Run workflow"
4. Choose parameters and run

## 📚 Learn More

- [Usage Guide](docs/ci-self-healing-usage.md)
- [GitHub Secrets](docs/github-secrets.md)
- [API Documentation](docs/api-documentation.md)

## 🆘 Need Help?

1. Check the reports in `reports/` directory
2. Review workflow validation results
3. Check GitHub Actions logs
4. Run `npm run ci:learn` for system insights
EOF

print_success "Created quick start guide"

# 10. Final validation
print_status "Running final validation..."

# Check if all required files exist
required_files=(
    "scripts/ci-learning-db.js"
    "scripts/ci-self-healing-manager.js"
    "scripts/cursor-agent-integration.js"
    "scripts/validate-workflows.js"
    "scripts/test-workflows.js"
    ".github/workflows/ultimate-ci-self-healing.yml"
    ".github/workflows/ci-assistant.yml"
)

missing_files=()
for file in "${required_files[@]}"; do
    if [ ! -f "$file" ]; then
        missing_files+=("$file")
    fi
done

if [ ${#missing_files[@]} -eq 0 ]; then
    print_success "All required files are present"
else
    print_error "Missing required files:"
    for file in "${missing_files[@]}"; do
        echo "  - $file"
    done
    exit 1
fi

# Check if learning database was created
if [ -f "ci_memory.sqlite" ]; then
    print_success "Learning database created successfully"
else
    print_warning "Learning database not created - run 'node scripts/ci-learning-db.js init'"
fi

print_success "CI Self-Healing System setup completed!"
print_status "Next steps:"
echo "  1. Review the documentation in docs/"
echo "  2. Set up GitHub secrets if needed"
echo "  3. Test the system with: npm run ci:test"
echo "  4. Monitor the first run in GitHub Actions"
echo ""
print_status "Happy self-healing! 🤖✨"