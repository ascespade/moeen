#!/usr/bin/env bash
#
# manage_cursor_entities.sh
# Script لإدارة Cursor Cloud Entities الأربعة
#

set -euo pipefail

CONFIG_FILE="cursor_cloud_entities.json"
MESSAGES_FILE=".cursor/entity_messages.json"
LOG_DIR=".cursor_entities_logs"
STATUS_FILE=".cursor/entity_status.json"

# إنشاء المجلدات الضرورية
mkdir -p "$LOG_DIR" ".cursor"

# ألوان للطباعة
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# وظائف مساعدة
print_header() {
    echo -e "${BLUE}╔══════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${BLUE}║${NC}  $1"
    echo -e "${BLUE}╚══════════════════════════════════════════════════════════════╝${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_info() {
    echo -e "${YELLOW}ℹ️  $1${NC}"
}

# التحقق من وجود ملف الإعدادات
check_config() {
    if [ ! -f "$CONFIG_FILE" ]; then
        print_error "ملف الإعدادات غير موجود: $CONFIG_FILE"
        print_info "أنشئ الملف باستخدام: create_entities_config.sh"
        exit 1
    fi
}

# إنشاء ملف الرسائل إذا لم يكن موجود
init_messages_file() {
    if [ ! -f "$MESSAGES_FILE" ]; then
        cat > "$MESSAGES_FILE" <<EOF
{
  "messages": [],
  "events": []
}
EOF
        print_success "تم إنشاء ملف الرسائل: $MESSAGES_FILE"
    fi
}

# تشغيل Entity معين
start_entity() {
    local entity_id=$1
    local entity_name=$2
    
    print_info "تشغيل $entity_name (ID: $entity_id)..."
    
    # محاكاة تشغيل Entity (استبدل بالأمر الفعلي لـ Cursor Cloud)
    if command -v cursor-cloud >/dev/null 2>&1; then
        cursor-cloud entity start "$entity_id" --config "$CONFIG_FILE" 2>&1 | tee "$LOG_DIR/${entity_id}_$(date +%Y%m%d_%H%M%S).log" || {
            print_error "فشل تشغيل $entity_name"
            return 1
        }
    else
        print_info "محاكاة تشغيل $entity_name..."
        echo "Entity $entity_id started at $(date)" >> "$LOG_DIR/${entity_id}_$(date +%Y%m%d_%H%M%S).log"
    fi
    
    print_success "تم تشغيل $entity_name"
}

# إيقاف Entity معين
stop_entity() {
    local entity_id=$1
    local entity_name=$2
    
    print_info "إيقاف $entity_name (ID: $entity_id)..."
    
    if command -v cursor-cloud >/dev/null 2>&1; then
        cursor-cloud entity stop "$entity_id" || {
            print_error "فشل إيقاف $entity_name"
            return 1
        }
    else
        print_info "محاكاة إيقاف $entity_name..."
    fi
    
    print_success "تم إيقاف $entity_name"
}

# عرض حالة Entity
status_entity() {
    local entity_id=$1
    local entity_name=$2
    
    print_info "حالة $entity_name (ID: $entity_id):"
    
    if [ -f "$STATUS_FILE" ]; then
        # قراءة حالة من الملف (يتطلب jq)
        if command -v jq >/dev/null 2>&1; then
            jq -r ".entities.$entity_id" "$STATUS_FILE" 2>/dev/null || echo "  غير متاح"
        else
            echo "  تحقق من: $STATUS_FILE"
        fi
    else
        echo "  حالة غير متاحة"
    fi
    
    # عرض آخر log
    local latest_log=$(ls -t "$LOG_DIR/${entity_id}_"*.log 2>/dev/null | head -1)
    if [ -n "$latest_log" ]; then
        echo "  آخر log: $latest_log"
    fi
}

