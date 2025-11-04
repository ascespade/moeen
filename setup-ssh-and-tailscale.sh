#!/bin/bash
# Master Setup Script - SSH Server + Tailscale Triple Protection
# Unified setup for secure SSH and Tailscale connectivity

set -e

echo "╔══════════════════════════════════════════════════════════╗"
echo "║  🔐 SSH & TAILSCALE SECURITY SETUP                      ║"
echo "╚══════════════════════════════════════════════════════════╝"
echo ""

if [ "$EUID" -ne 0 ]; then
    echo "❌ Please run as root or with sudo"
    exit 1
fi

# Step 1: Setup SSH Server
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📦 Step 1/2: Setting up SSH Server..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

/workspace/setup-ssh-server.sh

if [ $? -ne 0 ]; then
    echo "❌ SSH setup failed"
    exit 1
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📦 Step 2/2: Setting up Tailscale Triple Protection..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

/workspace/setup-tailscale-triple-protection.sh

if [ $? -ne 0 ]; then
    echo "❌ Tailscale setup failed"
    exit 1
fi

echo ""
echo "╔══════════════════════════════════════════════════════════╗"
echo "║  ✅ SETUP COMPLETE!                                     ║"
echo "╚══════════════════════════════════════════════════════════╝"
echo ""
echo "📋 Summary:"
echo "   ✅ SSH Server configured and running"
echo "   ✅ Tailscale Triple Protection active"
echo ""
echo "🔍 Quick Status Check:"
echo "   - SSH: systemctl status sshd"
echo "   - Tailscale: tailscale status"
echo "   - Protection: ps aux | grep tailscale"
echo ""
echo "📝 Logs Location:"
echo "   - SSH: /var/log/auth.log"
echo "   - Tailscale: /workspace/tailscale-*.log"
echo ""
