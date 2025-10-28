# ============================================
# Cursor Terminal & Performance Setup
# Setup version: 2.0
# ============================================

Write-Host ""
Write-Host "================================" -ForegroundColor Cyan
Write-Host "  Cursor Terminal Setup v2.0" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""

# Get paths
$appData = $env:APPDATA
$localAppData = $env:LOCALAPPDATA
$documents = [Environment]::GetFolderPath("MyDocuments")
$userHome = $env:USERPROFILE

Write-Host "Configuring:" -ForegroundColor Yellow
Write-Host "  User: $env:USERNAME" -ForegroundColor White
Write-Host "  Home: $userHome" -ForegroundColor White
Write-Host ""

# Create directories
$directories = @(
    "$localAppData\Microsoft\Windows Terminal",
    "$appData\Cursor\User",
    "$documents\WindowsPowerShell"
)

Write-Host "Creating directories..." -ForegroundColor Cyan
foreach ($dir in $directories) {
    if (-not (Test-Path $dir)) {
        New-Item -ItemType Directory -Path $dir -Force | Out-Null
        Write-Host "  Created: $dir" -ForegroundColor Green
    }
}

Write-Host ""

# ============= Windows Terminal Settings =============
Write-Host "Configuring Windows Terminal..." -ForegroundColor Yellow

