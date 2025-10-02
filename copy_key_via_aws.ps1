# نسخ مفتاح SSH لسيرفر Cursor عبر سيرفر AWS
# Copy SSH key to Cursor server via AWS server

param(
    [switch]$Help
)

$CURSOR_IP = "100.87.127.117"
$AWS_IP = "100.97.57.53"
$PUBLIC_KEY = "ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAILH0MLddHL8gYwN4JelCjPqCaTSLPLroaVUbAhhrCngi cursor-server-20251002"

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
    Write-Host "🔧 نسخ مفتاح SSH لسيرفر Cursor عبر AWS" -ForegroundColor Magenta
    Write-Host "====================================" -ForegroundColor Magenta
    Write-Host
    Write-Host "الهدف: استخدام aws-jump لنسخ المفتاح لسيرفر cursor" -ForegroundColor Yellow
    Write-Host
    Write-Host "المتطلبات:" -ForegroundColor Yellow
    Write-Host "  • aws-jump يعمل بشكل صحيح" -ForegroundColor Gray
    Write-Host "  • إمكانية الوصول من aws-jump إلى cursor" -ForegroundColor Gray
    Write-Host "  • نفس المستخدم (ubuntu) على كلا السيرفرين" -ForegroundColor Gray
    Write-Host
    exit 0
}

Write-Host "🔧 نسخ مفتاح SSH لسيرفر Cursor عبر AWS" -ForegroundColor Magenta
Write-Host "====================================" -ForegroundColor Magenta
Write-Host

Write-Status "فحص الاتصال بسيرفر AWS..." "Header"
$awsTest = Test-NetConnection -ComputerName $AWS_IP -Port 22 -InformationLevel Quiet -WarningAction SilentlyContinue
if (-not $awsTest) {
    Write-Status "فشل في الاتصال بسيرفر AWS" "Error"
    exit 1
}
Write-Status "سيرفر AWS متاح ✓" "Success"

Write-Status "فحص الاتصال بسيرفر Cursor..." "Header"
$cursorTest = Test-NetConnection -ComputerName $CURSOR_IP -Port 22 -InformationLevel Quiet -WarningAction SilentlyContinue
if (-not $cursorTest) {
    Write-Status "فشل في الاتصال بسيرفر Cursor" "Error"
    exit 1
}
Write-Status "سيرفر Cursor متاح ✓" "Success"

Write-Host
Write-Status "الطريقة 1: نسخ المفتاح عبر AWS (إذا كان aws-jump يعمل)" "Header"
Write-Host

$copyCommand = @"
# إنشاء المفتاح مؤقتاً على aws-jump
echo '$PUBLIC_KEY' > /tmp/cursor_key.pub

# محاولة نسخ المفتاح لسيرفر cursor
if ssh -o ConnectTimeout=10 -o StrictHostKeyChecking=no ubuntu@$CURSOR_IP 'mkdir -p ~/.ssh && chmod 700 ~/.ssh'; then
    echo 'تم إنشاء مجلد SSH على سيرفر cursor'
    
    # نسخ المفتاح
    if cat /tmp/cursor_key.pub | ssh -o ConnectTimeout=10 -o StrictHostKeyChecking=no ubuntu@$CURSOR_IP 'cat >> ~/.ssh/authorized_keys && chmod 600 ~/.ssh/authorized_keys'; then
        echo 'تم نسخ المفتاح بنجاح!'
        echo 'اختبار الاتصال...'
        ssh -o ConnectTimeout=5 ubuntu@$CURSOR_IP 'echo "الاتصال يعمل!" && hostname'
    else
        echo 'فشل في نسخ المفتاح'
    fi
else
    echo 'فشل في الوصول لسيرفر cursor من aws-jump'
    echo 'تحقق من:'
    echo '1. إمكانية الوصول من aws-jump إلى cursor'
    echo '2. صحة عنوان IP'
    echo '3. إعدادات الشبكة'
fi

# تنظيف الملف المؤقت
rm -f /tmp/cursor_key.pub
"@

Write-Status "تشغيل عملية النسخ عبر AWS..." "Info"
Write-Host

try {
    $result = & ssh aws-jump $copyCommand 2>&1
    
    if ($result -match "تم نسخ المفتاح بنجاح") {
        Write-Status "✅ تم نسخ المفتاح بنجاح!" "Success"
        
        if ($result -match "الاتصال يعمل") {
            Write-Status "✅ اختبار الاتصال نجح!" "Success"
            Write-Host
            Write-Status "🎉 يمكنك الآن استخدام cursor-dev في Cursor IDE!" "Success"
            Write-Status "Remote-SSH: Connect to Host -> cursor-dev" "Info"
        }
    } else {
        Write-Status "❌ فشل في نسخ المفتاح" "Error"
        Write-Status "تفاصيل العملية:" "Warning"
        $result | ForEach-Object {
            Write-Host "    🔍 $_" -ForegroundColor Yellow
        }
    }
} catch {
    Write-Status "خطأ في تنفيذ العملية: $($_.Exception.Message)" "Error"
}

Write-Host
Write-Status "الطريقة 2: النسخ اليدوي (إذا فشلت الطريقة الأولى)" "Header"
Write-Host
Write-Host "1. اتصل بسيرفر cursor بأي طريقة متاحة" -ForegroundColor Yellow
Write-Host "2. نفذ هذه الأوامر على السيرفر:" -ForegroundColor Yellow
Write-Host
Write-Host "mkdir -p ~/.ssh" -ForegroundColor Green
Write-Host "chmod 700 ~/.ssh" -ForegroundColor Green
Write-Host "echo '$PUBLIC_KEY' >> ~/.ssh/authorized_keys" -ForegroundColor Green
Write-Host "chmod 600 ~/.ssh/authorized_keys" -ForegroundColor Green
Write-Host
Write-Host "3. اختبر الاتصال:" -ForegroundColor Yellow
Write-Host ".\setup_cursor_server.ps1 -TestConnection" -ForegroundColor Green

Write-Host
Write-Status "💡 نصائح إضافية:" "Info"
Write-Host "  • تأكد من أن مجلد .ssh موجود على السيرفر" -ForegroundColor Gray
Write-Host "  • تحقق من صلاحيات الملفات (700 للمجلد، 600 للملفات)" -ForegroundColor Gray
Write-Host "  • استخدم ssh -v للتشخيص المفصل" -ForegroundColor Gray
