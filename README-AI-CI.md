# AI Intelligent CI — Quick Start (Local SQLite)

This package provides a complete AI-driven incremental testing and self-healing CI system,
designed to run with Cursor Background Agents or within GitHub Actions. This ZIP is the
**SQLite-local** variant (ai_logs.db kept in repo workspace).

## Contents
- ai_agent_config.json         : Agent configuration
- ai_training_cache.json      : Learning cache example
- package.json                : dev deps and scripts
- scripts/                    : orchestrator and helpers
- tests/                      : test folders (generated/regression/base)
- dashboard/                  : static dashboard files (reads logs.json)
- .github/workflows/          : GitHub Actions workflows
- cursor.agent.json           : Cursor agent configuration

## Quick local run (recommended for testing)
1. Install dependencies:
   ```bash
   npm ci
   npx playwright install
   ```
2. Run the orchestrator locally (will create/append ai_logs.db and dashboard/logs.json):
   ```bash
   node scripts/ai_self_test_and_fix.mjs
   ```
3. Start dashboard to view results:
   ```bash
   npm run start-dashboard
   # then open http://localhost:3333 (or open dashboard/index.html for static view)
   ```

## GitHub Actions
- `ai-self-healing.yml` runs the orchestrator on push/PR.
- `update-dashboard.yml` exports sqlite logs to dashboard/logs.json and pushes to gh-pages.

## Security notes
- This bundle intentionally **does not include** any Supabase service keys. Keep any production service keys
  in GitHub Secrets or Cursor encrypted environment variables.
- For local testing you can run without secrets; for Cursor integration add the secrets in the agent settings.

## Next steps
- Configure Cursor Agent and GitHub Secrets as described in the included files.
- Review and adapt the LLM prompts in `scripts/ai_scenario_generator.mjs` to your domain.
- If you want Supabase-backed storage instead of local SQLite, contact me to switch the exporter.
