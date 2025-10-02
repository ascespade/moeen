# اختصار للاتصال بسيرفر Cursor
# Cursor Server Connection Shortcut

param(
    [string]$Username = "ubuntu",
    [string]$Command = "",
    [switch]$Test,
    [switch]$Help
)

# Server details
$CURSOR_IP = "100.87.127.117"
$CURSOR_NAME = "cursor"

# Colors for output
function Write-Status {
    param([string]$Message, [string]$Type = "Info")
    
    $colors = @{
        "Success" = "Green"
        "Error" = "Red" 
        "Warning" = "Yellow"
        "Info" = "Cyan"
    }
    
    $icons = @{
        "Success" = "✅"
        "Error" = "❌"
        "Warning" = "⚠️"
        "Info" = "ℹ️"
    }
    
    Write-Host "$($icons[$Type]) $Message" -ForegroundColor $colors[$Type]
}

if ($Help) {
    Write-Host "🔧 اختصار الاتصال بسيرفر Cursor" -ForegroundColor Magenta
    Write-Host "=================================" -ForegroundColor Magenta
    Write-Host
    Write-Host "الاستخدام:" -ForegroundColor Yellow
    Write-Host "  .\connect_cursor.ps1                    # اتصال عادي"
    Write-Host "  .\connect_cursor.ps1 -Username myuser   # اتصال بمستخدم محدد"
    Write-Host "  .\connect_cursor.ps1 -Test              # اختبار الاتصال فقط"
    Write-Host "  .\connect_cursor.ps1 -Command 'ls -la'  # تنفيذ أمر محدد"
    Write-Host
    Write-Host "أمثلة:" -ForegroundColor Yellow
    Write-Host "  .\connect_cursor.ps1 -Username root"
    Write-Host "  .\connect_cursor.ps1 -Command 'htop'"
    Write-Host "  .\connect_cursor.ps1 -Command 'cd /var/www && ls'"
    exit 0
}

Write-Host "🌐 اتصال بسيرفر Cursor" -ForegroundColor Magenta
Write-Host "======================" -ForegroundColor Magenta
Write-Status "السيرفر: $CURSOR_NAME ($CURSOR_IP)" "Info"
Write-Status "المستخدم: $Username" "Info"

# Test connection first
Write-Status "اختبار الاتصال..." "Info"
try {
    $ping = Test-NetConnection -ComputerName $CURSOR_IP -InformationLevel Quiet -WarningAction SilentlyContinue
    if ($ping) {
        Write-Status "الاتصال متاح ✓" "Success"
    } else {
        Write-Status "فشل في الاتصال" "Error"
        exit 1
    }
} catch {
    Write-Status "خطأ في اختبار الاتصال: $($_.Exception.Message)" "Error"
    exit 1
}

# Test SSH port
Write-Status "اختبار منفذ SSH..." "Info"
try {
    $sshTest = Test-NetConnection -ComputerName $CURSOR_IP -Port 22 -InformationLevel Quiet -WarningAction SilentlyContinue
    if ($sshTest) {
        Write-Status "منفذ SSH متاح ✓" "Success"
    } else {
        Write-Status "منفذ SSH غير متاح" "Error"
        exit 1
    }
} catch {
    Write-Status "خطأ في اختبار SSH: $($_.Exception.Message)" "Error"
    exit 1
}

if ($Test) {
    Write-Status "اختبار الاتصال مكتمل بنجاح!" "Success"
    exit 0
}

# Build SSH command
$sshArgs = @(
    "-o", "StrictHostKeyChecking=no",
    "-o", "UserKnownHostsFile=/dev/null",
    "-o", "ConnectTimeout=10"
)

if ($Command) {
    $sshArgs += @("$Username@$CURSOR_IP", $Command)
    Write-Status "تنفيذ الأمر: $Command" "Info"
} else {
    $sshArgs += @("$Username@$CURSOR_IP")
    Write-Status "بدء جلسة SSH تفاعلية..." "Info"
}

Write-Status "الاتصال بـ $Username@$CURSOR_IP..." "Info"
Write-Host

try {
    & ssh @sshArgs
} catch {
    Write-Status "فشل في الاتصال SSH: $($_.Exception.Message)" "Error"
    Write-Host
    Write-Status "تأكد من:" "Warning"
    Write-Host "  • تثبيت SSH client"
    Write-Host "  • صحة اسم المستخدم"
    Write-Host "  • توفر مفاتيح SSH أو كلمة المرور"
    exit 1
}

Write-Host
Write-Status "انتهت جلسة SSH" "Info"