$wtContent = '{
  "$schema": "https://aka.ms/terminal-profiles-schema",
  "defaultProfile": "{00000000-0000-0000-0000-000000000001}",
  "profiles": {
    "defaults": {
      "font": { "face": "Consolas", "size": 12 },
      "historySize": 9001
    },
    "list": [
      {
        "guid": "{00000000-0000-0000-0000-000000000001}",
        "name": "Git Bash",
        "commandline": "C:\\Program Files\\Git\\bin\\bash.exe --login",
        "icon": "C:\\Program Files\\Git\\mingw64\\share\\git\\git-for-windows.ico",
        "startingDirectory": "%USERPROFILE%",
        "hidden": false
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
}'

$wtContent | Out-File -FilePath "$localAppData\Microsoft\Windows Terminal\settings.json" -Encoding UTF8 -Force
Write-Host "  Windows Terminal: OK" -ForegroundColor Green

# ============= Cursor Settings =============
Write-Host "Configuring Cursor settings..." -ForegroundColor Yellow

$cursorContent = '{
  "cursor.chat.maxTokens": 8000,
  "cursor.chat.model": "gpt-4-turbo-preview",
  "cursor.chat.historySize": 100,
  "cursor.rules.enabled": true,
  "cursor.rules.autoApply": true,
  "editor.suggestSelection": "first",
  "editor.wordBasedSuggestions": "off",
  "editor.suggest.maxVisibleSuggestions": 12,
  "editor.hover.delay": 300,
  "terminal.integrated.shell.windows": "C:\\Program Files\\Git\\bin\\bash.exe",
  "terminal.integrated.automationProfile.windows": {
    "path": "C:\\Program Files\\Git\\bin\\bash.exe",
    "args": ["-i"]
  },
  "terminal.integrated.scrollback": 10000,
  "terminal.integrated.confirmOnExit": "never",
  "extensions.autoUpdate": false,
  "files.watcherExclude": {
    "**/node_modules/**": true,
    "**/.next/**": true,
    "**/dist/**": true,
    "**/build/**": true,
    "**/.git/objects/**": true
  },
  "search.exclude": {
    "**/node_modules": true,
    "**/.next": true,
    "**/dist": true,
    "**/build": true
  },
  "typescript.tsserver.maxTsServerMemory": 8192,
  "typescript.tsserver.useSeparateSyntaxServer": true,
  "git.enabled": true,
  "git.autofetch": true,
  "workbench.editor.enablePreview": false,
  "cursor.agent.maxMemory": 4096,
  "cursor.agent.autoCommit": false,
  "cursor.agent.maxFiles": 50
}'

$cursorContent | Out-File -FilePath "$appData\Cursor\User\settings.json" -Encoding UTF8 -Force
Write-Host "  Cursor Settings: OK" -ForegroundColor Green

# ============= PowerShell Profile =============
Write-Host "Configuring PowerShell..." -ForegroundColor Yellow

$psContent = '# PowerShell Profile for Cursor Agent
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$OutputEncoding = [System.Text.Encoding]::UTF8
$PSDefaultParameterValues["Out-Default:Encoding"] = "utf8"

Set-PSReadLineOption -EditMode Emacs -PredictionSource None -MaximumHistoryCount 10000

function global:prompt {
    Write-Host "PS " -NoNewline -ForegroundColor Green
    Write-Host "$(Get-Location)" -NoNewline
    Write-Host ">" -NoNewline -ForegroundColor Gray
    return " "
}

Set-Alias -Name ll -Value Get-ChildItem
Set-Alias -Name grep -Value Select-String

Write-Host "PowerShell Profile Loaded - Optimized for Cursor Agent" -ForegroundColor Cyan
'

$psContent | Out-File -FilePath "$documents\WindowsPowerShell\Microsoft.PowerShell_profile.ps1" -Encoding UTF8 -Force
Write-Host "  PowerShell Profile: OK" -ForegroundColor Green

# ============= Bash Profile =============
Write-Host "Configuring Git Bash..." -ForegroundColor Yellow

$bashContent = '# Git Bash Configuration for Cursor Agent

# UTF-8 Support
export LANG=en_US.UTF-8
export LC_ALL=en_US.UTF-8
export CLICOLOR=1

# Aliases
alias ll="ls -lh"
alias la="ls -lah"
alias grep="grep --color=auto"
alias ..="cd .."
alias ...="cd ../.."
alias h="history"
alias cls="clear"

# Git Aliases
alias gst="git status"
alias gco="git checkout"
alias gbr="git branch"
alias glog="git log --oneline --graph --decorate"
alias gadd="git add"
alias gcm="git commit -m"
alias gps="git push"
alias gpl="git pull"

# Cursor Agent Optimization
export PS1="\[\033[01;32m\]\u@\h\[\033[00m\]:\[\033[01;34m\]\w\[\033[00m\]\$ "

# Performance optimizations
ulimit -S -n 2048

# History settings
export HISTSIZE=10000
export HISTFILESIZE=10000
export HISTCONTROL=ignoredups:ignorespace
shopt -s histappend

# Prevent terminal from hanging
export IGNOREEOF=1

# Welcome message
echo "Git Bash loaded - Optimized for Cursor Agent"
'

$bashContent | Out-File -FilePath "$userHome\.bashrc" -Encoding UTF8 -Force
Write-Host "  Git Bash Profile: OK" -ForegroundColor Green

# ============= Environment Variables =============
Write-Host ""
Write-Host "Setting environment variables..." -ForegroundColor Yellow

[Environment]::SetEnvironmentVariable("CURSOR_AGENT_OPTIMIZED", "true", "User")
[Environment]::SetEnvironmentVariable("CURSOR_TERMINAL_OPTIMIZED", "true", "User")
[Environment]::SetEnvironmentVariable("NODE_OPTIONS", "--max-old-space-size=8192", "User")

Write-Host "  Environment variables: OK" -ForegroundColor Green

# ============= Git Configuration =============
$gitBashPath = "C:\Program Files\Git\bin\bash.exe"
if (Test-Path $gitBashPath) {
    Write-Host ""
    Write-Host "Configuring Git..." -ForegroundColor Yellow
    git config --global core.autocrlf false
    git config --global core.editor "code --wait"
    git config --global init.defaultBranch main
    git config --global color.ui auto
    Write-Host "  Git configuration: OK" -ForegroundColor Green
} else {
    Write-Host "  Git Bash not found - skipping Git configuration" -ForegroundColor Yellow
}

# ============= Summary =============
Write-Host ""
Write-Host "================================" -ForegroundColor Green
Write-Host "  Setup Complete!" -ForegroundColor Green
Write-Host "================================" -ForegroundColor Green
Write-Host ""
Write-Host "Files created at:" -ForegroundColor Yellow
Write-Host "  Windows Terminal: $localAppData\Microsoft\Windows Terminal\settings.json" -ForegroundColor White
Write-Host "  Cursor Settings: $appData\Cursor\User\settings.json" -ForegroundColor White
Write-Host "  PowerShell Profile: $documents\WindowsPowerShell\Microsoft.PowerShell_profile.ps1" -ForegroundColor White
Write-Host "  Git Bash Profile: $userHome\.bashrc" -ForegroundColor White
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "  1. Restart Cursor completely" -ForegroundColor White
Write-Host "  2. Restart Windows Terminal" -ForegroundColor White
Write-Host "  3. Default terminal is now Git Bash" -ForegroundColor White
Write-Host ""
Write-Host "For best results, restart your computer." -ForegroundColor Yellow
Write-Host ""


