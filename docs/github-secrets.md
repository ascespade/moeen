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
