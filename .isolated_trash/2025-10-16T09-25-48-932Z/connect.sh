#!/bin/bash

# ================================
# 🚀 Enhanced Connection Script
# SSH + Tailscale + Docker Integration
# ================================

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
SSH_KEY_PATH="$HOME/.ssh/id_rsa"
SSH_CONFIG_PATH="$HOME/.ssh/config"
LOG_FILE="/tmp/connection.log"

# Functions
log() {
    echo "$(date '+%Y-%m-%d %H:%M:%S') - $1" | tee -a "$LOG_FILE"
}

print_header() {
    echo -e "${BLUE}================================${NC}"
    echo -e "${BLUE}🚀 Enhanced Connection Script${NC}"
    echo -e "${BLUE}================================${NC}"
}

print_help() {
    echo "الاستخدام: $0 [OPTIONS] [HOST]"
    echo ""
    echo "الخيارات:"
    echo "  -h, --help              عرض هذه المساعدة"
    echo "  -s, --ssh HOST          الاتصال عبر SSH"
    echo "  -t, --tailscale HOST    الاتصال عبر Tailscale"
    echo "  -d, --docker HOST       الاتصال عبر Docker"
    echo "  -l, --list              عرض الخوادم المتاحة"
    echo "  -k, --keygen            إنشاء مفاتيح SSH جديدة"
    echo "  -c, --copy-key HOST     نسخ المفتاح إلى خادم بعيد"
    echo "  --status                عرض حالة الاتصالات"
    echo ""
    echo "أمثلة:"
    echo "  $0 -s ubuntu@192.168.1.100"
    echo "  $0 -t prod-server"
    echo "  $0 -d docker-app"
    echo "  $0 -c ubuntu@192.168.1.100"
}

check_ssh_setup() {
    log "🔍 فحص إعداد SSH..."
    
    if [ ! -f "$SSH_KEY_PATH" ]; then
        log "❌ مفتاح SSH غير موجود"
        return 1
    fi
    
    if [ ! -f "$SSH_CONFIG_PATH" ]; then
        log "❌ ملف تكوين SSH غير موجود"
        return 1
    fi
    
    log "✅ إعداد SSH جاهز"
    return 0
}

generate_ssh_keys() {
    log "🔑 إنشاء مفاتيح SSH جديدة..."
    
    if [ -f "$SSH_KEY_PATH" ]; then
        echo -e "${YELLOW}⚠️  مفتاح SSH موجود بالفعل. هل تريد استبداله؟ (y/N)${NC}"
        read -r response
        if [[ ! "$response" =~ ^[Yy]$ ]]; then
            log "تم إلغاء العملية"
            return 0
        fi
    fi
    
    ssh-keygen -t rsa -b 4096 -f "$SSH_KEY_PATH" -N ""
    chmod 600 "$SSH_KEY_PATH"
    chmod 644 "$SSH_KEY_PATH.pub"
    
    # إنشاء authorized_keys
    cp "$SSH_KEY_PATH.pub" "$HOME/.ssh/authorized_keys"
    chmod 600 "$HOME/.ssh/authorized_keys"
    
    log "✅ تم إنشاء مفاتيح SSH بنجاح"
    echo -e "${GREEN}المفتاح العام:${NC}"
    cat "$SSH_KEY_PATH.pub"
}

copy_ssh_key() {
    local host="$1"
    if [ -z "$host" ]; then
        echo -e "${RED}❌ يجب تحديد الخادم البعيد${NC}"
        return 1
    fi
    
    log "📋 نسخ المفتاح إلى $host..."
    
    if ! check_ssh_setup; then
        return 1
    fi
    
    if ssh-copy-id -i "$SSH_KEY_PATH.pub" "$host"; then
        log "✅ تم نسخ المفتاح بنجاح إلى $host"
        echo -e "${GREEN}يمكنك الآن الاتصال بدون كلمة مرور: ssh $host${NC}"
    else
        log "❌ فشل في نسخ المفتاح إلى $host"
        return 1
    fi
}

