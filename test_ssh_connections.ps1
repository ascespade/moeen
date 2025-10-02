# اختبار شامل لاتصالات SSH
# Comprehensive SSH Connection Testing

param(
    [switch]$Detailed,
    [switch]$Interactive,
    [string]$KeyPath = ""
)

# Server configurations
$servers = @(
    @{
        name = "cursor"
        ip = "100.87.127.117"
        user = "ubuntu"
        description = "Cursor Development Server"
    },
    @{
        name = "ec2-jump-server" 
        ip = "100.97.57.53"
        user = "ubuntu"
        description = "Amazon EC2 Jump Server"
    }
)

function Write-TestResult {
    param([string]$Message, [string]$Status = "Info")
    
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
    
    $timestamp = Get-Date -Format "HH:mm:ss"
    Write-Host "[$timestamp] $($icons[$Status]) $Message" -ForegroundColor $colors[$Status]
}

function Test-SSHConnection {
    param(
        [string]$ServerIP,
        [string]$Username,
        [string]$ServerName,
        [string]$KeyFile = ""
    )
    
    Write-TestResult "اختبار SSH لـ $ServerName ($ServerIP)" "Header"
    
    # Build SSH command for testing
    $sshArgs = @(
        "-o", "ConnectTimeout=10",
        "-o", "BatchMode=yes",
        "-o", "StrictHostKeyChecking=no",
        "-o", "UserKnownHostsFile=/dev/null"
    )
    
    if ($KeyFile -and (Test-Path $KeyFile)) {
        $sshArgs += @("-i", $KeyFile)
        Write-TestResult "استخدام مفتاح SSH: $KeyFile" "Info"
    }
    
    $sshArgs += @("$Username@$ServerIP", "echo 'SSH_CONNECTION_SUCCESS' && whoami && hostname && uptime")
    
    try {
        Write-TestResult "محاولة الاتصال..." "Info"
        $result = & ssh @sshArgs 2>&1
        
        if ($result -match "SSH_CONNECTION_SUCCESS") {
            Write-TestResult "✅ اتصال SSH ناجح!" "Success"
            
            if ($Detailed) {
                Write-TestResult "تفاصيل السيرفر:" "Info"
                $result | ForEach-Object {
                    if ($_ -ne "SSH_CONNECTION_SUCCESS") {
                        Write-Host "    📋 $_" -ForegroundColor Gray
                    }
                }
            }
            return $true
        }
        elseif ($result -match "Permission denied") {
            Write-TestResult "❌ رُفض الإذن - تحتاج مصادقة" "Error"
            Write-TestResult "جرب: مفتاح SSH أو كلمة مرور" "Warning"
            return $false
        }
        elseif ($result -match "Connection refused") {
            Write-TestResult "❌ رُفض الاتصال - SSH غير متاح" "Error"
            return $false
        }
        elseif ($result -match "timeout") {
            Write-TestResult "❌ انتهت مهلة الاتصال" "Error"
            return $false
        }
        else {
            Write-TestResult "❌ فشل الاتصال" "Error"
            if ($Detailed) {
                Write-TestResult "تفاصيل الخطأ:" "Warning"
                $result | ForEach-Object {
                    Write-Host "    🔍 $_" -ForegroundColor Yellow
                }
            }
            return $false
        }
    }
    catch {
        Write-TestResult "❌ خطأ في تنفيذ SSH: $($_.Exception.Message)" "Error"
        return $false
    }
}

function Test-SSHKeyAuth {
    param([string]$ServerIP, [string]$Username, [string]$ServerName)
    
    Write-TestResult "البحث عن مفاتيح SSH..." "Info"
    
    # Common SSH key locations
    $sshDir = Join-Path $env:USERPROFILE ".ssh"
    $keyPaths = @()
    
    if (Test-Path $sshDir) {
        $keyPaths += Get-ChildItem $sshDir -Filter "id_*" -File | Where-Object { $_.Extension -eq "" -or $_.Extension -eq ".pem" }
    }
    
    if ($keyPaths.Count -gt 0) {
        Write-TestResult "وُجدت $($keyPaths.Count) مفاتيح SSH" "Info"
        
        foreach ($key in $keyPaths) {
            Write-TestResult "اختبار المفتاح: $($key.Name)" "Info"
            $success = Test-SSHConnection -ServerIP $ServerIP -Username $Username -ServerName $ServerName -KeyFile $key.FullName
            if ($success) {
                return $key.FullName
            }
        }
    } else {
        Write-TestResult "لم توجد مفاتيح SSH في $sshDir" "Warning"
    }
    
    return $null
}

