@echo off
echo Fixing Arabic Display in Console
echo ================================

echo.
echo Step 1: Setting console code page to UTF-8
chcp 65001

echo.
echo Step 2: Starting PowerShell with UTF-8 support
powershell.exe -NoExit -Command "& {[Console]::OutputEncoding = [System.Text.Encoding]::UTF8; [Console]::InputEncoding = [System.Text.Encoding]::UTF8; $OutputEncoding = [System.Text.Encoding]::UTF8; [System.Threading.Thread]::CurrentThread.CurrentCulture = 'ar-SA'; [System.Threading.Thread]::CurrentThread.CurrentUICulture = 'ar-SA'; Write-Host 'مرحبا بك في بيئة التطوير البعيد' -ForegroundColor Green; Write-Host 'Arabic text should display correctly now' -ForegroundColor Cyan}"

echo.
echo If Arabic still shows as question marks:
echo 1. Right-click on PowerShell title bar
echo 2. Select Properties
echo 3. Go to Font tab
echo 4. Change font to "Consolas" or "Courier New"
echo 5. Click OK
echo.
echo Press any key to exit...
pause >nul
