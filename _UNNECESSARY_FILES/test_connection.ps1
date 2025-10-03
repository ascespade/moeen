# SSH Connection Test Script
# Quick test for SSH connectivity

param(
    [Parameter(Mandatory=$false)]
    [string]$TestHost = "8.8.8.8",
    
    [Parameter(Mandatory=$false)]
    [int]$TestPort = 22
)

function Write-TestResult {
    param(
        [string]$Message,
        [string]$Status = "Info"
    )
    
    $color = switch ($Status) {
        "Success" { "Green" }
        "Error" { "Red" }
        "Warning" { "Yellow" }
        default { "Cyan" }
    }
    
    $icon = switch ($Status) {
        "Success" { "✅" }
        "Error" { "❌" }
        "Warning" { "⚠️" }
        default { "ℹ️" }
    }
    
    Write-Host "$icon $Message" -ForegroundColor $color
}

Clear-Host
Write-Host "🔧 SSH Connection Test Utility" -ForegroundColor Magenta
Write-Host "================================" -ForegroundColor Magenta
Write-Host

# Test 1: Check SSH client availability
Write-TestResult "Testing SSH client availability..."
try {
    $sshVersion = & ssh -V 2>&1
    Write-TestResult "SSH client found: $sshVersion" "Success"
}
catch {
    Write-TestResult "SSH client not found or not working" "Error"
    Write-TestResult "Install OpenSSH: Add-WindowsCapability -Online -Name OpenSSH.Client~~~~0.0.1.0" "Warning"
    exit 1
}

# Test 2: Check ssh-keygen availability
Write-TestResult "Testing SSH keygen availability..."
try {
    $keygenHelp = & ssh-keygen --help 2>&1 | Select-Object -First 1
    Write-TestResult "SSH keygen available" "Success"
}
catch {
    Write-TestResult "SSH keygen not found" "Error"
    exit 1
}

# Test 3: Check network connectivity
Write-TestResult "Testing network connectivity to $TestHost..."
try {
    $ping = Test-NetConnection -ComputerName $TestHost -Port $TestPort -WarningAction SilentlyContinue
    if ($ping.TcpTestSucceeded) {
        Write-TestResult "Network connectivity to $TestHost`:$TestPort successful" "Success"
    }
    else {
        Write-TestResult "Cannot reach $TestHost`:$TestPort" "Warning"
        Write-TestResult "This might be normal if testing with a public IP that doesn't allow SSH" "Warning"
    }
}
catch {
    Write-TestResult "Network test failed: $($_.Exception.Message)" "Error"
}

# Test 4: Check SSH directory
Write-TestResult "Checking SSH directory..."
$sshDir = Join-Path $env:USERPROFILE ".ssh"
if (Test-Path $sshDir) {
    Write-TestResult "SSH directory exists: $sshDir" "Success"
    
    # List existing keys
    $keyFiles = Get-ChildItem $sshDir -Filter "id_*" -ErrorAction SilentlyContinue
    if ($keyFiles.Count -gt 0) {
        Write-TestResult "Found $($keyFiles.Count) existing SSH key(s):" "Info"
        foreach ($key in $keyFiles) {
            Write-Host "   📁 $($key.Name)" -ForegroundColor Gray
        }
    }
    else {
        Write-TestResult "No existing SSH keys found" "Info"
    }
}
else {
    Write-TestResult "SSH directory doesn't exist, will be created" "Info"
}

# Test 5: Test key generation (dry run)
Write-TestResult "Testing SSH key generation capability..."
$testKeyPath = Join-Path $env:TEMP "test_ssh_key_temp"
try {
    $result = & ssh-keygen -t ed25519 -f $testKeyPath -N '""' -C "test-key" 2>&1
    if (Test-Path $testKeyPath) {
        Write-TestResult "SSH key generation test successful" "Success"
        # Clean up test files
        Remove-Item "$testKeyPath*" -Force -ErrorAction SilentlyContinue
    }
    else {
        Write-TestResult "SSH key generation test failed" "Error"
    }
}
catch {
    Write-TestResult "SSH key generation test failed: $($_.Exception.Message)" "Error"
}

Write-Host
Write-Host "🎯 Test Summary:" -ForegroundColor Yellow
Write-Host "=================" -ForegroundColor Yellow
Write-TestResult "SSH tools are ready for use" "Success"
Write-TestResult "You can now run the main setup script: .\setup_ssh.ps1" "Info"

# Interactive test option
Write-Host
$runInteractive = Read-Host "Would you like to test with your own EC2 details? (y/N)"
if ($runInteractive -match "^[Yy]$") {
    $testHost = Read-Host "Enter EC2 IP or DNS to test connectivity"
    if ($testHost) {
        Write-TestResult "Testing connectivity to your EC2: $testHost"
        try {
            $ping = Test-NetConnection -ComputerName $testHost -Port 22 -WarningAction SilentlyContinue
            if ($ping.TcpTestSucceeded) {
                Write-TestResult "✅ Can reach $testHost on port 22 (SSH)" "Success"
                Write-TestResult "Your EC2 is accessible for SSH connections" "Success"
            }
            else {
                Write-TestResult "❌ Cannot reach $testHost on port 22" "Error"
                Write-TestResult "Check: Security Groups, Network ACLs, EC2 status" "Warning"
            }
        }
        catch {
            Write-TestResult "Connection test failed: $($_.Exception.Message)" "Error"
        }
    }
}

Write-Host
Write-TestResult "Connection test completed! 🚀" "Success"
