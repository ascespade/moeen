# Remote Development Setup - تحويل كل العمل للخادم البعيد
Write-Host "🚀 Remote Development Setup - إعداد التطوير البعيد" -ForegroundColor Green
Write-Host "===============================================" -ForegroundColor Green

# Function to fix Arabic encoding in PowerShell
function Fix-ArabicEncoding {
    Write-Host "🔧 Fixing Arabic encoding in PowerShell..." -ForegroundColor Yellow
    
    # Set console encoding to UTF-8
    [Console]::OutputEncoding = [System.Text.Encoding]::UTF8
    [Console]::InputEncoding = [System.Text.Encoding]::UTF8
    
    # Set PowerShell encoding
    $OutputEncoding = [System.Text.Encoding]::UTF8
    
    # Update PowerShell profile with encoding settings
    $encodingProfile = @"
# Arabic encoding fix
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
[Console]::InputEncoding = [System.Text.Encoding]::UTF8
`$OutputEncoding = [System.Text.Encoding]::UTF8

# Set culture for Arabic
[System.Threading.Thread]::CurrentThread.CurrentCulture = 'ar-SA'
[System.Threading.Thread]::CurrentThread.CurrentUICulture = 'ar-SA'

Write-Host "تم تحميل إعدادات العربية بنجاح!" -ForegroundColor Green
"@
    
    $profilePath = $PROFILE
    $profileDir = Split-Path $profilePath -Parent
    if (!(Test-Path $profileDir)) {
        New-Item -ItemType Directory -Path $profileDir -Force | Out-Null
    }
    
    Add-Content -Path $profilePath -Value $encodingProfile -Force
    Write-Host "✅ تم إصلاح مشكلة العربية في PowerShell" -ForegroundColor Green
}

# Function to create remote development environment
function Create-RemoteDevEnvironment {
    Write-Host "🌐 Creating remote development environment..." -ForegroundColor Yellow
    
    $remoteSetupScript = @"
#!/bin/bash
echo "🚀 Setting up Remote Development Environment"
echo "==========================================="

# Update system
echo "📦 Updating system..."
sudo apt update && sudo apt upgrade -y

# Install development tools
echo "🛠️ Installing development tools..."
sudo apt install -y \
    curl wget git vim nano htop tree unzip zip jq \
    build-essential software-properties-common \
    apt-transport-https ca-certificates gnupg lsb-release \
    tmux screen neofetch

# Install Node.js (LTS)
echo "📦 Installing Node.js..."
curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install Python and pip
echo "🐍 Installing Python..."
sudo apt install -y python3 python3-pip python3-venv python3-dev

# Install Docker
echo "🐳 Installing Docker..."
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker ubuntu
rm get-docker.sh

# Install Docker Compose
echo "🐳 Installing Docker Compose..."
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-`$(uname -s)-`$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Install VS Code Server (for remote development)
echo "💻 Installing VS Code Server..."
curl -fsSL https://code-server.dev/install.sh | sh

# Install useful development tools
echo "🔧 Installing additional tools..."
sudo apt install -y \
    ripgrep fd-find bat exa \
    zsh fish \
    neovim emacs \
    postgresql-client mysql-client \
    redis-tools

# Install global npm packages for development
echo "📦 Installing global npm packages..."
npm install -g \
    typescript ts-node @types/node \
    nodemon pm2 \
    eslint prettier \
    @vue/cli @angular/cli \
    create-react-app \
    express-generator \
    knex \
    prisma

# Install Python packages
echo "🐍 Installing Python packages..."
pip3 install --user \
    jupyter notebook \
    pandas numpy matplotlib \
    flask django fastapi \
    requests beautifulsoup4 \
    pytest black flake8

# Create development workspace structure
echo "📁 Creating workspace structure..."
mkdir -p ~/workspace/{projects,scripts,tools,backups}
mkdir -p ~/workspace/projects/{web,api,mobile,data,ai}
mkdir -p ~/workspace/scripts/{monitoring,backup,deployment}

# Configure Git globally
echo "🔧 Configuring Git..."
git config --global init.defaultBranch main
git config --global pull.rebase false
git config --global core.editor "nano"

# Set up useful aliases and functions
echo "⚙️ Setting up aliases..."
cat >> ~/.bashrc << 'EOF'

# Development aliases
alias ll='ls -alF --color=auto'
alias la='ls -A --color=auto'
alias l='ls -CF --color=auto'
alias ..='cd ..'
alias ...='cd ../..'
alias ....='cd ../../..'
alias grep='grep --color=auto'
alias fgrep='fgrep --color=auto'
alias egrep='egrep --color=auto'
alias h='history'
alias c='clear'
alias df='df -h'
alias du='du -h'
alias free='free -h'
alias ps='ps aux'
alias top='htop'

# Git aliases
alias gs='git status'
alias ga='git add'
alias gc='git commit'
alias gp='git push'
alias gl='git log --oneline --graph --decorate'
alias gd='git diff'
alias gb='git branch'
alias gco='git checkout'
alias gm='git merge'
alias gr='git rebase'

# Docker aliases
alias d='docker'
alias dc='docker-compose'
alias dps='docker ps'
alias dpa='docker ps -a'
alias di='docker images'
alias dex='docker exec -it'
alias dlog='docker logs'
alias dstop='docker stop'
alias dstart='docker start'
alias drm='docker rm'
alias drmi='docker rmi'

# Development shortcuts
alias dev='cd ~/workspace'
alias proj='cd ~/workspace/projects'
alias scripts='cd ~/workspace/scripts'
alias tools='cd ~/workspace/tools'

# Server management
alias server-status='~/workspace/scripts/monitoring/server-status.sh'
alias server-backup='~/workspace/scripts/backup/backup.sh'
alias server-update='sudo apt update && sudo apt upgrade -y'
alias server-restart='sudo reboot'

# Process management
alias pm2-list='pm2 list'
alias pm2-start='pm2 start'
alias pm2-stop='pm2 stop'
alias pm2-restart='pm2 restart'
alias pm2-delete='pm2 delete'
alias pm2-logs='pm2 logs'

# Network tools
alias ports='netstat -tuln'
alias myip='curl -s ifconfig.me'
alias ping='ping -c 4'

# File operations
alias find='find . -name'
alias grep='grep -r'
alias count='find . -type f | wc -l'
alias size='du -sh'

# Development functions
function new-project() {
    if [ -z "$1" ]; then
        echo "Usage: new-project <project-name> [type]"
        return 1
    fi
    
    local project_name="$1"
    local project_type="${2:-node}"
    local project_path="~/workspace/projects/$project_name"
    
    mkdir -p "$project_path"
    cd "$project_path"
    
    case $project_type in
        "node")
            npm init -y
            npm install -D typescript @types/node ts-node nodemon
            mkdir src
            echo 'console.log("Hello, World!");' > src/index.ts
            ;;
        "python")
            python3 -m venv venv
            mkdir src tests
            echo 'print("Hello, World!")' > src/main.py
            ;;
        "react")
            npx create-react-app . --template typescript
            ;;
        "vue")
            npm create vue@latest .
            ;;
    esac
    
    echo "Project '$project_name' created successfully!"
}

function backup-project() {
    local project_name="$1"
    local backup_dir="~/workspace/backups"
    local timestamp=$(date +%Y%m%d_%H%M%S)
    
    if [ -z "$project_name" ]; then
        echo "Usage: backup-project <project-name>"
        return 1
    fi
    
    tar -czf "$backup_dir/${project_name}_$timestamp.tar.gz" \
        --exclude='node_modules' \
        --exclude='.git' \
        --exclude='dist' \
        --exclude='build' \
        "~/workspace/projects/$project_name"
    
    echo "Backup created: $backup_dir/${project_name}_$timestamp.tar.gz"
}

# System monitoring
function system-info() {
    echo "=== System Information ==="
    echo "Date: $(date)"
    echo "Uptime: $(uptime)"
    echo "Memory Usage:"
    free -h
    echo "Disk Usage:"
    df -h
    echo "CPU Usage:"
    top -bn1 | grep "Cpu(s)"
    echo "Running Services:"
    systemctl list-units --type=service --state=running | grep -E "(ssh|tailscale|docker|code-server)"
}

EOF

# Create monitoring scripts
echo "📊 Creating monitoring scripts..."
mkdir -p ~/workspace/scripts/monitoring

cat > ~/workspace/scripts/monitoring/server-status.sh << 'EOF'
#!/bin/bash
echo "=== Remote Development Server Status ==="
echo "Date: $(date)"
echo "Uptime: $(uptime)"
echo ""
echo "Memory Usage:"
free -h
echo ""
echo "Disk Usage:"
df -h
echo ""
echo "CPU Usage:"
top -bn1 | grep "Cpu(s)"
echo ""
echo "Network Connections:"
ss -tuln | head -10
echo ""
echo "Running Services:"
systemctl list-units --type=service --state=running | grep -E "(ssh|tailscale|docker|code-server)"
echo ""
echo "Active Connections:"
who
echo ""
echo "Process Count:"
ps aux | wc -l
echo ""
echo "Docker Status:"
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
EOF

chmod +x ~/workspace/scripts/monitoring/server-status.sh

# Create backup script
mkdir -p ~/workspace/scripts/backup
cat > ~/workspace/scripts/backup/backup.sh << 'EOF'
#!/bin/bash
BACKUP_DIR="$HOME/workspace/backups"
DATE=$(date +%Y%m%d_%H%M%S)
mkdir -p "$BACKUP_DIR"

echo "Creating backup: backup_$DATE.tar.gz"
tar -czf "$BACKUP_DIR/backup_$DATE.tar.gz" \
    --exclude='node_modules' \
    --exclude='.git' \
    --exclude='dist' \
    --exclude='build' \
    --exclude='backups' \
    ~/workspace/projects ~/workspace/scripts

echo "Backup completed: $BACKUP_DIR/backup_$DATE.tar.gz"
echo "Backup size: $(du -h "$BACKUP_DIR/backup_$DATE.tar.gz" | cut -f1)"
EOF

chmod +x ~/workspace/scripts/backup/backup.sh

# Configure SSH for better performance
echo "🔧 Optimizing SSH configuration..."
sudo tee -a /etc/ssh/sshd_config > /dev/null << 'EOF'

# Performance optimizations
TCPKeepAlive yes
ClientAliveInterval 30
ClientAliveCountMax 6
MaxSessions 50
MaxStartups 50:30:100

# Security improvements
PermitRootLogin no
PasswordAuthentication no
PubkeyAuthentication yes
AuthorizedKeysFile .ssh/authorized_keys
PermitEmptyPasswords no
ChallengeResponseAuthentication no
UsePAM yes
X11Forwarding yes
PrintMotd no
AcceptEnv LANG LC_*
Subsystem sftp /usr/lib/openssh/sftp-server
EOF

# Restart SSH service
sudo systemctl restart sshd

# Set up PM2 for process management
echo "⚙️ Setting up PM2..."
pm2 startup
pm2 save

# Ensure Tailscale runs as service
echo "🌐 Ensuring Tailscale service..."
sudo systemctl enable tailscaled
sudo systemctl start tailscaled

# Start code-server
echo "💻 Starting VS Code Server..."
pm2 start code-server --name "code-server" -- --bind-addr 0.0.0.0:8080 --auth none
pm2 save

# Reload bashrc
source ~/.bashrc

echo ""
echo "🎉 Remote Development Environment Setup Complete!"
echo "==============================================="
echo "✅ All development tools installed"
echo "✅ Workspace structure created"
echo "✅ Aliases and functions configured"
echo "✅ Monitoring scripts created"
echo "✅ VS Code Server started on port 8080"
echo "✅ PM2 process manager configured"
echo "✅ Tailscale service enabled"
echo ""
echo "🌐 Access VS Code Server: http://100.64.64.33:8080"
echo "📊 Monitor server: ~/workspace/scripts/monitoring/server-status.sh"
echo "💾 Backup projects: ~/workspace/scripts/backup/backup.sh"
echo "🆕 Create project: new-project <name> [type]"
echo ""
echo "🔄 Please reconnect to apply all changes"
"@
    
    Set-Content -Path "remote_dev_setup.sh" -Value $remoteSetupScript -Force
    Write-Host "✅ Remote development setup script created" -ForegroundColor Green
}

# Function to create local lightweight environment
function Create-LocalLightweightEnv {
    Write-Host "💻 Creating lightweight local environment..." -ForegroundColor Yellow
    
    # Create minimal local development structure
    $localDirs = @(
        "$env:USERPROFILE\RemoteDev",
        "$env:USERPROFILE\RemoteDev\Connections",
        "$env:USERPROFILE\RemoteDev\Scripts",
        "$env:USERPROFILE\RemoteDev\Configs"
    )
    
    foreach ($dir in $localDirs) {
        if (!(Test-Path $dir)) {
            New-Item -ItemType Directory -Path $dir -Force | Out-Null
            Write-Host "Created: $dir" -ForegroundColor Green
        }
    }
    
    # Create lightweight PowerShell profile
    $lightweightProfile = @"
# Lightweight Remote Development Profile
# تحسين البيئة المحلية للتطوير البعيد

# Arabic encoding fix
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
[Console]::InputEncoding = [System.Text.Encoding]::UTF8
`$OutputEncoding = [System.Text.Encoding]::UTF8

# Set culture for Arabic
[System.Threading.Thread]::CurrentThread.CurrentCulture = 'ar-SA'
[System.Threading.Thread]::CurrentThread.CurrentUICulture = 'ar-SA'

# Remote development aliases
function ssh-remote { ssh cursor-dev }
function ssh-remote-bg { Start-Process -WindowStyle Hidden -FilePath "ssh" -ArgumentList "cursor-dev" }
function ssh-remote-tmux { ssh cursor-dev "tmux new-session -d -s dev" }

# Server management
function server-status { ssh cursor-dev "~/workspace/scripts/monitoring/server-status.sh" }
function server-backup { ssh cursor-dev "~/workspace/scripts/backup/backup.sh" }
function server-update { ssh cursor-dev "sudo apt update && sudo apt upgrade -y" }
function server-restart { ssh cursor-dev "sudo reboot" }

# Development shortcuts
function dev-remote { ssh cursor-dev "cd ~/workspace && tmux attach-session -t dev || tmux new-session -s dev" }
function code-remote { Start-Process "http://100.64.64.33:8080" }
function projects-remote { ssh cursor-dev "cd ~/workspace/projects && ls -la" }

# Process management
function pm2-list { ssh cursor-dev "pm2 list" }
function pm2-logs { ssh cursor-dev "pm2 logs" }
function pm2-restart { ssh cursor-dev "pm2 restart all" }

# Quick tests
function test-connection { 
    Write-Host "Testing SSH connection..." -ForegroundColor Yellow
    ssh cursor-dev "echo 'Connection successful!'"
}

function test-tailscale {
    Write-Host "Testing Tailscale..." -ForegroundColor Yellow
    tailscale status
}

# File operations
function sync-to-remote { 
    param([string]`$LocalPath, [string]`$RemotePath = "~/workspace/projects/")
    scp -r `$LocalPath cursor-dev:`$RemotePath
}

function sync-from-remote { 
    param([string]`$RemotePath, [string]`$LocalPath = ".")
    scp -r cursor-dev:`$RemotePath `$LocalPath
}

# Development workflow
function start-dev-session {
    Write-Host "Starting remote development session..." -ForegroundColor Green
    ssh cursor-dev "cd ~/workspace && tmux new-session -d -s dev -n 'main'"
    ssh cursor-dev "tmux new-window -t dev -n 'monitor' 'htop'"
    ssh cursor-dev "tmux new-window -t dev -n 'logs' 'pm2 logs'"
    ssh cursor-dev "tmux select-window -t dev:0"
    ssh cursor-dev "tmux attach-session -t dev"
}

function stop-dev-session {
    Write-Host "Stopping remote development session..." -ForegroundColor Yellow
    ssh cursor-dev "tmux kill-session -t dev"
}

# System monitoring
function monitor-remote {
    while (`$true) {
        Clear-Host
        Write-Host "Remote Server Monitor - Press Ctrl+C to exit" -ForegroundColor Cyan
        ssh cursor-dev "~/workspace/scripts/monitoring/server-status.sh"
        Start-Sleep 5
    }
}

# Quick project creation
function new-remote-project {
    param([string]`$ProjectName, [string]`$Type = "node")
    ssh cursor-dev "new-project `$ProjectName `$Type"
}

Write-Host "تم تحميل بيئة التطوير البعيد!" -ForegroundColor Green
Write-Host "Use 'dev-remote' to start development session" -ForegroundColor Cyan
Write-Host "Use 'code-remote' to open VS Code Server" -ForegroundColor Cyan
Write-Host "Use 'server-status' to check server status" -ForegroundColor Cyan
"@
    
    $profilePath = $PROFILE
    $profileDir = Split-Path $profilePath -Parent
    if (!(Test-Path $profileDir)) {
        New-Item -ItemType Directory -Path $profileDir -Force | Out-Null
    }
    
    Set-Content -Path $profilePath -Value $lightweightProfile -Force
    Write-Host "✅ Lightweight local environment created" -ForegroundColor Green
}

# Function to create VS Code remote configuration
function Create-VSCodeRemoteConfig {
    Write-Host "💻 Creating VS Code remote configuration..." -ForegroundColor Yellow
    
    $vscodeConfig = @"
{
    "remote.SSH.remotePlatform": {
        "cursor-dev": "linux"
    },
    "remote.SSH.configFile": "C:\\Users\\WA Hotels\\.ssh\\config",
    "remote.SSH.defaultExtensions": [
        "ms-vscode.vscode-typescript-next",
        "bradlc.vscode-tailwindcss",
        "esbenp.prettier-vscode",
        "ms-python.python",
        "ms-python.pylint",
        "ms-vscode.vscode-json",
        "ms-vscode.vscode-eslint",
        "formulahendry.auto-rename-tag",
        "christian-kohler.path-intellisense",
        "ms-vscode.vscode-git"
    ],
    "remote.SSH.showLoginTerminal": true,
    "remote.SSH.useLocalServer": false,
    "remote.SSH.enableDynamicForwarding": true,
    "remote.SSH.enableRemoteCommand": true,
    "remote.SSH.remoteServerListenOnSocket": true,
    "remote.SSH.remoteServerPort": 2222,
    "terminal.integrated.defaultProfile.linux": "bash",
    "terminal.integrated.profiles.linux": {
        "bash": {
            "path": "/bin/bash",
            "args": ["-l"]
        }
    }
}
"@
    
    $vscodeDir = "$env:APPDATA\Code\User"
    if (!(Test-Path $vscodeDir)) {
        New-Item -ItemType Directory -Path $vscodeDir -Force | Out-Null
    }
    
    Set-Content -Path "$vscodeDir\settings.json" -Value $vscodeConfig -Force
    Write-Host "✅ VS Code remote configuration created" -ForegroundColor Green
}

# Main execution
Write-Host "`n🔍 Testing current connection..." -ForegroundColor Yellow
$sshOk = Test-SSHConnection

if ($sshOk) {
    Write-Host "`n✅ SSH connection is working!" -ForegroundColor Green
    
    # Fix Arabic encoding
    Fix-ArabicEncoding
    
    # Create remote development environment
    Create-RemoteDevEnvironment
    
    # Create local lightweight environment
    Create-LocalLightweightEnv
    
    # Create VS Code remote configuration
    Create-VSCodeRemoteConfig
    
    Write-Host "`n🎉 Remote Development Setup Complete!" -ForegroundColor Green
    Write-Host "=====================================" -ForegroundColor Green
    Write-Host "✅ Arabic encoding fixed in PowerShell" -ForegroundColor White
    Write-Host "✅ Remote development environment configured" -ForegroundColor White
    Write-Host "✅ Local lightweight environment created" -ForegroundColor White
    Write-Host "✅ VS Code remote configuration set" -ForegroundColor White
    Write-Host "`n💡 New commands available:" -ForegroundColor Cyan
    Write-Host "  - dev-remote: Start development session" -ForegroundColor White
    Write-Host "  - code-remote: Open VS Code Server" -ForegroundColor White
    Write-Host "  - server-status: Check server status" -ForegroundColor White
    Write-Host "  - monitor-remote: Real-time monitoring" -ForegroundColor White
    Write-Host "  - new-remote-project: Create new project" -ForegroundColor White
    Write-Host "`n🌐 Access VS Code Server: http://100.64.64.33:8080" -ForegroundColor Yellow
    Write-Host "`n📋 Next steps:" -ForegroundColor Yellow
    Write-Host "1. Deploy remote setup: scp remote_dev_setup.sh cursor-dev:~/ && ssh cursor-dev 'chmod +x ~/remote_dev_setup.sh && ~/remote_dev_setup.sh'" -ForegroundColor White
    Write-Host "2. Restart PowerShell to load new profile" -ForegroundColor White
    Write-Host "3. Start development: dev-remote" -ForegroundColor White
    
} else {
    Write-Host "`n❌ SSH connection failed. Please check your configuration." -ForegroundColor Red
    Write-Host "Make sure you can connect with: ssh cursor-dev" -ForegroundColor Yellow
}

Write-Host "`n🔄 Please restart PowerShell to apply all changes" -ForegroundColor Yellow
