#!/bin/bash

# Check Available Servers
# فحص السيرفرات المتاحة

echo "🔍 Checking Available Servers"
echo "============================="

# Check all cursor servers
echo "📊 All Cursor Servers Status:"
echo "cursor-1 (100.76.99.98):"
ping -c 2 100.76.99.98

echo "cursor-2 (100.98.137.52):"
ping -c 2 100.98.137.52

echo "cursor (100.87.127.117):"
ping -c 2 100.87.127.117

# Try SSH to available servers
echo "🔗 Testing SSH Connections:"

echo "Testing cursor-1..."
ssh -o ConnectTimeout=5 -o BatchMode=yes root@100.76.99.98 "echo 'cursor-1 is accessible'" 2>/dev/null && echo "✅ cursor-1 is accessible" || echo "❌ cursor-1 is not accessible"

echo "Testing cursor..."
ssh -o ConnectTimeout=5 -o BatchMode=yes root@100.87.127.117 "echo 'cursor is accessible'" 2>/dev/null && echo "✅ cursor is accessible" || echo "❌ cursor is not accessible"

# Check if we can use jump server
echo "🌐 Testing Jump Server..."
ssh -o ConnectTimeout=5 -o BatchMode=yes root@100.97.57.53 "echo 'jump server is accessible'" 2>/dev/null && echo "✅ Jump server is accessible" || echo "❌ Jump server is not accessible"

echo "✅ Server check completed"
