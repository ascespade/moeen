# 🚀 Cursor Dev Platform Manager
# إدارة شاملة لمنصة التطوير المتكاملة

param(
    [Parameter(Mandatory=$false)]
    [ValidateSet("install", "status", "backup", "monitor", "restart", "logs", "update", "connect")]
    [string]$Action = "status",
    
    [Parameter(Mandatory=$false)]
    [string]$ServerIP = "",
    
    [Parameter(Mandatory=$false)]
    [string]$Domain = "cursor-dev.local",
    
    [Parameter(Mandatory=$false)]
    [string]$SSHUser = "root",
    
    [Parameter(Mandatory=$false)]
    [string]$Email = "admin@cursor-dev.local"
)

# Configuration
$ConfigFile = "D:\Cursor-Dev-Platform\configs\server-config.json"
$LogFile = "D:\Cursor-Dev-Platform\monitoring\cursor-dev.log"

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
    Write-ColorOutput $LogEntry $(if($Level -eq "ERROR") {"Red"} elseif($Level -eq "WARN") {"Yellow"} else {"Green"})
}

function Load-Config {
    if (Test-Path $ConfigFile) {
        return Get-Content $ConfigFile | ConvertFrom-Json
    }
    return $null
}

function Save-Config {
    param($Config)
    $Config | ConvertTo-Json -Depth 10 | Set-Content $ConfigFile
}

function Test-SSHConnection {
    param([string]$Server, [string]$User)
    try {
        $result = ssh -o ConnectTimeout=5 -o BatchMode=yes "$User@$Server" "echo 'connected'" 2>$null
        return $result -eq "connected"
    }
    catch {
        return $false
    }
}

function Install-CodeServer {
    param([string]$Server, [string]$User, [string]$Domain, [string]$Email)
    
    Write-ColorOutput "🚀 بدء تثبيت Cursor Dev Platform على السيرفر..." "Purple"
    
    # Upload installation script
    Write-ColorOutput "📤 رفع سكريبت التثبيت..." "Yellow"
    scp "D:\Cursor-Dev-Platform\scripts\install-code-server.sh" "$User@${Server}:/tmp/"
    
    if ($LASTEXITCODE -ne 0) {
        Write-Log "فشل في رفع سكريبت التثبيت" "ERROR"
        return $false
    }
    
    # Make script executable and run
    Write-ColorOutput "⚡ تشغيل سكريبت التثبيت..." "Yellow"
    ssh "$User@$Server" "chmod +x /tmp/install-code-server.sh && /tmp/install-code-server.sh $Domain $Email"
    
    if ($LASTEXITCODE -eq 0) {
        Write-ColorOutput "✅ تم تثبيت المنصة بنجاح!" "Green"
        
        # Save configuration
        $config = @{
            ServerIP = $Server
            Domain = $Domain
            SSHUser = $User
            Email = $Email
            InstallDate = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
            Status = "Active"
        }
        Save-Config $config
        
        # Get credentials
        Write-ColorOutput "🔐 جلب بيانات الدخول..." "Yellow"
        $credentials = ssh "$User@$Server" "cat /home/codeserver/.cursor-credentials 2>/dev/null"
        if ($credentials) {
            Write-ColorOutput "💾 بيانات الدخول:" "Green"
            Write-ColorOutput $credentials "Cyan"
        }
        
        return $true
    }
    else {
        Write-Log "فشل في تثبيت المنصة" "ERROR"
        return $false
    }
}

function Get-ServerStatus {
    param([string]$Server, [string]$User)
    
    Write-ColorOutput "📊 جلب حالة السيرفر..." "Yellow"
    
    $status = ssh "$User@$Server" "/usr/local/bin/cursor-monitor 2>/dev/null"
    if ($LASTEXITCODE -eq 0) {
        Write-ColorOutput $status "Green"
        return $true
    }
    else {
        Write-ColorOutput "❌ لا يمكن الوصول للسيرفر أو المنصة غير مثبتة" "Red"
        return $false
    }
}

function Start-Backup {
    param([string]$Server, [string]$User)
    
    Write-ColorOutput "💾 بدء النسخ الاحتياطي..." "Yellow"
    
    $result = ssh "$User@$Server" "/usr/local/bin/cursor-backup"
    if ($LASTEXITCODE -eq 0) {
        Write-ColorOutput "✅ تم إنشاء النسخة الاحتياطية بنجاح" "Green"
        Write-ColorOutput $result "Cyan"
        return $true
    }
    else {
        Write-ColorOutput "❌ فشل في إنشاء النسخة الاحتياطية" "Red"
        return $false
    }
}

