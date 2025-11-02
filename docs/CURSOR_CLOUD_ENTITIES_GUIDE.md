# 🎯 دليل التحكم في Cursor Cloud Entities والتواصل بينهم
## Guide to Controlling and Communicating Cursor Cloud Entities

---

## 📋 المحتويات / Table of Contents
1. [ما هي Cursor Cloud Entities؟](#ما-هي-cursor-cloud-entities)
2. [التحكم في Entities](#التحكم-في-entities)
3. [التواصل بين Entities](#التواصل-بين-entities)
4. [أمثلة عملية](#أمثلة-عملية)

---

## 🌟 ما هي Cursor Cloud Entities؟

**Cursor Cloud Entities** هي وكلاء خلفية (Background Agents) منفصلين يمكن تشغيلهم في Cursor Cloud بشكل متزامن. كل Entity هو وكيل مستقل يمكنه:

- العمل على مهام مختلفة في نفس الوقت
- الوصول إلى نفس المشروع
- التواصل مع Entities أخرى
- العمل بشكل متزامن أو متسلسل

### أنواع Entities الأربعة الرئيسية:

1. **🔧 Code Agent** - للبرمجة والإصلاحات
2. **📝 Documentation Agent** - للتوثيق
3. **🧪 Testing Agent** - للاختبارات
4. **🔍 Audit Agent** - للمراجعة والتدقيق

---

## 🎮 التحكم في Entities

### 1. إعداد Configuration لكل Entity

أنشئ ملف إعدادات منفصل لكل Entity:

#### `cursor_cloud_entities.json`
```json
{
  "entities": {
    "code_agent": {
      "id": "entity_001",
      "name": "Code Agent",
      "type": "code",
      "enabled": true,
      "config": {
        "focus": ["src/app", "src/components"],
        "tasks": ["fix_errors", "refactor", "optimize"],
        "auto_commit": false,
        "notify_on_complete": true
      },
      "communication": {
        "can_receive": ["entity_002", "entity_003", "entity_004"],
        "can_send": ["entity_002", "entity_003", "entity_004"],
        "priority": "high"
      }
    },
    "docs_agent": {
      "id": "entity_002",
      "name": "Documentation Agent",
      "type": "documentation",
      "enabled": true,
      "config": {
        "focus": ["docs", "README.md", "*.md"],
        "tasks": ["update_docs", "generate_docs", "validate_links"],
        "auto_commit": false,
        "notify_on_complete": true
      },
      "communication": {
        "can_receive": ["entity_001", "entity_003", "entity_004"],
        "can_send": ["entity_001", "entity_003", "entity_004"],
        "priority": "medium"
      }
    },
    "test_agent": {
      "id": "entity_003",
      "name": "Testing Agent",
      "type": "testing",
      "enabled": true,
      "config": {
        "focus": ["tests", "**/*.spec.ts", "**/*.test.ts"],
        "tasks": ["run_tests", "fix_tests", "write_tests"],
        "auto_commit": false,
        "notify_on_complete": true
      },
      "communication": {
        "can_receive": ["entity_001", "entity_002", "entity_004"],
        "can_send": ["entity_001", "entity_002", "entity_004"],
        "priority": "high"
      }
    },
    "audit_agent": {
      "id": "entity_004",
      "name": "Audit Agent",
      "type": "audit",
      "enabled": true,
      "config": {
        "focus": ["src", "*.config.*", "package.json"],
        "tasks": ["code_quality", "security_audit", "performance_check"],
        "auto_commit": false,
        "notify_on_complete": true
      },
      "communication": {
        "can_receive": ["entity_001", "entity_002", "entity_003"],
        "can_send": ["entity_001", "entity_002", "entity_003"],
        "priority": "medium"
      }
    }
  },
  "coordination": {
    "shared_workspace": true,
    "communication_channel": "workspace",
    "conflict_resolution": "priority_based",
    "log_directory": ".cursor_entities_logs"
  }
}
```

### 2. تشغيل Entities بشكل منفصل

#### طريقة 1: عبر Cursor UI
1. افتح Cursor Settings
2. اذهب إلى **Cursor Cloud** → **Background Agents**
3. شغّل كل Entity بشكل منفصل
4. استخدم **Entity Manager** للتحكم فيهم

#### طريقة 2: عبر Command Line

```bash
# تشغيل Code Agent
cursor-cloud entity start code_agent --config cursor_cloud_entities.json

# تشغيل Documentation Agent
cursor-cloud entity start docs_agent --config cursor_cloud_entities.json

# تشغيل Testing Agent
cursor-cloud entity start test_agent --config cursor_cloud_entities.json

# تشغيل Audit Agent
cursor-cloud entity start audit_agent --config cursor_cloud_entities.json

# تشغيل جميع Entities
cursor-cloud entity start all --config cursor_cloud_entities.json
```

#### طريقة 3: عبر Script

```bash
# تشغيل script لإدارة Entities
./scripts/manage_cursor_entities.sh
```

---

## 💬 التواصل بين Entities

### 1. نظام التواصل عبر Workspace

Entities يمكنها التواصل عبر:

#### أ) **Shared Workspace Files**
- كل Entity يقرأ/يكتب في ملفات مشتركة
- استخدام `entity_messages.json` كنقطة تواصل

#### ب) **Event System**
- Entities تبث أحداث (events) عند اكتمال المهام
- Entities أخرى تستمع لهذه الأحداث

#### ج) **Direct Communication**
- إرسال رسائل مباشرة بين Entities
- استخدام API calls بين Entities

### 2. ملف التواصل المشترك

أنشئ ملف `entity_messages.json` في مجلد `.cursor`:

```json
{
  "messages": [
    {
      "id": "msg_001",
      "from": "entity_001",
      "to": "entity_002",
      "type": "task_complete",
      "content": {
        "task": "fixed_type_errors",
        "files_modified": ["src/components/Button.tsx"],
        "status": "success",
        "next_steps": ["update_documentation"]
      },
      "timestamp": "2025-01-20T10:30:00Z",
      "read": false
    }
  ],
  "events": [
    {
      "id": "event_001",
      "source": "entity_001",
      "type": "code_refactored",
      "data": {
        "file": "src/utils/helpers.ts",
        "changes": "optimized_performance"
      },
      "timestamp": "2025-01-20T10:31:00Z",
      "subscribers": ["entity_002", "entity_003"]
    }
  ]
}
```

### 3. Script للتواصل بين Entities

```typescript
// scripts/entity_communication.ts

interface EntityMessage {
  from: string;
  to: string;
  type: 'task_complete' | 'request_help' | 'share_context' | 'notify';
  content: any;
}

class EntityCommunication {
  private messageFile = '.cursor/entity_messages.json';

  async sendMessage(message: EntityMessage): Promise<void> {
    const messages = await this.loadMessages();
    messages.messages.push({
      id: `msg_${Date.now()}`,
      ...message,
      timestamp: new Date().toISOString(),
      read: false
    });
    await this.saveMessages(messages);
  }

  async broadcastEvent(source: string, type: string, data: any, subscribers: string[]): Promise<void> {
    const messages = await this.loadMessages();
    messages.events.push({
      id: `event_${Date.now()}`,
      source,
      type,
      data,
      timestamp: new Date().toISOString(),
      subscribers
    });
    await this.saveMessages(messages);
  }

  async getMessagesForEntity(entityId: string): Promise<EntityMessage[]> {
    const messages = await this.loadMessages();
    return messages.messages.filter(
      msg => msg.to === entityId && !msg.read
    );
  }

  async markAsRead(messageId: string): Promise<void> {
    const messages = await this.loadMessages();
    const message = messages.messages.find(msg => msg.id === messageId);
    if (message) message.read = true;
    await this.saveMessages(messages);
  }

  private async loadMessages(): Promise<any> {
    // Load from file
  }

  private async saveMessages(messages: any): Promise<void> {
    // Save to file
  }
}
```

---

## 🔄 أمثلة عملية

### مثال 1: Code Agent يطلب مساعدة من Docs Agent

```typescript
// Code Agent completes refactoring
await communication.sendMessage({
  from: 'entity_001', // Code Agent
  to: 'entity_002',   // Docs Agent
  type: 'request_help',
  content: {
    task: 'update_docs',
    context: {
      file: 'src/components/Button.tsx',
      changes: 'Added new props: variant, size',
      docs_needed: ['API documentation', 'Usage examples']
    }
  }
});

// Docs Agent receives message and updates docs
```

### مثال 2: Test Agent يخبر Audit Agent عند فشل الاختبارات

```typescript
// Test Agent detects failures
await communication.broadcastEvent(
  'entity_003', // Test Agent
  'tests_failed',
  {
    failed_tests: ['Button.test.tsx', 'Modal.test.tsx'],
    errors: [...]
  },
  ['entity_004'] // Audit Agent subscribed
);

// Audit Agent receives event and starts investigation
```

### مثال 3: تنسيق العمل بين جميع Entities

```typescript
// Coordination workflow
async function coordinatedWorkflow() {
  // 1. Code Agent starts refactoring
  await entity001.startTask('refactor_component');
  
  // 2. When done, notify others
  await communication.broadcastEvent(
    'entity_001',
    'refactoring_complete',
    { component: 'Button.tsx' },
    ['entity_002', 'entity_003', 'entity_004']
  );
  
  // 3. Docs Agent updates documentation
  await entity002.startTask('update_docs', { component: 'Button.tsx' });
  
  // 4. Test Agent updates tests
  await entity003.startTask('update_tests', { component: 'Button.tsx' });
  
  // 5. Audit Agent verifies quality
  await entity004.startTask('audit_quality', { component: 'Button.tsx' });
}
```

---

## 📊 مراقبة Entities

### Dashboard Script

```bash
# عرض حالة جميع Entities
./scripts/entity_status.sh

# عرض رسائل Entity معين
./scripts/entity_messages.sh entity_001

# عرض سجل الأحداث
./scripts/entity_events.sh
```

---

## 🎯 أفضل الممارسات

1. **تجنب التعارضات**
   - استخدم priority system لتحديد من يكتب أولاً
   - قسم الملفات بين Entities حسب المسؤولية

2. **التواصل الفعال**
   - استخدم messages للتواصل المباشر
   - استخدم events للإشعارات العامة

3. **المراقبة المستمرة**
   - راجع logs بانتظام
   - راقب message queue

4. **التنسيق**
   - حدد dependencies بين المهام
   - استخدم workflow orchestration

---

## 📝 ملاحظات مهمة

✅ **نعم، يمكن التحكم في كل Entity بشكل منفصل**  
✅ **نعم، Entities يمكنها التواصل مع بعضها البعض**  
✅ **يجب إعداد نظام التواصل قبل التشغيل**  
✅ **استخدم ملفات JSON مشتركة أو API للتواصل**

---

## 🔗 روابط مفيدة

- [Cursor Cloud Documentation](https://cursor.sh/docs)
- [Background Agents Guide](https://cursor.sh/docs/background-agents)
- [Entity Management API](https://cursor.sh/api/entities)

---

**آخر تحديث:** 2025-01-20  
**النسخة:** 1.0.0
