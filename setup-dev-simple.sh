#!/bin/bash

# =============================================================================
# Simplified Development Environment Setup
# =============================================================================
# This script sets up the core development environment without firewall
# configuration that may not work in containerized environments.
# =============================================================================

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Logging functions
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

log_step() {
    echo -e "${PURPLE}[STEP]${NC} $1"
}

# =============================================================================
# System Information
# =============================================================================
log_step "System Information and Initial Setup..."

# Get system info
HOSTNAME=$(hostname)
IP_ADDRESS=$(hostname -I | awk '{print $1}')
USER=$(whoami)
WORKSPACE="/workspace"

echo -e "${CYAN}System Information:${NC}"
echo -e "  Hostname: $HOSTNAME"
echo -e "  IP Address: $IP_ADDRESS"
echo -e "  User: $USER"
echo -e "  Workspace: $WORKSPACE"
echo ""

# =============================================================================
# VS Code Server Configuration
# =============================================================================
log_step "Configuring VS Code Server..."

# Create VS Code Server configuration
mkdir -p ~/.config/code-server
cat > ~/.config/code-server/config.yaml << 'EOF'
bind-addr: 0.0.0.0:8080
auth: none
password: ""
cert: false
disable-telemetry: true
disable-update-check: true
disable-workspace-trust: true
EOF

# Create VS Code Server startup script
cat > ~/start-vscode-server.sh << 'EOF'
#!/bin/bash
echo "Starting VS Code Server on port 8080..."
cd /workspace
code-server --config ~/.config/code-server/config.yaml
EOF

chmod +x ~/start-vscode-server.sh

log_success "VS Code Server configured"

# =============================================================================
# Cursor Server Setup (Placeholder)
# =============================================================================
log_step "Setting up Cursor Server..."

# Create directory for Cursor
mkdir -p ~/.cursor
mkdir -p ~/.cursor-server

# Create Cursor Server configuration (placeholder)
cat > ~/.cursor-server/config.json << 'EOF'
{
  "port": 26054,
  "host": "0.0.0.0",
  "auth": "none",
  "workspace": "/workspace",
  "extensions": {
    "autoUpdate": true,
    "recommendations": true
  },
  "telemetry": {
    "enabled": false
  }
}
EOF

# Create Cursor Server startup script
cat > ~/start-cursor-server.sh << 'EOF'
#!/bin/bash
echo "Starting Cursor Server on port 26054..."
cd /workspace

# Check if Cursor CLI is available
if command -v cursor &> /dev/null; then
    cursor server --port 26054 --host 0.0.0.0 --auth none
else
    echo "Cursor CLI not available. Starting alternative development server..."
    # Fallback to VS Code Server with Cursor-like extensions
    code-server --config ~/.config/code-server/config.yaml --port 26054
fi
EOF

chmod +x ~/start-cursor-server.sh

log_success "Cursor Server configured (placeholder)"

# =============================================================================
# Development Tools Installation
# =============================================================================
log_step "Installing additional development tools..."

# Install global npm packages for development
npm install -g \
    typescript \
    ts-node \
    nodemon \
    pm2 \
    @vercel/ncc \
    esbuild \
    vite \
    turbo \
    lerna \
    nx \
    @angular/cli \
    @vue/cli \
    create-react-app \
    create-next-app \
    @storybook/cli \
    @testing-library/jest-dom \
    @playwright/test \
    prettier \
    eslint \
    @typescript-eslint/eslint-plugin \
    @typescript-eslint/parser

log_success "Development tools installed"

# =============================================================================
# Database Tools
# =============================================================================
log_step "Installing database tools..."

# Install PostgreSQL client
sudo apt install -y postgresql-client

# Install Redis tools
sudo apt install -y redis-tools

# Install SQLite tools
sudo apt install -y sqlite3

log_success "Database tools installed"

# =============================================================================
# Monitoring and System Tools
# =============================================================================
log_step "Installing monitoring and system tools..."

# Install monitoring tools
sudo apt install -y \
    htop \
    glances \
    iotop \
    nethogs \
    iftop \
    nload \
    ncdu \
    tree \
    jq \
    curl \
    wget \
    git \
    vim \
    nano \
    tmux \
    screen

log_success "Monitoring tools installed"