# إرسال رسالة بين Entities
send_message() {
    local from=$1
    local to=$2
    local message_type=$3
    local content=$4
    
    print_info "إرسال رسالة من $from إلى $to..."
    
    # استخدام Python script لإدارة الرسائل (سيتم إنشاؤه لاحقاً)
    if [ -f "scripts/entity_communication.py" ]; then
        python3 scripts/entity_communication.py send \
            --from "$from" \
            --to "$to" \
            --type "$message_type" \
            --content "$content"
    else
        # إضافة رسالة يدوياً إلى JSON
        local temp_file=$(mktemp)
        if command -v jq >/dev/null 2>&1; then
            jq ".messages += [{
                \"id\": \"msg_$(date +%s)\",
                \"from\": \"$from\",
                \"to\": \"$to\",
                \"type\": \"$message_type\",
                \"content\": \"$content\",
                \"timestamp\": \"$(date -u +%Y-%m-%dT%H:%M:%SZ)\",
                \"read\": false
            }]" "$MESSAGES_FILE" > "$temp_file"
            mv "$temp_file" "$MESSAGES_FILE"
            print_success "تم إرسال الرسالة"
        else
            print_error "jq غير متوفر. يجب تثبيته لإدارة الرسائل."
        fi
    fi
}

# عرض الرسائل لـ Entity معين
show_messages() {
    local entity_id=$1
    
    print_info "الرسائل الموجهة إلى $entity_id:"
    
    if [ -f "$MESSAGES_FILE" ] && command -v jq >/dev/null 2>&1; then
        jq -r ".messages[] | select(.to == \"$entity_id\" and .read == false) | \"[\(.timestamp)] من \(.from): \(.type) - \(.content)\"" "$MESSAGES_FILE" 2>/dev/null || echo "  لا توجد رسائل جديدة"
    else
        echo "  استخدم jq لعرض الرسائل"
    fi
}

# تشغيل جميع Entities
start_all() {
    print_header "🚀 تشغيل جميع Cursor Cloud Entities"
    
    start_entity "entity_001" "Code Agent"
    start_entity "entity_002" "Documentation Agent"
    start_entity "entity_003" "Testing Agent"
    start_entity "entity_004" "Audit Agent"
    
    print_success "تم تشغيل جميع Entities"
}

# إيقاف جميع Entities
stop_all() {
    print_header "🛑 إيقاف جميع Cursor Cloud Entities"
    
    stop_entity "entity_001" "Code Agent"
    stop_entity "entity_002" "Documentation Agent"
    stop_entity "entity_003" "Testing Agent"
    stop_entity "entity_004" "Audit Agent"
    
    print_success "تم إيقاف جميع Entities"
}

# عرض حالة جميع Entities
status_all() {
    print_header "📊 حالة جميع Cursor Cloud Entities"
    
    status_entity "entity_001" "Code Agent"
    echo ""
    status_entity "entity_002" "Documentation Agent"
    echo ""
    status_entity "entity_003" "Testing Agent"
    echo ""
    status_entity "entity_004" "Audit Agent"
}

