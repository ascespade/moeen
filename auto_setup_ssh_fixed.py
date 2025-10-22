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
    print("Starting automatic SSH and Tailscale setup...")
    
    # 1. قراءة المفتاح العام
    print("Reading public key...")
    with open(r"C:\Users\WA Hotels\.ssh\id_rsa.pub", "r") as f:
        public_key = f.read().strip()
    
    print(f"Public key: {public_key[:50]}...")
    
    # 2. إنشاء سكريبت للإعداد على الخادم
    setup_script = f"""#!/bin/bash
echo "Setting up SSH on server..."
mkdir -p ~/.ssh
chmod 700 ~/.ssh
echo "{public_key}" >> ~/.ssh/authorized_keys
chmod 600 ~/.ssh/authorized_keys
echo "SSH setup completed!"

echo "Setting up Tailscale..."
sudo tailscale down
sudo tailscale up --accept-routes --accept-dns=false
sudo systemctl enable tailscaled
sudo systemctl start tailscaled
echo "Tailscale setup completed!"

echo "Tailscale status:"
tailscale status
"""
    
    with open("server_setup.sh", "w", encoding='utf-8') as f:
        f.write(setup_script)
    
    print("Copying setup script to server...")
    
    # 3. نسخ السكريبت إلى الخادم
    cmd = f'scp -o StrictHostKeyChecking=no server_setup.sh ubuntu@100.64.64.33:~/'
    returncode, stdout, stderr = run_command(cmd)
    
    if returncode != 0:
        print(f"Failed to copy script: {stderr}")
        return False
    
    print("Script copied successfully!")
    
    # 4. تشغيل السكريبت على الخادم باستخدام sshpass
    print("Running setup script on server...")
    
    # محاولة استخدام sshpass
    cmd = 'sshpass -p "root" ssh -o StrictHostKeyChecking=no ubuntu@100.64.64.33 "bash ~/server_setup.sh"'
    returncode, stdout, stderr = run_command(cmd)
    
    if returncode != 0:
        print("sshpass not available, trying manual method...")
        print("Please run these commands manually:")
        print("1. ssh ubuntu@100.64.64.33")
        print("2. Password: root")
        print("3. Run: bash ~/server_setup.sh")
        return False
    
    print("Setup script output:")
    print(stdout)
    if stderr:
        print("Warnings:")
        print(stderr)
    
    # 5. اختبار الاتصال بدون كلمة مرور
    print("Testing connection without password...")
    cmd = "ssh -o ConnectTimeout=10 ubuntu@100.64.64.33 'echo \"SSH connection successful!\"'"
    returncode, stdout, stderr = run_command(cmd)
    
    if returncode == 0:
        print("SUCCESS: Connected without password!")
        print(f"Server response: {stdout}")
    else:
        print(f"Connection failed: {stderr}")
    
    # 6. تنظيف الملفات المؤقتة
    print("Cleaning up temporary files...")
    run_command("del server_setup.sh", shell=True)
    
    print("Setup completed!")
    return returncode == 0

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)