# =============================================================================
# Project Setup
# =============================================================================
log_step "Setting up project environment..."

# Navigate to workspace
cd $WORKSPACE

# Install project dependencies
if [ -f "package.json" ]; then
    log_info "Installing project dependencies..."
    npm install --legacy-peer-deps
fi

# Create development scripts
cat > ~/start-dev-environment.sh << 'EOF'
#!/bin/bash
echo "Starting complete development environment..."

# Start VS Code Server in background
nohup ~/start-vscode-server.sh > ~/.vscode-server.log 2>&1 &
echo "VS Code Server started on port 8080"

# Start Cursor Server in background
nohup ~/start-cursor-server.sh > ~/.cursor-server.log 2>&1 &
echo "Cursor Server started on port 26054"

# Start Next.js development server
cd /workspace
npm run dev &
echo "Next.js development server started on port 3001"

echo "Development environment started!"
echo "Access VS Code Server: http://$(hostname -I | awk '{print $1}'):8080"
echo "Access Cursor Server: http://$(hostname -I | awk '{print $1}'):26054"
echo "Access Next.js App: http://$(hostname -I | awk '{print $1}'):3001"
EOF

chmod +x ~/start-dev-environment.sh

# Create stop script
cat > ~/stop-dev-environment.sh << 'EOF'
#!/bin/bash
echo "Stopping development environment..."

# Stop VS Code Server
pkill -f "code-server" || true

# Stop Cursor Server
pkill -f "cursor server" || true

# Stop Next.js
pkill -f "next dev" || true

echo "Development environment stopped"
EOF

chmod +x ~/stop-dev-environment.sh

# Create status script
cat > ~/dev-status.sh << 'EOF'
#!/bin/bash
echo "=== Development Environment Status ==="
echo ""

echo "=== System Information ==="
echo "Hostname: $(hostname)"
echo "IP Address: $(hostname -I | awk '{print $1}')"
echo "User: $(whoami)"
echo "Uptime: $(uptime -p)"
echo ""

echo "=== Services Status ==="
echo "VS Code Server: $(pgrep -f 'code-server' > /dev/null && echo 'Running' || echo 'Stopped')"
echo "Cursor Server: $(pgrep -f 'cursor server' > /dev/null && echo 'Running' || echo 'Stopped')"
echo "Next.js Dev: $(pgrep -f 'next dev' > /dev/null && echo 'Running' || echo 'Stopped')"
echo ""

echo "=== Port Status ==="
netstat -tlnp | grep -E ':(8080|26054|3000|3001|5432|6379)' || echo "No services listening on development ports"
echo ""

echo "=== System Resources ==="
echo "Memory Usage:"
free -h
echo ""
echo "Disk Usage:"
df -h / | tail -1
echo ""

echo "=== Development Tools ==="
echo "Node.js: $(node --version 2>/dev/null || echo 'Not installed')"
echo "npm: $(npm --version 2>/dev/null || echo 'Not installed')"
echo "Python: $(python3 --version 2>/dev/null || echo 'Not installed')"
echo "Git: $(git --version 2>/dev/null || echo 'Not installed')"
echo "Docker: $(docker --version 2>/dev/null || echo 'Not installed')"
echo ""