function Show-Logs {
    param([string]$Server, [string]$User, [int]$Lines = 50)
    
    Write-ColorOutput "📋 عرض آخر $Lines سطر من السجلات..." "Yellow"
    
    ssh "$User@$Server" "journalctl -u code-server -n $Lines --no-pager"
}

function Restart-Services {
    param([string]$Server, [string]$User)
    
    Write-ColorOutput "🔄 إعادة تشغيل الخدمات..." "Yellow"
    
    $services = @("code-server", "nginx", "fail2ban")
    foreach ($service in $services) {
        Write-ColorOutput "  🔄 إعادة تشغيل $service..." "Blue"
        ssh "$User@$Server" "sudo systemctl restart $service"
        if ($LASTEXITCODE -eq 0) {
            Write-ColorOutput "  ✅ $service تم إعادة تشغيله بنجاح" "Green"
        }
        else {
            Write-ColorOutput "  ❌ فشل في إعادة تشغيل $service" "Red"
        }
    }
}

function Start-Monitor {
    param([string]$Server, [string]$User)
    
    Write-ColorOutput "📊 بدء مراقبة السيرفر المباشرة..." "Purple"
    Write-ColorOutput "اضغط Ctrl+C للخروج" "Yellow"
    
    while ($true) {
        Clear-Host
        Write-ColorOutput "🚀 Cursor Dev Platform - Live Monitor" "Purple"
        Write-ColorOutput "=================================" "Cyan"
        Write-ColorOutput "Server: $Server | Time: $(Get-Date)" "Blue"
        Write-ColorOutput "" "White"
        
        Get-ServerStatus $Server $User
        
        Start-Sleep -Seconds 10
    }
}

function Connect-ToServer {
    param([string]$Server, [string]$User, [string]$Domain)
    
    Write-ColorOutput "🌐 فتح المنصة في المتصفح..." "Purple"
    
    # Try HTTPS first, then HTTP
    $urls = @("https://$Domain", "http://$Server:8080")
    
    foreach ($url in $urls) {
        Write-ColorOutput "🔗 محاولة فتح: $url" "Yellow"
        try {
            Start-Process $url
            Write-ColorOutput "✅ تم فتح المتصفح" "Green"
            break
        }
        catch {
            Write-ColorOutput "❌ فشل في فتح: $url" "Red"
        }
    }
    
    # Show credentials
    Write-ColorOutput "🔐 جلب بيانات الدخول..." "Yellow"
    $credentials = ssh "$User@$Server" "cat /home/codeserver/.cursor-credentials 2>/dev/null"
    if ($credentials) {
        Write-ColorOutput "💾 بيانات الدخول:" "Green"
        Write-ColorOutput $credentials "Cyan"
    }
}

function Update-Platform {
    param([string]$Server, [string]$User)
    
    Write-ColorOutput "🔄 تحديث المنصة..." "Purple"
    
    # Update system packages
    Write-ColorOutput "📦 تحديث حزم النظام..." "Yellow"
    ssh "$User@$Server" "sudo apt update && sudo apt upgrade -y"
    
    # Update code-server
    Write-ColorOutput "💻 تحديث code-server..." "Yellow"
    ssh "$User@$Server" "curl -fsSL https://code-server.dev/install.sh | sh"
    
    # Restart services
    Restart-Services $Server $User
    
    Write-ColorOutput "✅ تم تحديث المنصة بنجاح" "Green"
}

function Show-Help {
    Write-ColorOutput "🚀 Cursor Dev Platform Manager" "Purple"
    Write-ColorOutput "=============================" "Cyan"
    Write-ColorOutput ""
    Write-ColorOutput "الاستخدام:" "Yellow"
    Write-ColorOutput "  .\cursor-dev-manager.ps1 -Action <action> [parameters]" "White"
    Write-ColorOutput ""
    Write-ColorOutput "الأوامر المتاحة:" "Yellow"
    Write-ColorOutput "  install   - تثبيت المنصة على السيرفر" "Green"
    Write-ColorOutput "  status    - عرض حالة السيرفر والخدمات" "Green"
    Write-ColorOutput "  backup    - إنشاء نسخة احتياطية" "Green"
    Write-ColorOutput "  monitor   - مراقبة مباشرة للسيرفر" "Green"
    Write-ColorOutput "  restart   - إعادة تشغيل الخدمات" "Green"
    Write-ColorOutput "  logs      - عرض سجلات النظام" "Green"
    Write-ColorOutput "  update    - تحديث المنصة" "Green"
    Write-ColorOutput "  connect   - فتح المنصة في المتصفح" "Green"
    Write-ColorOutput ""
    Write-ColorOutput "المعاملات:" "Yellow"
    Write-ColorOutput "  -ServerIP   عنوان IP للسيرفر" "Blue"
    Write-ColorOutput "  -Domain     اسم النطاق" "Blue"
    Write-ColorOutput "  -SSHUser    مستخدم SSH" "Blue"
    Write-ColorOutput "  -Email      البريد الإلكتروني للـ SSL" "Blue"
    Write-ColorOutput ""
    Write-ColorOutput "أمثلة:" "Yellow"
    Write-ColorOutput "  .\cursor-dev-manager.ps1 -Action install -ServerIP 192.168.1.100 -Domain dev.example.com" "Cyan"
    Write-ColorOutput "  .\cursor-dev-manager.ps1 -Action status -ServerIP 192.168.1.100" "Cyan"
    Write-ColorOutput "  .\cursor-dev-manager.ps1 -Action monitor -ServerIP 192.168.1.100" "Cyan"
}

