# 🚀 Cursor Dev Platform - Quick Setup Script
# إعداد سريع وشامل للمنصة المتكاملة

param(
    [Parameter(Mandatory=$true)]
    [string]$ServerIP,
    
    [Parameter(Mandatory=$false)]
    [string]$Domain = "cursor-dev.local",
    
    [Parameter(Mandatory=$false)]
    [string]$SSHUser = "root",
    
    [Parameter(Mandatory=$false)]
    [string]$Email = "admin@cursor-dev.local",
    
    [Parameter(Mandatory=$false)]
    [switch]$SkipOptimization = $false,
    
    [Parameter(Mandatory=$false)]
    [switch]$EnableMonitoring = $true,
    
    [Parameter(Mandatory=$false)]
    [switch]$CreateBackup = $true
)

# Configuration
$PlatformPath = "D:\Cursor-Dev-Platform"
$LogFile = "$PlatformPath\monitoring\setup.log"

# Colors
$Colors = @{
    Red = "Red"
    Green = "Green"
    Yellow = "Yellow"
    Blue = "Blue"
    Purple = "Magenta"
    Cyan = "Cyan"
}

function Write-ColorOutput {
    param([string]$Message, [string]$Color = "White")
    Write-Host $Message -ForegroundColor $Colors[$Color]
}

function Write-Log {
    param([string]$Message, [string]$Level = "INFO")
    $Timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    $LogEntry = "[$Timestamp] [$Level] $Message"
    Add-Content -Path $LogFile -Value $LogEntry
    
    $ColorMap = @{
        "INFO" = "Green"
        "WARN" = "Yellow"
        "ERROR" = "Red"
        "DEBUG" = "Cyan"
    }
    
    Write-ColorOutput $LogEntry $ColorMap[$Level]
}

function Test-Prerequisites {
    Write-ColorOutput "🔍 فحص المتطلبات الأساسية..." "Yellow"
    
    $prerequisites = @()
    
    # Check SSH
    if (!(Get-Command ssh -ErrorAction SilentlyContinue)) {
        $prerequisites += "OpenSSH Client غير مثبت"
    }
    
    # Check SCP
    if (!(Get-Command scp -ErrorAction SilentlyContinue)) {
        $prerequisites += "SCP غير متوفر"
    }
    
    # Check PowerShell version
    if ($PSVersionTable.PSVersion.Major -lt 5) {
        $prerequisites += "PowerShell 5.0 أو أحدث مطلوب"
    }
    
    # Check internet connection
    try {
        $null = Test-NetConnection -ComputerName "8.8.8.8" -Port 53 -InformationLevel Quiet
    }
    catch {
        $prerequisites += "لا يوجد اتصال بالإنترنت"
    }
    
    if ($prerequisites.Count -gt 0) {
        Write-ColorOutput "❌ المتطلبات المفقودة:" "Red"
        foreach ($req in $prerequisites) {
            Write-ColorOutput "  - $req" "Red"
        }
        return $false
    }
    
    Write-ColorOutput "✅ جميع المتطلبات متوفرة" "Green"
    return $true
}

function Test-ServerConnection {
    param([string]$Server, [string]$User)
    
    Write-ColorOutput "🔗 اختبار الاتصال بالسيرفر..." "Yellow"
    
    try {
        $result = ssh -o ConnectTimeout=10 -o BatchMode=yes "$User@$Server" "echo 'connected'" 2>$null
        if ($result -eq "connected") {
            Write-ColorOutput "✅ تم الاتصال بالسيرفر بنجاح" "Green"
            return $true
        }
    }
    catch {
        Write-Log "فشل في الاتصال بالسيرفر: $($_.Exception.Message)" "ERROR"
    }
    
    Write-ColorOutput "❌ لا يمكن الاتصال بالسيرفر" "Red"
    Write-ColorOutput "تأكد من:" "Yellow"
    Write-ColorOutput "  - عنوان IP صحيح: $Server" "Blue"
    Write-ColorOutput "  - SSH مفعل على السيرفر" "Blue"
    Write-ColorOutput "  - مفاتيح SSH مُعدة بشكل صحيح" "Blue"
    Write-ColorOutput "  - المستخدم $User له صلاحيات sudo" "Blue"
    
    return $false
}

