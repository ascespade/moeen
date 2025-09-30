#!/bin/bash

# Script to test Amazon EC2 connection
# Usage: ./test_amazon_connection.sh YOUR_EC2_IP

if [ $# -eq 0 ]; then
    echo "Usage: $0 <EC2_PUBLIC_IP>"
    echo "Example: $0 3.15.123.45"
    exit 1
fi

EC2_IP=$1
KEY_PATH="~/.ssh/test_key"

echo "Testing connection to Amazon EC2 server: $EC2_IP"
echo "Using key: $KEY_PATH"
echo ""

# Test SSH connection
echo "Attempting SSH connection..."
ssh -i ~/.ssh/test_key -o ConnectTimeout=10 -o StrictHostKeyChecking=no ubuntu@$EC2_IP "echo 'Connection successful! Server info:'; uname -a; whoami; pwd"

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Connection successful!"
    echo "You can now connect using: ssh -i ~/.ssh/test_key ubuntu@$EC2_IP"
else
    echo ""
    echo "❌ Connection failed!"
    echo "Please check:"
    echo "1. EC2 instance is running"
    echo "2. Security group allows SSH (port 22)"
    echo "3. Public IP is correct"
    echo "4. Key pair is properly configured"
fi
