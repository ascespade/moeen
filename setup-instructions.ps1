# Instructions for Cursor Terminal Setup
# التعليمات لإعداد Cursor والترمنال

Write-Host @"
========================================
  Cursor Terminal Setup Instructions
  إعدادات Cursor والترمنال
========================================

This setup will:
هذا الإعداد سيقوم بـ:

  1. Set Git Bash as default terminal (تحديد Bash كافتراضي)
  2. Optimize Cursor performance (تحسين أداء Cursor)
  3. Fix terminal hanging issues (حل مشكلة توقف التيرمنال)
  4. Configure all settings at user level (إعدادات على مستوى المستخدم)

IMPORTANT: This modifies system-wide settings, not project files.
مهم: هذا يعدل إعدادات النظام، ليس ملفات المشروع.

Files will be created in:
الملفات ستُنشأ في:

  • Windows Terminal Settings
    %LOCALAPPDATA%\Microsoft\Windows Terminal\
    
  • Cursor Settings  
    %APPDATA%\Cursor\User\
    
  • PowerShell Profile
    Documents\WindowsPowerShell\
    
  • Bash Profile
    %USERPROFILE%\.bashrc

Current location of setup script:
موقع سكربت الإعداد الحالي:

"@ -ForegroundColor Cyan

Write-Host "  $PSScriptRoot" -ForegroundColor Yellow
Write-Host ""

Write-Host "To run the setup:" -ForegroundColor Cyan
Write-Host "لتشغيل الإعداد:" -ForegroundColor Cyan
Write-Host ""
Write-Host "  cd '$PSScriptRoot'" -ForegroundColor White
Write-Host "  .\setup-cursor-terminal.ps1" -ForegroundColor Green
Write-Host ""

Write-Host "Or double-click: run-setup.bat" -ForegroundColor White
Write-Host "أو انقر مرتين على: run-setup.bat" -ForegroundColor White
Write-Host ""