function Upload-Scripts {
    param([string]$Server, [string]$User)
    
    Write-ColorOutput "📤 رفع ملفات الإعداد..." "Yellow"
    
    $scripts = @(
        "$PlatformPath\scripts\install-code-server.sh",
        "$PlatformPath\scripts\performance-optimizer.sh",
        "$PlatformPath\configs\platform-config.json"
    )
    
    foreach ($script in $scripts) {
        if (Test-Path $script) {
            Write-ColorOutput "  📁 رفع $(Split-Path $script -Leaf)..." "Blue"
            scp $script "$User@${Server}:/tmp/"
            
            if ($LASTEXITCODE -ne 0) {
                Write-Log "فشل في رفع $script" "ERROR"
                return $false
            }
        }
        else {
            Write-Log "الملف غير موجود: $script" "ERROR"
            return $false
        }
    }
    
    Write-ColorOutput "✅ تم رفع جميع الملفات" "Green"
    return $true
}

function Install-Platform {
    param([string]$Server, [string]$User, [string]$Domain, [string]$Email)
    
    Write-ColorOutput "🚀 بدء تثبيت المنصة..." "Purple"
    
    # Make scripts executable
    ssh "$User@$Server" "chmod +x /tmp/install-code-server.sh /tmp/performance-optimizer.sh"
    
    # Run installation
    Write-ColorOutput "⚡ تشغيل سكريبت التثبيت..." "Yellow"
    ssh "$User@$Server" "/tmp/install-code-server.sh $Domain $Email"
    
    if ($LASTEXITCODE -ne 0) {
        Write-Log "فشل في تثبيت المنصة" "ERROR"
        return $false
    }
    
    Write-ColorOutput "✅ تم تثبيت المنصة بنجاح" "Green"
    return $true
}

function Apply-Optimizations {
    param([string]$Server, [string]$User)
    
    if ($SkipOptimization) {
        Write-ColorOutput "⏭️ تم تخطي التحسينات" "Yellow"
        return $true
    }
    
    Write-ColorOutput "⚡ تطبيق تحسينات الأداء..." "Purple"
    
    ssh "$User@$Server" "/tmp/performance-optimizer.sh all"
    
    if ($LASTEXITCODE -eq 0) {
        Write-ColorOutput "✅ تم تطبيق التحسينات بنجاح" "Green"
        return $true
    }
    else {
        Write-Log "فشل في تطبيق التحسينات" "WARN"
        return $false
    }
}

function Setup-Monitoring {
    param([string]$Server, [string]$User)
    
    if (!$EnableMonitoring) {
        Write-ColorOutput "⏭️ تم تخطي إعداد المراقبة" "Yellow"
        return $true
    }
    
    Write-ColorOutput "📊 إعداد نظام المراقبة..." "Yellow"
    
    # Upload monitoring dashboard
    scp "$PlatformPath\monitoring\dashboard.html" "$User@${Server}:/tmp/"
    
    # Setup monitoring on server
    ssh "$User@$Server" @"
        mkdir -p /var/www/html/monitoring
        cp /tmp/dashboard.html /var/www/html/monitoring/index.html
        chown -R www-data:www-data /var/www/html/monitoring
        
        # Create monitoring API endpoint
        mkdir -p /var/www/html/api
        cat > /var/www/html/api/status.php << 'EOF'
<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

\$status = [
    'timestamp' => date('c'),
    'system' => [
        'cpu' => sys_getloadavg()[0] * 100,
        'memory' => [
            'used' => memory_get_usage(true),
            'total' => memory_get_peak_usage(true)
        ],
        'disk' => disk_free_space('/'),
        'uptime' => file_get_contents('/proc/uptime')
    ],
    'services' => [
        'code-server' => shell_exec('systemctl is-active code-server') === "active\n",
        'nginx' => shell_exec('systemctl is-active nginx') === "active\n",
        'postgresql' => shell_exec('systemctl is-active postgresql') === "active\n"
    ]
];

echo json_encode(\$status, JSON_PRETTY_PRINT);
?>
EOF
        
        # Install PHP if needed
        apt update && apt install -y php-fpm php-cli
        
        # Configure Nginx for monitoring
        cat > /etc/nginx/sites-available/monitoring << 'EOF'
server {
    listen 3000;
    server_name _;
    root /var/www/html;
    index index.html index.php;
    
    location / {
        try_files \$uri \$uri/ =404;
    }
    
    location ~ \.php$ {
        include snippets/fastcgi-php.conf;
        fastcgi_pass unix:/var/run/php/php-fpm.sock;
    }
    
    location /api/ {
        try_files \$uri \$uri/ =404;
    }
}
EOF
        
        ln -sf /etc/nginx/sites-available/monitoring /etc/nginx/sites-enabled/
        systemctl reload nginx
"@
    
    if ($LASTEXITCODE -eq 0) {
        Write-ColorOutput "✅ تم إعداد نظام المراقبة" "Green"
        Write-ColorOutput "🌐 لوحة المراقبة: http://$Server:3000/monitoring/" "Cyan"
        return $true
    }
    else {
        Write-Log "فشل في إعداد المراقبة" "WARN"
        return $false
    }
}

