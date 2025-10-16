#!/bin/bash

# ================================
# 🚀 Quick Connect Script
# ================================

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${BLUE}🚀 Quick Connect - اختر نوع الاتصال:${NC}"
echo ""
echo "1) SSH إلى خادم بعيد"
echo "2) Tailscale"
echo "3) Docker Container"
echo "4) إعداد SSH جديد"
echo "5) عرض حالة النظام"
echo "6) خروج"
echo ""

read -p "اختر رقم (1-6): " choice

case $choice in
    1)
        echo -e "${GREEN}📡 SSH Connection${NC}"
        read -p "أدخل عنوان الخادم (مثال: ubuntu@192.168.1.100): " host
        ./connect.sh --ssh "$host"
        ;;
    2)
        echo -e "${GREEN}🌐 Tailscale Connection${NC}"
        echo "الخوادم المتاحة:"
        tailscale status | grep -E "^[a-zA-Z]" | awk '{print NR") " $1}'
        read -p "أدخل اسم الخادم: " host
        ./connect.sh --tailscale "$host"
        ;;
    3)
        echo -e "${GREEN}🐳 Docker Connection${NC}"
        echo "الحاويات المتاحة:"
        docker ps --format "table {{.Names}}\t{{.Status}}" | tail -n +2 | awk '{print NR") " $1}'
        read -p "أدخل اسم الحاوية: " container
        ./connect.sh --docker "$container"
        ;;
    4)
        echo -e "${GREEN}🔑 SSH Setup${NC}"
        ./connect.sh --keygen
        echo ""
        read -p "هل تريد نسخ المفتاح إلى خادم بعيد؟ (y/N): " copy_choice
        if [[ "$copy_choice" =~ ^[Yy]$ ]]; then
            read -p "أدخل عنوان الخادم: " host
            ./connect.sh --copy-key "$host"
        fi
        ;;
    5)
        ./connect.sh --status
        ;;
    6)
        echo -e "${YELLOW}👋 وداعاً!${NC}"
        exit 0
        ;;
    *)
        echo -e "${YELLOW}❌ خيار غير صحيح${NC}"
        exit 1
        ;;
esac