connect_ssh() {
    local host="$1"
    if [ -z "$host" ]; then
        echo -e "${RED}❌ يجب تحديد الخادم البعيد${NC}"
        return 1
    fi
    
    log "🔗 الاتصال عبر SSH إلى $host..."
    
    if ! check_ssh_setup; then
        return 1
    fi
    
    ssh -o ConnectTimeout=10 "$host"
}

connect_tailscale() {
    local host="$1"
    if [ -z "$host" ]; then
        echo -e "${RED}❌ يجب تحديد خادم Tailscale${NC}"
        return 1
    fi
    
    log "🌐 الاتصال عبر Tailscale إلى $host..."
    
    # فحص حالة Tailscale
    if ! tailscale status >/dev/null 2>&1; then
        log "❌ Tailscale غير متصل"
        echo -e "${YELLOW}تشغيل Tailscale Guardian...${NC}"
        nohup ./tailscale-guardian-advanced.sh > /dev/null 2>&1 &
        sleep 5
    fi
    
    ssh "$host"
}

connect_docker() {
    local container="$1"
    if [ -z "$container" ]; then
        echo -e "${RED}❌ يجب تحديد اسم الحاوية${NC}"
        return 1
    fi
    
    log "🐳 الاتصال إلى حاوية Docker: $container..."
    
    # فحص وجود الحاوية
    if ! docker ps | grep -q "$container"; then
        log "❌ الحاوية $container غير موجودة أو غير نشطة"
        return 1
    fi
    
    docker exec -it "$container" /bin/bash
}

list_servers() {
    echo -e "${BLUE}📋 الخوادم المتاحة:${NC}"
    echo ""
    
    # خوادم SSH من ملف التكوين
    if [ -f "$SSH_CONFIG_PATH" ]; then
        echo -e "${GREEN}SSH Hosts:${NC}"
        grep "^Host " "$SSH_CONFIG_PATH" | grep -v "Host \*" | sed 's/Host /  /'
        echo ""
    fi
    
    # خوادم Tailscale
    if command -v tailscale >/dev/null 2>&1; then
        echo -e "${GREEN}Tailscale Hosts:${NC}"
        tailscale status 2>/dev/null | grep -E "^[a-zA-Z]" | awk '{print "  " $1}' || echo "  لا توجد خوادم متاحة"
        echo ""
    fi
    
    # حاويات Docker
    echo -e "${GREEN}Docker Containers:${NC}"
    docker ps --format "table {{.Names}}\t{{.Status}}" | tail -n +2 | sed 's/^/  /'
}

show_status() {
    echo -e "${BLUE}📊 حالة الاتصالات:${NC}"
    echo ""
    
    # حالة SSH
    echo -e "${GREEN}SSH:${NC}"
    if [ -f "$SSH_KEY_PATH" ]; then
        echo -e "  ✅ مفتاح SSH موجود"
    else
        echo -e "  ❌ مفتاح SSH غير موجود"
    fi
    
    # حالة Tailscale
    echo -e "${GREEN}Tailscale:${NC}"
    if tailscale status >/dev/null 2>&1; then
        echo -e "  ✅ متصل"
        tailscale status | head -5
    else
        echo -e "  ❌ غير متصل"
    fi
    
    # حالة Docker
    echo -e "${GREEN}Docker:${NC}"
    if docker ps >/dev/null 2>&1; then
        echo -e "  ✅ نشط"
        echo -e "  📦 $(docker ps -q | wc -l) حاوية نشطة"
    else
        echo -e "  ❌ غير متاح"
    fi
}

# Main script
main() {
    print_header
    
    case "$1" in
        -h|--help)
            print_help
            ;;
        -k|--keygen)
            generate_ssh_keys
            ;;
        -s|--ssh)
            connect_ssh "$2"
            ;;
        -t|--tailscale)
            connect_tailscale "$2"
            ;;
        -d|--docker)
            connect_docker "$2"
            ;;
        -c|--copy-key)
            copy_ssh_key "$2"
            ;;
        -l|--list)
            list_servers
            ;;
        --status)
            show_status
            ;;
        "")
            print_help
            ;;
        *)
            # محاولة الاتصال مباشرة
            connect_ssh "$1"
            ;;
    esac
}

# تشغيل السكريبت
main "$@"