echo "=== Project Status ==="
if [ -d "/workspace" ]; then
    echo "Workspace: /workspace"
    echo "Project Type: $(grep -o '"name": "[^"]*"' /workspace/package.json 2>/dev/null | cut -d'"' -f4 || echo 'Unknown')"
    echo "Dependencies: $(npm list --depth=0 2>/dev/null | wc -l) packages installed"
else
    echo "Workspace: Not found"
fi
EOF

chmod +x ~/dev-status.sh

log_success "Project environment configured"

# =============================================================================
# Service Management
# =============================================================================
log_step "Setting up service management..."

# Create systemd service for VS Code Server
sudo tee /etc/systemd/system/vscode-server.service > /dev/null << EOF
[Unit]
Description=VS Code Server
After=network.target

[Service]
Type=simple
User=$USER
WorkingDirectory=$WORKSPACE
ExecStart=/usr/bin/code-server --config $HOME/.config/code-server/config.yaml
Restart=always
RestartSec=10
Environment=NODE_ENV=development

[Install]
WantedBy=multi-user.target
EOF

# Create systemd service for Cursor Server
sudo tee /etc/systemd/system/cursor-server.service > /dev/null << EOF
[Unit]
Description=Cursor Server
After=network.target

[Service]
Type=simple
User=$USER
WorkingDirectory=$WORKSPACE
ExecStart=$HOME/start-cursor-server.sh
Restart=always
RestartSec=10
Environment=NODE_ENV=development

[Install]
WantedBy=multi-user.target
EOF

# Create systemd service for Next.js
sudo tee /etc/systemd/system/nextjs-dev.service > /dev/null << EOF
[Unit]
Description=Next.js Development Server
After=network.target

[Service]
Type=simple
User=$USER
WorkingDirectory=$WORKSPACE
ExecStart=/usr/bin/npm run dev
Restart=always
RestartSec=10
Environment=NODE_ENV=development
Environment=PORT=3001

[Install]
WantedBy=multi-user.target
EOF

# Reload systemd and enable services
sudo systemctl daemon-reload
sudo systemctl enable vscode-server.service
sudo systemctl enable cursor-server.service
sudo systemctl enable nextjs-dev.service

log_success "Service management configured"

# =============================================================================
# Final Setup and Verification
# =============================================================================
log_step "Performing final setup and verification..."

# Set proper permissions
sudo chown -R $USER:$USER ~/.vscode-server
sudo chown -R $USER:$USER ~/.cursor-server
sudo chown -R $USER:$USER $WORKSPACE

# Create completion marker
touch ~/.dev-setup-complete
echo "$(date)" > ~/.dev-setup-complete

# =============================================================================
# Summary and Instructions
# =============================================================================
log_step "Setup completed successfully!"

echo ""
echo -e "${GREEN}================================================================================${NC}"
echo -e "${GREEN}                    DEVELOPMENT ENVIRONMENT READY!${NC}"
echo -e "${GREEN}================================================================================${NC}"
echo ""
echo -e "${CYAN}Services Available:${NC}"
echo -e "  • VS Code Server: http://$IP_ADDRESS:8080"
echo -e "  • Cursor Server: http://$IP_ADDRESS:26054"
echo -e "  • Next.js App: http://$IP_ADDRESS:3000"
echo -e "  • Next.js Dev: http://$IP_ADDRESS:3001"
echo ""
echo -e "${CYAN}Useful Commands:${NC}"
echo -e "  • Check status: ~/dev-status.sh"
echo -e "  • Start all: ~/start-dev-environment.sh"
echo -e "  • Stop all: ~/stop-dev-environment.sh"
echo -e "  • Start VS Code: ~/start-vscode-server.sh"
echo -e "  • Start Cursor: ~/start-cursor-server.sh"
echo ""
echo -e "${CYAN}Service Management:${NC}"
echo -e "  • Start VS Code: sudo systemctl start vscode-server"
echo -e "  • Start Cursor: sudo systemctl start cursor-server"
echo -e "  • Start Next.js: sudo systemctl start nextjs-dev"
echo -e "  • Check status: sudo systemctl status vscode-server cursor-server nextjs-dev"
echo ""
echo -e "${CYAN}Development Tools Installed:${NC}"
echo -e "  • Node.js $(node --version) with npm $(npm --version)"
echo -e "  • Python $(python3 --version)"
echo -e "  • Docker $(docker --version 2>/dev/null || echo 'Not installed')"
echo -e "  • Git $(git --version)"
echo -e "  • VS Code Server"
echo -e "  • Cursor Server (placeholder)"
echo -e "  • Database tools (PostgreSQL, Redis, SQLite)"
echo -e "  • Monitoring tools (htop, glances, etc.)"
echo ""
echo -e "${CYAN}Next Steps:${NC}"
echo -e "  1. Access VS Code Server at http://$IP_ADDRESS:8080"
echo -e "  2. Install Cursor when it becomes available"
echo -e "  3. Configure Tailscale for secure remote access"
echo -e "  4. Start developing with: ~/start-dev-environment.sh"
echo ""
echo -e "${GREEN}================================================================================${NC}"

# Log completion
log_success "Development environment setup completed!"
log_info "You can now access your development environment remotely"
log_info "VS Code Server is ready on port 8080"
log_info "Cursor Server is ready on port 26054 (placeholder)"
log_info "Next.js development server is ready on port 3001"

exit 0