# إعداد سيرفر Cursor للاستخدام مع Cursor IDE
# Setup Cursor Server for Cursor IDE

param(
    [switch]$CreateNewKey,
    [switch]$CopyKey,
    [switch]$TestConnection,
    [switch]$FixConfig,
    [switch]$Help
)

$CURSOR_IP = "100.87.127.117"
$CURSOR_USER = "ubuntu"
$SSH_DIR = Join-Path $env:USERPROFILE ".ssh"
$SSH_CONFIG = Join-Path $SSH_DIR "config"

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
    Write-Host "🔧 إعداد سيرفر Cursor للاستخدام مع Cursor IDE" -ForegroundColor Magenta
    Write-Host "=============================================" -ForegroundColor Magenta
    Write-Host
    Write-Host "الاستخدام:" -ForegroundColor Yellow
    Write-Host "  .\setup_cursor_server.ps1 -CreateNewKey    # إنشاء مفتاح SSH جديد"
    Write-Host "  .\setup_cursor_server.ps1 -CopyKey         # نسخ المفتاح للسيرفر"
    Write-Host "  .\setup_cursor_server.ps1 -TestConnection  # اختبار الاتصال"
    Write-Host "  .\setup_cursor_server.ps1 -FixConfig       # إصلاح SSH config"
    Write-Host
    Write-Host "الهدف: جعل cursor-dev يعمل في Cursor IDE" -ForegroundColor Green
    Write-Host
    exit 0
}

Write-Host "🚀 إعداد سيرفر Cursor للاستخدام مع Cursor IDE" -ForegroundColor Magenta
Write-Host "=============================================" -ForegroundColor Magenta
Write-Host

# Check current status
Write-Status "فحص الوضع الحالي..." "Header"
Write-Status "سيرفر Cursor: $CURSOR_IP" "Info"
Write-Status "المستخدم: $CURSOR_USER" "Info"

# Test basic connectivity
$ping = Test-NetConnection -ComputerName $CURSOR_IP -InformationLevel Quiet -WarningAction SilentlyContinue
if ($ping) {
    Write-Status "الاتصال الأساسي متاح ✓" "Success"
} else {
    Write-Status "فشل في الاتصال الأساسي" "Error"
    exit 1
}

# Check SSH port
$sshPort = Test-NetConnection -ComputerName $CURSOR_IP -Port 22 -InformationLevel Quiet -WarningAction SilentlyContinue
if ($sshPort) {
    Write-Status "منفذ SSH متاح ✓" "Success"
} else {
    Write-Status "منفذ SSH غير متاح" "Error"
    exit 1
}

if ($CreateNewKey) {
    Write-Status "إنشاء مفتاح SSH جديد لسيرفر Cursor..." "Header"
    
    $keyName = "cursor_server_key_$(Get-Date -Format 'yyyyMMdd_HHmmss')"
    $keyPath = Join-Path $SSH_DIR $keyName
    
    try {
        Write-Status "إنشاء مفتاح ED25519..." "Info"
        $result = & ssh-keygen -t ed25519 -f $keyPath -N '""' -C "cursor-server-$(Get-Date -Format 'yyyyMMdd')" 2>&1
        
        if (Test-Path $keyPath) {
            Write-Status "تم إنشاء المفتاح: $keyPath" "Success"
            Write-Status "المفتاح العام: $keyPath.pub" "Success"
            
            # Update SSH config
            Write-Status "تحديث SSH config..." "Info"
            $configContent = Get-Content $SSH_CONFIG -Raw
            $keyPathForConfig = $keyPath -replace '\\', '/'
            $updatedConfig = $configContent -replace "(Host cursor-dev[\s\S]*?)# IdentityFile.*", "`$1IdentityFile $keyPathForConfig"
            $updatedConfig | Out-File -FilePath $SSH_CONFIG -Encoding UTF8
            Write-Status "تم تحديث SSH config" "Success"
            
            # Show public key
            Write-Host
            Write-Status "المفتاح العام الجديد:" "Header"
            $publicKey = Get-Content "$keyPath.pub"
            Write-Host $publicKey -ForegroundColor Green
            Write-Host
            
            Write-Status "احفظ هذا المفتاح - ستحتاجه لنسخه للسيرفر" "Warning"
            
        } else {
            Write-Status "فشل في إنشاء المفتاح" "Error"
            exit 1
        }
    } catch {
        Write-Status "خطأ في إنشاء المفتاح: $($_.Exception.Message)" "Error"
        exit 1
    }
}