function Create-InitialBackup {
    param([string]$Server, [string]$User)
    
    if (!$CreateBackup) {
        Write-ColorOutput "⏭️ تم تخطي النسخة الاحتياطية الأولية" "Yellow"
        return $true
    }
    
    Write-ColorOutput "💾 إنشاء نسخة احتياطية أولية..." "Yellow"
    
    ssh "$User@$Server" "/usr/local/bin/cursor-smart-backup"
    
    if ($LASTEXITCODE -eq 0) {
        Write-ColorOutput "✅ تم إنشاء النسخة الاحتياطية" "Green"
        return $true
    }
    else {
        Write-Log "فشل في إنشاء النسخة الاحتياطية" "WARN"
        return $false
    }
}

function Get-ServerCredentials {
    param([string]$Server, [string]$User)
    
    Write-ColorOutput "🔐 جلب بيانات الدخول..." "Yellow"
    
    $credentials = ssh "$User@$Server" "cat /home/codeserver/.cursor-credentials 2>/dev/null"
    
    if ($credentials) {
        Write-ColorOutput "💾 بيانات الدخول للمنصة:" "Green"
        Write-ColorOutput "=========================" "Cyan"
        foreach ($line in $credentials -split "`n") {
            if ($line.Trim()) {
                Write-ColorOutput $line "Cyan"
            }
        }
        Write-ColorOutput "=========================" "Cyan"
        
        # Save to local config
        $config = @{
            ServerIP = $Server
            Domain = $Domain
            SSHUser = $User
            Email = $Email
            Credentials = $credentials
            SetupDate = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
            Status = "Active"
        }
        
        $config | ConvertTo-Json -Depth 10 | Set-Content "$PlatformPath\configs\server-config.json"
        Write-ColorOutput "💾 تم حفظ التكوين في: $PlatformPath\configs\server-config.json" "Green"
        
        return $true
    }
    else {
        Write-Log "لم يتم العثور على بيانات الدخول" "WARN"
        return $false
    }
}

