#!/bin/bash

# سكريبت مراقبة موارد الخادم
# Server Resources Monitoring Script

# ألوان للعرض
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# دالة لطباعة العنوان
print_header() {
    echo -e "${BLUE}========================================${NC}"
    echo -e "${BLUE}    مراقب موارد الخادم - Server Monitor${NC}"
    echo -e "${BLUE}========================================${NC}"
    echo ""
}

# دالة لمراقبة استخدام المعالج
monitor_cpu() {
    echo -e "${YELLOW}📊 استخدام المعالج (CPU Usage):${NC}"
    echo "----------------------------------------"
    
    # استخدام المعالج الحالي
    cpu_usage=$(top -bn1 | grep "Cpu(s)" | awk '{print $2}' | awk -F'%' '{print $1}')
    echo -e "الاستخدام الحالي: ${GREEN}${cpu_usage}%${NC}"
    
    # متوسط الاستخدام
    load_avg=$(uptime | awk -F'load average:' '{print $2}')
    echo -e "متوسط التحميل: ${GREEN}${load_avg}${NC}"
    
    # أعلى العمليات استخداماً للمعالج
    echo -e "\n${YELLOW}أعلى 5 عمليات استخداماً للمعالج:${NC}"
    ps aux --sort=-%cpu | head -6 | awk '{printf "%-8s %-8s %-8s %-8s %s\n", $1, $2, $3"%", $4"%", $11}' | column -t
    echo ""
}

# دالة لمراقبة الذاكرة
monitor_memory() {
    echo -e "${YELLOW}💾 استخدام الذاكرة (Memory Usage):${NC}"
    echo "----------------------------------------"
    
    # معلومات الذاكرة
    memory_info=$(free -h)
    echo "$memory_info"
    
    # نسبة الاستخدام
    memory_usage=$(free | grep Mem | awk '{printf "%.1f", $3/$2 * 100.0}')
    echo -e "\nنسبة الاستخدام: ${GREEN}${memory_usage}%${NC}"
    
    # أعلى العمليات استخداماً للذاكرة
    echo -e "\n${YELLOW}أعلى 5 عمليات استخداماً للذاكرة:${NC}"
    ps aux --sort=-%mem | head -6 | awk '{printf "%-8s %-8s %-8s %-8s %s\n", $1, $2, $3"%", $4"%", $11}' | column -t
    echo ""
}

# دالة لمراقبة القرص
monitor_disk() {
    echo -e "${YELLOW}💿 استخدام القرص (Disk Usage):${NC}"
    echo "----------------------------------------"
    
    # استخدام القرص
    df -h | grep -E '^/dev/'
    
    # أكبر المجلدات
    echo -e "\n${YELLOW}أكبر 10 مجلدات في النظام:${NC}"
    du -h / 2>/dev/null | sort -hr | head -10
    echo ""
}

# دالة لمراقبة الشبكة
monitor_network() {
    echo -e "${YELLOW}🌐 نشاط الشبكة (Network Activity):${NC}"
    echo "----------------------------------------"
    
    # إحصائيات الشبكة
    if [ -f /proc/net/dev ]; then
        echo "إحصائيات واجهات الشبكة:"
        cat /proc/net/dev | grep -E 'eth0|wlan0|lo' | head -5
    fi
    
    # الاتصالات النشطة
    echo -e "\n${YELLOW}الاتصالات النشطة:${NC}"
    netstat -tuln | head -10
    echo ""
}

# دالة لمراقبة العمليات
monitor_processes() {
    echo -e "${YELLOW}⚙️ العمليات النشطة (Active Processes):${NC}"
    echo "----------------------------------------"
    
    # عدد العمليات
    total_processes=$(ps aux | wc -l)
    running_processes=$(ps aux | grep -c " R ")
    echo -e "إجمالي العمليات: ${GREEN}${total_processes}${NC}"
    echo -e "العمليات النشطة: ${GREEN}${running_processes}${NC}"
    
    # العمليات التي تستهلك أكثر الموارد
    echo -e "\n${YELLOW}العمليات الأكثر استهلاكاً للموارد:${NC}"
    ps aux --sort=-%cpu | head -10 | awk '{printf "%-8s %-8s %-8s %-8s %-15s %s\n", $1, $2, $3"%", $4"%", $9, $11}' | column -t
    echo ""
}

