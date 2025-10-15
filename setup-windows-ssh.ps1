# ===============================================
# Windows SSH Setup Script for Cursor Development
# ===============================================

# Check if running as Administrator
if (-NOT ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole] "Administrator")) {
    Write-Host "This script requires Administrator privileges. Please run PowerShell as Administrator." -ForegroundColor Red
    Write-Host "Right-click on PowerShell and select 'Run as Administrator'" -ForegroundColor Yellow
    pause
    exit 1
}

Write-Host "===============================================" -ForegroundColor Cyan
Write-Host "    Windows SSH Setup for Cursor Development" -ForegroundColor Cyan
Write-Host "===============================================" -ForegroundColor Cyan
Write-Host ""

# Function to create directory if it doesn't exist
function Ensure-Directory {
    param([string]$Path)
    if (!(Test-Path $Path)) {
        New-Item -ItemType Directory -Path $Path -Force | Out-Null
        Write-Host "Created directory: $Path" -ForegroundColor Green
    }
}

# Function to set file permissions
function Set-SecureFilePermissions {
    param([string]$FilePath)
    try {
        # Remove inheritance and set explicit permissions
        $acl = Get-Acl $FilePath
        $acl.SetAccessRuleProtection($true, $false)
        
        # Add full control for current user
        $accessRule = New-Object System.Security.AccessControl.FileSystemAccessRule(
            [System.Security.Principal.WindowsIdentity]::GetCurrent().Name,
            "FullControl",
            "Allow"
        )
        $acl.SetAccessRule($accessRule)
        
        # Apply permissions
        Set-Acl -Path $FilePath -AclObject $acl
        Write-Host "Set secure permissions for: $FilePath" -ForegroundColor Green
    }
    catch {
        Write-Host "Warning: Could not set permissions for $FilePath - $($_.Exception.Message)" -ForegroundColor Yellow
    }
}

Write-Host "Step 1: Creating SSH directory structure..." -ForegroundColor Yellow
$sshDir = "$env:USERPROFILE\.ssh"
Ensure-Directory $sshDir

Write-Host "Step 2: Creating SSH private key file..." -ForegroundColor Yellow
$privateKeyContent = @"
-----BEGIN OPENSSH PRIVATE KEY-----
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
QYBHS/d2Z1kAAAAKZGV2QGN1cnNvcgE=
-----END OPENSSH PRIVATE KEY-----
"@

$privateKeyPath = "$sshDir\dev_key"
$privateKeyContent | Out-File -FilePath $privateKeyPath -Encoding ASCII -NoNewline
Set-SecureFilePermissions $privateKeyPath
Write-Host "Created private key: $privateKeyPath" -ForegroundColor Green

Write-Host "Step 3: Creating SSH config file..." -ForegroundColor Yellow
$sshConfigContent = @"
# Cursor Development Server Configuration
Host cursor-dev
    HostName 100.98.137.52
    User dev
    IdentityFile ~/.ssh/dev_key
    Port 22
    ServerAliveInterval 60
    ServerAliveCountMax 3
    StrictHostKeyChecking no
    UserKnownHostsFile /dev/null

# Alternative hostname
Host cursor-dev-alt
    HostName cursor-2.tail31ce5f.ts.net
    User dev
    IdentityFile ~/.ssh/dev_key
    Port 22
    ServerAliveInterval 60
    ServerAliveCountMax 3
    StrictHostKeyChecking no
    UserKnownHostsFile /dev/null
"@

$sshConfigPath = "$sshDir\config"
$sshConfigContent | Out-File -FilePath $sshConfigPath -Encoding ASCII
Set-SecureFilePermissions $sshConfigPath
Write-Host "Created SSH config: $sshConfigPath" -ForegroundColor Green

Write-Host "Step 4: Creating connection batch files..." -ForegroundColor Yellow

# Create batch file for easy connection
$batchContent = @"
@echo off
echo Connecting to Cursor Development Server...
echo.
echo Choose connection method:
echo 1. Using Tailscale IP (100.98.137.52)
echo 2. Using Tailscale Hostname (cursor-2.tail31ce5f.ts.net)
echo 3. Using SSH config (cursor-dev)
echo.
set /p choice="Enter your choice (1-3): "

if "%choice%"=="1" (
    ssh -i "%USERPROFILE%\.ssh\dev_key" dev@100.98.137.52
) else if "%choice%"=="2" (
    ssh -i "%USERPROFILE%\.ssh\dev_key" dev@cursor-2.tail31ce5f.ts.net
) else if "%choice%"=="3" (
    ssh cursor-dev
) else (
    echo Invalid choice. Using default connection...
    ssh cursor-dev
)

pause
"@

$batchPath = "$env:USERPROFILE\Desktop\Connect-to-Cursor-Dev.bat"
$batchContent | Out-File -FilePath $batchPath -Encoding ASCII
Write-Host "Created batch file: $batchPath" -ForegroundColor Green

Write-Host "Step 5: Creating PowerShell connection script..." -ForegroundColor Yellow
$psScriptContent = @"
# PowerShell script to connect to Cursor Development Server
param(
    [string]`$Method = "config"
)

Write-Host "Connecting to Cursor Development Server..." -ForegroundColor Cyan
Write-Host ""

switch (`$Method.ToLower()) {
    "ip" {
        Write-Host "Using Tailscale IP: 100.98.137.52" -ForegroundColor Yellow
        ssh -i "`$env:USERPROFILE\.ssh\dev_key" dev@100.98.137.52
    }
    "hostname" {
        Write-Host "Using Tailscale Hostname: cursor-2.tail31ce5f.ts.net" -ForegroundColor Yellow
        ssh -i "`$env:USERPROFILE\.ssh\dev_key" dev@cursor-2.tail31ce5f.ts.net
    }
    "config" {
        Write-Host "Using SSH config: cursor-dev" -ForegroundColor Yellow
        ssh cursor-dev
    }
    default {
        Write-Host "Invalid method. Using config method..." -ForegroundColor Red
        ssh cursor-dev
    }
}
"@

