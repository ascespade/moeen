# SSH Key Setup Instructions

## Overview
SSH server has been configured to use key-based authentication only. Password authentication has been disabled for security.

## Setting Up SSH Keys (Windows)

### Step 1: Generate SSH Key Pair (if needed)

Open PowerShell or Command Prompt on your Windows machine and run:

```powershell
ssh-keygen -t ed25519 -C "your_email@example.com"
```

- Press Enter to accept the default location (`C:\Users\YourUsername\.ssh\id_ed25519`)
- Optionally set a passphrase for additional security

### Step 2: Copy Your Public Key

Display your public key:

**PowerShell:**
```powershell
Get-Content ~\.ssh\id_ed25519.pub
```

**Command Prompt:**
```cmd
type %USERPROFILE%\.ssh\id_ed25519.pub
```

### Step 3: Add Public Key to Server

You have two options:

#### Option A: Using the setup script (if SSH password access is still temporarily enabled)

```bash
# Connect to server
ssh ubuntu@SERVER_IP

# Run the setup script
bash /workspace/setup-ssh-keys.sh

# Follow the prompts to paste your public key
```

#### Option B: Manual method

```bash
# Connect to server (use password temporarily if needed)
ssh ubuntu@SERVER_IP

# Add your public key
echo "YOUR_PUBLIC_KEY_HERE" >> ~/.ssh/authorized_keys
chmod 600 ~/.ssh/authorized_keys
```

### Step 4: Test Passwordless Connection

From your Windows machine:

```powershell
ssh ubuntu@SERVER_IP
```

You should be able to connect without entering a password.

## Current Configuration

- **SSH Port:** 22
- **Password Authentication:** Disabled
- **Key-based Authentication:** Enabled
- **Root Login:** Prohibited (key-based only)

## Troubleshooting

### Permission Issues
Ensure correct permissions:
```bash
chmod 700 ~/.ssh
chmod 600 ~/.ssh/authorized_keys
```

### Key Not Working
1. Verify the public key is correctly added to `~/.ssh/authorized_keys`
2. Check SSH logs: `sudo tail -f /var/log/auth.log`
3. Verify SSH server is running: `ps aux | grep sshd`

### Still Asking for Password
1. Ensure `PasswordAuthentication no` is set in `/etc/ssh/sshd_config`
2. Restart SSH daemon if config was changed
3. Check that your private key is in the correct location on Windows
