#!/bin/bash

# تحسين سرعة Cursor والكتابة
echo "⚡ تحسين سرعة Cursor والكتابة..."

# 1. تحسين إعدادات النظام للكتابة السريعة
echo "🚀 تحسين إعدادات النظام..."

# تحسين I/O للأقراص
echo 'vm.dirty_ratio=5' | sudo tee -a /etc/sysctl.conf
echo 'vm.dirty_background_ratio=2' | sudo tee -a /etc/sysctl.conf
echo 'vm.dirty_expire_centisecs=3000' | sudo tee -a /etc/sysctl.conf
echo 'vm.dirty_writeback_centisecs=500' | sudo tee -a /etc/sysctl.conf

# تحسين الذاكرة المؤقتة
echo 'vm.vfs_cache_pressure=50' | sudo tee -a /etc/sysctl.conf
echo 'vm.swappiness=1' | sudo tee -a /etc/sysctl.conf

# تحسين الملفات المفتوحة
echo 'fs.file-max=2097152' | sudo tee -a /etc/sysctl.conf
echo 'fs.inotify.max_user_watches=1048576' | sudo tee -a /etc/sysctl.conf
echo 'fs.inotify.max_user_instances=8192' | sudo tee -a /etc/sysctl.conf

# 2. تحسين إعدادات Python للكتابة السريعة
echo "🐍 تحسين Python للكتابة السريعة..."

# إنشاء ملف تحسين Python
cat > ~/.python_speed_config.py << 'EOF'
import os
import sys
import io

# تحسين الأداء العام
os.environ['PYTHONOPTIMIZE'] = '2'
os.environ['PYTHONDONTWRITEBYTECODE'] = '1'
os.environ['PYTHONUNBUFFERED'] = '1'

# تحسين الكتابة
sys.stdout = io.TextIOWrapper(io.BufferedWriter(io.FileIO(1, 'wb')), line_buffering=False)
sys.stderr = io.TextIOWrapper(io.BufferedWriter(io.FileIO(2, 'wb')), line_buffering=False)

# تحسين الذاكرة
import gc
gc.set_threshold(1000, 15, 15)

# تحسين الاستيراد
sys.dont_write_bytecode = True
EOF

# 3. تحسين إعدادات Git للكتابة السريعة
echo "📦 تحسين Git للكتابة السريعة..."

git config --global core.preloadindex true
git config --global core.fscache true
git config --global core.untrackedCache true
git config --global core.autoCRLF false
git config --global core.autocrlf false
git config --global core.safecrlf false
git config --global core.filemode false
git config --global core.symlinks false

# تحسين الأداء
git config --global pack.windowMemory 512m
git config --global pack.packSizeLimit 4g
git config --global pack.threads 4
git config --global gc.auto 0
git config --global gc.autodetach false

# 4. إنشاء ملف تحسين الكتابة
cat > /home/ubuntu/moeen/write_optimization.py << 'EOF'
#!/usr/bin/env python3
"""
تحسين سرعة الكتابة والعمليات
Write Speed Optimization
"""

import os
import sys
import time
import threading
from concurrent.futures import ThreadPoolExecutor
import asyncio
import aiofiles

class FastWriter:
    def __init__(self):
        self.buffer_size = 65536  # 64KB buffer
        self.max_workers = 4
        
    def write_file_fast(self, file_path, content):
        """كتابة سريعة للملف"""
        try:
            with open(file_path, 'w', encoding='utf-8', buffering=self.buffer_size) as f:
                f.write(content)
            return True
        except Exception as e:
            print(f"خطأ في الكتابة: {e}")
            return False
    
    def write_multiple_files(self, files_data):
        """كتابة متعددة الملفات بالتوازي"""
        with ThreadPoolExecutor(max_workers=self.max_workers) as executor:
            futures = []
            for file_path, content in files_data.items():
                future = executor.submit(self.write_file_fast, file_path, content)
                futures.append(future)
            
            results = [future.result() for future in futures]
            return all(results)
    
    async def async_write_file(self, file_path, content):
        """كتابة غير متزامنة"""
        try:
            async with aiofiles.open(file_path, 'w', encoding='utf-8') as f:
                await f.write(content)
            return True
        except Exception as e:
            print(f"خطأ في الكتابة غير المتزامنة: {e}")
            return False

# تحسين إعدادات النظام
def optimize_system():
    """تحسين إعدادات النظام للكتابة السريعة"""
    # تحسين buffer size
    os.environ['PYTHONIOENCODING'] = 'utf-8'
    os.environ['PYTHONUNBUFFERED'] = '1'
    
    # تحسين threading
    import threading
    threading.stack_size(65536)  # 64KB stack

if __name__ == "__main__":
    optimize_system()
    print("✅ تم تحسين إعدادات الكتابة السريعة")
EOF

