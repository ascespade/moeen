@echo off
title Cursor Development Server - Quick Setup
color 0A

echo.
echo ===============================================
echo    Cursor Development Server - Quick Setup
echo ===============================================
echo.

REM Check if running as administrator
net session >nul 2>&1
if %errorLevel% == 0 (
    echo [OK] Running as Administrator
) else (
    echo [ERROR] This script requires Administrator privileges
    echo Please right-click and select "Run as Administrator"
    echo.
    pause
    exit /b 1
)

echo.
echo [INFO] Starting PowerShell script execution...
echo.

REM Set execution policy and run PowerShell script
powershell.exe -ExecutionPolicy Bypass -Command "& {Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser -Force; if (Test-Path 'setup-windows-ssh.ps1') { .\setup-windows-ssh.ps1 } else { Write-Host 'setup-windows-ssh.ps1 not found in current directory' -ForegroundColor Red; Write-Host 'Please make sure the PowerShell script is in the same folder as this batch file' -ForegroundColor Yellow } }"

echo.
echo ===============================================
echo           Setup Process Completed
echo ===============================================
echo.
echo Check your desktop for the following shortcuts:
echo   - SSH to Cursor Dev
echo   - VS Code Server  
echo   - Cursor Server
echo.
echo You can now connect using any of these methods:
echo   1. Double-click "SSH to Cursor Dev" on desktop
echo   2. Open Command Prompt and type: ssh cursor-dev
echo   3. Open PowerShell and run: .\Connect-to-Cursor-Dev.ps1
echo.
echo Web Access:
echo   VS Code: http://100.98.137.52:8081 (Password: devpassword123)
echo   Cursor:  http://100.98.137.52:26054
echo.
pause