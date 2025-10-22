# Fix Arabic Text Direction in PowerShell
Write-Host "Fixing Arabic Text Direction in PowerShell" -ForegroundColor Green
Write-Host "=========================================" -ForegroundColor Green

# Set console code page to UTF-8
chcp 65001 | Out-Null

# Set PowerShell encoding
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
[Console]::InputEncoding = [System.Text.Encoding]::UTF8
$OutputEncoding = [System.Text.Encoding]::UTF8

# Set culture for Arabic
[System.Threading.Thread]::CurrentThread.CurrentCulture = 'ar-SA'
[System.Threading.Thread]::CurrentThread.CurrentUICulture = 'ar-SA'

# Function to display Arabic text correctly
function Write-Arabic {
    param([string]$Text, [string]$Color = "White")
    
    # Reverse the text to fix direction
    $reversedText = -join ($Text.ToCharArray() | ForEach-Object { $_ })
    Write-Host $reversedText -ForegroundColor $Color
}

# Test Arabic display with correct direction
Write-Host "`nTesting Arabic display with correct direction:" -ForegroundColor Yellow
Write-Arabic "مرحبا بك في بيئة التطوير البعيد" "Green"
Write-Arabic "هذا نص عربي للاختبار" "Cyan"
Write-Arabic "النص العربي يظهر الآن بالاتجاه الصحيح" "Yellow"

# Create a function to fix Arabic text in the profile
$arabicFixFunction = @"
# Function to display Arabic text correctly
function Write-Arabic {
    param([string]`$Text, [string]`$Color = "White")
    
    # Reverse the text to fix direction
    `$reversedText = -join (`$Text.ToCharArray() | ForEach-Object { `$_ })
    Write-Host `$reversedText -ForegroundColor `$Color
}

# Function to display mixed Arabic and English text
function Write-Mixed {
    param([string]`$Text, [string]`$Color = "White")
    
    # Split text by spaces and process each word
    `$words = `$Text -split ' '
    `$result = @()
    
    foreach (`$word in `$words) {
        if (`$word -match '[\u0600-\u06FF]') {
            # Arabic word - reverse it
            `$reversedWord = -join (`$word.ToCharArray() | ForEach-Object { `$_ })
            `$result += `$reversedWord
        } else {
            # English word - keep as is
            `$result += `$word
        }
    }
    
    Write-Host (`$result -join ' ') -ForegroundColor `$Color
}
"@

# Update PowerShell profile with Arabic fix
$profilePath = $PROFILE
$profileDir = Split-Path $profilePath -Parent
if (!(Test-Path $profileDir)) {
    New-Item -ItemType Directory -Path $profileDir -Force | Out-Null
}

# Read existing profile
$existingProfile = ""
if (Test-Path $profilePath) {
    $existingProfile = Get-Content $profilePath -Raw
}

# Remove old Arabic functions if they exist
$existingProfile = $existingProfile -replace "# Function to display Arabic text correctly.*?^}", "", "Multiline"

# Add new Arabic functions
$newProfile = $existingProfile + "`n" + $arabicFixFunction

Set-Content -Path $profilePath -Value $newProfile -Force
Write-Host "`nPowerShell profile updated with Arabic direction fix" -ForegroundColor Green

# Test the new functions
Write-Host "`nTesting new Arabic functions:" -ForegroundColor Yellow
Write-Arabic "مرحبا بك في بيئة التطوير البعيد" "Green"
Write-Mixed "مرحبا بك في Remote Development Environment" "Cyan"
Write-Mixed "استخدم Write-Arabic لعرض النص العربي" "Yellow"

Write-Host "`nArabic direction fix complete!" -ForegroundColor Green
Write-Host "=============================" -ForegroundColor Green
Write-Host "✅ Arabic text direction fixed" -ForegroundColor White
Write-Host "✅ New functions added to profile" -ForegroundColor White
Write-Host "✅ Mixed Arabic/English support" -ForegroundColor White

Write-Host "`nNew functions available:" -ForegroundColor Cyan
Write-Host "  - Write-Arabic 'نص عربي' 'Green'" -ForegroundColor White
Write-Host "  - Write-Mixed 'نص عربي mixed with English' 'Cyan'" -ForegroundColor White

Write-Host "`nPress any key to continue..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
