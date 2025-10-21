#!/bin/bash

# =============================================================================
# Remote Development Environment Setup Script
# =============================================================================
# This script sets up a complete remote development environment for Cursor
# with all necessary tools, libraries, and configurations for the project.
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

# Check if running as root
if [[ $EUID -eq 0 ]]; then
   log_error "This script should not be run as root for security reasons"
   exit 1
fi

# =============================================================================
# System Update and Basic Tools
# =============================================================================
log_step "Updating system packages and installing basic tools..."

# Update package lists
sudo apt update && sudo apt upgrade -y

# Install essential system tools
sudo apt install -y \
    curl \
    wget \
    git \
    vim \
    nano \
    htop \
    tree \
    unzip \
    zip \
    jq \
    build-essential \
    software-properties-common \
    apt-transport-https \
    ca-certificates \
    gnupg \
    lsb-release \
    net-tools \
    openssh-server \
    ufw \
    fail2ban \
    htop \
    neofetch \
    tmux \
    screen \
    rsync \
    sshfs \
    fuse \
    git-lfs

log_success "System packages updated and basic tools installed"

# =============================================================================
# Node.js Installation (Latest LTS)
# =============================================================================
log_step "Installing Node.js (Latest LTS)..."

# Remove any existing Node.js installations
sudo apt remove -y nodejs npm || true

# Install Node.js using NodeSource repository
curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
sudo apt install -y nodejs

# Verify installation
NODE_VERSION=$(node --version)
NPM_VERSION=$(npm --version)
log_success "Node.js $NODE_VERSION and npm $NPM_VERSION installed"

# Install global npm packages
log_step "Installing global npm packages..."
sudo npm install -g \
    yarn \
    pnpm \
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
    playwright \
    @playwright/test

log_success "Global npm packages installed"

# =============================================================================
# Python Installation
# =============================================================================
log_step "Installing Python and development tools..."

# Install Python 3.11+ and pip
sudo apt install -y \
    python3.11 \
    python3.11-venv \
    python3.11-dev \
    python3-pip \
    python3-setuptools \
    python3-wheel

# Create symlinks for python and pip
sudo ln -sf /usr/bin/python3.11 /usr/bin/python
sudo ln -sf /usr/bin/python3.11 /usr/bin/python3

# Install pip packages
pip3 install --user \
    pip \
    setuptools \
    wheel \
    virtualenv \
    pipenv \
    poetry \
    black \
    flake8 \
    pytest \
    pytest-cov \
    mypy \
    jupyter \
    ipython \
    requests \
    beautifulsoup4 \
    pandas \
    numpy \
    matplotlib \
    seaborn

log_success "Python 3.11 and development tools installed"

# =============================================================================
# Docker Installation
# =============================================================================
log_step "Installing Docker and Docker Compose..."

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
rm get-docker.sh

# Add current user to docker group
sudo usermod -aG docker $USER

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Verify installation
DOCKER_VERSION=$(docker --version)
COMPOSE_VERSION=$(docker-compose --version)
log_success "Docker $DOCKER_VERSION and Docker Compose $COMPOSE_VERSION installed"

# =============================================================================
# VS Code Server Installation
# =============================================================================
log_step "Installing VS Code Server..."

# Create directory for VS Code Server
mkdir -p ~/.vscode-server

# Download and install VS Code Server
VSCODE_SERVER_VERSION="latest"
VSCODE_SERVER_URL="https://update.code.visualstudio.com/latest/server-linux-x64/stable"

