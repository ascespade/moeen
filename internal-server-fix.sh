#!/bin/bash

# Internal Server Fix Script
# سكريبت إصلاح السيرفر من الداخل

echo "🔧 Internal Server Fix Script"
echo "============================="

# Check system status
echo "📊 System Status:"
uptime
df -h
free -h

# Check Tailscale status
echo "📡 Tailscale Status:"
sudo tailscale status

# Restart Tailscale service
echo "🔄 Restarting Tailscale service..."
sudo systemctl restart tailscaled
sleep 5

# Check Tailscale status again
echo "📡 Tailscale Status after restart:"
sudo tailscale status

# Check SSH service
echo "🔐 SSH Service Status:"
sudo systemctl status ssh

# Restart SSH if needed
echo "🔄 Restarting SSH service..."
sudo systemctl restart ssh
sleep 3

# Check SSH status again
echo "🔐 SSH Service Status after restart:"
sudo systemctl status ssh

# Check network connectivity
echo "🌐 Network Connectivity:"
ping -c 3 8.8.8.8
ping -c 3 100.64.0.1

# Check firewall status
echo "🔥 Firewall Status:"
sudo ufw status

# Check if cursor-server is running
echo "🎯 Cursor Server Status:"
sudo systemctl status cursor-server

# Restart cursor-server if needed
echo "🔄 Restarting Cursor Server..."
sudo systemctl restart cursor-server
sleep 5

# Check cursor-server status again
echo "🎯 Cursor Server Status after restart:"
sudo systemctl status cursor-server

# Show logs
echo "📋 Recent Cursor Server Logs:"
sudo journalctl -u cursor-server --no-pager -n 20

echo "✅ Internal server fix completed"
