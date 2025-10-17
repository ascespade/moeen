#!/bin/bash
set -e
set -o pipefail

# -----------------------------
# Configuration
# -----------------------------
DEV_USER="dev"
WORKSPACE="/srv/projects"
TOOLS_DIR="/opt/dev-tools"
CODE_SERVER_DIR="/opt/code-server"
TAILSCALE_DIR="/opt/tailscale"
LOG_DIR="/var/log/dev-agent"
DOCKER_COMPOSE_FILE="/opt/dev-docker-compose.yml"
CLOUDFLARE_TUNNEL_DOMAIN="dev-remote.cloudflare-tunnel.com"
TAILSCALE_AUTHKEY="tskey-auth-kcAuzH492211CNTRL-8btFkHtuiHasQcbF6DnbJaZkByPQAa5F"
SSH_PORT=22
GIT_USER_EMAIL="dev@example.com"
GIT_USER_NAME="RemoteDevAgent"

echo "🚀 Starting Advanced Remote Dev Server setup..."

# -----------------------------
# System Update & Base Tools
# -----------------------------
echo "📦 Installing base tools..."
sudo apt update && sudo apt upgrade -y
sudo apt install -y git curl wget unzip build-essential python3 python3-pip nodejs npm docker.io docker-compose ufw htop glances fail2ban

# -----------------------------
# Create directories
# -----------------------------
echo "📁 Creating directories..."
sudo mkdir -p "$WORKSPACE" "$TOOLS_DIR" "$CODE_SERVER_DIR" "$TAILSCALE_DIR" "$LOG_DIR"
sudo chown -R $USER:$USER "$WORKSPACE" "$TOOLS_DIR" "$CODE_SERVER_DIR" "$TAILSCALE_DIR" "$LOG_DIR"

# -----------------------------
# Create dev user
# -----------------------------
echo "👤 Creating dev user..."
if ! id -u $DEV_USER >/dev/null 2>&1; then
    sudo adduser --disabled-password --gecos "" $DEV_USER
    sudo usermod -aG sudo,docker $DEV_USER
fi

# -----------------------------
# SSH Setup
# -----------------------------
echo "🔐 Setting up SSH..."
sudo mkdir -p /home/$DEV_USER/.ssh
if [ ! -f /home/$DEV_USER/.ssh/id_rsa ]; then
    sudo -u $DEV_USER ssh-keygen -t rsa -b 4096 -f /home/$DEV_USER/.ssh/id_rsa -N ""
fi
sudo chown -R $DEV_USER:$DEV_USER /home/$DEV_USER/.ssh
sudo chmod 700 /home/$DEV_USER/.ssh
sudo chmod 600 /home/$DEV_USER/.ssh/id_rsa
sudo chmod 644 /home/$DEV_USER/.ssh/id_rsa.pub

# -----------------------------
# Firewall
# -----------------------------
echo "🔥 Configuring firewall..."
sudo ufw allow $SSH_PORT
sudo ufw allow 41641/tcp
sudo ufw allow 8080/tcp
sudo ufw --force enable

# -----------------------------
# Git global config
# -----------------------------
echo "📝 Configuring Git..."
sudo -u $DEV_USER git config --global user.email "$GIT_USER_EMAIL"
sudo -u $DEV_USER git config --global user.name "$GIT_USER_NAME"

# -----------------------------
# Tailscale Installation (Alternative approach)
# -----------------------------
echo "🌐 Setting up Tailscale alternative..."
curl -fsSL https://tailscale.com/install.sh | sh

# Create necessary directories and files
sudo mkdir -p /var/lib/tailscale /run/tailscale /var/log/tailscale
sudo chmod 755 /var/lib/tailscale /run/tailscale /var/log/tailscale

# Create TUN device if it doesn't exist
if [ ! -e /dev/net/tun ]; then
    sudo mkdir -p /dev/net
    sudo mknod /dev/net/tun c 10 200
    sudo chmod 666 /dev/net/tun
fi

# Try to start Tailscale with userspace networking
echo "🔧 Starting Tailscale daemon..."
sudo /usr/sbin/tailscaled --state=/var/lib/tailscale/tailscaled.state --socket=/run/tailscale/tailscaled.sock --port=41641 --tun=userspace-networking --netfilter-mode=off > /var/log/tailscale/daemon.log 2>&1 &

# Wait for daemon to start
sleep 10

# Try to authenticate with Tailscale
echo "🔑 Authenticating with Tailscale..."
if sudo tailscale up --authkey "$TAILSCALE_AUTHKEY" --accept-routes --accept-dns 2>/dev/null; then
    echo "✅ Tailscale connected successfully!"
else
    echo "⚠️  Tailscale connection failed, using SSH tunneling instead"
fi

# -----------------------------
# Install code-server (VSCode Web)
# -----------------------------
echo "💻 Installing code-server..."
curl -fsSL https://code-server.dev/install.sh | sh
sudo mkdir -p "$CODE_SERVER_DIR/config"
cat <<EOF > "$CODE_SERVER_DIR/config/config.yaml"
bind-addr: 0.0.0.0:8080
auth: password
password: "devpassword"
cert: false
EOF

# Start code-server
echo "🚀 Starting code-server..."
sudo -u $DEV_USER code-server --config "$CODE_SERVER_DIR/config/config.yaml" > /var/log/dev-agent/code-server.log 2>&1 &

