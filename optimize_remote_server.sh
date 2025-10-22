#!/bin/bash
echo "🚀 Optimizing remote server environment..."

# Update system packages
echo "📦 Updating system packages..."
sudo apt update && sudo apt upgrade -y

# Install essential development tools
echo "🛠️ Installing development tools..."
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
    lsb-release

# Install Node.js (LTS version)
echo "📦 Installing Node.js..."
curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install Python and pip
echo "🐍 Installing Python..."
sudo apt install -y python3 python3-pip python3-venv

# Install Docker
echo "🐳 Installing Docker..."
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker ubuntu
rm get-docker.sh

# Install Docker Compose
echo "🐳 Installing Docker Compose..."
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Configure SSH server for better performance
echo "🔧 Optimizing SSH server..."
sudo tee -a /etc/ssh/sshd_config > /dev/null << 'EOF'

# Performance optimizations
TCPKeepAlive yes
ClientAliveInterval 30
ClientAliveCountMax 6
MaxSessions 20
MaxStartups 20:30:100

# Security improvements
PermitRootLogin no
PasswordAuthentication no
PubkeyAuthentication yes
AuthorizedKeysFile .ssh/authorized_keys
PermitEmptyPasswords no
ChallengeResponseAuthentication no
UsePAM yes
X11Forwarding no
PrintMotd no
AcceptEnv LANG LC_*
Subsystem sftp /usr/lib/openssh/sftp-server
EOF

# Restart SSH service
sudo systemctl restart sshd

# Configure system limits
echo "⚙️ Configuring system limits..."
sudo tee -a /etc/security/limits.conf > /dev/null << 'EOF'
ubuntu soft nofile 65536
ubuntu hard nofile 65536
ubuntu soft nproc 32768
ubuntu hard nproc 32768
EOF

# Configure kernel parameters for better performance
echo "⚙️ Optimizing kernel parameters..."
sudo tee -a /etc/sysctl.conf > /dev/null << 'EOF'
# Network optimizations
net.core.rmem_max = 16777216
net.core.wmem_max = 16777216
net.ipv4.tcp_rmem = 4096 65536 16777216
net.ipv4.tcp_wmem = 4096 65536 16777216
net.core.netdev_max_backlog = 5000
net.ipv4.tcp_congestion_control = bbr

# File system optimizations
fs.file-max = 2097152
vm.swappiness = 10
vm.dirty_ratio = 15
vm.dirty_background_ratio = 5
EOF

# Apply kernel parameters
sudo sysctl -p

# Create development workspace
echo "📁 Creating development workspace..."
mkdir -p ~/workspace
mkdir -p ~/projects
mkdir -p ~/scripts

# Set up useful aliases
echo "🔧 Setting up aliases..."
cat >> ~/.bashrc << 'EOF'

# Development aliases
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
alias gl='git log --oneline'
alias gd='git diff'

# Docker aliases
alias d='docker'
alias dc='docker-compose'
alias dps='docker ps'
alias dpa='docker ps -a'
alias di='docker images'
alias dex='docker exec -it'

# System aliases
alias h='history'
alias c='clear'
alias df='df -h'
alias du='du -h'
alias free='free -h'
alias ps='ps aux'
alias top='htop'

# Network aliases
alias ports='netstat -tuln'
alias myip='curl -s ifconfig.me'
alias ping='ping -c 4'

# Development shortcuts
alias dev='cd ~/workspace'
alias proj='cd ~/projects'
alias scripts='cd ~/scripts'
EOF

# Reload bashrc
source ~/.bashrc

# Install useful global npm packages
echo "📦 Installing global npm packages..."
npm install -g \
    nodemon \
    pm2 \
    typescript \
    ts-node \
    @types/node \
    eslint \
    prettier \
    concurrently

# Set up PM2 for process management
echo "⚙️ Setting up PM2..."
pm2 startup
pm2 save

# Create a systemd service for Tailscale to ensure it stays running
echo "🌐 Setting up Tailscale service..."
sudo systemctl enable tailscaled
sudo systemctl start tailscaled

# Create a monitoring script
echo "📊 Creating monitoring script..."
cat > ~/scripts/server-monitor.sh << 'EOF'
#!/bin/bash
echo "=== Server Status Monitor ==="
echo "Date: $(date)"
echo "Uptime: $(uptime)"
echo "Memory Usage:"
free -h
echo "Disk Usage:"
df -h
echo "CPU Usage:"
top -bn1 | grep "Cpu(s)"
echo "Network Connections:"
ss -tuln | head -10
echo "Running Services:"
systemctl list-units --type=service --state=running | grep -E "(ssh|tailscale|docker)"
echo "=== End Monitor ==="
EOF

chmod +x ~/scripts/server-monitor.sh

# Create a backup script
echo "💾 Creating backup script..."
cat > ~/scripts/backup.sh << 'EOF'
#!/bin/bash
BACKUP_DIR="/home/ubuntu/backups"
DATE=$(date +%Y%m%d_%H%M%S)
mkdir -p $BACKUP_DIR

echo "Creating backup: backup_$DATE.tar.gz"
tar -czf $BACKUP_DIR/backup_$DATE.tar.gz \
    --exclude='node_modules' \
    --exclude='.git' \
    --exclude='backups' \
    ~/workspace ~/projects ~/scripts

echo "Backup completed: $BACKUP_DIR/backup_$DATE.tar.gz"
EOF

chmod +x ~/scripts/backup.sh

echo "✅ Server optimization complete!"
echo "📋 Summary of improvements:"
echo "  - Updated system packages"
echo "  - Installed development tools (Node.js, Python, Docker)"
echo "  - Optimized SSH server configuration"
echo "  - Configured system limits and kernel parameters"
echo "  - Set up useful aliases and shortcuts"
echo "  - Installed global npm packages"
echo "  - Set up PM2 for process management"
echo "  - Created monitoring and backup scripts"
echo "  - Ensured Tailscale runs as a service"
echo ""
echo "🔄 Please restart your SSH connection to apply all changes."
echo "💡 Use 'server-monitor.sh' to check server status"
echo "💾 Use 'backup.sh' to create backups"
