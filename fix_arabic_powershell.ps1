# Fix Arabic Encoding in PowerShell
Write-Host "🔧 إصلاح مشكلة العربية في PowerShell..." -ForegroundColor Green

# Set console encoding to UTF-8
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
[Console]::InputEncoding = [System.Text.Encoding]::UTF8
$OutputEncoding = [System.Text.Encoding]::UTF8

# Set culture for Arabic
[System.Threading.Thread]::CurrentThread.CurrentCulture = 'ar-SA'
[System.Threading.Thread]::CurrentThread.CurrentUICulture = 'ar-SA'

# Test Arabic display
Write-Host "✅ تم إصلاح مشكلة العربية!" -ForegroundColor Green
Write-Host "الآن يمكنك رؤية النص العربي بوضوح" -ForegroundColor Cyan
Write-Host "This is English text mixed with Arabic: مرحبا بك" -ForegroundColor Yellow

# Update PowerShell profile
$profileContent = @"
# Arabic encoding fix
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
[Console]::InputEncoding = [System.Text.Encoding]::UTF8
`$OutputEncoding = [System.Text.Encoding]::UTF8

# Set culture for Arabic
[System.Threading.Thread]::CurrentThread.CurrentCulture = 'ar-SA'
[System.Threading.Thread]::CurrentThread.CurrentUICulture = 'ar-SA'

Write-Host "تم تحميل إعدادات العربية بنجاح!" -ForegroundColor Green
"@

$profilePath = $PROFILE
$profileDir = Split-Path $profilePath -Parent
if (!(Test-Path $profileDir)) {
    New-Item -ItemType Directory -Path $profileDir -Force | Out-Null
}

Add-Content -Path $profilePath -Value $profileContent -Force
Write-Host "✅ تم حفظ الإعدادات في ملف الملف الشخصي" -ForegroundColor Green

Write-Host "`n🔄 يرجى إعادة تشغيل PowerShell لتطبيق التغييرات" -ForegroundColor Yellow