if ($CopyKey) {
    Write-Status "نسخ المفتاح العام لسيرفر Cursor..." "Header"
    
    # Find the key file from SSH config
    $configContent = Get-Content $SSH_CONFIG -Raw
    if ($configContent -match "Host cursor-dev[\s\S]*?IdentityFile\s+([^\s#]+)") {
        $keyPath = $matches[1] -replace '/', '\'
        
        if (Test-Path $keyPath) {
            $publicKeyPath = "$keyPath.pub"
            if (Test-Path $publicKeyPath) {
                $publicKey = Get-Content $publicKeyPath
                Write-Status "المفتاح العام الموجود:" "Info"
                Write-Host $publicKey -ForegroundColor Green
                Write-Host
                
                Write-Status "طرق نسخ المفتاح للسيرفر:" "Header"
                Write-Host
                Write-Host "الطريقة 1: استخدام ssh-copy-id (إذا كان متاح)" -ForegroundColor Yellow
                Write-Host "ssh-copy-id -i `"$publicKeyPath`" $CURSOR_USER@$CURSOR_IP" -ForegroundColor Green
                Write-Host
                Write-Host "الطريقة 2: نسخ يدوي (إذا كان لديك وصول للسيرفر)" -ForegroundColor Yellow
                Write-Host "1. اتصل بالسيرفر بأي طريقة متاحة" -ForegroundColor Gray
                Write-Host "2. نفذ هذا الأمر على السيرفر:" -ForegroundColor Gray
                Write-Host "echo `"$publicKey`" >> ~/.ssh/authorized_keys" -ForegroundColor Green
                Write-Host "chmod 600 ~/.ssh/authorized_keys" -ForegroundColor Green
                Write-Host
                Write-Host "الطريقة 3: استخدام سيرفر آخر كوسيط" -ForegroundColor Yellow
                Write-Host "إذا كان aws-jump يعمل، يمكن استخدامه لنسخ المفتاح" -ForegroundColor Gray
                
            } else {
                Write-Status "ملف المفتاح العام غير موجود: $publicKeyPath" "Error"
            }
        } else {
            Write-Status "ملف المفتاح غير موجود: $keyPath" "Error"
        }
    } else {
        Write-Status "لم يتم العثور على مفتاح في SSH config" "Error"
        Write-Status "استخدم -CreateNewKey أولاً" "Warning"
    }
}

if ($TestConnection) {
    Write-Status "اختبار الاتصال بسيرفر Cursor..." "Header"
    
    try {
        Write-Status "محاولة الاتصال..." "Info"
        $testResult = & ssh -o ConnectTimeout=10 -o BatchMode=yes cursor-dev "echo 'اتصال ناجح بسيرفر Cursor!' && whoami && hostname && uptime" 2>&1
        
        if ($testResult -match "اتصال ناجح") {
            Write-Status "✅ الاتصال يعمل بنجاح!" "Success"
            Write-Status "تفاصيل السيرفر:" "Info"
            $testResult | ForEach-Object {
                if ($_ -ne "اتصال ناجح بسيرفر Cursor!") {
                    Write-Host "    📋 $_" -ForegroundColor Gray
                }
            }
            Write-Host
            Write-Status "🎉 يمكنك الآن استخدام cursor-dev في Cursor IDE!" "Success"
            Write-Status "Remote-SSH: Connect to Host -> cursor-dev" "Info"
            
        } else {
            Write-Status "❌ الاتصال لا يزال يفشل" "Error"
            Write-Status "تفاصيل الخطأ:" "Warning"
            $testResult | ForEach-Object {
                Write-Host "    🔍 $_" -ForegroundColor Yellow
            }
            
            if ($testResult -match "Permission denied") {
                Write-Status "المشكلة: المفتاح العام غير موجود على السيرفر" "Error"
                Write-Status "استخدم -CopyKey لمعرفة كيفية نسخ المفتاح" "Warning"
            }
        }
    } catch {
        Write-Status "خطأ في اختبار الاتصال: $($_.Exception.Message)" "Error"
    }
}