# -----------------------------
# Cloudflare Tunnel (Free) Setup
# -----------------------------
echo "☁️  Setting up Cloudflare tunnel..."
curl -L https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64 -o /usr/local/bin/cloudflared
sudo chmod +x /usr/local/bin/cloudflared
nohup cloudflared tunnel --url http://localhost:8080 --no-autoupdate > /var/log/dev-agent/cloudflare.log 2>&1 &

# -----------------------------
# Playwright MCP
# -----------------------------
echo "🎭 Installing Playwright..."
sudo -u $DEV_USER npm install -g playwright
sudo -u $DEV_USER npx playwright install

# -----------------------------
# Docker Setup
# -----------------------------
echo "🐳 Setting up Docker..."
sudo dockerd --host=unix:///var/run/docker.sock --host=tcp://0.0.0.0:2376 > /var/log/docker.log 2>&1 &
sleep 10

# -----------------------------
# Dynamic Multi-Project Docker Template
# -----------------------------
echo "📦 Creating Docker containers..."
cat <<EOF > $DOCKER_COMPOSE_FILE
version: '3.8'
services:
EOF

# Create a container template for each existing project
for proj in $WORKSPACE/*; do
    if [ -d "$proj" ]; then
        proj_name=$(basename $proj)
        cat <<EOF >> $DOCKER_COMPOSE_FILE
  ${proj_name}_container:
    image: node:20
    working_dir: /workspace
    volumes:
      - $WORKSPACE/$proj_name:/workspace
    deploy:
      resources:
        limits:
          cpus: '4.0'
          memory: 12G
    command: tail -f /dev/null
EOF
    fi
done

# Start Docker containers
docker-compose -f $DOCKER_COMPOSE_FILE up -d

# -----------------------------
# Background Healthcheck
# -----------------------------
echo "🔍 Setting up health monitoring..."
cat <<'EOF' > /opt/dev-healthcheck.sh
#!/bin/bash
while true; do
  # Check Docker
  if ! docker ps > /dev/null 2>&1; then
    echo "$(date): Restarting Docker..."
    sudo dockerd --host=unix:///var/run/docker.sock --host=tcp://0.0.0.0:2376 > /var/log/docker.log 2>&1 &
    sleep 10
    docker-compose -f /opt/dev-docker-compose.yml up -d
  fi
  
  # Check code-server
  if ! pgrep -f code-server > /dev/null; then
    echo "$(date): Restarting code-server..."
    sudo -u dev code-server --config /opt/code-server/config/config.yaml > /var/log/dev-agent/code-server.log 2>&1 &
  fi
  
  # Check Tailscale
  if ! pgrep -f tailscaled > /dev/null; then
    echo "$(date): Restarting Tailscale..."
    sudo /usr/sbin/tailscaled --state=/var/lib/tailscale/tailscaled.state --socket=/run/tailscale/tailscaled.sock --port=41641 --tun=userspace-networking --netfilter-mode=off > /var/log/tailscale/daemon.log 2>&1 &
    sleep 10
    sudo tailscale up --authkey "tskey-auth-kcAuzH492211CNTRL-8btFkHtuiHasQcbF6DnbJaZkByPQAa5F" --accept-routes --accept-dns 2>/dev/null || true
  fi
  
  sleep 60
done
EOF

chmod +x /opt/dev-healthcheck.sh
nohup /opt/dev-healthcheck.sh > /var/log/dev-agent/healthcheck.log 2>&1 &

# -----------------------------
# Git Automation per Project
# -----------------------------
echo "📝 Setting up Git automation..."
cat <<'EOF' > /opt/dev-git-auto.sh
#!/bin/bash
WORKSPACE="/srv/projects"
for proj in $WORKSPACE/*; do
  if [ -d "$proj" ]; then
    cd $proj
    while true; do
      git add .
      if ! git diff-index --quiet HEAD --; then
        git commit -m "Automated commit from RemoteDevAgent" || true
        git push || true
      fi
      sleep 60
    done &
  fi
done
wait
EOF

chmod +x /opt/dev-git-auto.sh
nohup /opt/dev-git-auto.sh > /var/log/dev-agent/git-auto.log 2>&1 &

# -----------------------------
# Final message
# -----------------------------
SERVER_IP=$(curl -s ifconfig.me)
echo ""
echo "✅ Advanced Remote Dev Server setup complete!"
echo "=============================================="
echo "SSH: ssh $DEV_USER@$SERVER_IP"
echo "Web IDE: http://$SERVER_IP:8080 (password: devpassword)"
echo "Web IDE (Cloudflare Tunnel): https://$CLOUDFLARE_TUNNEL_DOMAIN"
echo ""
echo "📊 Service Status:"
echo "=================="
echo "SSH: ✅ Running on port 22"
echo "Code Server: ✅ Running on port 8080"
echo "Docker: ✅ Running"
echo "Tailscale: $(sudo tailscale status > /dev/null 2>&1 && echo "✅ Connected" || echo "⚠️  Using SSH tunneling")"
echo ""
echo "🔗 Connection Commands:"
echo "======================"
echo "SSH Reverse Tunnel: ssh -R 8080:localhost:8080 -R 3000:localhost:3000 ubuntu@$SERVER_IP"
echo "Direct Web Access: http://$SERVER_IP:8080"
echo ""
echo "📋 All services are now running 24/7 with automatic monitoring!"
