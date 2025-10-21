#!/bin/bash

# Development Environment Setup Script
# This script sets up a complete development environment

echo "🚀 Setting up Development Environment..."

# Create project directories
mkdir -p /workspace/dev/{projects,scripts,configs,logs}
mkdir -p /workspace/dev/projects/{web,api,mobile,data}

# Set up Git configuration
git config --global user.name "Developer"
git config --global user.email "dev@cursor-dev-server.local"
git config --global init.defaultBranch main

# Create useful aliases
cat >> ~/.bashrc << 'EOF'

# Development aliases
alias ll='ls -alF'
alias la='ls -A'
alias l='ls -CF'
alias ..='cd ..'
alias ...='cd ../..'
alias grep='grep --color=auto'
alias fgrep='fgrep --color=auto'
alias egrep='egrep --color=auto'

# Development shortcuts
alias dev='cd /workspace/dev'
alias projects='cd /workspace/dev/projects'
alias logs='cd /workspace/dev/logs'
alias scripts='cd /workspace/dev/scripts'

# Git shortcuts
alias gs='git status'
alias ga='git add'
alias gc='git commit'
alias gp='git push'
alias gl='git log --oneline'

# Docker shortcuts
alias d='docker'
alias dc='docker-compose'
alias dps='docker ps'
alias di='docker images'

# Node.js shortcuts
alias ni='npm install'
alias ns='npm start'
alias nt='npm test'
alias nb='npm run build'

# Python shortcuts
alias py='python3'
alias pip='pip3'
alias venv='python3 -m venv'

# System shortcuts
alias top='htop'
alias df='df -h'
alias free='free -h'

EOF

# Create a sample project structure
cat > /workspace/dev/projects/README.md << 'EOF'
# Development Projects

This directory contains all your development projects.

## Structure:
- `web/` - Web development projects
- `api/` - API and backend projects  
- `mobile/` - Mobile app projects
- `data/` - Data science and ML projects

## Getting Started:
1. Navigate to the appropriate subdirectory
2. Create your project: `mkdir my-project && cd my-project`
3. Initialize git: `git init`
4. Start coding!

## Available Tools:
- Node.js 22.x
- Python 3.13
- Docker & Docker Compose
- Jupyter Notebook/Lab
- Git
- Vim, Nano editors
- Development tools (TypeScript, PM2, etc.)
EOF

# Create a development status script
cat > /workspace/dev/scripts/dev_status.sh << 'EOF'
#!/bin/bash

echo "🔧 Development Server Status"
echo "=========================="
echo "Hostname: $(hostname)"
echo "User: $(whoami)"
echo "Date: $(date)"
echo "Uptime: $(uptime)"
echo ""

echo "🌐 Network Status:"
echo "Tailscale IP: $(tailscale ip -4 2>/dev/null || echo 'Not connected')"
echo "Public IP: $(curl -s ifconfig.me 2>/dev/null || echo 'Not available')"
echo ""

echo "🐳 Docker Status:"
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}" 2>/dev/null || echo "Docker not running"
echo ""

echo "📦 Node.js Status:"
node --version 2>/dev/null || echo "Node.js not installed"
npm --version 2>/dev/null || echo "npm not installed"
echo ""

echo "🐍 Python Status:"
python3 --version 2>/dev/null || echo "Python not installed"
pip3 --version 2>/dev/null || echo "pip not installed"
echo ""

echo "📁 Disk Usage:"
df -h /workspace
echo ""

echo "💾 Memory Usage:"
free -h
echo ""

echo "🔌 Active Connections:"
ss -tuln | head -10
EOF

chmod +x /workspace/dev/scripts/dev_status.sh

echo "✅ Development environment setup complete!"
echo "Run 'source ~/.bashrc' to reload your shell configuration"
echo "Run '/workspace/dev/scripts/dev_status.sh' to check server status"