function Show-ConnectionInstructions {
    param([string]$ServerName, [string]$ServerIP, [string]$Username)
    
    Write-Host
    Write-TestResult "تعليمات الاتصال بـ $ServerName:" "Header"
    Write-Host
    
    Write-Host "🔑 خيارات المصادقة:" -ForegroundColor Yellow
    Write-Host "  1. استخدام مفتاح SSH:"
    Write-Host "     ssh -i path\to\your\key.pem $Username@$ServerIP" -ForegroundColor Green
    Write-Host
    Write-Host "  2. استخدام كلمة المرور:"
    Write-Host "     ssh $Username@$ServerIP" -ForegroundColor Green
    Write-Host "     (سيطلب كلمة المرور)"
    Write-Host
    
    Write-Host "🛠️ إنشاء مفتاح SSH جديد:" -ForegroundColor Yellow
    Write-Host "     ssh-keygen -t ed25519 -C 'your-email@example.com'" -ForegroundColor Green
    Write-Host "     ssh-copy-id $Username@$ServerIP" -ForegroundColor Green
    Write-Host
    
    Write-Host "📋 استخدام الاختصارات:" -ForegroundColor Yellow
    Write-Host "     .\connect_$($ServerName.ToLower()).ps1" -ForegroundColor Green
    Write-Host "     .\connect_$($ServerName.ToLower()).ps1 -KeyFile path\to\key.pem" -ForegroundColor Green
}

# Main execution
Clear-Host
Write-Host "╔══════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║                🔐 اختبار اتصالات SSH الشامل                  ║" -ForegroundColor Cyan
Write-Host "╚══════════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host

$successCount = 0
$totalServers = $servers.Count

foreach ($server in $servers) {
    Write-Host
    Write-TestResult "اختبار $($server.description)" "Header"
    Write-TestResult "العنوان: $($server.ip)" "Info"
    Write-TestResult "المستخدم: $($server.user)" "Info"
    
    # Test basic connectivity first
    Write-TestResult "اختبار الاتصال الأساسي..." "Info"
    $ping = Test-NetConnection -ComputerName $server.ip -InformationLevel Quiet -WarningAction SilentlyContinue
    
    if (-not $ping) {
        Write-TestResult "❌ فشل الاتصال الأساسي" "Error"
        continue
    }
    
    Write-TestResult "✅ الاتصال الأساسي متاح" "Success"
    
    # Test SSH port
    $sshPort = Test-NetConnection -ComputerName $server.ip -Port 22 -InformationLevel Quiet -WarningAction SilentlyContinue
    if (-not $sshPort) {
        Write-TestResult "❌ منفذ SSH غير متاح" "Error"
        continue
    }
    
    Write-TestResult "✅ منفذ SSH متاح" "Success"
    
    # Try SSH connection
    if ($KeyPath) {
        $success = Test-SSHConnection -ServerIP $server.ip -Username $server.user -ServerName $server.name -KeyFile $KeyPath
    } else {
        # Try without key first
        $success = Test-SSHConnection -ServerIP $server.ip -Username $server.user -ServerName $server.name
        
        # If failed, try to find SSH keys
        if (-not $success) {
            $foundKey = Test-SSHKeyAuth -ServerIP $server.ip -Username $server.user -ServerName $server.name
            if ($foundKey) {
                Write-TestResult "✅ تم العثور على مفتاح صالح: $foundKey" "Success"
                $success = $true
            }
        }
    }
    
    if ($success) {
        $successCount++
    } else {
        if ($Interactive) {
            Show-ConnectionInstructions -ServerName $server.name -ServerIP $server.ip -Username $server.user
        }
    }
}

# Summary
Write-Host
Write-Host "╔══════════════════════════════════════════════════════════════╗" -ForegroundColor Green
Write-Host "║                        📊 ملخص النتائج                        ║" -ForegroundColor Green
Write-Host "╚══════════════════════════════════════════════════════════════╝" -ForegroundColor Green
Write-Host

Write-TestResult "اكتملت اختبارات SSH!" "Success"
Write-TestResult "السيرفرات المُختبرة: $totalServers" "Info"
Write-TestResult "الاتصالات الناجحة: $successCount" "Info"
Write-TestResult "الاتصالات الفاشلة: $($totalServers - $successCount)" "Info"

if ($successCount -eq $totalServers) {
    Write-TestResult "🎉 جميع الاتصالات تعمل بنجاح!" "Success"
} elseif ($successCount -gt 0) {
    Write-TestResult "⚠️ بعض الاتصالات تحتاج إعداد مصادقة" "Warning"
} else {
    Write-TestResult "❌ جميع الاتصالات تحتاج إعداد" "Error"
}

Write-Host
Write-TestResult "استخدم المعاملات التالية للمزيد من التفاصيل:" "Info"
Write-Host "  -Detailed      : عرض تفاصيل أكثر" -ForegroundColor Gray
Write-Host "  -Interactive   : عرض تعليمات الإعداد" -ForegroundColor Gray
Write-Host "  -KeyPath path  : استخدام مفتاح SSH محدد" -ForegroundColor Gray
