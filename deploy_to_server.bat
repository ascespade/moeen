@echo off
echo Deploying Remote Development Setup
echo ==================================

echo.
echo Step 1: Copy setup script to server
echo Please run these commands manually:
echo.
echo scp remote_setup.sh cursor-dev:~/
echo.
echo Step 2: Connect to server and run setup
echo ssh cursor-dev
echo chmod +x ~/remote_setup.sh
echo ~/remote_setup.sh
echo.
echo Step 3: Test the setup
echo exit
echo dev-remote
echo.
echo After completing these steps:
echo - All development tools will be installed on remote server
echo - VS Code Server will be available at http://100.64.64.33:8080
echo - Local PowerShell will have Arabic support
echo - New commands will be available for remote development
echo.
echo Press any key to continue...
pause >nul

echo.
echo Testing current setup...
powershell -ExecutionPolicy Bypass -Command "ssh cursor-dev 'echo Connection test successful'"

echo.
echo Press any key to exit...
pause >nul