# Get the latest version
VSCODE_SERVER_VERSION=$(curl -s https://api.github.com/repos/microsoft/vscode/releases/latest | jq -r '.tag_name' | sed 's/v//')

# Download VS Code Server
wget -O vscode-server-linux-x64.tar.gz "https://update.code.visualstudio.com/${VSCODE_SERVER_VERSION}/server-linux-x64/stable"
tar -xzf vscode-server-linux-x64.tar.gz -C ~/.vscode-server --strip-components=1
rm vscode-server-linux-x64.tar.gz

# Create startup script
cat > ~/.vscode-server/start-server.sh << 'EOF'
#!/bin/bash
export VSCODE_AGENT_FOLDER=$HOME/.vscode-server
export VSCODE_SERVER_PATH=$HOME/.vscode-server/bin
export VSCODE_SERVER_PORT=${VSCODE_SERVER_PORT:-8080}

# Start VS Code Server
exec "$VSCODE_SERVER_PATH/code-server" \
    --host 0.0.0.0 \
    --port $VSCODE_SERVER_PORT \
    --auth none \
    --disable-telemetry \
    --disable-update-check \
    --disable-workspace-trust \
    --extensions-dir $HOME/.vscode-server/extensions \
    --user-data-dir $HOME/.vscode-server/data \
    --log trace
EOF

chmod +x ~/.vscode-server/start-server.sh

log_success "VS Code Server installed and configured"

# =============================================================================
# Cursor CLI Installation
# =============================================================================
log_step "Installing Cursor CLI..."

# Create directory for Cursor
mkdir -p ~/.cursor

# Download Cursor CLI (if available)
# Note: Cursor CLI might not be publicly available yet
# This is a placeholder for when it becomes available
if command -v cursor &> /dev/null; then
    log_success "Cursor CLI already installed"
else
    log_warning "Cursor CLI not yet publicly available. Installing alternative tools..."
    
    # Install alternative development tools
    sudo npm install -g \
        @cursor/cli \
        @cursor/remote \
        code-server \
        code-server-cli || true
fi

# =============================================================================
# Database Tools
# =============================================================================
log_step "Installing database tools..."

# Install PostgreSQL client
sudo apt install -y postgresql-client

# Install Redis tools
sudo apt install -y redis-tools

# Install MongoDB tools
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu $(lsb_release -cs)/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
sudo apt update
sudo apt install -y mongodb-mongosh

# Install SQLite tools
sudo apt install -y sqlite3

log_success "Database tools installed"

# =============================================================================
# Development Environment Setup
# =============================================================================
log_step "Setting up development environment..."

# Create development directory structure
mkdir -p ~/projects
mkdir -p ~/workspace
mkdir -p ~/.config
mkdir -p ~/.local/bin

# Set up Git configuration
if ! git config --global user.name &> /dev/null; then
    git config --global user.name "Developer"
    git config --global user.email "developer@example.com"
fi

# Configure Git for better performance
git config --global init.defaultBranch main
git config --global pull.rebase false
git config --global core.autocrlf input
git config --global core.safecrlf true

# Install useful Git hooks
git config --global init.templateDir ~/.git-template
mkdir -p ~/.git-template/hooks

# =============================================================================
# Shell Configuration
# =============================================================================
log_step "Configuring shell environment..."

# Install Oh My Zsh
if [ ! -d "$HOME/.oh-my-zsh" ]; then
    sh -c "$(curl -fsSL https://raw.github.com/ohmyzsh/ohmyzsh/master/tools/install.sh)" "" --unattended
fi

# Install useful Zsh plugins
git clone https://github.com/zsh-users/zsh-autosuggestions ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-autosuggestions
git clone https://github.com/zsh-users/zsh-syntax-highlighting.git ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-syntax-highlighting
git clone https://github.com/zsh-users/zsh-completions ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-completions

# Configure Zsh
cat >> ~/.zshrc << 'EOF'

# Development environment aliases
alias ll='ls -alF'
alias la='ls -A'
alias l='ls -CF'
alias ..='cd ..'
alias ...='cd ../..'
alias ....='cd ../../..'
alias grep='grep --color=auto'
alias fgrep='fgrep --color=auto'
alias egrep='egrep --color=auto'

# Git aliases
alias gs='git status'
alias ga='git add'
alias gc='git commit'
alias gp='git push'
alias gl='git pull'
alias gd='git diff'
alias gb='git branch'
alias gco='git checkout'
alias gcm='git checkout main'
alias gcb='git checkout -b'

# Node.js aliases
alias ni='npm install'
alias nr='npm run'
alias ns='npm start'
alias nt='npm test'
alias nb='npm run build'
alias nd='npm run dev'

# Docker aliases
alias d='docker'
alias dc='docker-compose'
alias dps='docker ps'
alias dpsa='docker ps -a'
alias di='docker images'
alias drm='docker rm'
alias drmi='docker rmi'
alias dstop='docker stop'
alias dstart='docker start'
alias drestart='docker restart'

# Development shortcuts
alias projects='cd ~/projects'
alias workspace='cd ~/workspace'
alias dev='cd ~/projects && ls -la'

# VS Code Server
alias vscode='~/.vscode-server/start-server.sh'

# Environment variables
export PATH="$HOME/.local/bin:$PATH"
export PATH="$HOME/.yarn/bin:$PATH"
export PATH="$HOME/.config/yarn/global/node_modules/.bin:$PATH"

# Node.js environment
export NODE_ENV=development
export NPM_CONFIG_PREFIX="$HOME/.npm-global"

# Python environment
export PYTHONPATH="$HOME/.local/lib/python3.11/site-packages:$PYTHONPATH"

# Editor
export EDITOR='code'
export VISUAL='code'

# History
export HISTSIZE=10000
export SAVEHIST=10000
export HISTFILE=~/.zsh_history
setopt SHARE_HISTORY
setopt HIST_IGNORE_DUPS
setopt HIST_IGNORE_SPACE

# Auto-completion
autoload -U compinit && compinit
zstyle ':completion:*' matcher-list 'm:{a-zA-Z}={A-Za-z}'
zstyle ':completion:*' list-colors "${(s.:.)LS_COLORS}"

# Plugins
plugins=(
    git
    docker
    docker-compose
    node
    npm
    yarn
    python
    pip
    zsh-autosuggestions
    zsh-syntax-highlighting
    zsh-completions
)

EOF

log_success "Shell environment configured"

# =============================================================================
# Project Dependencies Installation
# =============================================================================
log_step "Installing project dependencies..."

# Navigate to project directory
cd /workspace

# Install Node.js dependencies
if [ -f "package.json" ]; then
    log_info "Installing Node.js dependencies..."
    npm install
    
    # Install additional development dependencies
    npm install -D \
        @types/node \
        @types/react \
        @types/react-dom \
        @typescript-eslint/eslint-plugin \
        @typescript-eslint/parser \
        eslint \
        eslint-config-next \
        eslint-config-prettier \
        eslint-plugin-prettier \
        prettier \
        typescript \
        vitest \
        @vitest/ui \
        @playwright/test \
        playwright \
        husky \
        lint-staged
fi

# Install Python dependencies if requirements.txt exists
if [ -f "requirements.txt" ]; then
    log_info "Installing Python dependencies..."
    pip3 install -r requirements.txt
fi

log_success "Project dependencies installed"

# =============================================================================
# Security Configuration
# =============================================================================
log_step "Configuring security settings..."

# Configure UFW firewall
sudo ufw --force enable
sudo ufw allow ssh
sudo ufw allow 3000:3001/tcp  # Next.js development ports
sudo ufw allow 8080/tcp       # VS Code Server port
sudo ufw allow 5432/tcp       # PostgreSQL port
sudo ufw allow 6379/tcp       # Redis port

# Configure fail2ban
sudo systemctl enable fail2ban
sudo systemctl start fail2ban

# Configure SSH
sudo sed -i 's/#PasswordAuthentication yes/PasswordAuthentication no/' /etc/ssh/sshd_config
sudo sed -i 's/#PubkeyAuthentication yes/PubkeyAuthentication yes/' /etc/ssh/sshd_config
sudo systemctl restart ssh

log_success "Security settings configured"

# =============================================================================
# Service Configuration
# =============================================================================
log_step "Configuring services..."

# Create systemd service for VS Code Server
sudo tee /etc/systemd/system/vscode-server.service > /dev/null << EOF
[Unit]
Description=VS Code Server
After=network.target

[Service]
Type=simple
User=$USER
WorkingDirectory=/workspace
ExecStart=$HOME/.vscode-server/start-server.sh
Restart=always
RestartSec=10
Environment=VSCODE_SERVER_PORT=8080

[Install]
WantedBy=multi-user.target
EOF

# Enable and start VS Code Server service
sudo systemctl daemon-reload
sudo systemctl enable vscode-server.service
sudo systemctl start vscode-server.service

# Create systemd service for the Next.js application
sudo tee /etc/systemd/system/nextjs-app.service > /dev/null << EOF
[Unit]
Description=Next.js Application
After=network.target

[Service]
Type=simple
User=$USER
WorkingDirectory=/workspace
ExecStart=/usr/bin/npm run start
Restart=always
RestartSec=10
Environment=NODE_ENV=production
Environment=PORT=3000

[Install]
WantedBy=multi-user.target
EOF

log_success "Services configured"

# =============================================================================
# Development Tools Configuration
# =============================================================================
log_step "Configuring development tools..."

# Create VS Code settings
mkdir -p ~/.vscode-server/data/User
cat > ~/.vscode-server/data/User/settings.json << 'EOF'
{
    "editor.formatOnSave": true,
    "editor.codeActionsOnSave": {
        "source.fixAll.eslint": true,
        "source.organizeImports": true
    },
    "typescript.preferences.importModuleSpecifier": "relative",
    "typescript.suggest.autoImports": true,
    "typescript.updateImportsOnFileMove.enabled": "always",
    "editor.tabSize": 2,
    "editor.insertSpaces": true,
    "files.eol": "\n",
    "files.trimTrailingWhitespace": true,
    "files.insertFinalNewline": true,
    "emmet.includeLanguages": {
        "javascript": "javascriptreact",
        "typescript": "typescriptreact"
    },
    "tailwindCSS.includeLanguages": {
        "javascript": "javascript",
        "html": "HTML"
    },
    "tailwindCSS.experimental.classRegex": [
        ["cva\\(([^)]*)\\)", "[\"'`]([^\"'`]*).*?[\"'`]"],
        ["cx\\(([^)]*)\\)", "(?:'|\"|`)([^']*)(?:'|\"|`)"]
    ],
    "eslint.workingDirectories": ["/workspace"],
    "eslint.validate": [
        "javascript",
        "javascriptreact",
        "typescript",
        "typescriptreact"
    ],
    "git.enableSmartCommit": true,
    "git.confirmSync": false,
    "terminal.integrated.defaultProfile.linux": "zsh",
    "workbench.colorTheme": "Default Dark+",
    "extensions.autoUpdate": true,
    "telemetry.telemetryLevel": "off"
}
EOF

# Create VS Code extensions list
cat > ~/.vscode-server/data/extensions.txt << 'EOF'
ms-vscode.vscode-typescript-next
bradlc.vscode-tailwindcss
esbenp.prettier-vscode
ms-vscode.vscode-eslint
ms-vscode.vscode-json
ms-vscode.vscode-css
ms-vscode.vscode-html
ms-vscode.vscode-markdown
ms-vscode.vscode-python
ms-vscode.vscode-docker
ms-vscode.vscode-git
ms-vscode.vscode-github
ms-vscode.vscode-npm
ms-vscode.vscode-yaml
ms-vscode.vscode-xml
ms-vscode.vscode-toml
ms-vscode.vscode-ini
ms-vscode.vscode-sql
ms-vscode.vscode-sqlite
ms-vscode.vscode-postgresql
ms-vscode.vscode-mysql
ms-vscode.vscode-mongodb
ms-vscode.vscode-redis
ms-vscode.vscode-json
ms-vscode.vscode-xml
ms-vscode.vscode-yaml
ms-vscode.vscode-toml
ms-vscode.vscode-ini
ms-vscode.vscode-sql
ms-vscode.vscode-sqlite
ms-vscode.vscode-postgresql
ms-vscode.vscode-mysql
ms-vscode.vscode-mongodb
ms-vscode.vscode-redis
ms-vscode.vscode-json
ms-vscode.vscode-xml
ms-vscode.vscode-yaml
ms-vscode.vscode-toml
ms-vscode.vscode-ini
ms-vscode.vscode-sql
ms-vscode.vscode-sqlite
ms-vscode.vscode-postgresql
ms-vscode.vscode-mysql
ms-vscode.vscode-mongodb
ms-vscode.vscode-redis
EOF

log_success "Development tools configured"

# =============================================================================
# Final Setup and Verification
# =============================================================================
log_step "Performing final setup and verification..."

# Set proper permissions
sudo chown -R $USER:$USER ~/.vscode-server
sudo chown -R $USER:$USER ~/.cursor
sudo chown -R $USER:$USER /workspace

# Create useful scripts
cat > ~/start-dev.sh << 'EOF'
#!/bin/bash
echo "Starting development environment..."
cd /workspace

# Start VS Code Server in background
nohup ~/.vscode-server/start-server.sh > ~/.vscode-server.log 2>&1 &

# Start Next.js development server
npm run dev &
EOF

chmod +x ~/start-dev.sh

cat > ~/stop-dev.sh << 'EOF'
#!/bin/bash
echo "Stopping development environment..."
pkill -f "code-server"
pkill -f "next dev"
EOF

chmod +x ~/stop-dev.sh

# Create project status script
cat > ~/project-status.sh << 'EOF'
#!/bin/bash
echo "=== Development Environment Status ==="
echo "Node.js: $(node --version)"
echo "npm: $(npm --version)"
echo "Python: $(python3 --version)"
echo "Docker: $(docker --version)"
echo "Git: $(git --version)"
echo ""
echo "=== Services Status ==="
systemctl is-active vscode-server.service
systemctl is-active nextjs-app.service
echo ""
echo "=== Port Status ==="
netstat -tlnp | grep -E ':(3000|3001|8080|5432|6379)'
echo ""
echo "=== Project Dependencies ==="
cd /workspace
if [ -f "package.json" ]; then
    echo "Node.js dependencies: $(npm list --depth=0 2>/dev/null | wc -l) packages"
fi
if [ -f "requirements.txt" ]; then
    echo "Python dependencies: $(pip3 list | wc -l) packages"
fi
EOF

chmod +x ~/project-status.sh

# =============================================================================
# Summary and Instructions
# =============================================================================
log_step "Setup completed successfully!"

echo ""
echo -e "${GREEN}================================================================================${NC}"
echo -e "${GREEN}                    REMOTE DEVELOPMENT ENVIRONMENT READY!${NC}"
echo -e "${GREEN}================================================================================${NC}"
echo ""
echo -e "${CYAN}Services Available:${NC}"
echo -e "  • VS Code Server: http://$(hostname -I | awk '{print $1}'):8080"
echo -e "  • Next.js App: http://$(hostname -I | awk '{print $1}'):3000"
echo -e "  • Next.js Dev: http://$(hostname -I | awk '{print $1}'):3001"
echo ""
echo -e "${CYAN}Useful Commands:${NC}"
echo -e "  • Check status: ~/project-status.sh"
echo -e "  • Start dev: ~/start-dev.sh"
echo -e "  • Stop dev: ~/stop-dev.sh"
echo -e "  • VS Code Server: ~/.vscode-server/start-server.sh"
echo ""
echo -e "${CYAN}Development Tools Installed:${NC}"
echo -e "  • Node.js $(node --version) with npm $(npm --version)"
echo -e "  • Python $(python3 --version)"
echo -e "  • Docker $(docker --version)"
echo -e "  • Git $(git --version)"
echo -e "  • VS Code Server"
echo -e "  • Database tools (PostgreSQL, Redis, MongoDB, SQLite)"
echo ""
echo -e "${CYAN}Next Steps:${NC}"
echo -e "  1. Access VS Code Server at http://$(hostname -I | awk '{print $1}'):8080"
echo -e "  2. Install Cursor when it becomes available"
echo -e "  3. Configure your SSH keys for secure access"
echo -e "  4. Start developing with: cd /workspace && npm run dev"
echo ""
echo -e "${GREEN}================================================================================${NC}"

# Log completion
log_success "Remote development environment setup completed!"
log_info "You can now access your development environment remotely"
log_info "VS Code Server is running on port 8080"
log_info "Next.js development server is ready on port 3001"

# Create a completion marker
touch ~/.remote-dev-setup-complete
echo "$(date)" > ~/.remote-dev-setup-complete

exit 0