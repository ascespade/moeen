# Windows Remote Desktop Configuration for Stable Connections

## Recommended Settings

### Connection Settings

1. **Open Remote Desktop Connection** (mstsc.exe)

2. **Click "Show Options"**

3. **Performance Tab:**
   - Connection speed: Select appropriate for your connection
   - Enable: "Persistent bitmap caching" ✓
   - Enable: "Reconnect if the connection is dropped" ✓

4. **Advanced Tab:**
   - Server authentication: "Warn me" or "Always connect"
   - Quality settings: Adjust based on your bandwidth

### Registry Settings (for advanced users)

Open Registry Editor (regedit.exe) and navigate to:
```
HKEY_CURRENT_USER\Software\Microsoft\Terminal Server Client
```

Recommended values:
- **DisableCursorShadow** (DWORD): 1 (for better performance)
- **DisableCursorBlinking** (DWORD): 1 (optional)

### Connection File (.rdp)

Save connection settings to a .rdp file with these settings:

```
screen mode id:i:2
use multimon:i:0
desktopwidth:i:1920
desktopheight:i:1080
session bpp:i:32
winposstr:s:0,1,0,0,800,600
compression:i:1
keyboardhook:i:2
audiocapturemode:i:0
videoplaybackmode:i:1
connection type:i:7
networkautodetect:i:1
bandwidthautodetect:i:1
enablecredsspsupport:i:1
autoreconnection enabled:i:1
authentication level:i:2
redirectclipboard:i:1
redirectposdevices:i:0
redirectprinters:i:1
redirectcomports:i:0
redirectsmartcards:i:1
redirectwebauthn:i:1
redirectdrives:i:1
```

### Key Settings for Stability:
- **autoreconnection enabled:i:1** - Automatic reconnection
- **compression:i:1** - Enable compression
- **bandwidthautodetect:i:1** - Auto-detect bandwidth

### Reconnection Tips

If connection drops:
1. Wait a few seconds before reconnecting
2. The server keeps sessions alive for 10 minutes
3. Use the same username to reconnect to existing session

### Troubleshooting

**Connection keeps dropping:**
- Check network stability
- Increase keepalive settings on server
- Use wired connection instead of WiFi

**Slow performance:**
- Reduce color depth (16-bit instead of 32-bit)
- Disable wallpaper and visual effects
- Lower resolution temporarily
