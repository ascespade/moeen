# 🔧 SSH Server Setup Script for Cursor Machine
# Run as Administrator

Write-Host "🚀 Setting up SSH Server on Cursor Machine..." -ForegroundColor Cyan

# Check if running as administrator
if (-NOT ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole] "Administrator")) {
    Write-Host "❌ This script must be run as Administrator!" -ForegroundColor Red
    Write-Host "Right-click PowerShell and select 'Run as Administrator'" -ForegroundColor Yellow
    pause
    exit 1
}

# Install OpenSSH Server
Write-Host "📦 Installing OpenSSH Server..." -ForegroundColor Yellow
try {
    Add-WindowsCapability -Online -Name OpenSSH.Server~~~~0.0.1.0
    Write-Host "✅ OpenSSH Server installed successfully" -ForegroundColor Green
} catch {
    Write-Host "❌ Failed to install OpenSSH Server: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# Start and enable SSH service
Write-Host "🔄 Starting SSH service..." -ForegroundColor Yellow
try {
    Start-Service sshd
    Set-Service -Name sshd -StartupType 'Automatic'
    Write-Host "✅ SSH service started and set to automatic" -ForegroundColor Green
} catch {
    Write-Host "❌ Failed to start SSH service: $($_.Exception.Message)" -ForegroundColor Red
}

# Configure firewall
Write-Host "🔥 Configuring Windows Firewall..." -ForegroundColor Yellow
try {
    New-NetFirewallRule -Name sshd -DisplayName 'OpenSSH Server (sshd)' -Enabled True -Direction Inbound -Protocol TCP -Action Allow -LocalPort 22
    Write-Host "✅ Firewall rule added for SSH" -ForegroundColor Green
} catch {
    Write-Host "⚠️ Firewall rule might already exist or failed to create" -ForegroundColor Yellow
}

# Setup SSH key authentication
Write-Host "🔑 Setting up SSH key authentication..." -ForegroundColor Yellow
$sshDir = "$env:USERPROFILE\.ssh"
$authorizedKeysFile = "$sshDir\authorized_keys"

# Create .ssh directory if it doesn't exist
if (-not (Test-Path $sshDir)) {
    New-Item -ItemType Directory -Path $sshDir -Force | Out-Null
}

# Copy public key from jumper server
Write-Host "📋 Getting public key from jumper server..." -ForegroundColor Blue
try {
    $pubKey = ssh cursor-server "cat ~/.ssh/my-dev-key.pem.pub 2>/dev/null || ssh-keygen -y -f ~/.ssh/my-dev-key.pem"
    if ($pubKey) {
        Add-Content -Path $authorizedKeysFile -Value $pubKey
        Write-Host "✅ Public key added to authorized_keys" -ForegroundColor Green
    } else {
        Write-Host "⚠️ Could not get public key from server" -ForegroundColor Yellow
    }
} catch {
    Write-Host "⚠️ Failed to get public key from server: $($_.Exception.Message)" -ForegroundColor Yellow
}

# Set proper permissions
Write-Host "🔒 Setting proper permissions..." -ForegroundColor Yellow
try {
    icacls $sshDir /inheritance:r
    icacls $sshDir /grant:r "$env:USERNAME:(OI)(CI)F"
    if (Test-Path $authorizedKeysFile) {
        icacls $authorizedKeysFile /inheritance:r
        icacls $authorizedKeysFile /grant:r "$env:USERNAME:F"
    }
    Write-Host "✅ Permissions set correctly" -ForegroundColor Green
} catch {
    Write-Host "⚠️ Could not set all permissions properly" -ForegroundColor Yellow
}

# Test SSH service
Write-Host "🧪 Testing SSH service..." -ForegroundColor Yellow
$sshStatus = Get-Service -Name sshd
if ($sshStatus.Status -eq "Running") {
    Write-Host "✅ SSH service is running" -ForegroundColor Green
    Write-Host "🌐 Your SSH server is accessible at: $env:COMPUTERNAME@46.143.180.17:22" -ForegroundColor Cyan
} else {
    Write-Host "❌ SSH service is not running" -ForegroundColor Red
}

Write-Host "`n🎉 SSH Server setup completed!" -ForegroundColor Green
Write-Host "📝 Summary:" -ForegroundColor Yellow
Write-Host "   • SSH Server: Installed and running" -ForegroundColor White
Write-Host "   • Firewall: Port 22 opened" -ForegroundColor White
Write-Host "   • Key Auth: Configured" -ForegroundColor White
Write-Host "   • Connection: ssh $env:USERNAME@46.143.180.17" -ForegroundColor White

Write-Host "`n💡 Now you can use 'cursor' or 'c' commands from jumper server!" -ForegroundColor Cyan
pause
