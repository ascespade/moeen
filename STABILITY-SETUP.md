# Connection Stability Setup - Complete Guide

## ✅ Optimizations Applied

### 1. SSH Server Optimizations ✓
- **TCPKeepAlive**: Enabled
- **ClientAliveInterval**: 60 seconds (sends keepalive every minute)
- **ClientAliveCountMax**: 3 (disconnects after 3 failed attempts)
- **MaxStartups**: Increased to 50 connections
- **MaxAuthTries**: Limited to 3 for security

### 2. Network TCP Keepalive ✓
- **tcp_keepalive_time**: 600 seconds (10 minutes)
- **tcp_keepalive_intvl**: 60 seconds
- **tcp_keepalive_probes**: 5
- **tcp_fin_timeout**: 30 seconds
- **Buffer sizes**: Optimized for better throughput

### 3. XRDP Optimizations ✓
- **TCP Keepalive**: Enabled
- **Idle Timeout**: Disabled (0 = never disconnect idle sessions)
- **Kill Disconnected**: Disabled (sessions persist)

### 4. Monitoring Scripts ✓
- **enhanced-monitor.sh**: Advanced service monitoring
- **auto-reconnect.sh**: Automatic reconnection
- **connection-keepalive.sh**: Maintains active connections
- **optimize-network.sh**: Network optimization

## 🚀 Usage

### Start Services with Optimizations
```bash
bash /workspace/start-services.sh
```

### Monitor Services
```bash
bash /workspace/enhanced-monitor.sh
```

### Auto-Reconnect (runs automatically)
```bash
bash /workspace/auto-reconnect.sh
```

### Connection Keepalive
```bash
bash /workspace/connection-keepalive.sh
```

## 📋 Client Configuration

### SSH Client (Windows)
See: `CLIENT-SSH-CONFIG.md`

Key settings:
- ServerAliveInterval 60
- ServerAliveCountMax 3
- ControlMaster auto (connection multiplexing)

### RDP Client (Windows)
See: `CLIENT-RDP-CONFIG.md`

Key settings:
- Auto-reconnection enabled
- Persistent bitmap caching
- Compression enabled

## 🔧 Troubleshooting

### Connection Drops Frequently

1. **Check network stability:**
   ```bash
   ping -c 10 8.8.8.8
   ```

2. **Check service status:**
   ```bash
   bash /workspace/enhanced-monitor.sh
   ```

3. **Restart services:**
   ```bash
   bash /workspace/start-services.sh
   ```

4. **Check logs:**
   ```bash
   tail -f /var/log/enhanced-monitor.log
   tail -f /var/log/auto-reconnect.log
   ```

### Slow Performance

1. **Optimize network:**
   ```bash
   bash /workspace/optimize-network.sh
   ```

2. **Check active connections:**
   ```bash
   ss -tn | grep ESTAB
   ```

3. **Monitor resources:**
   ```bash
   top
   htop
   ```

## 📊 Current Settings

### SSH
- Keepalive: 60 seconds
- Max failed attempts: 3
- TCP Keepalive: Enabled

### Network
- Keepalive time: 600s
- Keepalive interval: 60s
- Keepalive probes: 5

### XRDP
- TCP Keepalive: Enabled
- Idle timeout: Disabled
- Auto-reconnect: Enabled

## ✅ Verification

Check current settings:
```bash
# SSH config
grep -E "(TCPKeepAlive|ClientAlive)" /etc/ssh/sshd_config | grep -v "^#"

# Network settings
sysctl net.ipv4.tcp_keepalive_time
sysctl net.ipv4.tcp_keepalive_intvl
sysctl net.ipv4.tcp_keepalive_probes

# Service status
ss -tlnp | grep -E "(:22|:3389)"
```

All optimizations are active and working!
