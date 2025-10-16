# Multi-Agent Cleanup System Documentation

## Overview

The Multi-Agent Cleanup System is a comprehensive solution for automatically identifying and safely quarantining unused files across your Next.js 14 healthcare management system. The system consists of three specialized agents that work together to maintain a clean, optimized codebase.

## System Architecture

### 🤖 Agents

1. **FrontendCleaner** - Analyzes React/Next.js frontend files
2. **BackendCleaner** - Analyzes API routes, server functions, and database schemas
3. **SharedVerifier** - Analyzes shared utilities, types, and common modules

### 🏗️ Infrastructure

- **Shared Quarantine Directory**: `src/.shared_quarantine/`
- **File-based Locking**: Prevents concurrent agent conflicts
- **Usage Map**: Tracks file references across agents
- **Rollback System**: Complete restoration capability
- **Unified Reporting**: Comprehensive logs and statistics

## Quick Start

### Installation

The system is already integrated into your project. No additional installation required.

### Basic Usage

```bash
# Dry run (recommended first)
npm run cleanup:dry-run

# Execute cleanup
npm run cleanup:all

# Run specific agents
npm run agent:frontend-clean
npm run agent:backend-clean
npm run agent:frontend-clean:execute
```

## Detailed Usage

### FrontendCleaner Agent

Analyzes and cleans unused frontend files (React components, hooks, styles).

```bash
# Dry run with verbose output
npm run agent:frontend-clean

# Execute quarantine
npm run agent:frontend-clean:execute

# Rollback specific session
node scripts/agents/rollback-frontend.js <timestamp>
```

**Scope**: `src/app/`, `src/components/`, `src/hooks/`, `src/styles/`

**Protected Files**:

- Next.js App Router files (`page.tsx`, `layout.tsx`, etc.)
- Test files (`*.test.*`, `*.spec.*`)
- Type definitions (`*.d.ts`)
- Config files (`middleware.ts`, `instrumentation.ts`)

### BackendCleaner Agent

Analyzes and cleans unused backend files (API routes, server functions, database schemas).

```bash
# Dry run with verbose output
npm run agent:backend-clean

# Force execution (bypasses grace period)
npm run agent:backend-clean:force

# Rollback specific session
tsx src/scripts/agents/rollback-backend.ts <timestamp>
```

**Scope**: `src/app/api/`, `src/lib/`, `src/middleware/`, `src/types/`, `src/utils/`, `src/config/`, `src/constants/`, `supabase/`, `migrations/`

**Protected Files**:

- API routes (`/api/**/route.ts`)
- Middleware files (`middleware.ts`)
- Database files (`supabase/**`, `migrations/**`)
- Config files (`config.ts`, `constants.ts`)

### SharedVerifier Agent

Analyzes and cleans unused shared utilities, types, and common modules.

```bash
# Dry run with verbose output
node scripts/agents/shared-verifier.js --dry-run --verbose

# Execute quarantine
node scripts/agents/shared-verifier.js --verbose

# Rollback specific session
node scripts/agents/rollback-shared.js <timestamp>
```

**Scope**: `src/types/`, `src/utils/`, `src/constants/`, `src/config/`, `src/lib/`, `src/hooks/`, `src/context/`, `src/core/`

**Protected Files**:

- Type definitions (`*.d.ts`)
- Index files (`index.ts`)
- Context providers (`context/**Provider.tsx`)
- Core modules (`core/**`)

### Multi-Agent Coordinator

Coordinates all three agents with proper sequencing and unified reporting.

```bash
# Dry run (sequential execution)
npm run cleanup:dry-run

# Execute cleanup (sequential)
npm run cleanup:all

# Parallel execution
node scripts/agents/run-cleanup-agents.js --parallel

# Run specific agents only
node scripts/agents/run-cleanup-agents.js --frontend-only
node scripts/agents/run-cleanup-agents.js --backend-only
node scripts/agents/run-cleanup-agents.js --shared-only
```

## Safety Features

### 🛡️ Protection Mechanisms

1. **Grace Period**: 7-day protection for recently modified files
2. **Protected Patterns**: Critical files are never quarantined
3. **Agent Coordination**: File-based locking prevents conflicts
4. **Rollback Support**: Complete restoration with integrity verification
5. **Conservative Detection**: Only moves truly unused files

### 🔍 Detection Algorithm

Each agent follows a 7-step process:

1. **Build Import Graph** - Static analysis of file dependencies
2. **Detect Unused Files** - Graph traversal from entry points
3. **Verify by Search** - Project-wide text search for dynamic imports
4. **Run Safety Checks** - Grace period, critical patterns, agent conflicts
5. **Quarantine Move** - Atomic file moves with metadata
6. **Generate Report** - Detailed JSON reports
7. **Update Usage Map** - Multi-agent coordination

## File Structure

```
src/.shared_quarantine/
├── frontend/
│   └── <ISO_TIMESTAMP>/
│       ├── app/...
│       ├── components/...
│       ├── hooks/...
│       └── styles/...
├── backend/
│   └── <ISO_TIMESTAMP>/
│       ├── api/...
│       ├── lib/...
│       └── utils/...
├── shared/
│   └── <ISO_TIMESTAMP>/
│       ├── types/...
│       ├── utils/...
│       └── constants/...
├── .lock
├── cleanup-log.json
├── usage-map.json
└── rollback-commands.json

logs/
├── frontend_cleanup.log
├── backend_cleanup.log
├── shared_cleanup.log
└── multi_agent_cleanup.log
```

