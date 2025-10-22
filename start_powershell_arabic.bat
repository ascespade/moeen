@echo off
chcp 65001 >nul
powershell.exe -NoExit -Command "& {[Console]::OutputEncoding = [System.Text.Encoding]::UTF8; [Console]::InputEncoding = [System.Text.Encoding]::UTF8; $OutputEncoding = [System.Text.Encoding]::UTF8; [System.Threading.Thread]::CurrentThread.CurrentCulture = 'ar-SA'; [System.Threading.Thread]::CurrentThread.CurrentUICulture = 'ar-SA'; Write-Host 'PowerShell with Arabic support loaded!' -ForegroundColor Green}"
