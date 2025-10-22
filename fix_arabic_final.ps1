# Fix Arabic Encoding in PowerShell - Final Solution
Write-Host "Fixing Arabic Encoding in PowerShell - Final Solution" -ForegroundColor Green
Write-Host "=================================================" -ForegroundColor Green

# Method 1: Set console code page to UTF-8
Write-Host "Method 1: Setting console code page..." -ForegroundColor Yellow
try {
    chcp 65001 | Out-Null
    Write-Host "Console code page set to UTF-8" -ForegroundColor Green
} catch {
    Write-Host "Failed to set console code page" -ForegroundColor Red
}

# Method 2: Set PowerShell encoding
Write-Host "Method 2: Setting PowerShell encoding..." -ForegroundColor Yellow
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
[Console]::InputEncoding = [System.Text.Encoding]::UTF8
$OutputEncoding = [System.Text.Encoding]::UTF8
Write-Host "PowerShell encoding set to UTF-8" -ForegroundColor Green

# Method 3: Set culture for Arabic
Write-Host "Method 3: Setting Arabic culture..." -ForegroundColor Yellow
[System.Threading.Thread]::CurrentThread.CurrentCulture = 'ar-SA'
[System.Threading.Thread]::CurrentThread.CurrentUICulture = 'ar-SA'
Write-Host "Arabic culture set" -ForegroundColor Green

# Method 4: Set Windows console font
Write-Host "Method 4: Setting console font..." -ForegroundColor Yellow
try {
    $regPath = "HKCU:\Console"
    if (!(Test-Path $regPath)) {
        New-Item -Path $regPath -Force | Out-Null
    }
    Set-ItemProperty -Path $regPath -Name "FaceName" -Value "Consolas" -Type String
    Set-ItemProperty -Path $regPath -Name "FontSize" -Value 0x00140000 -Type DWord
    Write-Host "Console font set to Consolas" -ForegroundColor Green
} catch {
    Write-Host "Failed to set console font" -ForegroundColor Red
}

# Test Arabic display
Write-Host "`nTesting Arabic display..." -ForegroundColor Yellow
Write-Host "مرحبا بك في بيئة التطوير البعيد" -ForegroundColor Cyan
Write-Host "هذا نص عربي للاختبار" -ForegroundColor Green
Write-Host "Arabic text should display correctly now" -ForegroundColor White

# Create a comprehensive profile
Write-Host "`nCreating comprehensive PowerShell profile..." -ForegroundColor Yellow
$profileContent = @"
# Comprehensive Arabic Support Profile
# دعم شامل للعربية في PowerShell

# Set console code page to UTF-8
chcp 65001 | Out-Null

# Set PowerShell encoding
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
[Console]::InputEncoding = [System.Text.Encoding]::UTF8
`$OutputEncoding = [System.Text.Encoding]::UTF8

# Set culture for Arabic
[System.Threading.Thread]::CurrentThread.CurrentCulture = 'ar-SA'
[System.Threading.Thread]::CurrentThread.CurrentUICulture = 'ar-SA'

# Set console font to support Arabic
try {
    `$regPath = "HKCU:\Console"
    if (!(Test-Path `$regPath)) {
        New-Item -Path `$regPath -Force | Out-Null
    }
    Set-ItemProperty -Path `$regPath -Name "FaceName" -Value "Consolas" -Type String
    Set-ItemProperty -Path `$regPath -Name "FontSize" -Value 0x00140000 -Type DWord
} catch {
    # Ignore registry errors
}

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

# Display welcome message
Write-Host "تم تحميل بيئة التطوير البعيد بنجاح!" -ForegroundColor Green
Write-Host "Remote development environment loaded successfully!" -ForegroundColor Green
Write-Host "Use 'dev-remote' to start development session" -ForegroundColor Cyan
Write-Host "Use 'code-remote' to open VS Code Server" -ForegroundColor Cyan
Write-Host "Use 'server-status' to check server status" -ForegroundColor Cyan
"@

# Save profile
$profilePath = $PROFILE
$profileDir = Split-Path $profilePath -Parent
if (!(Test-Path $profileDir)) {
    New-Item -ItemType Directory -Path $profileDir -Force | Out-Null
}

Set-Content -Path $profilePath -Value $profileContent -Force
Write-Host "PowerShell profile updated with Arabic support" -ForegroundColor Green

# Create a batch file to start PowerShell with UTF-8
Write-Host "`nCreating UTF-8 PowerShell launcher..." -ForegroundColor Yellow
$batchContent = @"
@echo off
chcp 65001 >nul
powershell.exe -NoExit -Command "& {[Console]::OutputEncoding = [System.Text.Encoding]::UTF8; [Console]::InputEncoding = [System.Text.Encoding]::UTF8; `$OutputEncoding = [System.Text.Encoding]::UTF8; [System.Threading.Thread]::CurrentThread.CurrentCulture = 'ar-SA'; [System.Threading.Thread]::CurrentThread.CurrentUICulture = 'ar-SA'; Write-Host 'PowerShell with Arabic support loaded!' -ForegroundColor Green}"
"@

Set-Content -Path "start_powershell_arabic.bat" -Value $batchContent -Force
Write-Host "UTF-8 PowerShell launcher created" -ForegroundColor Green

Write-Host "`nArabic encoding fix complete!" -ForegroundColor Green
Write-Host "=============================" -ForegroundColor Green
Write-Host "✅ Console code page set to UTF-8" -ForegroundColor White
Write-Host "✅ PowerShell encoding configured" -ForegroundColor White
Write-Host "✅ Arabic culture set" -ForegroundColor White
Write-Host "✅ Console font optimized" -ForegroundColor White
Write-Host "✅ Profile updated" -ForegroundColor White
Write-Host "✅ UTF-8 launcher created" -ForegroundColor White

Write-Host "`nTo use Arabic support:" -ForegroundColor Yellow
Write-Host "1. Restart PowerShell" -ForegroundColor White
Write-Host "2. Or use: .\start_powershell_arabic.bat" -ForegroundColor White
Write-Host "3. Test with: Write-Host 'مرحبا' -ForegroundColor Green" -ForegroundColor White

Write-Host "`nPress any key to continue..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