## Reports and Logs

### Individual Agent Reports

Each agent generates detailed reports in `logs/`:

- `frontend_cleanup.log` - FrontendCleaner results
- `backend_cleanup.log` - BackendCleaner results
- `shared_cleanup.log` - SharedVerifier results

### Unified Report

The coordinator generates a comprehensive report:

- `multi_agent_cleanup.log` - Complete system results

### Report Structure

```json
{
  "agent": "AgentName",
  "timestamp": "2025-10-16T10:30:45Z",
  "mode": "dry-run|execute",
  "results": {
    "totalScanned": 240,
    "candidates": [],
    "moved": [],
    "skipped": [],
    "conflicts": [],
    "warnings": [],
    "timeTaken": 1500
  }
}
```

## Rollback System

### List Available Sessions

```bash
# Frontend rollback sessions
node scripts/agents/rollback-frontend.js --list

# Backend rollback sessions
tsx src/scripts/agents/rollback-backend.ts --list

# Shared rollback sessions
node scripts/agents/rollback-shared.js --list
```

### Restore Files

```bash
# Restore specific session
node scripts/agents/rollback-frontend.js 2025-10-16T10-30-45-123Z
tsx src/scripts/agents/rollback-backend.ts 2025-10-16T10-30-45-123Z
node scripts/agents/rollback-shared.js 2025-10-16T10-30-45-123Z
```

### Rollback Features

- **Integrity Verification**: SHA-256 hash checking
- **Atomic Restoration**: Safe file replacement
- **Backup Creation**: Existing files backed up before restoration
- **Directory Cleanup**: Automatic cleanup of empty quarantine directories

## Configuration

### Environment Variables

No environment variables required. The system uses project-relative paths.

### Customization

You can customize agent behavior by modifying the scope directories in each agent:

```javascript
// FrontendCleaner
this.scopeDirs = ["src/app", "src/components", "src/hooks", "src/styles"];

// BackendCleaner
this.scopeDirs = [
  "src/app/api",
  "src/lib",
  "src/middleware",
  "src/types",
  "src/utils",
  "src/config",
  "src/constants",
  "supabase",
  "migrations",
];

// SharedVerifier
this.scopeDirs = [
  "src/types",
  "src/utils",
  "src/constants",
  "src/config",
  "src/lib",
  "src/hooks",
  "src/context",
  "src/core",
];
```

## Troubleshooting

### Common Issues

1. **Permission Errors**: Ensure write permissions to `src/.shared_quarantine/`
2. **Lock Conflicts**: Wait for other agents to complete or manually remove `.lock` file
3. **Import Errors**: Check file paths in agent scripts
4. **Rollback Failures**: Verify quarantine directory exists and contains metadata files

### Debug Mode

Run agents with verbose output for detailed debugging:

```bash
npm run agent:frontend-clean -- --verbose
npm run agent:backend-clean -- --verbose
node scripts/agents/shared-verifier.js --verbose
```

### Manual Cleanup

If needed, you can manually clean up quarantine directories:

```bash
# Remove specific session
rm -rf src/.shared_quarantine/frontend/2025-10-16T10-30-45-123Z

# Remove all quarantine data (CAUTION!)
rm -rf src/.shared_quarantine/*
```

## Best Practices

### 1. Always Start with Dry Run

```bash
npm run cleanup:dry-run
```

### 2. Review Reports Before Execution

Check the generated reports in `logs/` directory before running actual cleanup.

### 3. Use Grace Period

The 7-day grace period protects recently modified files. Only use `--force` when necessary.

### 4. Regular Maintenance

Run the system regularly to keep your codebase clean:

```bash
# Weekly cleanup
npm run cleanup:all

# Monthly deep clean
npm run cleanup:all -- --force
```

### 5. Backup Before Major Cleanup

Before running major cleanup operations, ensure you have a git commit or backup.

## Performance

### Typical Performance

- **FrontendCleaner**: ~2 seconds for 240 files
- **BackendCleaner**: ~0.7 seconds for 93 files
- **SharedVerifier**: ~0.5 seconds for 54 files
- **Total System**: ~3-4 seconds for complete analysis

### Optimization Tips

1. **Parallel Execution**: Use `--parallel` flag for faster execution
2. **Selective Agents**: Run only needed agents with `--frontend-only`, etc.
3. **Regular Runs**: Frequent small cleanups are faster than infrequent large ones

## Contributing

### Adding New Agents

1. Create agent script in `scripts/agents/`
2. Add rollback utility
3. Update coordinator in `run-cleanup-agents.js`
4. Add npm scripts to `package.json`

### Modifying Detection Logic

Each agent's detection logic can be customized by modifying the `checkFileUsage()` method.

## Support

For issues or questions:

1. Check the logs in `logs/` directory
2. Run with `--verbose` flag for detailed output
3. Review the rollback commands in `src/.shared_quarantine/rollback-commands.json`

## License

This system is part of the healthcare management system project and follows the same license terms.
