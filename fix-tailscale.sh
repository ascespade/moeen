#!/bin/bash

# Fix Tailscale Connection
# إصلاح اتصال Tailscale

echo "🔧 Fixing Tailscale Connection"
echo "==============================="

# Check if Tailscale is installed
if ! command -v tailscale &> /dev/null; then
    echo "❌ Tailscale is not installed"
    echo "Please install Tailscale first"
    exit 1
fi

# Check current status
echo "📊 Current Tailscale Status:"
tailscale status

# Disconnect and reconnect
echo "🔄 Disconnecting Tailscale..."
tailscale down

echo "⏳ Waiting 5 seconds..."
sleep 5

echo "🔄 Reconnecting Tailscale..."
tailscale up

echo "⏳ Waiting 10 seconds for connection to establish..."
sleep 10

# Check status again
echo "📊 Tailscale Status after reconnect:"
tailscale status

# Test connectivity to cursor-2
echo "🔗 Testing connectivity to cursor-2..."
ping -c 3 100.98.137.52

# Try SSH again
echo "🔐 Testing SSH to cursor-2..."
ssh -o ConnectTimeout=10 root@100.98.137.52 "echo 'SSH connection successful'" 2>/dev/null && echo "✅ SSH connection successful" || echo "❌ SSH connection failed"

echo "✅ Tailscale fix completed"
