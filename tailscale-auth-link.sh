#!/bin/bash
# Get Tailscale Authentication Link
# الحصول على رابط مصادقة Tailscale

echo "╔══════════════════════════════════════════════════════════╗"
echo "║  🔗 TAILSCALE AUTHENTICATION LINK                      ║"
echo "╚══════════════════════════════════════════════════════════╝"
echo ""

# Check if already authenticated
if tailscale status &>/dev/null; then
    echo "✅ Tailscale is already authenticated!"
    echo ""
    echo "📊 Current Status:"
    tailscale status
    echo ""
    echo "🌐 Your Tailscale IP:"
    tailscale ip -4
    exit 0
fi

echo "📋 Generating authentication link..."
echo ""

# Method 1: Try to get link from tailscale up
echo "═══════════════════════════════════════════════════════════"
echo "🔗 METHOD 1: Direct Link"
echo "═══════════════════════════════════════════════════════════"
echo ""

# Run tailscale up and capture output
AUTH_OUTPUT=$(timeout 15 sudo tailscale up 2>&1 || true)

# Extract URL
AUTH_URL=$(echo "$AUTH_OUTPUT" | grep -oE 'https://[^[:space:]]+[^[:punct:]]' | head -1)

if [ -n "$AUTH_URL" ]; then
    echo "✅ Authentication link found:"
    echo ""
    echo "   $AUTH_URL"
    echo ""
    echo "📱 Click the link above or copy it to your browser"
    echo ""
else
    echo "⚠️  Could not extract link automatically"
    echo ""
    echo "📋 Full output:"
    echo "$AUTH_OUTPUT"
    echo ""
fi

# Method 2: Show QR code
echo "═══════════════════════════════════════════════════════════"
echo "📱 METHOD 2: QR Code"
echo "═══════════════════════════════════════════════════════════"
echo ""

sudo tailscale up --qr 2>&1 | grep -v "^$" || {
    echo "⚠️  QR code generation failed"
    echo "   Run manually: sudo tailscale up --qr"
}

echo ""
echo "═══════════════════════════════════════════════════════════"
echo "⏳ After clicking the link, wait a few seconds..."
echo "   Then check status: tailscale status"
echo "═══════════════════════════════════════════════════════════"


