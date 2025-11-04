# SSH & Tailscale Security Setup Guide

This guide explains how to set up secure SSH server and Tailscale triple protection system.

## 📋 Overview

The setup includes:
- **SSH Server**: Secure configuration with passwordless authentication
- **Tailscale Triple Protection**: Multi-layer system to keep Tailscale always connected

## 🚀 Quick Start

### Option 1: Run Everything (Recommended)
```bash
sudo /workspace/setup-ssh-and-tailscale.sh
```

### Option 2: Run Separately
```bash
# SSH Server only
sudo /workspace/setup-ssh-server.sh

# Tailscale Protection only
sudo /workspace/setup-tailscale-triple-protection.sh
```

## 📁 Script Files

### Main Setup Scripts
- `setup-ssh-server.sh` - Configures SSH server with security best practices
- `setup-tailscale-triple-protection.sh` - Sets up Tailscale protection layers
- `setup-ssh-and-tailscale.sh` - Master script that runs both setups

### Tailscale Protection Scripts
- `tailscale-supervisor.sh` - Master controller (Layer 3)
- `tailscale-watchdog.sh` - Fast monitoring (Layer 1, checks every 15s)
- `keep-tailscale-alive.sh` - Keep-alive mechanism (Layer 2)
- `tailscale-monitor.sh` - Connection quality monitoring (Layer 2)
- `tailscale-health-check.sh` - Comprehensive health check (Layer 3, cron every 2min)

## 🛡️ Protection Layers

### Layer 1: Watchdog
- **Frequency**: Every 15 seconds
- **Purpose**: Fast detection and restart of Tailscale
- **Log**: `/workspace/tailscale-watchdog.log`

### Layer 2: Keep-alive + Monitor
- **Frequency**: Continuous (30s and 45s intervals)
- **Purpose**: Maintain connection and monitor quality
- **Logs**: 
  - `/workspace/tailscale-health.log`
  - `/workspace/tailscale-monitor.log`

### Layer 3: Supervisor + Cron
- **Frequency**: Supervisor every 60s, Cron every 2 minutes
- **Purpose**: Oversees all layers and comprehensive health checks
- **Logs**: 
  - `/workspace/tailscale-supervisor.log`
  - `/workspace/tailscale-health.log`

## 🔐 SSH Server Configuration

The SSH server is configured with:
- ✅ Public key authentication enabled
- ✅ Password authentication enabled (for flexibility)
- ✅ Root login disabled (security best practice)
- ✅ Connection stability settings (TCP keep-alive, timeouts)
- ✅ Performance optimizations
- ✅ Automatic SSH key generation

### SSH Key Location
- Root user: `/root/.ssh/id_ed25519`
- Ubuntu user (if exists): `/home/ubuntu/.ssh/id_ed25519`

## 🔑 Tailscale API Key

The Tailscale API key is integrated into all scripts:
```
tskey-auth-krGK3xvj3v11CNTRL-MRcHuLN5JWEiGSMsLvxGVE14RCQw66uCX
```

This key is used for:
- Initial authentication
- Re-authentication when connection drops
- Automatic recovery

## 📊 Monitoring & Status

### Check SSH Status
```bash
systemctl status sshd
# or
systemctl status ssh
```

### Check Tailscale Status
```bash
tailscale status
tailscale ip -4
```

### Check Protection Layers
```bash
ps aux | grep tailscale
```

### View Logs
```bash
# Watchdog logs
tail -f /workspace/tailscale-watchdog.log

# Supervisor logs
tail -f /workspace/tailscale-supervisor.log

# Health check logs
tail -f /workspace/tailscale-health.log

# Monitor logs
tail -f /workspace/tailscale-monitor.log
```

## 🔧 Troubleshooting

### SSH Issues
1. Check SSH service: `systemctl status sshd`
2. Check SSH config: `sshd -t`
3. View SSH logs: `tail -f /var/log/auth.log`

### Tailscale Issues
1. Check if Tailscale is installed: `which tailscale`
2. Check daemon status: `ps aux | grep tailscaled`
3. Check connection: `tailscale status`
4. Restart protection: `sudo /workspace/setup-tailscale-triple-protection.sh`

### Protection Layer Issues
1. Check all processes: `ps aux | grep -E "(watchdog|monitor|keep-alive|supervisor)"`
2. Restart supervisor: 
   ```bash
   pkill tailscale-supervisor
   nohup /workspace/tailscale-supervisor.sh > /dev/null 2>&1 &
   ```

## 🔄 Restarting Services

### Restart SSH
```bash
sudo systemctl restart sshd
# or
sudo systemctl restart ssh
```

### Restart Tailscale Protection
```bash
sudo /workspace/setup-tailscale-triple-protection.sh
```

### Stop All Protection
```bash
pkill tailscale-watchdog
pkill tailscale-monitor
pkill keep-tailscale-alive
pkill tailscale-supervisor
```

## 📝 Notes

- All scripts require root/sudo privileges
- SSH config is automatically backed up before changes
- Tailscale protection layers auto-restart if they fail
- Cron job runs health checks every 2 minutes
- All logs are written to `/workspace/` directory

## 🔒 Security Considerations

1. **SSH Key Security**: Keep your private keys secure
2. **API Key**: The Tailscale API key is stored in scripts - consider using environment variables for production
3. **Root Access**: Scripts require root - review before running
4. **Firewall**: Ensure appropriate firewall rules are in place

## ✅ Verification Checklist

After setup, verify:
- [ ] SSH server is running: `systemctl status sshd`
- [ ] SSH key authentication works: `ssh localhost`
- [ ] Tailscale is connected: `tailscale status`
- [ ] All protection layers running: `ps aux | grep tailscale`
- [ ] Cron job active: `crontab -l | grep tailscale`
- [ ] Logs are being written: `ls -lh /workspace/tailscale-*.log`

## 🆘 Support

If you encounter issues:
1. Check all log files
2. Verify Tailscale API key is valid
3. Ensure Tailscale is installed
4. Check system requirements (systemd, bash, etc.)

---

**Last Updated**: $(date)
**Scripts Version**: 1.0
