# Cursor Cloud Agent Environment Configuration - Complete Setup Guide

## Overview

This document provides a comprehensive guide to the Cursor Cloud Agent environment configuration that enables stable SSH connections, Tailscale integration, and automatic file synchronization.

## Configuration File Location

`.cursor/environment.json`

## What This Configuration Does

### 1. **Tailscale Integration**

- **Auth Key**: Automatically authenticates using `tskey-auth-kEc57QzJ5b11CNTRL-cUdRM6XCwB1RSFxKChe7D1YyetYQkiBEQ`
- **SSH Support**: Enables Tailscale SSH for secure connections
- **Auto-Reconnect**: Automatically reconnects if Tailscale goes down
- **Tailscale IP**: `100.121.114.88` (primary connection method)

### 2. **SSH Stability Features**

#### **Connection Multiplexing (ControlMaster)**

- **Purpose**: Reuses existing SSH connections instead of creating new ones
- **Benefits**:
  - Faster connection establishment
  - Reduced connection overhead
  - Fewer defunct processes
  - Lower resource usage
- **Configuration**:
  - `ControlMaster auto`: Automatically creates master connection
  - `ControlPath ~/.ssh/control/master-%r@%h:%p`: Socket path for connection reuse
  - `ControlPersist 10m`: Keeps connection alive for 10 minutes after last use

#### **Keepalive Settings**

- **ServerAliveInterval**: 30 seconds - sends keepalive packets every 30s
- **ServerAliveCountMax**: 3 - allows 3 failed keepalives before disconnect
- **TCPKeepAlive**: yes - enables TCP-level keepalive
- **ConnectTimeout**: 10 seconds - timeout for initial connection

#### **SSH Health Monitoring**

- **Health Check**: Runs every 60 seconds to verify SSH connectivity
- **Auto-Reconnect**: Automatically reconnects if connection fails
- **Logging**: All health checks logged to `/tmp/ssh-healthcheck.log`

#### **Defunct Process Cleanup**

- **Automatic Cleanup**: Removes defunct SSH processes every 5 minutes
- **Control Socket Cleanup**: Removes stale control sockets older than 1 day
- **Logging**: Cleanup actions logged to `/tmp/ssh-cleanup.log`

### 3. **File Synchronization (rsync)**

#### **Automatic File Sync**

- **Method**: rsync over SSH with connection multiplexing
- **Interval**: Every 5 minutes (300 seconds)
- **Source**: `/home/ubuntu/moeen/`
- **Destination**: `ubuntu@100.121.114.88:/home/ubuntu/moeen-sync/`
- **Exclusions**:
  - `node_modules/`
  - `.next/`
  - `.git/`
- **Options**:
  - `-avz`: Archive mode, verbose, compression
  - `--delete`: Removes files on destination that don't exist on source
- **Logging**: Sync operations logged to `/tmp/rsync-sync.log`

### 4. **Three-Layer Tailscale Protection**

#### **Layer 1: Tailscale Keepalive Monitor**

- **Function**: Monitors Tailscale status every 30 seconds
- **Action**: Automatically restarts Tailscale if it goes down
- **Log**: `/tmp/tailscale-keepalive.log`

#### **Layer 2: System Keepalive**

- **Function**: Touches `/tmp/.keep-awake` every 60 seconds
- **Purpose**: Prevents system sleep/suspend
- **Log**: `/tmp/prevent-sleep.log`

#### **Layer 3: Network Keepalive**

- **Function**: Pings Tailscale IP every 30 seconds
- **Purpose**: Maintains network connection
- **Log**: `/tmp/network-keepalive.log`

## Environment Variables

| Variable             | Value                                                                       | Purpose                  |
| -------------------- | --------------------------------------------------------------------------- | ------------------------ |
| `TAILSCALE_AUTH_KEY` | `tskey-auth-kEc57QzJ5b11CNTRL-cUdRM6XCwB1RSFxKChe7D1YyetYQkiBEQ`            | Tailscale authentication |
| `TAILSCALE_HOST`     | `100.121.114.88`                                                            | Tailscale IP address     |
| `SSH_HOST`           | `100.95.198.68`                                                             | Direct SSH IP (fallback) |
| `SSH_USER`           | `ubuntu`                                                                    | SSH username             |
| `SSH_KEY_PATH`       | `~/.ssh/id_ed25519`                                                         | SSH private key location |
| `SSH_OPTS`           | (see config)                                                                | SSH connection options   |
| `RSYNC_OPTS`         | `-avz --delete --exclude="node_modules" --exclude=".next" --exclude=".git"` | rsync options            |
| `SYNC_INTERVAL`      | `300`                                                                       | Sync interval in seconds |

## Log Files

| Log File                       | Purpose                     | Update Frequency |
| ------------------------------ | --------------------------- | ---------------- |
| `/tmp/tailscale-keepalive.log` | Tailscale keepalive monitor | Every 30s        |
| `/tmp/prevent-sleep.log`       | System keepalive            | Every 60s        |
| `/tmp/network-keepalive.log`   | Network ping keepalive      | Every 30s        |
| `/tmp/ssh-healthcheck.log`     | SSH health checks           | Every 60s        |
| `/tmp/ssh-cleanup.log`         | SSH cleanup operations      | Every 5 minutes  |
| `/tmp/rsync-sync.log`          | File synchronization        | Every 5 minutes  |

## Key Features Summary

### ✅ **SSH Stability**

- Connection multiplexing (ControlMaster)
- Automatic keepalive
- Health monitoring
- Defunct process cleanup
- Auto-reconnect on failure

### ✅ **Passwordless SSH**

- Key-based authentication configured
- SSH key added to authorized_keys
- No password prompts

### ✅ **File Synchronization**

- Automatic rsync every 5 minutes
- Efficient delta sync (only changed files)
- Compressed transfers
- Stable connection reuse

### ✅ **Tailscale Integration**

- Automatic authentication
- Three-layer protection against disconnection
- SSH support enabled
- Auto-reconnect on failure

### ✅ **Monitoring & Logging**

- Comprehensive logging for all operations
- Health check terminals
- Status monitoring terminals
- Sync status tracking

## Usage Instructions

1. **Start the Cloud Agent**: The configuration is automatically loaded when Cursor Cloud Agent starts
2. **Monitor Status**: Use the provided terminals to check connection and sync status
3. **View Logs**: Check log files in `/tmp/` for detailed operation information
4. **Manual Sync**: Run rsync manually using the configured options if needed

## Troubleshooting

### SSH Connection Issues

- Check `/tmp/ssh-healthcheck.log` for connection errors
- Verify Tailscale is running: `tailscale status`
- Check SSH control sockets: `ls -la ~/.ssh/control/`

### File Sync Issues

- Check `/tmp/rsync-sync.log` for sync errors
- Verify SSH connection is working
- Check disk space on both source and destination

### Tailscale Issues

- Check `/tmp/tailscale-keepalive.log` for Tailscale errors
- Verify auth key is valid
- Check Tailscale status: `tailscale status`

## Security Notes

- **SSH Keys**: Private keys are stored securely with proper permissions (600)
- **Auth Key**: Tailscale auth key is stored in environment variables
- **Password Auth**: Disabled for security
- **Host Key Checking**: Disabled for convenience (can be enabled for production)

## Performance Optimizations

- **Connection Reuse**: ControlMaster reduces connection overhead
- **Compression**: SSH compression enabled for faster transfers
- **Delta Sync**: rsync only transfers changed files
- **Efficient Logging**: Logs are rotated and managed automatically

---

**Last Updated**: Configuration includes all stability and sync features as of current setup.
**Status**: ✅ Fully configured and ready for use
