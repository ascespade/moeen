# Cursor Terminal & Performance Setup Script
# Run this script to configure Cursor and terminal on system level

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

# Create directories if they don't exist
$directories = @(
    "$localAppData\Microsoft\Windows Terminal",
    "$appData\Cursor\User",
    "$documents\WindowsPowerShell"
)

foreach ($dir in $directories) {
    if (-not (Test-Path $dir)) {
        New-Item -ItemType Directory -Path $dir -Force | Out-Null
        Write-Host "Created: $dir" -ForegroundColor Green
    }
}

# Create Windows Terminal settings
$wtSettings = @'
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
        "icon": "C:\\Users\\Public\\Documents\\powershell\\Assets\\WindowsPowershell.ico",
        "hidden": false,
        "startingDirectory": "%USERPROFILE%"
      },
      {
        "guid": "{b453ae62-4e3d-5e58-b989-0aec8007c5e6}",
        "name": "Windows PowerShell",
        "commandline": "powershell.exe",
        "hidden": false,
        "startingDirectory": "%USERPROFILE%"
      },
      {
        "guid": "{61c54bbd-c2c6-5271-96e7-009a87ff44bf}",
        "name": "CMD",
        "commandline": "cmd.exe",
        "hidden": false,
        "startingDirectory": "%USERPROFILE%"
      }
    ]
  },
  "schemes": [],
  "actions": [
    {
      "command": {
        "action": "copy",
        "singleLine": false
      },
      "keys": "ctrl+c"
    },
    {
      "command": {
        "action": "paste",
        "singleLine": false
      },
      "keys": "ctrl+v"
    },
    {
      "command": "toggleFullscreen",
      "keys": "f11"
    },
    {
      "command": "openSettings",
      "keys": "ctrl+,"
    }
  ]
}
'@

$wtSettingsPath = "$localAppData\Microsoft\Windows Terminal\settings.json"
$wtSettings | Out-File -FilePath $wtSettingsPath -Encoding UTF8 -Force
Write-Host "✓ Windows Terminal settings created" -ForegroundColor Green

# Create Cursor optimized settings  
$cursorSettings = @'
{
  "cursor.chat.maxTokens": 8000,
  "cursor.chat.model": "gpt-4-turbo-preview",
  "cursor.chat.historySize": 100,
  "cursor.rules.enabled": true,
  "cursor.rules.maxTokens": 4000,
  "cursor.rules.autoApply": true,
  "editor.suggestSelection": "first",
  "editor.wordBasedSuggestions": "off",
  "editor.suggest.snippetsPreventQuickSuggestions": false,
  "editor.suggest.showKeywords": false,
  "editor.suggest.showSnippets": true,
  "editor.suggest.showClasses": true,
  "editor.suggest.showFunctions": true,
  "editor.suggest.showVariables": true,
  "editor.suggest.maxVisibleSuggestions": 12,
  "editor.quickSuggestions": {
    "other": true,
    "comments": false,
    "strings": true
  },
  "editor.hover.delay": 300,
  "editor.codeActionsOnSave": {
    "source.fixAll": "explicit",
    "source.organizeImports": "explicit"
  },
  "terminal.integrated.shell.windows": "C:\\Program Files\\Git\\bin\\bash.exe",
  "terminal.integrated.automationProfile.windows": {
    "path": "C:\\Program Files\\Git\\bin\\bash.exe",
    "args": ["-i"]
  },
  "terminal.integrated.rendererType": "dom",
  "terminal.integrated.scrollback": 10000,
  "terminal.integrated.enableMultiLinePasteWarning": false,
  "terminal.integrated.copyOnSelection": true,
  "terminal.integrated.cursorBlinking": true,
  "terminal.integrated.cursorStyle": "line",
  "terminal.integrated.fontSize": 12,
  "terminal.integrated.fontFamily": "Consolas, Courier New, monospace",
  "terminal.integrated.confirmOnExit": "never",
  "terminal.integrated.allowChords": false,
  "extensions.autoUpdate": false,
  "extensions.autoCheckUpdates": false,
  "files.watcherExclude": {
    "**/.git/objects/**": true,
    "**/.git/subtree-cache/**": true,
    "**/node_modules/**": true,
    "**/tmp/**": true,
    "**/dist/**": true,
    "**/build/**": true,
    "**/.next/**": true,
    "**/out/**": true
  },
  "search.exclude": {
    "**/node_modules": true,
    "**/bower_components": true,
    "**/.git": true,
    "**/tmp": true,
    "**/dist": true,
    "**/build": true,
    "**/.next": true,
    "**/out": true
  },
  "typescript.tsserver.maxTsServerMemory": 8192,
  "typescript.tsserver.useSeparateSyntaxServer": true,
  "typescript.preferences.quoteStyle": "single",
  "javascript.preferences.quoteStyle": "single",
  "git.enabled": true,
  "git.autofetch": true,
  "git.confirmSync": false,
  "workbench.editor.enablePreview": false,
  "workbench.editor.limit.enabled": false,
  "cursor.agent.maxMemory": 4096,
  "cursor.agent.autoCommit": false,
  "cursor.agent.maxFiles": 50,
  "cursor.agent.timeout": 300,
  "[javascript]": {
    "editor.formatOnSave": true,
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[typescript]": {
    "editor.formatOnSave": true,
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[json]": {
    "editor.formatOnSave": true
  }
}
'@

$cursorSettingsPath = "$appData\Cursor\User\settings.json"
$cursorSettings | Out-File -FilePath $cursorSettingsPath -Encoding UTF8 -Force
Write-Host "✓ Cursor settings created" -ForegroundColor Green

# Create PowerShell profile
$psProfile = @'
# PowerShell Profile for Better Cursor Agent Performance
# This profile fixes terminal hanging issues and improves agent responsiveness

