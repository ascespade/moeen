# إصلاح مشكلة SSH للاتصال بـ cursor-dev
# Fix SSH issue for cursor-dev connection

param(
    [string]$KeyFile = "",
    [switch]$CreateKey,
    [switch]$UsePassword,
    [switch]$Help
)

$SSH_CONFIG = Join-Path $env:USERPROFILE ".ssh\config"

function Write-Status {
    param([string]$Message, [string]$Type = "Info")
    
    $colors = @{
        "Success" = "Green"
        "Error" = "Red"
        "Warning" = "Yellow"
        "Info" = "Cyan"
        "Header" = "Magenta"
    }
    
    $icons = @{
        "Success" = "✅"
        "Error" = "❌"
        "Warning" = "⚠️"
        "Info" = "ℹ️"
        "Header" = "🔧"
    }
    
    Write-Host "$($icons[$Type]) $Message" -ForegroundColor $colors[$Type]
}

if ($Help) {
    Write-Host "🔧 إصلاح مشكلة SSH للاتصال بـ cursor-dev" -ForegroundColor Magenta
    Write-Host "=======================================" -ForegroundColor Magenta
    Write-Host
    Write-Host "المشكلة الحالية:" -ForegroundColor Yellow
    Write-Host "  Permission denied (publickey) - يحتاج مفتاح SSH"
    Write-Host
    Write-Host "الحلول المتاحة:" -ForegroundColor Yellow
    Write-Host "  .\fix_cursor_ssh.ps1 -CreateKey           # إنشاء مفتاح SSH جديد"
    Write-Host "  .\fix_cursor_ssh.ps1 -KeyFile path        # استخدام مفتاح موجود"
    Write-Host "  .\fix_cursor_ssh.ps1 -UsePassword         # استخدام كلمة مرور"
    Write-Host
    exit 0
}

Write-Host "🔧 إصلاح مشكلة الاتصال بـ cursor-dev" -ForegroundColor Magenta
Write-Host "====================================" -ForegroundColor Magenta
Write-Host

Write-Status "تحليل المشكلة..." "Header"
Write-Status "الخطأ: Permission denied (publickey)" "Error"
Write-Status "السبب: السيرفر يتطلب مفتاح SSH للمصادقة" "Warning"

if ($CreateKey) {
    Write-Status "إنشاء مفتاح SSH جديد..." "Header"
    
    $keyPath = Join-Path $env:USERPROFILE ".ssh\id_ed25519_cursor"
    
    if (Test-Path $keyPath) {
        Write-Status "مفتاح SSH موجود بالفعل: $keyPath" "Warning"
        $overwrite = Read-Host "هل تريد إنشاء مفتاح جديد؟ (y/N)"
        if ($overwrite -notmatch "^[Yy]$") {
            Write-Status "تم الاحتفاظ بالمفتاح الموجود" "Info"
            $KeyFile = $keyPath
        } else {
            Remove-Item "$keyPath*" -Force -ErrorAction SilentlyContinue
        }
    }
    
    if (-not (Test-Path $keyPath)) {
        Write-Status "إنشاء مفتاح ED25519..." "Info"
        try {
            $result = & ssh-keygen -t ed25519 -f $keyPath -N '""' -C "cursor-dev-$(Get-Date -Format 'yyyyMMdd')" 2>&1
            if (Test-Path $keyPath) {
                Write-Status "تم إنشاء المفتاح بنجاح: $keyPath" "Success"
                $KeyFile = $keyPath
            } else {
                Write-Status "فشل في إنشاء المفتاح" "Error"
                exit 1
            }
        } catch {
            Write-Status "خطأ في إنشاء المفتاح: $($_.Exception.Message)" "Error"
            exit 1
        }
    }
}

if ($UsePassword) {
    Write-Status "إعداد الاتصال بكلمة المرور..." "Header"
    
    # Update SSH config to allow password authentication
    $configContent = Get-Content $SSH_CONFIG -Raw
    $updatedConfig = $configContent -replace "(Host cursor-dev[\s\S]*?)(# IdentityFile.*)", "`$1PasswordAuthentication yes`n    PreferredAuthentications password,publickey`n    `$2"
    
    $updatedConfig | Out-File -FilePath $SSH_CONFIG -Encoding UTF8
    Write-Status "تم تحديث إعدادات SSH للسماح بكلمة المرور" "Success"
    
    Write-Host
    Write-Status "الآن يمكنك الاتصال باستخدام كلمة المرور" "Info"
    Write-Status "في Cursor IDE: Remote-SSH -> cursor-dev" "Info"
    exit 0
}

