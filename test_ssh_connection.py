#!/usr/bin/env python3
import subprocess
import sys

def test_ssh_connection():
    """اختبار الاتصال SSH بدون كلمة مرور"""
    print("🧪 Testing SSH connection without password...")
    
    try:
        # اختبار الاتصال
        result = subprocess.run(
            ["ssh", "-o", "ConnectTimeout=10", "-o", "BatchMode=yes", 
             "ubuntu@100.64.64.33", "echo SSH_SUCCESS"],
            capture_output=True, text=True, timeout=15
        )
        
        if result.returncode == 0 and "SSH_SUCCESS" in result.stdout:
            print("✅ SUCCESS: SSH connection works without password!")
            print("🎉 You can now connect with: ssh ubuntu@100.64.64.33")
            return True
        else:
            print("❌ FAILED: SSH still requires password")
            print(f"Error: {result.stderr}")
            return False
            
    except subprocess.TimeoutExpired:
        print("❌ TIMEOUT: Connection timed out")
        return False
    except Exception as e:
        print(f"❌ ERROR: {e}")
        return False

def test_tailscale():
    """اختبار حالة Tailscale"""
    print("\n🌐 Testing Tailscale status...")
    
    try:
        result = subprocess.run(
            ["tailscale", "status"],
            capture_output=True, text=True, timeout=10
        )
        
        if result.returncode == 0:
            print("✅ Tailscale is running locally")
            if "100.64.64.33" in result.stdout:
                print("✅ Server is visible in Tailscale network")
            else:
                print("⚠️  Server not visible in Tailscale network")
            print(f"Status:\n{result.stdout}")
            return True
        else:
            print("❌ Tailscale is not running locally")
            return False
            
    except Exception as e:
        print(f"❌ ERROR testing Tailscale: {e}")
        return False

def main():
    print("🔍 SSH and Tailscale Connection Test")
    print("=" * 40)
    
    ssh_ok = test_ssh_connection()
    tailscale_ok = test_tailscale()
    
    print("\n📊 Test Results:")
    print(f"SSH without password: {'✅ YES' if ssh_ok else '❌ NO'}")
    print(f"Tailscale running: {'✅ YES' if tailscale_ok else '❌ NO'}")
    
    if ssh_ok and tailscale_ok:
        print("\n🎉 All tests passed! Setup is complete!")
        print("You can now:")
        print("- Connect without password: ssh ubuntu@100.64.64.33")
        print("- Tailscale runs in background")
        print("- No password needed when closing Cursor")
        return True
    else:
        print("\n⚠️  Some tests failed. Manual setup may be needed.")
        print("Follow the instructions in simple_ssh_setup.ps1")
        return False

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)
