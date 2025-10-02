# SSH Key Setup Wizard for EC2 - PowerShell Version
# Author: Moeen's Smart Assistant
# Description: Automatically generates SSH keys and sets up secure access to EC2 instances

param(
    [string]$EC2Host,
    [string]$EC2User = "ubuntu",
    [string]$PemKeyPath
)

# Colors for PowerShell
$colors = @{
    Info = "Cyan"
    Success = "Green"
    Warning = "Yellow"
    Error = "Red"
    Header = "Magenta"
}

function Write-ColorOutput {
    param(
        [string]$Message,
        [string]$Type = "Info"
    )
    
    $prefix = switch ($Type) {
        "Info" { "[ℹ]" }
        "Success" { "[✓]" }
        "Warning" { "[⚠]" }
        "Error" { "[✗]" }
        "Header" { "[🔧]" }
    }
    
    Write-Host "$prefix $Message" -ForegroundColor $colors[$Type]
}

function Test-HostFormat {
    param([string]$Host)
    
    if ([string]::IsNullOrEmpty($Host)) {
        return $false
    }
    
    # Test IP format
    $ipRegex = "^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$"
    if ($Host -match $ipRegex) {
        return $true
    }
    
    # Test domain format
    $domainRegex = "^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"
    if ($Host -match $domainRegex) {
        return $true
    }
    
    # Test AWS EC2 format
    $awsRegex = "^ec2-[0-9-]+\..*\.amazonaws\.com$"
    if ($Host -match $awsRegex) {
        return $true
    }
    
    return $false
}

function Test-PemFile {
    param([string]$FilePath)
    
    if (-not (Test-Path $FilePath)) {
        Write-ColorOutput "PEM file not found: $FilePath" "Error"
        return $false
    }
    
    if (-not (Get-Item $FilePath).PSIsContainer -eq $false) {
        Write-ColorOutput "Path is not a file: $FilePath" "Error"
        return $false
    }
    
    $content = Get-Content $FilePath -Raw -ErrorAction SilentlyContinue
    if ($content -notmatch "BEGIN.*PRIVATE KEY") {
        Write-ColorOutput "File doesn't appear to be a valid PEM key file" "Warning"
        $continue = Read-Host "Continue anyway? (y/N)"
        if ($continue -notmatch "^[Yy]$") {
            return $false
        }
    }
    
    return $true
}

function Test-SSHConnection {
    param(
        [string]$KeyPath,
        [string]$User,
        [string]$Host,
        [int]$Timeout = 10
    )
    
    $sshArgs = @(
        "-i", $KeyPath,
        "-o", "StrictHostKeyChecking=no",
        "-o", "ConnectTimeout=$Timeout",
        "-o", "BatchMode=yes",
        "$User@$Host",
        "echo 'Connection successful'"
    )
    
    try {
        $result = & ssh @sshArgs 2>$null
        return $result -eq "Connection successful"
    }
    catch {
        return $false
    }
}

# Main script starts here
Clear-Host
Write-Host "╔══════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║                🔐 SSH Key Setup Wizard 🔐                ║" -ForegroundColor Cyan
Write-Host "║              Smart EC2 Access Configuration              ║" -ForegroundColor Cyan
Write-Host "╚══════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host

# Check if SSH is available
Write-ColorOutput "Checking required tools..." "Info"
try {
    $null = Get-Command ssh -ErrorAction Stop
    $null = Get-Command ssh-keygen -ErrorAction Stop
    Write-ColorOutput "All required tools are available" "Success"
}
catch {
    Write-ColorOutput "SSH tools not found. Please install OpenSSH or Git for Windows" "Error"
    Write-ColorOutput "You can install OpenSSH via: Add-WindowsCapability -Online -Name OpenSSH.Client~~~~0.0.1.0" "Info"
    exit 1
}

# Step 1: Get EC2 connection details
Write-Host
Write-ColorOutput "Step 1: EC2 Connection Details" "Header"

if (-not $EC2Host) {
    do {
        $EC2Host = Read-Host "Enter EC2 public DNS or IP"
        if (Test-HostFormat $EC2Host) {
            Write-ColorOutput "Valid host: $EC2Host" "Success"
            break
        }
        else {
            Write-ColorOutput "Invalid host format. Please enter a valid IP address or DNS name" "Error"
        }
    } while ($true)
}

