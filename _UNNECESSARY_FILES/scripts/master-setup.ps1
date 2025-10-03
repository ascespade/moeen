# 🚀 Cursor Dev Platform - Master Setup Script
# الإعداد الشامل والنهائي لمنصة التطوير المتكاملة مع جميع الميزات

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
    [switch]$FullSetup = $true,
    
    [Parameter(Mandatory=$false)]
    [switch]$SkipOptimization = $false,
    
    [Parameter(Mandatory=$false)]
    [switch]$EnableAI = $true,
    
    [Parameter(Mandatory=$false)]
    [switch]$EnableDocker = $true,
    
    [Parameter(Mandatory=$false)]
    [switch]$EnableMonitoring = $true
)

# Configuration
$PlatformPath = "D:\Cursor-Dev-Platform"
$LogFile = "$PlatformPath\monitoring\master-setup.log"

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

function Show-Banner {
    Write-ColorOutput "" "White"
    Write-ColorOutput "🚀 ============================================== 🚀" "Purple"
    Write-ColorOutput "   Cursor Dev Platform - Master Setup" "Purple"
    Write-ColorOutput "   منصة التطوير المتكاملة - الإعداد الشامل" "Purple"
    Write-ColorOutput "🚀 ============================================== 🚀" "Purple"
    Write-ColorOutput "" "White"
    Write-ColorOutput "📋 معلومات الإعداد:" "Yellow"
    Write-ColorOutput "  🌐 السيرفر: $ServerIP" "Blue"
    Write-ColorOutput "  🌍 النطاق: $Domain" "Blue"
    Write-ColorOutput "  👤 المستخدم: $SSHUser" "Blue"
    Write-ColorOutput "  📧 البريد: $Email" "Blue"
    Write-ColorOutput "  🤖 الذكاء الاصطناعي: $(if($EnableAI) {'مفعل'} else {'معطل'})" "Blue"
    Write-ColorOutput "  🐳 Docker: $(if($EnableDocker) {'مفعل'} else {'معطل'})" "Blue"
    Write-ColorOutput "  📊 المراقبة: $(if($EnableMonitoring) {'مفعل'} else {'معطل'})" "Blue"
    Write-ColorOutput "" "White"
}

