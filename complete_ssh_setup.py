#!/usr/bin/env python3
import subprocess
import time
import sys

def run_ssh_command(command, password="root"):
    """تشغيل أمر SSH مع كلمة المرور"""
    try:
        # إنشاء سكريبت expect
        expect_script = f"""
spawn {command}
expect "password:"
send "{password}\\r"
expect eof
"""
        
        with open("temp_ssh.exp", "w") as f:
            f.write(expect_script)
        
        # تشغيل expect
        result = subprocess.run(["expect", "temp_ssh.exp"], 
                              capture_output=True, text=True, timeout=30)
        
        # تنظيف الملف المؤقت
        subprocess.run("del temp_ssh.exp", shell=True)
        
        return result.returncode == 0, result.stdout, result.stderr
        
    except Exception as e:
        return False, "", str(e)

def main():
    print("🔧 إكمال إعداد SSH بدون كلمة مرور...")
    
    # 1. الاتصال بالخادم وإعداد SSH
    print("📡 الاتصال بالخادم...")
    
    ssh_commands = [
        "mkdir -p ~/.ssh",
        "chmod 700 ~/.ssh", 
        "cat ~/my_public_key.txt >> ~/.ssh/authorized_keys",
        "chmod 600 ~/.ssh/authorized_keys",
        "rm ~/my_public_key.txt"
    ]
    
    for cmd in ssh_commands:
        print(f"🔧 تشغيل: {cmd}")
        full_cmd = f'ssh ubuntu@100.64.64.33 "{cmd}"'
        success, stdout, stderr = run_ssh_command(full_cmd)
        
        if success:
            print(f"✅ نجح: {cmd}")
        else:
            print(f"❌ فشل: {cmd} - {stderr}")
    
    # 2. إعداد Tailscale
    print("🌐 إعداد Tailscale...")
    
    tailscale_commands = [
        "sudo tailscale down",
        "sudo tailscale up --accept-routes --accept-dns=false",
        "sudo systemctl enable tailscaled",
        "sudo systemctl start tailscaled"
    ]
    
    for cmd in tailscale_commands:
        print(f"🔧 تشغيل: {cmd}")
        full_cmd = f'ssh ubuntu@100.64.64.33 "{cmd}"'
        success, stdout, stderr = run_ssh_command(full_cmd)
        
        if success:
            print(f"✅ نجح: {cmd}")
        else:
            print(f"❌ فشل: {cmd} - {stderr}")
    
    # 3. اختبار الاتصال بدون كلمة مرور
    print("🧪 اختبار الاتصال بدون كلمة مرور...")
    
    test_cmd = 'ssh -o ConnectTimeout=10 ubuntu@100.64.64.33 "echo SSH_SUCCESS"'
    success, stdout, stderr = run_ssh_command(test_cmd)
    
    if success and "SSH_SUCCESS" in stdout:
        print("🎉 نجح! SSH يعمل بدون كلمة مرور!")
        print("✅ يمكنك الآن الاتصال بـ: ssh ubuntu@100.64.64.33")
        print("✅ Tailscale يعمل في الخلفية")
    else:
        print("❌ فشل في الاختبار. قد تحتاج لإعداد يدوي.")
        print("تشغيل الاختبار اليدوي:")
        print("ssh ubuntu@100.64.64.33")
    
    return success

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)
