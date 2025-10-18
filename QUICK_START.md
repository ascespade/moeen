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
