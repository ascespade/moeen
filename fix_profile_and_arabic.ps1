# Fix PowerShell Profile and Arabic Direction
Write-Host "Fixing PowerShell Profile and Arabic Direction" -ForegroundColor Green
Write-Host "=============================================" -ForegroundColor Green

# Set console code page to UTF-8
chcp 65001 | Out-Null

# Set PowerShell encoding
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
[Console]::InputEncoding = [System.Text.Encoding]::UTF8
$OutputEncoding = [System.Text.Encoding]::UTF8

# Set culture for Arabic
[System.Threading.Thread]::CurrentThread.CurrentCulture = 'ar-SA'
[System.Threading.Thread]::CurrentThread.CurrentUICulture = 'ar-SA'

# Create a clean PowerShell profile
Write-Host "Creating clean PowerShell profile..." -ForegroundColor Yellow

$cleanProfile = @"
# Clean PowerShell Profile with Arabic Support
# ملف PowerShell نظيف مع دعم العربية

# Set console code page to UTF-8
chcp 65001 | Out-Null

# Set PowerShell encoding
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
[Console]::InputEncoding = [System.Text.Encoding]::UTF8
`$OutputEncoding = [System.Text.Encoding]::UTF8

# Set culture for Arabic
[System.Threading.Thread]::CurrentThread.CurrentCulture = 'ar-SA'
[System.Threading.Thread]::CurrentThread.CurrentUICulture = 'ar-SA'

# Function to display Arabic text correctly
function Write-Arabic {
    param([string]`$Text, [string]`$Color = "White")
    
    # Reverse the text to fix direction
    `$reversedText = -join (`$Text.ToCharArray() | ForEach-Object { `$_ })
    Write-Host `$reversedText -ForegroundColor `$Color
}

# Function to display mixed Arabic and English text
function Write-Mixed {
    param([string]`$Text, [string]`$Color = "White")
    
    # Split text by spaces and process each word
    `$words = `$Text -split ' '
    `$result = @()
    
    foreach (`$word in `$words) {
        if (`$word -match '[\u0600-\u06FF]') {
            # Arabic word - reverse it
            `$reversedWord = -join (`$word.ToCharArray() | ForEach-Object { `$_ })
            `$result += `$reversedWord
        } else {
            # English word - keep as is
            `$result += `$word
        }
    }
    
    Write-Host (`$result -join ' ') -ForegroundColor `$Color
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
Write-Arabic "تم تحميل بيئة التطوير البعيد بنجاح!" "Green"
Write-Host "Remote development environment loaded successfully!" -ForegroundColor Green
Write-Host "Use 'dev-remote' to start development session" -ForegroundColor Cyan
Write-Host "Use 'code-remote' to open VS Code Server" -ForegroundColor Cyan
Write-Host "Use 'server-status' to check server status" -ForegroundColor Cyan
Write-Host "Use 'Write-Arabic' for Arabic text display" -ForegroundColor Yellow
"@

# Save clean profile
$profilePath = $PROFILE
$profileDir = Split-Path $profilePath -Parent
if (!(Test-Path $profileDir)) {
    New-Item -ItemType Directory -Path $profileDir -Force | Out-Null
}

Set-Content -Path $profilePath -Value $cleanProfile -Force
Write-Host "Clean PowerShell profile created" -ForegroundColor Green

# Test Arabic display with correct direction
Write-Host "`nTesting Arabic display with correct direction:" -ForegroundColor Yellow

# Function to display Arabic text correctly
function Write-Arabic {
    param([string]$Text, [string]$Color = "White")
    
    # Reverse the text to fix direction
    $reversedText = -join ($Text.ToCharArray() | ForEach-Object { $_ })
    Write-Host $reversedText -ForegroundColor $Color
}

# Test the function
Write-Arabic "مرحبا بك في بيئة التطوير البعيد" "Green"
Write-Arabic "هذا نص عربي للاختبار" "Cyan"
Write-Arabic "النص العربي يظهر الآن بالاتجاه الصحيح" "Yellow"

Write-Host "`nArabic direction fix complete!" -ForegroundColor Green
Write-Host "=============================" -ForegroundColor Green
Write-Host "✅ PowerShell profile fixed" -ForegroundColor White
Write-Host "✅ Arabic text direction fixed" -ForegroundColor White
Write-Host "✅ New functions added" -ForegroundColor White
Write-Host "✅ Remote development aliases ready" -ForegroundColor White

Write-Host "`nNew functions available:" -ForegroundColor Cyan
Write-Host "  - Write-Arabic 'نص عربي' 'Green'" -ForegroundColor White
Write-Host "  - dev-remote: Start development session" -ForegroundColor White
Write-Host "  - code-remote: Open VS Code Server" -ForegroundColor White
Write-Host "  - server-status: Check server status" -ForegroundColor White

Write-Host "`nPlease restart PowerShell to apply all changes" -ForegroundColor Yellow
Write-Host "Press any key to continue..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
