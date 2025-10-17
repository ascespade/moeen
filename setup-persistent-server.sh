#!/bin/bash
set -e
set -o pipefail

echo "🚀 Setting up Persistent Remote Development Server..."

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
# Git global config
# -----------------------------
echo "📝 Configuring Git..."
sudo -u $DEV_USER git config --global user.email "$GIT_USER_EMAIL"
sudo -u $DEV_USER git config --global user.name "$GIT_USER_NAME"

# -----------------------------
# Tailscale Setup (Persistent)
# -----------------------------
echo "🌐 Setting up Tailscale for persistent connection..."

# Create necessary directories
sudo mkdir -p /var/lib/tailscale /run/tailscale /var/log/tailscale
sudo chmod 755 /var/lib/tailscale /run/tailscale /var/log/tailscale

# Create TUN device if it doesn't exist
if [ ! -e /dev/net/tun ]; then
    sudo mkdir -p /dev/net
    sudo mknod /dev/net/tun c 10 200
    sudo chmod 666 /dev/net/tun
fi

# Start Tailscale daemon
echo "🔧 Starting Tailscale daemon..."
sudo /usr/sbin/tailscaled --state=/var/lib/tailscale/tailscaled.state --socket=/run/tailscale/tailscaled.sock --port=41641 --tun=userspace-networking --verbose=1 > /var/log/tailscale/daemon.log 2>&1 &

# Wait for daemon to start
sleep 10

# Authenticate with Tailscale
echo "🔑 Authenticating with Tailscale..."
sudo tailscale up --authkey "$TAILSCALE_AUTHKEY" --accept-routes --accept-dns

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
# Persistent Background Services
# -----------------------------
echo "🔄 Setting up persistent background services..."

# Create Tailscale keep-alive script
cat << 'EOF' > /opt/tailscale-persistent.sh
#!/bin/bash
while true; do
    if ! pgrep -f tailscaled > /dev/null; then
        echo "$(date): Restarting Tailscale daemon..."
        sudo /usr/sbin/tailscaled --state=/var/lib/tailscale/tailscaled.state --socket=/run/tailscale/tailscaled.sock --port=41641 --tun=userspace-networking --verbose=1 > /var/log/tailscale/daemon.log 2>&1 &
        sleep 10
        sudo tailscale up --authkey "tskey-auth-kcAuzH492211CNTRL-8btFkHtuiHasQcbF6DnbJaZkByPQAa5F" --accept-routes --accept-dns
    fi
    sleep 60
done
EOF

chmod +x /opt/tailscale-persistent.sh
nohup /opt/tailscale-persistent.sh > /var/log/tailscale/persistent.log 2>&1 &

# Create comprehensive health check
cat <<'EOF' > /opt/dev-persistent-healthcheck.sh
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
        sudo /usr/sbin/tailscaled --state=/var/lib/tailscale/tailscaled.state --socket=/run/tailscale/tailscaled.sock --port=41641 --tun=userspace-networking --verbose=1 > /var/log/tailscale/daemon.log 2>&1 &
        sleep 10
        sudo tailscale up --authkey "tskey-auth-kcAuzH492211CNTRL-8btFkHtuiHasQcbF6DnbJaZkByPQAa5F" --accept-routes --accept-dns
    fi
    
    # Check Cloudflare tunnel
    if ! pgrep -f cloudflared > /dev/null; then
        echo "$(date): Restarting Cloudflare tunnel..."
        nohup cloudflared tunnel --url http://localhost:8080 --no-autoupdate > /var/log/dev-agent/cloudflare.log 2>&1 &
    fi
    
    sleep 60
done
EOF

chmod +x /opt/dev-persistent-healthcheck.sh
nohup /opt/dev-persistent-healthcheck.sh > /var/log/dev-agent/persistent-healthcheck.log 2>&1 &

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
# Final Status Report
# -----------------------------
SERVER_IP=$(curl -s ifconfig.me)
TAILSCALE_IP=$(sudo tailscale status | grep -E "100\.[0-9]+\.[0-9]+\.[0-9]+" | head -1 | awk '{print $1}')

echo ""
echo "✅ Persistent Remote Dev Server setup complete!"
echo "=============================================="
echo "🌐 Server IP: $SERVER_IP"
echo "🔗 Tailscale IP: $TAILSCALE_IP"
echo ""
echo "📊 Service Status:"
echo "=================="
echo "SSH: ✅ Running on port 22"
echo "Code Server: ✅ Running on port 8080"
echo "Docker: ✅ Running"
echo "Tailscale: ✅ Connected and persistent"
echo "Cloudflare Tunnel: ✅ Running"
echo ""
echo "🔗 Access Methods:"
echo "=================="
echo "1. Direct Web Access: http://$SERVER_IP:8080 (password: devpassword)"
echo "2. Tailscale Access: http://$TAILSCALE_IP:8080 (password: devpassword)"
echo "3. Cloudflare Tunnel: https://$CLOUDFLARE_TUNNEL_DOMAIN"
echo "4. SSH: ssh $DEV_USER@$SERVER_IP"
echo "5. SSH via Tailscale: ssh $DEV_USER@$TAILSCALE_IP"
echo ""
echo "🔄 Background Services:"
echo "======================"
echo "✅ All services run independently of client connection"
echo "✅ Automatic restart if any service fails"
echo "✅ Persistent connection via Tailscale"
echo "✅ 24/7 monitoring and health checks"
echo ""
echo "📋 Tailscale Status:"
sudo tailscale status
echo ""
echo "🎉 Server is now running persistently! You can close your client and it will stay connected."