# Set console encoding to UTF-8
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$OutputEncoding = [System.Text.Encoding]::UTF8

# Increase buffer size to prevent hanging
$PSDefaultParameterValues['Out-Default:Encoding'] = 'utf8'

# Set execution policy (current user only)
if ((Get-ExecutionPolicy -Scope CurrentUser) -ne 'RemoteSigned') {
    Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser -Force
}

# Enable ANSI color support
$PSStyle.OutputRendering = "Ansi"

# Performance optimizations
$PSDefaultParameterValues['*:ErrorAction'] = 'SilentlyContinue'
Set-PSReadLineOption -EditMode Emacs
Set-PSReadLineOption -PredictionSource None
Set-PSReadLineOption -MaximumHistoryCount 10000

# Custom prompt for better cursor integration
function global:prompt {
    # Simple prompt without complex logic to prevent hanging
    Write-Host "PS " -NoNewline -ForegroundColor Green
    Write-Host "$(Get-Location)" -NoNewline
    Write-Host ">" -NoNewline -ForegroundColor Gray
    return " "
}

# Function to speed up cursor agent
function Reset-Terminal {
    Clear-Host
    Write-Host "Terminal Reset - Cursor Agent Ready" -ForegroundColor Green
}

# Alias for common tasks
Set-Alias -Name ll -Value Get-ChildItem
Set-Alias -Name grep -Value Select-String

# Function to check if cursor agent is active
function Test-CursorAgent {
    $cursorProcess = Get-Process -Name "Cursor" -ErrorAction SilentlyContinue
    if ($cursorProcess) {
        Write-Host "Cursor is running" -ForegroundColor Green
    } else {
        Write-Host "Cursor is not running" -ForegroundColor Yellow
    }
}

# Optimize module loading
$env:PSModuleAutoLoadingPreference = 'None'

# Welcome message
Write-Host "PowerShell Profile Loaded - Optimized for Cursor Agent" -ForegroundColor Cyan
'@

$psProfilePath = "$documents\WindowsPowerShell\Microsoft.PowerShell_profile.ps1"
$psProfile | Out-File -FilePath $psProfilePath -Encoding UTF8 -Force
Write-Host "✓ PowerShell profile created" -ForegroundColor Green

# Create Git Bash profile
$bashProfile = @'
# Git Bash Configuration for Better Cursor Agent Performance

# Colors
export CLICOLOR=1
export LSCOLORS=ExFxCxDxBxegedabagacad

# UTF-8 Support
export LANG=en_US.UTF-8
export LC_ALL=en_US.UTF-8

# Aliases
alias ll='ls -lh'
alias la='ls -lah'
alias grep='grep --color=auto'
alias ..='cd ..'
alias ...='cd ../..'
alias h='history'
alias cls='clear'
alias path='echo $PATH | tr -s ":" "\n"'

# Git Aliases
alias gst='git status'
alias gco='git checkout'
alias gbr='git branch'
alias glog='git log --oneline --graph --decorate'
alias gadd='git add'
alias gcm='git commit -m'
alias gps='git push'
alias gpl='git pull'

# Cursor Agent Optimization
export PS1='\[\033[01;32m\]\u@\h\[\033[00m\]:\[\033[01;34m\]\w\[\033[00m\]\$ '

# Performance optimizations
ulimit -S -n 2048

# History settings
export HISTSIZE=10000
export HISTFILESIZE=10000
export HISTCONTROL=ignoredups:ignorespace

# Append to history file instead of overwriting
shopt -s histappend

# Set default editor
export EDITOR=nano

# Prevent terminal from hanging
export IGNOREEOF=1

# Welcome message
echo "Git Bash loaded - Optimized for Cursor Agent"
'@

$bashProfilePath = "$userHome\.bashrc"
$bashProfile | Out-File -FilePath $bashProfilePath -Encoding UTF8 -Force
Write-Host "✓ Git Bash profile created" -ForegroundColor Green

# Set environment variables
Write-Host ""
Write-Host "Setting environment variables..." -ForegroundColor Yellow

[Environment]::SetEnvironmentVariable("CURSOR_AGENT_OPTIMIZED", "true", "User")
[Environment]::SetEnvironmentVariable("CURSOR_TERMINAL_OPTIMIZED", "true", "User")
[Environment]::SetEnvironmentVariable("NODE_OPTIONS", "--max-old-space-size=8192", "User")

Write-Host "✓ Environment variables set" -ForegroundColor Green

# Configure Git
if (Test-Path $gitBashPath) {
    Write-Host ""
    Write-Host "Configuring Git..." -ForegroundColor Yellow
    git config --global core.autocrlf false
    git config --global core.editor "code --wait"
    git config --global init.defaultBranch main
    git config --global color.ui auto
    Write-Host "✓ Git configured" -ForegroundColor Green
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "Setup Complete!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Configuration files created at:" -ForegroundColor Yellow
Write-Host "  • Windows Terminal: $wtSettingsPath" -ForegroundColor White
Write-Host "  • Cursor Settings: $cursorSettingsPath" -ForegroundColor White
Write-Host "  • PowerShell Profile: $psProfilePath" -ForegroundColor White
Write-Host "  • Git Bash Profile: $bashProfilePath" -ForegroundColor White
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "  1. Restart Cursor completely" -ForegroundColor White
Write-Host "  2. Restart Windows Terminal" -ForegroundColor White
Write-Host "  3. The default terminal will now be Git Bash" -ForegroundColor White
Write-Host "  4. Terminal should no longer require Enter key presses" -ForegroundColor White
Write-Host ""
Write-Host "For best results, restart your computer." -ForegroundColor Yellow
Write-Host ""

