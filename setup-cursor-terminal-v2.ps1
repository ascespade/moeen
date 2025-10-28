# Cursor Terminal & Performance Setup Script v2
# Fixed version with proper string handling

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Cursor Terminal & Performance Setup" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Get user paths
$userHome = $env:USERPROFILE
$appData = $env:APPDATA
$localAppData = $env:LOCALAPPDATA
$documents = [Environment]::GetFolderPath("Documents")

Write-Host "User: $env:USERNAME" -ForegroundColor Yellow
Write-Host "Home: $userHome" -ForegroundColor Yellow
Write-Host ""

# Check if Git Bash is installed
$gitBashPath = "C:\Program Files\Git\bin\bash.exe"
if (Test-Path $gitBashPath) {
    Write-Host "✓ Git Bash found" -ForegroundColor Green
} else {
    Write-Host "✗ Git Bash not found" -ForegroundColor Red
    Write-Host "  Please install Git for Windows from: https://git-scm.com/download/win" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Creating configuration files..." -ForegroundColor Cyan
Write-Host ""

# Create directories
$wtDir = "$localAppData\Microsoft\Windows Terminal"
$cursorDir = "$appData\Cursor\User"
$psDir = "$documents\WindowsPowerShell"

@($wtDir, $cursorDir, $psDir) | ForEach-Object {
    if (-not (Test-Path $_)) {
        New-Item -ItemType Directory -Path $_ -Force | Out-Null
        Write-Host "Created: $_" -ForegroundColor Green
    }
}

# ============= Windows Terminal Settings =============
$wtSettingsPath = "$wtDir\settings.json"

$wtJson = @'
{
  "$schema": "https://aka.ms/terminal-profiles-schema",
  "defaultProfile": "{00000000-0000-0000-0000-000000000001}",
  "profiles": {
    "defaults": {
      "font": {
        "face": "Consolas",
        "size": 12
      },
      "colorScheme": "Campbell",
      "cursorShape": "bar",
      "snapOnInput": true,
      "historySize": 9001,
      "antialiasingMode": "grayscale"
    },
    "list": [
      {
        "guid": "{00000000-0000-0000-0000-000000000001}",
        "name": "Git Bash",
        "commandline": "\"C:\\Program Files\\Git\\bin\\bash.exe\" --login",
        "icon": "C:\\Program Files\\Git\\mingw64\\share\\git\\git-for-windows.ico",
        "startingDirectory": "%USERPROFILE%",
        "hidden": false,
        "useAcrylic": false,
        "acrylicOpacity": 0.85,
        "fontFace": "Consolas",
        "fontSize": 12,
        "cursorShape": "bar",
        "cursorHeight": 1,
        "antialiasingMode": "grayscale",
        "snapOnInput": true,
        "historySize": 9001,
        "elevate": false
      },
      {
        "guid": "{574e775e-4f2a-5b96-ac1e-a2962a402336}",
        "name": "PowerShell",
        "commandline": "powershell.exe",
        "hidden": false,
        "startingDirectory": "%USERPROFILE%"
      }
    ]
  }
}
'@

$wtJson | Out-File -FilePath $wtSettingsPath -Encoding UTF8 -NoNewline -Force
Write-Host "✓ Windows Terminal settings created" -ForegroundColor Green

# ============= Cursor Settings =============
$cursorSettingsPath = "$cursorDir\settings.json"

$cursorJson = @'
{
  "cursor.chat.maxTokens": 8000,
  "cursor.chat.model": "gpt-4-turbo-preview",
  "cursor.rules.enabled": true,
  "editor.suggestSelection": "first",
  "editor.wordBasedSuggestions": "off",
  "editor.suggest.maxVisibleSuggestions": 12,
  "terminal.integrated.shell.windows": "C:\\Program Files\\Git\\bin\\bash.exe",
  "terminal.integrated.scrollback": 10000,
  "terminal.integrated.confirmOnExit": "never",
  "extensions.autoUpdate": false,
  "files.watcherExclude": {
    "**/node_modules/**": true,
    "**/.next/**": true,
    "**/dist/**": true
  },
  "typescript.tsserver.maxTsServerMemory": 8192,
  "git.enabled": true,
  "git.autofetch": true,
  "workbench.editor.enablePreview": false
}
'@

$cursorJson | Out-File -FilePath $cursorSettingsPath -Encoding UTF8 -NoNewline -Force
Write-Host "✓ Cursor settings created" -ForegroundColor Green

# ============= PowerShell Profile =============
$psProfilePath = "$psDir\Microsoft.PowerShell_profile.ps1"

$psProfileContent = @'
# PowerShell Profile for Cursor Agent
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$OutputEncoding = [System.Text.Encoding]::UTF8
$PSDefaultParameterValues['Out-Default:Encoding'] = 'utf8'

Set-PSReadLineOption -EditMode Emacs -PredictionSource None -MaximumHistoryCount 10000

function global:prompt {
    Write-Host "PS " -NoNewline -ForegroundColor Green
    Write-Host "$(Get-Location)" -NoNewline
    Write-Host ">" -NoNewline -ForegroundColor Gray
    return " "
}
'@

$psProfileContent | Out-File -FilePath $psProfilePath -Encoding UTF8 -Force
Write-Host "✓ PowerShell profile created" -ForegroundColor Green

# ============= Git Bash Profile =============
$bashProfilePath = "$userHome\.bashrc"

$bashProfileContent = @'
export LANG=en_US.UTF-8
export CLICOLOR=1
alias ll='ls -lh'
alias gst='git status'
alias glog='git log --oneline'
export HISTSIZE=10000
shopt -s histappend
echo "Git Bash loaded - Optimized for Cursor"
'@

$bashProfileContent | Out-File -FilePath $bashProfilePath -Encoding UTF8 -Force
Write-Host "✓ Git Bash profile created" -ForegroundColor Green

# Set environment variables
Write-Host ""
Write-Host "Setting environment variables..." -ForegroundColor Yellow
[Environment]::SetEnvironmentVariable("CURSOR_AGENT_OPTIMIZED", "true", "User")
[Environment]::SetEnvironmentVariable("NODE_OPTIONS", "--max-old-space-size=8192", "User")
Write-Host "✓ Environment variables set" -ForegroundColor Green

# Configure Git
if (Test-Path $gitBashPath) {
    Write-Host ""
    Write-Host "Configuring Git..." -ForegroundColor Yellow
    git config --global core.autocrlf false
    git config --global init.defaultBranch main
    git config --global color.ui auto
    Write-Host "✓ Git configured" -ForegroundColor Green
}

# Summary
Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "Setup Complete!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Files created:" -ForegroundColor Yellow
Write-Host "  • $wtSettingsPath" -ForegroundColor White
Write-Host "  • $cursorSettingsPath" -ForegroundColor White
Write-Host "  • $psProfilePath" -ForegroundColor White
Write-Host "  • $bashProfilePath" -ForegroundColor White
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "  1. Restart Cursor completely" -ForegroundColor White
Write-Host "  2. Restart Windows Terminal" -ForegroundColor White
Write-Host "  3. Default terminal is now Git Bash" -ForegroundColor White
Write-Host ""