if ($FixConfig) {
    Write-Status "إصلاح SSH config لسيرفر Cursor..." "Header"
    
    # Check if cursor-dev exists in config
    $configContent = Get-Content $SSH_CONFIG -Raw
    if ($configContent -match "Host cursor-dev") {
        Write-Status "إعدادات cursor-dev موجودة في SSH config" "Success"
        
        # Check if IdentityFile is set
        if ($configContent -match "Host cursor-dev[\s\S]*?IdentityFile\s+([^\s#]+)") {
            $keyPath = $matches[1]
            Write-Status "مفتاح SSH محدد: $keyPath" "Info"
            
            # Convert path format
            $keyPathWindows = $keyPath -replace '/', '\'
            if (Test-Path $keyPathWindows) {
                Write-Status "ملف المفتاح موجود ✓" "Success"
            } else {
                Write-Status "ملف المفتاح غير موجود: $keyPathWindows" "Error"
                Write-Status "استخدم -CreateNewKey لإنشاء مفتاح جديد" "Warning"
            }
        } else {
            Write-Status "لا يوجد مفتاح SSH محدد في الإعدادات" "Warning"
            Write-Status "استخدم -CreateNewKey لإنشاء وتعيين مفتاح" "Warning"
        }
    } else {
        Write-Status "إعدادات cursor-dev غير موجودة في SSH config" "Error"
        Write-Status "تشغيل إعداد SSH config..." "Info"
        
        # Run the SSH setup script
        try {
            & ".\setup_cursor_ssh.ps1"
            Write-Status "تم إعداد SSH config" "Success"
        } catch {
            Write-Status "فشل في إعداد SSH config" "Error"
        }
    }
}

# If no specific action, show status and options
if (-not ($CreateNewKey -or $CopyKey -or $TestConnection -or $FixConfig)) {
    Write-Status "فحص الإعدادات الحالية..." "Header"
    
    # Check SSH config
    if (Test-Path $SSH_CONFIG) {
        $configContent = Get-Content $SSH_CONFIG -Raw
        if ($configContent -match "Host cursor-dev") {
            Write-Status "✅ إعدادات cursor-dev موجودة" "Success"
            
            if ($configContent -match "Host cursor-dev[\s\S]*?IdentityFile\s+([^\s#]+)") {
                Write-Status "✅ مفتاح SSH محدد" "Success"
                Write-Status "المفتاح: $($matches[1])" "Info"
            } else {
                Write-Status "⚠️ لا يوجد مفتاح SSH محدد" "Warning"
            }
        } else {
            Write-Status "❌ إعدادات cursor-dev غير موجودة" "Error"
        }
    } else {
        Write-Status "❌ ملف SSH config غير موجود" "Error"
    }
    
    Write-Host
    Write-Status "الخطوات المطلوبة لإعداد سيرفر Cursor:" "Header"
    Write-Host "  1. إصلاح SSH config:" -ForegroundColor Yellow
    Write-Host "     .\setup_cursor_server.ps1 -FixConfig" -ForegroundColor Green
    Write-Host
    Write-Host "  2. إنشاء مفتاح SSH:" -ForegroundColor Yellow
    Write-Host "     .\setup_cursor_server.ps1 -CreateNewKey" -ForegroundColor Green
    Write-Host
    Write-Host "  3. نسخ المفتاح للسيرفر:" -ForegroundColor Yellow
    Write-Host "     .\setup_cursor_server.ps1 -CopyKey" -ForegroundColor Green
    Write-Host
    Write-Host "  4. اختبار الاتصال:" -ForegroundColor Yellow
    Write-Host "     .\setup_cursor_server.ps1 -TestConnection" -ForegroundColor Green
    Write-Host
    Write-Host "  5. استخدام في Cursor IDE:" -ForegroundColor Yellow
    Write-Host "     Remote-SSH: Connect to Host -> cursor-dev" -ForegroundColor Green
}

Write-Host
Write-Status "💡 للمساعدة: .\setup_cursor_server.ps1 -Help" "Info"
