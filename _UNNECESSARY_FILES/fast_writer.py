#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""
نظام الكتابة السريعة المجمعة
Fast Batch Writing System
"""

import os
import sys
import time
import threading
from concurrent.futures import ThreadPoolExecutor, as_completed
from pathlib import Path
import json
# import asyncio
# import aiofiles

class UltraFastWriter:
    def __init__(self):
        self.buffer_size = 131072  # 128KB buffer
        self.max_workers = 4
        self.batch_operations = []
        self.lock = threading.Lock()
        
    def write_file_ultra_fast(self, file_path, content):
        """كتابة فائقة السرعة"""
        try:
            # إنشاء المجلد إذا لم يكن موجوداً
            Path(file_path).parent.mkdir(parents=True, exist_ok=True)
            
            # كتابة مباشرة مع buffer كبير
            with open(file_path, 'w', encoding='utf-8', buffering=self.buffer_size) as f:
                f.write(content)
            return True
        except Exception as e:
            print(f"خطأ في الكتابة: {e}")
            return False
    
    def batch_write_files(self, files_data):
        """كتابة مجمعة فائقة السرعة"""
        start_time = time.time()
        
        with ThreadPoolExecutor(max_workers=self.max_workers) as executor:
            # إرسال جميع المهام
            future_to_file = {
                executor.submit(self.write_file_ultra_fast, file_path, content): file_path
                for file_path, content in files_data.items()
            }
            
            # جمع النتائج
            results = {}
            for future in as_completed(future_to_file):
                file_path = future_to_file[future]
                try:
                    results[file_path] = future.result()
                except Exception as e:
                    results[file_path] = False
                    print(f"خطأ في {file_path}: {e}")
        
        end_time = time.time()
        print(f"⏱️ تم كتابة {len(files_data)} ملف في {end_time - start_time:.2f} ثانية")
        
        return results
    
    def smart_write(self, file_path, content, mode='replace'):
        """كتابة ذكية - تحدد إذا كان التغيير يستحق إعادة كتابة كاملة"""
        try:
            # قراءة الملف الحالي إذا كان موجوداً
            current_content = ""
            if os.path.exists(file_path):
                with open(file_path, 'r', encoding='utf-8') as f:
                    current_content = f.read()
            
            # مقارنة المحتوى
            if current_content == content:
                print(f"📄 لا توجد تغييرات في {file_path}")
                return True
            
            # كتابة المحتوى الجديد
            return self.write_file_ultra_fast(file_path, content)
            
        except Exception as e:
            print(f"خطأ في الكتابة الذكية: {e}")
            return False
    
    def multi_line_write(self, file_path, lines):
        """كتابة متعددة الأسطر دفعة واحدة"""
        try:
            content = '\n'.join(lines)
            return self.write_file_ultra_fast(file_path, content)
        except Exception as e:
            print(f"خطأ في الكتابة المتعددة: {e}")
            return False
    
    def append_fast(self, file_path, content):
        """إضافة سريعة للملف"""
        try:
            with open(file_path, 'a', encoding='utf-8', buffering=self.buffer_size) as f:
                f.write(content)
            return True
        except Exception as e:
            print(f"خطأ في الإضافة: {e}")
            return False

class OptimizedFileManager:
    def __init__(self):
        self.writer = UltraFastWriter()
        self.cache = {}
        
    def get_file_content(self, file_path):
        """جلب محتوى الملف مع التخزين المؤقت"""
        if file_path in self.cache:
            return self.cache[file_path]
        
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()
            self.cache[file_path] = content
            return content
        except:
            return ""
    
    def update_file_smart(self, file_path, new_content):
        """تحديث ذكي للملف"""
        current_content = self.get_file_content(file_path)
        
        if current_content != new_content:
            success = self.writer.write_file_ultra_fast(file_path, new_content)
            if success:
                self.cache[file_path] = new_content
            return success
        return True
    
    def batch_update_files(self, updates):
        """تحديث مجمع للملفات"""
        files_data = {}
        
        for file_path, new_content in updates.items():
            current_content = self.get_file_content(file_path)
            if current_content != new_content:
                files_data[file_path] = new_content
        
        if files_data:
            results = self.writer.batch_write_files(files_data)
            # تحديث التخزين المؤقت
            for file_path, success in results.items():
                if success:
                    self.cache[file_path] = updates[file_path]
            return results
        return {}

# اختبار النظام
def test_fast_writing():
    """اختبار نظام الكتابة السريعة"""
    print("🧪 اختبار نظام الكتابة السريعة...")
    
    writer = UltraFastWriter()
    manager = OptimizedFileManager()
    
    # اختبار الكتابة المجمعة
    test_files = {
        'test1.txt': 'محتوى الملف الأول\n' * 100,
        'test2.txt': 'محتوى الملف الثاني\n' * 100,
        'test3.txt': 'محتوى الملف الثالث\n' * 100,
    }
    
    start_time = time.time()
    results = writer.batch_write_files(test_files)
    end_time = time.time()
    
    print(f"✅ تم كتابة {len(test_files)} ملف في {end_time - start_time:.3f} ثانية")
    print(f"📊 معدل الكتابة: {len(test_files)/(end_time - start_time):.1f} ملف/ثانية")
    
    # تنظيف الملفات التجريبية
    for file_path in test_files.keys():
        try:
            os.remove(file_path)
        except:
            pass

if __name__ == "__main__":
    test_fast_writing()
