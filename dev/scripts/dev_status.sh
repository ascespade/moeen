#!/bin/bash

echo "🔧 Development Server Status"
echo "=========================="
echo "Hostname: $(hostname)"
echo "User: $(whoami)"
echo "Date: $(date)"
echo "Uptime: $(uptime)"
echo ""

echo "🌐 Network Status:"
echo "Tailscale IP: $(tailscale ip -4 2>/dev/null || echo 'Not connected')"
echo "Public IP: $(curl -s ifconfig.me 2>/dev/null || echo 'Not available')"
echo ""

echo "🐳 Docker Status:"
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}" 2>/dev/null || echo "Docker not running"
echo ""

echo "📦 Node.js Status:"
node --version 2>/dev/null || echo "Node.js not installed"
npm --version 2>/dev/null || echo "npm not installed"
echo ""

echo "🐍 Python Status:"
python3 --version 2>/dev/null || echo "Python not installed"
pip3 --version 2>/dev/null || echo "pip not installed"
echo ""

echo "📁 Disk Usage:"
df -h /workspace
echo ""

echo "💾 Memory Usage:"
free -h
echo ""

echo "🔌 Active Connections:"
ss -tuln | head -10