if (-not $EC2User) {
    $inputUser = Read-Host "Enter EC2 username [default: ubuntu]"
    if ($inputUser) { $EC2User = $inputUser }
}
Write-ColorOutput "Using username: $EC2User" "Info"

if (-not $PemKeyPath) {
    do {
        $PemKeyPath = Read-Host "Enter path to EC2 .pem key (e.g. D:\vm\my-dev-key.pem)"
        if (Test-PemFile $PemKeyPath) {
            Write-ColorOutput "PEM file validated: $PemKeyPath" "Success"
            break
        }
        else {
            Write-ColorOutput "Please provide a valid PEM file path" "Error"
        }
    } while ($true)
}

# Step 2: Setup SSH directory and generate key
Write-Host
Write-ColorOutput "Step 2: SSH Key Generation" "Header"

$sshDir = Join-Path $env:USERPROFILE ".ssh"
$keyName = "id_ed25519_cursor_$(Get-Date -Format 'yyyyMMdd_HHmmss')"
$keyPath = Join-Path $sshDir $keyName

Write-ColorOutput "Creating SSH directory if needed..." "Info"
if (-not (Test-Path $sshDir)) {
    New-Item -ItemType Directory -Path $sshDir -Force | Out-Null
}

Write-ColorOutput "Generating new SSH key at $keyPath" "Info"
$comment = "cursor-ec2-access-$(Get-Date -Format 'yyyyMMdd')"
$sshKeyGenArgs = @(
    "-t", "ed25519",
    "-f", $keyPath,
    "-N", '""',
    "-C", $comment
)

try {
    $result = & ssh-keygen @sshKeyGenArgs 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-ColorOutput "SSH key pair generated successfully" "Success"
    }
    else {
        Write-ColorOutput "Failed to generate SSH key: $result" "Error"
        exit 1
    }
}
catch {
    Write-ColorOutput "Failed to generate SSH key: $($_.Exception.Message)" "Error"
    exit 1
}

# Step 3: Test initial connection to EC2
Write-Host
Write-ColorOutput "Step 3: Testing EC2 Connection" "Header"
Write-ColorOutput "Testing connection to $EC2User@$EC2Host using PEM key..." "Info"

if (Test-SSHConnection -KeyPath $PemKeyPath -User $EC2User -Host $EC2Host) {
    Write-ColorOutput "EC2 connection verified" "Success"
}
else {
    Write-ColorOutput "Cannot connect to EC2 instance. Please check:" "Error"
    Write-ColorOutput "  - Host address: $EC2Host" "Error"
    Write-ColorOutput "  - Username: $EC2User" "Error"
    Write-ColorOutput "  - PEM key: $PemKeyPath" "Error"
    Write-ColorOutput "  - Security groups allow SSH (port 22)" "Error"
    exit 1
}

# Step 4: Copy public key to EC2
Write-Host
Write-ColorOutput "Step 4: Installing Public Key on EC2" "Header"
$pubKeyPath = "$keyPath.pub"
$pubKey = Get-Content $pubKeyPath -Raw
Write-ColorOutput "Copying public key to $EC2User@$EC2Host" "Info"

$remoteCommands = @"
mkdir -p ~/.ssh && 
chmod 700 ~/.ssh && 
echo '$pubKey' >> ~/.ssh/authorized_keys && 
chmod 600 ~/.ssh/authorized_keys &&
sort ~/.ssh/authorized_keys | uniq > ~/.ssh/authorized_keys.tmp &&
mv ~/.ssh/authorized_keys.tmp ~/.ssh/authorized_keys &&
echo 'Public key installed successfully'
"@

$sshArgs = @(
    "-i", $PemKeyPath,
    "-o", "StrictHostKeyChecking=no",
    "$EC2User@$EC2Host",
    $remoteCommands
)

try {
    $result = & ssh @sshArgs 2>&1
    if ($result -match "Public key installed successfully") {
        Write-ColorOutput "Public key copied to EC2 instance" "Success"
    }
    else {
        Write-ColorOutput "Failed to copy public key to EC2: $result" "Error"
        exit 1
    }
}
catch {
    Write-ColorOutput "Failed to copy public key to EC2: $($_.Exception.Message)" "Error"
    exit 1
}

