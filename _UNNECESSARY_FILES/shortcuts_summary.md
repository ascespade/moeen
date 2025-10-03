# 🚀 Bidirectional Connection Shortcuts Summary

## 📱 From Local Machine (Cursor) → Jumper Server

### Quick Commands:
- `jumper` - Connect to jumper server
- `j` - Quick connect to jumper
- `jumper-cmd "command"` - Execute command on jumper
- `jumper-send "file" "path"` - Send file to jumper
- `jumper-get "file" "path"` - Get file from jumper

### Examples:
```powershell
# Connect to jumper
jumper

# Quick connect
j

# Execute command on jumper
jumper-cmd "ls -la"
jumper-cmd "pwd"

# File transfers
jumper-send "myfile.txt" "~/documents/"
jumper-get "~/logs/app.log" "./"
```

## 🖥️ From Jumper Server → Cursor Machine

### Quick Commands:
- `cursor` - Connect to cursor machine
- `c` - Quick connect to cursor
- `cursor-cmd "command"` - Execute command on cursor
- `cursor-send "file" "path"` - Send file to cursor
- `cursor-get "file" "path"` - Get file from cursor

### Examples:
```bash
# Connect to cursor machine
cursor

# Quick connect
c

# Execute command on cursor
cursor-cmd "dir"
cursor-cmd "Get-Date"

# File transfers
cursor-send "server-file.txt" "~/Desktop/"
cursor-get "~/Documents/local-file.txt" "./"
```

## 💻 Local Cursor Machine Shortcuts

### Quick Commands:
- `cursor-local` - Open new PowerShell session
- `cl` - Quick new terminal
- `cursor-admin` - Open PowerShell as Administrator
- `cursor-cmd "command"` - Execute command locally
- `cursor-here` - Open PowerShell in current directory
- `cursor-explore` - Open File Explorer
- `cursor-vscode` - Open VS Code

### Examples:
```powershell
# Local operations
cursor-cmd "Get-Date"
cursor-cmd "ls"
cursor-here
cursor-explore
cursor-vscode
```

## 🔧 Setup Files Created:

1. **PowerShell Profile**: `C:\Users\ASCE\Documents\PowerShell\Microsoft.PowerShell_profile.ps1`
2. **SSH Config**: `C:\Users\ASCE\.ssh\config`
3. **Server Shortcuts**: `~/.cursor_shortcuts.sh` (on jumper server)
4. **SSH Server Setup**: `setup_ssh_server.ps1` (for reverse connections)

## ✅ Status:
- ✅ Local → Jumper shortcuts: **Working**
- ✅ Local machine shortcuts: **Working**
- ⚠️ Jumper → Cursor shortcuts: **Created** (requires SSH server setup)

## 🎯 Usage:
Just type the shortcut name in terminal and hit Enter!
