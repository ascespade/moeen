#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""
خادم HTTP مخصص للداشبورد
Custom HTTP Server for Dashboard
"""

import http.server
import socketserver
import json
import os
from pathlib import Path

class DashboardHTTPHandler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        if self.path == '/api/dashboard-data':
            # جلب البيانات من ملف JSON
            data_file = "/home/ubuntu/moeen/dashboard_data.json"
            try:
                with open(data_file, 'r', encoding='utf-8') as f:
                    data = json.load(f)
                
                self.send_response(200)
                self.send_header('Content-type', 'application/json')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
                self.send_header('Access-Control-Allow-Headers', 'Content-Type')
                self.end_headers()
                
                self.wfile.write(json.dumps(data, ensure_ascii=False).encode('utf-8'))
            except Exception as e:
                self.send_response(500)
                self.send_header('Content-type', 'application/json')
                self.end_headers()
                error_data = {"error": str(e)}
                self.wfile.write(json.dumps(error_data).encode('utf-8'))
        else:
            # خدمة الملفات العادية
            super().do_GET()
    
    def log_message(self, format, *args):
        # إخفاء رسائل السجل العادية
        pass

def start_server(port=3000):
    """بدء الخادم"""
    try:
        with socketserver.TCPServer(("", port), DashboardHTTPHandler) as httpd:
            print(f"🌐 خادم الداشبورد يعمل على المنفذ {port}")
            print(f"📊 رابط الداشبورد: http://localhost:{port}/dashboard.html")
            print(f"📡 API البيانات: http://localhost:{port}/api/dashboard-data")
            httpd.serve_forever()
    except OSError as e:
        if e.errno == 98:  # Address already in use
            print(f"❌ المنفذ {port} مستخدم بالفعل")
            print("💡 جرب منفذ آخر أو أوقف العملية الحالية")
        else:
            print(f"❌ خطأ في بدء الخادم: {e}")

if __name__ == "__main__":
    import sys
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 3000
    start_server(port)
