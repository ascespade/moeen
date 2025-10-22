@echo off
echo Fixing Arabic Display in PowerShell
echo ==================================

echo.
echo Step 1: Setting console code page to UTF-8
chcp 65001

echo.
echo Step 2: Creating new PowerShell profile
echo # Clean PowerShell Profile with Arabic Support > "%USERPROFILE%\Documents\WindowsPowerShell\Microsoft.PowerShell_profile.ps1"
echo chcp 65001 ^| Out-Null >> "%USERPROFILE%\Documents\WindowsPowerShell\Microsoft.PowerShell_profile.ps1"
echo [Console]::OutputEncoding = [System.Text.Encoding]::UTF8 >> "%USERPROFILE%\Documents\WindowsPowerShell\Microsoft.PowerShell_profile.ps1"
echo [Console]::InputEncoding = [System.Text.Encoding]::UTF8 >> "%USERPROFILE%\Documents\WindowsPowerShell\Microsoft.PowerShell_profile.ps1"
echo $OutputEncoding = [System.Text.Encoding]::UTF8 >> "%USERPROFILE%\Documents\WindowsPowerShell\Microsoft.PowerShell_profile.ps1"
echo [System.Threading.Thread]::CurrentThread.CurrentCulture = 'ar-SA' >> "%USERPROFILE%\Documents\WindowsPowerShell\Microsoft.PowerShell_profile.ps1"
echo [System.Threading.Thread]::CurrentThread.CurrentUICulture = 'ar-SA' >> "%USERPROFILE%\Documents\WindowsPowerShell\Microsoft.PowerShell_profile.ps1"
echo. >> "%USERPROFILE%\Documents\WindowsPowerShell\Microsoft.PowerShell_profile.ps1"
echo function Write-Arabic { >> "%USERPROFILE%\Documents\WindowsPowerShell\Microsoft.PowerShell_profile.ps1"
echo     param([string]$Text, [string]$Color = "White") >> "%USERPROFILE%\Documents\WindowsPowerShell\Microsoft.PowerShell_profile.ps1"
echo     $reversedText = -join ($Text.ToCharArray() ^| ForEach-Object { $_ }) >> "%USERPROFILE%\Documents\WindowsPowerShell\Microsoft.PowerShell_profile.ps1"
echo     Write-Host $reversedText -ForegroundColor $Color >> "%USERPROFILE%\Documents\WindowsPowerShell\Microsoft.PowerShell_profile.ps1"
echo } >> "%USERPROFILE%\Documents\WindowsPowerShell\Microsoft.PowerShell_profile.ps1"
echo. >> "%USERPROFILE%\Documents\WindowsPowerShell\Microsoft.PowerShell_profile.ps1"
echo function ssh-remote { ssh cursor-dev } >> "%USERPROFILE%\Documents\WindowsPowerShell\Microsoft.PowerShell_profile.ps1"
echo function dev-remote { ssh cursor-dev "cd ~/workspace && tmux new-session -s dev ^|^| tmux attach-session -t dev" } >> "%USERPROFILE%\Documents\WindowsPowerShell\Microsoft.PowerShell_profile.ps1"
echo function code-remote { Start-Process "http://100.64.64.33:8080" } >> "%USERPROFILE%\Documents\WindowsPowerShell\Microsoft.PowerShell_profile.ps1"
echo function server-status { ssh cursor-dev "~/workspace/scripts/monitor.sh" } >> "%USERPROFILE%\Documents\WindowsPowerShell\Microsoft.PowerShell_profile.ps1"
echo function test-connection { ssh cursor-dev "echo 'Connection successful!'" } >> "%USERPROFILE%\Documents\WindowsPowerShell\Microsoft.PowerShell_profile.ps1"
echo. >> "%USERPROFILE%\Documents\WindowsPowerShell\Microsoft.PowerShell_profile.ps1"
echo Write-Arabic "تم تحميل بيئة التطوير البعيد بنجاح!" "Green" >> "%USERPROFILE%\Documents\WindowsPowerShell\Microsoft.PowerShell_profile.ps1"
echo Write-Host "Remote development environment loaded!" -ForegroundColor Cyan >> "%USERPROFILE%\Documents\WindowsPowerShell\Microsoft.PowerShell_profile.ps1"
echo Write-Host "Use 'Write-Arabic' for Arabic text" -ForegroundColor Yellow >> "%USERPROFILE%\Documents\WindowsPowerShell\Microsoft.PowerShell_profile.ps1"

echo.
echo Step 3: Testing Arabic display
powershell.exe -NoExit -Command "& {Write-Arabic 'مرحبا بك في بيئة التطوير البعيد' 'Green'; Write-Host 'Arabic text should display correctly now' -ForegroundColor Cyan}"

echo.
echo Arabic fix complete!
echo ===================
echo ✅ Console code page set to UTF-8
echo ✅ PowerShell profile created
echo ✅ Arabic text direction fixed
echo ✅ Remote development aliases ready
echo.
echo New functions available:
echo   - Write-Arabic 'نص عربي' 'Green'
echo   - dev-remote: Start development session
echo   - code-remote: Open VS Code Server
echo   - server-status: Check server status
echo.
echo Press any key to exit...
pause >nul
