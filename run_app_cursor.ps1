# تشغيل التطبيقات على سيرفر Cursor
# Run Applications on Cursor Server

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

$CURSOR_IP = "100.87.127.117"
$CURSOR_NAME = "cursor"

# تطبيقات محددة مسبقاً
$predefinedApps = @{
    "nextjs" = @{
        command = "cd /var/www/html && npm run dev"
        port = "3000"
        description = "Next.js Development Server"
        background = $true
    }
    "nginx" = @{
        command = "sudo systemctl start nginx"
        port = "80"
        description = "Nginx Web Server"
        background = $false
    }
    "apache" = @{
        command = "sudo systemctl start apache2"
        port = "80"
        description = "Apache Web Server" 
        background = $false
    }
    "node" = @{
        command = "cd /var/www && node server.js"
        port = "8080"
        description = "Node.js Application"
        background = $true
    }
    "python" = @{
        command = "cd /var/www && python3 app.py"
        port = "5000"
        description = "Python Flask/Django App"
        background = $true
    }
    "docker" = @{
        command = "sudo docker-compose up -d"
        port = "8080"
        description = "Docker Compose Services"
        background = $false
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
    Write-Host "🚀 تشغيل التطبيقات على سيرفر Cursor" -ForegroundColor Magenta
    Write-Host "====================================" -ForegroundColor Magenta
    Write-Host
    Write-Host "الاستخدام:" -ForegroundColor Yellow
    Write-Host "  .\run_app_cursor.ps1 -App nextjs           # تشغيل Next.js"
    Write-Host "  .\run_app_cursor.ps1 -App nginx            # تشغيل Nginx"
    Write-Host "  .\run_app_cursor.ps1 -App 'custom command' # أمر مخصص"
    Write-Host "  .\run_app_cursor.ps1 -List                 # عرض التطبيقات المتاحة"
    Write-Host "  .\run_app_cursor.ps1 -Status               # حالة التطبيقات"
    Write-Host "  .\run_app_cursor.ps1 -Stop -App nextjs     # إيقاف تطبيق"
    Write-Host
    Write-Host "خيارات إضافية:" -ForegroundColor Yellow
    Write-Host "  -Username user    # اسم المستخدم (افتراضي: ubuntu)"
    Write-Host "  -KeyFile path     # مسار مفتاح SSH"
    Write-Host "  -Port 3000        # منفذ التطبيق"
    Write-Host "  -Background       # تشغيل في الخلفية"
    Write-Host
    exit 0
}

if ($List) {
    Write-Host "📋 التطبيقات المتاحة على سيرفر Cursor:" -ForegroundColor Magenta
    Write-Host "=======================================" -ForegroundColor Magenta
    Write-Host
    
    foreach ($appName in $predefinedApps.Keys | Sort-Object) {
        $app = $predefinedApps[$appName]
        Write-Host "🔹 $appName" -ForegroundColor Cyan
        Write-Host "   الوصف: $($app.description)" -ForegroundColor Gray
        Write-Host "   المنفذ: $($app.port)" -ForegroundColor Gray
        Write-Host "   الأمر: $($app.command)" -ForegroundColor Gray
        Write-Host
    }
    
    Write-Host "💡 الاستخدام: .\run_app_cursor.ps1 -App [اسم التطبيق]" -ForegroundColor Yellow
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

# Test connection first
Write-Status "اختبار الاتصال بسيرفر Cursor..." "Info"
try {
    $ping = Test-NetConnection -ComputerName $CURSOR_IP -InformationLevel Quiet -WarningAction SilentlyContinue
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
    Write-Status "فحص حالة التطبيقات..." "Header"
    
    $statusCommand = @"
echo '=== حالة الخدمات ===' &&
sudo systemctl status nginx --no-pager -l || echo 'Nginx: غير مثبت' &&
sudo systemctl status apache2 --no-pager -l || echo 'Apache: غير مثبت' &&
echo '=== العمليات النشطة ===' &&
ps aux | grep -E '(node|python|npm)' | grep -v grep || echo 'لا توجد تطبيقات Node/Python نشطة' &&
echo '=== المنافذ المستخدمة ===' &&
sudo netstat -tlnp | grep -E ':(80|443|3000|5000|8080)' || echo 'لا توجد منافذ ويب نشطة'
"@

    $sshArgs += @("$Username@$CURSOR_IP", $statusCommand)
    
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
        $appInfo = $predefinedApps[$App]
        $stopCommand = ""
        
        switch ($App) {
            "nextjs" { $stopCommand = "pkill -f 'npm.*dev' || pkill -f 'next.*dev'" }
            "nginx" { $stopCommand = "sudo systemctl stop nginx" }
            "apache" { $stopCommand = "sudo systemctl stop apache2" }
            "node" { $stopCommand = "pkill -f 'node.*server'" }
            "python" { $stopCommand = "pkill -f 'python.*app'" }
            "docker" { $stopCommand = "sudo docker-compose down" }
        }
        
        $sshArgs += @("$Username@$CURSOR_IP", $stopCommand)
    } else {
        $stopCommand = "pkill -f '$App'"
        $sshArgs += @("$Username@$CURSOR_IP", $stopCommand)
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

Write-Host "🚀 تشغيل التطبيق على سيرفر Cursor" -ForegroundColor Magenta
Write-Host "===================================" -ForegroundColor Magenta
Write-Status "السيرفر: $CURSOR_NAME ($CURSOR_IP)" "Info"
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
    $commandToRun = "nohup $commandToRun > /tmp/app_output.log 2>&1 & echo 'التطبيق يعمل في الخلفية - PID:' && echo `$!"
}

$sshArgs += @("$Username@$CURSOR_IP", $commandToRun)

Write-Status "تشغيل التطبيق..." "Info"
Write-Host

try {
    & ssh @sshArgs
    
    Write-Host
    Write-Status "تم تشغيل التطبيق!" "Success"
    
    if ($appPort) {
        Write-Status "يمكنك الوصول للتطبيق على: http://$CURSOR_IP`:$appPort" "Info"
        
        # Test if port is accessible
        Start-Sleep 3
        $portTest = Test-NetConnection -ComputerName $CURSOR_IP -Port $appPort -InformationLevel Quiet -WarningAction SilentlyContinue
        if ($portTest) {
            Write-Status "✅ التطبيق متاح على المنفذ $appPort" "Success"
            
            # Option to open in browser
            $openBrowser = Read-Host "هل تريد فتح التطبيق في المتصفح؟ (y/N)"
            if ($openBrowser -match "^[Yy]$") {
                Start-Process "http://$CURSOR_IP`:$appPort"
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
Write-Host "  • لفحص حالة التطبيقات: .\run_app_cursor.ps1 -Status" -ForegroundColor Gray
Write-Host "  • لإيقاف التطبيق: .\run_app_cursor.ps1 -Stop -App $App" -ForegroundColor Gray
Write-Host "  • لعرض التطبيقات المتاحة: .\run_app_cursor.ps1 -List" -ForegroundColor Gray
