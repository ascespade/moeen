# PowerShell script to optimize local development environment
Write-Host "🚀 Optimizing local development environment..." -ForegroundColor Green

# Create development directories
Write-Host "📁 Creating development directories..." -ForegroundColor Yellow
$devDirs = @(
    "$env:USERPROFILE\Development",
    "$env:USERPROFILE\Projects",
    "$env:USERPROFILE\Scripts",
    "$env:USERPROFILE\Tools"
)

foreach ($dir in $devDirs) {
    if (!(Test-Path $dir)) {
        New-Item -ItemType Directory -Path $dir -Force
        Write-Host "✅ Created: $dir" -ForegroundColor Green
    }
}

# Create SSH control directory
Write-Host "🔧 Setting up SSH control directory..." -ForegroundColor Yellow
$sshControlDir = "$env:USERPROFILE\.ssh\control"
if (!(Test-Path $sshControlDir)) {
    New-Item -ItemType Directory -Path $sshControlDir -Force
    Write-Host "✅ Created SSH control directory" -ForegroundColor Green
}

# Create useful PowerShell profile
Write-Host "⚙️ Setting up PowerShell profile..." -ForegroundColor Yellow
$profilePath = $PROFILE
$profileDir = Split-Path $profilePath -Parent

if (!(Test-Path $profileDir)) {
    New-Item -ItemType Directory -Path $profileDir -Force
}

$profileContent = @"
# Development aliases and functions
function ll { Get-ChildItem -Force | Format-Table -AutoSize }
function la { Get-ChildItem -Force -Hidden | Format-Table -AutoSize }
function grep { Select-String -Pattern `$args }
function find { Get-ChildItem -Recurse -Name "*`$args*" }
function ports { netstat -an | Select-String LISTENING }
function myip { Invoke-RestMethod -Uri "https://api.ipify.org" }

# Git aliases
function gs { git status }
function ga { git add }
function gc { git commit }
function gp { git push }
function gl { git log --oneline }
function gd { git diff }

# Docker aliases
function dps { docker ps }
function dpa { docker ps -a }
function di { docker images }
function dex { docker exec -it }

# SSH shortcuts
function ssh-cursor { ssh cursor-dev }
function ssh-cursor-bg { Start-Process -WindowStyle Hidden -FilePath "ssh" -ArgumentList "cursor-dev" }

# Development shortcuts
function dev { Set-Location "$env:USERPROFILE\Development" }
function proj { Set-Location "$env:USERPROFILE\Projects" }
function scripts { Set-Location "$env:USERPROFILE\Scripts" }

# Server monitoring
function server-status { ssh cursor-dev "~/scripts/server-monitor.sh" }
function server-backup { ssh cursor-dev "~/scripts/backup.sh" }

# Quick connection test
function test-connection { 
    Write-Host "Testing SSH connection..." -ForegroundColor Yellow
    ssh cursor-dev "echo 'Connection successful!'"
}

Write-Host "🚀 Development environment loaded!" -ForegroundColor Green
Write-Host "💡 Use 'ssh-cursor' to connect to remote server" -ForegroundColor Cyan
Write-Host "💡 Use 'server-status' to check remote server status" -ForegroundColor Cyan
"@

Set-Content -Path $profilePath -Value $profileContent -Force
Write-Host "✅ PowerShell profile updated" -ForegroundColor Green

# Create connection test script
Write-Host "🧪 Creating connection test script..." -ForegroundColor Yellow
$testScript = @"
#!/usr/bin/env python3
import subprocess
import sys
import time

def test_ssh_connection():
    """Test SSH connection to cursor-dev"""
    try:
        result = subprocess.run(
            ["ssh", "-o", "ConnectTimeout=10", "cursor-dev", "echo 'SSH_SUCCESS'"],
            capture_output=True, text=True, timeout=15
        )
        
        if result.returncode == 0 and "SSH_SUCCESS" in result.stdout:
            print("✅ SSH connection successful!")
            return True
        else:
            print(f"❌ SSH connection failed: {result.stderr}")
            return False
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

def test_tailscale():
    """Test Tailscale status"""
    try:
        result = subprocess.run(["tailscale", "status"], capture_output=True, text=True)
        if result.returncode == 0 and "cursor-dev-server" in result.stdout:
            print("✅ Tailscale connection active!")
            return True
        else:
            print("❌ Tailscale connection not active")
            return False
    except Exception as e:
        print(f"❌ Tailscale error: {e}")
        return False

def main():
    print("🔍 Testing remote development environment...")
    print("=" * 50)
    
    ssh_ok = test_ssh_connection()
    tailscale_ok = test_tailscale()
    
    print("\n📊 Results:")
    print(f"SSH Connection: {'✅ OK' if ssh_ok else '❌ FAILED'}")
    print(f"Tailscale: {'✅ OK' if tailscale_ok else '❌ FAILED'}")
    
    if ssh_ok and tailscale_ok:
        print("\n🎉 Remote development environment is ready!")
        print("💡 Use 'ssh-cursor' to connect")
        print("💡 Use 'server-status' to monitor server")
    else:
        print("\n⚠️ Some issues detected. Check configuration.")
    
    return ssh_ok and tailscale_ok

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)
"@

