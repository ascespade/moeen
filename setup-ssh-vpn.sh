#!/bin/bash
set -e
set -o pipefail

echo "🔧 Setting up SSH-based VPN solution..."

# Install required packages
sudo apt update
sudo apt install -y autossh openssh-server

# Configure SSH server
sudo sed -i 's/#Port 22/Port 22/' /etc/ssh/sshd_config
sudo sed -i 's/#PermitRootLogin prohibit-password/PermitRootLogin yes/' /etc/ssh/sshd_config
sudo sed -i 's/#PasswordAuthentication yes/PasswordAuthentication yes/' /etc/ssh/sshd_config
sudo sed -i 's/#PubkeyAuthentication yes/PubkeyAuthentication yes/' /etc/ssh/sshd_config
sudo sed -i 's/#GatewayPorts no/GatewayPorts yes/' /etc/ssh/sshd_config

# Restart SSH service
sudo service ssh restart

# Get server IP
SERVER_IP=$(curl -s ifconfig.me)

# Create SSH tunnel server script
cat << EOF > /workspace/ssh-vpn-server.sh
#!/bin/bash

echo "🌐 SSH VPN Server Setup"
echo "📡 Server IP: $SERVER_IP"
echo "🔌 SSH Port: 22"
echo ""

# Create reverse tunnel command
echo "To connect from your local machine, run:"
echo "ssh -R 8080:localhost:8080 -R 3000:localhost:3000 -R 5000:localhost:5000 ubuntu@$SERVER_IP"
echo ""
echo "Then access your services at:"
echo "  - Web IDE: http://localhost:8080"
echo "  - App 1: http://localhost:3000"
echo "  - App 2: http://localhost:5000"
echo ""

# Keep SSH connections alive
while true; do
    echo "$(date): SSH VPN server is running..."
    sleep 60
done
EOF

chmod +x /workspace/ssh-vpn-server.sh

# Create keep-alive script for SSH
cat << 'EOF' > /workspace/keep-ssh-vpn-alive.sh
#!/bin/bash
while true; do
    if ! pgrep -f "sshd" > /dev/null; then
        echo "$(date): Restarting SSH service..."
        sudo service ssh restart
    fi
    sleep 30
done
EOF

chmod +x /workspace/keep-ssh-vpn-alive.sh
nohup /workspace/keep-ssh-vpn-alive.sh > /var/log/ssh-vpn-keepalive.log 2>&1 &

# Start the VPN server
nohup /workspace/ssh-vpn-server.sh > /var/log/ssh-vpn.log 2>&1 &

echo "✅ SSH VPN setup complete!"
echo "📋 Server IP: $SERVER_IP"
echo "🔌 SSH is running on port 22"
echo "🌐 Use SSH reverse tunneling to access your services"
echo "📊 Check logs: tail -f /var/log/ssh-vpn.log"
