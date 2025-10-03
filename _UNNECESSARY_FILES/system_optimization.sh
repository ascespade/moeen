#!/bin/bash

# سكريبت تحسين النظام للأداء الأمثل
echo "🚀 بدء تحسين النظام للأداء الأمثل..."

# 1. تحسين إعدادات النواة
echo "⚙️ تحسين إعدادات النواة..."

# تحسين إعدادات الذاكرة
echo 'vm.swappiness=10' | sudo tee -a /etc/sysctl.conf
echo 'vm.vfs_cache_pressure=50' | sudo tee -a /etc/sysctl.conf
echo 'vm.dirty_ratio=15' | sudo tee -a /etc/sysctl.conf
echo 'vm.dirty_background_ratio=5' | sudo tee -a /etc/sysctl.conf

# تحسين إعدادات الشبكة
echo 'net.core.rmem_max=16777216' | sudo tee -a /etc/sysctl.conf
echo 'net.core.wmem_max=16777216' | sudo tee -a /etc/sysctl.conf
echo 'net.ipv4.tcp_rmem=4096 87380 16777216' | sudo tee -a /etc/sysctl.conf
echo 'net.ipv4.tcp_wmem=4096 65536 16777216' | sudo tee -a /etc/sysctl.conf

# تحسين إعدادات الملفات
echo 'fs.file-max=2097152' | sudo tee -a /etc/sysctl.conf
echo 'fs.inotify.max_user_watches=524288' | sudo tee -a /etc/sysctl.conf

# تطبيق الإعدادات
sudo sysctl -p

# 2. تحسين إعدادات Python
echo "🐍 تحسين إعدادات Python..."

# إنشاء ملف إعدادات Python محسن
cat > ~/.pythonrc << 'EOF'
import os
import sys

# تحسين الأداء
os.environ['PYTHONOPTIMIZE'] = '1'
os.environ['PYTHONDONTWRITEBYTECODE'] = '1'

# تحسين الذاكرة
import gc
gc.set_threshold(700, 10, 10)

# تحسين الاستيراد
sys.dont_write_bytecode = True
EOF

# 3. تحسين إعدادات Git
echo "📦 تحسين إعدادات Git..."

# تحسين Git للأداء
git config --global core.preloadindex true
git config --global core.fscache true
git config --global gc.auto 256
git config --global pack.windowMemory 256m
git config --global pack.packSizeLimit 2g
git config --global pack.threads 4

# 4. تحسين إعدادات Node.js (إذا كان موجود)
echo "📦 تحسين إعدادات Node.js..."

# إنشاء ملف .npmrc محسن
cat > ~/.npmrc << 'EOF'
cache-max=1000000000
prefer-offline=true
audit=false
fund=false
EOF

# 5. تحسين إعدادات النظام
echo "🔧 تحسين إعدادات النظام..."

# تحسين أولوية العمليات
echo 'ubuntu soft nofile 65536' | sudo tee -a /etc/security/limits.conf
echo 'ubuntu hard nofile 65536' | sudo tee -a /etc/security/limits.conf

# تحسين إعدادات الذاكرة
echo 'vm.overcommit_memory=1' | sudo tee -a /etc/sysctl.conf

# 6. إنشاء ملف تحسين الأداء
cat > /home/ubuntu/moeen/performance_config.json << 'EOF'
{
  "system": {
    "cpu_cores": 4,
    "memory_gb": 15,
    "optimization_level": "maximum"
  },
  "cursor": {
    "parallel_workers": 4,
    "memory_limit": "8GB",
    "cpu_usage": "high"
  },
  "python": {
    "optimize": true,
    "bytecode_cache": true,
    "memory_optimization": true
  },
  "git": {
    "parallel": true,
    "compression": "high",
    "cache": true
  }
}
EOF

echo "✅ تم تحسين النظام بنجاح!"
echo "📊 إعدادات التحسين:"
echo "   - النوى: 4"
echo "   - الذاكرة: 15GB"
echo "   - مستوى التحسين: أقصى"
echo "   - العمال المتوازيين: 4"