# Main execution
try {
    # Create directories if they don't exist
    $dirs = @("D:\Cursor-Dev-Platform\configs", "D:\Cursor-Dev-Platform\monitoring")
    foreach ($dir in $dirs) {
        if (!(Test-Path $dir)) {
            New-Item -ItemType Directory -Path $dir -Force | Out-Null
        }
    }
    
    # Load existing configuration
    $config = Load-Config
    
    # Use config values if parameters not provided
    if (!$ServerIP -and $config) { $ServerIP = $config.ServerIP }
    if (!$Domain -and $config) { $Domain = $config.Domain }
    if (!$SSHUser -and $config) { $SSHUser = $config.SSHUser }
    if (!$Email -and $config) { $Email = $config.Email }
    
    Write-ColorOutput "🚀 Cursor Dev Platform Manager" "Purple"
    Write-ColorOutput "=============================" "Cyan"
    
    switch ($Action.ToLower()) {
        "install" {
            if (!$ServerIP) {
                Write-ColorOutput "❌ يجب تحديد عنوان IP للسيرفر" "Red"
                Write-ColorOutput "استخدم: -ServerIP <IP_ADDRESS>" "Yellow"
                exit 1
            }
            
            Write-ColorOutput "🔍 اختبار الاتصال بالسيرفر..." "Yellow"
            if (!(Test-SSHConnection $ServerIP $SSHUser)) {
                Write-ColorOutput "❌ لا يمكن الاتصال بالسيرفر $ServerIP" "Red"
                Write-ColorOutput "تأكد من:" "Yellow"
                Write-ColorOutput "  - عنوان IP صحيح" "Blue"
                Write-ColorOutput "  - SSH مفعل على السيرفر" "Blue"
                Write-ColorOutput "  - مفاتيح SSH مُعدة بشكل صحيح" "Blue"
                exit 1
            }
            
            Install-CodeServer $ServerIP $SSHUser $Domain $Email
        }
        
        "status" {
            if (!$ServerIP) {
                Write-ColorOutput "❌ لا يوجد سيرفر مُعرف" "Red"
                Write-ColorOutput "استخدم: -ServerIP <IP_ADDRESS> أو قم بالتثبيت أولاً" "Yellow"
                exit 1
            }
            Get-ServerStatus $ServerIP $SSHUser
        }
        
        "backup" {
            if (!$ServerIP) {
                Write-ColorOutput "❌ لا يوجد سيرفر مُعرف" "Red"
                exit 1
            }
            Start-Backup $ServerIP $SSHUser
        }
        
        "monitor" {
            if (!$ServerIP) {
                Write-ColorOutput "❌ لا يوجد سيرفر مُعرف" "Red"
                exit 1
            }
            Start-Monitor $ServerIP $SSHUser
        }
        
        "restart" {
            if (!$ServerIP) {
                Write-ColorOutput "❌ لا يوجد سيرفر مُعرف" "Red"
                exit 1
            }
            Restart-Services $ServerIP $SSHUser
        }
        
        "logs" {
            if (!$ServerIP) {
                Write-ColorOutput "❌ لا يوجد سيرفر مُعرف" "Red"
                exit 1
            }
            Show-Logs $ServerIP $SSHUser
        }
        
        "update" {
            if (!$ServerIP) {
                Write-ColorOutput "❌ لا يوجد سيرفر مُعرف" "Red"
                exit 1
            }
            Update-Platform $ServerIP $SSHUser
        }
        
        "connect" {
            if (!$ServerIP) {
                Write-ColorOutput "❌ لا يوجد سيرفر مُعرف" "Red"
                exit 1
            }
            Connect-ToServer $ServerIP $SSHUser $Domain
        }
        
        default {
            Show-Help
        }
    }
    
    Write-Log "تم تنفيذ العملية: $Action بنجاح"
}
catch {
    Write-Log "خطأ في تنفيذ العملية: $($_.Exception.Message)" "ERROR"
    Write-ColorOutput "❌ حدث خطأ: $($_.Exception.Message)" "Red"
    exit 1
}
