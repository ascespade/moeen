#!/bin/bash
echo "🚀 Optimizing remote server environment..."

# Update system
echo "📦 Updating system..."
sudo apt update && sudo apt upgrade -y

# Install essential tools
echo "🛠️ Installing essential tools..."
sudo apt install -y curl wget git vim nano htop tree unzip zip jq build-essential

# Install Node.js
echo "📦 Installing Node.js..."
curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install Python
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

# Configure SSH for better performance
echo "🔧 Optimizing SSH..."
sudo tee -a /etc/ssh/sshd_config > /dev/null << 'EOF'

# Performance optimizations
TCPKeepAlive yes
ClientAliveInterval 30
ClientAliveCountMax 6
MaxSessions 20
MaxStartups 20:30:100
EOF

sudo systemctl restart sshd

# Create development workspace
echo "📁 Creating workspace..."
mkdir -p ~/workspace ~/projects ~/scripts

# Set up useful aliases
echo "🔧 Setting up aliases..."
cat >> ~/.bashrc << 'EOF'

# Development aliases
alias ll='ls -alF'
alias la='ls -A'
alias l='ls -CF'
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
alias proj='cd ~/projects'
alias scripts='cd ~/scripts'
EOF

# Install global npm packages
echo "📦 Installing global packages..."
npm install -g nodemon pm2 typescript ts-node @types/node eslint prettier

# Set up PM2
echo "⚙️ Setting up PM2..."
pm2 startup
pm2 save

# Ensure Tailscale runs as service
echo "🌐 Ensuring Tailscale service..."
sudo systemctl enable tailscaled
sudo systemctl start tailscaled

# Create monitoring script
echo "📊 Creating monitoring script..."
cat > ~/scripts/monitor.sh << 'EOF'
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

chmod +x ~/scripts/monitor.sh

echo "✅ Server optimization complete!"
echo "🔄 Please reconnect to apply changes"
