Write-Host "Cursor Terminal Setup - Simple Version" -ForegroundColor Cyan

# Get paths
$appData = $env:APPDATA
$localAppData = $env:LOCALAPPDATA
$documents = [Environment]::GetFolderPath("MyDocuments")

# Create directories
$wtDir = "$localAppData\Microsoft\Windows Terminal"
$cursorDir = "$appData\Cursor\User"
$psDir = "$documents\WindowsPowerShell"

@($wtDir, $cursorDir, $psDir) | ForEach-Object {
    if (-not (Test-Path $_)) {
        New-Item -ItemType Directory -Path $_ -Force | Out-Null
    }
}

# Windows Terminal Settings
$wtContent = '{
  "$schema": "https://aka.ms/terminal-profiles-schema",
  "defaultProfile": "{00000000-0000-0000-0000-000000000001}",
  "profiles": {
    "defaults": { "font": { "face": "Consolas", "size": 12 } },
    "list": [
      {
        "guid": "{00000000-0000-0000-0000-000000000001}",
        "name": "Git Bash",
        "commandline": "C:\\Program Files\\Git\\bin\\bash.exe --login",
        "startingDirectory": "%USERPROFILE%"
      }
    ]
  }
}'

$wtContent | Out-File -FilePath "$wtDir\settings.json" -Encoding UTF8 -Force
Write-Host "Windows Terminal: OK" -ForegroundColor Green

# Cursor Settings
$cursorContent = '{
  "cursor.rules.enabled": true,
  "terminal.integrated.shell.windows": "C:\\Program Files\\Git\\bin\\bash.exe",
  "files.watcherExclude": { "**/node_modules/**": true },
  "typescript.tsserver.maxTsServerMemory": 8192
}'

$cursorContent | Out-File -FilePath "$cursorDir\settings.json" -Encoding UTF8 -Force
Write-Host "Cursor Settings: OK" -ForegroundColor Green

# Bash Profile
$bashContent = 'export LANG=en_US.UTF-8
alias gst=''git status''
export HISTSIZE=10000'

$bashContent | Out-File -FilePath "$env:USERPROFILE\.bashrc" -Encoding UTF8 -Force
Write-Host "Bash Profile: OK" -ForegroundColor Green

Write-Host ""
Write-Host "Complete! Restart Cursor." -ForegroundColor Yellow

