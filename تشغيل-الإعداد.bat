@echo off
chcp 65001 >nul
echo ========================================
echo   إعداد Cursor والترمنال
echo   Cursor Terminal Setup
echo ========================================
echo.
echo جاري الإعداد...
echo.

powershell.exe -ExecutionPolicy Bypass -File "cursor-terminal-setup-FINAL.ps1"

echo.
echo تم التنفيذ!
echo.
pause


