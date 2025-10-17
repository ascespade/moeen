#!/bin/bash
set -e

echo "🚀 Setting up complete remote development environment..."

# Update system
echo "📦 Updating system packages..."
sudo apt update && sudo apt upgrade -y

# Install essential tools
echo "🔧 Installing essential development tools..."
sudo apt install -y git curl wget unzip build-essential python3 python3-pip nodejs npm docker.io docker-compose ufw htop glances fail2ban

# Create dev user if not exists
DEV_USER="dev"
if ! id -u $DEV_USER >/dev/null 2>&1; then
    echo "👤 Creating dev user..."
    sudo adduser --disabled-password --gecos "" $DEV_USER
    sudo usermod -aG sudo,docker $DEV_USER
fi

# Create workspace
WORKSPACE="/srv/projects"
sudo mkdir -p "$WORKSPACE"
sudo chown -R $DEV_USER:$DEV_USER "$WORKSPACE"

# Copy current project
if [ -d "/workspace" ]; then
    echo "📁 Copying project to workspace..."
    sudo cp -r /workspace/* "$WORKSPACE/" 2>/dev/null || true
    sudo chown -R $DEV_USER:$DEV_USER "$WORKSPACE"
fi

# Install project dependencies
echo "📦 Installing project dependencies..."
cd "$WORKSPACE"
sudo -u $DEV_USER npm install

# Install additional tools
echo "🛠️ Installing additional development tools..."
sudo -u $DEV_USER npm install playwright

# Configure VS Code Server
echo "💻 Configuring VS Code Server..."
sudo mkdir -p /opt/code-server/config
sudo tee /opt/code-server/config/config.yaml > /dev/null << 'EOF'
bind-addr: 0.0.0.0:8080
auth: password
password: "devpassword123"
cert: false
EOF

# Start VS Code Server
echo "🚀 Starting VS Code Server..."
sudo -u $DEV_USER code-server --config /opt/code-server/config/config.yaml /srv/projects &

# Configure firewall
echo "🔥 Configuring firewall..."
sudo ufw allow 22
sudo ufw allow 8080
sudo ufw --force enable

# Create startup script
echo "📝 Creating startup script..."
sudo tee /opt/start-dev-services.sh > /dev/null << 'EOF'
#!/bin/bash
# Start Docker
sudo dockerd --host=unix:///var/run/docker.sock --host=tcp://0.0.0.0:2376 &

# Start VS Code Server
sudo -u dev code-server --config /opt/code-server/config/config.yaml /srv/projects &

echo "✅ Development services started"
echo "🌐 VS Code Server: http://$(hostname -I | awk '{print $1}'):8080"
echo "🔑 Password: devpassword123"
EOF

sudo chmod +x /opt/start-dev-services.sh

# Create a simple Cursor CLI alternative
echo "🎯 Creating development CLI..."
sudo tee /usr/local/bin/dev-cli > /dev/null << 'EOF'
#!/bin/bash
case "$1" in
    "start")
        /opt/start-dev-services.sh
        ;;
    "status")
        echo "VS Code Server: $(pgrep -f code-server > /dev/null && echo 'Running' || echo 'Stopped')"
        echo "Docker: $(pgrep -f dockerd > /dev/null && echo 'Running' || echo 'Stopped')"
        ;;
    "logs")
        tail -f /var/log/dev-agent/*.log 2>/dev/null || echo "No logs found"
        ;;
    *)
        echo "Usage: dev-cli {start|status|logs}"
        ;;
esac
EOF

sudo chmod +x /usr/local/bin/dev-cli

# Final status
echo ""
echo "✅ Remote development environment setup complete!"
echo ""
echo "🌐 Access your development environment:"
echo "   VS Code Server: http://$(hostname -I | awk '{print $1}'):8080"
echo "   Username: dev"
echo "   Password: devpassword123"
echo ""
echo "🛠️ Available commands:"
echo "   dev-cli start    - Start all development services"
echo "   dev-cli status   - Check service status"
echo "   dev-cli logs     - View logs"
echo ""
echo "📁 Project location: /srv/projects"
echo "👤 Dev user: dev"
echo ""
echo "🚀 To start services: dev-cli start"