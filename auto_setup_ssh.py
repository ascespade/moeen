#!/usr/bin/env python3
import subprocess
import time
import sys

def run_command(cmd, input_text=None):
    """تشغيل أمر مع إمكانية إدخال نص"""
    try:
        if input_text:
            result = subprocess.run(cmd, shell=True, input=input_text, 
                                  text=True, capture_output=True, timeout=30)
        else:
            result = subprocess.run(cmd, shell=True, capture_output=True, 
                                  text=True, timeout=30)
        return result.returncode, result.stdout, result.stderr
    except subprocess.TimeoutExpired:
        return -1, "", "Timeout"
    except Exception as e:
        return -1, "", str(e)

def main():
    print("🚀 بدء الإعداد الآلي لـ SSH و Tailscale...")
    
    # 1. قراءة المفتاح العام
    print("📋 قراءة المفتاح العام...")
    with open(r"C:\Users\WA Hotels\.ssh\id_rsa.pub", "r") as f:
        public_key = f.read().strip()
    
    print(f"✅ المفتاح العام: {public_key[:50]}...")
    
    # 2. إنشاء سكريبت للإعداد على الخادم
    setup_script = f"""#!/bin/bash
echo "🔧 إعداد SSH على الخادم..."
mkdir -p ~/.ssh
chmod 700 ~/.ssh
echo "{public_key}" >> ~/.ssh/authorized_keys
chmod 600 ~/.ssh/authorized_keys
echo "✅ تم إعداد SSH بنجاح!"

echo "🌐 إعداد Tailscale..."
sudo tailscale down
sudo tailscale up --accept-routes --accept-dns=false
sudo systemctl enable tailscaled
sudo systemctl start tailscaled
echo "✅ تم إعداد Tailscale بنجاح!"

echo "📊 حالة Tailscale:"
tailscale status
"""
    
    with open("server_setup.sh", "w") as f:
        f.write(setup_script)
    
    print("📤 نسخ سكريبت الإعداد إلى الخادم...")
    
    # 3. نسخ السكريبت إلى الخادم
    cmd = f'scp -o StrictHostKeyChecking=no server_setup.sh ubuntu@100.64.64.33:~/'
    returncode, stdout, stderr = run_command(cmd)
    
    if returncode != 0:
        print(f"❌ فشل في نسخ السكريبت: {stderr}")
        return False
    
    print("✅ تم نسخ السكريبت بنجاح!")
    
    # 4. تشغيل السكريبت على الخادم
    print("🔧 تشغيل سكريبت الإعداد على الخادم...")
    
    # استخدام expect لإدخال كلمة المرور
    expect_script = f"""
spawn ssh ubuntu@100.64.64.33 "bash ~/server_setup.sh"
expect "password:"
send "root\\r"
expect eof
"""
    
    with open("ssh_expect.exp", "w") as f:
        f.write(expect_script)
    
    cmd = "expect ssh_expect.exp"
    returncode, stdout, stderr = run_command(cmd)
    
    print("📤 مخرجات السكريبت:")
    print(stdout)
    if stderr:
        print("⚠️  تحذيرات:")
        print(stderr)
    
    # 5. اختبار الاتصال بدون كلمة مرور
    print("🧪 اختبار الاتصال بدون كلمة مرور...")
    cmd = "ssh -o ConnectTimeout=10 ubuntu@100.64.64.33 'echo \"SSH connection successful!\"'"
    returncode, stdout, stderr = run_command(cmd)
    
    if returncode == 0:
        print("🎉 نجح الاتصال بدون كلمة مرور!")
        print(f"📤 استجابة الخادم: {stdout}")
    else:
        print(f"❌ فشل الاتصال: {stderr}")
    
    # 6. تنظيف الملفات المؤقتة
    print("🧹 تنظيف الملفات المؤقتة...")
    run_command("del server_setup.sh ssh_expect.exp", shell=True)
    
    print("✅ تم إكمال الإعداد!")
    return returncode == 0

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)
