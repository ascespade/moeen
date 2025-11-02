# Client SSH Configuration for Stable Connections

## Windows SSH Client Configuration

To ensure stable SSH connections from your Windows machine, add these settings to your SSH config file.

### Location
**PowerShell/Command Prompt:**
```
%USERPROFILE%\.ssh\config
```

Or in PowerShell:
```powershell
$env:USERPROFILE\.ssh\config
```

### Recommended Settings

Create or edit the file and add:

```
Host *
    ServerAliveInterval 60
    ServerAliveCountMax 3
    TCPKeepAlive yes
    Compression yes
    ControlMaster auto
    ControlPath ~/.ssh/sockets/%r@%h-%p
    ControlPersist 600

Host your-server
    HostName SERVER_IP
    User ubuntu
    IdentityFile ~/.ssh/id_ed25519
    ServerAliveInterval 60
    ServerAliveCountMax 3
    TCPKeepAlive yes
    Compression yes
```

### Create socket directory (for connection multiplexing)
```powershell
mkdir $env:USERPROFILE\.ssh\sockets
```

### Benefits
- **ServerAliveInterval 60**: Sends keepalive packets every 60 seconds
- **ServerAliveCountMax 3**: Disconnects after 3 failed keepalive attempts
- **TCPKeepAlive yes**: Enables TCP-level keepalive
- **ControlMaster auto**: Enables connection multiplexing (reuse connections)
- **ControlPersist 600**: Keeps master connection alive for 10 minutes

### Connection Test
```powershell
ssh your-server
```

## Linux/Mac SSH Client Configuration

Add to `~/.ssh/config`:

```
Host *
    ServerAliveInterval 60
    ServerAliveCountMax 3
    TCPKeepAlive yes
    Compression yes
    ControlMaster auto
    ControlPath ~/.ssh/sockets/%r@%h-%p
    ControlPersist 600
```

Create socket directory:
```bash
mkdir -p ~/.ssh/sockets
```