Set-Content -Path "$env:USERPROFILE\Scripts\test-remote-env.py" -Value $testScript -Force
Write-Host "✅ Connection test script created" -ForegroundColor Green

# Create quick setup script for new projects
Write-Host "📝 Creating project setup script..." -ForegroundColor Yellow
$projectSetup = @"
#!/usr/bin/env python3
import os
import sys
import subprocess

def create_project(project_name, project_type="node"):
    """Create a new project with proper structure"""
    
    # Create project directory
    project_path = f"$env:USERPROFILE\Projects\{project_name}"
    os.makedirs(project_path, exist_ok=True)
    
    if project_type == "node":
        # Initialize Node.js project
        os.chdir(project_path)
        subprocess.run(["npm", "init", "-y"], check=True)
        subprocess.run(["npm", "install", "typescript", "@types/node", "ts-node", "nodemon", "-D"], check=True)
        
        # Create basic structure
        os.makedirs("src", exist_ok=True)
        os.makedirs("dist", exist_ok=True)
        
        # Create tsconfig.json
        tsconfig = {
            "compilerOptions": {
                "target": "ES2020",
                "module": "commonjs",
                "outDir": "./dist",
                "rootDir": "./src",
                "strict": True,
                "esModuleInterop": True,
                "skipLibCheck": True,
                "forceConsistentCasingInFileNames": True
            },
            "include": ["src/**/*"],
            "exclude": ["node_modules", "dist"]
        }
        
        with open("tsconfig.json", "w") as f:
            import json
            json.dump(tsconfig, f, indent=2)
        
        # Create basic index.ts
        with open("src/index.ts", "w") as f:
            f.write('console.log("Hello, World!");\n')
        
        print(f"✅ Node.js project '{project_name}' created successfully!")
        
    elif project_type == "python":
        # Initialize Python project
        os.chdir(project_path)
        subprocess.run(["python", "-m", "venv", "venv"], check=True)
        
        # Create basic structure
        os.makedirs("src", exist_ok=True)
        os.makedirs("tests", exist_ok=True)
        
        # Create requirements.txt
        with open("requirements.txt", "w") as f:
            f.write("")
        
        # Create basic main.py
        with open("src/main.py", "w") as f:
            f.write('print("Hello, World!")\n')
        
        print(f"✅ Python project '{project_name}' created successfully!")
    
    print(f"📁 Project location: {project_path}")
    print("💡 Use 'cd' to navigate to the project directory")

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python create-project.py <project-name> [node|python]")
        sys.exit(1)
    
    project_name = sys.argv[1]
    project_type = sys.argv[2] if len(sys.argv) > 2 else "node"
    
    create_project(project_name, project_type)
"@

Set-Content -Path "$env:USERPROFILE\Scripts\create-project.py" -Value $projectSetup -Force
Write-Host "✅ Project setup script created" -ForegroundColor Green

Write-Host "`n🎉 Local environment optimization complete!" -ForegroundColor Green
Write-Host "📋 Summary of improvements:" -ForegroundColor Yellow
Write-Host "  - Created development directories" -ForegroundColor White
Write-Host "  - Set up SSH control directory" -ForegroundColor White
Write-Host "  - Configured PowerShell profile with aliases" -ForegroundColor White
Write-Host "  - Created connection test script" -ForegroundColor White
Write-Host "  - Created project setup script" -ForegroundColor White
Write-Host "`n💡 New commands available:" -ForegroundColor Cyan
Write-Host "  - ssh-cursor: Connect to remote server" -ForegroundColor White
Write-Host "  - server-status: Check remote server status" -ForegroundColor White
Write-Host "  - test-connection: Test SSH connection" -ForegroundColor White
Write-Host "  - dev, proj, scripts: Navigate to directories" -ForegroundColor White
Write-Host "`n🔄 Please restart PowerShell to load new profile" -ForegroundColor Yellow
