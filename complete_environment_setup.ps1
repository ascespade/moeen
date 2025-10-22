# Complete Environment Setup Script
Write-Host "🚀 Complete Development Environment Setup" -ForegroundColor Green
Write-Host "=========================================" -ForegroundColor Green

# Function to test SSH connection
function Test-SSHConnection {
    Write-Host "🧪 Testing SSH connection..." -ForegroundColor Yellow
    try {
        $result = ssh -o ConnectTimeout=10 cursor-dev "echo 'SSH_SUCCESS'" 2>&1
        if ($result -match "SSH_SUCCESS") {
            Write-Host "✅ SSH connection successful!" -ForegroundColor Green
            return $true
        } else {
            Write-Host "❌ SSH connection failed: $result" -ForegroundColor Red
            return $false
        }
    } catch {
        Write-Host "❌ SSH connection error: $($_.Exception.Message)" -ForegroundColor Red
        return $false
    }
}

# Function to optimize local environment
function Optimize-LocalEnvironment {
    Write-Host "`n🔧 Optimizing local environment..." -ForegroundColor Yellow
    
    # Create development directories
    $devDirs = @(
        "$env:USERPROFILE\Development",
        "$env:USERPROFILE\Projects", 
        "$env:USERPROFILE\Scripts",
        "$env:USERPROFILE\Tools"
    )
    
    foreach ($dir in $devDirs) {
        if (!(Test-Path $dir)) {
            New-Item -ItemType Directory -Path $dir -Force | Out-Null
            Write-Host "✅ Created: $dir" -ForegroundColor Green
        }
    }
    
    # Create SSH control directory
    $sshControlDir = "$env:USERPROFILE\.ssh\control"
    if (!(Test-Path $sshControlDir)) {
        New-Item -ItemType Directory -Path $sshControlDir -Force | Out-Null
        Write-Host "✅ Created SSH control directory" -ForegroundColor Green
    }
    
    # Update PowerShell profile
    $profileContent = @"
# Development Environment Aliases
function ll { Get-ChildItem -Force | Format-Table -AutoSize }
function la { Get-ChildItem -Force -Hidden | Format-Table -AutoSize }
function grep { Select-String -Pattern `$args }
function find { Get-ChildItem -Recurse -Name "*`$args*" }
function ports { netstat -an | Select-String LISTENING }
function myip { Invoke-RestMethod -Uri "https://api.ipify.org" }

# Git aliases
function gs { git status }
function ga { git add }
function gc { git commit }
function gp { git push }
function gl { git log --oneline }
function gd { git diff }

# Docker aliases
function dps { docker ps }
function dpa { docker ps -a }
function di { docker images }
function dex { docker exec -it }

# SSH shortcuts
function ssh-cursor { ssh cursor-dev }
function ssh-cursor-bg { Start-Process -WindowStyle Hidden -FilePath "ssh" -ArgumentList "cursor-dev" }

# Development shortcuts
function dev { Set-Location "$env:USERPROFILE\Development" }
function proj { Set-Location "$env:USERPROFILE\Projects" }
function scripts { Set-Location "$env:USERPROFILE\Scripts" }

# Server management
function server-status { ssh cursor-dev "~/scripts/monitor.sh" }
function server-update { ssh cursor-dev "sudo apt update && sudo apt upgrade -y" }
function server-restart { ssh cursor-dev "sudo reboot" }

# Quick tests
function test-connection { 
    Write-Host "Testing SSH connection..." -ForegroundColor Yellow
    ssh cursor-dev "echo 'Connection successful!'"
}

function test-tailscale {
    Write-Host "Testing Tailscale..." -ForegroundColor Yellow
    tailscale status
}

Write-Host "🚀 Development environment loaded!" -ForegroundColor Green
Write-Host "💡 Use 'ssh-cursor' to connect to remote server" -ForegroundColor Cyan
Write-Host "💡 Use 'server-status' to check remote server status" -ForegroundColor Cyan
"@
    
    $profilePath = $PROFILE
    $profileDir = Split-Path $profilePath -Parent
    if (!(Test-Path $profileDir)) {
        New-Item -ItemType Directory -Path $profileDir -Force | Out-Null
    }
    
    Set-Content -Path $profilePath -Value $profileContent -Force
    Write-Host "✅ PowerShell profile updated" -ForegroundColor Green
}

# Function to create remote optimization script
function Create-RemoteOptimizationScript {
    Write-Host "`n📝 Creating remote optimization script..." -ForegroundColor Yellow
    
    $remoteScript = @"
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
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-`$(uname -s)-`$(uname -m)" -o /usr/local/bin/docker-compose
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

chmod +x ~/scripts/monitor.sh

echo "✅ Server optimization complete!"
echo "🔄 Please reconnect to apply changes"
"@
    
    Set-Content -Path "remote_optimize.sh" -Value $remoteScript -Force
    Write-Host "✅ Remote optimization script created" -ForegroundColor Green
}

# Function to deploy and run remote optimization
function Deploy-RemoteOptimization {
    Write-Host "`n🚀 Deploying remote optimization..." -ForegroundColor Yellow
    
    # Copy script to remote server
    Write-Host "📤 Copying optimization script to server..." -ForegroundColor Cyan
    $copyResult = scp remote_optimize.sh cursor-dev:~/ 2>&1
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Script copied successfully" -ForegroundColor Green
        
        # Run the optimization script
        Write-Host "🔧 Running optimization on remote server..." -ForegroundColor Cyan
        Write-Host "This may take several minutes..." -ForegroundColor Yellow
        
        ssh cursor-dev "chmod +x ~/remote_optimize.sh && ~/remote_optimize.sh"
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✅ Remote optimization completed successfully!" -ForegroundColor Green
        } else {
            Write-Host "⚠️ Remote optimization completed with warnings" -ForegroundColor Yellow
        }
    } else {
        Write-Host "❌ Failed to copy script: $copyResult" -ForegroundColor Red
        Write-Host "Please run the optimization manually:" -ForegroundColor Yellow
        Write-Host "1. ssh cursor-dev" -ForegroundColor White
        Write-Host "2. Copy and paste the script content" -ForegroundColor White
        Write-Host "3. Run: chmod +x remote_optimize.sh && ./remote_optimize.sh" -ForegroundColor White
    }
}

