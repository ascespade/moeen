#!/usr/bin/env python3
"""
entity_communication.py
نظام التواصل بين Cursor Cloud Entities
"""

import json
import sys
import os
from datetime import datetime
from pathlib import Path
from typing import Dict, List, Optional

MESSAGES_FILE = Path(".cursor/entity_messages.json")
MESSAGES_FILE.parent.mkdir(exist_ok=True)


def load_messages() -> Dict:
    """تحميل الرسائل من الملف"""
    if MESSAGES_FILE.exists():
        with open(MESSAGES_FILE, "r", encoding="utf-8") as f:
            return json.load(f)
    return {"messages": [], "events": []}


def save_messages(data: Dict):
    """حفظ الرسائل إلى الملف"""
    with open(MESSAGES_FILE, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)


def send_message(from_entity: str, to_entity: str, msg_type: str, content: str):
    """إرسال رسالة بين Entities"""
    data = load_messages()
    
    message = {
        "id": f"msg_{int(datetime.now().timestamp() * 1000)}",
        "from": from_entity,
        "to": to_entity,
        "type": msg_type,
        "content": content if isinstance(content, dict) else {"text": content},
        "timestamp": datetime.utcnow().isoformat() + "Z",
        "read": False
    }
    
    data["messages"].append(message)
    save_messages(data)
    
    print(f"✅ تم إرسال رسالة من {from_entity} إلى {to_entity}")
    print(f"   النوع: {msg_type}")
    print(f"   المحتوى: {content}")


def broadcast_event(source: str, event_type: str, event_data: Dict, subscribers: List[str]):
    """بث حدث لجميع المشتركين"""
    data = load_messages()
    
    event = {
        "id": f"event_{int(datetime.now().timestamp() * 1000)}",
        "source": source,
        "type": event_type,
        "data": event_data,
        "timestamp": datetime.utcnow().isoformat() + "Z",
        "subscribers": subscribers
    }
    
    data["events"].append(event)
    save_messages(data)
    
    print(f"✅ تم بث حدث '{event_type}' من {source}")
    print(f"   المشتركون: {', '.join(subscribers)}")


def get_messages(entity_id: str, unread_only: bool = True) -> List[Dict]:
    """الحصول على الرسائل الموجهة لـ Entity"""
    data = load_messages()
    
    messages = [
        msg for msg in data["messages"]
        if msg["to"] == entity_id and (not unread_only or not msg["read"])
    ]
    
    return messages


def mark_as_read(message_id: str):
    """تحديد رسالة كمقروءة"""
    data = load_messages()
    
    for message in data["messages"]:
        if message["id"] == message_id:
            message["read"] = True
            break
    
    save_messages(data)
    print(f"✅ تم تحديد الرسالة {message_id} كمقروءة")


def list_events(entity_id: Optional[str] = None) -> List[Dict]:
    """عرض الأحداث (لـ Entity معين أو جميع الأحداث)"""
    data = load_messages()
    
    if entity_id:
        events = [
            event for event in data["events"]
            if entity_id in event.get("subscribers", [])
        ]
    else:
        events = data["events"]
    
    return events


def show_messages_for_entity(entity_id: str):
    """عرض جميع الرسائل الموجهة لـ Entity"""
    messages = get_messages(entity_id, unread_only=False)
    
    if not messages:
        print(f"❌ لا توجد رسائل لـ {entity_id}")
        return
    
    print(f"\n📬 الرسائل الموجهة إلى {entity_id}:")
    print("=" * 60)
    
    for msg in messages:
        status = "✅ مقروء" if msg["read"] else "🆕 غير مقروء"
        print(f"\n[{msg['timestamp']}] {status}")
        print(f"من: {msg['from']}")
        print(f"النوع: {msg['type']}")
        print(f"المحتوى: {msg['content']}")
        print("-" * 60)


def main():
    if len(sys.argv) < 2:
        print("الاستخدام:")
        print("  python3 entity_communication.py send --from ENTITY --to ENTITY --type TYPE --content CONTENT")
        print("  python3 entity_communication.py broadcast --source ENTITY --type TYPE --data DATA --subscribers ENTITY1,ENTITY2")
        print("  python3 entity_communication.py messages ENTITY_ID")
        print("  python3 entity_communication.py events [ENTITY_ID]")
        print("  python3 entity_communication.py mark-read MESSAGE_ID")
        sys.exit(1)
    
    command = sys.argv[1]
    
    if command == "send":
        # Parse arguments
        args = sys.argv[2:]
        from_entity = None
        to_entity = None
        msg_type = None
        content = None
        
        i = 0
        while i < len(args):
            if args[i] == "--from" and i + 1 < len(args):
                from_entity = args[i + 1]
                i += 2
            elif args[i] == "--to" and i + 1 < len(args):
                to_entity = args[i + 1]
                i += 2
            elif args[i] == "--type" and i + 1 < len(args):
                msg_type = args[i + 1]
                i += 2
            elif args[i] == "--content" and i + 1 < len(args):
                content = args[i + 1]
                i += 2
            else:
                i += 1
        
        if not all([from_entity, to_entity, msg_type, content]):
            print("❌ يجب توفير: --from, --to, --type, --content")
            sys.exit(1)
        
        send_message(from_entity, to_entity, msg_type, content)
    
    elif command == "broadcast":
        # Parse arguments for broadcast
        args = sys.argv[2:]
        source = None
        event_type = None
        event_data = {}
        subscribers = []
        
        i = 0
        while i < len(args):
            if args[i] == "--source" and i + 1 < len(args):
                source = args[i + 1]
                i += 2
            elif args[i] == "--type" and i + 1 < len(args):
                event_type = args[i + 1]
                i += 2
            elif args[i] == "--data" and i + 1 < len(args):
                try:
                    event_data = json.loads(args[i + 1])
                except:
                    event_data = {"text": args[i + 1]}
                i += 2
            elif args[i] == "--subscribers" and i + 1 < len(args):
                subscribers = args[i + 1].split(",")
                i += 2
            else:
                i += 1
        
        if not all([source, event_type, subscribers]):
            print("❌ يجب توفير: --source, --type, --subscribers")
            sys.exit(1)
        
        broadcast_event(source, event_type, event_data, subscribers)
    
    elif command == "messages":
        if len(sys.argv) < 3:
            print("❌ يجب توفير Entity ID")
            sys.exit(1)
        
        entity_id = sys.argv[2]
        show_messages_for_entity(entity_id)
    
    elif command == "events":
        entity_id = sys.argv[2] if len(sys.argv) > 2 else None
        events = list_events(entity_id)
        
        if not events:
            print("❌ لا توجد أحداث")
            return
        
        print(f"\n📡 الأحداث{' لـ ' + entity_id if entity_id else ''}:")
        print("=" * 60)
        
        for event in events:
            print(f"\n[{event['timestamp']}]")
            print(f"المصدر: {event['source']}")
            print(f"النوع: {event['type']}")
            print(f"البيانات: {json.dumps(event['data'], ensure_ascii=False, indent=2)}")
            print(f"المشتركون: {', '.join(event['subscribers'])}")
            print("-" * 60)
    
    elif command == "mark-read":
        if len(sys.argv) < 3:
            print("❌ يجب توفير Message ID")
            sys.exit(1)
        
        message_id = sys.argv[2]
        mark_as_read(message_id)
    
    else:
        print(f"❌ أمر غير معروف: {command}")
        sys.exit(1)


if __name__ == "__main__":
    main()