function Show-CompletionSummary {
    param([string]$Server, [string]$Domain)
    
    Write-ColorOutput "" "White"
    Write-ColorOutput "🎉 تم إعداد Cursor Dev Platform بنجاح!" "Green"
    Write-ColorOutput "========================================" "Cyan"
    Write-ColorOutput "" "White"
    Write-ColorOutput "📋 معلومات المنصة:" "Yellow"
    Write-ColorOutput "  🌐 الرابط الرئيسي: https://$Domain" "Blue"
    Write-ColorOutput "  🌐 رابط بديل: http://$Server:8080" "Blue"
    Write-ColorOutput "  📊 لوحة المراقبة: http://$Server:3000/monitoring/" "Blue"
    Write-ColorOutput "  📁 مجلد العمل: /home/codeserver/workspace" "Blue"
    Write-ColorOutput "" "White"
    Write-ColorOutput "🔧 أوامر مفيدة:" "Yellow"
    Write-ColorOutput "  .\cursor-dev-manager.ps1 -Action status -ServerIP $Server" "Green"
    Write-ColorOutput "  .\cursor-dev-manager.ps1 -Action monitor -ServerIP $Server" "Green"
    Write-ColorOutput "  .\cursor-dev-manager.ps1 -Action backup -ServerIP $Server" "Green"
    Write-ColorOutput "  .\cursor-dev-manager.ps1 -Action connect -ServerIP $Server" "Green"
    Write-ColorOutput "" "White"
    Write-ColorOutput "📚 الملفات المهمة:" "Yellow"
    Write-ColorOutput "  📄 التكوين: $PlatformPath\configs\server-config.json" "Blue"
    Write-ColorOutput "  📊 السجلات: $PlatformPath\monitoring\setup.log" "Blue"
    Write-ColorOutput "  🎛️ لوحة التحكم: $PlatformPath\monitoring\dashboard.html" "Blue"
    Write-ColorOutput "" "White"
    Write-ColorOutput "🚀 الخطوات التالية:" "Yellow"
    Write-ColorOutput "  1. افتح الرابط في المتصفح" "Green"
    Write-ColorOutput "  2. ادخل كلمة المرور المعروضة أعلاه" "Green"
    Write-ColorOutput "  3. ابدأ التطوير!" "Green"
    Write-ColorOutput "" "White"
    Write-ColorOutput "💡 نصائح:" "Yellow"
    Write-ColorOutput "  - Cursor Agent سيستمر في العمل معك" "Blue"
    Write-ColorOutput "  - جميع المعالجة تتم على السيرفر" "Blue"
    Write-ColorOutput "  - النسخ الاحتياطي تلقائي يومياً" "Blue"
    Write-ColorOutput "  - المراقبة المستمرة للأداء" "Blue"
    Write-ColorOutput "" "White"
}

function Main {
    # Initialize
    Write-ColorOutput "🚀 Cursor Dev Platform - Quick Setup" "Purple"
    Write-ColorOutput "====================================" "Cyan"
    Write-ColorOutput "Server: $ServerIP" "Blue"
    Write-ColorOutput "Domain: $Domain" "Blue"
    Write-ColorOutput "User: $SSHUser" "Blue"
    Write-ColorOutput "" "White"
    
    # Create log directory
    if (!(Test-Path "$PlatformPath\monitoring")) {
        New-Item -ItemType Directory -Path "$PlatformPath\monitoring" -Force | Out-Null
    }
    
    Write-Log "بدء إعداد Cursor Dev Platform" "INFO"
    
    # Step 1: Check prerequisites
    if (!(Test-Prerequisites)) {
        Write-Log "فشل في فحص المتطلبات" "ERROR"
        exit 1
    }
    
    # Step 2: Test server connection
    if (!(Test-ServerConnection $ServerIP $SSHUser)) {
        Write-Log "فشل في الاتصال بالسيرفر" "ERROR"
        exit 1
    }
    
    # Step 3: Upload scripts
    if (!(Upload-Scripts $ServerIP $SSHUser)) {
        Write-Log "فشل في رفع الملفات" "ERROR"
        exit 1
    }
    
    # Step 4: Install platform
    if (!(Install-Platform $ServerIP $SSHUser $Domain $Email)) {
        Write-Log "فشل في تثبيت المنصة" "ERROR"
        exit 1
    }
    
    # Step 5: Apply optimizations
    Apply-Optimizations $ServerIP $SSHUser
    
    # Step 6: Setup monitoring
    Setup-Monitoring $ServerIP $SSHUser
    
    # Step 7: Create initial backup
    Create-InitialBackup $ServerIP $SSHUser
    
    # Step 8: Get credentials
    Get-ServerCredentials $ServerIP $SSHUser
    
    # Step 9: Show completion summary
    Show-CompletionSummary $ServerIP $Domain
    
    Write-Log "تم إكمال إعداد المنصة بنجاح" "INFO"
}

# Execute main function
try {
    Main
}
catch {
    Write-Log "خطأ غير متوقع: $($_.Exception.Message)" "ERROR"
    Write-ColorOutput "❌ حدث خطأ غير متوقع. راجع السجلات للتفاصيل." "Red"
    exit 1
}
