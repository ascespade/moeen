#!/usr/bin/env python3
import subprocess
import time

def test_ssh_connection():
    """اختبار الاتصال بـ SSH"""
    print("Testing SSH connection...")
    
    # اختبار الاتصال
    cmd = 'ssh -o ConnectTimeout=5 -o BatchMode=yes ubuntu@100.64.64.33 "echo SSH_SUCCESS"'
    
    try:
        result = subprocess.run(cmd, shell=True, capture_output=True, text=True, timeout=10)
        
        if result.returncode == 0:
            print("✅ SUCCESS: SSH connection without password works!")
            print(f"Response: {result.stdout.strip()}")
            return True
        else:
            print("❌ FAILED: SSH connection requires password")
            print(f"Error: {result.stderr.strip()}")
            return False
            
    except subprocess.TimeoutExpired:
        print("❌ TIMEOUT: Connection timed out")
        return False
    except Exception as e:
        print(f"❌ ERROR: {e}")
        return False

def test_tailscale_status():
    """اختبار حالة Tailscale"""
    print("\nTesting Tailscale status...")
    
    cmd = 'tailscale status'
    
    try:
        result = subprocess.run(cmd, shell=True, capture_output=True, text=True, timeout=5)
        
        if result.returncode == 0:
            print("✅ Tailscale is running locally")
            print("Status:")
            print(result.stdout)
            return True
        else:
            print("❌ Tailscale not running locally")
            return False
            
    except Exception as e:
        print(f"❌ Error checking Tailscale: {e}")
        return False

if __name__ == "__main__":
    print("🚀 Testing SSH and Tailscale setup...")
    
    ssh_ok = test_ssh_connection()
    tailscale_ok = test_tailscale_status()
    
    print("\n📊 Summary:")
    print(f"SSH without password: {'✅ YES' if ssh_ok else '❌ NO'}")
    print(f"Tailscale running: {'✅ YES' if tailscale_ok else '❌ NO'}")
    
    if ssh_ok and tailscale_ok:
        print("\n🎉 All tests passed! Setup is complete!")
    else:
        print("\n⚠️  Some tests failed. Manual setup may be needed.")