$psScriptPath = "$env:USERPROFILE\Desktop\Connect-to-Cursor-Dev.ps1"
$psScriptContent | Out-File -FilePath $psScriptPath -Encoding UTF8
Write-Host "Created PowerShell script: $psScriptPath" -ForegroundColor Green

Write-Host "Step 6: Creating connection shortcuts..." -ForegroundColor Yellow

# Create desktop shortcuts
$WshShell = New-Object -comObject WScript.Shell

# SSH Connection Shortcut
$Shortcut1 = $WshShell.CreateShortcut("$env:USERPROFILE\Desktop\SSH to Cursor Dev.lnk")
$Shortcut1.TargetPath = "powershell.exe"
$Shortcut1.Arguments = "-ExecutionPolicy Bypass -File `"$psScriptPath`""
$Shortcut1.Description = "Connect to Cursor Development Server via SSH"
$Shortcut1.Save()

# VS Code Server Shortcut
$Shortcut2 = $WshShell.CreateShortcut("$env:USERPROFILE\Desktop\VS Code Server.lnk")
$Shortcut2.TargetPath = "http://100.98.137.52:8081"
$Shortcut2.Description = "Open VS Code Server in browser"
$Shortcut2.Save()

# Cursor Server Shortcut
$Shortcut3 = $WshShell.CreateShortcut("$env:USERPROFILE\Desktop\Cursor Server.lnk")
$Shortcut3.TargetPath = "http://100.98.137.52:26054"
$Shortcut3.Description = "Open Cursor Server in browser"
$Shortcut3.Save()

Write-Host "Created desktop shortcuts" -ForegroundColor Green

Write-Host "Step 7: Setting up Windows Terminal profile (if available)..." -ForegroundColor Yellow
try {
    $wtSettingsPath = "$env:LOCALAPPDATA\Packages\Microsoft.WindowsTerminal_8wekyb3d8bbwe\LocalState\settings.json"
    if (Test-Path $wtSettingsPath) {
        Write-Host "Windows Terminal detected. You can manually add SSH profile to settings." -ForegroundColor Yellow
        Write-Host "Add this profile to your Windows Terminal settings:" -ForegroundColor Cyan
        Write-Host @"
{
    "name": "Cursor Dev Server",
    "commandline": "ssh cursor-dev",
    "icon": "ms-appx:///ProfileIcons/{9acb9455-ca41-5af7-950f-6bca1bc9722f}.png",
    "hidden": false
}
"@ -ForegroundColor Gray
    }
} catch {
    Write-Host "Windows Terminal not found or not accessible" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "===============================================" -ForegroundColor Green
Write-Host "           SETUP COMPLETED SUCCESSFULLY!" -ForegroundColor Green
Write-Host "===============================================" -ForegroundColor Green
Write-Host ""
Write-Host "Connection Information:" -ForegroundColor Cyan
Write-Host "  Host: 100.98.137.52 (Tailscale IP)" -ForegroundColor White
Write-Host "  Hostname: cursor-2.tail31ce5f.ts.net" -ForegroundColor White
Write-Host "  User: dev" -ForegroundColor White
Write-Host "  Port: 22" -ForegroundColor White
Write-Host ""
Write-Host "Web Access:" -ForegroundColor Cyan
Write-Host "  VS Code Server: http://100.98.137.52:8081" -ForegroundColor White
Write-Host "  Cursor Server: http://100.98.137.52:26054" -ForegroundColor White
Write-Host "  VS Code Password: devpassword123" -ForegroundColor White
Write-Host ""
Write-Host "How to Connect:" -ForegroundColor Cyan
Write-Host "  1. Double-click 'SSH to Cursor Dev' on desktop" -ForegroundColor White
Write-Host "  2. Or run: ssh cursor-dev" -ForegroundColor White
Write-Host "  3. Or run: .\Connect-to-Cursor-Dev.ps1" -ForegroundColor White
Write-Host ""
Write-Host "Files Created:" -ForegroundColor Cyan
Write-Host "  SSH Key: $sshDir\dev_key" -ForegroundColor White
Write-Host "  SSH Config: $sshDir\config" -ForegroundColor White
Write-Host "  Batch File: $batchPath" -ForegroundColor White
Write-Host "  PowerShell Script: $psScriptPath" -ForegroundColor White
Write-Host "  Desktop Shortcuts: Created" -ForegroundColor White
Write-Host ""

# Test connection
Write-Host "Testing SSH connection..." -ForegroundColor Yellow
try {
    $testResult = ssh -o ConnectTimeout=10 -o BatchMode=yes cursor-dev "echo 'Connection test successful'" 2>$null
    if ($LASTEXITCODE -eq 0) {
        Write-Host "SSH connection test: SUCCESS" -ForegroundColor Green
    } else {
        Write-Host "SSH connection test: FAILED (server might be starting up)" -ForegroundColor Yellow
        Write-Host "Please try connecting manually in a few minutes" -ForegroundColor Yellow
    }
} catch {
    Write-Host "SSH connection test: FAILED" -ForegroundColor Red
    Write-Host "Please check your internet connection and try again" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Press any key to exit..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")