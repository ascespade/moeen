# إعداد SSH Config لـ Cursor IDE
# Setup SSH Config for Cursor IDE

param(
    [switch]$Force,
    [switch]$Backup,
    [switch]$Test,
    [switch]$Help
)

$SSH_DIR = Join-Path $env:USERPROFILE ".ssh"
$SSH_CONFIG = Join-Path $SSH_DIR "config"
$TEMPLATE_FILE = "ssh_config_template"

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
    Write-Host "🔧 إعداد SSH Config لـ Cursor IDE" -ForegroundColor Magenta
    Write-Host "===============================" -ForegroundColor Magenta
    Write-Host
    Write-Host "الاستخدام:" -ForegroundColor Yellow
    Write-Host "  .\setup_cursor_ssh.ps1           # إعداد عادي"
    Write-Host "  .\setup_cursor_ssh.ps1 -Force    # إعادة كتابة الملف"
    Write-Host "  .\setup_cursor_ssh.ps1 -Backup   # عمل نسخة احتياطية"
    Write-Host "  .\setup_cursor_ssh.ps1 -Test     # اختبار الإعداد"
    Write-Host
    Write-Host "بعد الإعداد يمكنك استخدام:" -ForegroundColor Yellow
    Write-Host "  ssh cursor-dev    # للاتصال بسيرفر Cursor"
    Write-Host "  ssh aws-jump      # للاتصال بسيرفر Amazon"
    Write-Host
    exit 0
}

Write-Host "🔧 إعداد SSH Config لـ Cursor IDE" -ForegroundColor Magenta
Write-Host "===============================" -ForegroundColor Magenta
Write-Host

# Check if template exists
if (-not (Test-Path $TEMPLATE_FILE)) {
    Write-Status "ملف القالب غير موجود: $TEMPLATE_FILE" "Error"
    exit 1
}

# Create .ssh directory if it doesn't exist
if (-not (Test-Path $SSH_DIR)) {
    Write-Status "إنشاء مجلد SSH..." "Info"
    New-Item -ItemType Directory -Path $SSH_DIR -Force | Out-Null
    Write-Status "تم إنشاء مجلد: $SSH_DIR" "Success"
}

# Backup existing config if requested
if ($Backup -and (Test-Path $SSH_CONFIG)) {
    $backupFile = "$SSH_CONFIG.backup.$(Get-Date -Format 'yyyyMMdd_HHmmss')"
    Write-Status "عمل نسخة احتياطية..." "Info"
    Copy-Item $SSH_CONFIG $backupFile
    Write-Status "تم حفظ النسخة الاحتياطية: $backupFile" "Success"
}

# Check if config already exists
if ((Test-Path $SSH_CONFIG) -and -not $Force) {
    Write-Status "ملف SSH config موجود بالفعل" "Warning"
    Write-Status "المسار: $SSH_CONFIG" "Info"
    
    $overwrite = Read-Host "هل تريد إضافة الإعدادات للملف الموجود؟ (y/N)"
    if ($overwrite -notmatch "^[Yy]$") {
        Write-Status "تم إلغاء العملية" "Info"
        Write-Status "استخدم -Force لإعادة كتابة الملف" "Info"
        exit 0
    }
    
    # Append to existing file
    Write-Status "إضافة الإعدادات للملف الموجود..." "Info"
    $existingContent = Get-Content $SSH_CONFIG -Raw
    $templateContent = Get-Content $TEMPLATE_FILE -Raw
    
    # Check if our config already exists
    if ($existingContent -match "cursor-dev|aws-jump") {
        Write-Status "الإعدادات موجودة بالفعل في الملف" "Warning"
        $replace = Read-Host "هل تريد استبدال الإعدادات الموجودة؟ (y/N)"
        if ($replace -match "^[Yy]$") {
            # Remove existing entries and add new ones
            $cleanContent = $existingContent -replace "(?s)# Cursor Development Server.*?# اختصار للاتصال السريع بـ AWS[^\r\n]*", ""
            $newContent = $cleanContent + "`n`n" + $templateContent
            $newContent | Out-File -FilePath $SSH_CONFIG -Encoding UTF8
            Write-Status "تم استبدال الإعدادات" "Success"
        } else {
            Write-Status "تم الاحتفاظ بالإعدادات الموجودة" "Info"
        }
    } else {
        # Append new config
        $newContent = $existingContent + "`n`n" + $templateContent
        $newContent | Out-File -FilePath $SSH_CONFIG -Encoding UTF8
        Write-Status "تم إضافة الإعدادات الجديدة" "Success"
    }
} else {
    # Create new config file
    Write-Status "إنشاء ملف SSH config جديد..." "Info"
    Copy-Item $TEMPLATE_FILE $SSH_CONFIG
    Write-Status "تم إنشاء الملف: $SSH_CONFIG" "Success"
}

# Set proper permissions (Windows)
try {
    $acl = Get-Acl $SSH_CONFIG
    $acl.SetAccessRuleProtection($true, $false)
    $accessRule = New-Object System.Security.AccessControl.FileSystemAccessRule($env:USERNAME, "FullControl", "Allow")
    $acl.SetAccessRule($accessRule)
    Set-Acl $SSH_CONFIG $acl
    Write-Status "تم تعيين صلاحيات الملف" "Success"
} catch {
    Write-Status "تحذير: لم يتم تعيين صلاحيات الملف" "Warning"
}

if ($Test) {
    Write-Status "اختبار الإعدادات..." "Header"
    
    # Test SSH config syntax
    try {
        $testResult = & ssh -F $SSH_CONFIG -T cursor-dev 2>&1
        Write-Status "تم اختبار إعدادات cursor-dev" "Info"
    } catch {
        Write-Status "خطأ في اختبار cursor-dev" "Warning"
    }
    
    try {
        $testResult = & ssh -F $SSH_CONFIG -T aws-jump 2>&1  
        Write-Status "تم اختبار إعدادات aws-jump" "Info"
    } catch {
        Write-Status "خطأ في اختبار aws-jump" "Warning"
    }
}

Write-Host
Write-Status "تم إكمال الإعداد بنجاح! 🎉" "Success"
Write-Host
Write-Status "الآن يمكنك استخدام:" "Header"
Write-Host "  📌 في Terminal:" -ForegroundColor Yellow
Write-Host "     ssh cursor-dev" -ForegroundColor Green
Write-Host "     ssh aws-jump" -ForegroundColor Green
Write-Host
Write-Host "  📌 في Cursor IDE:" -ForegroundColor Yellow
Write-Host "     Ctrl+Shift+P -> Remote-SSH: Connect to Host" -ForegroundColor Green
Write-Host "     اختر: cursor-dev أو aws-jump" -ForegroundColor Green
Write-Host
Write-Host "  📌 اختبار الاتصال:" -ForegroundColor Yellow
Write-Host "     .\connect_cursor.ps1 -Test" -ForegroundColor Green
Write-Host "     .\connect_aws.ps1 -Test" -ForegroundColor Green
Write-Host

# Show next steps
Write-Status "الخطوات التالية:" "Info"
Write-Host "  1. افتح Cursor IDE" -ForegroundColor Gray
Write-Host "  2. ثبت Remote-SSH extension" -ForegroundColor Gray
Write-Host "  3. اضغط Ctrl+Shift+P" -ForegroundColor Gray
Write-Host "  4. اكتب Remote-SSH: Connect to Host" -ForegroundColor Gray
Write-Host "  5. اختر cursor-dev أو aws-jump" -ForegroundColor Gray
Write-Host "  6. ابدأ التطوير! 🚀" -ForegroundColor Gray
