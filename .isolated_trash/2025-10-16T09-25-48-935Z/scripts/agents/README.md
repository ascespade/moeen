# Cleanup Agents System

A comprehensive multi-agent cleanup system for identifying and safely removing unused files from the codebase.

## Overview

This system consists of three coordinated agents that work together to identify unused files across different parts of the codebase:

1. **FrontendCleaner** - Scans React components, hooks, contexts, and pages
2. **BackendCleaner** - Scans utility functions, middleware, and API routes
3. **SharedVerifier** - Validates findings, checks asset references, and coordinates the cleanup

## Quick Start

```bash
# Run all agents in sequence
npm run cleanup:all

# Run individual agents
npm run cleanup:frontend
npm run cleanup:backend
npm run cleanup:shared

# Dry run (test without moving files)
npm run cleanup:dry-run
```

## Architecture

### Shared Infrastructure

- **Quarantine Location**: `src/.shared_quarantine/`
  - `frontend/` - Frontend agent findings
  - `backend/` - Backend agent findings
  - `shared/` - Shared resources (utils, assets)
  - `.lock` - File-based coordination lock
  - `cleanup-log.json` - Global action log
  - `usage-map.json` - Cross-agent reference map

### Agent Coordination

- File-based locking prevents conflicts
- Unified logging with timestamps and file hashes
- Static dependency analysis via AST parsing
- Rollback commands per session
- Naming convention enforcement

## Configuration

Edit `config/shared-verifier-config.json` to customize:

- Agent scope and file types
- Safety settings (dry run, confirmations)
- Naming conventions
- Exclusions and patterns
- Performance settings

## Safety Features

- **Dry Run Mode**: Test without moving files
- **Rollback Support**: Generated script to restore moved files
- **File Hashing**: Verify integrity before/after moves
- **Lock Coordination**: Prevent concurrent agent conflicts
- **Needs Review**: Manual approval for uncertain cases
- **Backup Creation**: Optional snapshot before cleanup

## Output Files

- `logs/cleanup-agents.log` - Detailed execution log
- `logs/final-cleanup-report-<session>.json` - Summary report
- `logs/rollback-<session>.sh` - Rollback script
- `src/.shared_quarantine/assets-snapshot.json` - Asset reference snapshot

## Usage Examples

### Basic Cleanup

```bash
# Run complete cleanup
npm run cleanup:all
```

### Individual Agent Testing

```bash
# Test frontend cleanup only
npm run cleanup:frontend

# Test backend cleanup only
npm run cleanup:backend

# Verify shared resources
npm run cleanup:shared
```

### Rollback

```bash
# Execute rollback script
bash logs/rollback-<session-id>.sh
```

## File Naming Enforcement

The system enforces consistent naming conventions:

- **Files**: `kebab-case.tsx` (e.g., `user-dashboard.tsx`)
- **Directories**: `lowercase` (e.g., `components`, `hooks`)
- **React Components**: `UpperCamelCase` (e.g., `UserDashboard`)

## Troubleshooting

### Common Issues

1. **Lock conflicts**: Wait for other agents to complete or manually remove `.lock` file
2. **Permission errors**: Ensure write access to quarantine directory
3. **Missing dependencies**: Install required packages (`@babel/parser`, `@babel/traverse`)

### Debug Mode

```bash
# Run with verbose logging
DEBUG=true npm run cleanup:all
```

### Manual Recovery

If rollback script fails:

1. Check `src/.shared_quarantine/` for moved files
2. Restore files manually from quarantine subdirectories
3. Update `cleanup-log.json` to reflect manual changes

## Integration

The system integrates with existing automation:

- Compatible with `npm run automation:start`
- Logs to existing `logs/` directory
- Follows patterns from `scripts/maintenance/file-cleanup-advanced.js`
- Can be scheduled via cron or CI/CD

## Development

### Adding New Agents

1. Create agent script in `scripts/agents/`
2. Extend `SharedInfrastructure` class
3. Add to `run-cleanup-agents.js` orchestrator
4. Update configuration and npm scripts

### Customizing Detection

Modify agent-specific logic:

- **FrontendCleaner**: Update component detection patterns
- **BackendCleaner**: Adjust utility function identification
- **SharedVerifier**: Enhance asset reference checking

## Support

For issues or questions:

1. Check logs in `logs/cleanup-agents.log`
2. Review configuration in `config/shared-verifier-config.json`
3. Examine quarantine directory structure
4. Use rollback script if needed
