#!/bin/bash

# Configuration
TUNNEL_PORT=8080
LOCAL_PORT=8080
REMOTE_USER="ubuntu"
REMOTE_HOST="$(curl -s ifconfig.me)"

echo "🌐 SSH Tunnel Server Setup"
echo "📡 Server IP: $REMOTE_HOST"
echo "🔌 Tunnel Port: $TUNNEL_PORT"
echo ""

# Create reverse tunnel command
echo "To connect from your local machine, run:"
echo "ssh -R $TUNNEL_PORT:localhost:$LOCAL_PORT $REMOTE_USER@$REMOTE_HOST"
echo ""
echo "Then access your services at: http://localhost:$TUNNEL_PORT"
echo ""

# Keep SSH connections alive
while true; do
    echo "$(date): SSH tunnel server is running..."
    sleep 60
done
