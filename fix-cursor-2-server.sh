#!/bin/bash

# Server Fix Script for cursor-2
# سكريبت إصلاح السيرفر cursor-2

echo "🔧 Server Fix Script for cursor-2"
echo "=================================="

# Check if we can ping the server
echo "📡 Checking server connectivity..."
ping -c 3 100.98.137.52

# Check Tailscale status on local machine
echo "📊 Local Tailscale Status:"
tailscale status | grep cursor-2

# Try to connect via different methods
echo "🔗 Trying different connection methods..."

# Method 1: Direct SSH with verbose output
echo "Method 1: SSH with verbose output"
ssh -v -o ConnectTimeout=10 -o ServerAliveInterval=5 root@100.98.137.52 "echo 'Connection successful'"

# Method 2: Try with ubuntu user
echo "Method 2: Try with ubuntu user"
ssh -v -o ConnectTimeout=10 -o ServerAliveInterval=5 ubuntu@100.98.137.52 "echo 'Connection successful'"

# Method 3: Try with hostname
echo "Method 3: Try with hostname"
ssh -v -o ConnectTimeout=10 -o ServerAliveInterval=5 root@cursor-2.tail31ce5f.ts.net "echo 'Connection successful'"

# Method 4: Check if SSH service is running (if we can connect)
echo "Method 4: Check SSH service status"
ssh -o ConnectTimeout=5 root@100.98.137.52 "sudo systemctl status ssh"

echo "✅ Server fix script completed"