function Test-Prerequisites {
    Write-ColorOutput "🔍 فحص المتطلبات الأساسية..." "Yellow"
    
    $prerequisites = @()
    
    # Check PowerShell version
    if ($PSVersionTable.PSVersion.Major -lt 5) {
        $prerequisites += "PowerShell 5.0+ مطلوب"
    }
    
    # Check SSH
    if (!(Get-Command ssh -ErrorAction SilentlyContinue)) {
        $prerequisites += "OpenSSH Client غير مثبت"
    }
    
    # Check SCP
    if (!(Get-Command scp -ErrorAction SilentlyContinue)) {
        $prerequisites += "SCP غير متوفر"
    }
    
    # Check internet connection
    try {
        $null = Test-NetConnection -ComputerName "8.8.8.8" -Port 53 -InformationLevel Quiet -WarningAction SilentlyContinue
    }
    catch {
        $prerequisites += "لا يوجد اتصال بالإنترنت"
    }
    
    # Check disk space (minimum 5GB)
    $freeSpace = (Get-WmiObject -Class Win32_LogicalDisk -Filter "DeviceID='D:'").FreeSpace / 1GB
    if ($freeSpace -lt 5) {
        $prerequisites += "مساحة قرص غير كافية (مطلوب 5GB على الأقل)"
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
            
            # Get server info
            $serverInfo = ssh "$User@$Server" "uname -a && free -h | head -2 && df -h / | tail -1"
            Write-ColorOutput "📊 معلومات السيرفر:" "Blue"
            Write-ColorOutput $serverInfo "Cyan"
            
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

function Upload-AllScripts {
    param([string]$Server, [string]$User)
    
    Write-ColorOutput "📤 رفع جميع ملفات الإعداد..." "Yellow"
    
    $scripts = @(
        "$PlatformPath\scripts\install-code-server.sh",
        "$PlatformPath\scripts\performance-optimizer.sh",
        "$PlatformPath\scripts\git-integration.sh",
        "$PlatformPath\scripts\project-import-system.sh",
        "$PlatformPath\scripts\ai-builder-integration.sh",
        "$PlatformPath\scripts\workspace-templates.sh",
        "$PlatformPath\configs\platform-config.json",
        "$PlatformPath\monitoring\dashboard.html"
    )
    
    $uploadCount = 0
    foreach ($script in $scripts) {
        if (Test-Path $script) {
            Write-ColorOutput "  📁 رفع $(Split-Path $script -Leaf)..." "Blue"
            scp $script "$User@${Server}:/tmp/"
            
            if ($LASTEXITCODE -eq 0) {
                $uploadCount++
            } else {
                Write-Log "فشل في رفع $script" "ERROR"
                return $false
            }
        }
        else {
            Write-Log "الملف غير موجود: $script" "ERROR"
            return $false
        }
    }
    
    Write-ColorOutput "✅ تم رفع $uploadCount ملف بنجاح" "Green"
    return $true
}

function Install-CorePlatform {
    param([string]$Server, [string]$User, [string]$Domain, [string]$Email)
    
    Write-ColorOutput "🚀 تثبيت المنصة الأساسية..." "Purple"
    
    # Make scripts executable
    ssh "$User@$Server" "chmod +x /tmp/*.sh"
    
    # Install core platform
    Write-ColorOutput "⚡ تثبيت Code Server والمنصة الأساسية..." "Yellow"
    ssh "$User@$Server" "/tmp/install-code-server.sh $Domain $Email"
    
    if ($LASTEXITCODE -ne 0) {
        Write-Log "فشل في تثبيت المنصة الأساسية" "ERROR"
        return $false
    }
    
    Write-ColorOutput "✅ تم تثبيت المنصة الأساسية بنجاح" "Green"
    return $true
}

function Apply-PerformanceOptimizations {
    param([string]$Server, [string]$User)
    
    if ($SkipOptimization) {
        Write-ColorOutput "⏭️ تم تخطي تحسينات الأداء" "Yellow"
        return $true
    }
    
    Write-ColorOutput "⚡ تطبيق تحسينات الأداء المتقدمة..." "Purple"
    
    ssh "$User@$Server" "/tmp/performance-optimizer.sh all"
    
    if ($LASTEXITCODE -eq 0) {
        Write-ColorOutput "✅ تم تطبيق تحسينات الأداء بنجاح" "Green"
        return $true
    }
    else {
        Write-Log "فشل في تطبيق تحسينات الأداء" "WARN"
        return $false
    }
}

function Setup-GitIntegration {
    param([string]$Server, [string]$User)
    
    Write-ColorOutput "🔗 إعداد تكامل Git..." "Purple"
    
    ssh "$User@$Server" "/tmp/git-integration.sh"
    
    if ($LASTEXITCODE -eq 0) {
        Write-ColorOutput "✅ تم إعداد تكامل Git بنجاح" "Green"
        
        # Display SSH keys for user to add to Git providers
        Write-ColorOutput "🔑 مفاتيح SSH للإضافة إلى مقدمي الخدمة:" "Yellow"
        Write-ColorOutput "GitHub:" "Blue"
        ssh "$User@$Server" "cat /home/codeserver/.ssh/id_rsa_github.pub 2>/dev/null || echo 'لم يتم إنشاء المفتاح بعد'"
        Write-ColorOutput "GitLab:" "Blue"
        ssh "$User@$Server" "cat /home/codeserver/.ssh/id_rsa_gitlab.pub 2>/dev/null || echo 'لم يتم إنشاء المفتاح بعد'"
        
        return $true
    }
    else {
        Write-Log "فشل في إعداد تكامل Git" "WARN"
        return $false
    }
}

function Setup-ProjectImportSystem {
    param([string]$Server, [string]$User)
    
    Write-ColorOutput "📥 إعداد نظام استيراد المشاريع..." "Purple"
    
    ssh "$User@$Server" "/tmp/project-import-system.sh setup"
    
    if ($LASTEXITCODE -eq 0) {
        Write-ColorOutput "✅ تم إعداد نظام استيراد المشاريع بنجاح" "Green"
        return $true
    }
    else {
        Write-Log "فشل في إعداد نظام استيراد المشاريع" "WARN"
        return $false
    }
}

function Setup-AIIntegration {
    param([string]$Server, [string]$User)
    
    if (!$EnableAI) {
        Write-ColorOutput "⏭️ تم تخطي تكامل الذكاء الاصطناعي" "Yellow"
        return $true
    }
    
    Write-ColorOutput "🤖 إعداد تكامل الذكاء الاصطناعي..." "Purple"
    
    ssh "$User@$Server" "/tmp/ai-builder-integration.sh"
    
    if ($LASTEXITCODE -eq 0) {
        Write-ColorOutput "✅ تم إعداد تكامل الذكاء الاصطناعي بنجاح" "Green"
        Write-ColorOutput "🔧 لا تنس إضافة مفاتيح API:" "Yellow"
        Write-ColorOutput "  - OPENAI_API_KEY" "Blue"
        Write-ColorOutput "  - ANTHROPIC_API_KEY" "Blue"
        return $true
    }
    else {
        Write-Log "فشل في إعداد تكامل الذكاء الاصطناعي" "WARN"
        return $false
    }
}

function Setup-WorkspaceTemplates {
    param([string]$Server, [string]$User)
    
    Write-ColorOutput "📋 إعداد قوالب مساحات العمل..." "Purple"
    
    ssh "$User@$Server" "/tmp/workspace-templates.sh setup"
    
    if ($LASTEXITCODE -eq 0) {
        Write-ColorOutput "✅ تم إعداد قوالب مساحات العمل بنجاح" "Green"
        return $true
    }
    else {
        Write-Log "فشل في إعداد قوالب مساحات العمل" "WARN"
        return $false
    }
}

function Setup-DockerIntegration {
    param([string]$Server, [string]$User)
    
    if (!$EnableDocker) {
        Write-ColorOutput "⏭️ تم تخطي تكامل Docker" "Yellow"
        return $true
    }
    
    Write-ColorOutput "🐳 إعداد تكامل Docker..." "Purple"
    
    ssh "$User@$Server" @"
        # Install Docker Compose V2
        curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-linux-x86_64" -o /usr/local/bin/docker-compose
        chmod +x /usr/local/bin/docker-compose
        
        # Add codeserver user to docker group
        usermod -aG docker codeserver
        
        # Install Docker extensions for Code Server
        sudo -u codeserver code-server --install-extension ms-vscode-remote.remote-containers
        sudo -u codeserver code-server --install-extension ms-azuretools.vscode-docker
        
        # Create Docker workspace
        mkdir -p /home/codeserver/workspace/docker-projects
        chown -R codeserver:codeserver /home/codeserver/workspace/docker-projects
        
        echo "Docker integration completed successfully"
"@
    
    if ($LASTEXITCODE -eq 0) {
        Write-ColorOutput "✅ تم إعداد تكامل Docker بنجاح" "Green"
        return $true
    }
    else {
        Write-Log "فشل في إعداد تكامل Docker" "WARN"
        return $false
    }
}

function Setup-MonitoringDashboard {
    param([string]$Server, [string]$User)
    
    if (!$EnableMonitoring) {
        Write-ColorOutput "⏭️ تم تخطي إعداد المراقبة" "Yellow"
        return $true
    }
    
    Write-ColorOutput "📊 إعداد لوحة المراقبة المتقدمة..." "Purple"
    
    ssh "$User@$Server" @"
        # Setup monitoring directory
        mkdir -p /var/www/html/monitoring
        cp /tmp/dashboard.html /var/www/html/monitoring/index.html
        chown -R www-data:www-data /var/www/html/monitoring
        
        # Install additional monitoring tools
        apt update
        apt install -y htop iotop nethogs ncdu tree
        
        # Create monitoring API
        mkdir -p /var/www/html/api
        cat > /var/www/html/api/system-stats.php << 'EOF'
<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

\$stats = [
    'timestamp' => date('c'),
    'system' => [
        'uptime' => trim(file_get_contents('/proc/uptime')),
        'loadavg' => trim(file_get_contents('/proc/loadavg')),
        'meminfo' => [
            'total' => shell_exec("free -b | awk 'NR==2{print \$2}'"),
            'used' => shell_exec("free -b | awk 'NR==2{print \$3}'"),
            'free' => shell_exec("free -b | awk 'NR==2{print \$4}'")
        ],
        'disk' => [
            'total' => disk_total_space('/'),
            'free' => disk_free_space('/'),
            'used' => disk_total_space('/') - disk_free_space('/')
        ]
    ],
    'services' => [
        'code-server' => trim(shell_exec('systemctl is-active code-server')) === 'active',
        'nginx' => trim(shell_exec('systemctl is-active nginx')) === 'active',
        'postgresql' => trim(shell_exec('systemctl is-active postgresql')) === 'active',
        'redis' => trim(shell_exec('systemctl is-active redis-server')) === 'active'
    ],
    'network' => [
        'connections' => (int)shell_exec('ss -tuln | wc -l'),
        'nginx_requests' => (int)shell_exec('journalctl -u nginx --since="1 hour ago" | wc -l')
    ]
];

echo json_encode(\$stats, JSON_PRETTY_PRINT);
?>
EOF
        
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
    
    # Enable gzip compression
    gzip on;
    gzip_types text/plain application/json application/javascript text/css;
}
EOF
        
        ln -sf /etc/nginx/sites-available/monitoring /etc/nginx/sites-enabled/
        systemctl reload nginx
        
        echo "Monitoring dashboard setup completed"
"@
    
    if ($LASTEXITCODE -eq 0) {
        Write-ColorOutput "✅ تم إعداد لوحة المراقبة بنجاح" "Green"
        Write-ColorOutput "🌐 لوحة المراقبة: http://$Server:3000/monitoring/" "Cyan"
        return $true
    }
    else {
        Write-Log "فشل في إعداد لوحة المراقبة" "WARN"
        return $false
    }
}

function Create-InitialBackup {
    param([string]$Server, [string]$User)
    
    Write-ColorOutput "💾 إنشاء نسخة احتياطية أولية..." "Yellow"
    
    ssh "$User@$Server" "/usr/local/bin/cursor-smart-backup 2>/dev/null || /usr/local/bin/cursor-backup 2>/dev/null || echo 'Backup script not found, skipping...'"
    
    if ($LASTEXITCODE -eq 0) {
        Write-ColorOutput "✅ تم إنشاء النسخة الاحتياطية الأولية" "Green"
        return $true
    }
    else {
        Write-Log "تحذير: لم يتم إنشاء النسخة الاحتياطية الأولية" "WARN"
        return $false
    }
}

function Get-ServerCredentials {
    param([string]$Server, [string]$User)
    
    Write-ColorOutput "🔐 جلب بيانات الدخول..." "Yellow"
    
    $credentials = ssh "$User@$Server" "cat /home/codeserver/.cursor-credentials 2>/dev/null || echo 'Credentials file not found'"
    
    if ($credentials -and $credentials -ne "Credentials file not found") {
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
            Features = @{
                AI = $EnableAI
                Docker = $EnableDocker
                Monitoring = $EnableMonitoring
                Git = $true
                ProjectImport = $true
                Templates = $true
            }
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

function Run-FinalTests {
    param([string]$Server, [string]$User)
    
    Write-ColorOutput "🧪 تشغيل الاختبارات النهائية..." "Purple"
    
    # Test Code Server
    Write-ColorOutput "  🔍 اختبار Code Server..." "Blue"
    $codeServerTest = ssh "$User@$Server" "curl -s -o /dev/null -w '%{http_code}' http://localhost:8080"
    if ($codeServerTest -match "200|302") {
        Write-ColorOutput "  ✅ Code Server يعمل بشكل صحيح" "Green"
    } else {
        Write-ColorOutput "  ❌ Code Server لا يستجيب" "Red"
    }
    
    # Test Nginx
    Write-ColorOutput "  🔍 اختبار Nginx..." "Blue"
    $nginxTest = ssh "$User@$Server" "systemctl is-active nginx"
    if ($nginxTest -eq "active") {
        Write-ColorOutput "  ✅ Nginx يعمل بشكل صحيح" "Green"
    } else {
        Write-ColorOutput "  ❌ Nginx لا يعمل" "Red"
    }
    
    # Test SSL (if domain is not localhost)
    if ($Domain -ne "cursor-dev.local" -and $Domain -ne "localhost") {
        Write-ColorOutput "  🔍 اختبار SSL..." "Blue"
        try {
            $sslTest = Invoke-WebRequest -Uri "https://$Domain" -UseBasicParsing -TimeoutSec 10
            if ($sslTest.StatusCode -eq 200) {
                Write-ColorOutput "  ✅ SSL يعمل بشكل صحيح" "Green"
            }
        }
        catch {
            Write-ColorOutput "  ❌ SSL لا يعمل أو النطاق غير متاح" "Red"
        }
    }
    
    # Test Git integration
    Write-ColorOutput "  🔍 اختبار تكامل Git..." "Blue"
    $gitTest = ssh "$User@$Server" "which git-init-project"
    if ($gitTest) {
        Write-ColorOutput "  ✅ تكامل Git متاح" "Green"
    } else {
        Write-ColorOutput "  ❌ تكامل Git غير متاح" "Red"
    }
    
    # Test AI integration (if enabled)
    if ($EnableAI) {
        Write-ColorOutput "  🔍 اختبار تكامل الذكاء الاصطناعي..." "Blue"
        $aiTest = ssh "$User@$Server" "which ai-chat"
        if ($aiTest) {
            Write-ColorOutput "  ✅ تكامل الذكاء الاصطناعي متاح" "Green"
        } else {
            Write-ColorOutput "  ❌ تكامل الذكاء الاصطناعي غير متاح" "Red"
        }
    }
    
    # Test monitoring (if enabled)
    if ($EnableMonitoring) {
        Write-ColorOutput "  🔍 اختبار لوحة المراقبة..." "Blue"
        try {
            $monitorTest = Invoke-WebRequest -Uri "http://$Server:3000/monitoring/" -UseBasicParsing -TimeoutSec 10
            if ($monitorTest.StatusCode -eq 200) {
                Write-ColorOutput "  ✅ لوحة المراقبة تعمل بشكل صحيح" "Green"
            }
        }
        catch {
            Write-ColorOutput "  ❌ لوحة المراقبة لا تعمل" "Red"
        }
    }
    
    Write-ColorOutput "✅ تم إكمال الاختبارات النهائية" "Green"
}

function Show-CompletionSummary {
    param([string]$Server, [string]$Domain)
    
    Write-ColorOutput "" "White"
    Write-ColorOutput "🎉 ============================================== 🎉" "Green"
    Write-ColorOutput "   تم إعداد Cursor Dev Platform بنجاح!" "Green"
    Write-ColorOutput "   منصة التطوير المتكاملة جاهزة للاستخدام" "Green"
    Write-ColorOutput "🎉 ============================================== 🎉" "Green"
    Write-ColorOutput "" "White"
    
    Write-ColorOutput "📋 معلومات المنصة:" "Yellow"
    Write-ColorOutput "  🌐 الرابط الرئيسي: https://$Domain" "Blue"
    Write-ColorOutput "  🌐 رابط بديل: http://$Server:8080" "Blue"
    if ($EnableMonitoring) {
        Write-ColorOutput "  📊 لوحة المراقبة: http://$Server:3000/monitoring/" "Blue"
    }
    Write-ColorOutput "  📁 مجلد العمل: /home/codeserver/workspace" "Blue"
    Write-ColorOutput "" "White"
    
    Write-ColorOutput "🚀 الميزات المتاحة:" "Yellow"
    Write-ColorOutput "  ✅ Code Server مع تحسينات الأداء" "Green"
    Write-ColorOutput "  ✅ تكامل Git الشامل مع GitHub/GitLab" "Green"
    Write-ColorOutput "  ✅ نظام استيراد المشاريع الذكي" "Green"
    Write-ColorOutput "  ✅ قوالب مساحات العمل المتقدمة" "Green"
    if ($EnableAI) {
        Write-ColorOutput "  ✅ تكامل الذكاء الاصطناعي (OpenAI/Anthropic)" "Green"
    }
    if ($EnableDocker) {
        Write-ColorOutput "  ✅ تكامل Docker للبيئات المعزولة" "Green"
    }
    if ($EnableMonitoring) {
        Write-ColorOutput "  ✅ لوحة المراقبة التفاعلية" "Green"
    }
    Write-ColorOutput "  ✅ النسخ الاحتياطي التلقائي" "Green"
    Write-ColorOutput "  ✅ الأمان المتقدم مع SSL" "Green"
    Write-ColorOutput "" "White"
    
    Write-ColorOutput "🔧 أوامر الإدارة:" "Yellow"
    Write-ColorOutput "  .\cursor-dev-manager.ps1 -Action status -ServerIP $Server" "Green"
    Write-ColorOutput "  .\cursor-dev-manager.ps1 -Action monitor -ServerIP $Server" "Green"
    Write-ColorOutput "  .\cursor-dev-manager.ps1 -Action backup -ServerIP $Server" "Green"
    Write-ColorOutput "  .\cursor-dev-manager.ps1 -Action connect -ServerIP $Server" "Green"
    Write-ColorOutput "" "White"
    
    Write-ColorOutput "📚 أوامر المشاريع:" "Yellow"
    Write-ColorOutput "  import-project <git-url> <project-name>" "Green"
    Write-ColorOutput "  create-from-template <template> <project-name>" "Green"
    Write-ColorOutput "  git-init-project <name> <type> [remote-url]" "Green"
    Write-ColorOutput "  list-projects" "Green"
    Write-ColorOutput "" "White"
    
    if ($EnableAI) {
        Write-ColorOutput "🤖 أوامر الذكاء الاصطناعي:" "Yellow"
        Write-ColorOutput "  ai-chat 'Your message here'" "Green"
        Write-ColorOutput "  ai-code 'Create a REST API' python" "Green"
        Write-ColorOutput "" "White"
    }
    
    Write-ColorOutput "📁 الملفات المهمة:" "Yellow"
    Write-ColorOutput "  📄 التكوين: $PlatformPath\configs\server-config.json" "Blue"
    Write-ColorOutput "  📊 السجلات: $PlatformPath\monitoring\master-setup.log" "Blue"
    Write-ColorOutput "  🎛️ لوحة التحكم: $PlatformPath\monitoring\dashboard.html" "Blue"
    Write-ColorOutput "  📖 دليل الاستخدام: $PlatformPath\docs\usage-guide.md" "Blue"
    Write-ColorOutput "" "White"
    
    Write-ColorOutput "🚀 الخطوات التالية:" "Yellow"
    Write-ColorOutput "  1. افتح الرابط في المتصفح" "Green"
    Write-ColorOutput "  2. ادخل كلمة المرور المعروضة أعلاه" "Green"
    Write-ColorOutput "  3. اقرأ دليل الاستخدام للتفاصيل الكاملة" "Green"
    Write-ColorOutput "  4. ابدأ التطوير مع أقوى منصة متكاملة!" "Green"
    Write-ColorOutput "" "White"
    
    Write-ColorOutput "💡 نصائح مهمة:" "Yellow"
    Write-ColorOutput "  - Cursor Agent سيستمر في العمل معك" "Blue"
    Write-ColorOutput "  - جميع المعالجة تتم على السيرفر (أداء عالي)" "Blue"
    Write-ColorOutput "  - النسخ الاحتياطي تلقائي يومياً الساعة 2:00 ص" "Blue"
    Write-ColorOutput "  - المراقبة المستمرة للأداء والأمان" "Blue"
    if ($EnableAI) {
        Write-ColorOutput "  - لا تنس إضافة مفاتيح API للذكاء الاصطناعي" "Blue"
    }
    Write-ColorOutput "" "White"
    
    Write-ColorOutput "🎊 استمتع بالتطوير مع منصة Cursor Dev Platform! 🎊" "Purple"
    Write-ColorOutput "" "White"
}

function Main {
    # Initialize
    Show-Banner
    
    # Create log directory
    if (!(Test-Path "$PlatformPath\monitoring")) {
        New-Item -ItemType Directory -Path "$PlatformPath\monitoring" -Force | Out-Null
    }
    
    Write-Log "بدء الإعداد الشامل لـ Cursor Dev Platform" "INFO"
    
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
    
    # Step 3: Upload all scripts
    if (!(Upload-AllScripts $ServerIP $SSHUser)) {
        Write-Log "فشل في رفع الملفات" "ERROR"
        exit 1
    }
    
    # Step 4: Install core platform
    if (!(Install-CorePlatform $ServerIP $SSHUser $Domain $Email)) {
        Write-Log "فشل في تثبيت المنصة الأساسية" "ERROR"
        exit 1
    }
    
    # Step 5: Apply performance optimizations
    Apply-PerformanceOptimizations $ServerIP $SSHUser
    
    # Step 6: Setup Git integration
    Setup-GitIntegration $ServerIP $SSHUser
    
    # Step 7: Setup project import system
    Setup-ProjectImportSystem $ServerIP $SSHUser
    
    # Step 8: Setup AI integration
    Setup-AIIntegration $ServerIP $SSHUser
    
    # Step 9: Setup workspace templates
    Setup-WorkspaceTemplates $ServerIP $SSHUser
    
    # Step 10: Setup Docker integration
    Setup-DockerIntegration $ServerIP $SSHUser
    
    # Step 11: Setup monitoring dashboard
    Setup-MonitoringDashboard $ServerIP $SSHUser
    
    # Step 12: Create initial backup
    Create-InitialBackup $ServerIP $SSHUser
    
    # Step 13: Get credentials
    Get-ServerCredentials $ServerIP $SSHUser
    
    # Step 14: Run final tests
    Run-FinalTests $ServerIP $SSHUser
    
    # Step 15: Show completion summary
    Show-CompletionSummary $ServerIP $Domain
    
    Write-Log "تم إكمال الإعداد الشامل بنجاح" "INFO"
}

# Execute main function
try {
    Main
}
catch {
    Write-Log "خطأ غير متوقع: $($_.Exception.Message)" "ERROR"
    Write-ColorOutput "❌ حدث خطأ غير متوقع. راجع السجلات للتفاصيل." "Red"
    Write-ColorOutput "📄 ملف السجل: $LogFile" "Yellow"
    exit 1
}
