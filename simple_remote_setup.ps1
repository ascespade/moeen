# Simple Remote Development Setup
Write-Host "Remote Development Setup" -ForegroundColor Green
Write-Host "=========================" -ForegroundColor Green

# Function to test SSH connection
function Test-SSHConnection {
    Write-Host "Testing SSH connection..." -ForegroundColor Yellow
    try {
        $result = ssh -o ConnectTimeout=10 cursor-dev "echo 'SSH_SUCCESS'" 2>&1
        if ($result -match "SSH_SUCCESS") {
            Write-Host "SSH connection successful!" -ForegroundColor Green
            return $true
        } else {
            Write-Host "SSH connection failed: $result" -ForegroundColor Red
            return $false
        }
    } catch {
        Write-Host "SSH connection error: $($_.Exception.Message)" -ForegroundColor Red
        return $false
    }
}

# Function to fix Arabic encoding
function Fix-ArabicEncoding {
    Write-Host "Fixing Arabic encoding..." -ForegroundColor Yellow
    
    # Set console encoding to UTF-8
    [Console]::OutputEncoding = [System.Text.Encoding]::UTF8
    [Console]::InputEncoding = [System.Text.Encoding]::UTF8
    $OutputEncoding = [System.Text.Encoding]::UTF8
    
    # Set culture for Arabic
    [System.Threading.Thread]::CurrentThread.CurrentCulture = 'ar-SA'
    [System.Threading.Thread]::CurrentThread.CurrentUICulture = 'ar-SA'
    
    Write-Host "Arabic encoding fixed!" -ForegroundColor Green
}

# Function to create remote setup script
function Create-RemoteScript {
    Write-Host "Creating remote setup script..." -ForegroundColor Yellow
    
    $remoteScript = @"
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
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-`$(uname -s)-`$(uname -m)" -o /usr/local/bin/docker-compose
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
echo "Date: `$(date)"
echo "Uptime: `$(uptime)"
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
"@
    
    Set-Content -Path "remote_setup.sh" -Value $remoteScript -Force
    Write-Host "Remote setup script created" -ForegroundColor Green
}

# Function to create local lightweight profile
function Create-LocalProfile {
    Write-Host "Creating local lightweight profile..." -ForegroundColor Yellow
    
    $profileContent = @"
# Lightweight Remote Development Profile

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

# Server management
function server-status { ssh cursor-dev "~/workspace/scripts/monitor.sh" }
function server-backup { ssh cursor-dev "~/workspace/scripts/backup.sh" }
function server-update { ssh cursor-dev "sudo apt update && sudo apt upgrade -y" }

# Development shortcuts
function dev-remote { ssh cursor-dev "cd ~/workspace && tmux new-session -s dev || tmux attach-session -t dev" }
function code-remote { Start-Process "http://100.64.64.33:8080" }
function projects-remote { ssh cursor-dev "cd ~/workspace/projects && ls -la" }

# Process management
function pm2-list { ssh cursor-dev "pm2 list" }
function pm2-logs { ssh cursor-dev "pm2 logs" }

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

Write-Host "Remote development environment loaded!" -ForegroundColor Green
Write-Host "Use 'dev-remote' to start development session" -ForegroundColor Cyan
Write-Host "Use 'code-remote' to open VS Code Server" -ForegroundColor Cyan
Write-Host "Use 'server-status' to check server status" -ForegroundColor Cyan
"@
    
    $profilePath = $PROFILE
    $profileDir = Split-Path $profilePath -Parent
    if (!(Test-Path $profileDir)) {
        New-Item -ItemType Directory -Path $profileDir -Force | Out-Null
    }
    
    Set-Content -Path $profilePath -Value $profileContent -Force
    Write-Host "Local profile created" -ForegroundColor Green
}

# Main execution
Write-Host "Testing current connection..." -ForegroundColor Yellow
$sshOk = Test-SSHConnection

if ($sshOk) {
    Write-Host "SSH connection is working!" -ForegroundColor Green
    
    # Fix Arabic encoding
    Fix-ArabicEncoding
    
    # Create remote setup script
    Create-RemoteScript
    
    # Create local profile
    Create-LocalProfile
    
    Write-Host "Remote Development Setup Complete!" -ForegroundColor Green
    Write-Host "===================================" -ForegroundColor Green
    Write-Host "Arabic encoding fixed" -ForegroundColor White
    Write-Host "Remote setup script created" -ForegroundColor White
    Write-Host "Local profile configured" -ForegroundColor White
    Write-Host "New commands available:" -ForegroundColor Cyan
    Write-Host "  - dev-remote: Start development session" -ForegroundColor White
    Write-Host "  - code-remote: Open VS Code Server" -ForegroundColor White
    Write-Host "  - server-status: Check server status" -ForegroundColor White
    Write-Host "  - test-connection: Test SSH connection" -ForegroundColor White
    Write-Host "Next steps:" -ForegroundColor Yellow
    Write-Host "1. Deploy remote setup: scp remote_setup.sh cursor-dev:~/ && ssh cursor-dev 'chmod +x ~/remote_setup.sh && ~/remote_setup.sh'" -ForegroundColor White
    Write-Host "2. Restart PowerShell to load new profile" -ForegroundColor White
    Write-Host "3. Start development: dev-remote" -ForegroundColor White
    
} else {
    Write-Host "SSH connection failed. Please check your configuration." -ForegroundColor Red
    Write-Host "Make sure you can connect with: ssh cursor-dev" -ForegroundColor Yellow
}

Write-Host "Please restart PowerShell to apply all changes" -ForegroundColor Yellow
