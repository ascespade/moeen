#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""
API Server لجلب بيانات الداشبورد
Dashboard Data API Server
"""

import json
import os
import subprocess
import time
from datetime import datetime, timedelta
from pathlib import Path
import re

class DashboardDataCollector:
    def __init__(self):
        self.project_path = "/home/ubuntu/moeen/mu3een"
        self.data_file = "/home/ubuntu/moeen/dashboard_data.json"
        
    def get_file_count(self):
        """عدد الملفات في المشروع"""
        try:
            result = subprocess.run(['find', self.project_path, '-type', 'f'], 
                                  capture_output=True, text=True)
            return len(result.stdout.strip().split('\n')) if result.stdout.strip() else 0
        except:
            return 0
    
    def get_code_lines(self):
        """عدد أسطر الكود"""
        try:
            # عد أسطر الكود في ملفات Python, JavaScript, TypeScript, HTML, CSS
            extensions = ['*.py', '*.js', '*.ts', '*.tsx', '*.jsx', '*.html', '*.css']
            total_lines = 0
            
            for ext in extensions:
                result = subprocess.run(['find', self.project_path, '-name', ext], 
                                      capture_output=True, text=True)
                if result.stdout.strip():
                    files = result.stdout.strip().split('\n')
                    for file in files:
                        try:
                            with open(file, 'r', encoding='utf-8') as f:
                                lines = len(f.readlines())
                                total_lines += lines
                        except:
                            continue
            
            return total_lines
        except:
            return 0
    
    def get_git_commits(self):
        """عدد الـ commits"""
        try:
            os.chdir(self.project_path)
            result = subprocess.run(['git', 'rev-list', '--count', 'HEAD'], 
                                  capture_output=True, text=True)
            return int(result.stdout.strip()) if result.stdout.strip() else 0
        except:
            return 0
    
    def get_recent_commits(self, days=7):
        """الـ commits الأخيرة"""
        try:
            os.chdir(self.project_path)
            result = subprocess.run(['git', 'log', '--oneline', f'--since={days} days ago'], 
                                  capture_output=True, text=True)
            commits = result.stdout.strip().split('\n') if result.stdout.strip() else []
            return len(commits)
        except:
            return 0
    
    def get_git_activity(self):
        """نشاط Git الأخير"""
        try:
            os.chdir(self.project_path)
            result = subprocess.run(['git', 'log', '--pretty=format:%h|%s|%an|%ar', '-10'], 
                                  capture_output=True, text=True)
            
            activities = []
            if result.stdout.strip():
                for line in result.stdout.strip().split('\n'):
                    parts = line.split('|')
                    if len(parts) >= 4:
                        activities.append({
                            'hash': parts[0],
                            'message': parts[1],
                            'author': parts[2],
                            'time': parts[3]
                        })
            
            return activities
        except:
            return []
    
    def calculate_work_hours(self):
        """حساب ساعات العمل (تقديري)"""
        try:
            # حساب بناءً على عدد الـ commits والنشاط
            commits = self.get_recent_commits(30)  # آخر 30 يوم
            hours_per_commit = 2  # تقدير ساعتين لكل commit
            return commits * hours_per_commit
        except:
            return 0
    
    def get_project_progress(self):
        """تقدم المشروع (تقديري بناءً على الملفات والكود)"""
        try:
            # حساب بناءً على عدد الملفات وأسطر الكود
            files = self.get_file_count()
            lines = self.get_code_lines()
            
            # تقدير التقدم بناءً على حجم المشروع
            if files > 50 and lines > 5000:
                return 80
            elif files > 30 and lines > 3000:
                return 60
            elif files > 20 and lines > 2000:
                return 40
            elif files > 10 and lines > 1000:
                return 25
            else:
                return 15
        except:
            return 0
    
    def get_daily_progress(self):
        """تقدم يومي للآخر 7 أيام"""
        try:
            daily_data = []
            for i in range(6, -1, -1):
                date = datetime.now() - timedelta(days=i)
                date_str = date.strftime('%Y-%m-%d')
                
                # حساب الـ commits في هذا اليوم
                os.chdir(self.project_path)
                result = subprocess.run(['git', 'log', '--oneline', f'--since={date_str}', f'--until={date_str} 23:59:59'], 
                                      capture_output=True, text=True)
                commits_count = len(result.stdout.strip().split('\n')) if result.stdout.strip() else 0
                
                daily_data.append({
                    'date': date.strftime('%Y-%m-%d'),
                    'completed': commits_count,
                    'formatted_date': date.strftime('%d/%m')
                })
            
            return daily_data
        except:
            return []
    
    def get_tasks_distribution(self):
        """توزيع المهام"""
        try:
            # تقدير بناءً على نوع الملفات
            frontend_files = 0
            backend_files = 0
            config_files = 0
            
            for ext in ['*.html', '*.css', '*.js', '*.tsx', '*.jsx']:
                result = subprocess.run(['find', self.project_path, '-name', ext], 
                                      capture_output=True, text=True)
                if result.stdout.strip():
                    frontend_files += len(result.stdout.strip().split('\n'))
            
            for ext in ['*.py', '*.ts']:
                result = subprocess.run(['find', self.project_path, '-name', ext], 
                                      capture_output=True, text=True)
                if result.stdout.strip():
                    backend_files += len(result.stdout.strip().split('\n'))
            
            total_files = frontend_files + backend_files + config_files
            
            if total_files > 0:
                return {
                    'completed': int((frontend_files / total_files) * 100),
                    'inProgress': int((backend_files / total_files) * 100),
                    'pending': 100 - int((frontend_files / total_files) * 100) - int((backend_files / total_files) * 100)
                }
            else:
                return {'completed': 0, 'inProgress': 0, 'pending': 100}
        except:
            return {'completed': 0, 'inProgress': 0, 'pending': 100}
    
    def get_recent_activity(self):
        """النشاط الأخير"""
        try:
            activities = []
            git_activity = self.get_git_activity()
            
            for i, activity in enumerate(git_activity[:5]):
                activities.append({
                    'icon': '💻' if 'add' in activity['message'].lower() else '🔧' if 'fix' in activity['message'].lower() else '📝',
                    'title': activity['message'],
                    'time': activity['time'],
                    'status': 'success'
                })
            
            return activities
        except:
            return []
    
    def collect_all_data(self):
        """جمع جميع البيانات"""
        try:
            data = {
                'totalFiles': self.get_file_count(),
                'codeLines': self.get_code_lines(),
                'completedTasks': self.get_recent_commits(7),  # مهام مكتملة في آخر أسبوع
                'workHours': self.calculate_work_hours(),
                'commits': self.get_git_commits(),
                'progress': self.get_project_progress(),
                'dailyProgress': self.get_daily_progress(),
                'tasksDistribution': self.get_tasks_distribution(),
                'recentActivity': self.get_recent_activity(),
                'projectProgress': {
                    'frontend': min(100, self.get_file_count() * 2),
                    'backend': min(100, self.get_code_lines() // 100),
                    'database': min(100, self.get_git_commits() * 3),
                    'testing': min(100, self.get_recent_commits(7) * 5)
                },
                'lastUpdate': datetime.now().isoformat()
            }
            
            # حفظ البيانات في ملف
            with open(self.data_file, 'w', encoding='utf-8') as f:
                json.dump(data, f, ensure_ascii=False, indent=2)
            
            return data
        except Exception as e:
            print(f"خطأ في جمع البيانات: {e}")
            return {}

def create_simple_server():
    """إنشاء خادم بسيط لخدمة البيانات"""
    from http.server import HTTPServer, BaseHTTPRequestHandler
    import json
    
    class DashboardHandler(BaseHTTPRequestHandler):
        def do_GET(self):
            if self.path == '/api/dashboard-data':
                collector = DashboardDataCollector()
                data = collector.collect_all_data()
                
                self.send_response(200)
                self.send_header('Content-type', 'application/json')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                
                self.wfile.write(json.dumps(data, ensure_ascii=False).encode('utf-8'))
            else:
                self.send_response(404)
                self.end_headers()
        
        def log_message(self, format, *args):
            pass  # إخفاء رسائل السجل
    
    return DashboardHandler

if __name__ == "__main__":
    # اختبار جمع البيانات
    collector = DashboardDataCollector()
    data = collector.collect_all_data()
    print("📊 بيانات الداشبورد:")
    print(json.dumps(data, ensure_ascii=False, indent=2))
