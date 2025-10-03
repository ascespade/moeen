# تشغيل التطبيقات على سيرفر Amazon EC2
# Run Applications on Amazon EC2 Server

param(
    [string]$App = "",
    [string]$Username = "ubuntu", 
    [string]$KeyFile = "",
    [string]$Port = "",
    [switch]$Background,
    [switch]$List,
    [switch]$Stop,
    [switch]$Status,
    [switch]$Help
)

$AWS_IP = "100.97.57.53"
$AWS_NAME = "ec2-jump-server"

# تطبيقات محددة مسبقاً لسيرفر AWS
$predefinedApps = @{
    "nginx" = @{
        command = "sudo systemctl start nginx && sudo systemctl enable nginx"
        port = "80"
        description = "Nginx Web Server"
        background = $false
    }
    "apache" = @{
        command = "sudo systemctl start apache2 && sudo systemctl enable apache2"
        port = "80"
        description = "Apache Web Server"
        background = $false
    }
    "nodejs" = @{
        command = "cd /var/www && node server.js"
        port = "8080"
        description = "Node.js Application"
        background = $true
    }
    "python" = @{
        command = "cd /var/www && python3 -m http.server 8080"
        port = "8080"
        description = "Python HTTP Server"
        background = $true
    }
    "docker" = @{
        command = "sudo docker-compose up -d"
        port = "8080"
        description = "Docker Services"
        background = $false
    }
    "proxy" = @{
        command = "sudo systemctl start squid && sudo systemctl enable squid"
        port = "3128"
        description = "Squid Proxy Server"
        background = $false
    }
    "ssh-tunnel" = @{
        command = "ssh -D 1080 -N localhost"
        port = "1080"
        description = "SSH SOCKS Tunnel"
        background = $true
    }
}

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
    Write-Host "☁️ تشغيل التطبيقات على سيرفر Amazon EC2" -ForegroundColor Magenta
    Write-Host "=======================================" -ForegroundColor Magenta
    Write-Host
    Write-Host "الاستخدام:" -ForegroundColor Yellow
    Write-Host "  .\run_app_aws.ps1 -App nginx              # تشغيل Nginx"
    Write-Host "  .\run_app_aws.ps1 -App nodejs             # تشغيل Node.js"
    Write-Host "  .\run_app_aws.ps1 -App 'custom command'   # أمر مخصص"
    Write-Host "  .\run_app_aws.ps1 -List                   # عرض التطبيقات"
    Write-Host "  .\run_app_aws.ps1 -Status                 # حالة التطبيقات"
    Write-Host "  .\run_app_aws.ps1 -Stop -App nginx        # إيقاف تطبيق"
    Write-Host
    Write-Host "خيارات إضافية:" -ForegroundColor Yellow
    Write-Host "  -Username user    # اسم المستخدم"
    Write-Host "  -KeyFile path     # مسار مفتاح SSH"
    Write-Host "  -Port 8080        # منفذ التطبيق"
    Write-Host "  -Background       # تشغيل في الخلفية"
    Write-Host
    exit 0
}

if ($List) {
    Write-Host "📋 التطبيقات المتاحة على سيرفر Amazon EC2:" -ForegroundColor Magenta
    Write-Host "==========================================" -ForegroundColor Magenta
    Write-Host
    
    foreach ($appName in $predefinedApps.Keys | Sort-Object) {
        $app = $predefinedApps[$appName]
        Write-Host "🔹 $appName" -ForegroundColor Cyan
        Write-Host "   الوصف: $($app.description)" -ForegroundColor Gray
        Write-Host "   المنفذ: $($app.port)" -ForegroundColor Gray
        Write-Host "   الأمر: $($app.command)" -ForegroundColor Gray
        Write-Host
    }
    
    Write-Host "💡 الاستخدام: .\run_app_aws.ps1 -App [اسم التطبيق]" -ForegroundColor Yellow
    exit 0
}

# Build SSH arguments
$sshArgs = @(
    "-o", "StrictHostKeyChecking=no",
    "-o", "UserKnownHostsFile=/dev/null",
    "-o", "ConnectTimeout=10"
)

if ($KeyFile -and (Test-Path $KeyFile)) {
    $sshArgs += @("-i", $KeyFile)
    Write-Status "استخدام مفتاح SSH: $KeyFile" "Info"
}

# Test connection
Write-Status "اختبار الاتصال بسيرفر Amazon EC2..." "Info"
try {
    $ping = Test-NetConnection -ComputerName $AWS_IP -InformationLevel Quiet -WarningAction SilentlyContinue
    if (-not $ping) {
        Write-Status "فشل في الاتصال بالسيرفر" "Error"
        exit 1
    }
    Write-Status "الاتصال متاح ✓" "Success"
} catch {
    Write-Status "خطأ في اختبار الاتصال" "Error"
    exit 1
}

