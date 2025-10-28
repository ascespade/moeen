@echo off
echo ========================================
echo Cursor Terminal Setup
echo ========================================
echo.
echo This will configure Cursor and Terminal settings.
echo.
pause

powershell.exe -ExecutionPolicy Bypass -File "%~dp0setup-cursor-terminal.ps1"

echo.
echo Setup complete!
pause