# Step 5: Test new SSH connection
Write-Host
Write-ColorOutput "Step 5: Testing New SSH Key" "Header"
Write-ColorOutput "Testing connection with new SSH key..." "Info"

$testArgs = @(
    "-i", $keyPath,
    "-o", "StrictHostKeyChecking=no",
    "-o", "ConnectTimeout=10",
    "$EC2User@$EC2Host",
    "echo '🎉 New SSH key works perfectly! Connected successfully.'"
)

try {
    $result = & ssh @testArgs 2>$null
    if ($result -match "New SSH key works perfectly") {
        Write-ColorOutput "New SSH key authentication successful!" "Success"
    }
    else {
        Write-ColorOutput "New SSH key authentication failed" "Error"
        Write-ColorOutput "The key was copied but authentication isn't working" "Warning"
        exit 1
    }
}
catch {
    Write-ColorOutput "New SSH key authentication failed: $($_.Exception.Message)" "Error"
    exit 1
}

# Step 6: Create SSH config entry (optional)
Write-Host
Write-ColorOutput "Step 6: SSH Configuration (Optional)" "Header"
$createConfig = Read-Host "Create SSH config entry for easy access? (Y/n)"
if ($createConfig -notmatch "^[Nn]$") {
    $sshAlias = Read-Host "Enter a short name for this connection [default: ec2-cursor]"
    if (-not $sshAlias) { $sshAlias = "ec2-cursor" }
    
    $sshConfig = Join-Path $sshDir "config"
    Write-ColorOutput "Adding entry to SSH config: $sshConfig" "Info"
    
    $configEntry = @"

# Generated by SSH Setup Wizard - $(Get-Date)
Host $sshAlias
    HostName $EC2Host
    User $EC2User
    IdentityFile $keyPath
    StrictHostKeyChecking no
    ServerAliveInterval 60
    ServerAliveCountMax 3
"@
    
    Add-Content -Path $sshConfig -Value $configEntry
    Write-ColorOutput "SSH config entry created" "Success"
    Write-ColorOutput "You can now connect using: ssh $sshAlias" "Info"
}

# Final summary
Write-Host
Write-Host "╔══════════════════════════════════════════════════════════╗" -ForegroundColor Green
Write-Host "║                    🎉 Setup Complete! 🎉                 ║" -ForegroundColor Green
Write-Host "╚══════════════════════════════════════════════════════════╝" -ForegroundColor Green
Write-Host

Write-ColorOutput "SSH key setup completed successfully!" "Success"
Write-Host

Write-Host "📁 Key Files:" -ForegroundColor Yellow
Write-Host "   Private key: " -NoNewline -ForegroundColor White
Write-Host $keyPath -ForegroundColor Cyan
Write-Host "   Public key:  " -NoNewline -ForegroundColor White
Write-Host "$keyPath.pub" -ForegroundColor Cyan
Write-Host

Write-Host "🔗 Connection Commands:" -ForegroundColor Yellow
Write-Host "   Direct:      " -NoNewline -ForegroundColor White
Write-Host "ssh -i `"$keyPath`" $EC2User@$EC2Host" -ForegroundColor Green
if ($createConfig -notmatch "^[Nn]$") {
    Write-Host "   Via config:  " -NoNewline -ForegroundColor White
    Write-Host "ssh $sshAlias" -ForegroundColor Green
}
Write-Host

Write-Host "💡 Tips:" -ForegroundColor Yellow
Write-Host "   • Keep your private key secure and never share it" -ForegroundColor White
Write-Host "   • The old PEM key is still valid if you need it" -ForegroundColor White
Write-Host "   • You can add this key to multiple EC2 instances" -ForegroundColor White
Write-Host "   • Use " -NoNewline -ForegroundColor White
Write-Host "ssh-add `"$keyPath`"" -NoNewline -ForegroundColor Cyan
Write-Host " to add key to SSH agent" -ForegroundColor White
Write-Host

Write-ColorOutput "Happy coding! 🚀" "Success"