if ($KeyFile) {
    if (-not (Test-Path $KeyFile)) {
        Write-Status "ملف المفتاح غير موجود: $KeyFile" "Error"
        exit 1
    }
    
    Write-Status "تحديث SSH config لاستخدام المفتاح..." "Info"
    
    # Update SSH config with the key file
    $configContent = Get-Content $SSH_CONFIG -Raw
    $keyFileEscaped = $KeyFile -replace '\\', '/'
    $updatedConfig = $configContent -replace "(Host cursor-dev[\s\S]*?)# IdentityFile.*", "`$1IdentityFile $keyFileEscaped"
    
    $updatedConfig | Out-File -FilePath $SSH_CONFIG -Encoding UTF8
    Write-Status "تم تحديث SSH config بالمفتاح: $KeyFile" "Success"
    
    # Test the connection
    Write-Status "اختبار الاتصال..." "Info"
    try {
        $testResult = & ssh -o ConnectTimeout=10 -o BatchMode=yes cursor-dev "echo 'اتصال ناجح!' && hostname" 2>&1
        if ($testResult -match "اتصال ناجح") {
            Write-Status "✅ الاتصال يعمل بنجاح!" "Success"
            Write-Status "يمكنك الآن استخدام cursor-dev في Cursor IDE" "Success"
        } else {
            Write-Status "❌ الاتصال لا يزال يفشل" "Error"
            Write-Status "قد تحتاج لنسخ المفتاح العام للسيرفر" "Warning"
            
            if (Test-Path "$KeyFile.pub") {
                Write-Status "المفتاح العام:" "Info"
                Get-Content "$KeyFile.pub" | Write-Host -ForegroundColor Green
                Write-Host
                Write-Status "انسخ هذا المفتاح وأضفه لـ ~/.ssh/authorized_keys على السيرفر" "Warning"
            }
        }
    } catch {
        Write-Status "خطأ في اختبار الاتصال: $($_.Exception.Message)" "Error"
    }
} else {
    Write-Status "لم يتم تحديد مفتاح SSH" "Warning"
    Write-Host
    Write-Status "الخيارات المتاحة:" "Header"
    Write-Host "  1. إنشاء مفتاح جديد:" -ForegroundColor Yellow
    Write-Host "     .\fix_cursor_ssh.ps1 -CreateKey" -ForegroundColor Green
    Write-Host
    Write-Host "  2. استخدام مفتاح موجود:" -ForegroundColor Yellow
    Write-Host "     .\fix_cursor_ssh.ps1 -KeyFile 'D:\vm\my-dev-key.pem'" -ForegroundColor Green
    Write-Host
    Write-Host "  3. استخدام كلمة مرور:" -ForegroundColor Yellow
    Write-Host "     .\fix_cursor_ssh.ps1 -UsePassword" -ForegroundColor Green
    Write-Host
    
    # Check for existing keys
    $sshDir = Join-Path $env:USERPROFILE ".ssh"
    if (Test-Path $sshDir) {
        $existingKeys = Get-ChildItem $sshDir -Filter "*.pem" -File
        $existingKeys += Get-ChildItem $sshDir -Filter "id_*" -File | Where-Object { $_.Extension -eq "" }
        
        if ($existingKeys.Count -gt 0) {
            Write-Status "مفاتيح SSH موجودة:" "Info"
            foreach ($key in $existingKeys) {
                Write-Host "  📁 $($key.FullName)" -ForegroundColor Gray
            }
            Write-Host
            Write-Status "يمكنك استخدام أحد هذه المفاتيح:" "Info"
            Write-Host "  .\fix_cursor_ssh.ps1 -KeyFile '$($existingKeys[0].FullName)'" -ForegroundColor Green
        }
    }
}

Write-Host
Write-Status "💡 نصائح إضافية:" "Info"
Write-Host "  • تأكد من أن المفتاح العام موجود على السيرفر" -ForegroundColor Gray
Write-Host "  • استخدم ssh-copy-id لنسخ المفتاح العام" -ForegroundColor Gray
Write-Host "  • تحقق من صلاحيات المفتاح (600)" -ForegroundColor Gray