# القائمة الرئيسية
show_menu() {
    print_header "🎮 مدير Cursor Cloud Entities"
    
    echo "1) تشغيل جميع Entities"
    echo "2) إيقاف جميع Entities"
    echo "3) عرض حالة جميع Entities"
    echo "4) تشغيل Entity معين"
    echo "5) إيقاف Entity معين"
    echo "6) إرسال رسالة بين Entities"
    echo "7) عرض رسائل Entity"
    echo "8) خروج"
    echo ""
    read -p "اختر رقم: " choice
    
    case $choice in
        1) start_all ;;
        2) stop_all ;;
        3) status_all ;;
        4)
            echo "Entities المتاحة:"
            echo "  1) entity_001 - Code Agent"
            echo "  2) entity_002 - Documentation Agent"
            echo "  3) entity_003 - Testing Agent"
            echo "  4) entity_004 - Audit Agent"
            read -p "اختر رقم Entity: " entity_choice
            case $entity_choice in
                1) start_entity "entity_001" "Code Agent" ;;
                2) start_entity "entity_002" "Documentation Agent" ;;
                3) start_entity "entity_003" "Testing Agent" ;;
                4) start_entity "entity_004" "Audit Agent" ;;
                *) print_error "اختيار غير صحيح" ;;
            esac
            ;;
        5)
            echo "Entities المتاحة:"
            echo "  1) entity_001 - Code Agent"
            echo "  2) entity_002 - Documentation Agent"
            echo "  3) entity_003 - Testing Agent"
            echo "  4) entity_004 - Audit Agent"
            read -p "اختر رقم Entity: " entity_choice
            case $entity_choice in
                1) stop_entity "entity_001" "Code Agent" ;;
                2) stop_entity "entity_002" "Documentation Agent" ;;
                3) stop_entity "entity_003" "Testing Agent" ;;
                4) stop_entity "entity_004" "Audit Agent" ;;
                *) print_error "اختيار غير صحيح" ;;
            esac
            ;;
        6)
            read -p "من (entity ID): " from
            read -p "إلى (entity ID): " to
            read -p "نوع الرسالة: " msg_type
            read -p "المحتوى: " content
            send_message "$from" "$to" "$msg_type" "$content"
            ;;
        7)
            read -p "Entity ID: " entity_id
            show_messages "$entity_id"
            ;;
        8) exit 0 ;;
        *) print_error "اختيار غير صحيح" ;;
    esac
}

# Main
main() {
    check_config
    init_messages_file
    
    if [ $# -eq 0 ]; then
        # وضع تفاعلي
        while true; do
            show_menu
            echo ""
        done
    else
        # أوامر مباشرة
        case "$1" in
            start)
                if [ -z "${2:-}" ]; then
                    start_all
                else
                    case "$2" in
                        code) start_entity "entity_001" "Code Agent" ;;
                        docs) start_entity "entity_002" "Documentation Agent" ;;
                        test) start_entity "entity_003" "Testing Agent" ;;
                        audit) start_entity "entity_004" "Audit Agent" ;;
                        all) start_all ;;
                        *) print_error "Entity غير معروف: $2" ;;
                    esac
                fi
                ;;
            stop)
                if [ -z "${2:-}" ]; then
                    stop_all
                else
                    case "$2" in
                        code) stop_entity "entity_001" "Code Agent" ;;
                        docs) stop_entity "entity_002" "Documentation Agent" ;;
                        test) stop_entity "entity_003" "Testing Agent" ;;
                        audit) stop_entity "entity_004" "Audit Agent" ;;
                        all) stop_all ;;
                        *) print_error "Entity غير معروف: $2" ;;
                    esac
                fi
                ;;
            status)
                if [ -z "${2:-}" ]; then
                    status_all
                else
                    case "$2" in
                        code) status_entity "entity_001" "Code Agent" ;;
                        docs) status_entity "entity_002" "Documentation Agent" ;;
                        test) status_entity "entity_003" "Testing Agent" ;;
                        audit) status_entity "entity_004" "Audit Agent" ;;
                        all) status_all ;;
                        *) print_error "Entity غير معروف: $2" ;;
                    esac
                fi
                ;;
            send)
                send_message "${2:-entity_001}" "${3:-entity_002}" "${4:-notify}" "${5:-Test message}"
                ;;
            messages)
                show_messages "${2:-entity_001}"
                ;;
            *)
                echo "الاستخدام: $0 [start|stop|status|send|messages] [entity|from] [to] [type] [content]"
                echo ""
                echo "أمثلة:"
                echo "  $0 start all          # تشغيل جميع Entities"
                echo "  $0 start code         # تشغيل Code Agent"
                echo "  $0 status             # عرض حالة جميع Entities"
                echo "  $0 send entity_001 entity_002 notify 'Hello'"
                echo "  $0 messages entity_001"
                exit 1
                ;;
        esac
    fi
}

main "$@"