# دالة لمراقبة النظام
monitor_system() {
    echo -e "${YELLOW}🖥️ معلومات النظام (System Info):${NC}"
    echo "----------------------------------------"
    
    # معلومات النظام
    echo -e "اسم المضيف: ${GREEN}$(hostname)${NC}"
    echo -e "نظام التشغيل: ${GREEN}$(uname -s)${NC}"
    echo -e "إصدار النواة: ${GREEN}$(uname -r)${NC}"
    echo -e "وقت التشغيل: ${GREEN}$(uptime -p)${NC}"
    echo -e "المستخدمون المتصلون: ${GREEN}$(who | wc -l)${NC}"
    echo ""
}

# دالة للتحقق من الإنذارات
check_alerts() {
    echo -e "${YELLOW}⚠️ تحقق من الإنذارات (Alerts Check):${NC}"
    echo "----------------------------------------"
    
    # تحقق من استخدام المعالج
    cpu_usage=$(top -bn1 | grep "Cpu(s)" | awk '{print $2}' | awk -F'%' '{print $1}')
    if (( $(echo "$cpu_usage > 80" | bc -l) )); then
        echo -e "${RED}تحذير: استخدام المعالج عالي (${cpu_usage}%)${NC}"
    else
        echo -e "${GREEN}استخدام المعالج طبيعي (${cpu_usage}%)${NC}"
    fi
    
    # تحقق من استخدام الذاكرة
    memory_usage=$(free | grep Mem | awk '{printf "%.1f", $3/$2 * 100.0}')
    if (( $(echo "$memory_usage > 80" | bc -l) )); then
        echo -e "${RED}تحذير: استخدام الذاكرة عالي (${memory_usage}%)${NC}"
    else
        echo -e "${GREEN}استخدام الذاكرة طبيعي (${memory_usage}%)${NC}"
    fi
    
    # تحقق من مساحة القرص
    disk_usage=$(df / | tail -1 | awk '{print $5}' | sed 's/%//')
    if [ "$disk_usage" -gt 80 ]; then
        echo -e "${RED}تحذير: استخدام القرص عالي (${disk_usage}%)${NC}"
    else
        echo -e "${GREEN}استخدام القرص طبيعي (${disk_usage}%)${NC}"
    fi
    echo ""
}

# دالة لعرض المساعدة
show_help() {
    echo "استخدام سكريبت مراقبة الموارد:"
    echo "  ./monitor_resources.sh        - عرض جميع المعلومات"
    echo "  ./monitor_resources.sh cpu    - مراقبة المعالج فقط"
    echo "  ./monitor_resources.sh mem    - مراقبة الذاكرة فقط"
    echo "  ./monitor_resources.sh disk   - مراقبة القرص فقط"
    echo "  ./monitor_resources.sh net    - مراقبة الشبكة فقط"
    echo "  ./monitor_resources.sh watch  - مراقبة مستمرة (كل 5 ثوان)"
    echo "  ./monitor_resources.sh help   - عرض هذه المساعدة"
}

# دالة للمراقبة المستمرة
continuous_monitor() {
    echo -e "${BLUE}بدء المراقبة المستمرة... اضغط Ctrl+C للإيقاف${NC}"
    while true; do
        clear
        print_header
        monitor_cpu
        monitor_memory
        check_alerts
        echo -e "${BLUE}التحديث التالي خلال 5 ثوان...${NC}"
        sleep 5
    done
}

# الدالة الرئيسية
main() {
    case "${1:-all}" in
        "cpu")
            print_header
            monitor_cpu
            ;;
        "mem")
            print_header
            monitor_memory
            ;;
        "disk")
            print_header
            monitor_disk
            ;;
        "net")
            print_header
            monitor_network
            ;;
        "watch")
            continuous_monitor
            ;;
        "help")
            show_help
            ;;
        *)
            print_header
            monitor_system
            monitor_cpu
            monitor_memory
            monitor_disk
            monitor_network
            monitor_processes
            check_alerts
            ;;
    esac
}

# تشغيل السكريبت
main "$@"