if ($Status) {
    Write-Status "فحص حالة التطبيقات على سيرفر Amazon..." "Header"
    
    $statusCommand = @"
echo '=== معلومات السيرفر ===' &&
hostname && uptime && 
echo '=== حالة الخدمات ===' &&
sudo systemctl status nginx --no-pager -l 2>/dev/null || echo 'Nginx: غير مثبت/متوقف' &&
sudo systemctl status apache2 --no-pager -l 2>/dev/null || echo 'Apache: غير مثبت/متوقف' &&
sudo systemctl status squid --no-pager -l 2>/dev/null || echo 'Squid: غير مثبت/متوقف' &&
echo '=== العمليات النشطة ===' &&
ps aux | grep -E '(nginx|apache|node|python|squid)' | grep -v grep || echo 'لا توجد خدمات ويب نشطة' &&
echo '=== المنافذ المستخدمة ===' &&
sudo netstat -tlnp | grep -E ':(80|443|8080|3128|1080)' || echo 'لا توجد منافذ نشطة' &&
echo '=== مساحة القرص ===' &&
df -h | head -2
"@

    $sshArgs += @("$Username@$AWS_IP", $statusCommand)
    
    try {
        Write-Status "جاري فحص الحالة..." "Info"
        & ssh @sshArgs
    } catch {
        Write-Status "فشل في فحص الحالة" "Error"
    }
    exit 0
}

if ($Stop) {
    if (-not $App) {
        Write-Status "يجب تحديد التطبيق المراد إيقافه" "Error"
        exit 1
    }
    
    Write-Status "إيقاف التطبيق: $App" "Warning"
    
    if ($predefinedApps.ContainsKey($App)) {
        $stopCommand = ""
        
        switch ($App) {
            "nginx" { $stopCommand = "sudo systemctl stop nginx" }
            "apache" { $stopCommand = "sudo systemctl stop apache2" }
            "nodejs" { $stopCommand = "pkill -f 'node.*server'" }
            "python" { $stopCommand = "pkill -f 'python.*http.server'" }
            "docker" { $stopCommand = "sudo docker-compose down" }
            "proxy" { $stopCommand = "sudo systemctl stop squid" }
            "ssh-tunnel" { $stopCommand = "pkill -f 'ssh.*-D'" }
        }
        
        $sshArgs += @("$Username@$AWS_IP", $stopCommand)
    } else {
        $stopCommand = "sudo pkill -f '$App'"
        $sshArgs += @("$Username@$AWS_IP", $stopCommand)
    }
    
    try {
        & ssh @sshArgs
        Write-Status "تم إيقاف التطبيق" "Success"
    } catch {
        Write-Status "فشل في إيقاف التطبيق" "Error"
    }
    exit 0
}

if (-not $App) {
    Write-Status "يجب تحديد التطبيق المراد تشغيله" "Error"
    Write-Status "استخدم -List لعرض التطبيقات المتاحة" "Info"
    exit 1
}

Write-Host "☁️ تشغيل التطبيق على سيرفر Amazon EC2" -ForegroundColor Magenta
Write-Host "=====================================" -ForegroundColor Magenta
Write-Status "السيرفر: $AWS_NAME ($AWS_IP)" "Info"
Write-Status "المستخدم: $Username" "Info"
Write-Status "التطبيق: $App" "Info"

# Determine command to run
$commandToRun = ""
$appPort = $Port

if ($predefinedApps.ContainsKey($App)) {
    $appInfo = $predefinedApps[$App]
    $commandToRun = $appInfo.command
    if (-not $appPort) { $appPort = $appInfo.port }
    $shouldRunInBackground = $appInfo.background -or $Background
    
    Write-Status "الوصف: $($appInfo.description)" "Info"
    Write-Status "المنفذ: $appPort" "Info"
} else {
    $commandToRun = $App
    $shouldRunInBackground = $Background
    Write-Status "أمر مخصص: $commandToRun" "Info"
}

# Prepare the command
if ($shouldRunInBackground) {
    $commandToRun = "nohup $commandToRun > /tmp/aws_app_output.log 2>&1 & echo 'التطبيق يعمل في الخلفية - PID:' && echo `$!"
}

$sshArgs += @("$Username@$AWS_IP", $commandToRun)

Write-Status "تشغيل التطبيق..." "Info"
Write-Host

try {
    & ssh @sshArgs
    
    Write-Host
    Write-Status "تم تشغيل التطبيق!" "Success"
    
    if ($appPort) {
        Write-Status "يمكنك الوصول للتطبيق على: http://$AWS_IP`:$appPort" "Info"
        
        # Test if port is accessible
        Start-Sleep 5
        $portTest = Test-NetConnection -ComputerName $AWS_IP -Port $appPort -InformationLevel Quiet -WarningAction SilentlyContinue
        if ($portTest) {
            Write-Status "✅ التطبيق متاح على المنفذ $appPort" "Success"
            
            # Option to open in browser
            $openBrowser = Read-Host "هل تريد فتح التطبيق في المتصفح؟ (y/N)"
            if ($openBrowser -match "^[Yy]$") {
                Start-Process "http://$AWS_IP`:$appPort"
            }
        } else {
            Write-Status "⚠️ المنفذ $appPort غير متاح بعد - قد يحتاج وقت للبدء" "Warning"
        }
    }
    
} catch {
    Write-Status "فشل في تشغيل التطبيق: $($_.Exception.Message)" "Error"
    exit 1
}

Write-Host
Write-Status "💡 نصائح مفيدة:" "Info"
Write-Host "  • لفحص حالة التطبيقات: .\run_app_aws.ps1 -Status" -ForegroundColor Gray
Write-Host "  • لإيقاف التطبيق: .\run_app_aws.ps1 -Stop -App $App" -ForegroundColor Gray
Write-Host "  • لعرض التطبيقات المتاحة: .\run_app_aws.ps1 -List" -ForegroundColor Gray
