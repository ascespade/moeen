#!/bin/bash
echo "Setting up Remote Development Environment"

# Update system
echo "Updating system..."
sudo apt update && sudo apt upgrade -y

# Install development tools
echo "Installing development tools..."
sudo apt install -y curl wget git vim nano htop tree unzip zip jq build-essential tmux

# Install Node.js
echo "Installing Node.js..."
curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install Python
echo "Installing Python..."
sudo apt install -y python3 python3-pip python3-venv

# Install Docker
echo "Installing Docker..."
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker ubuntu
rm get-docker.sh

# Install Docker Compose
echo "Installing Docker Compose..."
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Install VS Code Server
echo "Installing VS Code Server..."
curl -fsSL https://code-server.dev/install.sh | sh

# Create workspace
echo "Creating workspace..."
mkdir -p ~/workspace/{projects,scripts,tools,backups}
mkdir -p ~/workspace/projects/{web,api,mobile,data}

# Set up aliases
echo "Setting up aliases..."
cat >> ~/.bashrc << 'EOF'

# Development aliases
alias ll='ls -alF --color=auto'
alias la='ls -A --color=auto'
alias l='ls -CF --color=auto'
alias ..='cd ..'
alias ...='cd ../..'
alias grep='grep --color=auto'
alias h='history'
alias c='clear'

# Git aliases
alias gs='git status'
alias ga='git add'
alias gc='git commit'
alias gp='git push'
alias gl='git log --oneline'

# Docker aliases
alias d='docker'
alias dc='docker-compose'
alias dps='docker ps'
alias dpa='docker ps -a'

# Development shortcuts
alias dev='cd ~/workspace'
alias proj='cd ~/workspace/projects'
alias scripts='cd ~/workspace/scripts'

# Server management
alias server-status='~/workspace/scripts/monitor.sh'
alias server-backup='~/workspace/scripts/backup.sh'
EOF

# Create monitoring script
echo "Creating monitoring script..."
mkdir -p ~/workspace/scripts
cat > ~/workspace/scripts/monitor.sh << 'EOF'
#!/bin/bash
echo "=== Server Status ==="
echo "Date: $(date)"
echo "Uptime: $(uptime)"
echo "Memory:"
free -h
echo "Disk:"
df -h
echo "CPU:"
top -bn1 | grep "Cpu(s)"
echo "Services:"
systemctl is-active ssh tailscaled docker
EOF

chmod +x ~/workspace/scripts/monitor.sh

# Create backup script
cat > ~/workspace/scripts/backup.sh << 'EOF'
#!/bin/bash
BACKUP_DIR="C:\Users\WA Hotels/workspace/backups"
DATE=
mkdir -p ""

echo "Creating backup: backup_.tar.gz"
tar -czf "/backup_.tar.gz" \
    --exclude='node_modules' \
    --exclude='.git' \
    --exclude='dist' \
    --exclude='build' \
    --exclude='backups' \
    ~/workspace/projects ~/workspace/scripts

echo "Backup completed: /backup_.tar.gz"
EOF

chmod +x ~/workspace/scripts/backup.sh

# Install global npm packages
echo "Installing global packages..."
npm install -g typescript ts-node @types/node nodemon pm2 eslint prettier

# Set up PM2
echo "Setting up PM2..."
pm2 startup
pm2 save

# Start code-server
echo "Starting VS Code Server..."
pm2 start code-server --name "code-server" -- --bind-addr 0.0.0.0:8080 --auth none
pm2 save

# Ensure Tailscale runs as service
echo "Ensuring Tailscale service..."
sudo systemctl enable tailscaled
sudo systemctl start tailscaled

# Reload bashrc
source ~/.bashrc

echo "Remote Development Environment Setup Complete!"
echo "VS Code Server: http://100.64.64.33:8080"
echo "Monitor: ~/workspace/scripts/monitor.sh"
echo "Backup: ~/workspace/scripts/backup.sh"
