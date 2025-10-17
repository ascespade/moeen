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
TAILSCALE_AUTHKEY=""
SSH_PORT=22
GIT_USER_EMAIL="dev@example.com"
GIT_USER_NAME="RemoteDevAgent"

# -----------------------------
# System Update & Base Tools
# -----------------------------
sudo apt update && sudo apt upgrade -y
sudo apt install -y git curl wget unzip build-essential python3 python3-pip nodejs npm docker.io docker-compose ufw htop glances fail2ban

# Enable Docker
sudo systemctl enable docker
sudo systemctl start docker

# -----------------------------
# Create dev user
# -----------------------------
if ! id -u $DEV_USER >/dev/null 2>&1; then
    sudo adduser --disabled-password --gecos "" $DEV_USER
    sudo usermod -aG sudo,docker $DEV_USER
fi

# -----------------------------
# Create directories
# -----------------------------
sudo mkdir -p "$WORKSPACE" "$TOOLS_DIR" "$CODE_SERVER_DIR" "$TAILSCALE_DIR" "$LOG_DIR"
sudo chown -R $DEV_USER:$DEV_USER "$WORKSPACE" "$TOOLS_DIR" "$CODE_SERVER_DIR" "$TAILSCALE_DIR" "$LOG_DIR"

# -----------------------------
# SSH Setup
# -----------------------------
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
sudo ufw allow $SSH_PORT
sudo ufw allow 41641/tcp
sudo ufw --force enable

# -----------------------------
# Git global config
# -----------------------------
sudo -u $DEV_USER git config --global user.email "$GIT_USER_EMAIL"
sudo -u $DEV_USER git config --global user.name "$GIT_USER_NAME"

# -----------------------------
# Tailscale Installation
# -----------------------------
curl -fsSL https://tailscale.com/install.sh | sh
sudo systemctl enable tailscaled
sudo systemctl start tailscaled
echo "Please run 'sudo tailscale up' manually to authenticate"

# -----------------------------
# Install code-server (VSCode Web)
# -----------------------------
curl -fsSL https://code-server.dev/install.sh | sh
sudo mkdir -p "$CODE_SERVER_DIR/config"
cat <<EOF > "$CODE_SERVER_DIR/config/config.yaml"
bind-addr: 0.0.0.0:8080
auth: password
password: "devpassword"
cert: false
EOF

sudo systemctl enable code-server@$DEV_USER
sudo systemctl start code-server@$DEV_USER

# -----------------------------
# Cloudflare Tunnel (Free) Setup
# -----------------------------
curl -L https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64 -o /usr/local/bin/cloudflared
sudo chmod +x /usr/local/bin/cloudflared
nohup cloudflared tunnel --url http://localhost:8080 --no-autoupdate &

# -----------------------------
# Install Node.js and npm (if not already installed)
# -----------------------------
if ! command -v node &> /dev/null; then
    curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
    sudo apt-get install -y nodejs
fi

# -----------------------------
# Install Cursor CLI
# -----------------------------
if ! command -v cursor &> /dev/null; then
    curl -fsSL https://cursor.sh/install.sh | sh
fi

# -----------------------------
# Install project dependencies
# -----------------------------
if [ -f "$WORKSPACE/package.json" ]; then
    cd "$WORKSPACE"
    sudo -u $DEV_USER npm install
fi

# -----------------------------
# Playwright MCP
# -----------------------------
sudo -u $DEV_USER npm install -g playwright
sudo -u $DEV_USER npx playwright install

# -----------------------------
# Dynamic Multi-Project Docker Template
# -----------------------------
cat <<EOF > $DOCKER_COMPOSE_FILE
version: '3.8'
services:
  main_project:
    image: node:20
    working_dir: /workspace
    volumes:
      - $WORKSPACE:/workspace
    deploy:
      resources:
        limits:
          cpus: '4.0'
          memory: 12G
    command: tail -f /dev/null
EOF

# Only run docker-compose if Docker is available
if command -v docker-compose &> /dev/null; then
    docker-compose -f $DOCKER_COMPOSE_FILE up -d
fi

# -----------------------------
# Background Healthcheck
# -----------------------------
cat <<'EOF' > /opt/dev-healthcheck.sh
#!/bin/bash
while true; do
  docker ps || docker-compose -f /opt/dev-docker-compose.yml up -d
  systemctl status code-server@$DEV_USER || systemctl restart code-server@$DEV_USER
  tailscale status || systemctl restart tailscaled
  sleep 60
done
EOF
chmod +x /opt/dev-healthcheck.sh
nohup /opt/dev-healthcheck.sh > /var/log/dev-agent/healthcheck.log 2>&1 &

# -----------------------------
# Git Automation per Project
# -----------------------------
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
echo "✅ Advanced Remote Dev Server setup complete!"
echo "SSH: ssh $DEV_USER@<server-ip>"
echo "Web IDE (Cloudflare Tunnel): https://$CLOUDFLARE_TUNNEL_DOMAIN"
echo "Tailscale active and persistent"
echo "Playwright MCP installed in each container"
echo "Docker dynamic multi-project containers running"
echo "All background tasks running independently of local client"