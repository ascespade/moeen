#!/bin/bash

echo "🌐 SSH VPN Server Setup"
echo "📡 Server IP: 52.40.240.89"
echo "🔌 SSH Port: 22"
echo ""

# Create reverse tunnel command
echo "To connect from your local machine, run:"
echo "ssh -R 8080:localhost:8080 -R 3000:localhost:3000 -R 5000:localhost:5000 ubuntu@52.40.240.89"
echo ""
echo "Then access your services at:"
echo "  - Web IDE: http://localhost:8080"
echo "  - App 1: http://localhost:3000"
echo "  - App 2: http://localhost:5000"
echo ""

# Keep SSH connections alive
while true; do
    echo "Wed Oct 15 12:12:53 AM UTC 2025: SSH VPN server is running..."
    sleep 60
done
