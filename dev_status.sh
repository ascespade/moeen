#!/bin/bash
# Development Server Status Script

echo "=== Cursor Development Server Status ==="
echo "Date: $(date)"
echo ""

# System Info
echo "=== System Information ==="
echo "Hostname: $(hostname)"
echo "Uptime: $(uptime)"
echo "Memory: $(free -h | grep Mem | awk '{print $3 "/" $2}')"
echo "Disk: $(df -h / | tail -1 | awk '{print $3 "/" $2 " (" $5 " used)"}')"
echo ""

# Network Info
echo "=== Network Information ==="
echo "Public IP: $(curl -s ifconfig.me 2>/dev/null || echo 'Unable to determine')"
if command -v tailscale > /dev/null 2>&1; then
    echo "Tailscale IP: $(tailscale ip -4 2>/dev/null || echo 'Not connected')"
    echo "Tailscale Status:"
    tailscale status 2>/dev/null || echo "Tailscale not running"
else
    echo "Tailscale: Not installed"
fi
echo ""

# SSH Status
echo "=== SSH Status ==="
if ss -tlnp | grep -q :22; then
    echo "SSH: Running on port 22"
else
    echo "SSH: Not running"
fi
echo ""

# Development Environment
echo "=== Development Environment ==="
echo "Node.js: $(node --version 2>/dev/null || echo 'Not installed')"
echo "npm: $(npm --version 2>/dev/null || echo 'Not installed')"
echo "Git: $(git --version 2>/dev/null || echo 'Not installed')"
echo "Docker: $(docker --version 2>/dev/null || echo 'Not installed')"
echo ""

# Services
echo "=== Services ==="
echo "Active services:"
ps aux | grep -E "(ssh|tailscale)" | grep -v grep || echo "No relevant services running"
echo ""

# Logs
echo "=== Recent Logs ==="
if [ -f "/var/log/startup_services.log" ]; then
    echo "Startup Services Log (last 5 lines):"
    tail -5 /var/log/startup_services.log
else
    echo "No startup services log found"
fi

if [ -f "/var/log/tailscale_keepalive.log" ]; then
    echo ""
    echo "Tailscale Keep-Alive Log (last 5 lines):"
    tail -5 /var/log/tailscale_keepalive.log
fi

echo ""
echo "=== Connection Information ==="
echo "To connect via SSH:"
echo "ssh ubuntu@$(tailscale ip -4 2>/dev/null || echo 'TAILSCALE_IP')"
echo ""
echo "To connect via Tailscale:"
echo "ssh ubuntu@cursor-dev-server"
