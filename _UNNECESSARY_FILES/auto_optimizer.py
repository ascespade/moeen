#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""
نظام التحسين التلقائي للأداء
Auto Performance Optimizer
"""

import os
import sys
import time
import psutil
import threading
from pathlib import Path
import json

class AutoOptimizer:
    def __init__(self):
        self.cpu_cores = psutil.cpu_count()
        self.memory_gb = psutil.virtual_memory().total // (1024**3)
        self.optimization_level = "maximum"
        self.monitoring = True
        
    def optimize_system(self):
        """تحسين النظام تلقائياً"""
        print("🚀 بدء التحسين التلقائي...")
        
        # تحسين إعدادات Python
        self.optimize_python()
        
        # تحسين الذاكرة
        self.optimize_memory()
        
        # تحسين I/O
        self.optimize_io()
        
        # تحسين الشبكة
        self.optimize_network()
        
        print("✅ تم التحسين التلقائي بنجاح!")
    
    def optimize_python(self):
        """تحسين Python للأداء الأمثل"""
        print("🐍 تحسين Python...")
        
        # إعدادات البيئة
        os.environ['PYTHONOPTIMIZE'] = '2'
        os.environ['PYTHONDONTWRITEBYTECODE'] = '1'
        os.environ['PYTHONUNBUFFERED'] = '1'
        os.environ['PYTHONIOENCODING'] = 'utf-8'
        
        # تحسين الذاكرة
        import gc
        gc.set_threshold(1000, 15, 15)
        
        # تحسين الاستيراد
        sys.dont_write_bytecode = True
        
        print("✅ تم تحسين Python")
    
    def optimize_memory(self):
        """تحسين استخدام الذاكرة"""
        print("🧠 تحسين الذاكرة...")
        
        # تحسين garbage collection
        import gc
        gc.set_threshold(700, 10, 10)
        
        # تحسين الذاكرة المؤقتة
        if hasattr(sys, 'set_int_max_str_digits'):
            sys.set_int_max_str_digits(0)
        
        print("✅ تم تحسين الذاكرة")
    
    def optimize_io(self):
        """تحسين عمليات الإدخال/الإخراج"""
        print("💾 تحسين I/O...")
        
        # تحسين buffer size
        self.buffer_size = min(131072, self.memory_gb * 1024 * 1024 // 100)
        
        # تحسين threading
        import threading
        threading.stack_size(65536)
        
        print("✅ تم تحسين I/O")
    
    def optimize_network(self):
        """تحسين الشبكة"""
        print("🌐 تحسين الشبكة...")
        
        # تحسين TCP settings
        try:
            import socket
            socket.setdefaulttimeout(30)
        except:
            pass
        
        print("✅ تم تحسين الشبكة")
    
    def monitor_performance(self):
        """مراقبة الأداء"""
        while self.monitoring:
            try:
                # معلومات النظام
                cpu_percent = psutil.cpu_percent(interval=1)
                memory = psutil.virtual_memory()
                disk = psutil.disk_usage('/')
                
                # طباعة الإحصائيات
                print(f"📊 الأداء: CPU: {cpu_percent}% | RAM: {memory.percent}% | Disk: {disk.percent}%")
                
                # تحسين تلقائي إذا كان الأداء منخفض
                if cpu_percent > 80 or memory.percent > 85:
                    print("⚠️ أداء منخفض - تطبيق تحسينات...")
                    self.optimize_system()
                
                time.sleep(30)  # فحص كل 30 ثانية
                
            except KeyboardInterrupt:
                break
            except Exception as e:
                print(f"خطأ في المراقبة: {e}")
                time.sleep(5)
    
    def start_monitoring(self):
        """بدء مراقبة الأداء في خيط منفصل"""
        monitor_thread = threading.Thread(target=self.monitor_performance, daemon=True)
        monitor_thread.start()
        print("👁️ بدء مراقبة الأداء...")
    
    def stop_monitoring(self):
        """إيقاف المراقبة"""
        self.monitoring = False
        print("🛑 تم إيقاف المراقبة")

# تحسين فوري للنظام
def apply_immediate_optimizations():
    """تطبيق تحسينات فورية"""
    print("⚡ تطبيق تحسينات فورية...")
    
    # تحسين إعدادات النظام
    os.environ['PYTHONOPTIMIZE'] = '2'
    os.environ['PYTHONDONTWRITEBYTECODE'] = '1'
    os.environ['PYTHONUNBUFFERED'] = '1'
    
    # تحسين الذاكرة
    import gc
    gc.set_threshold(1000, 15, 15)
    
    # تحسين الاستيراد
    sys.dont_write_bytecode = True
    
    print("✅ تم تطبيق التحسينات الفورية")

if __name__ == "__main__":
    # تطبيق التحسينات الفورية
    apply_immediate_optimizations()
    
    # إنشاء محسن تلقائي
    optimizer = AutoOptimizer()
    
    # تحسين النظام
    optimizer.optimize_system()
    
    # بدء المراقبة
    optimizer.start_monitoring()
    
    print("🎯 النظام محسن ومجهز للأداء الأمثل!")
    print("📊 المراقبة التلقائية نشطة...")
    
    try:
        # إبقاء البرنامج يعمل
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        optimizer.stop_monitoring()
        print("👋 تم إيقاف النظام")