# Main execution
Write-Host "`n🔍 Testing current connection..." -ForegroundColor Yellow
$sshOk = Test-SSHConnection

if ($sshOk) {
    Write-Host "`n✅ SSH connection is working!" -ForegroundColor Green
    
    # Optimize local environment
    Optimize-LocalEnvironment
    
    # Create remote optimization script
    Create-RemoteOptimizationScript
    
    # Ask user if they want to deploy
    Write-Host "`n❓ Do you want to deploy remote optimization now? (y/n)" -ForegroundColor Yellow
    $response = Read-Host
    
    if ($response -eq "y" -or $response -eq "Y") {
        Deploy-RemoteOptimization
    } else {
        Write-Host "`n📋 Manual deployment instructions:" -ForegroundColor Cyan
        Write-Host "1. ssh cursor-dev" -ForegroundColor White
        Write-Host "2. Copy the content of 'remote_optimize.sh'" -ForegroundColor White
        Write-Host "3. Paste and run it on the server" -ForegroundColor White
    }
    
    Write-Host "`n🎉 Environment setup complete!" -ForegroundColor Green
    Write-Host "📋 Summary:" -ForegroundColor Yellow
    Write-Host "  ✅ Local environment optimized" -ForegroundColor White
    Write-Host "  ✅ SSH configuration improved" -ForegroundColor White
    Write-Host "  ✅ Remote optimization script created" -ForegroundColor White
    Write-Host "`n💡 New commands available:" -ForegroundColor Cyan
    Write-Host "  - ssh-cursor: Connect to remote server" -ForegroundColor White
    Write-Host "  - server-status: Check remote server status" -ForegroundColor White
    Write-Host "  - test-connection: Test SSH connection" -ForegroundColor White
    Write-Host "  - dev, proj, scripts: Navigate to directories" -ForegroundColor White
    
} else {
    Write-Host "`n❌ SSH connection failed. Please check your configuration." -ForegroundColor Red
    Write-Host "Make sure you can connect with: ssh cursor-dev" -ForegroundColor Yellow
}

Write-Host "`n🔄 Please restart PowerShell to load new profile" -ForegroundColor Yellow
Write-Host "Press any key to continue..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