# 5. إنشاء سكريبت تحسين العمليات
cat > /home/ubuntu/moeen/batch_operations.py << 'EOF'
#!/usr/bin/env python3
"""
عمليات مجمعة للكتابة السريعة
Batch Operations for Fast Writing
"""

import os
import sys
import time
from pathlib import Path
import json

class BatchWriter:
    def __init__(self):
        self.operations = []
        self.batch_size = 10
        
    def add_operation(self, operation_type, file_path, content=None, data=None):
        """إضافة عملية للدفعة"""
        self.operations.append({
            'type': operation_type,
            'file_path': file_path,
            'content': content,
            'data': data,
            'timestamp': time.time()
        })
    
    def execute_batch(self):
        """تنفيذ جميع العمليات في دفعة واحدة"""
        results = []
        
        for operation in self.operations:
            try:
                if operation['type'] == 'write':
                    with open(operation['file_path'], 'w', encoding='utf-8') as f:
                        f.write(operation['content'])
                    results.append(True)
                    
                elif operation['type'] == 'json_write':
                    with open(operation['file_path'], 'w', encoding='utf-8') as f:
                        json.dump(operation['data'], f, ensure_ascii=False, indent=2)
                    results.append(True)
                    
                elif operation['type'] == 'create_dir':
                    Path(operation['file_path']).mkdir(parents=True, exist_ok=True)
                    results.append(True)
                    
            except Exception as e:
                print(f"خطأ في العملية: {e}")
                results.append(False)
        
        # مسح العمليات المنجزة
        self.operations.clear()
        return all(results)

# استخدام المثال
if __name__ == "__main__":
    writer = BatchWriter()
    
    # إضافة عمليات متعددة
    writer.add_operation('write', 'test1.txt', 'محتوى الملف الأول')
    writer.add_operation('write', 'test2.txt', 'محتوى الملف الثاني')
    writer.add_operation('create_dir', 'test_dir')
    
    # تنفيذ جميع العمليات
    success = writer.execute_batch()
    print(f"نتيجة التنفيذ: {'نجح' if success else 'فشل'}")
EOF

# 6. تحسين إعدادات Cursor
echo "🎯 تحسين إعدادات Cursor..."

# إنشاء ملف إعدادات Cursor محسن
mkdir -p ~/.cursor
cat > ~/.cursor/settings.json << 'EOF'
{
  "editor.autoSave": "afterDelay",
  "editor.autoSaveDelay": 100,
  "editor.formatOnSave": false,
  "editor.formatOnType": false,
  "editor.formatOnPaste": false,
  "editor.suggestOnTriggerCharacters": false,
  "editor.acceptSuggestionOnEnter": "off",
  "editor.quickSuggestions": false,
  "editor.parameterHints.enabled": false,
  "editor.hover.delay": 1000,
  "editor.minimap.enabled": false,
  "editor.renderWhitespace": "none",
  "editor.renderControlCharacters": false,
  "editor.cursorBlinking": "solid",
  "editor.cursorSmoothCaretAnimation": false,
  "editor.smoothScrolling": false,
  "editor.cursorSmoothCaretAnimation": false,
  "workbench.enableExperiments": false,
  "workbench.settings.enableNaturalLanguageSearch": false,
  "extensions.autoUpdate": false,
  "telemetry.telemetryLevel": "off",
  "update.mode": "manual",
  "files.watcherExclude": {
    "**/.git/objects/**": true,
    "**/.git/subtree-cache/**": true,
    "**/node_modules/**": true,
    "**/tmp/**": true
  },
  "files.exclude": {
    "**/.git": true,
    "**/.svn": true,
    "**/.hg": true,
    "**/CVS": true,
    "**/.DS_Store": true,
    "**/Thumbs.db": true
  },
  "search.exclude": {
    "**/node_modules": true,
    "**/bower_components": true,
    "**/.git": true,
    "**/tmp": true
  }
}
EOF

# 7. تحسين إعدادات النظام
echo "🔧 تحسين إعدادات النظام النهائية..."

# تحسين أولوية العمليات
echo 'ubuntu soft nofile 1048576' | sudo tee -a /etc/security/limits.conf
echo 'ubuntu hard nofile 1048576' | sudo tee -a /etc/security/limits.conf

# تحسين الذاكرة
echo 'vm.overcommit_memory=1' | sudo tee -a /etc/sysctl.conf
echo 'vm.overcommit_ratio=50' | sudo tee -a /etc/sysctl.conf

# تطبيق جميع الإعدادات
sudo sysctl -p

echo "✅ تم تحسين سرعة الكتابة والتنفيذ!"
echo "📊 التحسينات المطبقة:"
echo "   - تحسين I/O للأقراص"
echo "   - تحسين الذاكرة المؤقتة"
echo "   - تحسين Python للكتابة السريعة"
echo "   - تحسين Git للأداء"
echo "   - إعدادات Cursor محسنة"
echo "   - عمليات مجمعة للكتابة"
