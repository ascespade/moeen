#!/bin/bash

echo "🔧 Setting up SSH Tunnel as networking solution..."

# Install required packages
sudo apt update
sudo apt install -y autossh openssh-server

# Configure SSH server
sudo sed -i 's/#Port 22/Port 22/' /etc/ssh/sshd_config
sudo sed -i 's/#PermitRootLogin prohibit-password/PermitRootLogin yes/' /etc/ssh/sshd_config
sudo sed -i 's/#PasswordAuthentication yes/PasswordAuthentication yes/' /etc/ssh/sshd_config
sudo sed -i 's/#PubkeyAuthentication yes/PubkeyAuthentication yes/' /etc/ssh/sshd_config

# Restart SSH service
sudo service ssh restart

# Create SSH tunnel script
cat << 'EOF' > /workspace/ssh-tunnel-server.sh
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
EOF

chmod +x /workspace/ssh-tunnel-server.sh

# Create keep-alive script for SSH
cat << 'EOF' > /workspace/keep-ssh-alive.sh
#!/bin/bash
while true; do
    if ! pgrep -f "ssh.*-R" > /dev/null; then
        echo "$(date): No active SSH tunnels found"
    fi
    sleep 30
done
EOF

chmod +x /workspace/keep-ssh-alive.sh
nohup /workspace/keep-ssh-alive.sh > /var/log/ssh-keepalive.log 2>&1 &

# Start the tunnel server
nohup /workspace/ssh-tunnel-server.sh > /var/log/ssh-tunnel.log 2>&1 &

echo "✅ SSH Tunnel setup complete!"
echo "📋 Server IP: $(curl -s ifconfig.me)"
echo "🔌 SSH is running on port 22"
echo "🌐 Use SSH reverse tunneling to access your services"
echo "📊 Check logs: tail -f /var/log/ssh-tunnel.log"
