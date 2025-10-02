# اختصار للاتصال بسيرفر Amazon EC2
# Amazon EC2 Server Connection Shortcut

param(
    [string]$Username = "ubuntu",
    [string]$Command = "",
    [string]$KeyFile = "",
    [switch]$Test,
    [switch]$Web,
    [switch]$Help
)

# Server details
$AWS_IP = "100.97.57.53"
$AWS_NAME = "ec2-jump-server"

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
    Write-Host "🔧 اختصار الاتصال بسيرفر Amazon EC2" -ForegroundColor Magenta
    Write-Host "====================================" -ForegroundColor Magenta
    Write-Host
    Write-Host "الاستخدام:" -ForegroundColor Yellow
    Write-Host "  .\connect_aws.ps1                           # اتصال عادي"
    Write-Host "  .\connect_aws.ps1 -Username ec2-user        # اتصال بمستخدم محدد"
    Write-Host "  .\connect_aws.ps1 -KeyFile path\to\key.pem  # استخدام مفتاح SSH"
    Write-Host "  .\connect_aws.ps1 -Test                     # اختبار الاتصال فقط"
    Write-Host "  .\connect_aws.ps1 -Web                      # فتح خدمة الويب"
    Write-Host "  .\connect_aws.ps1 -Command 'htop'           # تنفيذ أمر محدد"
    Write-Host
    Write-Host "أمثلة:" -ForegroundColor Yellow
    Write-Host "  .\connect_aws.ps1 -Username ec2-user -KeyFile C:\keys\mykey.pem"
    Write-Host "  .\connect_aws.ps1 -Command 'sudo systemctl status nginx'"
    Write-Host "  .\connect_aws.ps1 -Web"
    exit 0
}

Write-Host "☁️ اتصال بسيرفر Amazon EC2" -ForegroundColor Magenta
Write-Host "===========================" -ForegroundColor Magenta
Write-Status "السيرفر: $AWS_NAME ($AWS_IP)" "Info"
Write-Status "المستخدم: $Username" "Info"

# Test connection first
Write-Status "اختبار الاتصال..." "Info"
try {
    $ping = Test-NetConnection -ComputerName $AWS_IP -InformationLevel Quiet -WarningAction SilentlyContinue
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
    $sshTest = Test-NetConnection -ComputerName $AWS_IP -Port 22 -InformationLevel Quiet -WarningAction SilentlyContinue
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

# Test web service
Write-Status "اختبار خدمة الويب..." "Info"
try {
    $webTest = Test-NetConnection -ComputerName $AWS_IP -Port 80 -InformationLevel Quiet -WarningAction SilentlyContinue
    if ($webTest) {
        Write-Status "خدمة الويب متاحة ✓" "Success"
    } else {
        Write-Status "خدمة الويب غير متاحة" "Warning"
    }
} catch {
    Write-Status "خطأ في اختبار الويب" "Warning"
}

if ($Test) {
    Write-Status "اختبار الاتصال مكتمل بنجاح!" "Success"
    exit 0
}

if ($Web) {
    Write-Status "فتح خدمة الويب..." "Info"
    try {
        Start-Process "http://$AWS_IP"
        Write-Status "تم فتح الموقع في المتصفح" "Success"
    } catch {
        Write-Status "فشل في فتح المتصفح" "Error"
        Write-Status "يمكنك زيارة: http://$AWS_IP" "Info"
    }
    exit 0
}

# Build SSH command
$sshArgs = @(
    "-o", "StrictHostKeyChecking=no",
    "-o", "UserKnownHostsFile=/dev/null", 
    "-o", "ConnectTimeout=10"
)

# Add key file if specified
if ($KeyFile) {
    if (Test-Path $KeyFile) {
        $sshArgs += @("-i", $KeyFile)
        Write-Status "استخدام مفتاح SSH: $KeyFile" "Info"
    } else {
        Write-Status "ملف المفتاح غير موجود: $KeyFile" "Error"
        exit 1
    }
}

if ($Command) {
    $sshArgs += @("$Username@$AWS_IP", $Command)
    Write-Status "تنفيذ الأمر: $Command" "Info"
} else {
    $sshArgs += @("$Username@$AWS_IP")
    Write-Status "بدء جلسة SSH تفاعلية..." "Info"
}

Write-Status "الاتصال بـ $Username@$AWS_IP..." "Info"
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
    Write-Host "  • صحة مسار ملف المفتاح (إن وُجد)"
    exit 1
}

Write-Host
Write-Status "انتهت جلسة SSH" "Info"
