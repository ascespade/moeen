# SSH Connection Setup Guide for 100.121.114.88

## 📋 Current Status

- **SSH Public Key**: `ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIP9WHNpdBUMs2YgYfY8yzsTVo8KcK2xjaR+sDuyWKNjr auto-generated`
- **Remote Server**: `ubuntu@100.121.114.88`
- **Status**: Connection timeout (Tailscale not connected)

## 🚀 Setup Steps

### Step 1: Connect Tailscale (Required First)

```bash
# Option A: Run the quick setup (recommended)
sudo /workspace/quick-connect-setup.sh

# Option B: Run Tailscale setup only
sudo /workspace/setup-tailscale-triple-protection.sh

# Option C: Manual Tailscale connection
TAILSCALE_API_KEY="tskey-auth-krGK3xvj3v11CNTRL-MRcHuLN5JWEiGSMsLvxGVE14RCQw66uCX"
echo "$TAILSCALE_API_KEY" | tailscale up --authkey -
```

### Step 2: Add SSH Key to Remote Server

Once Tailscale is connected, add the key:

**Method 1: One-liner (requires password once)**
```bash
ssh ubuntu@100.121.114.88 'mkdir -p ~/.ssh && echo "ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIP9WHNpdBUMs2YgYfY8yzsTVo8KcK2xjaR+sDuyWKNjr auto-generated" >> ~/.ssh/authorized_keys && chmod 600 ~/.ssh/authorized_keys && chmod 700 ~/.ssh'
```

**Method 2: Manual steps**
```bash
# SSH to the server (with password)
ssh ubuntu@100.121.114.88

# Once connected, run:
mkdir -p ~/.ssh
echo 'ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIP9WHNpdBUMs2YgYfY8yzsTVo8KcK2xjaR+sDuyWKNjr auto-generated' >> ~/.ssh/authorized_keys
chmod 600 ~/.ssh/authorized_keys
chmod 700 ~/.ssh
exit
```

**Method 3: Use the helper script**
```bash
/workspace/add-key-to-100.121.114.88.sh
```

### Step 3: Test Connection

```bash
ssh ubuntu@100.121.114.88
```

If successful, you should connect without a password!

## 🔧 Troubleshooting

### Connection Timeout
- **Cause**: Tailscale not connected
- **Solution**: Run `sudo /workspace/setup-tailscale-triple-protection.sh`

### Permission Denied
- **Cause**: SSH key not added to remote server
- **Solution**: Run Step 2 above

### Key Already Added
- If you see "key is already in authorized_keys", you're good to go!

## 📝 Quick Reference

### Your SSH Public Key
```
ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIP9WHNpdBUMs2YgYfY8yzsTVo8KcK2xjaR+sDuyWKNjr auto-generated
```

### Remote Server
```
ubuntu@100.121.114.88
```

### Tailscale API Key
```
tskey-auth-krGK3xvj3v11CNTRL-MRcHuLN5JWEiGSMsLvxGVE14RCQw66uCX
```

## ✅ Verification Checklist

- [ ] Tailscale is connected: `tailscale status`
- [ ] SSH key is added to remote server
- [ ] Can connect without password: `ssh ubuntu@100.121.114.88`
- [ ] Tailscale protection is active: `ps aux | grep tailscale`

## 🛠️ Helper Scripts

- `/workspace/quick-connect-setup.sh` - Full automated setup
- `/workspace/add-key-to-100.121.114.88.sh` - Add key to specific server
- `/workspace/setup-tailscale-triple-protection.sh` - Setup Tailscale protection
- `/workspace/setup-ssh-server.sh` - Configure SSH server

---

**Next Steps**:**
1. Run `sudo /workspace/setup-tailscale-triple-protection.sh` to connect Tailscale
2. Add the SSH key using one of the methods above
3. Test connection: `ssh ubuntu@100.121.114.88`
