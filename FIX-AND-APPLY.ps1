# ============================================
# Fix and Apply Cursor Terminal Settings
# ============================================

Write-Host ""
Write-Host "==================================" -ForegroundColor Cyan
Write-Host "  FIXING CURSOR & TERMINAL SETUP" -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan
Write-Host ""

# Get paths
$appData = $env:APPDATA
$localAppData = $env:LOCALAPPDATA
$cursorSettingsPath = "$appData\Cursor\User\settings.json"

# Check if settings exist
if (Test-Path $cursorSettingsPath) {
    Write-Host "Reading existing Cursor settings..." -ForegroundColor Yellow
    
    $existingSettings = Get-Content $cursorSettingsPath -Raw | ConvertFrom-Json
    $hasTerminalSettings = $existingSettings.'terminal.integrated.shell.windows' -ne $null
    
    if ($hasTerminalSettings) {
        Write-Host "Terminal settings already exist!" -ForegroundColor Green
        Write-Host "Current shell: $($existingSettings.'terminal.integrated.shell.windows')" -ForegroundColor Cyan
    }
} else {
    Write-Host "No existing settings found." -ForegroundColor Yellow
}

Write-Host ""

# Find Git Bash
$gitBashLocations = @(
    "C:\Program Files\Git\bin\bash.exe",
    "C:\Program Files (x86)\Git\bin\bash.exe",
    "${env:ProgramFiles}\Git\bin\bash.exe",
    "${env:ProgramFiles(x86)}\Git\bin\bash.exe"
)

$gitBashPath = $null
foreach ($loc in $gitBashLocations) {
    if (Test-Path $loc) {
        $gitBashPath = $loc
        Write-Host "Found Git Bash: $gitBashPath" -ForegroundColor Green
        break
    }
}

if (-not $gitBashPath) {
    Write-Host "ERROR: Git Bash not found!" -ForegroundColor Red
    Write-Host "Please install Git for Windows" -ForegroundColor Yellow
    exit 1
}

# Escape backslashes for JSON
$escapedPath = $gitBashPath.Replace('\', '\\')

Write-Host ""
Write-Host "Creating Cursor settings with Bash..." -ForegroundColor Yellow

# Merge settings
$cursorSettings = @{
    # Terminal Settings - CRITICAL
    "terminal.integrated.defaultProfile.windows" = "Git Bash"
    "terminal.integrated.shell.windows" = $gitBashPath
    "terminal.integrated.automationProfile.windows" = @{
        "path" = $gitBashPath
        "args" = @("-i")
    }
    "terminal.integrated.profiles.windows" = @{
        "Git Bash" = @{
            "path" = $gitBashPath
            "args" = @("--login")
            "icon" = "$gitBashPath\..\..\mingw64\share\git\git-for-windows.ico"
        }
        "PowerShell" = @{
            "path" = "powershell.exe"
        }
        "Command Prompt" = @{
            "path" = "cmd.exe"
        }
    }
    
    # Performance
    "cursor.chat.maxTokens" = 8000
    "cursor.chat.model" = "gpt-4-turbo-preview"
    "cursor.rules.enabled" = $true
    "typescript.tsserver.maxTsServerMemory" = 8192
    
    # File Watcher Exclusions
    "files.watcherExclude" = @{
        "**/node_modules/**" = $true
        "**/.next/**" = $true
        "**/dist/**" = $true
        "**/build/**" = $true
        "**/.git/objects/**" = $true
    }
    
    # Search Exclusions
    "search.exclude" = @{
        "**/node_modules" = $true
        "**/.next" = $true
        "**/dist" = $true
        "**/build" = $true
    }
    
    # Git
    "git.enabled" = $true
    "git.autofetch" = $true
    
    # Editor
    "editor.suggestSelection" = "first"
    "editor.wordBasedSuggestions" = "off"
    "workbench.editor.enablePreview" = $false
    
    # Terminal UI
    "terminal.integrated.scrollback" = 10000
    "terminal.integrated.confirmOnExit" = "never"
    "terminal.integrated.fontSize" = 12
}

# Convert to JSON and write
$json = $cursorSettings | ConvertTo-Json -Depth 10
$json | Out-File -FilePath $cursorSettingsPath -Encoding UTF8 -Force

Write-Host "Cursor settings updated!" -ForegroundColor Green

# Update Windows Terminal
Write-Host ""
Write-Host "Updating Windows Terminal..." -ForegroundColor Yellow

$wtPath = "$localAppData\Microsoft\Windows Terminal\settings.json"
if (-not (Test-Path "$localAppData\Microsoft\Windows Terminal")) {
    New-Item -ItemType Directory -Path "$localAppData\Microsoft\Windows Terminal" -Force | Out-Null
}

$wtSettings = @{
    "$schema" = "https://aka.ms/terminal-profiles-schema"
    defaultProfile = "{00000000-0000-0000-0000-000000000001}"
    profiles = @{
        defaults = @{
            font = @{
                face = "Consolas"
                size = 12
            }
            historySize = 9001
        }
        list = @(
            @{
                guid = "{00000000-0000-0000-0000-000000000001}"
                name = "Git Bash"
                commandline = "`"$gitBashPath`" --login"
                startingDirectory = "%USERPROFILE%"
            }
        )
    }
}

$wtJson = $wtSettings | ConvertTo-Json -Depth 10
$wtJson | Out-File -FilePath $wtPath -Encoding UTF8 -Force

Write-Host "Windows Terminal updated!" -ForegroundColor Green

# Summary
Write-Host ""
Write-Host "==================================" -ForegroundColor Green
Write-Host "  ✅ SETUP COMPLETE!" -ForegroundColor Green
Write-Host "==================================" -ForegroundColor Green
Write-Host ""
Write-Host "Files updated:" -ForegroundColor Yellow
Write-Host "  • $cursorSettingsPath" -ForegroundColor White
Write-Host "  • $wtPath" -ForegroundColor White
Write-Host ""
Write-Host "IMPORTANT: Restart Cursor NOW!" -ForegroundColor Red
Write-Host ""
Write-Host "After restart:" -ForegroundColor Cyan
Write-Host "  1. Open a new terminal in Cursor" -ForegroundColor White
Write-Host "  2. It should use Git Bash by default" -ForegroundColor White
Write-Host ""

